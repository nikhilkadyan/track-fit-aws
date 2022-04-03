const AWS = require('aws-sdk');
const helper = require('./helper');
const CONSTANTS = require('./constants');
const dbClient = new AWS.DynamoDB.DocumentClient();

const getAllVitals = async (email, fromDate, toDate) => {
    const params = {
        TableName: CONSTANTS.MASTER_TABLE,
        IndexName: CONSTANTS.LSK_INDEX,
        KeyConditionExpression: '#pk = :pk AND #lsk BETWEEN :fromDate AND :toDate',
        ExpressionAttributeNames: {
            '#pk': [CONSTANTS.TABLE_ID],
            '#lsk': [CONSTANTS.TABLE_LSORT]
        },
        ExpressionAttributeValues: {
            ':pk': CONSTANTS.PK_VITAL_OXYGEN + helper.hashId(email),
            ':fromDate': CONSTANTS.LSK_VITAL + fromDate.toString(),
            ':toDate': CONSTANTS.LSK_VITAL + toDate.toString(),
        }
    }
    const { Count, Items } = await dbClient.query(params).promise();
    if (Count && Items && Items.length > 0) return Items;
    return [];
}

module.exports = {
    getAllVitals,
}
