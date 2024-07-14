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

app.listen(3000, () => {
    console.log('Listening on port 3000!');
});