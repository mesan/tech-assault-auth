import database from '../util/database';

export default function logoutController(request, reply) {
    //request.auth.session.clear();
    //

    database('profileCollection')
        .then((collection) => {
            collection.remove({ token: request.params.token });
        });

    if (!process.env.LOGOUT_REDIRECT_URL) {
        return reply.redirect('/');
    }

    return reply.redirect(process.env.LOGOUT_REDIRECT_URL);
}