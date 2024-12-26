// consumer.js
const { Kafka } = require("kafkajs");
const config = require("../../configs/config");

const kafkaClient = new Kafka({
  clientId: config.kafka.clientId,
  brokers: config.kafka.brokers,
});

const processMessage = async ({ batch, resolveOffset, heartbeat }) => {
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
  await consumer.subscribe({ topic: "topic-a", fromBeginning: true });
  await consumer.subscribe({ topic: "topic-b", fromBeginning: true });
  await consumer.run({
    eachBatchAutoResolve: true,
    partitionsConsumedConcurrently: 3,
    eachBatch: processMessage,
  });
};

module.exports = { startConsumer };
