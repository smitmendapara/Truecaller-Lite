const userService = require('../services/ATuser.services');
const _commonUtil = require('../util/ATcommon.util');
const _constantUtil = require('../util/ATcontant.util');

const { BOOLEAN_FALSE, STATUS_400, BAD_REQUEST, MEDIUM_PRIORITY_LOG, USER } = _constantUtil;

// * high order function for service handler
const serviceHandler = (func) => async (req, res) => {
    try {
        await func(req, res);
    } 
    catch (error) {
        _loggerUtil.error(`${error}`, { api: req.originalUrl, controller: USER, priority: MEDIUM_PRIORITY_LOG });
        _commonUtil.getJSONResponse(res, BOOLEAN_FALSE, STATUS_400, BAD_REQUEST, {});
    }
};

module.exports = {
    signUp: serviceHandler(userService.signUpService),
    importContact: serviceHandler(userService.importContactService),
    signIn: serviceHandler(userService.signInService)
}