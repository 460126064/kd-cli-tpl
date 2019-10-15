<template>
  <div class="iv-topinfo-wrapper">
    <div class="iv-user iv-pull-right">
      <span class="iv-power-off iv-pull-right iv-p-l-24 iv-p-r-24" @click="logout" title="退出"><IconFont type="poweroff" class="iv-fs-14"></IconFont></span>
      <span class="iv-full-screen iv-pull-right iv-p-l-24 iv-p-r-24" @click="fullScreen" title="全屏"><IconFont type="fullscreen" class="iv-fs-14"></IconFont></span>
      <span class="iv-user-name iv-pull-right iv-p-l-24 iv-p-r-24 iv-main-color iv-pointer iv-hover-color" @click="changePassWord">{{username}}</span>
      <span class="iv-user-scope iv-pull-right">
        <Icon type="shuffle" class="iv-fs-14" v-if="scopeList.length>0" title="管理范围"></Icon>
        <span v-if="scopeList.length==1">{{currentScope['ORGANIZATION_NAME']}}</span>
        <Dropdown v-if="scopeList.length>1" trigger="click" @on-click="changeScope">
          <span>{{currentScope['ORGANIZATION_NAME']}}</span>
          <Icon type="arrow-down-b"></Icon>
          <DropdownMenu slot="list">
            <DropdownItem
              v-for="(item, $index) in scopeList"
              :key="$index"
              :name="item['SCOPE_CODE']">{{item['ORGANIZATION_NAME']}}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </span>
    </div>
    <Modal
      title="修改密码"
      @on-ok="onBigConfrim"
      class="uit-form-modal"
      loading
      v-model="showUpdatePassWord">
      <FormLayout  class="iv-cover-input">
        <Form label-position="top"
        :model="formItem"
        :rules="ruleValidate"
        ref="pwForm">
          <Row>
            <Col
              :xs="24"
              :md="24"
              :lg="24">
              <FormItem class="iv-p-l-16 iv-p-r-16 iv-class-fileupload"  prop="oldPasswd" label="当前密码">
                <Input v-model.trim="formItem.oldPasswd"
                type="password"
                placeholder="密码长度8到32位，包含数字和字母"
                class="uit-input-code">
                </Input>
              </FormItem>
            </Col>
            <Col
              :xs="24"
              :md="24"
              :lg="24">
              <FormItem class="iv-p-l-16 iv-p-r-16 iv-class-fileupload"  prop="passwd" label="新密码">
                <Input v-model.trim="formItem.passwd"
                type="password"
                placeholder="密码长度8到32位，包含数字和字母"
                class="uit-input-code">
                </Input>
              </FormItem>
            </Col>
            <Col
              :xs="24"
              :md="24"
              :lg="24">
              <FormItem class="iv-p-l-16 iv-p-r-16 iv-class-fileupload"  prop="passwdconfirm" label="确认密码">
                <Input v-model.trim="formItem.passwdconfirm"
                type="password"
                placeholder="确认密码和新密码保持一致"
                class="uit-input-code">
                </Input>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </FormLayout>
    </Modal>
    <!-- <div class="iv-switch-skin iv-pull-right">
      <span
        v-for="item in colorList"
        :key="item"
        :style="getBgColor(item)"
        @click="changeSkin(item)"
        class="iv-p-8 iv-m-r-8"></span>
    </div> -->
  </div>
