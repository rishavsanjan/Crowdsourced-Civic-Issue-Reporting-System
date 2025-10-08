const isProduction = process.env.NODE_ENV !== 'production';

const API_BASE_URL = isProduction
    ? 'https://crowdsourced-civic-issue-reporting-system.onrender.com' // your Render backend
    : 'http://172.20.10.2:3000'; // local backend for dev


export default API_BASE_URL;
