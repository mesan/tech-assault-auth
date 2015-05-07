import Hapi from 'hapi';
import fs from 'fs';
import Bell from 'bell';
import HapiAuthCookie from 'hapi-auth-cookie';

let server = new Hapi.Server();

let tls = (typeof process.env.MODE === 'undefined' || process.env.MODE === 'dev') ? {
    key: fs.readFileSync('./ssl/server.key'),
    cert: fs.readFileSync('./ssl/server.crt'),
    ca: fs.readFileSync('./ssl/ca.crt'),
    requestCert: true,
    rejectUnauthorized: false
} : undefined;

server.connection({
    port: process.env.PORT || 3001,
    tls: tls
});

server.register([Bell, HapiAuthCookie], (err) => {

    server.auth.strategy('facebook', 'bell', {
        provider: 'facebook',
        password: 'cookie_encryption_password',
        clientId: '1601219123428858',
        clientSecret: '757a66e55977dfbed3bf06fc945503c9',
        isSecure: true
    });

    server.auth.strategy('session', 'cookie', {
        password: 'cookie',
        cookie: 'sid',
        redirectTo: '/login',
        redirectOnTry: false,
        isSecure: true
    })

    server.route({
        method: ['GET', 'POST'],
        path: '/login',
        config: {
            auth: 'facebook',
            handler: function(request, reply) {
                var t = request.auth.credentials;

                var profile = {
                    token: t.token,
                    secret: t.secret,
                    id: t.profile.id,
                    name: t.profile.name,
                    fullName: t.profile.displayName,
                };

                request.auth.session.clear();
                request.auth.session.set(profile);

                if (!process.env.LOGIN_REDIRECT_URL) {
                    return reply.redirect('/');
                }

                return reply.redirect(process.env.LOGIN_REDIRECT_URL + '?token=' + t.token);
            }
        }
    });

    server.route({
        method: ['GET'],
        path: '/logout',
        config: {
            auth: 'session',
            handler: function(request, reply) {
                request.auth.session.clear();

                if (!process.env.LOGOUT_REDIRECT_URL) {
                    return reply.redirect('/');
                }

                return reply.redirect(process.env.LOGOUT_REDIRECT_URL);
            }
        }
    });

    server.route({
        method: ['GET'],
        path: '/sessions/{token}',
        config: {
            auth: 'session',
            handler: function(request, reply) {
                reply({
                    email: 'arild.wanvik@gmail.com'
                });
            }
        }
    });

    server.start(() => {
        console.log('Server running at:', server.info.uri);
    });
});