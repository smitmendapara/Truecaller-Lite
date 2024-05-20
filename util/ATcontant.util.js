const DB_CONNECTED = 'Database connected'

const SERVER_STARTED = 'Server is running on port : '

const DB_NOT_CONNECTED = 'Error connecting to database: '

const SERVER_NOT_STARTED = 'Failed to connect to the database. Server not started.'

const DEFAULT_SERVER_PORT = 3000

const PRODUCT_API_PREFIX = '/api/'



const ERROR_LOG = 'error'

const INFO_LOG = 'info'

const LOG_TIMESTAMP_FORMAT = 'DD-MMM-YYYY HH:mm:ss'



const BOOLEAN_TRUE = true

const BOOLEAN_FALSE = false

const ZERO = 0

const ONE = 1

const SIX = 6

const TEN = 10

const USER = 'user'

const AUTH = 'auth'

const COMMON = 'common'

const STATUS_200 = 200

const STATUS_400 = 400

const STATUS_403 = 403

const BAD_REQUEST = 'Something was broken!'

const HIGH_PRIORITY_LOG = 'high'

const MEDIUM_PRIORITY_LOG = 'medium'

const LOW_PRIORITY_LOG = 'low'


const PHONE_REQUIRED = 'Phone number is required!'

const INVALID_PHONE = 'Phone number must be 10 digits!'

const NUMERIC_PHONE = 'Phone number must be numeric!'

const USER_NOT_REGISTER = 'User not registered!'

const INCORRECT_PASSWORD = 'Incorrect password!'

const SIGN_IN_SUCCESS = 'sign-in successful!'

const SIGN_UP_SUCCESS = 'sign-up successful!'

const SIGN_UP_FAILED = 'sign-up failed!'

const PHONE_ALREADY_REGISTER = 'Phone number is already registered.'

const PASS_REQUIRE = 'Password is required.'

const PASS_CHAR_SIZE = 'Password must be at least 6 characters long.'

const PASS_CONTAIN_LETTER = 'Password must contain at least one letter.'

const PASS_CONTAIN_DIGIT = 'Password must contain at least one number.'

const INVALID_EMAIL = 'Invalid e-Mail address.'

const NAME_REQUIRE = 'Name is required!'

const PAGE_REQUIRE = 'Page is required!'

const PAGE_POSITIVE_NUMBER = 'Page must be a positive integer!'

const SEARCH_REQUIRE = 'Search is required!'

const ID_REQUIRE = 'Id is required!'


const AUTHORIZATION = 'authorization'

const ACCESS_DENIED = 'access denied!'

const UNAUTHORIZED_USER = 'unauthorized user!'

const REQUESTED_RECORD = 10

const DATA_FETCHED = 'data fetched!'

const DATA_NOT_FOUND = 'data not found!'

const ASC_ORDER = 'asc'

const DESC_ORDER = 'desc'

const PHONE_SPAMMED = 'Phone has been spammed!'

const EMPTY_STRING = ''

const CONTACT_IMPORTED = 'Contact has been imported.'

const CONTACT_NOT_IMPORTED = 'Contact has not been imported.'

module.exports = {
    DB_CONNECTED,
    SERVER_STARTED,
    DB_NOT_CONNECTED,
    SERVER_NOT_STARTED,
    DEFAULT_SERVER_PORT,
    PRODUCT_API_PREFIX,

    ERROR_LOG,
    INFO_LOG,
    LOG_TIMESTAMP_FORMAT,

    BOOLEAN_TRUE,
    BOOLEAN_FALSE,
    ZERO,
    ONE,
    SIX,
    TEN,
    USER,
    AUTH,
    COMMON,
    STATUS_200,
    STATUS_400,
    STATUS_403,
    BAD_REQUEST,

    HIGH_PRIORITY_LOG,
    MEDIUM_PRIORITY_LOG,
    LOW_PRIORITY_LOG,

    PHONE_REQUIRED,
    NUMERIC_PHONE,
    INVALID_PHONE,
    USER_NOT_REGISTER,
    INCORRECT_PASSWORD,
    SIGN_IN_SUCCESS,
    SIGN_UP_FAILED,
    SIGN_UP_SUCCESS,
    PHONE_ALREADY_REGISTER,
    PASS_REQUIRE,
    PASS_CONTAIN_LETTER,
    PASS_CONTAIN_DIGIT,
    INVALID_EMAIL,
    PASS_CHAR_SIZE,
    NAME_REQUIRE,
    PAGE_REQUIRE,
    PAGE_POSITIVE_NUMBER,
    SEARCH_REQUIRE,
    ID_REQUIRE,

    AUTHORIZATION,
    ACCESS_DENIED,
    UNAUTHORIZED_USER,
    REQUESTED_RECORD,
    DATA_FETCHED,
    DATA_NOT_FOUND,
    ASC_ORDER,
    DESC_ORDER,
    PHONE_SPAMMED,
    EMPTY_STRING,
    CONTACT_IMPORTED,
    CONTACT_NOT_IMPORTED
}