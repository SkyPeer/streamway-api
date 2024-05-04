const {MongoClient} = require("mongodb");
const {DB_URI} = require("./config")
const mongoClient = new MongoClient(DB_URI);

async function run() {
    try {
        const database = mongoClient.db('testdb');
        const data = database.collection('testcollection');
        const list = await data.find().toArray();
        console.log('list', list);

    } catch (err) {
        console.log('DB error', err)
    } finally {
        await mongoClient.close();
    }
}

run().catch(console.dir);
