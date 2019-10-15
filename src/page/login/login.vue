<template>
  <div class="iv-login-wrapper" :style="[bgImg]">
    <div class="iv-login-logo iv-fs-24 iv-fw-b">管理系统平台</div>
    <div class="iv-login-top-menu">
      <ul class="iv-login-menu iv-fc-45">
        <li><i class="iconfont icon-message"></i>意见反馈</li>
        <li><i class="iconfont icon-question-circle"></i>帮助</li>
        <li><i class="iconfont icon-shopping"></i>购买</li>
      </ul>
    </div>
    <div class="iv-login-wrapper-content" :style="[bgImg2]">
      <div class="iv-card">
        <div class="iv-card-head iv-fs-14 iv-fw-b" :style="[logoTypeBt]">
          <div class="iv-pull-left"
               :class="{'iv-login-type-active' : loginType === 1}" @click="loginType = 1">
            业务平台登录</div>
          <div class="iv-pull-left"
               :class="{'iv-login-type-active' : loginType === 2}" @click="loginType = 2">
            管理平台登录</div>
        </div>
        <div class="iv-card-body">
          <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
            <FormItem prop="loginName" style="width: 100%;" class="iv-m-b-24">
              <Input
                type="text"
                v-model.trim="formInline.loginName"
                @on-keydown="submitLogin"
                placeholder="请输入账号" autofocus>
                <i slot="prepend" class="iconfont icon-user iv-fc-25"></i>
              </Input>
            </FormItem>
            <FormItem prop="password" style="width: 100%;" class="iv-m-b-16">
              <Input
                type="password"
                @on-keydown="submitLogin"
                v-model.trim="password"
                placeholder="请输入密码">
                <i slot="prepend" class="iconfont icon-lock iv-fc-25"></i>
              </Input>
            </FormItem>
            <FormItem class="iv-login-opt iv-m-b-16">
             <div>
               <p class="iv-pull-left">
                 <Checkbox v-model="single">记住账号</Checkbox>
               </p>
               <p class="iv-pull-right ">
                 <span class="iv-pointer iv-hover-main-color iv-fs-12">忘记密码?</span>
               </p>
             </div>
            </FormItem>
<!--            <img class="iv-validateImg iv-pull-right iv-pointer" @click="changeVcode" :src="getVcode" alt="">-->
            <!--          <FormItem prop="vcode" style="width: 288px;">-->
            <!--              <Input @keyup.native.enter="submitLogin" type="text" v-model.trim="formInline.vcode" placeholder="请输入验证码">-->
            <!--                  <Icon class="w40" type="image" slot="prepend"></Icon>-->
            <!--              </Input>-->
            <!--          </FormItem>-->
            <Button type="primary" class="iv-fs-16 iv-fw-b" long @click="submitLogin">登&nbsp;录</Button>
          </Form>
        </div>
        <div class="iv-login-qr-bt">
          <span class="iv-fs-14 iv-fc-45">扫码登录更安全</span>
          <img class="iv-pointer" :src="qrBt" alt="">
        </div>
      </div>
    </div>
    <div class="iv-login-bottom-menu">
      <ul class="iv-login-menu iv-fc-45">
        <li>关于我们</li>
        <li>系统手册</li>
        <li>客户服务</li>
        <li>&#169;2019 Goldgov Corporation</li>
      </ul>
    </div>
  </div>
