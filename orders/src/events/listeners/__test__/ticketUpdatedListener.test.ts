import mongoose from "mongoose";
import { natsWrapper } from "../../../natsWrapper";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { TicketUpdatedListener } from "../ticketUpdatedListener";
import { TicketUpdatedEvent } from "@avzticketing/common";

const setup = async () => {
    // Create a listener
    const listener = new TicketUpdatedListener(natsWrapper.client);
    // Create and save a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });

    await ticket.save();
    // Create a fake data event
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'new concert',
        price: 999,
        userId: new mongoose.Types.ObjectId().toHexString()
    };
    // Create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };
    // return all of this stuff
    return { listener, ticket, data, msg };
};

it('finds, updates, and saves a ticket', async () => {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
    const { listener, data, msg } = await setup();

    data.version = 10;

    try {
        await listener.onMessage(data, msg);
    } catch (err) { }

    expect(msg.ack).not.toHaveBeenCalled();
});