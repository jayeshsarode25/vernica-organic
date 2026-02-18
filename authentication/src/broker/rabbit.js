import amqp from 'amqplib'
import config from '../config/config.js'



let channel, connection;

export async function connect(){
    try {
        connection = await amqp.connect(config.RABBITMQ_URI)

    connection.on("error", (err) => {
      console.error("RabbitMQ connection error:", err.message);
    });

    connection.on("close", () => {
      console.warn("RabbitMQ connection closed");
    });

    channel = await connection.createChannel();

     channel.on("error", (err) => {
      console.error("RabbitMQ channel error:", err.message);
    });


    console.log("connect to rabbitmq")
    } catch (error) {
        console.error("Rabbit Mq Failed",error)
    }
}


export async function publishToQueue(queueName, data){
   await channel.assertQueue(queueName, {durable:true});
   await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
   console.log("message send to queue", queueName)
}