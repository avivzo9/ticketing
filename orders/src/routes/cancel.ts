import { NotAutherizedError, NotFoundError, OrderStatus, requireAuth } from "@avzticketing/common";
import express, { Request, Response } from "express";
import { Order } from "../models/order";

const router = express.Router();

router.patch('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
    const order = await Order.findById(req.params?.orderId);

    if (!order) throw new NotFoundError();
    if (order.userId !== req.currentUser!.id) throw new NotAutherizedError();

    order.status = OrderStatus.Cancelled;

    await order.save();

    // TODO: publish an event saying this was cancelled!

    res.status(200).send(order);
});

export { router as cancelOrderRouter };