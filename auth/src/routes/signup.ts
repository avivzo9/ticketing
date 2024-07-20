import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadReqError } from '../errors/badReqError';
import { User } from '../models/user';
import { validateReq } from '../middlewares/validateReq';

const router = express.Router();

const bodyValidation = [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be between 4 and 20 characters')
];

router.post('/api/users/signup', bodyValidation, validateReq, async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) throw new BadReqError('Email already in use');

    const user = User.build({ email, password });

    await user.save();

    const userJwt = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY!);

    req.session = { jwt: userJwt };

    return res.status(201).send(user);
});

export { router as signupRouter };