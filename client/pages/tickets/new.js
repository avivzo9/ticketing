import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/useRequest';

const newTicket = () => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');

    const { doRequest, errors } = useRequest({
        url: '/api/tickets',
        method: 'post',
        body: { title, price },
        onSuccess: () => Router.push('/')
    });

    const onBlur = () => {
        const value = parseFloat(price);

        if (isNaN(value)) return;

        setPrice(value.toFixed(2));
    };

    const onSubmit = (ev) => {
        ev.preventDefault();

        doRequest();
    };

    return (
        <div>
            <h1>Create a Ticket</h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input
                        value={title}
                        onChange={({ target }) => setTitle(target.value)}
                        onBlur={onBlur}
                        className="form-control"
                        type="text"
                    />
                </div>

                <div className="form-group">
                    <label>Price</label>
                    <input
                        value={price}
                        onChange={({ target }) => setPrice(target.value)}
                        onBlur={onBlur}
                        className="form-control"
                        type="number"
                    />
                </div>

                {errors}

                <button className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};

export default newTicket;