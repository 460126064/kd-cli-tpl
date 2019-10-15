<template>
  <Panel padding=12>
    <div class="iv-m-t-24" v-if="showDefault">
      <h1 class="iv-fs-16 iv-fc-85 uit-title-crop">{{pitch.title}}</h1>
      <Row class="iv-m-t-24 iv-default-wrapper">
        <Col span="6" v-for="(item, index) in pitch.list" :key="index" class="uit-for-crop">
          <div class="iv-p-r-16 iv-p-l-16 iv-default-img">
            <div class="iv-pos-r iv-pointer">
              <div
               @click="changeSelect(index)"
               :class="select[index] ? 'iv-mask-select' : ''"
               class="iv-mask uit-select-crop">
                <span class="iv-select iv-m-t-16 iv-m-l-16 uit-show-crop" v-if="select[index]">✔</span>
                <span class="iv-unselect iv-m-t-16 iv-m-l-16 uit-hide-crop" v-else></span>
               </div>
              <img :src="item" class="uit-imgShow-crop"/>
            </div>
          </div>
        </Col>
      </Row>
    </div>
    <div class="iv-m-t-24 iv-m-b-24">
      <h1 class="iv-fs-16 iv-fc-85 uit-title1-crop">{{crop.title}}</h1>
      <Row class="iv-m-t-24">
        <Col span="12">
          <div class="iv-m-r-12 iv-cropper-wrapper iv-border-dash">
            <div class="iv-full-page">
              <img id="cropimg" class="iv-crop-image iv-hidden uit-img2-crop" src="" alt="">
            </div>
            <div class="iv-full-page uit-show3-crop" v-show="!haveImg">
              <input @change="handleChange" type="file" accept="image/png, image/jpeg, image/jpg" id="fileinput1" class="iv-hidden uit-change-crop"/>
              <!-- 描述 -->
              <label for="fileinput1" class="iv-full-page iv-cursor">
                <div style="height: 80px" class="iv-cropper-text">
                  <div class="iv-fs-30 iv-main-color"><Icon type="android-upload"></Icon></div>
                  <p class="iv-m-t-8 iv-fs-14">点击这里<span class="iv-main-color">上传</span></p>
                  <p class="iv-m-t-4 iv-fs-14">文件格式支持PNG、JPG大小不能超过<span class="iv-main-color">2M</span></p>
                </div>
              </label>
            </div>
          </div>
          <div class="iv-resourcesName iv-m-t-16" v-if="whetherShow">
            <p>
              <span class="iv-pull-left uit-name-list iv-fs-14">{{resourcesName}}</span>
              <Icon type="close"
                class="iv-pull-right iv-m-r-12 iv-fs-14 iv-resourcesHover uit-cancel-crop"
                @click="cancelUpload"
                title="清除选择图片"></Icon>
            </p>
          </div>
        </Col>
        <Col span="12">
          <div class="iv-m-l-12 iv-cropper-wrapper">
            <div class="iv-full-page iv-preview-con">
              <div id="preview" class="iv-preview-image uit-look-crop"></div>
            </div>
            <div class="iv-full-page uit-hide-crop" v-show="!haveImg">
              <div class="iv-cropper-text iv-fc-25 iv-fs-14">左侧上传图片后可预览</div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  </Panel>
</template>
<script>
import Panel from '@/components/panel'
import Cropper from 'cropperjs'
import './cropper.min.css'
import { imagePath } from '@/utils'

