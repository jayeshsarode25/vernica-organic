import amqp from "amqplib";
import config from "../config/config.js";

let channel, connection;

export async function connect() {
  connection = await amqp.connect(config.RABBITMQ_URI);
  channel = await connection.createChannel();

  console.log("connect to rabbitmq");
}

export async function publishToQueue(queueName, data) {
  await channel.assertQueue(queueName, { durable: true });
  await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
  console.log("message send to queue", queueName);
}

export async function subscribeToQueue(queueName, callback) {
  await channel.assertQueue(queueName, { durable: true });

  channel.consume(queueName, async (msg) => {
    if (!msg) return;

    try {
      const data = JSON.parse(msg.content.toString());
      await callback(data);
      await channel.ack(msg);
    } catch (error) {
      console.error("QUEUE PROCESS FAILED:", error);
      channel.nack(msg, false, false);
    }
  });
}
