const { Kafka } = require("kafkajs");

const kafkaClient = new Kafka({
  clientId: "multi-topic-producer-application",
  brokers: ["localhost:9092"],
});

const startProducer = async () => {
  const producer = kafkaClient.producer();
  await producer.connect();
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
  await producer.sendBatch({
    topicMessages: mesaages,
  });
  await producer.disconnect();
};

const startConsumer = async () => {
  const consumer = kafkaClient.consumer({ groupId: "multi-group" });
  await consumer.connect();
  await consumer.subscribe({ topic: "topic-a", fromBeginning: true });
  await consumer.subscribe({ topic: "topic-b", fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        key: message.key.toString(),
        value: message.value.toString(),
        Headers: message.headers.toString(),
        topic: topic,
        partition: partition,
      });
    },
  });
};

startProducer().then(() => {
  startConsumer();
});
