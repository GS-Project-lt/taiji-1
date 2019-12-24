import request from "@/utils/request";

export function siteList() {
  return request.post("/trainsitelist", {
    page: 1,
    list_rows: 9999
  });
}

export function siteDetail(data) {
  return request.post("/trainSite", data);
}

export function trainsites(data) {
  return request.post("/trainSites", data);
}

export function applyJoinSite(data) {
  return request.post("/appendTrainSite", data);
}

export function exitSite(data) {
  return request.post("/exitTrainSite", data);
}

export function passApply(data){
  return request.post('/auditingTrainMember', data)
}

export function adBanners(){
  return request.post('/banners', {
    p_id: 3
  });
}

