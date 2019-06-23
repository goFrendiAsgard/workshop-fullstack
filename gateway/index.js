// Fetch contants from environment variables
const NATS_URL = process.env.NATS_URL
const HTTP_PORT = process.env.HTTP_PORT

// Import libraries
const express = require('express');
const bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4');
const nats = require('nats');

// Initiate HTTP Server
const app = express();
app.use(bodyParser.json());

// Define route: index page
app.get('/', (req, res) => res.send('Please check out <a target="blank" href="https://todolist86.docs.apiary.io">our apiary</a>'));

// Define route: list all tasks
app.get('/tasks', createHandler('tasks.fetchAll'));

// Define route: new tasks
app.post('/tasks', createHandler('tasks.insert'));

// Define route: edit existing tasks
app.put('/tasks', createHandler('tasks.update'));

// Start HTTP Server at HTTP_PORT
app.listen(HTTP_PORT, () => console.log(`Example app listening on port ${HTTP_PORT}!`))

// As all API endpoints do the same thing, let's make common handler for that
function createHandler(publishEvent) {
    return (req, res) => {
        const requestId = uuidv4();
        const subscribeEvent = `${publishEvent}.${requestId}`
        const nc = nats.connect(NATS_URL);
        // subscribe
        const sid = nc.subscribe(subscribeEvent, (subscribeMsg) => {
            console.log(`consume from ${subscribeEvent}: ${subscribeEvent}`);
            nc.unsubscribe(sid);
            const tasks = JSON.parse(subscribeMsg);
            res.setHeader('Content-Type', 'text/json');
            res.send(tasks);
        });
        // publish
        const publishMsg = JSON.stringify({requestId, tasks: req.body});
        console.log(`publishing to ${publishEvent}: ${publishMsg}`);
        nc.publish(publishEvent, publishMsg);
    }
}
