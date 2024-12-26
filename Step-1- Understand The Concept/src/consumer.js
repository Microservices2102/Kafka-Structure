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

const processMessage = async ({
  batch,
  resolveOffset,
  heartbeat,
  commitOffsetIfNecessary,
  uncommitedOffsets,
  isState,
}) => {
  for (let message of batch.messages) {
    console.log({
      topic: batch.topic,
      message: {
        offset: message.offset,
        key: message.key.toString(),
        value: message.value.toString(),
      },
    });
    resolveOffset(message.offset);
    await heartbeat();
  }
};

const startConsumer = async () => {
  const consumer = kafkaClient.consumer({ groupId: "multi-group" });
  await consumer.connect();

  //listen to multiple topics
  await consumer.subscribe({ topic: "topic-a", fromBeginning: true });
  await consumer.subscribe({ topic: "topic-b", fromBeginning: true });
  await consumer.run({
    eachBatchAutoResolve: true, //use this to automatically commit the offset
    partitionsConsumedConcurrently: 3, //use this to control the number of partitions to consume concurrently
    eachBatch: processMessage, //use this to process the message
  });
};

startProducer().then(() => {
  startConsumer();
});
