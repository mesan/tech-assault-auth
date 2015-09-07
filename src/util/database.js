import {MongoClient} from 'mongodb';
import Q from 'q';

let { TECH_AUTH_MONGOLAB_URI } = process.env;

export default function connect(collectionId) {
    return Q.nfcall(MongoClient.connect, TECH_AUTH_MONGOLAB_URI)
        .then((db) => {
            return Q.nfcall(db.collection.bind(db), collectionId);
        });
};
