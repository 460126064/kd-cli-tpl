<script>
import FileUpload from 'vue-upload-component'
import IconFont from '@/components/iconfont'
export default {
  props: {
    isMultiple: {
      type: Boolean,
      default: false
    },
    uploadUrl: {
      type: String,
      default: '',
      required: true
    }
  },
  render (c) {
    return c(FileUpload, {
      attrs: {
        class: 'uit-upload-list iv-file-load iv-pointer'
      },
      ref: 'upload',
      props: {
        multiple: this.isMultiple,
        thread: 3,
        maximum: 10,
        'post-action': this.uploadUrl,
        value: this.uploadFiles,
        headers: this.headers
      },
      on: {
        input: (args) => {
          this.$emit('input', args)
        },
        'input-file': this.inputFile
      }
    }, [
      c(IconFont, {
        attrs: {
          type: 'Plus',
          class: 'iv-fs-16 iv-m-r-8'
        }
      }),
      c('span', {
        attrs: {
          class: 'iv-main-color iv-main-hover-color uit-addWare-list'
        }
      }, '上传')
    ])
  }
}
</script>
