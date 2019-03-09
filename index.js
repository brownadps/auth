/* use strict */

const BodyParser = require('body-parser');
const Express = require('express');
const { google } = require('googleapis');
const Helmet = require('helmet');

const Auth = require('./auth.js');
const { Session } = require('./session.js');

const App = Express();
const Router = Express.Router();
const PORT = 8080;
const SCOPES = ['openid profile email', 'https://www.googleapis.com/auth/gmail.send'];

const AuthorizeUrl = Auth.getOauth2Client().generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES.join(' '),
    prompt: 'consent'
});

App.set('trust proxy', 1);

if (process.env.PROD === "true") {
  App.use(Helmet());
}

App.use('/', Session);
App.use('/', BodyParser.urlencoded({
  extended: false
}));

Router.get('/authurl', (req, res) => {
    res.status(200).json({
        status: 200,
        data: {
            authurl: AuthorizeUrl
        }
    });
});

Router.get('/login-confirm', async (req, res) => {
    const code = req.query.code;
    if (!code || code == '') {
        return res.status(400).json({
            status: 400,
            reason: 'Authorization code not included in request.'
        })
    }
    const { tokens } = await Auth.getOauth2Client().getToken(code);
    console.log(tokens);
    session = {
        tokens: tokens
    };
    req.session.key = req.sessionID;
    Object.assign(req.session, session);
    res.status(302).set('Location', '/').send();
    
});

Router.get('/issignedin', async (req, res) => {
    var data;
    if (req.session.key) {
        data = {
            status: 200,
            data: { issignedin: true }
        }
    } else {
        data = {
            status: 403,
            data: { issignedin: false }
        }
    }
    res.status(data.status).json(data);
});

Router.post('/signout', (req, res) => {
  delete req.session;
  res.status(201).send({
      status: 201,
      message: 'Success: Deleted session'
  });
});

App.use('/', Router);

App.listen(PORT, function () {
  console.log('Example app listening on port 8080!');
});