</template>
<script type="text/javascript">
import IconFont from '@/components/iconfont'
import Modal from '@/components/modal'
import { prefixPath } from '@/config'
import imagePath from '@/mixins/image-path'
import validate from '@/mixins/validate'
import FormLayout from '@/components/layout/form-layout'
import {mapMutations} from 'vuex'
import md5 from 'js-md5'
export default {
  mixins: [validate, imagePath],
  data () {
    return {
      colorList: ['#52C41A', '#2F54EB', 'rgba(255,0,0,1)'],
      user: {},
      logoutUrl: `${prefixPath}/logout`,
      headImg: '',
      scopeList: [],
      currentScope: {},
      formItem: {
        oldPasswd: '',
        passwd: '',
        passwdconfirm: ''
      },
      showUpdatePassWord: false,
      username: 'Admin'
    }
  },
  components: {
    IconFont,
    Modal,
    FormLayout
  },
  created () {
    const validatepasswd = (rule, val, callback) => {
      let re = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,32}$/i
      if (!val || re.test(val)) {
        callback()
      } else {
        callback(new Error('密码长度8到32位，包含数字和字母'))
      }
    }
    // this.currentUser()
    // this.listScope()
    this.ruleValidate = {
      oldPasswd: [
        { required: true, message: '此项必填', trigger: 'blur' }
      ],
      passwd: [
        { required: true, message: '此项必填', trigger: 'blur' },
        { type: 'string', min: 8, max: 32, message: '密码长度8到32位，包含数字和字母', trigger: 'blur' },
        { validator: validatepasswd, message: '密码长度8到32位，包含数字和字母', trigger: 'blur' }
      ],
      passwdconfirm: [
        { required: true, message: '此项必填', trigger: 'blur' },
        { min: 8, max: 32, message: '密码长度8到32位，包含数字和字母', trigger: 'blur' },
        { validator: validatepasswd, message: '密码长度8到32位，包含数字和字母', trigger: 'blur' }
      ]
    }
  },
  methods: {
    ...mapMutations([
      'USER_INFO'
    ]),
    getBgColor (color) {
      return {
        background: color
      }
    },
    changeSkin (color) {
      this.$api.colorUnitConvert(color).then((color) => {
        //计算颜色值
        const mainColor = color
        const mainHoverColor = this.$api.colorComputed(color, 5)
        const mainBgColor = this.$api.colorComputed(color, 1)
        const mainClickColor = this.$api.colorComputed(color, 7)
        const cssRules = document.styleSheets[3].cssRules
        console.log(mainHoverColor, mainBgColor, mainClickColor)
        for (let key of cssRules) {
          if (!key.style || (!key.style.color && !key.style['background'])) continue
          //代码转换
          key.style.color && key.style.setProperty('background', mainColor, 'important')
          key.style.background && key.style.setProperty('background', mainColor, 'important')
        }
      })
    },
    /**
     * 修改密码
     */
    changePassWord () {
      this.formItem = Object.assign({}, this.formItem, {
        oldPasswd: '',
        passwd: '',
        passwdconfirm: ''
      })
      this.showUpdatePassWord = true
    },
    onBigConfrim () {
      if (this.formItem.oldPasswd == '') {
        return this.$Message.error('请输入当前密码')
      }
      if (this.formItem.passwd != this.formItem.passwdconfirm) {
        return this.$Message.error('确认密码与新密码不一致')
      }
      this.validate('pwForm')
        .then((validate) => {
          if (!validate) return
          this.$ajax({
            url: 'api-ouser/workbench/user/account/updatePasswd',
            method: 'PUT',
            data: {
              oldPasswd: md5(this.formItem.oldPasswd),
              passwd: md5(this.formItem.passwd),
              accountId: this.user.account.accountId
            }
          }).then(res => {
            this.showUpdatePassWord = false
            this.logout()
          })
        })
    },
    /**
     * 当前用户信息
     */
    currentUser () {
      this.$ajax({
        url: 'api-ouser/workbench/user/getCurrentUser',
        method: 'GET'
      }).then(res => {
        this.user = res.data.data
        this.USER_INFO(res.data.data)
        this.getImgSrc('headImg', 'user', this.user.headImg)
      })
    },
    fullScreen () {
      //判断可不可以全屏
      let fullscreenEnabled = document.fullscreenEnabled ||
          document.mozFullScreenEnabled ||
          document.webkitFullscreenEnabled ||
          document.msFullscreenEnabled
      let fullscreenElement = document.fullscreenElement ||
          document.mozFullScreenElement ||
          document.webkitFullscreenElement
      if (fullscreenEnabled) {
        if (fullscreenElement) {
          this.exitFullscreen()
        } else {
          this.setFullscreen()
        }
      } else {
        this.showScreen = false
      }
    },
    //进入全屏
    setFullscreen (element) {
      let el = element instanceof HTMLElement ? element : document.documentElement
      let rfs = el.requestFullscreen ||
          el.webkitRequestFullscreen ||
          el.mozRequestFullScreen ||
          el.msRequestFullscreen
      if (rfs) {
        rfs.call(el)
      } else if (window.ActiveXObject) {
        var ws = new window.ActiveXObject('WScript.Shell')
        ws && ws.SendKeys('{F11}')
      }
    },
    //退出全屏
    exitFullscreen () {
      let efs = document.exitFullscreen ||
          document.webkitExitFullscreen ||
          document.mozCancelFullScreen ||
          document.msExitFullscreen
      if (efs) {
        efs.call(document)
      } else if (window.ActiveXObject) {
        let ws = new window.ActiveXObject('WScript.Shell')
        ws && ws.SendKeys('{F11}')
      }
    },
    /**
     * 登出
     */
    logout () {
      this.$ajax({
        url: '/logout',
        method: 'GET'
      }).then(res => {
        sessionStorage.clear()
        localStorage.clear()
        this.$router.push('/')
      })
    },
    listScope () {
      this.$ajax({
        url: 'user/listScope',
        method: 'GET'
      }).then(res => {
        if (res.data.result) {
          this.scopeList = res.data.result
        }
        this.setCurrentScope(res.data.current)
      })
    },
    /**
     * 切换管理范围
     */
    changeScope (scopeCode) {
      ///user/setScope
      this.$ajax({
        url: 'user/setScope',
        method: 'GET',
        data: {
          scopeCode: scopeCode
        }
      }).then(res => {
        this.setCurrentScope(scopeCode)
        history.go(0)
      })
    },
    setCurrentScope (scopeCode) {
      if (scopeCode) {
        this.scopeList.forEach(scope => {
          if (scope['SCOPE_CODE'] == scopeCode) {
            this.currentScope = scope
          }
        })
      } else {
        this.currentScope = this.scopeList.length > 0 ? this.scopeList[0] : ''
      }
    }
  }
}
</script>
<style type="text/css" lang="scss">
  .iv-topinfo-wrapper{
    .iv-user {
      span {
        box-shadow:0px 0px 0px 0px rgba(255,255,255,0.15),0px 0px 0px 1px rgba(255,255,255,0.25);
        &.iv-user-photo {
          width: 24px;
          height: 24px;
          border-radius: 24px;
          line-height: 24px;
          margin-top: 20px;
          img {
            border-radius: 50%;
            width: 24px;
            height: 24px;
          }
        }
      }
    }
    .iv-power-off {
      cursor: pointer;
      color: #1890FF;
    }
    .iv-full-screen {
      cursor: pointer;
    }
    .ivu-dropdown {
      cursor: pointer;
    }
  }

</style>
