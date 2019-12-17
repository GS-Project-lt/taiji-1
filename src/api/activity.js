import request from '../utils/request'

export function activityList(data){
    return request.post('/activity',data);
}

export function activityDetail(data) {
  return request.post('/activityInfo', data);
}

export function activityEnroll(data){
  return request.post('/activityEnroll', data);
}
