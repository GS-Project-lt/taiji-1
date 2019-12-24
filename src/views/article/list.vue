<template>
  <div>
    <van-tabs
      v-model="active"
      title-active-color="#6BBB19"
      color="#6BBB19"
      sticky
      @click="getlectureList"
    >
      <van-tab title="拳理"></van-tab>
      <van-tab title="健身"></van-tab>
      <van-tab title="健康"></van-tab>
      <van-tab title="中医"></van-tab>
    </van-tabs>
    <div>
      <van-list
        class="content" 
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :immediate-check="false"
        @load="loadingMore">
        <van-cell
          v-for="item in list"
          @click="showdetail(item.article_id)"
          :key="item.article_id"
        >
        <div class="content-item">
<div class="content-text">
            <div class="title">
              {{ item.article_title }}
            </div>
            <div class="view-num">
              {{ item.read_num }}
            </div>
          </div>
          <div class="content-pic">
            <img v-if="item.article_img_full" :src="item.article_img_full" />
          </div>
        </div>
          
        </van-cell>
      </van-list>
    </div>
  </div>
</template>

<script>
import { Tab, Tabs, List, Cell  } from "vant";
import { lectureList } from "../../api/article";

export default {
  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [List.name]: List,
    [Cell.name]: Cell,

  },
  data() {
    return {
        finished: false,
        loading: false,
        active: 0,
        page: 1   ,
        list_rows: 6,
        list: [],
        currentId: 1
    };
  },
  computed: {
    // list(val) {
    //   console.log(this.active);
    //   this.getlectureList()
    // }
  },
  created () {
    this.getlectureList();  
  },
  methods: {
      loadingMore(){
          this.page++;
          this.getlectureList();
      },
    getlectureList(id) {
        if (id + 1) {
            this.page = 1;
            this.currentId = id + 1;
            this.list = [];
            this.$v_toast.loading();
        }
        this.finished = false;
        this.loading = true;
      lectureList({
        page: this.page,
        list_rows: this.list_rows,
        cat_id: this.currentId
      }).then(res => {
        this.$v_toast.clear();
         this.loading = false;
        if (res.code == 10001) {
          var list = [];
          if (this.page == 1) {
            list = res.data;
          } else {
            list = this.list.concat(res.data);
          }
          if (res.data.length < this.list_rows){
              this.finished = true;
          }
          this.list = list;
        } else {
          if (this.page == 1) {
            this.list = [];
          }
          this.finished = true;
        }
      });
    },
    showdetail(id){
        this.$router.push(`/article/${id}`)
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  //   margin-top: .90rem;
}

.content-item {
//   margin: 0 0.32rem;
  padding: 0.36rem 0;
//   border-bottom: 1px solid #eeeeee;
  display: flex;
}

.content-text {
  height: 1.56rem;
  padding-right: 0.32rem;
  width: 4.36rem;
  position: relative;
}

.content-text .title {
  font-size: 0.32rem;
  color: #333333;
  line-height: 0.5rem;
  height: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.view-num {
  position: absolute;
  bottom: 0;
  left: 0;
  color: #999999;
  font-size: 0.24rem;
  padding-left: 0.4rem;
}

.view-num::before {
  position: absolute;
  left: 0;
  top: 0;
  content: "阅";
  color: white;
  font-size: 0.22rem;
  background-color: red;
  width: 0.32rem;
  height: 0.32rem;
  line-height: 0.32rem;
  text-align: center;
}

.content-pic {
  width: 2.18rem;
  height: 1.56rem;
}

.content-pic img {
  width: 100%;
  height: 100%;
}
</style>
