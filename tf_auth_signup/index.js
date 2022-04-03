const AWS = require('aws-sdk');
const helper = require('./helper');
const CONSTANTS = require('./constants');
const db = require('./dynamoDB');
const AmazonCognitoIdentity = new AWS.CognitoIdentityServiceProvider();

const applyValidation = ({ email, password }) => {
    if (!email) helper.throwCustomError(400, 'Email address is required');
    if (!password) helper.throwCustomError(400, 'Password is required');
    email = email.toLowerCase();
}

const addUserToCognito = async (email, password) => {
    const params = {
        ClientId: CONSTANTS.CLIENT_ID,
        Username: email,
        Password: password,
        UserAttributes: [
            { 'Name': 'email', 'Value': email },
            { 'Name': 'custom:userID', 'Value': helper.hashId(email) }
        ]
    };
    return new Promise((resolve, reject) => {
        AmazonCognitoIdentity.signUp(params, (err, result) => {
            if (err) {
                console.error(err)
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

const ssoSignup = async ({ email, password, attributes }) => {
    try {
        let user = await db.getUserData(email);
        if (user) helper.throwCustomError(403, 'Account already exist with this email address');
        await addUserToCognito(email, password)
        await db.postUserData({
            email: email,
            attributes: attributes
        })
        return true;
    } catch (error) {
        console.error(error);
        helper.throwCustomError(error.statusCode, error.message);
    }
}

exports.handler = async (event) => {
    try {
        event = { ...event, ...event.body };
        applyValidation(event);
        await ssoSignup(event);
        return {
            success: true,
            statusCode: 200,
            message: 'Account created. Please verify email.'
        }
    } catch (err) {
        console.error(err);
        return {
            success: false,
            statusCode: err.statusCode || 500,
            message: err.message || 'Something went wrong'
        };
    }
}
