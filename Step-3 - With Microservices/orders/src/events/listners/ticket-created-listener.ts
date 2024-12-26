import {
  Subjects,
  Listener,
  TicketCreatedEvent,
} from "../../../../common/src/index";
import { kafkaWrapper } from "../../kafka-wrapper";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"]) {
    const { id, title, price } = data;

    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();
  }

  async listen() {
    await kafkaWrapper.subscribe(this.subject, async (message: string) => {
      const data: TicketCreatedEvent["data"] = JSON.parse(message);
      await this.onMessage(data);
    });
  }
}
