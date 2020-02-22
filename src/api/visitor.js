import request from "../utils/request";

/**
 * id
 * type 1:阅读 2点赞 3转发 4播放次数
 * work_type: 1 教学视频 2讲座 3上传视频 4活动 5评论
 * */
export function plusNum(data) {
  return request.post("/plusNum", data);
}

// 文章、讲座的阅读数量增加
export function playNumberArticle(id) {
  return request.post("/plusNum", {
    id: id,
    type: 1,
    work_type: 2
  });
}

// 活动的阅读数量增加
export function playNumberActivity(id) {
  return request.post("/plusNum", {
    id: id,
    type: 1,
    work_type: 4
  });
}

// 评论点赞
export function disscussGiveLike(id) {
  return post_unloading("/plusNum", {
    id: id,
    type: 2,
    work_type: 5
  });
}

// 小视频播放数量
export function miniVideoPlaynumber(id) {
  return request.post("/plusNum", {
    id: id,
    type: 1,
    work_type: 3
  });
}

export function videoPlayNumber(id) {
  return request.post('/updateNum', {
    chapter_id: id,
    field: 1
  })
}

export function videoShareNumber(id) {
  return request.post('/updateNum', {
    chapter_id: id,
    field: 2
  })
}

