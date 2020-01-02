<template>
  <div class="site_detail">
    <div class="site_info" v-if="trainSite">
      <img :src="trainSite.train_img_full" alt="" />
      <div class="site_desc">
        <div class="title">
          {{ trainSite.train_name
          }}<span v-if="trainSite.head_name"
            >站长-{{ trainSite.head_name }}</span
          >
        </div>
        <div class="desc">{{ trainSite.remark }}</div>
      </div>
    </div>
    <div class="site_member" v-if="memberlist">
      <div class="title">
        站点成员<span v-if="memberCount">（{{ memberCount }}）</span>
      </div>
      <div
        class="members-cell"
        :class="{ 'after-line': index < memberlist.length - 1 }"
        v-for="(member, index) in memberlist"
        @click="toMember(member)"
        :key="member.member_id"
      >
        <img class="header" :src="member.user_photo" alt="" />
        <div class="member-content">
          <div class="name">
            <span class="name-value">{{ member.user_name }}</span>
            <span class="site-header" v-if="member.role_id == 1">(站长)</span>
            <span v-if="member.auditing == '0'">
              <img class="daiicon" src="@/assets/img/site/daiicon.png" />
              <span class="daishen">待审核</span>
            </span>
          </div>
          <div class="time">{{ member.add_date }}学拳</div>
        </div>
        <van-icon
          class="flag"
          name="arrow"
          size=".26rem"
          color="#9B9B9B"
        ></van-icon>
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

    <!-- <van-dialog
      v-model="showDialog"
      title="打赏老师"
      show-cancel-button
      close-on-popstate
      close-on-click-overlay
      :before-close="confirmPayBefore"
    >
      <p class="dialog_pay_desc">打赏老师，金额随意</p>
      <van-field readonly clickable :value="paymoney" />

      <input
        class="dialog_pay_money"
        v-model="paymoney"
        placeholder="请输入金额"
        type="number"
      />
    </van-dialog> -->
    <van-overlay :show="showDialog">
      <van-number-keyboard
        :show="showDialog"
        theme="custom"
        extra-key="."
        close-button-text="完成"
        @blur="showDialog = false"
        @input="onInput"
        @delete="onDelete"
        @close="closekeyboard"
      >
        <span slot="title-left">
          <div style="padding: 0 .3rem; color: #f27941;">
            打赏金额：<span v-if="paymoney">￥{{ paymoney }}</span>  
          </div>
        </span>
      </van-number-keyboard>
    </van-overlay>
  </div>
</template>

<script>
import { siteDetail, applyJoinSite, exitSite } from "../../api/site";
import { createOrder } from "../../api/order";

import { Icon, Dialog, NumberKeyboard, Field, Overlay } from "vant";

