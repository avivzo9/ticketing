import { NotAutherizedError, NotFoundError, requireAuth, validateReq } from '@avzticketing/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';

const router = express.Router();

const bodyValidation = [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0')
];

router.put('/api/tickets/:id', requireAuth, bodyValidation, validateReq, async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) throw new NotFoundError();
    if (ticket.userId !== req.currentUser!.id) throw new NotAutherizedError();

    ticket.set({ title: req.body.title, price: req.body.price });

    await ticket.save();

    res.send(ticket);
});

export { router as updateTicketRouter };