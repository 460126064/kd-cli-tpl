//初始化锚点
import {jsPlumbUtil} from 'jsplumb'
export default function () {
  let cleanObject = Object.create(null)
  return Object.assign(cleanObject, {
    //当前锚点uuid
    anchor: {
      Top: jsPlumbUtil.uuid(),
      Bottom: jsPlumbUtil.uuid(),
      Left: jsPlumbUtil.uuid(),
      Right: jsPlumbUtil.uuid(),
      TopRight: jsPlumbUtil.uuid(),
      TopLeft: jsPlumbUtil.uuid(),
      BottomRight: jsPlumbUtil.uuid(),
      BottomLeft: jsPlumbUtil.uuid()
    }
  })
}
