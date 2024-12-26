const { Kafka } = require("kafkajs");

//Kafkfa Client
const kafka = new Kafka({
  clientId: "simple-producer-consumer-application",
  brokers: ["localhost:9092"],
});

const producerRun = async () => {
  //Kafjka Producer
  const producer = kafka.producer();
  await producer.connect();
  await producer.send({
    topic: "simple-topic",
    messages: [{ value: "Hello KafkaJS user!" }],
  });
  await producer.send({
    topic: "simple-topic",
    messages: [{ value: "Hello KafkaJS user2!" }],
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
        value: message.value.toString(),
      });
    },
  });
};

producerRun().then(() => {
  startConsumer();
});
