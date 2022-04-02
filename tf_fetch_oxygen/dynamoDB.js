const AWS = require('aws-sdk');
const helper = require('./helper');
const CONSTANTS = require('./constants');
const dbClient = new AWS.DynamoDB.DocumentClient();

const getOxygenData = async (emailAddress, fromDate, toDate) => {
    const params = {
        TableName: CONSTANTS.MASTER_TABLE,
        KeyConditionExpression: '#pk = :pk AND #sk BETWEEN :fromDate AND :toDate',
        ExpressionAttributeNames: {
            '#pk': [CONSTANTS.TABLE_ID],
            '#sk': [CONSTANTS.TABLE_SORT]
        },
        ExpressionAttributeValues: {
            ':pk': CONSTANTS.PK_VITAL_OXYGEN + helper.hashId(emailAddress),
            ':fromDate': CONSTANTS.SK_VITAL_OXYGEN + fromDate.toString(),
            ':toDate': CONSTANTS.SK_VITAL_OXYGEN + toDate.toString(),
        }
    }
    const { Count, Items } = await dbClient.query(params).promise();
    if (Count && Items && Items.length > 0) return Items;
    return [];
}

module.exports = {
    getOxygenData
}
