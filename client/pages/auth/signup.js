import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/useRequest';

export default () => {
    const [email, setEmail] = useState('test@test.com');
    const [password, setPassword] = useState('123456');

    const { doRequest, errors } = useRequest({ url: '/api/users/signup', method: 'post', body: { email, password }, onSuccess: () => Router.push('/') });

    const onSubmit = async (ev) => {
        ev.preventDefault();
        doRequest();
    };

    return (
        <form onSubmit={onSubmit}>
            <h1>Sign Up</h1>
            <div className="form-group">
                <label>Email</label>
                <input value={email} onChange={ev => setEmail(ev.target.value)} className="form-control" />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input value={password} onChange={ev => setPassword(ev.target.value)} type="password" className="form-control" />
            </div>

            {errors}

            <button className="btn btn-primary">Sign Up</button>
        </form>
    )
};