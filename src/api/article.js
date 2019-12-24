import request from '../utils/request';

export function lectureList(data) {
    return request.post('/getArticles', data);
}

export function lectureDetail(data) {
    return request.post('/articleInfo', data);
} 