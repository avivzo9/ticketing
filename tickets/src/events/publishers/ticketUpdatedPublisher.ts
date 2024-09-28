import { Publisher, Subjects, TicketUpdatedEvent } from "@avzticketing/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}