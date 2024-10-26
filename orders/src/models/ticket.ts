import mongoose from "mongoose";
import { Order } from "./order";
import { OrderStatus } from "@avzticketing/common";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TicketAttrs {
    id: string;
    title: string;
    price: number;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
    findByEvent(event: { id: string, version: number }): Promise<TicketDoc | null>;
}

export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    isReserved(): Promise<boolean>;
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    toJSON: {
        transform(_, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttrs) => new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price
});

ticketSchema.statics.findByEvent = (event: { id: string, version: number }) => Ticket.findOne({
    _id: event.id,
    version: event.version - 1
});

ticketSchema.methods.isReserved = async function () {
    return Boolean(await Order.findOne({ ticket: this, status: { $ne: OrderStatus.Cancelled } }));
};

export const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);