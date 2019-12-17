<template>
    <div class="activity-content">
        <div class="content" v-html="content"></div>
        <div class="button" v-if="valid" :class="buttonclass" @click="enroll">
            {{buttontext}}
        </div>
    </div>
</template>

<script>
import { activityDetail,activityEnroll } from '../../api/activity'
import { notify  } from '@/utils/interaction'

export default {
    data () {
        return {
            activituInfo: null,
            content: '',
            buttontext: '去报名',
            buttonclass: '',
            is_enroll: 0,
            valid: true, // 活动是否有效
        }
    },
    created () {
        this.valid = parseInt(this.$route.params.valid) == 1 ? true : false;
        this.getActivity();
    },
    methods: {
        getActivity(){
            activityDetail({
                activity_id: this.$route.params.id
            }).then(res => {
                if (res.code==  10000){
                    this.content = res.data.content;
                    this.buttonclass = res.data.is_enroll == 0 ? 'applyed' : 'no_apply';
                    this.buttontext = res.data.is_enroll == 0 ? '去报名' : '已报名';
                    this.is_enroll = res.data.is_enroll;
                    this.activituInfo = res.data;
                }
            })  
        },
        enroll(){
            if (parseInt(this.is_enroll) == 0){
                activityEnroll({
                    activity_id: this.activituInfo.activity_id
                }).then(res => {
                    this.getActivity();
                    notify.success('报名成功');
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.content{
    padding-bottom: 1rem;
}

.activity-content{
 padding: .3rem;
}

.button{
    position: fixed;
    left: .3rem;
    right: .3rem;
    bottom: .16rem;
    height: .88rem;
    line-height: .88rem;
    text-align: center;
    border-radius: 0.04rem;
    color: #ffffff;
    font-size: .36rem;
}

.no_apply{
  background-color: #999999;
}

.applyed{
  background-color: #4AB0BD;
}

</style>