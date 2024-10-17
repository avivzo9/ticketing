import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

// routes
import { createOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';
import { indexOrderRouter } from './routes';
import { cancelOrderRouter } from './routes/cancel';

// middlewares
import { currentUser, errorHandler, NotFoundError } from '@avzticketing/common';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}));

app.use(currentUser);

app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(cancelOrderRouter);
app.use(createOrderRouter);

app.all('*', async () => {
    throw new NotFoundError();
})

// middlewares
app.use(errorHandler);

export { app };