</template>
<script>
import { prefixPath, indexRouter, power } from '@/config'
import { mapMutations, mapActions } from 'vuex'
export default {
  data () {
    return {
      loginType: 1,
      single: false,
      bgImg: {
        background: `url(${require('images/login/login-bg-1.jpg')}) no-repeat`
      },
      bgImg2: {
        background: `url(${require('images/login/login-bg-2.png')}) no-repeat`
      },
      logo: {
        background: `url(${require('images/login/login-logo.png')}) no-repeat`,
        backgroundSize: '100% 100%'
      },
      logoTypeBt: {
        background: `url(${require('images/login/login-type-bg.jpg')}) no-repeat`,
        backgroundSize: '100% 100%'
      },
      qrBt: require('images/login/login-qr-bt.png'),
      formInline: {
        loginName: '',
        password: ''
      },
      ruleInline: {
        loginName: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ],
        vcode: [
          { required: false, message: '验证码不能为空', trigger: 'blur' }
        ]
      },
      vcode: Math.random(),
      password: ''
    }
  },
  computed: {
    getVcode () {
      return `${prefixPath}user/generateCaptchaImage?${this.vcode}`
    }
  },
  created () {
    this.isSend = false
    //清空菜单选项
    this.menuactive('')
    this.menuopen([])
    this.crumbsList([])
    this.cacheList([])
    sessionStorage.removeItem('crumbsList')
    localStorage.removeItem('token')
  },
  watch: {
    password (newVal) {
      this.formInline.password = newVal
    }
  },
  mounted () {},
  methods: {
    ...mapMutations([
      'token'
    ]),
    ...mapMutations({
      'menuactive': 'MENUACTIVENAME'
    }),
    ...mapMutations({
      'crumbsList': 'CRUMBS_LIST'
    }),
    ...mapMutations({
      'menuopen': 'MENUOPENNAME'
    }),
    ...mapMutations({
      'cacheList': 'CACHE_LIST'
    }),
    ...mapActions({
      login: 'loginValidate'
    }),
    changeVcode () {
      this.vcode = Math.random()
    },
    submitLogin (e) {
      if (e.type === 'keydown' && e.keyCode !== 13) return
      this.$refs.formInline.validate((validate) => {
        if (!validate) return
        if (!power) {
          this.$router.push({
            name: indexRouter
          })
          return
        }
        this.$ajax({
          url: '/login',
          method: 'POST',
          data: {
            loginName: this.formInline.loginName,
            pwd: this.formInline.password
          }
        }).then(({data}) => {
          localStorage.token = '1'
          //跳转员工端
          if (this.loginType === 1) {
            let {protocol, host} = location
            window.location.href = `${protocol}//${host}/consumer/index.html`
            return
          }
          this.$router.push({
            name: indexRouter
          })
        })
      })
    },
    loginFail () {
      this.$Message.error({
        content: '用户名或密码输入错误',
        duration: 2
      })
      this.changeVcode()
    }
  }
}
</script>
<style lang="scss">
  .iv-login-menu{
    li{
      display: inline-block;
      margin-left: 24px;
      padding-right: 24px;
      border-right: 1px #ddd solid;
      i{
        font-size: 14px;
        padding-right: 8px;
        vertical-align: -1px;
      }
      &:last-child{
        padding-right: 0;
        border-right: none;
      }
    }
  }
  .iv-login-wrapper {
    height: 100%;
    padding-top: 134px;
    background-size: cover !important;
    position: relative;
    .iv-login-logo{
      width: 140px;
      height: 44px;
      position: absolute;
      left: 40px;
      top: 64px;
    }
    .iv-login-top-menu{
      position: absolute;
      right: 40px;
      top: 75px;
    }
    .iv-login-bottom-menu{
      text-align: right;
      padding-right: 40px;
      padding-top: 40px;
    }
    .iv-login-wrapper-content{
      width: 1176px;
      height: 500px;
      margin: 0 auto;
      border-radius: 10px;
      position: relative;
      background: linear-gradient(180deg,rgba(101,174,249,1) 0%,rgba(53,118,240,1) 100%);
      .iv-card {
        box-sizing: border-box;
        width: 360px;
        height: 360px;
        background:rgba(255,255,255,1);
        box-shadow:0px 2px 4px 0px rgba(0,0,0,0.3);
        border-radius: 8px;
        position: absolute;
        right: 40px;
        top: 50%;
        overflow: hidden;
        margin-top: -180px;
        .iv-login-qr-bt{
          width: 100%;
          padding-left: 24px;
          padding-top: 18px;
          img{
            width: 48px;
            height: 40px;
            position: absolute;
            right: 8px;
            bottom: 8px;
          }
        }
        .ivu-form-item-error-tip{
          font-size: 12px !important;
          line-height: 22px !important;
          padding-top: 0;
        }
        .iv-card-head {
          cursor: pointer;
          background: linear-gradient(180deg,rgba(255,255,255,1) 0%,rgba(232,245,255,1) 100%);
          height: 56px;
          div {
            text-align: center;
            line-height: 56px;
            border-bottom: 1px #ddd solid;
            width: 180px;
            height: 100%;
          }
          div:first-child{
            border-right: 1px #ddd solid;
          }
          .iv-login-type-active{
            border: none;
            background: #ffffff;
          }
        }
        .iv-card-body {
          margin-top: 32px;
          padding: 0 24px;
          .iv-form-item {
            margin-bottom: 32px;
          }
          .iv-validateImg {
            width: 97px;
            height: 40px;
          }
          .iv-input, .iv-btn {
            height: 40px;
            font-size: 16px;
            line-height: 24px;
          }
          .ivu-input-group-prepend{
            background: #fff;
            padding:4px 4px 4px 14px;
            border-right: none!important;
          }
          .w40 {
            width: 40px;
          }
        }
      }
    }
  }
</style>
<style lang="scss">
.iv-login-wrapper {
  .ivu-form-item {
    /*margin-bottom: 40px  !important;*/
    height: 40px;
    .ivu-input {
      height: 40px !important;
      border-left: none!important;
      outline: 0;
      -webkit-animation-name: autofill;
      -webkit-animation-fill-mode: both;
    }
  }
  .iv-login-opt{
    width: 100%;
    height: 32px!important;
  }
  .ivu-btn-primary {
    height:40px;
    background:rgba(24,144,255,1);
    box-shadow:0px 2px 3px 0px rgba(255,255,255,0.3);
    border-radius:4px;
    border:1px solid rgba(0,101,194,1);
  }
}
@-webkit-keyframes autofill {
  to {
    color: #333;   //input中文字的颜色
    background: transparent;
  }
}
</style>
