<template>
  <div
    :class="{'iv-reset': reset}"
    class="iv-import-wrapper">
    <div class="iv-importDown-bottom">
      <div class="iv-importDown-list uit-show-list">
        <FileUpload
          v-show="!uploadFiles.length"
          class="iv-ins-upload iv-pointer"
          v-model="uploadFiles"
          :accept="accept"
          :post-action="url"
          :data="uploadData"
          :headers="headers"
          v-bind="$attrs"
          @input-file="inputFile"
          ref="fileUpload">
          <div class="iv-pull-left iv-ins-upload-firstP">
            <IconFont
              class="iv-iconfont iv-main-color"
              type="cloud-upload1"></IconFont>
          </div>
          <div class="iv-pull-left iv-p-t-16 iv-ins-upload-info iv-pointer iv-fc-65">
            <p class="iv-fs-14 iv-text-left">
              点击这里
              <span class="iv-main-color">上传</span></p>
            <p
              v-if="typeof formatText === 'string'"
              class="iv-m-t-4 iv-fs-14" v-html="formatText"></p>
            <p
              v-else-if="Array.isArray(formatText)"
              class="iv-m-t-4 iv-fs-14">
              {{formatText[0]}}
              <span class='iv-main-color'>{{formatText[1]}}</span>
            </p>
          </div>
        </FileUpload>
      </div>
        <div
          style="overflow: hidden;"
          class="iv-importDown-list iv-pointer"
          v-for="(item, index) in uploadFiles"
          :key="index">
          <div class="iv-importDown-listImg iv-pull-left iv-m-t-16 iv-m-b-16">
            <img
              width="48"
              height="48"
              :src="imgSrc()" alt="" class="uit-img-list" />
          </div>
          <div class="iv-importDown-listContent iv-m-r-16">
            <p class="iv-fs-14 uit-name-list"
              :class="showWrongClass ? 'iv-red-color' : 'iv-fc-65 up-hover-info'">
              {{item.name}}
              <Icon
                v-if="!readOnly"
                type="close"
                class="iv-fs-12 iv-pull-right re-uploadPoinr iv-m-l-16 uit-clo uit-click-list"
                @click="delUploadList(item)"
                :style="!showProgess ? '' : 'display:inline-block;'"></Icon>
            </p>
            <Progress
              class="uit-progress-list"
              :percent="uploadPercent"
              :hide-info='true'
              :stroke-width="2"
              :status="progessStatus"
              v-if="showProgess"></Progress>
              <p class="iv-fs-14 iv-error-info"
              :style="!showProgess ? 'margin-top:4px;' : ''">
              <span class="uload-info iv-red-color"
                v-if="showWrongClass">
                上传失败，请上传规定的文件格式
              </span>
              <span class="uload-info iv-fc-45 uit-show1-list" v-if="!showProgess">
                {{ item.newTime + '&nbsp;&nbsp;' + (item.person ?  item.person : '') }}
              </span>
              <span class="iv-m-l-24 re-upload iv-fc-45 uit-show2-list" v-if="!showProgess">
                {{`附件大小&nbsp;${pictureSize(item.size)}`}}
              </span>
              <span class="iv-m-l-24 re-upload uit-re iv-main-color uit-click1-list"
                @click="reUpload(item)"
                v-if="showWrongClass">
                重新上传
              </span>
            </p>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
