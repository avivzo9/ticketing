import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { Listener, OrderCreatedEvent, Subjects } from '@avzticketing/common';
import { QueueGroupName } from './queueGroupName';
import { TicketUpdatedPublisher } from '../publishers/ticketUpdatedPublisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = QueueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const { id, ticket } = data;

        // Find the ticket that the order is reserving
        const reservedTicket = await Ticket.findById(ticket.id);

        // If no ticket, throw error
        if (!reservedTicket) throw new Error('Ticket not found');

        // Mark the ticket as being reserved by setting its orderId property
        reservedTicket.set({ orderId: id });

        // Save the ticket
        await reservedTicket.save();

        // Publish an event saying that the ticket was updated
        await new TicketUpdatedPublisher(this.client).publish({
            id: reservedTicket.id,
            title: reservedTicket.title,
            price: reservedTicket.price,
            userId: reservedTicket.userId,
            version: reservedTicket.version,
            orderId: reservedTicket.orderId
        });

        // Acknowledge the message
        msg.ack();
    }
}