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
    if (!helper.checkKeyExist(measurements, CONSTANTS.OXYGEN_KEY)) {
        helper.throwCustomError(400, 'Please provide oxygen for every reading');
    }
    if (!helper.checkKeyExist(measurements, CONSTANTS.PULSE_KEY)) {
        helper.throwCustomError(400, 'Please provide pulse for every reading');
    }
}

const postOxygenData = async ({ emailAddress, measurements }) => {
    const promiseArr = [];
    for (const measurement of measurements) {
        const currentTime = new Date().getTime();
        const hasValidMeasurementDate = Number(measurement.measurementDate) > 0;
        if (hasValidMeasurementDate) {
            let oxygenData = await db.queryOxygenData(
                emailAddress,
                measurement.measurementDate
            );
            if (oxygenData) {
                oxygenData.modifiedDate = currentTime;
                oxygenData.attributes = {
                    oxygen: measurement.oxygen.toString(),
                    pulse: measurement.pulse.toString(),
                }
                promiseArr.push(db.updateOxygenData(oxygenData));
            } else {
                const oxygenData = {
                    [CONSTANTS.TABLE_ID]: CONSTANTS.PK_VITAL_OXYGEN + helper.hashId(emailAddress),
                    [CONSTANTS.TABLE_SORT]: CONSTANTS.SK_VITAL_OXYGEN + measurement.measurementDate.toString(),
                    [CONSTANTS.TABLE_LSORT]: CONSTANTS.LSK_VITAL_OXYGEN + measurement.measurementDate.toString(),
                    createdDate: currentTime,
                    modifiedDate: currentTime,
                    attributes: {
                        oxygen: measurement.oxygen.toString(),
                        pulse: measurement.pulse.toString(),
                    }
                }
                promiseArr.push(db.saveOxygenData(oxygenData));
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
        await postOxygenData(event);
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
