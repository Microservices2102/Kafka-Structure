import { Kafka, Consumer, EachMessagePayload } from "kafkajs";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class KafkaListener<T extends Event> {
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  abstract onMessage(data: T["data"], message: EachMessagePayload): void;

  private consumer: Consumer;

  constructor(kafka: Kafka, groupId: string) {
    this.consumer = kafka.consumer({ groupId });
  }

  async listen(brokers: string[]) {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: this.subject, fromBeginning: true });

    console.log(
      `Listening to topic: ${this.subject} in group: ${this.queueGroupName}`
    );

    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        console.log(
          `Message received: ${this.subject} / ${this.queueGroupName}`
        );

        const parsedData = this.parseMessage(payload.message.value?.toString());
        if (parsedData) {
          this.onMessage(parsedData, payload);
        }
      },
    });
  }

  private parseMessage(data: string | undefined) {
    if (!data) {
      console.error("Message data is undefined");
      return null;
    }
    try {
      return JSON.parse(data);
    } catch (err) {
      console.error("Failed to parse message data:", err);
      return null;
    }
  }

  async disconnect() {
    await this.consumer.disconnect();
  }
}
