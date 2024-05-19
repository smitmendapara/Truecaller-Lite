const jwt = require('jsonwebtoken');
const _commonUtil = require('../util/ATcommon.util');
const _constantUtil = require('../util/ATcontant.util');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { 
    STATUS_200, BOOLEAN_TRUE, SIGN_IN_SUCCESS, SIGN_UP_SUCCESS, SIGN_UP_FAILED, ASC_ORDER, DATA_FETCHED,
    REQUESTED_RECORD, ONE, EMPTY_STRING, ZERO, CONTACT_IMPORTED, CONTACT_NOT_IMPORTED, BOOLEAN_FALSE,
    DATA_NOT_FOUND
} = _constantUtil;

async function signUpService(req, res) {
    try {
        const { phone, password, email, name } = req.body;

        // * already spam count details
        const spamCount = await prisma.spam.count({ where: { phone }});

        // * register new user
        const newUser = await prisma.user.create({ 
            data: {
                phone,
                name,
                password,
                email: email || EMPTY_STRING,
                spamCount
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
        _commonUtil.getJSONResponse(res, BOOLEAN_FALSE, STATUS_200, SIGN_UP_FAILED, {});
    } 
    catch (error) {
        _commonUtil.handleUserError(req.originalUrl, error, res, {});
    }
}

async function signInService(req, res) {
    try {
        const { phone } = req.body;

        // * user details
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

async function importContactService(req, res) {
    try {
        const { userId } = req.user;
        const { contacts } = req.body;

        // * collect all the phone number
        const phoneNumbers = contacts.map(contact => contact.phone);

        // * import contact spam details
        const spamCounts = await prisma.spam.groupBy({
            by: ['phone'],
            _count: BOOLEAN_TRUE,
            where: {
                phone: {
                    in: phoneNumbers,
                },
            },
        });

        const spamCountsDict = spamCounts.reduce((acc, spam) => {
            acc[spam.phone] = spam._count;
            return acc;
          }, {});

        contacts.forEach(contact => {
            contact.userId = userId;
            contact.spamCount = spamCountsDict[contact.phone] || ZERO;
        });

        // * import all contact
        const importContact = await prisma.contact.createMany({ 
            data: contacts
        });

        if (importContact)
            return _commonUtil.getJSONResponse(res, BOOLEAN_TRUE, STATUS_200, CONTACT_IMPORTED, {});
        _commonUtil.getJSONResponse(res, BOOLEAN_FALSE, STATUS_200, CONTACT_NOT_IMPORTED, {});
    } 
    catch (error) {
        _commonUtil.handleUserError(req.originalUrl, error, res, {});
    }
}

async function spamPhoneService(req, res) {
    try {
        const { userId } = req.user;
        const { phone } = req.body;

        await prisma.$transaction(async (transaction) => {
            const existSpam = await transaction.spam.findFirst({
                where: { userId, phone }
            });

            if (!existSpam) {
                await transaction.spam.create({
                    data: { 
                        userId, 
                        phone 
                    } 
                });

                const userExists = await transaction.user.count({
                    where: { phone }
                });

                if (userExists) {
                    await transaction.user.update({
                        where: { phone },
                        data: { spamCount: { increment: ONE } }
                    });
                }
    
                const contactCount = await transaction.contact.count({
                    where: { phone }
                });
    
                if (contactCount) {
                    await transaction.contact.updateMany({
                        where: { phone },
                        data: { spamCount: { increment: ONE }}
                    });
                }
            }
        });

        _commonUtil.getJSONResponse(res, BOOLEAN_TRUE, STATUS_200, PHONE_SPAMMED, {});
    } 
    catch (error) {
        _commonUtil.handleUserError(req.originalUrl, error, res, {});
    }
}

async function searchUserService(req, res) {
    try {
        const { search, page } = req.query;

        // * validate is numeric
        const isNumber = /^\d+$/.test(search);

        if (isNumber) {
            const userQuery = _commonUtil.phoneSearchQuery({
                id: 'userId',
                search,
                page
            });

            // * register user details
            const registerUserQueue = await prisma.user.findMany(userQuery);

            registerUserQueue.map(item => {
                item.id = item.userId;
                item.type = 'user';
                delete item.userId;
            });

            // * validate user data
            if (registerUserQueue.length) {
                return _commonUtil.getJSONResponse(res, BOOLEAN_TRUE, STATUS_200, DATA_FETCHED, {
                    records: registerUserQueue,
                    per_page: REQUESTED_RECORD
                });
            }

            const contactQuery = _commonUtil.phoneSearchQuery({
                id: 'contactId',
                search,
                page
            });

            // * user contact details
            const globalContactQueue = await prisma.contact.findMany(contactQuery);

            globalContactQueue.map(item => {
                item.id = item.contactId,
                item.type = 'contact',
                delete item.contactId;
            });

            // * api response
            return _commonUtil.getJSONResponse(res, BOOLEAN_TRUE, STATUS_200, DATA_FETCHED, {
                records: globalContactQueue,
                per_page: REQUESTED_RECORD
            });
        }

        const recordQueue = [];
        const startWithQuery = { 
            name: { 
                startsWith: search 
            }
        }

        // * total occurrence of search by start
        const totalRecord = await prisma.contact.findMany({ 
            where: startWithQuery,
            distinct: ['phone', 'name']
        });

        // * total page and left record
        const totalPage = Math.ceil(totalRecord.length / REQUESTED_RECORD);
        const leftRecord = totalPage * REQUESTED_RECORD - totalRecord.length;

        if (page <= totalPage) {
            const startWithRecord = await prisma.contact.findMany({
                where: startWithQuery,
                select: { 
                    contactId: BOOLEAN_TRUE, 
                    phone: BOOLEAN_TRUE, 
                    name: BOOLEAN_TRUE, 
                    spamCount: BOOLEAN_TRUE 
                },
                orderBy: { contactId: ASC_ORDER },
                distinct: ['phone', 'name'],
                skip: (page - ONE) * REQUESTED_RECORD,
                take: REQUESTED_RECORD
            });

            startWithRecord.forEach(item => {
                item.id = item.contactId;
                item.type = 'contact';
                delete item.contactId;
                recordQueue.push(item);
            });
        }

        if (page >= totalPage && recordQueue.length < REQUESTED_RECORD) {
            const actualPage = page - totalPage;
            const containRecord = await prisma.contact.findMany({
                where: { 
                    AND: [
                        {
                            name: { 
                                not: { 
                                    startsWith: search
                                }
                            }
                        },
                        {
                            name: {
                                contains: search,
                            }
                        }
                    ]
                },
                select: { 
                    contactId: BOOLEAN_TRUE, 
                    phone: BOOLEAN_TRUE, 
                    name: BOOLEAN_TRUE, 
                    spamCount: BOOLEAN_TRUE 
                },
                orderBy: { contactId: ASC_ORDER },
                distinct: ['phone', 'name'],
                skip: actualPage * (((actualPage - ONE) * REQUESTED_RECORD) + leftRecord),
                take: actualPage ? REQUESTED_RECORD : leftRecord
            });

            containRecord.forEach(item => {
                item.id = item.contactId;
                item.type = 'contact';
                delete item.contactId;
                recordQueue.push(item);
            });
        }

        // * api response
        _commonUtil.getJSONResponse(res, BOOLEAN_TRUE, STATUS_200, DATA_FETCHED, {
            records: recordQueue,
            per_page: REQUESTED_RECORD
        });
    } 
    catch (error) {
        _commonUtil.handleUserError(req.originalUrl, error, res, {});
    }
}

async function viewDetailService(req, res) {
    try {
        const { userId } = req.user;
        const { id, phone } = req.query;
        const searchId = parseInt(id);

        // * register user details
        const isRegisterUser = await prisma.user.findUnique({ 
            where: { userId: searchId, phone },
            select: {
                phone: BOOLEAN_TRUE,
                email: BOOLEAN_TRUE,
                name: BOOLEAN_TRUE,
                spamCount: BOOLEAN_TRUE
            }
        });

        if (isRegisterUser) {
            return _commonUtil.getJSONResponse(res, BOOLEAN_TRUE, STATUS_200, DATA_FETCHED, isRegisterUser);
        }

        // * search user contact details
        const isUserContact = await prisma.contact.findUnique({ 
            where: { userId, contactId: searchId, phone },
            select: {
                phone: BOOLEAN_TRUE,
                email: BOOLEAN_TRUE,
                name: BOOLEAN_TRUE,
                spamCount: BOOLEAN_TRUE
            }
        });

        if (isUserContact) {
            return _commonUtil.getJSONResponse(res, BOOLEAN_TRUE, STATUS_200, DATA_FETCHED, isUserContact);
        }
        
        // * contact details
        const contact = await prisma.contact.findUnique({ 
            where: { contactId: searchId, phone },
            select: {
                phone: BOOLEAN_TRUE,
                name: BOOLEAN_TRUE,
                spamCount: BOOLEAN_TRUE
            }
        });

        if (!contact) {
            return _commonUtil.getJSONResponse(res, BOOLEAN_FALSE, STATUS_200, DATA_NOT_FOUND, {});
        }

        // * set empty email
        contact.email = EMPTY_STRING;

        // * api response
        _commonUtil.getJSONResponse(res, BOOLEAN_TRUE, STATUS_200, DATA_FETCHED, contact);
    } 
    catch (error) {
        _commonUtil.handleUserError(req.originalUrl, error, res, {});
    }
}

module.exports = {
    signUpService,
    signInService,
    importContactService,
    spamPhoneService,
    searchUserService,
    viewDetailService
}