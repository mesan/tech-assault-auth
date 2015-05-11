import database from '../util/database';
import moment from 'moment';
import Q from 'q';

let {
    TECH_AUTH_TOKEN_TTL
} = process.env;

export default function getUserController(request, reply) {
    if (!request.query.token) {
        return reply({ error: 'Please provide a session token as query parameter.' }).code(400);
    }

    database('profiles')
        .then((collection) => {
            let timeToLive = moment()
                .subtract(TECH_AUTH_TOKEN_TTL, 'seconds')
                .toDate();

            collection.remove({ createdAt: { $lte: timeToLive }});
            
            let profileCursor = collection.find(
                    { token: request.query.token },
                    { _id: 0, id: 1, name: 1, fullName: 1, avatar: 1 });

            profileCursor.toArray((err, docs) => {
                if (docs.length === 0) {
                    return reply().code(404);
                }

                let profile = docs[0];

                return reply(profile);
            });
        })
        .fail((err) => {
            console.log(err);
            reply().code(500);
        });
}