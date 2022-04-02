const CONSTANTS = require('./constants.js');
const helper = require('./helper.js');
const AWS = require('aws-sdk');
const AmazonCognitoIdentity = new AWS.CognitoIdentityServiceProvider();

const applyValidation = ({ emailAddress, password, refreshToken }) => {
    if (!refreshToken) {
        if (!emailAddress) helper.throwCustomError(400, 'Email address is required');
        if (!password) helper.throwCustomError(400, 'Password is required');
        emailAddress = emailAddress.toLowerCase();
    }
}

const ssoLogin = async ({ emailAddress, password, refreshToken }) => {
    try {
        const params = {
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: CONSTANTS.CLIENT_ID,
            AuthParameters: { USERNAME: emailAddress, PASSWORD: password }
        };
        if (refreshToken) {
            params.AuthFlow = 'REFRESH_TOKEN';
            params.AuthParameters = { REFRESH_TOKEN: refreshToken };
        };
        let auth = await AmazonCognitoIdentity.initiateAuth(params).promise();
        if (auth.ChallengeName === 'NEW_PASSWORD_REQUIRED') helper.throwCustomError(403, 'User need to reset password.')
        if (auth.ChallengeName && auth.ChallengeName.length > 0) throw auth;
        return helper.reformatToken(auth.AuthenticationResult);
    } catch (error) {
        helper.throwCustomError(403, error.message || 'Unable to login user');
    }
}

exports.handler = async (event) => {
    try {
        event = { ...event, ...event.body };
        applyValidation(event);
        const token = await ssoLogin(event);
        return {
            success: true,
            statusCode: 200,
            message: "Login successful",
            ...token
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
