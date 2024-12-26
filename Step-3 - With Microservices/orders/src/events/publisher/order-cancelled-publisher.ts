import {
  Publisher,
  Subjects,
  OrderCancelledEvent,
} from "../../../../common/src/index";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
