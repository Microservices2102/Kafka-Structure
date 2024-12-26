import {
  Publisher,
  OrderCreatedEvent,
  Subjects,
} from "../../../../common/src/index";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
