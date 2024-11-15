const OrderIndex = ({ orders }) => {

    return (
        <ul>
            {orders.map(order => (
                <li key={order.id}>{order.ticket.title} - {order.status}</li>
            ))}
        </ul>
    );
};

OrderIndex.getInitialProps = async (_, client) => {
    const { data: orders } = await client.get('/api/orders');

    return { orders };
};

export default OrderIndex;