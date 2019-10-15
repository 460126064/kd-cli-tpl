<template>
  <FormItem class="iv-imgupload-wrapper">
    <FileUpload
      class="iv-img-upload iv-pointer iv-text-center"
      v-model="uploadFiles"
      :accept="accept"
      :post-action="url"
      :data="uploadData"
      :headers="headers"
      v-bind="$attrs"
      @input-file="inputFile"
      ref="fileUpload">
      <div class="iv-mask iv-text-center iv-fs-24">
        <Icon
          class="iv-white iv-fs-24"
          type="android-camera"></Icon>
        <p class="iv-white iv-fs-16 iv-hover-color">点击上传</p>
      </div>
      <img :src="previewSrc" alt="">
    </FileUpload>
  </FormItem>
</template>
<script>
import FileUpload from 'vue-upload-component'
import IconFont from '@/components/iconfont'
import { prefixPath } from '@/config'
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
    data: {
      type: Object,
      default () {
        return {
          override: true,
          path: '/cw'
        }
      }
    },
    src: {
      type: String,
      default: 'https://cn.vuejs.org/images/logo.png'
    }
  },
  data () {
    return {
      uploadFiles: [],
      headers: {
        'X-XSRF-TOKEN': localStorage.getItem('token')
      },
      uploadData: this.data,
      previewSrc: this.src
    }
  },
  watch: {
    src (val) {
      this.previewSrc = val
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
          let isImg = /(png|jpe?g|gif)\s*$/.test(newFile.type)
          let name = (newFile && newFile.name) || (oldFile && oldFile.name)
          let suffix = name.slice(name.lastIndexOf('.') + 1)
          let isAccept = this.accept.indexOf(suffix) > -1 || this.accept === '*'
          if (isAccept || isImg) {
            this.$refs.fileUpload.active = true
            return
          }
          //兼容IE10+
          try {
            this.previewSrc = URL.createObjectURL(newFile.file)
          } catch (e) {
            this.previewSrc = ''
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
  font-size: 24px;
}
.iv-white {
  color: #fff;
}
.iv-imgupload-wrapper {
  height: 142.75px;
  .iv-img-upload {
    height: 142.75px;
    line-height: 142.75px;
    background: #ccc;
    border-radius: 4px;
    width: 100%;
    &:hover {
      .iv-mask {
        transform: translateY(0);
      }
    }
    .iv-mask {
      background: rgba(0, 0, 0, .3);
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      transform: translateY(100%);
      transition: transform .3s linear 0s;
      display: table;
      i {
        display: table-cell;
        vertical-align: middle;
      }
      p {
        display: table-row;
      }
    }
    img {
      height: 100%;
    }
  }
}
</style>
