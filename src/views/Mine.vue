<template>
  <div>
    <!-- right-text="保存修改" -->
    <!-- <van-nav-bar
      title="我的信息"
      
      fixed
      @click-right="saveUserInfo"
      style="margin-top: 46px;"
    /> -->
    <div>
        <div class="user-header">
          <div class="title">
            我的头像
          </div>
          <div class="user-pic">
            <!-- <van-uploader :after-read="imageGetted"> -->
              <img :src="userInfo.user_photo" alt="">
            <!-- </van-uploader> -->
          </div>
        </div>
        <div class="temp-view" style="height: .36rem;"></div>
        <van-cell-group>
            <van-field label="手机号码" input-align="right" type="tel" right-icon="arrow" v-model="userInfo.phone" placeholder="请输入手机号码" />
            <van-cell title="选择站点" is-link :value-class="pickers.site.current ? 'color-black' : ''" :value="pickers.site.current || '请选择'" @click="showPicker(pickers, 'site')" />
            <van-cell title="当前角色" is-link :value-class="pickers.roles.current ? 'color-black' : ''" :value="pickers.roles.current || '请选择'" @click="showPicker(pickers, 'roles')"  />
            <van-cell title="学拳日期" is-link :value-class="userInfo.add_date ? 'color-black' : ''" :value="userInfo.add_date" @click="showTimePicker('add_date')"  />
            <van-field label="真实姓名" input-align="right" right-icon="arrow" v-model="userInfo.user_name" placeholder="请输入真实姓名" />
            <van-cell title="会员性别" is-link :value-class="pickers.sex.current ? 'color-black' : ''" :value="pickers.sex.current || '请选择'" @click="showPicker(pickers, 'sex')"/>
            <van-cell title="出生日期" is-link :value-class="userInfo.user_birth ? 'color-black' : ''" :value="userInfo.user_birth" @click="showTimePicker('user_birth')"  />
            <van-cell title="当前学历" is-link :value-class="pickers.educations.current ? 'color-black' : ''" :value="pickers.educations.current || '请选择'" @click="showPicker(pickers, 'educations')"/>
            <van-field label="工作单位" input-align="right" right-icon="arrow" v-model="userInfo.user_work" placeholder="请输入工作单位" />
            <van-field label="工作职位" input-align="right" right-icon="arrow" v-model="userInfo.user_position" placeholder="请输入工作职位" />
            <van-field
            input-align="right"
                v-model="userInfo.remark"
                rows="4"
                autosize
                label="个人描述"
                type="textarea"
                maxlength="40"
                placeholder="一句话描述一下自己"
                show-word-limit
            />
        </van-cell-group>
        <div class="temp-view" style="height: 1.1rem;"></div>
        <div class="confirmbutton">
          <div class="button" @click="saveUserInfo" v-if="token">确认并保存</div>
          <div class="button" @click="regist" v-else>注册</div>
        </div>

    </div>
    <van-popup v-model="showPop" position="bottom">
          <van-picker :default-index="defaultPickerIndex" :columns="pickerCols" show-toolbar title="" @cancel="pickerCancel" @confirm="pickerConfirm"></van-picker>
    </van-popup>
    <van-popup v-model="showTime" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :formatter="formatterDate"
        :min-date="minDate"
        @cancel="showTime = false" 
        @confirm="datePickerConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
import { CellGroup, Field , Cell, Picker, Popup, DatetimePicker ,NavBar , Uploader} from "vant";
import { siteList } from '../api/site';
import { getUserInfo,saveUserInfo, uploadImage ,registNew} from '../api/user'
import { notify , toast} from '../utils/interaction'
import { mapGetters } from 'vuex'

