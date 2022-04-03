const throwCustomError = (code, message) => {
    const error = {
        statusCode: code,
        message: message
    }
    throw error;
}

const reformatToken = (token) => {
    token = JSON.parse(JSON.stringify(token));
    return {
        accessToken: token.AccessToken,
        refreshToken: token.RefreshToken,
        expiresIn: token.ExpiresIn,
        tokenType: token.TokenType,
        idToken: token.IdToken,
        oldToken: token.AccessToken
    };
}

module.exports = {
    throwCustomError,
    reformatToken
}
