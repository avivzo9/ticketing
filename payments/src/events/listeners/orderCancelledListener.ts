import { Listener, OrderCancelledEvent, OrderStatus, Subjects } from "@avzticketing/common";
import { QueueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Order } from "../../model/Order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
    queueGroupName = QueueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const order = await Order.findByEvent(data);

        if (!order) throw new Error('Order not found');

        order.set({ status: OrderStatus.Cancelled });

        await order.save();

        msg.ack();
    }
};