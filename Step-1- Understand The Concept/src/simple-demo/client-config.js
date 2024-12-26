const { Kafka, logLevel } = require("kafkajs");

//Kafkfa Client
const kafka = new Kafka({
  clientId: "simple-producer-consumer-application",
  brokers: ["localhost:9092"],
  connectionTimeout: 3000, // in ms default value is 1000
  requestTimeout: 25000, // in ms default value is 30000
  retry: {
    initialRetryTime: 100, // in ms default value is 300
    retries: 10, // default value is 5
  },
  logLevel: logLevel.INFO, // default is NOTHING
});

// kafka.logger().info(`KafkaJS LogLevel info: ${kafka.logLevel}`);
// kafka.logger().error(`KafkaJS LogLevel error: ${kafka.logLevel}`);
//kafka.console.warn(`KafkaJS LogLevel warn: ${kafka.logLevel}`);
kafka.logger();