import FileUpload from 'vue-upload-component'
import IconFont from '@/components/iconfont'
import { prefixPath } from '@/config'
import { timeFormat } from '@/utils'
const acceptMap = {
  'image/*': ['jpg', 'png', 'gif', 'jpeg', 'image/jpeg', 'image/gif', 'image/png', 'image/jpg']
}
export default {
  props: {
    url: {
      type: String,
      default: prefixPath + 'zuul/api-file/workbench/file'
    },
    accept: {
      type: String,
      default: 'image/*'
    },
    reset: {
      type: Boolean,
      default: false
    },
    formatText: {
      type: String,
      default: '文件格式支持MP4'
    },
    data: {
      type: Object,
      default () {
        return {}
      }
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    preview: {
      type: Object
    }
  },
  data () {
    return {
      uploadFiles: this.preview.type ? [this.preview] : [],
      headers: {
        'X-XSRF-TOKEN': localStorage.getItem('token')
      },
      fileTypeSrc: '',
      showProgess: this.preview ? '' : true,
      showWrongClass: false,
      uploadPercent: 0,
      progessStatus: 'normal'
    }
  },
  computed: {
    uploadData () {
      return Object.assign({
        override: true,
        path: '/cw'
      }, this.data)
    }
  },
  components: {
    FileUpload,
    IconFont
  },
  watch: {
    preview (newVal) {
      let flag = !!newVal.type
      this.uploadFiles = flag ? [newVal] : []
      this.showProgess = !flag
    }
  },
  methods: {
    getPreviewSrc () {
      if (!this.preview || !this.preview.type) return ''
      let type = this.getImgType(this.preview.type)
      import(`@/static/images/${type}@2x.png`).then((res) => {
        this.$set(this.preview, 'src', res)
      })
      return this.preview.src || ''
    },
    imgSrc () {
      if (this.preview.type) {
        return this.getPreviewSrc()
      }
      return this.fileTypeSrc
    },
    getImgType (item) {
      let a = item.substring(item.lastIndexOf('.') + 1)
      let b = ''
      if (a == 'xlsx') {
        b = 'xls'
      } else if (a == 'jpg' || a == 'png' || a == 'gif' || a == 'jpeg') {
        b = 'img'
      } else if (a == 'docx') {
        b = 'doc'
      } else if (a == 'txt') {
        b = 'txt'
      } else if (a == 'pdf') {
        b = 'pdf'
      } else if (a == 'mp4') {
        b = 'mp4'
      } else if (a == 'mp3') {
        b = 'mp4'
      } else if (a == 'zip') {
        b = 'zip'
      } else {
        b = 'xml'
      }
      return b
    },
    reUpload (item) {
      this.$refs.fileUpload.remove(item)
    },
    delUploadList (item) {
      this.clear = true
      this.$refs.fileUpload.clear()
    },
    isEmptyObject (obj) {
      try {
        for (let i in obj) {
          if (obj.hasOwnProperty(i)) return true
        }
      } catch (err) {
        return false
      }
      return false
    },
    inputFile (newFile, oldFile) {
      this.$emit('on-input-file', newFile || {})
      if (this.clear) {
        //清空
        Object.keys(this.preview).forEach(key => {
          delete this.preview[key]
        })
        this.clear = false
        return
      }
      newFile && (this.uploadPercent = ~~newFile.progress)
      if (newFile && oldFile) {
        if (newFile.success && !oldFile.success) {
          if (newFile.response.code == '2000' || newFile.response.status == 'success') {
            this.$emit('on-upload-success', newFile)
            this.showProgess = false
            this.showWrongClass = false
            this.progessStatus = 'normal'
          } else {
            this.progessStatus = 'wrong'
            this.showWrongClass = true
            this.$emit('on-upload-error')
          }
        }
      }
      if (Boolean(newFile) !== Boolean(oldFile) || newFile.error !== oldFile.error) {
        if (!this.$refs.fileUpload.active) {
          let isImg = (acceptMap[this.accept] && acceptMap[this.accept].indexOf(newFile.type) > -1)
          let name = (newFile && newFile.name) || (oldFile && oldFile.name)
          let suffix = name.slice(name.lastIndexOf('.') + 1)
          let isAccept = this.accept.indexOf(suffix) > -1
          if (isAccept || isImg || this.accept === '*') {
            this.uploads = newFile
            this.$refs.fileUpload.active = true
            this.uploadFiles.forEach(item => {
              item.newTime = timeFormat(new Date(), 'yyyy-MM-dd HH:mm:ss')
              item.imgType = this.getImgType(item.name)
              import(`@/static/images/${item.imgType}@2x.png`).then((res) => {
                this.fileTypeSrc = res || ''
              })
            })
            return
          }
          this.$Spin.hide()
          this.$refs.fileUpload.clear()
          this.$Message.error(`文件类型不匹配`)
        }
      }
    },
    // 换算图片格式的大小
    pictureSize (size) {
      if (isNaN(size)) { // 判断是不是一个数
        return ''
      }
      let uniTsize = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] // 保存文件的格式
      let exp = Math.floor(Math.log(size) / Math.log(2)) // 对数函数
      if (exp < 1) {
        exp = 0
      }
      let i = Math.floor(exp / 10)
      size = size / Math.pow(2, 10 * i)
      if (size.toString().length > size.toFixed(2).toString().length) {
        size = size.toFixed(2)
      }
      return size + ' ' + uniTsize[i]
    }
  }
}
</script>
<style lang="scss" scoped>
@import 'variable/variable.scss';
.iv-import-wrapper {
  padding: 0 $three-double;
  margin-bottom: $three-double;
  &.iv-reset {
    padding: 0;
    margin: 0;
    clear: both;
  }
  .iv-importDown-bottom {
    border: 1px dashed rgba(0, 0, 0, .15);
    height: 80px !important;
    &:hover {
      background: rgba(240,250,255,1);
    }
    .iv-importDown-list {
      .iv-importDown-listImg {
        margin-left: $two-double;
      }
      .iv-importDown-listContent {
        margin-left: $two-double + 48 + $three-double;
        margin-top: $two-double;
      }
    }
    .iv-ins-upload {
      width: 100%;
      line-height: 80px;
    }
    .iv-ins-upload-firstP {
      .iv-iconfont {
        font-size: 48px;
        margin-left: $two-double;
      }
    }
    .iv-ins-upload-info {
      margin-left: $two-double;
    }
  }
}
</style>
