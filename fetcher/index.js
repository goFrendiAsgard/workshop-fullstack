// Fetch contants from environment variables
const NATS_URL = process.env.NATS_URL
const MONGO_URL = process.env.MONGO_URL
const MONGO_DB = process.env.MONGO_DB

const subscribeEvent = 'tasks.fetchAll';
const dbName = 'fullstack'

// Import libraries
const nats = require('nats');
const MongoClient = require('mongodb').MongoClient;

const nc = nats.connect(NATS_URL);
nc.subscribe(subscribeEvent, async (subscribeMsg) => {
    console.log(`consume from ${subscribeEvent}: ${subscribeEvent}`);
    const {requestId} = JSON.parse(subscribeMsg);
    const publishEvent = `${subscribeEvent}.${requestId}`
    // connect to mongo
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    const collection = client.db(MONGO_DB).collection('tasks');
    // fetch tasks 
    const tasks = await collection.find({}).toArray();
    // publish tasks
    const publishMsg = JSON.stringify(tasks)
    console.log(`publishing to ${publishEvent}: ${publishMsg}`);
    nc.publish(publishEvent, publishMsg);
    client.close();
});
