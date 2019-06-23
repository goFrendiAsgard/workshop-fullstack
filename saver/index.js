// Fetch contants from environment variables
const NATS_URL = process.env.NATS_URL

// Import libraries
const nats = require('nats');

const subscribeInsertEvent = 'tasks.insert';
const subscribeUpdateEvent = 'tasks.update';

const nc = nats.connect(NATS_URL);

// listen to insert event
nc.subscribe(subscribeInsertEvent, (subscribeMsg) => {
    console.log(`consume from ${subscribeEvent}: ${subscribeInsertEvent}`);
    const {requestId, tasks} = JSON.parse(subscribeMsg);
    const publishEvent = `${subscribeInsertEvent}.${requestId}`
    // TODO: do something with mongo here
    const publishMsg = JSON.stringify(tasks)
    console.log(`publishing to ${publishEvent}: ${publishMsg}`);
    nc.publish(publishEvent, publishMsg);
});


// listen to update event
nc.subscribe(subscribeUpdateEvent, (subscribeMsg) => {
    console.log(`consume from ${subscribeEvent}: ${subscribeUpdateEvent}`);
    const {requestId, tasks} = JSON.parse(subscribeMsg);
    const publishEvent = `${subscribeUpdateEvent}.${requestId}`
    // TODO: do something with mongo here
    const publishMsg = JSON.stringify(tasks)
    console.log(`publishing to ${publishEvent}: ${publishMsg}`);
    nc.publish(publishEvent, publishMsg);
});
