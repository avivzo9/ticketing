import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/useRequest';
import { Router } from 'next/router';

const OrderShow = ({ order, currentUser }) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const { doRequest, errors } = useRequest({
        url: '/api/payments',
        method: 'post',
        body: { orderId: order.id },
        onSuccess: () => Router.push('/')
    });

    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 1000));
        };

        findTimeLeft();

        const timerId = setInterval(findTimeLeft, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, [order]);

    if (timeLeft < 0) return (
        <div>
            <h1>{order.ticket.title}</h1>
            <h3>Order Expired</h3>
        </div>
    );

    return (
        <div>
            <h1>{order.ticket.title}</h1>
            <h4>Price: {order.ticket.price}</h4>
            <h4>Status: {order.status}</h4>
            <h4>Time left to pay: {timeLeft} seconds</h4>

            {errors}

            <StripeCheckout
                token={({ id }) => doRequest({ token: id })}
                stripeKey='pk_test_51QEAZnF30aTjzmlrBzsNWSjQmLTZMPvsvPwfH965FGNjnUvTbR9ndnFBK6kDmC8B7UyW4j89KomuRzY3YPgo5jr500bp2OF9Hj'
                amount={order.ticket.price * 100}
                email={currentUser.email}
            />
        </div>
    );
};

OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;

    const { data: order } = await client.get(`/api/orders/${orderId}`);

    return { order };
};

export default OrderShow;