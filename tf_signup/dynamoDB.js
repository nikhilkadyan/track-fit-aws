const AWS = require('aws-sdk');
const helper = require('./helper');
const CONSTANTS = require('./constants');
const dbClient = new AWS.DynamoDB.DocumentClient();

const getUserData = async (emailAddress) => {
    const params = {
        TableName: CONSTANTS.MASTER_TABLE,
        KeyConditionExpression: '#pk = :pk AND #sk = :sk',
        ExpressionAttributeNames: {
            '#pk': CONSTANTS.TABLE_ID,
            '#sk': CONSTANTS.TABLE_SORT
        },
        ExpressionAttributeValues: {
            ':pk': CONSTANTS.PK_USER + helper.hashId(emailAddress),
            ':sk': CONSTANTS.SK_USER
        }
    };
    const { Count, Items } = await dbClient.query(params).promise();
    if (Count && Items && Items.length > 0) return Items[0];
    return false;
}

const postUserData = async (userDetails) => {
    const currentDate = new Date().getTime();
    let data = {
        [CONSTANTS.TABLE_ID]: CONSTANTS.PK_USER + helper.hashId(userDetails.emailAddress),
        [CONSTANTS.TABLE_SORT]: CONSTANTS.SK_USER,
        createdDate: currentDate,
        modifiedDate: currentDate,
        accountCreatedDate: currentDate,
        emailAddress: userDetails.emailAddress,
        attributes: userDetails.attributes
    };
    const params = {
        TableName: CONSTANTS.MASTER_TABLE,
        Item: data
    };
    return await dbClient.put(params).promise();
}

module.exports = {
    getUserData,
    postUserData
}
