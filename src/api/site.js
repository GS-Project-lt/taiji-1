import request from '@/utils/request'

export function siteList(){
    return request.post('/trainsitelist',{
        page:1 , 
        list_rows: 9999
    });
}

