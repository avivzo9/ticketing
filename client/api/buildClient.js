import axios from "axios";

export default ({ req }) => {
    if (typeof window === 'undefined') {
        // We are on the server
        // Requests should be made to http://{serviceName}.{nameSpace}.svc.cluster.local
        return axios.create({
            baseURL: 'http://www.ticketing-prod-app.xyz',
            headers: req.headers
        });
    } else {
        // We are on the browser
        // Requests can be made with a base url of ''
        return axios.create();
    }
};