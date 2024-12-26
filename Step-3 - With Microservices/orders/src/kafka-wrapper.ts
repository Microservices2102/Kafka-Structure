import { Kafka, Consumer, Producer, logLevel } from "kafkajs";

class KafkaWrapper {
  private _producer?: Producer;
  private _consumer?: Consumer;
  private _kafka?: Kafka;

  get producer() {
    if (!this._producer) {
      throw new Error("Cannot access Kafka producer before connecting");
    }
    return this._producer;
  }

  get consumer() {
    if (!this._consumer) {
      throw new Error("Cannot access Kafka consumer before connecting");
    }
    return this._consumer;
  }

  connect(brokers: string[], clientId: string) {
    this._kafka = new Kafka({
      clientId,
      brokers,
      logLevel: logLevel.INFO,
    });

    this._producer = this._kafka.producer({
      idempotent: true,
      maxInFlightRequests: 1,
      transactionalId: process.env.KAFKA_TRANSACTIONAL_ID,
    });
    this._consumer = this._kafka.consumer({ groupId: `${clientId}-group` });

    return new Promise<void>(async (resolve, reject) => {
      try {
        if (this._producer) {
          await this._producer.connect();
        } else {
          throw new Error("Kafka producer is not initialized");
        }
        console.log("Connected to Kafka producer");
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  async subscribe(topic: string, messageHandler: (message: string) => void) {
    if (!this._consumer) {
      throw new Error("Cannot access Kafka consumer before connecting");
    }

    await this._consumer.connect();
    await this._consumer.subscribe({ topic, fromBeginning: true });

    this._consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value?.toString();
        console.log(`Received message: ${value} from topic: ${topic}`);
        if (value) {
          messageHandler(value);
        }
      },
    });
  }

  async publish(topic: string, message: string) {
    if (!this._producer) {
      throw new Error("Cannot access Kafka producer before connecting");
    }

    await this._producer.send({
      topic,
      messages: [{ value: message }],
    });

    console.log(`Message published to topic: ${topic}`);
  }
}

export const kafkaWrapper = new KafkaWrapper();
