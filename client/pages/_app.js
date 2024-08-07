import 'bootstrap/dist/css/bootstrap.min.css';
import buildClient from '../api/buildClient';
import Header from '../cmps/Header';

// The page component receives the pageProps prop from the App component.
const AppCmp = ({ Component, pageProps, currentUser }) => {
    return <div>
        <Header currentUser={currentUser} />
        <Component {...pageProps} />
    </div>;
};

AppCmp.getInitialProps = async appContext => {
    const { Component, ctx } = appContext;
    const client = buildClient(ctx);

    try {
        const { data } = await client.get('/api/users/currentuser');
        const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

        console.log('data:', data)
        return { pageProps, ...data };
    } catch (err) {
        console.log('err:', err)
        return {};
    }
};

export default AppCmp;