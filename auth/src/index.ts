import mongoose from "mongoose";
import { app } from "./app";

const init = async () => {
    console.log('Starting up....');
    if (!process.env.JWT_KEY) throw new Error('JWT_KEY must be defined');
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI must be defined');

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to mongoDB');
    } catch (err) {
        console.log('init', err);
    }

    app.listen(3000, () => {
        console.log('Auth listening on port 3000');
    });
}

init();