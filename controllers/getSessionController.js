import database from '../util/database';
import moment from 'moment';
import Q from 'q';

export default function getSessionController(request, reply) {
    database('profileCollection')
        .then((collection) => {
            
            let oneMonthAgo = moment()
                .subtract(process.env.TECH_AUTH_TOKEN_TTL, 'seconds')
                .toDate();

            collection.remove({ createdAt: { $lte: oneMonthAgo }}, (err, docs) => {
                if (err) {
                    console.log(err);
                    return reply(err).code(500);
                }

                collection.find(
                    { token: request.params.token },
                    { name: 1, fullName: 1, createdAt: 1 })
                .toArray((err, docs) => {
                    if (err) {
                        console.log(err);
                        return reply(err).code(500);
                    }

                    if (!docs.length) {
                        return reply().code(404);
                    }

                    reply(docs[0]);
                });
            });
        })
        .fail((err) => {
            console.log(err);
            reply().code(204);
        });
}