import amqp from 'amqplib';

const connection = await amqp.connect('amqp://localhost');
const channel = await connection.createChannel();

const queue = 'hello';

await channel.assertQueue(queue, {
    durable: true,
    arguments: { 'x-queue-type': 'quorum' },
});

console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue);

channel.consume(
    queue,
    (msg) => {
        console.log(' [x] Received %s', msg?.content.toString());
    },
    {
        noAck: true,
    },
);
