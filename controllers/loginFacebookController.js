import database from '../util/database';

let {
    TECH_AUTH_FACEBOOK_LOGIN_TOKEN_PREFIX,
    TECH_AUTH_LOGIN_REDIRECT_URL
} = process.env;

export default function loginFacebookController(request, reply) {
    var cred = request.auth.credentials;

    var profile = {
        token: TECH_AUTH_FACEBOOK_LOGIN_TOKEN_PREFIX + cred.token,
        secret: cred.secret,
        id: cred.profile.id,
        name: cred.profile.name,
        fullName: cred.profile.displayName,
        createdAt: new Date(),
        authProvider: 'facebook'
    };

    database('profiles')
        .then((collection) => {
            collection.insert(profile);
        })
        .fail((err) => {
            console.log('failed', err);
        });

    if (!TECH_AUTH_LOGIN_REDIRECT_URL) {
        return reply.redirect('/');
    }

    return reply.redirect(TECH_AUTH_LOGIN_REDIRECT_URL + '?token=' + profile.token);
}