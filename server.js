import Hapi from 'hapi';
import fs from 'fs';
import Bell from 'bell';
import loginController from './controllers/loginController';
import logoutController from './controllers/logoutController';
import getSessionController from './controllers/getSessionController';

let server = new Hapi.Server();

let tls = (typeof process.env.MODE === 'undefined' || process.env.MODE === 'dev') ? {
    key: fs.readFileSync('./ssl/server.key'),
    cert: fs.readFileSync('./ssl/server.crt'),
    ca: fs.readFileSync('./ssl/ca.crt'),
    requestCert: true,
    rejectUnauthorized: false
} : undefined;

server.connection({
    port: process.env.PORT || 3002,
    tls: tls
});

server.register([Bell], (err) => {

    server.auth.strategy('facebook', 'bell', {
        provider: 'facebook',
        password: 'cookie_encryption_password',
        clientId: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        isSecure: true
    });

    /*server.auth.strategy('session', 'cookie', {
        password: 'cookie',
        cookie: 'sid',
        redirectTo: '/login',
        redirectOnTry: false,
        isSecure: true
    });*/

    server.route({
        method: ['GET', 'POST'],
        path: '/login',
        config: {
            auth: {
                strategy: 'facebook',
                mode: 'try'
            },
            handler: loginController
        }
    });

    server.route({
        method: ['GET'],
        path: '/logout/{token}',
        config: {
            auth: false,
            handler: logoutController
        }
    });

    server.route({
        method: ['GET'],
        path: '/sessions/{token}',
        config: {
            auth: false,
            handler: getSessionController
        }
    });

    server.start(() => {
        console.log('Server running at:', server.info.uri);
    });
});