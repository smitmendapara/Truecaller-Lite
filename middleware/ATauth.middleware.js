const jwt = require('jsonwebtoken');
const _commonUtil = require('../util/ATcommon.util');
const _constantUtil = require('../util/ATcontant.util');

const { STATUS_403, ACCESS_DENIED, UNAUTHORIZED_USER, AUTHORIZATION, BOOLEAN_FALSE } = _constantUtil;

// * user authentication
async function authenticate(req, res, next) {
    try {
        const token = req.header(AUTHORIZATION);

        // * token not provided
        if (!token) {
            return _commonUtil.getJSONResponse(res, BOOLEAN_FALSE, STATUS_403, ACCESS_DENIED, {});
        }

        // * decode token and verify user
        jwt.verify(token, process.env.AUTH_SALT, (error, decode) => {

            // * unauthorized user middleware response
            if (error) {
                return _commonUtil.getJSONResponse(res, BOOLEAN_FALSE, STATUS_403, UNAUTHORIZED_USER, {});
            }

            // * token verified and decode user details
            req.user = decode;
            next();
        });
    } 
    catch (error) {
        _commonUtil.handleMiddlewareError(req.originalUrl, error, res, {});
    }
}

module.exports = { 
    authenticate
};