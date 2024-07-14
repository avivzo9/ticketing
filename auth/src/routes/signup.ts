import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { ReqValidationError } from '../errors/reqValidationError';
import { DbConnectionError } from '../errors/dbConnectionError';

const router = express.Router();

router.post('/api/users/signup', [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be between 4 and 20 characters')
], async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) throw new ReqValidationError(errors.array());

    const { email, password } = req.body;

    console.log('Creating user');

    throw new DbConnectionError();

    res.send({});
});

export { router as signupRouter };