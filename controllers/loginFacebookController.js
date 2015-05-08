import database from '../util/database';

export default function loginFacebookController(request, reply) {
    console.log(request.auth.error);

    var cred = request.auth.credentials;

    var profile = {
        token: process.env.FACEBOOK_LOGIN_TOKEN_PREFIX + cred.token,
        secret: cred.secret,
        id: cred.profile.id,
        name: cred.profile.name,
        fullName: cred.profile.displayName,
        createdAt: new Date()
    };

    database('profileCollection')
        .then((collection) => {
            collection.insert(profile);
        })
        .fail((err) => {
            console.log(err);
        });

    /*request.auth.session.clear();
    request.auth.session.set(profile);*/

    if (!process.env.LOGIN_REDIRECT_URL) {
        return reply.redirect('/');
    }

    return reply.redirect(process.env.LOGIN_REDIRECT_URL + '?token=' + profile.token);
}