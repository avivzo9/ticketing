import axios from "axios";

const LandingPage = ({ currentUser }) => {
    axios.get('/api/users/currentuser')
    console.log(currentUser);

    return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = async () => {
    const res = await axios.get('/api/users/currentuser');

    return res?.data || {};
};

export default LandingPage;