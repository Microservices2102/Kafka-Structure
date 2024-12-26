// config.js
module.exports = {
  kafka: {
    clientId: "multi-topic-producer-application",
    brokers: ["localhost:9092"],
    transactionalId: "transaction-producer-id",
  },
};
