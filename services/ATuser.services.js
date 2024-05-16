const jwt = require('jsonwebtoken');
const _commonUtil = require('../util/ATcommon.util');
const _constantUtil = require('../util/ATcontant.util');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const {  STATUS_200, BOOLEAN_TRUE, SIGN_IN_SUCCESS, SIGN_UP_SUCCESS, SIGN_UP_FAILED } = _constantUtil;

async function signUpService(req, res) {
    try {
        const { phone, password, email, name } = req.body;

        const newUser = await prisma.user.create({ 
            data: {
                phone,
                name,
                password,
                email: email || ''
            } 
        });

        // * create json web token
        const jwtToken = jwt.sign({
            userId: newUser.userId,
            phone
        }, process.env.AUTH_SALT);

        // * api data
        const data = {
            token: jwtToken,
            userId: newUser.userId,
            phone
        }

        // * api response
        if (newUser)
            return _commonUtil.getJSONResponse(res, BOOLEAN_TRUE, STATUS_200, SIGN_UP_SUCCESS, data);
        _commonUtil.getJSONResponse(res, BOOLEAN_TRUE, STATUS_200, SIGN_UP_FAILED, {});
    } 
    catch (error) {
        _commonUtil.handleUserError(req.originalUrl, error, res, {});
    }
}

async function importContactService(req, res) {
    try {
        const { userId } = req.user;
        const { contacts } = req.body;

        contacts.forEach(item => {
            item.userId = userId;
        });

        const newUser = await prisma.contact.createMany({ 
            data: contacts
        });

        if (newUser)
            return _commonUtil.getJSONResponse(res, BOOLEAN_TRUE, STATUS_200, 'Contact has been imported.', {});
        _commonUtil.getJSONResponse(res, BOOLEAN_TRUE, STATUS_200, 'Contact has not been imported.', {});
    } 
    catch (error) {
        _commonUtil.handleUserError(req.originalUrl, error, res, {});
    }
}

async function signInService(req, res) {
    try {
        const { phone } = req.body;

        const user = await prisma.user.findUnique({
            where: { phone },
            select: { userId: BOOLEAN_TRUE }
        });

        // * create json web token
        const jwtToken = jwt.sign({
            userId: user.userId,
            phone
        }, process.env.AUTH_SALT);

        // * api data
        const data = {
            token: jwtToken,
            userId: user.userId,
            phone
        }

        // * api response
        _commonUtil.getJSONResponse(res, BOOLEAN_TRUE, STATUS_200, SIGN_IN_SUCCESS, data);
    } 
    catch (error) {
        _commonUtil.handleUserError(req.originalUrl, error, res, {});
    }
} 

module.exports = {
    signUpService,
    importContactService,
    signInService
}