import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../natsWrapper";
import { OrderCancelledListener } from "../orderCancelledListener";
import { OrderCancelledEvent } from "@avzticketing/common";

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);
    const orderId = new mongoose.Types.ObjectId().toHexString();

    const ticket = Ticket.build({
        title: 'concert',
        price: 10,
        userId: 'asdf'
    });

    ticket.set({ orderId });

    await ticket.save();

    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: ticket.version,
        ticket: {
            id: ticket.id
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, ticket, data, msg };
};

it('updates the ticket, publishes an event, and acks the message', async () => {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});