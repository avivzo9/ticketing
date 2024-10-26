import Queue from "bull";
import { ExpirationCompletePublisher } from "../events/publishers/expirationCompletePublisher";
import { natsWrapper } from "../natsWrapper";

interface Payload {
    orderId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
    redis: {
        host: process.env.REDIS_HOST
    }
});

expirationQueue.process(async (job) => {
    console.log("Publish an expiration:complete event for orderId", job.data.orderId);

    // Publish an event to the NATS server
    new ExpirationCompletePublisher(natsWrapper.client).publish({ orderId: job.data.orderId });
});

export { expirationQueue };