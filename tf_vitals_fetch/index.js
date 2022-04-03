const db = require('./dynamoDB');
const helper = require('./helper');
const CONSTANTS = require('./constants');

const applyValidation = ({ type, fromDate, toDate }) => {
    if (!type) {
        helper.throwCustomError(400, 'Type is required parameter');
        type = type.toLowerCase()
    }
    if (!fromDate) {
        helper.throwCustomError(400, 'From date is required parameter');
        fromDate = Number(fromDate)
    }
    if (!toDate) {
        helper.throwCustomError(400, 'To date is required parameter');
        toDate = Number(toDate)
    }
}

exports.handler = async (event) => {
    try {
        if (!event.email) helper.throwCustomError(403, 'Unauthorized');
        event = { ...event, ...event.body };
        applyValidation(event)

        let readings = [];
        switch(event.type) {
            case CONSTANTS.VITALS_TYPE.bp:
                readings = await db.getBpData(event.email, event.fromDate, event.toDate);
                break;
            case CONSTANTS.VITALS_TYPE.temperature:
                readings = await db.getTempData(event.email, event.fromDate, event.toDate);
                break;
            case CONSTANTS.VITALS_TYPE.oxygen:
                readings = await db.getOxygenData(event.email, event.fromDate, event.toDate);
                break;
            default:
                helper.throwCustomError(400, 'Invalid vital type')
                break;
        }

        if (readings.length === 0) helper.throwCustomError(404, 'No readings found.')
        return {
            statusCode: 200,
            message: 'Vitals synced',
            data: helper.formatReading(readings)
        };;
    } catch (err) {
        console.error(err);
        return {
            statusCode: err.statusCode || 500,
            message: err.message || 'Something went wrong'
        };
    }
}
