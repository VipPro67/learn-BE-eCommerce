const amqp = require("amqplib");
const runConsumer = async () => {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue("test-queue");
  await channel.consume(
    "test-queue",
    (message) => {
      console.log(JSON.parse(message.content.toString()));
    },
    {
      noAck: true,
    }
  );
};

runConsumer().catch(console.error);
  