'use strict';

const ExpressSession = require('express-session');
const RedisStore = require('connect-redis')(ExpressSession);

const Session = ExpressSession({
    store: new RedisStore({
        'host': process.env.REDIS_HOST,
        'pass': process.env.REDIS_PASS
    }),
    secret: process.env.REDIS_ENCODE_SECRET,
    saveUninitialized: false,
    resave: false,
    name: 'sessionID',
    cookie: {
        secure: true,
        httpOnly: true,
        domain: 'brownadphi.org',
        path: '/'
    }
});

module.exports = {
    Session: Session
}