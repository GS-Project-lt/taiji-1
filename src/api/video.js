import request from '../utils/request';

export function teachVideo(data){
    return request.post('/itemchapters',data)
}


export function teachList(data){
    return request.post('/items',data);
}