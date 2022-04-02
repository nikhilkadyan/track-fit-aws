const AWS = require('aws-sdk');
const helper = require('./helper');
const db = require('./dynamoDB');

const applyValidation = ({ fromDate, toDate }) => {
    if (!fromDate) {
        helper.throwCustomError(400, 'From date is required parameter');
    }
    if (!toDate) {
        helper.throwCustomError(400, 'To date is required parameter');
    }
}

exports.handler = async (event) => {
    try {
        if (!event.emailAddress) helper.throwCustomError(403, 'Unauthorized');
        event = { ...event, ...event.body };
        applyValidation(event)
        const readings = await db.getOxygenData(event.emailAddress, event.fromDate, event.toDate);
        if (readings.length === 0) helper.throwCustomError(404, 'No readings found.')
        return {
            statusCode: 200,
            message: 'Vitals synced',
            data: readings
        };;
    } catch (err) {
        console.error(err);
        return {
            statusCode: err.statusCode || 500,
            message: err.message || 'Something went wrong'
        };
    }
}