export default {
  props: {
    /**
     * 1:只显示图片选择区域
     * 2:只显示图片裁剪区域
     * 3:显示图片选择及图片裁剪
     */
    layout: {
      type: Number,
      default: 3
    },
    /**
     * 图片选择区域{title: '',list:[]}
     */
    pitch: {
      type: Object,
      default () {
        return {
          title: '默认头像',
          list: (() => {
            let req = require.context('@/static/images/course')
            return req.keys().map(req)
          })()
        }
      }
    },
    /**
     * 裁剪区域{title:'',aspectRatio:5/3}
     */
    crop: {
      type: Object,
      default () {
        return {
          title: '自定义头像',
          aspectRatio: 1
        }
      }
    },
    courseId: {
      type: String,
      default: ''
    },
    imgUrl: {
      type: String,
      default: ''
    },
    imgName: {
      type: String,
      default: ''
    },
    cropBoxResizable: {
      type: Boolean,
      default: true
    },
    showDefault: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      select: {},
      cropper: {},
      haveImg: false, //如果初始有图片，将这里设为true
      resourcesName: '', //上传的图片名称
      whetherShow: false
    }
  },
  created () {
    this.imagePath = imagePath
  },
  mounted () {
    this.initRadioHeight()
    this.initCropper()
    if (!this.imgUrl) {
      if (this.showDefault) {
        this.changeSelect(0) //刚开始默认选中第一张图片
      }
    } else {
      this.cropper.replace(this.imagePath('course', this.imgUrl))
      this.haveImg = true
      this.resourcesName = this.imgName || 'thumb.png'
      this.whetherShow = true
    }
  },
  beforeDestroy () {
    this.cropper = null
  },
  methods: {
    initCropper (url) {
      let img = document.querySelector('#cropimg')
      this.cropper = new Cropper(img, {
        dragMode: 'move',
        preview: '#preview',
        aspectRatio: this.crop.aspectRatio,
        rotatable: false,
        cropBoxResizable: this.cropBoxResizable
      })
    },
    initRadioHeight () {
      Array.from(document.querySelectorAll('.iv-cropper-wrapper'))
        .forEach(item => {
          let w = parseInt(getComputedStyle(item).width)
          item.style.height = `${this.crop.aspectRatio <= 1 ? w * this.crop.aspectRatio : w / this.crop.aspectRatio}px`
        })
    },
    changeSelect (index) {
      //如果点击的是同一个，那么就是取消选择
      let isCancel = this.select[index]
      this.select = {}
      !isCancel && this.$set(this.select, index, true) && this.cropper.replace(this.pitch.list[index])
      this.haveImg = isCancel ? null : true
      if (this.pitch.list[index]) {
        let a = this.pitch.list[index].split('/')
        for (let i = 0; i < a.length; i++) {
          if (a[i] == '') {
            a.splice(i, 1)
          }
        }
        this.resourcesName = a[2]
      }
      !isCancel ? this.whetherShow = true : this.whetherShow = false
      //清空选择区域
      isCancel && this.cropper.destroy() && this.initCropper()
    },
    /**
     * 选择文件后
     */
    handleChange (e) {
      let file = e.target.files[0]
      let reader = new FileReader()
      reader.onload = () => {
        this.cropper.replace(reader.result)
        reader.onload = null
      }
      if (file.name) {
        this.resourcesName = file.name
        this.whetherShow = true
      }
      reader.readAsDataURL(file)
      this.haveImg = true
    },
    onFileUpload () {
      return new Promise((resolve, reject) => {
        if (this.isIE()) {
          let can = this.cropper.getCroppedCanvas()
          let pic_data = can.toDataURL()
          let id_blob = this.processData(pic_data)
          this.requestFn(id_blob, resolve)
        } else {
          this.cropper.getCroppedCanvas().toBlob(blob => {
            this.requestFn(blob, resolve)
          }, 'image/jpeg')
        }
      })
    },
    //抽离的上传图片ajax
    requestFn (blob, resolve) {
      let formData = new FormData()
      formData.append('serviceCode', 'cover-image')
      formData.append('_t', Math.random())
      formData.append('file', blob, this.resourcesName)
      let imageSize = 1048576 * 2
      // if (blob.size > imageSize) return Promise.reject(new Error('所选文件超过2M，请重新上传'))
      if (blob.size > imageSize) return this.$Message.error('所选文件超过2M，请重新上传')
      this.$ajax({
        method: 'POST',
        url: 'zuul/api-file/workbench/file' + '?_csrf=' + localStorage.getItem('token'),
        data: formData
      }).then(res => {
        resolve({
          success: res.data.code == 2000,
          message: res.data.message,
          data: res.data.data,
          url: res.data.code == 2000 ? 'api-file/workbench/file/stream/' + res.data.data.fileID + '?origin=true' : ''
        })
      })
    },
    //ie下解决图片
    processData (dataUrl) {
      let binaryString = window.atob(dataUrl.split(',')[1])
      let arrayBuffer = new ArrayBuffer(binaryString.length)
      let intArray = new Uint8Array(arrayBuffer)
      for (let i = 0, j = binaryString.length; i < j; i++) {
        intArray[i] = binaryString.charCodeAt(i)
      }
      let data = [intArray], blob
      try {
        blob = new Blob(data)
      } catch (e) {
        window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder
        if (e.name === 'TypeError' && window.BlobBuilder) {
          let builder = new BlobBuilder()
          builder.append(arrayBuffer)
          blob = builder.getBlob(imgType) // imgType为上传文件类型，即 file.type
        } else {
          console.log('版本过低，不支持上传图片')
        }
      }
      return blob
    },
    //判读是否是ie浏览器
    isIE () {
      if (!!window.ActiveXObject || "ActiveXObject" in window) {
        return true
      } else {
        return false
      }
    },
    //取消上传
    cancelUpload () {
      this.select = {}
      this.haveImg = false
      this.whetherShow = false
      this.cropper.destroy()
      this.initCropper()
    }
  },
  components: {
    Panel
  }
}
</script>
<style lang="scss" scoped>
$uploadHeight: 319px;
.iv-default-wrapper {
  margin: 24px -16px 0 -16px;
 .iv-default-img {
   position: relative;
   overflow: hidden;
  img {
    width: 100%;
  }
  .iv-pos-r {
    &:hover {
      .iv-mask {
        transform: translateY(0);
      }
    }
  }
  .iv-mask {
    background: rgba(0, 0, 0, .6);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: all .3s ease 0s;
    border-radius: 4px;
    transform: translateY(100%);
    &.iv-mask-select {
     transform: translateY(0);
    }
    span {
      width: 20px;
      height: 20px;
      padding: 0;
      border-radius: 50%;
      display: inline-block;
      &.iv-unselect {
        border: 1px solid #fff;
      }
      &.iv-select {
        background: #52C41A;
        line-height: 20px;
        text-align: center;
      }
    }
  }
 }
}
.iv-cropper-wrapper {
  position: relative;
  height: $uploadHeight;
  background-color: #f5f5f5;
  overflow: hidden;
  .iv-cropper-text {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    height: 20px;
    text-align: center;
  }
  .iv-full-page {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .iv-preview-con {
    line-height: $uploadHeight;
  }
  .iv-preview-image {
    // display: inline-block;
    width: 100%;
    height: 100%;
    // vertical-align: middle;
    overflow: hidden;
  }
  .iv-crop-image {
    max-width: 100%;
    max-height: 100%;
  }
}
.iv-border-dash {
  border: 1px dashed #d0d0d0;
}
.iv-hidden {
  display: none;
}
.iv-cursor {
  cursor: pointer;
}
.iv-resourcesHover {
  cursor: pointer;
}
.iv-resourcesHover:hover {
  color: #1890FF;
}
</style>
