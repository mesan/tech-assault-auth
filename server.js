import Hapi from 'hapi';
import fs from 'fs';
import Bell from 'bell';
import loginFacebookController from './controllers/loginFacebookController';
import logoutController from './controllers/logoutController';
import getUserController from './controllers/getUserController';

let {
    TECH_AUTH_FACEBOOK_CLIENT_ID,
    TECH_AUTH_FACEBOOK_CLIENT_SECRET
} = process.env;

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
        clientId: TECH_AUTH_FACEBOOK_CLIENT_ID,
        clientSecret: TECH_AUTH_FACEBOOK_CLIENT_SECRET,
        isSecure: false
    });

    server.route({
        method: ['GET', 'POST'],
        path: '/login/facebook',
        config: {
            auth: 'facebook',
            handler: loginFacebookController
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
        path: '/users',
        config: {
            auth: false,
            handler: getUserController
        }
    });

    server.start(() => {
        console.log('Server running at:', server.info.uri);
    });
});