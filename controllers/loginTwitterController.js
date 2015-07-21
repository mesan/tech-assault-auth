import database from '../util/database';

let {
    TECH_AUTH_ID_PREFIX_TWITTER,
    TECH_AUTH_LOGIN_REDIRECT_URL
} = process.env;

export default function loginFacebookController(request, reply) {
    let cred = request.auth.credentials;

    let avatar = `https://twitter.com/${cred.profile.username}/profile_image?size=original`;

    let profile = {
        token: cred.token,
        secret: cred.secret,
        id: TECH_AUTH_ID_PREFIX_TWITTER + cred.profile.id,
        name: cred.profile.displayName,
        fullName: cred.profile.displayName,
        createdAt: new Date(),
        authProvider: 'twitter',
        avatar: {
            large: avatar
        }
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

    return reply.redirect(`${TECH_AUTH_LOGIN_REDIRECT_URL}?token=${profile.token}`);
}