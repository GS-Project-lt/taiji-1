<template>
    <div>
        <div class="my-help">
            <div class="title">您已累计捐助</div>
            <div class="total">
                {{amount}}
                <span>元</span>
            </div>
        </div>
        <div class="prices" v-if="list">
            <div class="title">技术捐助</div>
            <van-row style="padding: 0 0.3rem;" class="items" :gutter="8">
                <van-col style="margin: .1rem 0" :span="8" v-for="charge in list" :key="charge.money" @click="currentCharge = charge.money">
                    <div class="priceitem" :class="{'priceitem-sel': currentCharge == charge.money}">{{charge.money}}<span>{{charge.unit}}</span></div>
                </van-col>
            </van-row>
        </div>
        <div class="remark" v-if="remarks">
            <div class="title">捐助说明</div>
            <div>
                <p v-for="(mark, index) in remarks" :key="'mark' + index">{{mark}}</p>
            </div>
        </div>
        
        <div class="button" @click="pay">确认捐助</div>
    </div>
</template>

<script>
import { getUserInfo } from '../../api/user';
import { helpUsData ,createOrder} from '../../api/order';
import { Row, Col } from 'vant'

export default {
    components: {
        [Row.name]: Row,
        [Col.name]: Col,
    },
    data () {
        return {
            userInfo: null,
            amount: 0,
            list: null,
            remarks: null,
            currentCharge: 0
        }
    },
    created () {
        this.userinfo();
    },
    methods: {
        userinfo(){
            getUserInfo().then(res => {
                if (res.code == 10001){
                    this.amount = res.data.amount;
                    this.userInfo = res.data;
                }
            });

            this.$toast.loading();
            helpUsData().then(res => {
                if (res.code == 10001){
                    this.list = res.data.list;
                    this.currentCharge = this.list[0].money;
                    this.remarks = res.data.remark;
                }
                this.$toast.clear();
            })
        },

        pay(){
            createOrder({
                openid: this.userInfo.open_id,
                money: this.currentCharge,
                pay_canal: 1,
                bill_type: 1
            }).then(res => {
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
                        this.$v_notify.success('感谢您的捐助，我们将持续完善产品')
                    }
                })
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.my-help{
    background:linear-gradient(143deg,rgba(247,189,153,1) 0%,rgba(236,128,73,1) 100%);
    margin: .3rem;
    height: 2.2rem;
    color: #ffffff;
    .title{
        width: 100%;
        text-align: center;
        margin-top: .26rem;
        font-size: .3rem;
        display: inline-block;
    }
    .total{
        width: 100%;
        text-align: center;
        font-size: .66rem;
        font-weight: 600;
        margin-top: .3rem;
        span{
            font-size: .24rem;
        }
    }
}

.prices{
    .title{
        font-size: .36rem;
        margin: .4rem .3rem .3rem;
    }
    .priceitem{
        border-radius:.08rem;
        border:1px solid rgba(239,145,95,1);
        height: 1.2rem;
        line-height: 1.2rem;
        text-align: center;
        color: #666666;
        font-size: .46rem;
        span{
            font-size: .24rem;
        }
    }
    .priceitem-sel{
        background-color: #EF915F;
        color: #ffffff;
    }
}

.remark{
    padding: .3rem;
    .title{
        color: #999;
        font-size: .3rem;
    }
    p{
        font-size: .26rem;
        color: #999;
    }
}

.button{
    position: fixed;
    bottom: .3rem;
    left: .3rem;
    right: .3rem;
    height: .88rem;
    background:linear-gradient(143deg,rgba(247,189,153,1) 0%,rgba(236,128,73,1) 100%);
    border-radius:.04rem;
    text-align: center;
    line-height: .88rem;
    color: #ffffff;
    font-size: .36rem;
    margin-top: .4rem;
}
</style>