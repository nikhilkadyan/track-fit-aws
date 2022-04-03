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

const formatReadings = (readings) => {
    const finalReadings = readings.map((reading) => {
        return {
            id: reading?.sortKey,
            type: reading?.type,
            measurementDate: reading?.measurementDate,
            createdDate: reading?.createdDate,
            modifiedDate: reading?.modifiedDate,
            attributes: reading?.attributes
        }
    })
    return finalReadings;
}

module.exports = {
    hashId,
    throwCustomError,
    formatReadings
}
