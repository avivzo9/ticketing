import { BadReqError, NotFoundError, OrderStatus, requireAuth, validateReq } from "@avzticketing/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

const bodyValidation = [
    body('ticketId').not().isEmpty().custom((input: string) => mongoose.Types.ObjectId.isValid(input)).withMessage('TicketId is required')
];

router.post('/api/orders', requireAuth, bodyValidation, validateReq, async (req: Request, res: Response) => {
    // find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(req.body.ticketId);

    if (!ticket) throw new NotFoundError();

    // make sure that this ticket is not already reserved
    // run query to look at all orders. Find an order where the ticket
    // is the ticket we just found *and* the orders status is *not* cancelled
    // if we find an order from that means the ticket *is* reserved
    const isTicketReserved = await ticket.isReserved();

    if (isTicketReserved) throw new BadReqError('Ticket is already reserved');

    // calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // build the order and save it to the database
    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket
    });

    await order.save();

    // publish an event saying that an order was created

    res.status(201).send(order);
});

export { router as createOrderRouter };