"use strict";
const amqp = require("amqplib");

async function consumerOrderMessage() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  const queueName = "order-queue";

  await channel.assertQueue(queueName, {
    durable: true,
  });

  channel.prefetch(1);

  channel.consume(queueName, (message) => {
    setTimeout(() => {
      console.log("Consumer:", message.content.toString());
      channel.ack(message);
    }, Math.random() * 1000); // Corrected the syntax here
  });

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 5000); // Increased the timeout to allow for message processing
}

consumerOrderMessage().catch(console.error);
