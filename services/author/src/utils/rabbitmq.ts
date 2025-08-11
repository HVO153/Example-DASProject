import amqp from 'amqplib';

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect({
            protocol: 'amqp',
            hostname: process.env.Rabbimq_Host,
            port: 5672,
            username: process.env.Rabbimq_Username,
            password: process.env.Rabbimq_Password,
        });

        channel = await connection.createChannel();

        console.log("✅ Connected to RabbitMQ");
    } catch (error) {
        console.error("❌ Failed to connect to RabbitMQ", error);
    }
};

export const publishToQueue = async (queueName: string, message: any) => {
    if (!channel) {
        console.error("Rabitmq channel is not initialized");
        return;
    }

    await channel.assertQueue(queueName, { durable: true });

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
        persistent: true,
    });
};

export const invalidateCacheJob = async (cacheKeys: string[]) => {
    try {
        const message = {
            action: "invalidateCache",
            keys: cacheKeys,
        };

        await publishToQueue("cache-invalidation", message);

        console.log("✅ Cache invalidation job published to Rabbitmq");
    } catch (error) {
        console.error("❌ Failed to Published cache on Rabbitmq", error);
    }
};