export default {
  components: {
    [Icon.name]: Icon,
    [Dialog.Component.name]: Dialog.Component,
    [NumberKeyboard.name]: NumberKeyboard,
    [Field.name]: Field,
    [Overlay.name]: Overlay
  },
  data() {
    return {
      trainSite: null,
      member: null,
      memberlist: null,
      is_in: false,
      memberCount: 0,
      showDialog: false,
      paymoney: ""
    };
  },
  created() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      this.$toast.loading();
      siteDetail({
        train_id: this.$route.params.id
      }).then(res => {
        this.$toast.clear();
        if (res.code == 10001) {
          if (res.data.member) {
            res.data.memberlist.unshift(res.data.member);
          }
          this.trainSite = res.data.trainSite;
          this.member = res.data.member;
          this.memberlist = res.data.memberlist;
          this.is_in = res.data.is_in;
          this.memberCount = res.data.mebmercount;
        } else {
          this.$notify.warning(res.msg);
        }
      });
    },

    // 去成员详情
    toMember(member) {
      
      if (this.$store.userInfo && this.member && this.$store.userInfo.member_id  == this.member.member_id){
        // 本站站长可以查看会员信息
        this.$store.commit("SET_SITE_MEMBER", member);
        if (this.member && this.member.member_id) {
          this.$router.push(`/site/member/${this.member.member_id}`);
        } else {
          this.$router.push(`/site/member/0`);
        }
      } else{
        this.$v_notify.warning('只有本站站长才能查看学员信息');
      }
      
    },

    onInput(value) {
      this.paymoney = this.paymoney + value.toString();
    },
    onDelete() {
      this.paymoney = this.paymoney.substr(0, this.paymoney.length - 1);
    },

    closekeyboard(){
      console.log('close');
      
      const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      if (!reg.test(this.paymoney)) {
        this.$v_notify.warning("请输入正确数字金额");
        this.$nextTick(() => {
          this.showDialog = true;
        })
      }else{
        this.confirmPay();
      }
    },

    // 打赏
    payToTeacher() {
      if (this.member) {
        this.showDialog = true;
      } else {
        this.$v_notify.warning("该站没有站长");
      }
    },
    confirmPayBefore(action, done) {
      if (action == "cancel" || action == "overlay") {
        done(true);
        return;
      }
      const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      if (!reg.test(this.paymoney)) {
        this.$v_notify.warning("请输入正确数字金额");
        done(false);
      } else {
        done(true);
        this.confirmPay();
      }
    },
    confirmPay() {
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
        this.paymoney = '';
        this.$wx.chooseWXPay({
          timestamp: payData.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
          nonceStr: payData.nonceStr, // 支付签名随机串，不长于 32 位
          package: payData.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
          signType: payData.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
          paySign: payData.paySign, // 支付签名
          success: function(res) {
            // 支付成功后的回调函数
            console.log(res);
            this.$v_notify.success("感谢您的打赏");
          }
        });
      });
    },

    // 申请加入
    applyJoin() {
      this.$toast.loading();
      applyJoinSite({
        train_id: this.$route.params.id
      }).then(res => {
        this.$toast.clear();
        if (res.code == 10000) {
          this.$v_notify.success("申请已提交");
          this.getDetail();
        } else {
          this.$v_notify.warning(res.msg);
        }
      });
    },
    // 退出站点
    exitSite() {
      Dialog.confirm({
        title: "提示",
        message: "您将退出该站，确定吗?"
      }).then(() => {
        this.$toast.loading();
        exitSite({
          train_id: this.$route.params.id
        }).then(res => {
          this.$toast.clear();
          if (res.code == 10000) {
            this.$v_notify.success("退出成功");
            this.getDetail();
          } else {
            this.$v_notify.warning(res.msg);
          }
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.site_detail {
  background: #f5f5f5;
  min-height: 100vh;
}
.site_info {
  padding: 0.3rem;
  display: flex;
  background-color: white;
  img {
    width: 2.1rem;
    height: 2.1rem;
    border-radius: 0.04rem;
    display: block;
    object-fit: cover;
  }
  .site_desc {
    padding-left: 0.3rem;
    .title {
      color: black;
      font-size: 0.34rem;
      margin-bottom: 0.2rem;
    }
    .desc {
      font-size: 0.28rem;
      color: #999999;
    }
  }
}

.site_member {
  margin-top: 0.2rem;
  background-color: white;
  padding-bottom: 1.2rem;
  .title {
    padding: 0.3rem;
    font-size: 0.36rem;
    color: #333333;
    border-bottom: 1px solid #eeeeee;
    span {
      color: #999;
      font-size: 0.24rem;
    }
  }
}

.members-cell {
  height: 1.7rem;
  padding-left: 0.3rem;
  background-color: white;
  position: relative;
}

.members-cell .header {
  width: 0.9rem;
  height: 0.9rem;
  border-radius: 0.45rem;
  margin-top: 0.4rem;
  float: left;
  margin-right: 0.12rem;
  background: #eeeeee;
}

.members-cell .member-content {
  float: left;
  width: 5.5rem;
  margin-top: 0.4rem;
}

.member-content .name {
  font-size: 0.36rem;
  color: #333333;
}

.member-content .name .name-value {
  margin-right: 0.1rem;
}

.site-header {
  color: #333;
  font-size: 0.3rem;
}

.member-content .daiicon {
  width: 0.32rem;
  height: 0.32rem;
  position: absolute;
  top: 0.5rem;
  margin-left: 0.1rem;
}
.member-content .daishen {
  font-size: 0.24rem;
  color: #f73035;
  position: absolute;
  top: 0.5rem;
  margin-left: 0.5rem;
}

.member-content .time {
  font-size: 0.28rem;
  color: #999999;
}

.line-view {
  background-color: #f5f5f5;
  width: 100%;
  height: 0.16rem;
}

.after-line {
  position: relative;
}

.after-line::after {
  position: absolute;
  left: 1.3rem;
  bottom: 0;
  right: 0;
  height: 1px;
  background-color: #eeeeee;
  content: "";
}

.flag {
  position: absolute;
  right: 0.43rem;
  top: 50%;
  margin-top: -0.16rem;
}

.nav-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1.2rem;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-bottom div {
  width: 3.35rem;
  height: 0.88rem;
  border-radius: 0.04rem;
  font-size: 0.36rem;
  line-height: 0.88rem;
  text-align: center;
  margin: 0 0.08rem;
}

.pay {
  background: rgba(254, 240, 234, 1);
  color: #f27941;
}

.join {
  background: rgba(74, 176, 189, 1);
  color: white;
}

.dialog_pay_desc {
  color: #999;
  text-align: center;
  font-size: 0.3rem;
}

.dialog_pay_money {
  margin: 0.3rem auto;
  display: block;
  text-align: center;
  font-size: 0.3rem;
}
</style>

<style>
.van-number-keyboard__title {
  height: 50px;
  line-height: 50px;
}
</style>
