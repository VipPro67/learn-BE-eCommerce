"use strict";
const amqp = require("amqplib");

async function producerOrderMessage() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  const queueName = "order-queue";

  await channel.assertQueue(queueName, {
    durable: true,
  });

  for (let i = 0; i < 10; i++) {
    const message = "Order " + i;
    channel.sendToQueue(queueName, Buffer.from(message), {
      persistent: true,
    });
    console.log("Send success: " + message);
  }

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}

producerOrderMessage().catch(console.error);
