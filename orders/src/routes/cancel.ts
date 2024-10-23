import { NotAutherizedError, NotFoundError, OrderStatus, requireAuth } from "@avzticketing/common";
import express, { Request, Response } from "express";
import { Order } from "../models/order";
import { OrderCancelledPublisher } from "../events/publishers/orderCancelledPublisher";
import { natsWrapper } from "../natsWrapper";

const router = express.Router();

router.patch('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
    const order = await Order.findById(req.params?.orderId).populate('ticket');

    if (!order) throw new NotFoundError();
    if (order.userId !== req.currentUser!.id) throw new NotAutherizedError();

    order.status = OrderStatus.Cancelled;

    await order.save();

    // publish an event saying this was cancelled!

    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
            id: order.ticket.id
        }
    });

    res.status(200).send(order);
});

export { router as cancelOrderRouter };