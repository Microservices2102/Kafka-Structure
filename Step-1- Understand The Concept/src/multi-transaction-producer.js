const { Kafka } = require("kafkajs");

const kafkaClient = new Kafka({
  clientId: "transaction-producer",
  brokers: ["localhost:9092"], // Fixed brokers key
});

const startProducer = async () => {
  const producer = kafkaClient.producer({
    idempotent: true, // used to ensure that the producer does not send duplicate messages
    maxInFlightRequests: 1, // 1 = only one message can be sent at a time
    transactionalId: "transaction-producer-id", // Added transactionalId
  });
  await producer.connect();
  const transaction = await producer.transaction();

  const mesaages = [
    {
      topic: "topic-a",
      messages: [
        {
          key: "key-a",
          value: "Hello KafkaJS topic-a!",
        },
      ],
    },
    {
      topic: "topic-b",
      messages: [
        {
          key: "key-b",
          value: "Hello KafkaJS topic-b!",
        },
      ],
    },
  ];

  try {
    await transaction.sendBatch({
      topicMessages: mesaages,
    });
    await transaction.commit();
    await producer.disconnect();
  } catch (error) {
    console.error("Error in transaction:", error); // Added error logging
    await transaction.abort();
    await producer.disconnect();
  } finally {
    await producer.disconnect();
  }
};

const startConsumer = async () => {
  const consumer = kafkaClient.consumer({ groupId: "transaction-group" });
  await consumer.connect();
  await consumer.subscribe({
    topic: "topic-a",
    fromBeginning: true,
  });
  await consumer.subscribe({
    topic: "topic-b",
    fromBeginning: true,
  });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        key: message.key.toString(),
        value: message.value.toString(),
        headers: message.headers ? message.headers.toString() : null, // Check for headers
        topic: topic,
        partition: partition,
      });
    },
  });
};

startProducer().then(() => {
  startConsumer();
});
