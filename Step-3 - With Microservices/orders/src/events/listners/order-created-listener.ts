import { Consumer } from "kafkajs";

export class OrderCreatedListener {
  private consumer: Consumer;

  constructor(consumer: Consumer) {
    this.consumer = consumer;
  }

  async listen() {
    await this.consumer.subscribe({
      topic: "order.created",
      fromBeginning: true,
    });

    this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log(
          `Received message from ${topic}:`,
          message.value?.toString()
        );
      },
    });
  }
}
