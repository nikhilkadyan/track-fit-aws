const AWS = require('aws-sdk');
const helper = require('./helper');
const CONSTANTS = require('./constants');
const db = require('./dynamoDB');

const applyValidation = ({ measurements }) => {
    if (!measurements || !Array.isArray(measurements) || measurements.length === 0) {
        helper.throwCustomError(400, 'Measurements list is invalid or empty');
    }
    if (!helper.checkKeyExist(measurements, CONSTANTS.MEASUREMENT_DATE_KEY)) {
        helper.throwCustomError(400, 'Please provide measurementDate for every reading');
    }
    if (!helper.checkKeyExist(measurements, CONSTANTS.TEMPERATURE_KEY)) {
        helper.throwCustomError(400, 'Please provide temperature for every reading');
    }
}

const postTempData = async ({ emailAddress, measurements }) => {
    const promiseArr = [];
    for (const measurement of measurements) {
        const currentTime = new Date().getTime();
        const hasValidMeasurementDate = Number(measurement.measurementDate) > 0;
        if (hasValidMeasurementDate) {
            let tempData = await db.queryTempData(
                emailAddress,
                measurement.measurementDate
            );
            if (tempData) {
                tempData.modifiedDate = currentTime;
                tempData.attributes = {
                    temperature: measurement.temperature.toString()
                }
                promiseArr.push(db.updateTempData(tempData));
            } else {
                const tempData = {
                    [CONSTANTS.TABLE_ID]: CONSTANTS.PK_VITAL_TEMP + helper.hashId(emailAddress),
                    [CONSTANTS.TABLE_SORT]: CONSTANTS.SK_VITAL_TEMP + measurement.measurementDate.toString(),
                    [CONSTANTS.TABLE_LSORT]: CONSTANTS.LSK_VITAL_TEMP + measurement.measurementDate.toString(),
                    createdDate: currentTime,
                    modifiedDate: currentTime,
                    attributes: {
                        temperature: measurement.temperature.toString()
                    }
                }
                promiseArr.push(db.saveTempData(tempData));
            }
        }
    }
    await Promise.all(promiseArr);
}

exports.handler = async (event) => {
    try {
        if (!event.emailAddress) helper.throwCustomError(403, 'Unauthorized');
        event = { ...event, ...event.body };
        applyValidation(event);
        await postTempData(event);
        return {
            statusCode: 200,
            message: 'Vitals synced'
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: err.statusCode || 500,
            message: err.message || 'Something went wrong'
        };
    }
}
