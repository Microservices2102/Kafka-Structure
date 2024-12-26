const { Kafka } = require("kafkajs");

//Kafkfa Client
const kafka = new Kafka({
  clientId: "simple-producer-consumer-application",
  brokers: ["localhost:9092"],
});

const startProducer = async () => {
  //Kafjka Producer
  const producer = kafka.producer();
  await producer.connect();
  /*
  constrol the number of requied ack
  -1 = all insync replicas must ackowledge
  0 = no acklowledgement
  1 = only waits for the leader must acknowledge
  */
  await producer.send({
    topic: "simple-topic",
    acks: -1, // 0 - no ack, 1 - leader ack, -1 - all ack, default is 1
    messages: [
      {
        key: "Key1",
        value: "Hello KafkaJS user!",
        headers: {
          "correlation-id": "uuid",
        },
        // partition: 0, // partition 0 else broker decide partition bu own
      },
      { key: "Key2", value: "Second user!" },
    ],
  });
  await producer.disconnect();
};

const startConsumer = async () => {
  //Kafka Consumer
  const consumer = kafka.consumer({ groupId: "simple-group" });
  await consumer.connect();
  await consumer.subscribe({ topic: "simple-topic", fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        key: message.key.toString(),
        value: message.value.toString(),
        headers: message.headers.toString(),
        topic: topic,
        partition: partition,
      });
    },
  });
};

startProducer().then(() => {
  startConsumer();
});
