<template>
  <div
    :style="wrapperStyle"
    class="iv-upload-imgwrapper">
    <FileUpload
      class="uit-upload-list iv-file-load iv-pointer"
      ref="upload"
      v-bind="$attrs"
      v-model="uploadFiles"
      @input-file="inputFile"
      :headers="headers">
      <div class="iv-img-display">
        <img
          v-if="imgSrc"
          height="100%"
          :src="imgSrc"
          style="position: absolute;left: 0;"
          class="uit-upload-imgshow" />
        <div
          class="iv-img-display-wrapper">
          <div
            :class="maskShow"
            class="iv-upload-mask uit-list-click">
            <Icon
              :style="maskStyle"
              class="iv-fs-20"
              :type="tips.icon"></Icon>
            <p class="iv-fs-14">{{tips.title}}</p>
          </div>
        </div>
      </div>
    </FileUpload>
  </div>
</template>
<script>
import FileUpload from 'vue-upload-component'
import { prefixPath } from '@/config'
const FLAG = 50
export default {
  props: {
    src: {
      type: String,
      default: ''
    },
    ratio: {
      type: Number,
      default: 1 / 1
    },
    tips: {
      type: Object,
      default () {
        return {
          title: '更改封面图片',
          icon: 'ios-camera-outline'
        }
      }
    }
  },
  data () {
    return {
      headers: {
        'X-XSRF-TOKEN': localStorage.getItem('token')
      },
      uploadFiles: [],
      maskStyle: {},
      wrapperStyle: {},
      imgSrc: this.src
    }
  },
  watch: {
    src (newVal) {
      this.imgSrc = newVal
    }
  },
  computed: {
    maskShow () {
      return {
        'iv-upload-mask-show': !this.imgSrc
      }
    }
  },
  components: {
    FileUpload
  },
  mounted () {
    this.$nextTick(() => {
      let height = this.$el.offsetHeight
      this.wrapperStyle = {
        'width': `${height * this.ratio}px`
      }
      this.maskStyle = {
        'margin-top': `${(height - FLAG) / 2}px`
      }
    })
  },
  methods: {
    inputFile (newFile, oldFile) {
      // 自动上传
      if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
        if (!this.$refs.upload.active) this.$refs.upload.active = true
      }
      if (newFile && oldFile) {
        switch (true) {
          case newFile.success !== oldFile.success:
            this.$emit('input-file-success', newFile, oldFile)
            this.imgSrc = `${prefixPath}/api-file/portal/file/stream/${newFile.response.data.fileID}?origin=true`
            break
          case newFile.progress !== oldFile.progress:
            this.$emit('input-file-progress', newFile.progress, newFile)
            break
          case newFile.error !== oldFile.error:
            this.$emit('input-file-error', newFile.error, newFile)
            break
        }
      }
    }
  }
}
</script>
<style lang="scss" scope>
.iv-upload-imgwrapper /deep/ .iv-file-load {
  display: block;
}
.iv-upload-imgwrapper {
  height: 100%;
  border-radius: 4px;
  position: relative;
  span, div {
    height: 100%;
  }
  &:hover {
    .iv-upload-mask {
      transform: translateY(0%);
    }
  }
  .iv-upload-mask {
    background: rgba(0, 0, 0, .45);
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    border-radius: 4px;
    color: #fff;
    transform: translateY(100%);
    transition: transform .3s linear 0s;
    &.iv-upload-mask-show {
      transform: translateY(0%);
    }
  }
}
</style>
