import { PaymentCreatedEvent, Publisher, Subjects } from "@avzticketing/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}