export default {
  components: {
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [Cell.name]: Cell,
    [Picker.name]: Picker,
    [Popup.name]: Popup,
    [DatetimePicker.name]: DatetimePicker,
    [NavBar.name]: NavBar,
    [Uploader.name]: Uploader
  },
  computed: {
    ...mapGetters(['userInfo','wxUserInfo','token'])
  },
  data() {
    return {
        value:'',
        showPop: false,
        showTime: false,
        minDate: new Date('1900/01/01'),
        // userInfo:null,
        sites:[],
        pickers: {
          index: '',
          site: {
            current: '',
            array: []
          },
          sex: {
            current: '',
            array: ['男','女']
          },
          educations: {
            current: '',
            array: ['初中及以下','高中','大专','本科','硕士','硕士及以上']
          },
          roles: {
            current: '',
            array: ['站长','学员'] // 1站长  2学员
          },
        },
        pickerCols: [],
        defaultPickerIndex: 0,
        currentDate: new Date('2000/01/01'),
        currentDateIndex: '' //时间选择器打开索引
      };
  },
  watch:{
    'pickers.site.current' (value ,oldvalue){
      const self = this;
      this.sites.forEach(site => {
        if (value == site.train_name){
          self.userInfo.train_id = site.train_id;
        }
      })
      console.log(this.userInfo);
    },
    'pickers.sex.current' (value ,oldvalue){
        this.userInfo.user_sex = value == '男' ? 1 : 2;
        console.log(this.userInfo);
    },
    'pickers.educations.current' (value ,oldvalue){
      this.userInfo.user_education = value;
      console.log(this.userInfo);
    },
    'pickers.roles.current' (value ,oldvalue){
      this.userInfo.role_id = value == '站长' ? 1: 2;
      console.log(this.userInfo);
    },
  },
  created () {
    this.setUIData();
    this.getSiteList();
    // this.userinfo(true);
  },
  methods: {
    userinfo(loading){
      if (loading){
        toast.loading();
      }
      getUserInfo().then(res => {
        toast.clear();
        if (res.code == 10001) {
          this.userInfo = res.data.user_info;
          this.setUIData();
          this.getSiteList();
        }
      })
    },
    getSiteList(){
      siteList().then(res => {
        if (res.code == 10001){
          this.sites = res.data;
          let self = this, sites = [];
          res.data.forEach( site => {
            sites.push(site.train_name);
          })
          self.pickers.site.array = sites;
          self.setUIData();
          console.log(self.pickers.site);
        }
      })
    },
    setUIData(){
      const self = this;
      // 站点 
      if (this.userInfo.train_id){
        this.sites.forEach(site => {
          if (self.userInfo.train_id == site.train_id){
            self.pickers.site.current = site.train_name;
          }
        })
      }

      // 角色
      if (this.userInfo.role_id && parseInt(this.userInfo.role_id)){
          this.pickers.roles.current = this.pickers.roles.array[parseInt(this.userInfo.role_id) - 1];
      }

      // 性别
      if (this.userInfo.user_sex && parseInt(this.userInfo.user_sex)){
          this.pickers.sex.current = this.pickers.sex.array[parseInt(this.userInfo.user_sex) - 1];
      }

      this.pickers.educations.current = this.userInfo.user_education;

    },
    showPicker(pickers, pickerindex){
      this.showPop = true;
      this.pickerCols = pickers[pickerindex].array;
      this.pickers.index = pickerindex;
    },
    pickerCancel(){
      this.showPop = false;
    },
    pickerConfirm(value, index){
      let currentPicker = this.pickers[this.pickers.index];
      currentPicker.current = currentPicker.array[index]; // 展示层
      //数据提交层

      this.showPop = false;
    },

    formatterDate(type, value){
        if (type === 'year') {
          return `${value}年`;
        } else if (type === 'month') {
          return `${value}月`
        } else if (type === 'day' ){
          return `${value}日`
        }
        return value;
    },
    showTimePicker(dateindex){
      if (this.userInfo[dateindex]){
        let date = this.userInfo[dateindex];
        date = date.split('-');
        date = date.join('/');
        this.currentDate = new Date(this.userInfo[dateindex]);
      }
      this.currentDateIndex = dateindex;
      this.showTime = true;
    },
    datePickerConfirm(value){ 
      const time = new Date(value);
      let y = time.getFullYear(), m = this.addZero(time.getMonth() + 1), d = time.getDate();
      this.userInfo[this.currentDateIndex] = `${y}-${m}-${d}`;
      this.showTime = false;
    },
    addZero(t){
      let result = t < 9 ? `0${t}` : t;
      return result; 
    },

    imageGetted(file,detail){
      console.log(file,detail);
      let params = new FormData();
      params.append('file', file.content);
      params.append('type', "2");
      uploadImage(params).then(res => {

      })
    },

    //注册
    regist(){
      registNew(this.userInfo).then(res => {
        if (res.code == 10000){
          let userinfo = res.data.user_info;
          userinfo.token = res.data.token;
          this.$store.commit('SET_USER_INFO',userinfo);
          this.$v_notify.success('注册成功');
          this.setUIData();
          this.getSiteList();
        }else{
          this.$v_notify.warning(res.msg);
        }
      })
    },

    // 保存修改信息
    saveUserInfo(){
      console.log(this.userInfo);
      toast.loading('保存中...');
      saveUserInfo(this.userInfo).then(res => {
        toast.clear();
        if (res.code == 10000){
          let userinfo = res.data.user_info;
          userinfo.token = res.data.token;
          this.$store.commit('SET_USER_INFO',userinfo);
          notify.success(res.msg);
          this.setUIData();
          this.getSiteList();

        }else{
          notify.danger(res.msg);
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>

.user-header{
  height: 1.8rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title{
     color: #333333;
     font-size: .34rem;
     margin-left: .3rem;
  }

  .user-pic{
    width: 1.2rem;
    height: 1.2rem;
    border-radius: .04rem;
    overflow: hidden;
    margin-right: .4rem;
    img{
      width: 100%;
      height: 100%;
    }
  }
}

.color-black{
  color: #323233;
}

.temp-view{
  background-color: #eeeeee;
}

.confirmbutton{
  height: 1.2rem;
  width: 100%;
  margin-bottom: 1.1rem;
  .button{
      margin: 0 .3rem;
      height: .88rem;
      background:rgba(74,176,189,1);
      border-radius:.04rem;
      text-align: center;
      line-height: .88rem;
      color: #ffffff;
      font-size: .36rem;
      margin-top: .4rem;
  }
}


</style>
