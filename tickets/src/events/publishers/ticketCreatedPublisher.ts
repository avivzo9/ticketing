import { Publisher, Subjects, TicketCreatedEvent } from "@avzticketing/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}