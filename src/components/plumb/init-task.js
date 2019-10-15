import Anchor from './anchor'
export default function () {
  const defaultStart = [{
    id: 'Start',
    name: '开始',
    type: 'Start',
    top: 0,
    icon: 'rocket-fill',
    left: 300,
    uuid: jsPlumbUtil.uuid(),
    ...Anchor()
  }]
  const defaultEnd = [{
    id: 'End',
    name: '结束',
    type: 'End',
    icon: 'flag-fill',
    top: 250,
    left: 300,
    uuid: jsPlumbUtil.uuid(),
    ...Anchor()
  }]
  return {
    defaultStart,
    defaultEnd
  }
}
