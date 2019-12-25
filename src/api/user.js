import request from '../utils/request';
import axios from 'axios'

export function getUserInfo(){
    return request.post('/centerBase',{});
}

export function registNew(data){
    return request.post('/registerUser',data);
}

export function saveUserInfo(data) {
    return request.post('/appendUser', data)
}

export function uploadImage(data){
    axios.defaults.withCredentials = true

     return axios({
        method: 'post',
        headers: {
            // 'Content-Type': 'multipart/form-data',
            'u_token': 'MzEzMTNmOWM5Yjk3NTQ0NzY1NGUzZDcwNWQ0N2Y0NmI'
        },
        url: '/api/singleUpload',
        data
    })
    // return request.post('/singleUpload',data, {
    //     headers:{'Content-Type':'multipart/form-data'}
    // })
}