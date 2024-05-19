const _constantUtil = require('./ATcontant.util');
const _loggerUtil = require('./ATlogger.util');

const { 
    USER, BAD_REQUEST, STATUS_400, HIGH_PRIORITY_LOG, AUTH, BOOLEAN_FALSE, REQUESTED_RECORD, ONE,
    BOOLEAN_TRUE, COMMON
} = _constantUtil;

// * set JSON response
function getJSONResponse(res, status, code, message, data) {
    return res.status(code).json({ status, code, message, data });
}

// * handle user error
function handleUserError(api, error, res, data) {
    _loggerUtil.error(`${error}`, { api, service: USER, priority: HIGH_PRIORITY_LOG });
    getJSONResponse(res, BOOLEAN_FALSE, STATUS_400, BAD_REQUEST, data);
}

// * handle middleware error
function handleMiddlewareError(api, error, res, data) {
    _loggerUtil.error(`${error}`, { api, service: AUTH, priority: HIGH_PRIORITY_LOG });
    getJSONResponse(res, BOOLEAN_FALSE, STATUS_400, BAD_REQUEST, data);
}

// * phone search query
function phoneSearchQuery(params) {
    try {
        const { id, search, page } = params;

        return {
            where: { phone: search },
            select: { 
                [id]: BOOLEAN_TRUE, 
                phone: BOOLEAN_TRUE, 
                name: BOOLEAN_TRUE, 
                spamCount: BOOLEAN_TRUE 
            },
            orderBy: { [id]: 'asc' },
            distinct: ['name', 'phone'],
            skip: (page - ONE) * REQUESTED_RECORD,
            take: REQUESTED_RECORD
        }
    } 
    catch (error) {
        _loggerUtil.error(`${error}`, { util: COMMON, priority: HIGH_PRIORITY_LOG });
        return {};
    }
}

module.exports = {
    handleUserError,
    handleMiddlewareError,
    getJSONResponse,
    phoneSearchQuery
}