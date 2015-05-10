import database from '../util/database';
import moment from 'moment';
import Q from 'q';

let {
    TECH_AUTH_TOKEN_TTL
} = process.env;

export default function getSessionController(request, reply) {
    database('profiles')
        .then((collection) => {
            let timeToLive = moment()
                .subtract(TECH_AUTH_TOKEN_TTL, 'seconds')
                .toDate();

            collection.remove({ createdAt: { $lte: timeToLive }});
            
            let profileCursor = collection.find(
                    { token: request.params.token },
                    { name: 1, fullName: 1, createdAt: 1, avatar: 1 });

            profileCursor.toArray((err, docs) => {
                if (docs.length === 0) {
                    return reply().code(404);
                }

                let profile = docs[0];

                return docs.length ? reply(profile) : reply().code(404);
            });
        })
        .fail((err) => {
            console.log(err);
            reply().code(500);
        });
}