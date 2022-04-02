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
    if (!helper.checkKeyExist(measurements, CONSTANTS.SYSTOLIC_KEY)) {
        helper.throwCustomError(400, 'Please provide systolic for every reading');
    }
    if (!helper.checkKeyExist(measurements, CONSTANTS.DIASTOLIC_KEY)) {
        helper.throwCustomError(400, 'Please provide diastolic for every reading');
    }
    if (!helper.checkKeyExist(measurements, CONSTANTS.PULSE_KEY)) {
        helper.throwCustomError(400, 'Please provide pulse for every reading');
    }
}

const postBpData = async ({ emailAddress, measurements }) => {
    const promiseArr = [];
    for (const measurement of measurements) {
        const currentTime = new Date().getTime();
        const hasValidMeasurementDate = Number(measurement.measurementDate) > 0;
        if (hasValidMeasurementDate) {
            let bpData = await db.queryBpData(
                emailAddress,
                measurement.measurementDate
            );
            if (bpData) {
                bpData.modifiedDate = currentTime;
                bpData.attributes = {
                    systolic: measurement.systolic.toString(),
                    diastolic: measurement.diastolic.toString(),
                    pulse: measurement.pulse.toString(),
                }
                promiseArr.push(db.updateBpData(bpData));
            } else {
                const bpData = {
                    [CONSTANTS.TABLE_ID]: CONSTANTS.PK_VITAL_BP + helper.hashId(emailAddress),
                    [CONSTANTS.TABLE_SORT]: CONSTANTS.SK_VITAL_BP + measurement.measurementDate.toString(),
                    [CONSTANTS.TABLE_LSORT]: CONSTANTS.LSK_VITAL_BP + measurement.measurementDate.toString(),
                    createdDate: currentTime,
                    modifiedDate: currentTime,
                    attributes: {
                        systolic: measurement.systolic.toString(),
                        diastolic: measurement.diastolic.toString(),
                        pulse: measurement.pulse.toString(),
                    }
                }
                promiseArr.push(db.saveBpData(bpData));
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
        await postBpData(event);
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
