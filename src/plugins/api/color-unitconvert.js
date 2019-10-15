import DutyChainPattern from './chain-pattern'
const radixToRgb = function (color = '', res = '') {
  if (color.indexOf('#') === -1) return 'next'
  color = color.slice(1)
  color = color.length <= 3 ? color.repeat(2) : color
  res = color.replace(/(\w{2})/g, (match, $1) => { return `${parseInt($1, 16)},` })
  return `rgba(${res}1)`
}
const rgbToRadix = function (color = '', res = '') {
  if (color.indexOf('rgb') === -1) return 'next'
  color = color.match(/\(([^\)]*)\)/)[1]
  color = (color && color.split(',')) || []
  for (let key of color) {
    if (res.length >= 6) return `#${res}`
    let radix = parseInt(key).toString(16)
    radix = radix.length === 1 ? `0${radix}` : radix
    res += radix
  }
  return `#${res}`
}
/* eslint-disable no-new */
const redixDuty = new DutyChainPattern(radixToRgb)
const rgbDuty = new DutyChainPattern(rgbToRadix)

redixDuty.setNext(rgbDuty)

export {redixDuty}
