import {MongoClient} from 'mongodb';
import Q from 'q';

export default function connect(collectionId) {
    return Q.nfcall(MongoClient.connect, 'mongodb://' + process.env.MONGOLAB_TECH_AUTH_URI)
        .then((db) => {
            return Q.nfcall(db.collection.bind(db), collectionId);
        })
        .fail((err) => {
            console.log(err);
        });
};
