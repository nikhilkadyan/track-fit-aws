const AWS = require('aws-sdk');
const helper = require('./helper');
const CONSTANTS = require('./constants');
const dbClient = new AWS.DynamoDB.DocumentClient();

const getBpData = async (email, fromDate, toDate) => {
    const params = {
        TableName: CONSTANTS.MASTER_TABLE,
        KeyConditionExpression: '#pk = :pk AND #sk BETWEEN :fromDate AND :toDate',
        ExpressionAttributeNames: {
            '#pk': [CONSTANTS.TABLE_ID],
            '#sk': [CONSTANTS.TABLE_SORT]
        },
        ExpressionAttributeValues: {
            ':pk': CONSTANTS.PK_VITAL_BP + helper.hashId(email),
            ':fromDate': CONSTANTS.SK_VITAL_BP + fromDate.toString(),
            ':toDate': CONSTANTS.SK_VITAL_BP + toDate.toString(),
        }
    }
    const { Count, Items } = await dbClient.query(params).promise();
    if (Count && Items && Items.length > 0) return Items;
    return [];
}

const getTempData = async (email, fromDate, toDate) => {
    const params = {
        TableName: CONSTANTS.MASTER_TABLE,
        KeyConditionExpression: '#pk = :pk AND #sk BETWEEN :fromDate AND :toDate',
        ExpressionAttributeNames: {
            '#pk': [CONSTANTS.TABLE_ID],
            '#sk': [CONSTANTS.TABLE_SORT]
        },
        ExpressionAttributeValues: {
            ':pk': CONSTANTS.PK_VITAL_TEMP + helper.hashId(email),
            ':fromDate': CONSTANTS.SK_VITAL_TEMP + fromDate.toString(),
            ':toDate': CONSTANTS.SK_VITAL_TEMP + toDate.toString(),
        }
    }
    const { Count, Items } = await dbClient.query(params).promise();
    if (Count && Items && Items.length > 0) return Items;
    return [];
}

const getOxygenData = async (email, fromDate, toDate) => {
    const params = {
        TableName: CONSTANTS.MASTER_TABLE,
        KeyConditionExpression: '#pk = :pk AND #sk BETWEEN :fromDate AND :toDate',
        ExpressionAttributeNames: {
            '#pk': [CONSTANTS.TABLE_ID],
            '#sk': [CONSTANTS.TABLE_SORT]
        },
        ExpressionAttributeValues: {
            ':pk': CONSTANTS.PK_VITAL_OXYGEN + helper.hashId(email),
            ':fromDate': CONSTANTS.SK_VITAL_OXYGEN + fromDate.toString(),
            ':toDate': CONSTANTS.SK_VITAL_OXYGEN + toDate.toString(),
        }
    }
    const { Count, Items } = await dbClient.query(params).promise();
    if (Count && Items && Items.length > 0) return Items;
    return [];
}

module.exports = {
    getBpData,
    getTempData,
    getOxygenData,
}
