const crypto = require('crypto');

const hashId = (id) => {
    let hashId = crypto.createHash('sha256').update(id).digest('hex');
    hashId = crypto.createHash('sha256').update(hashId).digest('hex');
    return hashId;
}

const generateUniqueId = () => {
    const uniqueVal = new Date().getTime() + (Math.floor(Math.pow(10, 12 - 1) + Math.random() * (Math.pow(10, 12) - Math.pow(10, 12 - 1) - 1))).toString();
    let id = crypto.createHash('sha256').update(uniqueVal).digest('hex');
    id = crypto.createHash('sha256').update(id).digest('hex');
    return id;
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
    generateUniqueId,
    throwCustomError
}
