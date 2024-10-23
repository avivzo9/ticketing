import { Listener, Subjects, TicketUpdatedEvent } from "@avzticketing/common";
import { QueueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
    queueGroupName = QueueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const { title, price } = data;

        const ticket = await Ticket.findByEvent(data);

        if (!ticket) throw new Error('Ticket not found');

        ticket.set({ title, price });

        await ticket.save();

        msg.ack();
    }
}