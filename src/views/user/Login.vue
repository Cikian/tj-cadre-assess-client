<template>
  <a-spin :spinning="loading" size="large" tip="正在加载...">
  <div :loading="true" class="main">
    <a-form-model class="user-layout-login" @keyup.enter.native="handleSubmit">
      <!-- <a-tabs :activeKey="customActiveKey" :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"  @change="handleTabClick"> -->
      <!-- <a-tab-pane key="tab1" tab="账号密码登录"> -->
      <div class="logintitle">账号登录</div>
      <login-account ref="alogin" @validateFail="validateFail" @success="requestSuccess" @fail="requestFailed"></login-account>
      <!-- </a-tab-pane> -->

      <!--        <a-tab-pane key="tab2" tab="手机号登录">-->
      <!--          <login-phone ref="plogin" @validateFail="validateFail" @success="requestSuccess" @fail="requestFailed"></login-phone>-->
      <!--        </a-tab-pane>-->
      <!-- </a-tabs> -->

      <!--      <a-form-model-item>-->
      <!--        <a-checkbox @change="handleRememberMeChange" default-checked>自动登录</a-checkbox>-->
      <!--        <router-link :to="{ name: 'alteration'}" class="forge-password" style="float: right;">-->
      <!--          忘记密码-->
      <!--        </router-link>-->
      <!--        <router-link :to="{ name: 'register'}" class="forge-password" style="float: right;margin-right: 10px" >-->
      <!--          注册账户-->
      <!--        </router-link>-->
      <!--      </a-form-model-item>-->

      <a-form-item style="margin-top:14px">
        <a-button size="middle"  type="primary"  htmlType="submit"  class="login-button"  :loading="loginBtn"  @click.stop.prevent="handleSubmit" :disabled="loginBtn">登录
        </a-button>
      </a-form-item>

    </a-form-model>

    <two-step-captcha v-if="requiredTwoStepCaptcha" :visible="stepCaptchaVisible" @success="stepCaptchaSuccess" @cancel="stepCaptchaCancel"></two-step-captcha>
    <login-select-tenant ref="loginSelect" @success="loginSelectOk"></login-select-tenant>
    <third-login ref="thirdLogin"></third-login>
  </div>
  </a-spin>
</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN, ENCRYPTED_STRING } from '@/store/mutation-types'
import ThirdLogin from './third/ThirdLogin'
import LoginSelectTenant from './LoginSelectTenant'
import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
import { getEncryptedString } from '@/utils/encryption/aesEncrypt'
import { timeFix } from '@/utils/util'

import LoginAccount from './LoginAccount'
import LoginPhone from './LoginPhone'

export default {
  components: {
    LoginSelectTenant,
    TwoStepCaptcha,
    ThirdLogin,
    LoginAccount,
    LoginPhone
  },
  data () {
    return {
      customActiveKey: 'tab1',
      rememberMe: true,
      loginBtn: false,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      encryptedString:{
        key:"",
        iv:"",
      },
      loading: true,
    }
  },
  created() {
    let query = this.$route.query
    // 获取query的属性名称
    let propertyName = Object.keys(query)[0];

    if (!propertyName || query[propertyName]){
      this.loading = false
      Vue.ls.remove(ACCESS_TOKEN)
      this.getRouterData();
      this.rememberMe = true
    }

  },

  mounted () {
    let query = this.$route.query

    // 获取query的属性名称
    let propertyName = Object.keys(query)[0];

    if (propertyName && !query[propertyName]){
      this.LoginWithOA(propertyName)
    }
  },

  methods:{
    handleTabClick(key){
      this.customActiveKey = key
    },
    handleRememberMeChange(e){
      this.rememberMe = e.target.checked
    },
    /**跳转到登录页面的参数-账号获取*/
    getRouterData(){
      this.$nextTick(() => {
        let temp = this.$route.params.username || this.$route.query.username || ''
        if (temp) {
          this.$refs.alogin.acceptUsername(temp)
        }
      })
    },

    LoginWithOA(username){
      this.$refs.alogin.handleLoginWithOA(username)
    },

    changeLoading(b){
      if (b !== undefined && typeof b !== null){
        this.loading = b
      } else {
        this.loading = !this.loading
      }
    },

    //登录
    handleSubmit () {
      this.loginBtn = true;
      if (this.customActiveKey === 'tab1') {
        // 使用账户密码登录
        this.$refs.alogin.handleLogin(this.rememberMe)
      } else {
        //手机号码登录
        this.$refs.plogin.handleLogin(this.rememberMe)
      }
    },
    // 校验失败
    validateFail(){
      this.loginBtn = false;
    },
    // 登录后台成功
    requestSuccess(loginResult){
      this.$refs.loginSelect.show(loginResult)
    },
    //登录后台失败
    requestFailed (err) {
      this.changeLoading(false)
      let description = ((err.response || {}).data || {}).message || err.message || "请求出现错误，请稍后再试"
      this.$notification[ 'error' ]({
        message: '登录失败',
        description: description,
        duration: 4,
      });
      //账户密码登录错误后更新验证码
      if(this.customActiveKey === 'tab1' && description.indexOf('密码错误')>0){
        this.$refs.alogin.handleChangeCheckCode()
      }
      this.loginBtn = false;
    },
    loginSelectOk(){
      this.loginSuccess()
    },
    //登录成功
    loginSuccess () {
      this.$router.push({ path: "/dashboard/analysis" }).catch(()=>{
        console.log('登录跳转首页出错,这个错误从哪里来的')
      })
      this.$notification.success({
        message: '欢迎',
        description: `${timeFix()}，欢迎回来`,
      });
    },

    stepCaptchaSuccess () {
      this.loginSuccess()
    },
    stepCaptchaCancel () {
      this.Logout().then(() => {
        this.loginBtn = false
        this.stepCaptchaVisible = false
      })
    },
    //获取密码加密规则
    getEncrypte(){
      var encryptedString = Vue.ls.get(ENCRYPTED_STRING);
      if(encryptedString == null){
        getEncryptedString().then((data) => {
          this.encryptedString = data
        });
      }else{
        this.encryptedString = encryptedString;
      }
    }

  }

}
</script>
<style lang="less" scoped>
/* .main{
  background-image: url('~@/assets/登录背景.jpg');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  height: 100vh;
  width: 100vw;
} */
.user-layout-login {
  background-image: url('~@/assets/登录框.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  padding: 60px 20px 20px 20px;
  position: relative;
  margin: 0 auto;
  display: flex; /* 添加此行 */
  flex-direction: column; /* 子元素垂直排列 */
  align-items: center; /* 水平居中子元素 */
  .logintitle{
    /* width:20%; */
    position: absolute;
    top: 0;
    height: 40px;
    line-height: 40px;
    color: #fff;
    font-weight: 800;
    font-size: 16px;

  }


  label {
    font-size: 16px;
  }
  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 16px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
    background-color: rgba(23,106,198);
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0,0,0,.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color .3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
<style>
.valid-error .ant-select-selection__placeholder{
  color: #f5222d;
}
</style>