import request from '../utils/request'

export function helpUsData(){
    return request.post('/chargeList');
}

export function createOrder(data){
    return request.post('/createOrder',data)
  }
  