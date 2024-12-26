import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from "../../../../common/src/index";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
