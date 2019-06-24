// Fetch contants from environment variables
const NATS_URL = process.env.NATS_URL
const MONGO_URL = process.env.MONGO_URL
const MONGO_DB = process.env.MONGO_DB

const subscribeInsertEvent = 'tasks.insert';
const subscribeUpdateEvent = 'tasks.update';
const dbName = 'fullstack'

// Import libraries
const nats = require('nats');
const {ObjectId, MongoClient} = require('mongodb');

const nc = nats.connect(NATS_URL);

// listen to insert event
nc.subscribe(subscribeInsertEvent, async (subscribeMsg) => {
    console.log(`consume from ${subscribeInsertEvent}: ${subscribeMsg}`);
    let {requestId, tasks} = JSON.parse(subscribeMsg);
    tasks = preprocessTasks(tasks);
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
    let {requestId, tasks} = JSON.parse(subscribeMsg);
    tasks = preprocessTasks(tasks);
    const publishEvent = `${subscribeUpdateEvent}.${requestId}`
    // connect to mongo
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    const collection = client.db(MONGO_DB).collection('tasks');
    for(const singleTask of tasks) {
        const {_id, task, done} = singleTask;
        await collection.updateOne({_id: ObjectId(_id)}, {$set: {task, done}});
    }
    // fetch tasks 
    const publishMsg = JSON.stringify(tasks)
    console.log(`publishing to ${publishEvent}: ${publishMsg}`);
    nc.publish(publishEvent, publishMsg);
});

function preprocessTasks(tasks) {
    return tasks.map((task) => {
        task.task = task.task || '';
        task.done = task.done || false;
        return task;
    });
}
