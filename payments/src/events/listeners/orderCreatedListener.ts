import { Listener, OrderCreatedEvent, Subjects } from "@avzticketing/common";
import { QueueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Order } from "../../model/Order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = QueueGroupName;

    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        const order = Order.build({
            id: data.id,
            version: data.version,
            price: data.ticket.price,
            status: data.status,
            userId: data.userId
        });

        await order.save();

        msg.ack();
    }
}