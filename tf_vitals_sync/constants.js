// Common
exports.MASTER_TABLE = 'tf_master';
exports.TABLE_ID = 'id';
exports.TABLE_SORT = 'sortKey';
exports.TABLE_LSORT = 'lSortKey';
exports.MEASUREMENT_DATE_KEY = 'measurementDate';
exports.VITALS_TYPE = {
    bp: 'bp',
    temperature: 'temperature',
    oxygen: 'oxygen'
}

// Bloodpressure
exports.PK_VITAL_BP = 'USER#';
exports.SK_VITAL_BP = 'VITAL#BP#';
exports.LSK_VITAL_BP = 'VITAL#';
exports.SYSTOLIC_KEY = 'systolic';
exports.DIASTOLIC_KEY = 'diastolic';
exports.PULSE_KEY = 'pulse';

// Oxygen
exports.PK_VITAL_OXYGEN = 'USER#';
exports.SK_VITAL_OXYGEN = 'VITAL#OXYGEN#';
exports.LSK_VITAL_OXYGEN = 'VITAL#';
exports.OXYGEN_KEY = 'oxygen';
exports.PULSE_KEY = 'pulse';

// Temperature
exports.PK_VITAL_TEMP = 'USER#';
exports.SK_VITAL_TEMP = 'VITAL#TEMP#';
exports.LSK_VITAL_TEMP = 'VITAL#';
exports.MEASUREMENT_DATE_KEY = 'measurementDate';
exports.TEMPERATURE_KEY = 'temperature';
