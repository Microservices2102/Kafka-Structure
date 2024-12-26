// import dotenv from "dotenv";
// dotenv.config();

import mongoose from "mongoose";
import { app } from "./app";
import { kafkaWrapper } from "./kafka-wrapper";
// import { OrderCreatedListener } from "./events/listeners/order-created-listener";
// import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";

const start = async () => {
  console.log("Starting...");

  // Check required environment variables
  if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be defined");
  if (!process.env.KAFKA_BROKERS)
    throw new Error("KAFKA_BROKERS must be defined");
  if (!process.env.KAFKA_CLIENT_ID)
    throw new Error("KAFKA_CLIENT_ID must be defined");

  try {
    // Connect to Kafka
    await kafkaWrapper.connect(
      process.env.KAFKA_BROKERS.split(","),
      process.env.KAFKA_CLIENT_ID
    );

    kafkaWrapper.consumer.on("consumer.crash", (e) => {
      console.error("Kafka consumer crashed:", e);
      process.exit();
    });

    process.on("SIGINT", () => kafkaWrapper.producer.disconnect());
    process.on("SIGTERM", () => kafkaWrapper.producer.disconnect());

    // Start listeners
    // new OrderCreatedListener(kafkaWrapper.consumer).listen();
    // new OrderCancelledListener(kafkaWrapper.consumer).listen();
    // new PaymentProcessedListener(kafkaWrapper.consumer).listen();

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Start the server
    app.listen(3000, () => {
      console.log("Listening on port 3000!");
    });
  } catch (err) {
    console.error(err);
  }
};

start();
