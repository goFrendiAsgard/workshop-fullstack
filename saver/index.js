// Fetch contants from environment variables
const NATS_URL = process.env.NATS_URL
const MONGO_URL = process.env.MONGO_URL
const MONGO_DB = process.env.MONGO_DB

const subscribeInsertEvent = 'tasks.insert';
const subscribeUpdateEvent = 'tasks.update';
const dbName = 'fullstack'

// Import libraries
const nats = require('nats');
const MongoClient = require('mongodb').MongoClient;

const nc = nats.connect(NATS_URL);

// listen to insert event
nc.subscribe(subscribeInsertEvent, async (subscribeMsg) => {
    console.log(`consume from ${subscribeInsertEvent}: ${subscribeMsg}`);
    const {requestId, tasks} = JSON.parse(subscribeMsg);
    const publishEvent = `${subscribeInsertEvent}.${requestId}`
    // connect to mongo
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    const collection = client.db(MONGO_DB).collection('tasks');
    // insert tasks 
    await collection.insertMany(tasks);
    const publishMsg = JSON.stringify(tasks)
    console.log(`publishing to ${publishEvent}: ${publishMsg}`);
    nc.publish(publishEvent, publishMsg);
});


// listen to update event
nc.subscribe(subscribeUpdateEvent, async (subscribeMsg) => {
    console.log(`consume from ${subscribeUpdateEvent}: ${subscribeMsg}`);
    const {requestId, tasks} = JSON.parse(subscribeMsg);
    const publishEvent = `${subscribeUpdateEvent}.${requestId}`
    // connect to mongo
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    const collection = client.db(MONGO_DB).collection('tasks');
    for(const singleTask of tasks) {
        const {id, task, done} = singleTask;
        await collection.updateOne({_id: id}, {$set: {task, done}});
    }
    // fetch tasks 
    const publishMsg = JSON.stringify(tasks)
    console.log(`publishing to ${publishEvent}: ${publishMsg}`);
    nc.publish(publishEvent, publishMsg);
});
