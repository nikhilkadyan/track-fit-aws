const db = require('./dynamoDB');
const helper = require('./helper');
const report = require('./report');

const applyValidation = ({ fromDate, toDate }) => {
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
        // validate request
        if (!event.email) helper.throwCustomError(403, 'Unauthorized');
        event = { ...event, ...event.body };
        applyValidation(event)

        // Fetch readings
        let readings = await db.getAllVitals(event.email, event.fromDate, event.toDate);
        if (!readings || readings.length === 0) helper.throwCustomError(404, 'No readings found.')

        // Create report
        const html = await report.generateReport(readings)
        return {
            statusCode: 200,
            message: 'Report generated',
            report: html
        };;
    } catch (err) {
        console.error(err);
        return {
            statusCode: err.statusCode || 500,
            message: err.message || 'Something went wrong'
        };
    }
}
