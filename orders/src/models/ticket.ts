import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";

interface TicketAttrs {
    title: string;
    price: number;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
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

ticketSchema.statics.build = (attrs: TicketAttrs) => new Ticket(attrs);

ticketSchema.methods.isReserved = async function () {
    return Boolean(await Order.findOne({ ticket: this, status: { $ne: OrderStatus.Cancelled } }));
    // $in: [OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Complete]
};

export const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);