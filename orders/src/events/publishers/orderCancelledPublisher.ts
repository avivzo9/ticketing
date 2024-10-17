import { OrderCancelledEvent, Publisher, Subjects } from "@avzticketing/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}