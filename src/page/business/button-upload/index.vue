<template>
  <FileUpload
    :class="!ghost && 'iv-custom-btn'"
    class="iv-ins-upload iv-pointer"
    v-model="uploadFiles"
    :accept="accept"
    :post-action="url"
    :data="uploadData"
    :headers="headers"
    v-bind="$attrs"
    @input-file="inputFile"
    ref="fileUpload">
    <span
      type="ghost"
      :class="ghost ? 'ivu-btn ivu-btn-ghost iv-fc-65' : 'iv-white'"
      class="iv-pointer">
      <IconFont
        class="iv-iconfont"
        :type="icon"></IconFont>
      {{label}}
    </span>
  </FileUpload>
</template>
<script>
import FileUpload from 'vue-upload-component'
import IconFont from '@/components/iconfont'
import { prefixPath } from '@/config'
const acceptMap = {
  'image/*': ['jpg', 'png', 'gif', 'jpeg']
}
export default {
  props: {
    url: {
      type: String,
      default: prefixPath + 'zuul/api-file/workbench/file' + '?_csrf=' + localStorage.getItem('token')
    },
    accept: {
      type: String,
      default: 'image/*'
    },
    formatText: {
      type: String,
      default: '文件格式支持MP4'
    },
    icon: {
      type: String,
      default: 'cloud-upload'
    },
    label: {
      type: String,
      default: '上传'
    },
    ghost: {
      type: Boolean,
      default: true
    },
    data: {
      type: Object,
      default () {
        return {
          override: true,
          path: '/cw'
        }
      }
    }
  },
  data () {
    return {
      uploadFiles: [],
      headers: {
        'X-XSRF-TOKEN': localStorage.getItem('token')
      },
      uploadData: this.data
    }
  },
  components: {
    FileUpload,
    IconFont
  },
  methods: {
    clear (item) {
      this.$refs.fileUpload.clear()
    },
    inputFile (newFile, oldFile) {
      this.$emit('on-input-file', newFile)
      newFile && (this.uploadPercent = ~~newFile.progress)
      if (newFile && oldFile) {
        if (newFile.success && !oldFile.success) {
          if (newFile.response.code == '2000' || newFile.response.status == 'success') {
            this.$emit('on-upload-success', newFile)
          } else {
            this.$emit('on-upload-error', newFile)
          }
          this.clear()
        }
      }
      if (Boolean(newFile) !== Boolean(oldFile) || newFile.error !== oldFile.error) {
        if (!this.$refs.fileUpload.active) {
          let isImg = (acceptMap[this.accept] && acceptMap[this.accept].indexOf(newFile.type) > -1)
          let name = (newFile && newFile.name) || (oldFile && oldFile.name)
          let suffix = name.slice(name.lastIndexOf('.') + 1)
          let isAccept = this.accept.indexOf(suffix) > -1 || this.accept === '*'
          if (isAccept || isImg) {
            this.$refs.fileUpload.active = true
            return
          }
          this.$Message.error(`文件类型不匹配`)
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import 'variable/variable.scss';
.iv-iconfont {
  font-size: 14px;
}
.iv-white {
  color: #fff;
}
</style>
