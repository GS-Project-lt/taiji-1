import wx from 'weixin-js-sdk'

const wxSDK = {
    
    init(config, shareData, wxready){
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: 'wx1e1c4e1ad79481d6', // 必填，公众号的唯一标识
            timestamp: config.timestamp, // 必填，生成签名的时间戳
            nonceStr: config.nonceStr, // 必填，生成签名的随机串
            signature: config.signature,// 必填，签名
            jsApiList: config.jsApiList ||  ['checkJSApi', 'onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareQZone', 'updateAppMessageShareData', 'updateTimelineShareData'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        })

        wx.checkJsApi({
            jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareQZone', 'updateAppMessageShareData', 'updateTimelineShareData'],
            success: function (res) {
              // 以键值对的形式返回，可用的api值true，不可用为false
              // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
              window.console.log(res);
            }
        })

        wx.ready(function(){
            if (shareData) {
                wxSDK.share(shareData);
            }
            if (wxready && typeof wxready == 'function'){
                wxready();
            }

            wx.hideMenuItems({
                menuList: ['menuItem:copyUrl','menuItem:originPage','menuItem:readMode','menuItem:openWithQQBrowser','menuItem:openWithSafari','menuItem:share:weiboApp','menuItem:share:qq','menuItem:share:QZone'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
            });
        })
    },

    share(shareData){

        var shareInfo = {
            title: (shareData && shareData.title) || document.title,
            desc: (shareData && shareData.desc) || location.href,
            link: (shareData && shareData.link) || location.href,
        }
        shareData && shareData.imgUrl ? (shareInfo['imgUrl'] = shareData.imgUrl) : null
        shareData && shareData.success ? (shareInfo['success'] = shareData.success) : null
        shareData && shareData.fail ? (shareInfo['fail'] = shareData.fail) : null
        shareData && shareData.cancel ? (shareInfo['cancel'] = shareData.cancel) : null

        wx.updateTimelineShareData(shareData)
        wx.updateAppMessageShareData(shareData)
    }

}

export default wxSDK;