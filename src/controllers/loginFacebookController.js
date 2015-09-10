import pdb from '../util/pdb';

let {
    TECH_AUTH_ID_PREFIX_FACEBOOK,
    TECH_AUTH_LOGIN_REDIRECT_URL,
    TECH_AUTH_MONGOLAB_URI
} = process.env;

export default function loginFacebookController(request, reply) {
    const cred = request.auth.credentials;

    let avatar = `http://graph.facebook.com/${cred.profile.id}/picture?type=large`;

    const profile = {
        token: cred.token,
        secret: cred.secret,
        id: TECH_AUTH_ID_PREFIX_FACEBOOK + cred.profile.id,
        name: cred.profile.displayName,
        fullName: cred.profile.displayName,
        createdAt: new Date(),
        authProvider: 'facebook',
        avatar: {
            large: avatar
        }
    };

    pdb.connect(TECH_AUTH_MONGOLAB_URI, 'profiles')
        .then(([db, collection]) => {
            return collection.update({ token: cred.token }, profile, { upsert: true });
        })
        .then(() => {
            if (!TECH_AUTH_LOGIN_REDIRECT_URL) {
                return reply.redirect('/');
            }

            return reply.redirect(`${TECH_AUTH_LOGIN_REDIRECT_URL}?token=${profile.token}`);
        })
        .catch((err) => {
            console.log(err.stack);
            reply(err);
        });
}