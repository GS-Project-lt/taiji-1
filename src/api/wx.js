import { sign } from "@/utils/sign";
import wxSDK from "@/utils/wx";
import request from "@/utils/request";
import wx from "weixin-js-sdk";


export function wxinit(store) {
  if (store.state.ticket){
    initwx(store.state.ticket,store)
  }else{
    request.post("/get_jsapi_ticket_tj").then(res => {
      initwx(res.data, store)
    });
  }
  
}

function initwx(ticket, store) {
  let signature = sign(ticket);
  store.commit('SET_TICKET', ticket);
  wxSDK.init(signature, store.state.shareData, () => {
    // 获取位置信息
    wx.getLocation({
      type: "wgs84",
      success: function(res) {
        console.log("location", res);
        store.commit("SET_LOCATION", {
          lat: res.latitude,
          lon: res.longitude
        });
      }
    });
  });
}

export function wxUserInfo(store) {
  if (window.location.search && window.location.search.indexOf('code=')){
    let code = window.location.search.split("&");
    code = code[0];
    code = code.split("=");
    code = code[1];
    request.post(`/get_user_info_tj?code=${code}`).then(res => {
      if (res.code == 10001) {
        store.commit('SET_WX_USERINFO',  res.data);
      }
    }); 
  }else{
    // 链接没有code，跳转微信授权
    window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx1e1c4e1ad79481d6&redirect_uri=${encodeURIComponent(window.location.origin + window.location.pathname)}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`
  }
  
}
