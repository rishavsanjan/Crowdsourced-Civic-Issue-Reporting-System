const isProduction = import.meta.env.MODE === 'production';

const API_BASE_URL = isProduction
    ? 'https://crowdsourced-civic-issue-reporting-system.onrender.com'
    : 'http://localhost:3000';

export default API_BASE_URL;