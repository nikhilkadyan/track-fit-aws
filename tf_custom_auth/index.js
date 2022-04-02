const jwt = require('jsonwebtoken');
const helper = require('./helper');
const CONSTANTS = require('./constants');

exports.handler = async function (event) {
	const bearerToken = event.headers.Authorization;
	const token = bearerToken.includes(CONSTANTS.BEARER)
		? bearerToken.split(' ').length > 1
			? bearerToken.split(' ')[1]
			: null
		: bearerToken;

	if (!token) {
		helper.throwCustomError(403, 'Unauthorized');
	} else {
		try {
			const decodedJwt = jwt.decode(token, { complete: true });
			if (
				!decodedJwt ||
				!decodedJwt.payload ||
				!decodedJwt.payload.exp ||
				!decodedJwt.payload.username
			) {
				helper.throwCustomError(500, 'Unable to decode JWT');
			} else {
				const expiryTime = new Date(decodedJwt.payload.exp * 1000).getTime();
				const currentTime = new Date().getTime();
				const email = decodedJwt.payload.username;
				const values = await Promise.all([
					helper.getPem(CONSTANTS.USER_POOL_ID)
				]);
				const pem = values[0][decodedJwt.header.kid] || '';
				if (expiryTime < currentTime) {
					helper.throwCustomError(403, 'Token expired');
				} else {
					const isValid = jwt.verify(token, pem);
					if (!isValid) {
						helper.throwCustomError(403, 'Invalid Token');
					}
					console.log("gotcha its valid")
					return helper.generatePolicy(
						CONSTANTS.GENERATE_POLICY.USER,
						CONSTANTS.GENERATE_POLICY.ALLOW,
						event.methodArn,
						email
					);
				}
			}
		} catch (error) {
			console.error(error);
			helper.throwCustomError(403, 'Unauthorized');
		}
	}
};
