import axios from 'axios'
import qs from 'qs'
import { Dialog } from 'vant';
import router from '../router/index'

const server = axios.create({
    baseURL: '',
    timeout: 50000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})


server.interceptors.request.use(config => {
    config.url = '/api' + config.url;
    if (process.env.NODE_ENV == 'production'){
        config.url = 'https://api.zuxun.net' + config.url;
    }
    let token  = localStorage.getItem('token');
    if (config.data){
        config.data.u_token = token;
    }
    config.headers.u_token = token;
    if (config.method.toLowerCase() == 'post' && config.data){
        config.data = qs.stringify(config.data);
    }

    console.log('interceptors request config is === ', config);
    return config;
})

server.interceptors.response.use(response => {
    const res = response.data;
    if (res.code == 27){
        // 缺少token，去注册
        Dialog.alert({
            title: '提示',
            message: '请前往“我的”进行注册'
        }).then(() => {
            router.replace('/mine');
        });
    }
    return res;
},err => {
    return Promise.reject(err);
})

export default server