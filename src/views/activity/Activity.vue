<template>
    <div class="activity-box">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多活动了^_^" :immediate-check="false" @load="getActivityList">
            <div class="activity-cell" v-for="item in list" :key="item.activity_id" @click="gotoDetail(item.activity_id, item.status_value)">
                <img class="act-pic" :src="item.activity_pic_full" alt="">
                <div class="act-tag" :class="{'act-tag-active': item.status_value == 1, 'act-tag-active-playing': item.status_value == 3}">{{item.status_name}}</div>
                <div class="content">
                    <div class="act-title">{{item.activity_title}}</div>
                    <div class="act-info">
                        <img class="act-info-icon" src="@/assets/img/activity/time.png" alt="">
                        {{item.start_time}}
                    </div>
                    <div class="act-info">
                        <img class="act-info-icon" style="top: .06rem" src="@/assets/img/activity/address.png" alt="">
                        {{item.address}}
                    </div>
                </div>
            </div>
        </van-list>
    </div>
</template>

<script>
import { activityList } from '../../api/activity'
import { List } from 'vant'

export default {
    components: {
      [List.name]: List  
    },
    data () {
        return {
            loading: false,
            finished: false,
            page: 0,
            list_rows: 10,
            list: []
        }
    },
    created(){
        this.getActivityList();
    },
    methods: {
        getActivityList(){
            this.page += 1;
            this.loading = true;
            activityList({
                page: this.page,
                list_rows: this.list_rows
            }).then(res => {
                if (res.code == 10001){
                    this.list = res.data;
                    if (res.data.length < this.list_rows){
                        this.finished = true;
                    }
                }else{
                    this.finished = true;
                }
                this.loading = false;
            })
        },
        gotoDetail(id,status){
            const valid = status == 1 || status == 3 ? 1 : 0;
            this.$router.push(`/activity/${id}/${valid}`);
        }
    }
}
</script>

<style lang="scss" type="text/scss" scoped>

.activity-box{
    min-height: 100vh; padding: .3rem; background-color: #F5F5F5;
    .activity-cell{
        width: 100%;
        min-height: 3rem;
        border-radius: .08rem;
        background-color: white;
        overflow: hidden;
        position: relative;
        margin-bottom: .3rem;

        .act-pic{
            width: 100%;
            height: auto;
        }
        .act-tag{
            position: absolute;
            left: 0;
            top: 0;
            padding: 0 .24rem;
            height: .44rem;
            text-align: center;
            line-height: .44rem;
            font-size: .24rem;
            color: white;
            background: #666666;
            border-bottom-right-radius: .2rem;
        }
        .act-tag-active{
            background:linear-gradient(321deg,rgba(255,94,0,1) 0%,rgba(255,26,26,1) 100%);
        }

        .act-tag-active-playing{
            background: rgb(107, 187, 25);
        }

        .content{
            padding: .3rem;
            .act-title{
                font-size:0.34rem;
                font-weight:600;
                margin: 0;
                margin-bottom: .2rem;
            }

            .act-info{
                font-size: .24rem;
                color: #999999;
                height: .5rem;
                line-height: .5rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                padding-left: .5rem;
                position: relative;
            }

            .act-info-icon{
                position: absolute;
                left: 0;
                top: .1rem;
                width: .3rem;
                // height: .4rem;
            }
        }
    }
}



</style>