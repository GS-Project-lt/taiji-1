import axios from 'axios'
import qs from 'qs'

const server = axios.create({
    baseURL: '',
    timeout: 50000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})


server.interceptors.request.use(config => {
    config.url = '/api' + config.url;
    if (config.data){
        config.data.u_token = 'MTU=';
    }
    config.headers.u_token = 'MTU=';
    if (config.method.toLowerCase() == 'post' && config.data){
        config.data = qs.stringify(config.data);
    }
    console.log('interceptors request config is === ', config);
    return config;
})

server.interceptors.response.use(response => {
    const res = response.data;
    return res;
},err => {
    return Promise.reject(err);
})

export default server