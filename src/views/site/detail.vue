<template>
    <div class="site_detail">
        <div class="site_info" v-if="trainSite">
            <img :src="trainSite.train_img_full" alt="">
            <div class="site_desc">
                <div class="title">{{trainSite.train_name}}<span v-if="trainSite.head_name">站长-{{trainSite.head_name}}</span></div>
                <div class="desc">{{trainSite.remark}}</div>
            </div>
        </div>
        <div class="site_member" v-if="memberlist">
            <div class="title">
                站点成员<span v-if="memberCount">（{{memberCount}}）</span>
            </div>
            <div class="members-cell" :class="{'after-line': index < memberlist.length-1}" v-for="(member,index) in memberlist" @click="toMember(member)" :key="member.member_id">
                <img class="header" :src="member.user_photo" alt="">
                <div class="member-content">
                    <div class='name'>
                        <span class='name-value'>{{member.user_name}}</span>
                        <span class="site-header" v-if="member.role_id == 1">(站长)</span>
                        <span v-if="member.auditing == '0'">
                            <img class='daiicon' src='@/assets/img/site/daiicon.png'>
                            <span class='daishen'>待审核</span>
                        </span>
                    </div>
                    <div class='time'>{{member.add_date}}学拳</div>
                </div>
                <van-icon class="flag" name="arrow" size=".26rem" color="#9B9B9B"></van-icon>
            </div>
        </div>

        
        <div class="nav-bottom">
            <div class="pay" @click="payToTeacher">
            打赏老师
            </div>
            <div class="join" @click="applyJoin" v-if="!is_in">
            加入本站
            </div>
            <div class="join" @click="exitSite" v-if="is_in">
            退出本站
            </div>
        </div>

        <van-dialog
          v-model="showDialog"
          title="打赏老师"
          show-cancel-button
          close-on-popstate
          close-on-click-overlay	
          :before-close="confirmPayBefore"
        >
          <p class="dialog_pay_desc">打赏老师，金额随意</p>
          <input class="dialog_pay_money" v-model="paymoney" placeholder="请输入金额" type="number">
        </van-dialog>
    </div>
</template>

<script>
import { siteDetail, applyJoinSite, exitSite } from '../../api/site';
import { createOrder } from '../../api/order'

import {Icon} from 'vant'
import { Dialog } from 'vant'
export default {
    components: {
      [Icon.name]: Icon,
      [Dialog.Component.name]: Dialog.Component
    },
    data () {
        return {
            trainSite: null,
            member: null,
            memberlist: null,
            is_in: false,
            memberCount: 0,
            showDialog: false,
            paymoney: '',
        }
    },
    created () {
        this.getDetail();
    },
    methods: {
        getDetail(){
            this.$toast.loading();
            siteDetail({
                train_id: this.$route.params.id
            }).then(res => {
                this.$toast.clear();
                if (res.code == 10001){
                    if (res.data.member){
                      res.data.memberlist.unshift(res.data.member);
                    }
                    this.trainSite = res.data.trainSite;
                    this.member = res.data.member;
                    this.memberlist = res.data.memberlist;
                    this.is_in = res.data.is_in;
                    this.memberCount = res.data.mebmercount;
                }else{
                    this.$notify.warning(res.msg);
                }
            })
        },

        // 去成员详情
        toMember(member){
          this.$store.commit('SET_SITE_MEMBER', member);
          if (this.member && this.member.member_id){
            this.$router.push(`/site/member/${this.member.member_id}`);
          }else{
            this.$router.push(`/site/member/0`);
          }
        },

        // 打赏
        payToTeacher(){

          if (this.member){
            this.showDialog = true;
          }else{
            this.$v_notify.warning('该站没有站长');
          }

        },
        confirmPayBefore(action, done){
          if (action == 'cancel' || action == 'overlay'){
            done(true);
            return;
          }
          const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;   
          if(!reg.test(this.paymoney)){
            this.$v_notify.warning('请输入正确数字金额');
            done(false)
          }else{
            done(true)
            this.confirmPay();
          }
        },
        confirmPay(){
          this.$toast.loading();
          createOrder({
            openid: this.$store.state.userInfo.open_id,
            money: this.paymoney,
            pay_canal: 1,
            to_user: this.member.member_id,
            bill_type: 2
          }).then(res => {
            this.$toast.clear();
            const payData = res.data;
            this.$wx.chooseWXPay({
                timestamp: payData.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                nonceStr: payData.nonceStr, // 支付签名随机串，不长于 32 位
                package: payData.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                signType: payData.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign: payData.paySign, // 支付签名
                success: function (res) {
                    // 支付成功后的回调函数
                    console.log(res);
                    this.$v_notify.success('感谢您的打赏');
                }
            })
          })
        },

        // 申请加入
        applyJoin(){
          this.$toast.loading();
          applyJoinSite({
            train_id: this.$route.params.id
          }).then(res => {
            this.$toast.clear();
            if (res.code == 10000) {
              this.$v_notify.success('申请已提交');
              this.getDetail();
            } else {
              this.$v_notify.warning(res.msg,);
            }
          })
        },
        // 退出站点
        exitSite(){
          Dialog.confirm({
            title: '提示',
            message: '您将退出该站，确定吗?'
          }).then(() => {
            this.$toast.loading();
            exitSite({
              train_id: this.$route.params.id
            }).then(res => {
              this.$toast.clear();
              if (res.code == 10000) {
                this.$v_notify.success('退出成功');
                this.getDetail();
              } else {
                this.$v_notify.warning(res.msg,);
              }
            })
          })
        }
    }
}
</script>

