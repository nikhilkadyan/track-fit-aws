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

const checkKeyExist = (arr, key) => {
    return arr.filter(obj => !obj[`${key}`]).length === 0 ? true : false;
}

module.exports = {
    hashId,
    checkKeyExist,
    throwCustomError
}
