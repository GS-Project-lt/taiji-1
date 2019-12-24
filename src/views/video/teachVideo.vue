<template>
  <div class="teach_video">
    <video-player
      v-if="base"
      class="video-player vjs-custom-skin"
      ref="videoPlayer"
      :playsinline="true"
      :options="playerOptions"
    >
    </video-player>
    <div class="video-desc" v-if="base">
        <div class="video-title">动作要领</div>
        <div class="show-detail">{{base.chapter_action}}</div>
    </div>
    <div class="video-box" v-for="(item, name) in list" :key="name">
        <div class="title">{{name}}</div>
        <van-row class="video-content">
            <van-col :span="6" v-for="video in item" :key="'video'+video.chapter_id" @click="exchangeVideo(video)">
                <div class="video-item" :class="{'video-item-sel': base.chapter_id == video.chapter_id}">{{video.chapter_name}}</div>
            </van-col>
        </van-row>
    </div>
  </div>
</template>

<script>
// require styles
import "video.js/dist/video-js.css";
import { videoPlayer } from "vue-video-player";
import { teachVideo } from '../../api/video';
import { Row, Col } from 'vant'

export default {
  components: {
    videoPlayer,
    [Row.name]: Row,
    [Col.name]: Col
  },
  data() {
    return {
      playerOptions: {
        //播放速度
        playbackRates: [0.5, 1.0, 1.5, 2.0],
        //如果true,浏览器准备好时开始回放。
        autoplay: false,
        // 默认情况下将会消除任何音频。
        muted: false,
        // 导致视频一结束就重新开始。
        loop: false,
        // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        preload: "auto",
        language: "zh-CN",
        // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        aspectRatio: "16:9",
        // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        fluid: true,
        sources: [
          {
            //类型
            type: "video/mp4",
            //url地址
            src: ""
          }
        ],
        //你的封面地址
        poster: "",
        //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        notSupportedMessage: "此视频暂无法播放，请稍后再试",
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          //全屏按钮
          fullscreenToggle: false
        }
      },
      base: null,
      list: null
    };
  },
  created () {
    this.getVideoInfo();  
  },
  methods: {
      getVideoInfo(){
          this.$v_toast.loading();
            teachVideo({
                item_id: this.$route.params.id
            }).then(res => {
                this.$v_toast.clear();
                if (res.code == 10001){
                    this.list = res.data.list;
                    this.exchangeVideo(res.data.base);
                }else{
                    this.$v_notify.danger(res.msg);
                    this.$router.go(-1)
                }
            })
      },
      exchangeVideo(video){
          this.base = video;
          this.playerOptions.sources[0].src = this.base.chapter_video_full;
      }
  }
};
</script>

<style lang="scss" scoped>


.video-desc{
  padding: .30rem;
}

.video-desc .video-title{
  color: #333333;
  font-size: .36rem;
  height: .44rem;
  line-height: .44rem;
}

.show-detail{
  color: #999999;
  font-size: .28rem;
  line-height: .44rem;
  position: relative;
  margin-top: .3rem;
}

.line-view{
    width: 100%;
    height: .16rem;
    background: #f5f5f5;
}


.video-box{
    padding: .3rem;
    border-top: .16rem solid #f5f5ff;

    .title{
        font-size: .36rem;
        color: #333333;
    }
    .video-content{
        margin-top: .3rem;  
        .video-item{
            height: .56rem;
            line-height: .56rem;
            text-align: center;
            color: #4AB0BD;
            font-size: .28rem;
            border: .02rem solid #4AB0BD;
            border-radius:.04rem;
            margin: .10rem .06rem;
        }
        .video-item-sel{
            background-color: #4AB0BD;
            color: white;
        }
    }
}


</style>

<style lang="scss">
.video-js .vjs-big-play-button{
    width: 1.6em;
    height: 1.6em;
    margin-left: -0.8em;
    margin-top: -0.8em;
    left: 50%;
    top: 50%;
}
</style>