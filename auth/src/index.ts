import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

// routers
import { currentUserRouter } from './routes/currentUser';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

// middlewares
import { errorHandler } from './middlewares/errorHandler';
import { NotFoundError } from './errors/notFoundError';
import mongoose from 'mongoose';

const app = express();
app.use(json());

// use routers
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async () => {
    throw new NotFoundError();
})

// middlewares
app.use(errorHandler);

const init = async () => {
    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
        console.log('Connected to mongoDB');
    } catch (err) {
        console.log('init', err);
    }

    app.listen(3000, () => {
        console.log('Auth listening on port 3000!');
    });
}

init();