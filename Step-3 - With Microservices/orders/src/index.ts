import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { app } from "./app";
import { kafkaWrapper } from "./kafka-wrapper";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";
import { ExpirationCompleteListener } from "./events/listeners/expiration-complete-listener";
import { PaymentCreatedListener } from "./events/listeners/payment-created-listener";

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

    new TicketCreatedListener(kafkaWrapper.consumer).listen();
    new TicketUpdatedListener(kafkaWrapper.consumer).listen();
    new ExpirationCompleteListener(kafkaWrapper.consumer).listen();
    new PaymentCreatedListener(kafkaWrapper.consumer).listen();

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Start the server
    let port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
    app.listen(port, () => {
      console.log(`Listening on port ${port}!!!!!!!!`);
    });
  } catch (err) {
    console.error(err);
  }
};

start();
