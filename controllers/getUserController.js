import pdb from '../util/pdb';
import moment from 'moment';

const {
    TECH_AUTH_TOKEN_TTL,
    TECH_AUTH_MONGOLAB_URI
} = process.env;

export default function getUserController(request, reply) {
    if (!request.query.token) {
        return reply({ error: 'Please provide a session token as query parameter.' }).code(400);
    }

    let col;

    pdb.connect(TECH_AUTH_MONGOLAB_URI, 'profiles')
        .then(([db, collection]) => {
            col = collection;

            const timeToLive = moment()
                .subtract(TECH_AUTH_TOKEN_TTL, 'seconds')
                .toDate();

            return collection.remove({createdAt: {$lte: timeToLive}});
        })
        .then(() => {
            return col.pfind(
                {token: request.query.token},
                {_id: 0, id: 1, name: 1, fullName: 1, avatar: 1}
            ).toArray();
        })
        .then((docs) => {
            if (docs.length === 0) {
                return reply().code(404);
            }

            return docs[0];
        })
        .then(reply)
        .catch((err) => {
            console.log(err.stack);
            reply(err);
        });
}