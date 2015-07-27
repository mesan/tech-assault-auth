import pdb from '../util/pdb';

const {
    TECH_AUTH_ID_PREFIX_TWITTER,
    TECH_AUTH_LOGIN_REDIRECT_URL,
    TECH_AUTH_MONGOLAB_URI
} = process.env;

export default function loginTwitterController(request, reply) {
    const cred = request.auth.credentials;

    const avatar = `https://twitter.com/${cred.profile.username}/profile_image?size=original`;

    const profile = {
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