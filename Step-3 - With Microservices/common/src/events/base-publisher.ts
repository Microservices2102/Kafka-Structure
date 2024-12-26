import { Kafka, Producer } from "kafkajs";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T["subject"];
  private producer: Producer;

  constructor(producer: Producer) {
    this.producer = producer;
  }

  async connect() {
    await this.producer.connect();
    console.log(`Connected to Kafka producer for topic: ${this.subject}`);
  }

  async publish(data: T["data"]): Promise<void> {
    try {
      await this.producer.send({
        topic: this.subject,
        messages: [{ value: JSON.stringify(data) }],
      });
      console.log("Event published to topic", this.subject);
    } catch (err) {
      console.error("Error publishing event to Kafka", err);
      throw err;
    }
  }

  async disconnect() {
    await this.producer.disconnect();
    console.log("Disconnected Kafka producer");
  }
}
