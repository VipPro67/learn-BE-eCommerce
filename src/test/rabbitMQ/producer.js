const amqp = require("amqplib");
const message = { message: "Hello RabbitMQ user " };
const runProducer = async () => {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue("test-queue", {
    durable: true,
  });
  await channel.sendToQueue("test-queue", Buffer.from(JSON.stringify(message)));
  await channel.close();
  await connection.close();
};
runProducer().catch(console.error);
