const AWS = require('aws-sdk');
const helper = require('./helper');
const CONSTANTS = require('./constants');
const dbClient = new AWS.DynamoDB.DocumentClient();

const queryBpData = async (email, measurementDate) => {
    const params = {
        TableName: CONSTANTS.MASTER_TABLE,
        KeyConditionExpression: '#pk = :pk AND #sk = :sk',
        ExpressionAttributeNames: {
            '#pk': [CONSTANTS.TABLE_ID],
            '#sk': [CONSTANTS.TABLE_SORT]
        },
        ExpressionAttributeValues: {
            ':pk': CONSTANTS.PK_VITAL_BP + helper.hashId(email),
            ':sk': CONSTANTS.SK_VITAL_BP + measurementDate.toString()
        }
    }
    const { Count, Items } = await dbClient.query(params).promise();
    if (Count && Items && Items.length > 0) return Items[0];
    return false;
}

const saveBpData = async (measurement) => {
    const params = {
        TableName: CONSTANTS.MASTER_TABLE,
        Item: measurement
    };
    return await dbClient.put(params).promise();
}

const updateBpData = async (measurement) => {
    const params = {
        TableName: CONSTANTS.MASTER_TABLE,
        Key: {
            [CONSTANTS.TABLE_ID]: measurement[CONSTANTS.TABLE_ID],
            [CONSTANTS.TABLE_SORT]: measurement[CONSTANTS.TABLE_SORT]
        },
        UpdateExpression: 'set #attributes = :attributes, #modifiedDate=:modifiedDate',
        ExpressionAttributeNames: {            
            '#attributes': 'attributes',
            '#modifiedDate': 'modifiedDate'
        },
        ExpressionAttributeValues:{
            ':attributes': measurement.attributes,
            ':modifiedDate': measurement.modifiedDate,
        }
    };
    return await dbClient.update(params).promise();
}

const queryTempData = async (email, measurementDate) => {
    const params = {
        TableName: CONSTANTS.MASTER_TABLE,
        KeyConditionExpression: '#pk = :pk AND #sk = :sk',
        ExpressionAttributeNames: {
            '#pk': [CONSTANTS.TABLE_ID],
            '#sk': [CONSTANTS.TABLE_SORT]
        },
        ExpressionAttributeValues: {
            ':pk': CONSTANTS.PK_VITAL_TEMP + helper.hashId(email),
            ':sk': CONSTANTS.SK_VITAL_TEMP + measurementDate.toString()
        }
    }
    const { Count, Items } = await dbClient.query(params).promise();
    if (Count && Items && Items.length > 0) return Items[0];
    return false;
}

const saveTempData = async (measurement) => {
    const params = {
        TableName: CONSTANTS.MASTER_TABLE,
        Item: measurement
    };
    return await dbClient.put(params).promise();
}

const updateTempData = async (measurement) => {
    const params = {
        TableName: CONSTANTS.MASTER_TABLE,
        Key: {
            [CONSTANTS.TABLE_ID]: measurement[CONSTANTS.TABLE_ID],
            [CONSTANTS.TABLE_SORT]: measurement[CONSTANTS.TABLE_SORT]
        },
        UpdateExpression: 'set #attributes = :attributes, #modifiedDate=:modifiedDate',
        ExpressionAttributeNames: {            
            '#attributes': 'attributes',
            '#modifiedDate': 'modifiedDate'
        },
        ExpressionAttributeValues:{
            ':attributes': measurement.attributes,
            ':modifiedDate': measurement.modifiedDate,
        }
    };
    return await dbClient.update(params).promise();
}

const queryOxygenData = async (email, measurementDate) => {
    const params = {
        TableName: CONSTANTS.MASTER_TABLE,
        KeyConditionExpression: '#pk = :pk AND #sk = :sk',
        ExpressionAttributeNames: {
            '#pk': [CONSTANTS.TABLE_ID],
            '#sk': [CONSTANTS.TABLE_SORT]
        },
        ExpressionAttributeValues: {
            ':pk': CONSTANTS.PK_VITAL_OXYGEN + helper.hashId(email),
            ':sk': CONSTANTS.SK_VITAL_OXYGEN + measurementDate.toString()
        }
    }
    const { Count, Items } = await dbClient.query(params).promise();
    if (Count && Items && Items.length > 0) return Items[0];
    return false;
}

const saveOxygenData = async (measurement) => {
    const params = {
        TableName: CONSTANTS.MASTER_TABLE,
        Item: measurement
    };
    return await dbClient.put(params).promise();
}

const updateOxygenData = async (measurement) => {
    const params = {
        TableName: CONSTANTS.MASTER_TABLE,
        Key: {
            [CONSTANTS.TABLE_ID]: measurement[CONSTANTS.TABLE_ID],
            [CONSTANTS.TABLE_SORT]: measurement[CONSTANTS.TABLE_SORT]
        },
        UpdateExpression: 'set #attributes = :attributes, #modifiedDate=:modifiedDate',
        ExpressionAttributeNames: {            
            '#attributes': 'attributes',
            '#modifiedDate': 'modifiedDate'
        },
        ExpressionAttributeValues:{
            ':attributes': measurement.attributes,
            ':modifiedDate': measurement.modifiedDate,
        }
    };
    return await dbClient.update(params).promise();
}

module.exports = {
    queryBpData,
    queryTempData,
    queryOxygenData,
    saveBpData,
    saveTempData,
    saveOxygenData,
    updateBpData,
    updateTempData,
    updateOxygenData,
}
