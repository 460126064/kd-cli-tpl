import {imagePath} from '@/utils'
/*
*@des 获取图片资源
*@param {String} key vm实例上的key
*@param {String} type 图片类型
*@param {String} id 图片ID
*@example getImageSrc('courseSrc', 'course', '123)
*/
export default {
  methods: {
    getImgSrc (key, type, id) {
      let imgSrc = imagePath(type, id)
      if (typeof imgSrc === 'string') return (this[key] = imgSrc)
      imgSrc.then((res) => {
        let src = typeof res === 'string' ? res : res.default
        this[key] = src
      })
    }
  }
}
