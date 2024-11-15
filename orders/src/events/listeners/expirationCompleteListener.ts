import { ExpirationCompleteEvent, Listener, OrderStatus, Subjects } from "@avzticketing/common";
import { Message } from "node-nats-streaming";
import { QueueGroupName } from "./queueGroupName";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/orderCancelledPublisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
    queueGroupName = QueueGroupName;

    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId).populate('ticket');

        if (!order) throw new Error('Order not found');
        else if (order.status === OrderStatus.Complete) return msg.ack();

        order.set({ status: OrderStatus.Cancelled });

        await order.save();

        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        });

        msg.ack();
    }
}