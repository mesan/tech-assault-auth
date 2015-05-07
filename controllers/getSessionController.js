import database from '../util/database';

export default function getSessionController(request, reply) {

    database('profileCollection')
        .then((collection) => {
            collection.find({
                    token: request.params.token
                }, { name: 1, fullName: 1}).toArray((err, docs) => {

                    if (err) {
                        console.log(err);
                        return reply().code(204);
                    }

                    if (!docs.length) {
                        return reply().code(404);
                    }
                    reply(docs[0]);
                });
        })
        .fail((err) => {
            console.log(err);
            reply().code(204);
        });
}