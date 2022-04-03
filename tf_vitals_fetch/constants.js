// Common
exports.MASTER_TABLE = 'tf_master';
exports.TABLE_ID = 'id';
exports.TABLE_SORT = 'sortKey';
exports.TABLE_LSORT = 'lSortKey';
exports.LSK_INDEX = 'lSortKey-index'
exports.LSK_VITAL = 'VITAL#';
exports.VITALS_TYPE = {
    bp: 'bp',
    temperature: 'temperature',
    oxygen: 'oxygen'
}

// Bloodpressure
exports.PK_VITAL_BP = 'USER#';
exports.SK_VITAL_BP = 'VITAL#BP#';

// Temperature
exports.PK_VITAL_TEMP = 'USER#';
exports.SK_VITAL_TEMP = 'VITAL#TEMP#';

// Oxygen
exports.PK_VITAL_OXYGEN = 'USER#';
exports.SK_VITAL_OXYGEN = 'VITAL#OXYGEN#';
