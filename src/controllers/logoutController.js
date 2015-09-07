import pdb from '../util/pdb';

const {
    TECH_AUTH_LOGOUT_REDIRECT_URL,
    TECH_AUTH_MONGOLAB_URI
} = process.env;

export default function logoutController(request, reply) {
    pdb.connect(TECH_AUTH_MONGOLAB_URI, 'profiles')
        .then(([db, collection]) => {
            return collection.remove({ token: request.params.token });
        })
        .then(() => {
            if (!TECH_AUTH_LOGOUT_REDIRECT_URL) {
                return reply.redirect('/');
            }

            return reply.redirect(TECH_AUTH_LOGOUT_REDIRECT_URL);
        })
        .catch((err) => {
            console.log(err.stack);
            reply(err);
        });
}