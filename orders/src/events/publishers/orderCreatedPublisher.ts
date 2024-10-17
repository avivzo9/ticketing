import { OrderCreatedEvent, Publisher, Subjects } from "@avzticketing/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
}