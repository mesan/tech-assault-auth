import database from '../util/database';

let {
    TECH_AUTH_LOGOUT_REDIRECT_URL
} = process.env;

export default function logoutController(request, reply) {
    database('profileCollection')
        .then((collection) => {
            collection.remove({
                token: request.params.token
            });
        });

    if (!TECH_AUTH_LOGOUT_REDIRECT_URL) {
        return reply.redirect('/');
    }

    return reply.redirect(TECH_AUTH_LOGOUT_REDIRECT_URL);
}