const crypto = require('crypto');
const AWS = require('aws-sdk');
const CONSTANTS = require('./constants');
const s3Client = new AWS.S3();

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

const replaceAll = (string, search, replace) => {
    return string.split(search).join(replace);
}

const uploadReportToS3 = async (data, key, type) => {
    try {
        let params = {
            Bucket: CONSTANTS.REPORT_BUCKET,
            Body: data,
            Key: key,
            ContentType: `application/${type}`
        }
        return await s3Client.upload(params).promise();
    } catch (error) {
        return Promise.reject(error);
    }
}

const getreportUrl = (report) => {
    const url = s3Client.getSignedUrl('getObject', {
        Bucket: CONSTANTS.REPORT_BUCKET,
        Key: report,
        Expires: 86400//1 days
    })
    return Promise.resolve(url);
}

module.exports = {
    hashId,
    throwCustomError,
    formatReadings,
    replaceAll,
    uploadReportToS3,
    getreportUrl,
}
