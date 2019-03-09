'use script';

const { google } = require('googleapis');

function getOauth2Client() {
    return new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID, // CLIENT_ID
        process.env.GOOGLE_CLIENT_SECRET,  // CLIENT_SECRET
        "https://brownadphi.org" + "/login-confirm" // REDIRECT_URI
    );
}

function authenticate(req) {
    const session = req.session;
    if (!session) {
        return null;
    }
    const tokens = session.tokens;
    if (!tokens) {
        return null;
    }
    const oauth2Client = getOauth2Client();
    oauth2Client.setCredentials(tokens);
    return oauth2Client;
}

module.exports = {
    getOauth2Client: getOauth2Client,
    authenticate: authenticate,
};