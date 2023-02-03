import axios from "axios";

const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    timeout: 10000,
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.log(error)
    if(error.response.status === 401){
        localStorage.removeItem("authtoken");
        window.location.href = '/login';
    }

    return Promise.reject(error);
});

export const requestWithToken = () => {
    instance.defaults.headers.common['X-AUTH-TOKEN'] = localStorage.getItem(process.env.REACT_APP_AUTH_TOKEN);

    return instance
}

export default instance
