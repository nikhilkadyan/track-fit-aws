const helper = require('./helper');
const CONSTANTS = require('./constants');

exports.validateBP = ({ measurements }) => {
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

exports.validateTemp = ({ measurements }) => {
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

exports.validateOxygen = ({ measurements }) => {
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
