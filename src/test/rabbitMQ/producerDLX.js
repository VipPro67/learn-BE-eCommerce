const amqp = require("amqplib");
const { set } = require("lodash");
const message = { message: "Hello RabbitMQ user " };

const log = console.log;

console.log = function () {
  log.apply(
    console,
    [new Date().toISOString()].concat([].slice.call(arguments))
  );
};

const runProducer = async () => {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  const notificationExchange = "notification-exchange";
  const notificationQueue = "notification-queue";
  const notificationExchangeDLX = "notification-exchange-dlx";
  const notificationRoutingKeyDLX = "notification-routing-key-dlx";

  await channel.assertExchange(notificationExchange, "direct", {
    durable: true,
  });

  const queueResult = await channel.assertQueue(notificationQueue, {
    exclusive: false,
    deadLetterExchange: notificationExchangeDLX,
    deadLetterRoutingKey: notificationRoutingKeyDLX,
  });

  await channel.bindQueue(
    queueResult.queue,
    notificationExchange,
    "notification-routing-key"
  );

  const msg = {
    message: "Hello RabbitMQ user",
  };

  console.log("Sending message to notification exchange");
  await channel.sendToQueue(
    queueResult.queue,
    Buffer.from(JSON.stringify(msg)),
    {
      expiration: "5000",
    }
  );

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
};
runProducer().catch(console.error);
