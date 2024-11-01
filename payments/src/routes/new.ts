import { BadReqError, NotAutherizedError, NotFoundError, requireAuth, validateReq } from '@avzticketing/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Order } from '../model/Order';
import { stripe } from '../stripe';
import { Payment } from '../model/payment';
import { PaymentCreatedPublisher } from '../events/payments/paymentCreatedPublisher';
import { natsWrapper } from '../natsWrapper';

const router = express.Router();

const bodyValidation = [
    body('token').not().isEmpty(),
    body('orderId').not().isEmpty()
];

router.post('/api/payments', requireAuth, bodyValidation, validateReq, async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) throw new NotFoundError();
    else if (order.userId !== req.currentUser!.id) throw new NotAutherizedError();
    else if (order.status === 'cancelled') throw new BadReqError('Order is cancelled');

    const charge = await stripe.charges.create({
        currency: 'usd',
        amount: order.price * 100,
        source: token
    });

    const payment = Payment.build({
        orderId,
        stripeId: charge.id
    });

    await payment.save();

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId
    });

    res.status(201).send({ success: true });
});

export { router as createChargeRouter };