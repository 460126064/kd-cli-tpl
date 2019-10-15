export default function () {
  return {
    isSource: true,
    isTarget: true,
    //锚点属性
    endpoint: ['Dot', {
      radius: 5,
      fill: '#1890FF'
    }],
    //连接线样式
    connectorStyle: {
      outlineStroke: '#595959',
      strokeWidth: 0.5
    },
    connector: ['Flowchart'],
    //连接线hover样式
    connectorHoverStyle: {
      outlineStroke: '#1890FF'
    },
    //锚点样式
    paintStyle: {
      radius: 3,
      fill: '#595959'
    },
    //锚点hover样式
    hoverPaintStyle: {
      fill: '#1890FF'
    },
    maxConnections: -1,
    connectorOverlays: [['Arrow', {
      width: 15,
      length: 15,
      location: 1,
      paintStyle: {
        fill: '#595959'
      },
      hoverPaintStyle: {
        fill: '#1890FF'
      },
      events: {}
    }], ['Label', {
      label: '',
      labelStyle: {
        borderWidth: 0,
        fill: '#fff',
        borderStyle: '#fff'
      }
    }]]
  }
}
