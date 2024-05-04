const {MongoClient} = require("mongodb");
const {DB_URI, DATABASE, COLLECTION} = require("./config")
const mongoClient = new MongoClient(DB_URI);

async function run() {
    try {
        const database = mongoClient.db(DATABASE);
        const data = database.collection(COLLECTION);
        const list = await data.find().toArray();
        console.log('list', list);

    } catch (err) {
        console.log('DB error', err)
    } finally {
        await mongoClient.close();
    }
}

run().catch(console.dir);
