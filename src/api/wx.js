import {sign} from '@/utils/sign'
import wxSDK from '@/utils/wx'
import axios from 'axios'
import wx from 'weixin-js-sdk'

export function wxinit (store){

    axios.post('/api/get_jsapi_ticket').then(res => {
        let signature = sign(res.data.data);
        wxSDK.init(signature,null,()=>{
          // 获取位置信息
          wx.getLocation({
            type: 'wgs84',
            success: function(res){
              console.log('location', res);
              store.commit('SET_LOCATION', {
                lat: res.latitude,
                lon: res.longitude
              })
            }
          })
        })
      })
      
}