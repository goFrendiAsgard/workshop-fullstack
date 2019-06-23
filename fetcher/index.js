// Fetch contants from environment variables
const NATS_URL = process.env.NATS_URL

// Import libraries
const nats = require('nats');

const subscribeEvent = 'tasks.fetchAll';
const nc = nats.connect(NATS_URL);
nc.subscribe(subscribeEvent, (subscribeMsg) => {
    console.log(`consume from ${subscribeEvent}: ${subscribeEvent}`);
    const {requestId, tasks} = JSON.parse(subscribeMsg);
    const publishEvent = `${subscribeEvent}.${requestId}`
    // TODO: do something with mongo here
    const publishMsg = JSON.stringify(tasks)
    console.log(`publishing to ${publishEvent}: ${publishMsg}`);
    nc.publish(publishEvent, publishMsg);
});

