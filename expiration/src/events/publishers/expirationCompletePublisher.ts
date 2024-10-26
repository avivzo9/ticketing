import { ExpirationCompleteEvent, Publisher, Subjects } from "@avzticketing/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
}