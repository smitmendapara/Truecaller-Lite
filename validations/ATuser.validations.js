const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { check, validationResult } = require('express-validator');
const _commonUtil = require('../util/ATcommon.util');
const _constantUtil = require('../util/ATcontant.util');

const { 
    BOOLEAN_FALSE, STATUS_422, BOOLEAN_TRUE, INVALID_PHONE, PHONE_REQUIRED, NUMERIC_PHONE, TEN, INCORRECT_PASSWORD,
    USER_NOT_REGISTER, PHONE_ALREADY_REGISTER, NAME_REQUIRE, PASS_CHAR_SIZE, PASS_REQUIRE, PASS_CONTAIN_LETTER,
    PASS_CONTAIN_DIGIT, INVALID_EMAIL, SIX, ZERO, SEARCH_REQUIRE, PAGE_REQUIRE, PAGE_POSITIVE_NUMBER, ID_REQUIRE
} = _constantUtil;

const validate = (validations) => [
    ...validations,
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const [firstError] = errors.array();
            return _commonUtil.getJSONResponse(res, BOOLEAN_FALSE, STATUS_422, firstError.msg, {});
        }
        next();
    }
];

const signInValidations = validate([
    check('phone')
        .notEmpty().withMessage(PHONE_REQUIRED)
        .isLength({ min: TEN, max: TEN }).withMessage(INVALID_PHONE)
        .isNumeric().withMessage(NUMERIC_PHONE)

    .custom(async (phone, { req }) => {
        const user = await prisma.user.findUnique({
            where: { phone },
            select: { password: BOOLEAN_TRUE }
        });

        if (!user) {
            throw new Error(USER_NOT_REGISTER);
        } else if (user.password !== req.body.password) {
            throw new Error(INCORRECT_PASSWORD);
        }
    })
]);

const signUpValidations = validate([
    check('phone')
        .notEmpty().withMessage(PHONE_REQUIRED)
        .isLength({ min: TEN, max: TEN }).withMessage(INVALID_PHONE)
        .isNumeric().withMessage(NUMERIC_PHONE)

    .custom(async phone => {
        if (await prisma.user.count({ where: { phone }})) {
            throw new Error(PHONE_ALREADY_REGISTER);
        }
    }),

    check('password')
        .notEmpty().withMessage(PASS_REQUIRE)
        .isLength({ min: SIX }).withMessage(PASS_CHAR_SIZE)
        .matches(/[a-zA-Z]/).withMessage(PASS_CONTAIN_LETTER)
        .matches(/[0-9]/).withMessage(PASS_CONTAIN_DIGIT),

    check('email')
        .optional({ checkFalsy: BOOLEAN_TRUE })
        .isEmail().withMessage(INVALID_EMAIL),

    check('name')
        .notEmpty().withMessage(NAME_REQUIRE)
]);

const spamPhoneValidations = validate([
    check('phone')
        .notEmpty().withMessage(PHONE_REQUIRED)
        .isLength({ min: TEN, max: TEN }).withMessage(INVALID_PHONE)
        .isNumeric().withMessage(NUMERIC_PHONE)
]);

const searchUserValidations = validate([
    check('search')
        .notEmpty().withMessage(SEARCH_REQUIRE),

    check('page')
        .notEmpty().withMessage(PAGE_REQUIRE)
        .isInt({ gt: ZERO }).withMessage(PAGE_POSITIVE_NUMBER)
]);

const viewDetailValidations = validate([
    check('id')
        .notEmpty().withMessage(ID_REQUIRE),

    check('phone')
        .notEmpty().withMessage(PHONE_REQUIRED)
        .isLength({ min: TEN, max: TEN }).withMessage(INVALID_PHONE)
        .isNumeric().withMessage(NUMERIC_PHONE)
]);

module.exports = {
    signInValidations,
    signUpValidations,
    spamPhoneValidations,
    searchUserValidations,
    viewDetailValidations
};