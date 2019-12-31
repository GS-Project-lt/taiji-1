import request from '../utils/request'

export function getHomeData (data){
    return request.post('/homePage',data);
}