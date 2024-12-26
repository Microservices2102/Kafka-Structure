import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  OrderStatus,
} from "../../../../common/src/index";
import { kafkaWrapper } from "../../kafka-wrapper";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent["data"]) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();
  }

  async listen() {
    await kafkaWrapper.subscribe(this.subject, async (message: string) => {
      const data: PaymentCreatedEvent["data"] = JSON.parse(message);
      await this.onMessage(data);
    });
  }
}
