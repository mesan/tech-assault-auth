import Hapi from 'hapi';
import fs from 'fs';
import Bell from 'bell';
import loginTwitterController from './controllers/loginTwitterController';
import logoutController from './controllers/logoutController';
import getUserController from './controllers/getUserController';

const envVars = [
    'TECH_AUTH_MONGOLAB_URI',
    'TECH_AUTH_TWITTER_CLIENT_SECRET',
    'TECH_AUTH_TWITTER_CLIENT_ID',
    'TECH_AUTH_TWITTER_PASSWORD',
    'TECH_AUTH_TOKEN_TTL',
    'TECH_AUTH_ID_PREFIX_TWITTER',
    'TECH_AUTH_LOGIN_REDIRECT_URL',
    'TECH_AUTH_LOGOUT_REDIRECT_URL',
    'TECH_AUTH_PATH_PREFIX'
];

let undefinedEnvVars = [];

for (let envVar of envVars) {
    if (typeof process.env[envVar] === 'undefined') {
        undefinedEnvVars.push(envVar);
    }
}

if (undefinedEnvVars.length > 0) {
    console.error(`You need to define the following environment variable(s): ${undefinedEnvVars.join(', ')}`);
    process.exit(1);
}

require("console-stamp")(console, { pattern: 'yymmdd/HHMMss.L'});

var options = {
    opsInterval: 1000,
    reporters: [{
        reporter: require('good-console'),
        events: { log: '*', request: '*', response: '*' }
    }]
};

let {
    TECH_AUTH_TWITTER_CLIENT_SECRET,
    TECH_AUTH_TWITTER_CLIENT_ID,
    TECH_AUTH_TWITTER_PASSWORD,
    TECH_AUTH_PATH_PREFIX
} = process.env;

let server = new Hapi.Server();

server.connection({
    port: process.env.PORT || 3002,
    host: process.env.HOST || 'localhost'
});

server.register({
    register: require('good'),
    options: options
}, function (err) {

    if (err) {
        console.error(err);
    }
    else {
        server.register([Bell], (err) => {

            server.auth.strategy('twitter', 'bell', {
                provider: 'twitter',
                password: TECH_AUTH_TWITTER_PASSWORD,
                clientId: TECH_AUTH_TWITTER_CLIENT_ID,
                clientSecret: TECH_AUTH_TWITTER_CLIENT_SECRET,
                isSecure: false
            });

            server.route({
                method: ['GET', 'POST'],
                path: `${TECH_AUTH_PATH_PREFIX}/login/twitter`,
                config: {
                    auth: 'twitter',
                    handler: loginTwitterController
                }
            });

            server.route({
                method: ['GET'],
                path: `${TECH_AUTH_PATH_PREFIX}/logout/{token}`,
                config: {
                    auth: false,
                    handler: logoutController
                }
            });

            server.route({
                method: ['GET'],
                path: `${TECH_AUTH_PATH_PREFIX}/users/{token}`,
                config: {
                    auth: false,
                    handler: getUserController
                }
            });

            server.start(() => {
                console.log('Server running at:', server.info.uri);
            });
        });
    }
});