const AWS = require('aws-sdk');
const helper = require('./helper');
const CONSTANTS = require('./constants');
const dbClient = new AWS.DynamoDB.DocumentClient();

const queryOxygenData = async (emailAddress, measurementDate) => {
    const params = {
        TableName: CONSTANTS.MASTER_TABLE,
        KeyConditionExpression: '#pk = :pk AND #sk = :sk',
        ExpressionAttributeNames: {
            '#pk': [CONSTANTS.TABLE_ID],
            '#sk': [CONSTANTS.TABLE_SORT]
        },
        ExpressionAttributeValues: {
            ':pk': CONSTANTS.PK_VITAL_OXYGEN + helper.hashId(emailAddress),
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
    queryOxygenData,
    saveOxygenData,
    updateOxygenData
}
