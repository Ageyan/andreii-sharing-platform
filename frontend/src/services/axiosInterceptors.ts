import axios from 'axios';

axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/'; 
        }
        return Promise.reject(error);
    }
);