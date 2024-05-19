const express = require('express');
const router = express.Router();
const userController = require('../controller/ATuser.controller');
const userValidator = require('../validations/ATuser.validations');
const authMiddleware = require('../middleware/ATauth.middleware');

// * POST sign up
router.post('/sign-up',
    userValidator.signUpValidations,
userController.signUp);

// * POST sign in
router.post('/sign-in',
    userValidator.signInValidations,
userController.signIn);

// * POST import contact
router.post('/import-contact',
    authMiddleware.authenticate,
userController.importContact);

// * POST spam phone
router.post('/spam-phone',
    authMiddleware.authenticate,
    userValidator.spamPhoneValidations,
userController.spamPhone);

// * GET search user
router.get('/search-user',
    authMiddleware.authenticate,
    userValidator.searchUserValidations,
userController.searchUser);

// * GET view detail
router.get('/view-detail',
    authMiddleware.authenticate,
    userValidator.viewDetailValidations,
userController.viewDetail);

module.exports = router;