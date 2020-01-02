<template>
  <div class="member_box">
    <div class="header">
      <img :src="siteMember.user_photo" alt="" />
      <div class="name">{{ siteMember.user_name }}</div>
    </div>
    <van-cell-group style="padding-bottom: 1rem; background-color:rgba(0,0,0,0)">
      <van-field
        :value="siteMember.user_sex == '1' ? '男' : '女'"
        label="会员性别"
        label-width="1.4rem"
        label-class="field_label_class"
        disabled
      />
      <van-field
        :value="siteMember.user_birth"
        label="出生日期"
        label-width="1.4rem"
        label-class="field_label_class"
        disabled
      />
      <van-field
        :value="siteMember.user_education"
        label="当前学历"
        label-width="1.4rem"
        label-class="field_label_class"
        disabled
      />
      <van-field
        :value="siteMember.user_work"
        label="工作单位"
        label-width="1.4rem"
        label-class="field_label_class"
        disabled
      />
      <van-field
        :value="siteMember.user_position"
        label="工作职位"
        label-width="1.4rem"
        label-class="field_label_class"
        disabled
      />
      <van-cell
        title="个人成果描述"
        size="large"
        :label="siteMember.remark ? siteMember.remark : '暂无描述'"
        title-class="field_label_class"
      />
    </van-cell-group>

   
    
    <span v-if="siteMember">
        <div class='save-button' v-if="siteMember.auditing == '0'">
            <div class='button-content' @click="passAudit">审核通过</div>
        </div>
        <div class="save-button" v-if="siteMember.auditing == '1'">
            <div class="button-content" @click="callUser()">给他打电话</div>
        </div>
    </span>
    
  </div>
</template>

<script>
import { Field, Cell, CellGroup } from "vant";
import { passApply } from '../../api/site'
import { getUserInfo } from '../../api/user'
export default {
  components: {
    [Field.name]: Field,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup
  },

  data() {
    return {
      siteMember: null,
      userInfo: { auditing: "1" },
      isLeader: true,
    };
  },
  created() {
    this.siteMember = this.$store.state.siteMember;
    // getUserInfo().then(res => {
    //     if (res.data && res.data.member_id == this.$route.params.leaderId && this.siteMember.member_id != this.$route.params.leaderId){
    //         this.isLeader  = true;
    //     }
    // })
  },
  methods: {
      // 打电话
      callUser(){
          if (this.siteMember.phone){
              window.location.href = `tel:${this.siteMember.phone}`
          }else{
              this.$v_toast.text('该用户没有留下手机号码')
          }
      },
      // 审核通过
      passAudit(){
        this.$v_toast.loading();
        passApply({
            m_id: this.siteMember.member_id,
            auditing: '1',
            train_id: this.siteMember.train_id
        }).then(res => {
            this.$v_toast.clear();
            if (res.code == 10000) {
                this.$v_notify.success(res.msg);
                this.$router.go(-1);
            }else{
                this.$v_notify.warning(res.msg);
            }

        })
      }
  }
};
</script>

<style lang="scss" scoped>
.member_box {
  background: #f5f5f5;
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  padding: 0.3rem;
  background: white;
  margin-bottom: 0.3rem;
  img {
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 0.04rem;
    margin-right: 0.3rem;
  }
  .name {
    color: #333333;
    font-size: 0.34rem;
  }
}

.save-button {
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: white;
    height: 1.2rem;
    width: 100%;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    .button-content {
        width: 6.86rem;
        height: 0.88rem;
        background-color: #4ab0bd;
        color: white;
        font-size: .36rem;
        text-align: center;
        line-height: 0.88rem;
        border-radius: 0.04rem;
    }
}
</style>

<style lang="scss">
.field_label_class {
  font-size: 0.34rem !important;
  color: #333333;
  margin-right: 0.3rem;
}

.van-field__control {
  font-size: 0.32rem;
}

.van-cell__label {
  font-size: 0.32rem !important;
  margin-top: 0.2rem;
  min-height: 1.5rem;
}

.van-cell {
  padding: 0.26rem 0.3rem;
}
</style>