<style lang="scss" scoped>
.site_detail{
    background: #f5f5f5;
    min-height: 100vh;
}
.site_info{
    padding: .3rem;
    display: flex;
    background-color: white;
    img{
        width: 2.1rem;
        height: 2.1rem;
        border-radius: .04rem;
        display: block;
        object-fit: cover;
    }    
    .site_desc{
        padding-left: .3rem;
        .title{
            color: black;
            font-size: .34rem;
            margin-bottom: .2rem;
        }
        .desc{
            font-size: .28rem;
            color: #999999;
        }
    }
}

.site_member{
    margin-top: .2rem;
    background-color: white;
    .title{
        padding: .3rem;
        font-size: .36rem;
        color: #333333;
        border-bottom: 1px solid #eeeeee;
        span{
            color: #999;
            font-size: .24rem;
        }
    }
}


.members-cell{
  height: 1.70rem;
  padding-left: .30rem;
  background-color: white;
  position: relative;
}

.members-cell .header{
  width: .90rem;
  height: .90rem;
  border-radius: .45rem;
  margin-top: .40rem;
  float: left;
  margin-right: .12rem;
  background: #eeeeee;
}

.members-cell .member-content{
  float: left;
  width: 5.50rem;
  margin-top: .40rem;
}

.member-content .name{
  font-size: .36rem;color: #333333;
}

.member-content .name .name-value{
  margin-right: .10rem;
}

.site-header{
  color: #333;
  font-size: .30rem;
}

.member-content .daiicon{
  width: .32rem;
  height: .32rem;
  position: absolute;
  top: .50rem;
  margin-left: .10rem;
}
.member-content .daishen{
  font-size: .24rem;
  color: #F73035;
  position: absolute;
  top: .50rem;
  margin-left: .50rem;
}

.member-content .time{
  font-size: .28rem; color: #999999;
}

.line-view{
  background-color: #f5f5f5;
  width: 100%;
  height: .16rem;
}

.after-line{
  position: relative;
}

.after-line::after{
  position: absolute;
  left: 1.30rem;
  bottom: 0;
  right: 0;
  height: 1px;
  background-color: #eeeeee;
  content: '';
}


.flag{
  position: absolute;
  right: .43rem;
  top: 50%;
  margin-top: -.16rem;
}


.nav-bottom{
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1.20rem;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-bottom div{
  width: 3.35rem;
  height: .88rem;
  border-radius: .04rem;
  font-size: .36rem;
  line-height: .88rem;
  text-align: center;
  margin: 0 .08rem;
}

.pay{
  background:rgba(254,240,234,1);
  color: #F27941;
}

.join{
  background:rgba(74,176,189,1);
  color: white;
}

.dialog_pay_desc{
  color: #999;
  text-align: center;
  font-size: .3rem;
}

.dialog_pay_money{
    margin: 0.3rem auto;
    display: block;
    text-align: center;
    font-size: .3rem;
}

</style>