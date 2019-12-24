<template>
  <div class="home" v-show="loadSuccess">
    <!-- banner -->
    <div class="banner-container">
      <van-swipe :autoplay="3000" indicator-color="white">
          <van-swipe-item v-for="(banner, index) in banners" :key="'banner' + index">
            <img @click="bannerLink(banner)" class="banner-pic" :src="banner.picture_url_full" alt="">
          </van-swipe-item>
        </van-swipe>
    </div>
    
    <!-- 宫格 -->
    <van-grid :border="false" icon-size="0.96rem">
      <van-grid-item v-for="(grid,index) in grids" :key="'grid'+ index" :icon="grid.icon" :text="grid.name" to="/articlelist"  />
    </van-grid>

    <!-- 教学视频 -->
    <div class="home-content">
      <div class="title-container">
        <div class="title">教学视频</div>
        <div class="more-box" @click="toTeachList">
          <div class="more">更多</div>
          <van-icon name="arrow" size=".26rem" color="#9B9B9B"></van-icon>
        </div>
      </div>
      <div class="content">
        <!-- type="flex" justify="space-between" style="flex-wrap: wrap" -->
        <van-row gutter="13">
          <van-col :span="12" v-for="(video,index) in videos" @click="toteachVideo(video)" :key="`video${index}`">
            <img class="video-pic" :src="video.photo_full" alt="">
            <div class="video-title">
              {{video.item_name}}-{{video.teacher}}
            </div>
          </van-col>
        </van-row>
      </div>
    </div>

    <!-- 场馆 -->
    <div class="home-content">
      <div class="title-container">
        <div class="title">附近场馆</div>
        <div class="more-box" @click="toSiteList">
          <div class="more">更多</div>
          <van-icon name="arrow" size=".26rem" color="#9B9B9B"></van-icon>
        </div>
      </div>
      <div class="content">
        <div class="site-cell" v-for="site in sites" @click="toSiteDetail(site.train_id)" :key="`site${site.train_id}`" :style="{'background-image': 'url(' + site.train_img_full + ')'}">
          <div class="site-info">
            <img src="@/assets/img/home/dingwei.png" class="site-icon" alt="">
            {{site.train_name}}
            <span v-if="site.head_name">-{{site.head_name}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import { Swipe, SwipeItem , Grid, GridItem, Row, Col, Icon} from 'vant'
import { getHomeData } from '../api/home'
import { toast } from '@/utils/interaction'

export default {
  name: 'home',
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Grid.name]: Grid,
    [GridItem.name]: GridItem,
    [Row.name]: Row,
    [Col.name]: Col,
    [Icon.name]: Icon
  },
  data () {
    return {
      grids: [],
      banners: [],
      videos: [],
      sites: [],
      loadSuccess:false
    }
  },
  created () {
    toast.loading();
    getHomeData().then(res => {
      this.grids = res.data.sys_function;
      this.banners = res.data.index_top_banner;
      this.videos = res.data.home_mid;
      this.sites = res.data.train_site;
      toast.clear();
      this.loadSuccess = true;
    })
  },
  methods: {
    bannerLink(banner){
      if (banner.url_address){
          window.location.href = banner.url_address;
      }
    },
    toSiteDetail(id){
      this.$router.push(`/sitedetail/${id}`);
    },

    toSiteList(){
        this.$router.push(`/site/list`);
    },

    toteachVideo(toteachVideo){
      this.$router.push(`/teachvideo/${toteachVideo.item_id}`)
    },

    toTeachList(){
      this.$router.push('/teachlist')
    }
  }
}
</script>


<style lang="scss" scoped>

.home{
  padding-bottom: 1.3rem;
}

.banner-container{
  padding: .3rem;
  padding-bottom: 0;
  .banner-pic{
    width: 100%;
    border-radius: .1rem;
  }
}


.home-content{
  padding: 0 .3rem;
  .title-container{
    width: 100%;
    height: 0.98rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title{
      color: #525C64;
      font-size: .32rem;
      position: relative;
      padding: .26rem;
      &::before{
        position: absolute;
        left: 0;
        top: 50%;
        width: 0.08rem;
        height: 0.32rem;
        margin-top: -0.16rem;
        background-color: #6BBB19;
        content: '';
        border-radius: .04rem;
      } 
    }
    .more-box{
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .more{
        font-size: .26rem;
        color: #9B9B9B;
        height: .26rem;
        line-height: .26rem;
        .van-icon{
          font-size: .26rem;
        }
      }
    }
  }
}

.video-pic{
  width: 100%;
  height: 1.8rem;
  border-radius: 0.06rem;
  object-fit: cover;
}

.video-title{
  margin: 0.1rem 0 0.3rem;
  font-size:.3rem;
  font-weight:500;
  line-height: .42rem;width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.site-cell{
  width: 100%;
  height: 3.18rem;
  border-radius: .1rem;
  margin-bottom: .3rem;
  background-size: 100%;
  background-position: center;
  overflow: hidden;
  position: relative;
  .site-info{
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: .8rem;
    line-height: .8rem;
    font-size: .32rem;
    color: white;
    padding-left: .76rem;
    background-color: rgba($color: #000000, $alpha: 0.5);

    .site-icon{
      position: absolute;
      left: .3rem;
      top: 50%;
      width: .32rem;
      height: .32rem;
      margin-top: -0.16rem;
    }
  }
}


</style>