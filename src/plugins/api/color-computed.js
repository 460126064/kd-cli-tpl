import tinycolor from 'tinycolor2'
//换肤颜色算法
export default (function createColorComputed (lightColorCount = 5) {
  //获取色相
  const getHue = function (hsv, i, isLight) {
    let hueStep = 2
    let hue
    if (hsv.h >= 60 && hsv.h <= 240) {
      // 冷色调
      // 减淡变亮 色相顺时针旋转 更暖
      // 加深变暗 色相逆时针旋转 更冷
      hue = isLight ? hsv.h - hueStep * i : hsv.h + hueStep * i
    } else {
      // 暖色调
      // 减淡变亮 色相逆时针旋转 更暖
      // 加深变暗 色相顺时针旋转 更冷
      hue = isLight ? hsv.h + hueStep * i : hsv.h - hueStep * i
    }
    return hue
  }
  const getSaturation = function (hsv, i, isLight) {
    // getSaturation 获取饱和度渐变
    let saturationStep = 16
    let saturationStep2 = 5
    let darkColorCount = 4
    let saturation
    if (isLight) {
      // 减淡变亮 饱和度迅速降低
      saturation = Math.round(hsv.s * 100) - saturationStep * i
    } else if (i == darkColorCount) {
      // 加深变暗-最暗 饱和度提高
      saturation = Math.round(hsv.s * 100) + saturationStep
    } else {
      // 加深变暗 饱和度缓慢提高
      saturation = Math.round(hsv.s * 100) + saturationStep2 * i
    }
    return saturation
  }
  const getValue = function (hsv, i, isLight) {
    // getValue 获取明度渐变
    let brightnessStep1 = 5
    let brightnessStep2 = 15
    if (isLight) {
      // 减淡变亮
      return Math.round(hsv.v * 100) + brightnessStep1 * i
    }
    // 加深变暗幅度更大
    return Math.round(hsv.v * 100) - brightnessStep2 * i
  }
  return function (color, index = 6) {
    //边界值处理
    if (!color) {
      this.console('warn', 'colorComputed params must be require')
      return
    }
    let isLight = index <= 6
    let hsv = tinycolor(color).toHsv()
    let i = isLight ? lightColorCount + 1 - index : index - lightColorCount - 1
    // i 为index与6的相对距离
    return tinycolor({
      h: getHue(hsv, i, isLight),
      s: getSaturation(hsv, i, isLight),
      v: getValue(hsv, i, isLight)
    }).toHexString()
  }
})()
