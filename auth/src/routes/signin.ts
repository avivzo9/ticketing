import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';
import { validateReq } from '../middlewares/validateReq';
import { BadReqError } from '../errors/badReqError';
import { Password } from '../service/password';
import jwt from 'jsonwebtoken';

const router = express.Router();

const bodyValidation = [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('You must apply a password')
];

router.post('/api/users/signin', bodyValidation, validateReq, async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) throw new BadReqError('Invalid credentials');

    const passwordMatch = await Password.compare(existingUser.password, password);

    if (!passwordMatch) throw new BadReqError('Invalid credentials');

    const userJwt = jwt.sign({ id: existingUser.id, email: existingUser.email }, process.env.JWT_KEY!);

    req.session = { jwt: userJwt };

    return res.status(200).send(existingUser);
});

export { router as signinRouter };