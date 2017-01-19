var httpStatus = require('http-status');

/**
   * Creates an API error.
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code of error.
   * @param {boolean} isPublic - Whether the message should be visible to user or not.
   */
function APIError(message, status, isPublic) {
    if (typeof status === 'undefined') {
        status = httpStatus.INTERNAL_SERVER_ERROR;
    }
    if (typeof isPublic === 'undefined') {
        isPublic = false;
    }
    Error.call(this);
    this.message = message;
    this.status = status;
    this.isPublic = isPublic;
    Error.captureStackTrace(this, APIError);
}

module.exports = APIError;