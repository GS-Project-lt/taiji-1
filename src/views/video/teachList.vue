<template>
  <div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :immediate-check="false"
      @load="getList"
    >
      <van-cell v-for="video in list" :key="video.item_id" @click="toSiteDetail(video.item_id)" class="list-item">
        <img class="header" :src="video.photo_full" alt="" />
        <div class="title ellipsis-line1">
          {{ video.item_name }}
          <span v-if="video.teacher">-{{ video.teacher }}</span>
        </div>
        <div class="desc ellipsis-line2">{{ video.summary }}</div>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import { teachList } from "../../api/video";
import { List, Cell  } from "vant";
export default {
  components: {
    [List.name]: List,
    [Cell.name]: Cell,
  },
  data() {
    return {
      finished: false,
      loading: false,
      page: 0,
      list: [],
    };
  },
  created() {
    this.$store.commit("SET_LOCATION", { lon: "11", lat: "22" });
    
    this.getList();
  },
  methods: {
    getList() {
      if (this.finished) {
        return;
      }
      this.page++;
      this.loading = true;
      teachList({
        page: this.page,
        list_rows: 10,
      }).then(res => {
        if (res.code == 10001) {
          this.list = this.list.concat(res.data);
        } else {
          this.finished = true;
        }
        this.loading = false;
      });
    },
    toSiteDetail(id){
      this.$router.push(`/teachvideo/${id}`);
    },
  }
};
</script>

<style lang="scss" scoped>
.banner-container{
  padding: .3rem;
  padding-bottom: 0;
  .banner-pic{
    width: 100%;
    border-radius: .1rem;
  }
}
.list-item {
  height: 2.5rem;
  padding-top: 0;
  padding-bottom: 0;
  .header {
    width: 1.8rem;
    height: 1.8rem;
    background: rgba(241, 248, 255, 1);
    border-radius: 0.04rem;
    margin-top: 0.34rem;
    object-fit: cover;
  }

  .title {
    position: absolute;
    left: 2.12rem;
    top: 0.34rem;
    right: 0;
    color: #333333;
    font-size: 0.3rem;
  }

  .desc {
    position: absolute;
    left: 2.12rem;
    top: 0.8rem;
    right: 0;
    color: #999999;
    font-size: 0.26rem;
    line-height: 0.37rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .position {
    position: absolute;
    left: 2.12rem;
    bottom: 0.3rem;
    padding: 0.04rem 0.1rem;
    background: rgba(89, 164, 233, 0.1);
    color: #59a4e9;
    font-size: 0.24rem;
    border-radius: 0.02rem;
    padding-left: 0.36rem;
  }

  .position img {
    width: 0.2rem;
    height: 0.24rem;
    position: absolute;
    left: 0.08rem;
    top: 0.09rem;
  }
}
</style>
