const crypto = require('crypto');

const hashId = (id) => {
    let hashId = crypto.createHash('sha256').update(id).digest('hex');
    hashId = crypto.createHash('sha256').update(hashId).digest('hex');
    return hashId;
}

const throwCustomError = (code, message) => {
    const error = {
        statusCode: code,
        message: message
    }
    throw error;
}

module.exports = {
    hashId,
    throwCustomError
}
