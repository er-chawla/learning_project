import express from 'express';
import cors from 'cors';
import amqp from 'amqplib';

const app = express();

const PORT = 5050;

app.use(cors());
app.use(express.json());
// For form-submitted payloads
app.use(express.urlencoded({ extended: true }));
const connection = await amqp.connect('amqp://localhost');
const channel = await connection.createChannel();

const queue = 'hello';
const msg = 'Hello World';
await channel.assertQueue(queue, {
    durable: true,
    arguments: {
        'x-queue-type': 'quorum',
    },
});

app.get('/heart-beat', (req, res) => {
    console.log('Here');
    return res.send({ message: 'Server is alive!!' });
});

app.post('/producer', async (req, res) => {
    const body = req.body;

    console.log(`Request Message for Producer :: ${JSON.stringify(body)}`);
    channel.sendToQueue(queue, Buffer.from(body.data.message));
    console.log(' [x] Sent %s', msg);
    return res.send({ message: 'Received!!' });
});

app.listen(PORT, () => {
    console.log(`Producer server is running on Server :: ${PORT}`);
});
