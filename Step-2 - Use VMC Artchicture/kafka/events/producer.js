// producer.js
const { Kafka } = require("kafkajs");
const config = require("../../configs/config");

const kafkaClient = new Kafka({
  clientId: config.kafka.clientId,
  brokers: config.kafka.brokers,
});

const startProducer = async (topic, key, value) => {
  const producer = kafkaClient.producer({
    idempotent: true,
    maxInFlightRequests: 1,
    transactionalId: config.kafka.transactionalId,
  });
  await producer.connect();
  const transaction = await producer.transaction();

  const messages = [
    {
      topic,
      messages: [
        {
          key,
          value,
        },
      ],
    },
  ];

  try {
    await transaction.sendBatch({
      topicMessages: messages,
    });
    await transaction.commit();
  } catch (error) {
    console.error("Error in transaction:", error);
    await transaction.abort();
  } finally {
    await producer.disconnect();
  }
};

module.exports = { startProducer };
