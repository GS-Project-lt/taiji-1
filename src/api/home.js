import request from '../utils/request'

export function getHomeData (data){
    return request('/homePage',data);
}