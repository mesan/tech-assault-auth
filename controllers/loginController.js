import database from '../util/database';

export default function loginController(request, reply) {
    console.log(request.auth.error);
    
    var t = request.auth.credentials;

    var profile = {
        token: t.token,
        secret: t.secret,
        id: t.profile.id,
        name: t.profile.name,
        fullName: t.profile.displayName,
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

    return reply.redirect(process.env.LOGIN_REDIRECT_URL + '?token=' + t.token);
}