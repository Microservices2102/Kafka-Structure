import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "../../../../common/src/index";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
