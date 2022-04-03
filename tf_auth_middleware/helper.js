const https = require('https');
const crypto = require('crypto');
const jwkToPem = require('jwk-to-pem');
const CONSTANTS = require('./constants');

const hashId = (id) => {
    let hashId = crypto.createHash('sha256').update(id).digest('hex');
    hashId = crypto.createHash('sha256').update(hashId).digest('hex');
    return hashId;
}

const throwCustomError = (code, message) => {
    const error = {
        statusCode: code,
        message: message
    }
    throw error;
}

const getPem = async (UserPoolId) => {
	const url = `https://cognito-idp.${CONSTANTS.REGION}.amazonaws.com/${CONSTANTS.USER_POOL_ID}/.well-known/jwks.json`;
	return new Promise((resolve, reject) => {
		https
			.get(url, (resp) => {
				let data = '';

				// A chunk of data has been recieved.
				resp.on('data', (chunk) => {
					data += chunk;
				});

				// The whole response has been received. Print out the result.
				resp.on('end', () => {
					const pems = {};
					const body = JSON.parse(data);
					const keys = body.keys || [];
					for (let i = 0; i < keys.length; i++) {
						const keyId = keys[`${i}`].kid;
						const modulus = keys[`${i}`].n;
						const exponent = keys[`${i}`].e;
						const keyType = keys[`${i}`].kty;
						const jwk = { kty: keyType, n: modulus, e: exponent };
						const pem = jwkToPem(jwk);
						pems[`${keyId}`] = pem;
					}
					resolve(pems);
				});
			})
			.on('error', (err) => {
				err ? reject(err) : resolve({});
			});
	});
}

const generatePolicy = (principalId, effect, resource, email) => {
	const authResponse = {};
	authResponse.principalId = principalId;
	if (effect && resource) {
		const policyDocument = {};
		policyDocument.Version = CONSTANTS.POLICY_VERSION;
		policyDocument.Statement = [];
		const statementOne = {};
		statementOne.Action = 'execute-api:Invoke';
		statementOne.Effect = effect;
		statementOne.Resource = resource;
		policyDocument.Statement[0] = statementOne;
		authResponse.policyDocument = policyDocument;
	}

	// Optional output with custom properties of the String, Number or Boolean type.
	authResponse.context = {
		email: email
	};

	return authResponse;
}

module.exports = {
    hashId,
    throwCustomError,
    getPem,
    generatePolicy
}
