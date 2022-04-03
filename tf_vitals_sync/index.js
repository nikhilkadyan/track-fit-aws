const helper = require('./helper');
const db = require('./dynamoDB');
const CONSTANTS = require('./constants');
const validations = require('./validations');

const postBpData = async ({ email, measurements }) => {
    const promiseArr = [];
    for (const measurement of measurements) {
        const currentTime = new Date().getTime();
        const hasValidMeasurementDate = Number(measurement.measurementDate) > 0;
        if (hasValidMeasurementDate) {
            let bpData = await db.queryBpData(
                email,
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
                    [CONSTANTS.TABLE_ID]: CONSTANTS.PK_VITAL_BP + helper.hashId(email),
                    [CONSTANTS.TABLE_SORT]: CONSTANTS.SK_VITAL_BP + measurement.measurementDate.toString(),
                    [CONSTANTS.TABLE_LSORT]: CONSTANTS.LSK_VITAL + measurement.measurementDate.toString(),
                    createdDate: currentTime,
                    modifiedDate: currentTime,
                    type: CONSTANTS.VITALS_TYPE.bp,
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

const postTempData = async ({ email, measurements }) => {
    const promiseArr = [];
    for (const measurement of measurements) {
        const currentTime = new Date().getTime();
        const hasValidMeasurementDate = Number(measurement.measurementDate) > 0;
        if (hasValidMeasurementDate) {
            let tempData = await db.queryTempData(
                email,
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
                    [CONSTANTS.TABLE_ID]: CONSTANTS.PK_VITAL_TEMP + helper.hashId(email),
                    [CONSTANTS.TABLE_SORT]: CONSTANTS.SK_VITAL_TEMP + measurement.measurementDate.toString(),
                    [CONSTANTS.TABLE_LSORT]: CONSTANTS.LSK_VITALMP + measurement.measurementDate.toString(),
                    createdDate: currentTime,
                    modifiedDate: currentTime,
                    type: CONSTANTS.VITALS_TYPE.temperature,
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

const postOxygenData = async ({ email, measurements }) => {
    const promiseArr = [];
    for (const measurement of measurements) {
        const currentTime = new Date().getTime();
        const hasValidMeasurementDate = Number(measurement.measurementDate) > 0;
        if (hasValidMeasurementDate) {
            let oxygenData = await db.queryOxygenData(
                email,
                measurement.measurementDate
            );
            if (oxygenData) {
                oxygenData.modifiedDate = currentTime;
                oxygenData.attributes = {
                    oxygen: measurement.oxygen.toString(),
                    pulse: measurement.pulse.toString(),
                }
                oxygenData.type = CONSTANTS.VITALS_TYPE.oxygen
                promiseArr.push(db.updateOxygenData(oxygenData));
            } else {
                const oxygenData = {
                    [CONSTANTS.TABLE_ID]: CONSTANTS.PK_VITAL_OXYGEN + helper.hashId(email),
                    [CONSTANTS.TABLE_SORT]: CONSTANTS.SK_VITAL_OXYGEN + measurement.measurementDate.toString(),
                    [CONSTANTS.TABLE_LSORT]: CONSTANTS.LSK_VITALYGEN + measurement.measurementDate.toString(),
                    createdDate: currentTime,
                    modifiedDate: currentTime,
                    type: CONSTANTS.VITALS_TYPE.oxygen,
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
        if (!event.email) helper.throwCustomError(403, 'Unauthorized');
        event = { ...event, ...event.body };

        switch(event.type) {
            case CONSTANTS.VITALS_TYPE.bp:
                validations.validateBP(event)
                await postBpData(event);
                break;
            case CONSTANTS.VITALS_TYPE.temperature:
                validations.validateTemp(event)
                await postTempData(event);
                break;
            case CONSTANTS.VITALS_TYPE.oxygen:
                validations.validateOxygen(event)
                await postOxygenData(event);
                break;
            default:
                helper.throwCustomError(400, 'Invalid vital type')
                break;
        }
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
