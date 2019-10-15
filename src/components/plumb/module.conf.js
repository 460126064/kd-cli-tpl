export default function () {
  return [{
    id: 'iv-task-choosing',
    type: 'choosing',
    icon: 'detail-fill',
    name: '共享任务',
    tasktype: 2
  }, {
    id: 'iv-task-process',
    type: 'process',
    icon: 'api-fill',
    name: '串行任务',
    tasktype: 3
  }, {
    id: 'iv-task-parallel',
    type: 'parallel',
    icon: 'sliders-fill',
    name: '并行任务',
    tasktype: 4
  }, {
    id: 'iv-task-syncnode',
    type: 'syncnode',
    icon: 'build-fill',
    name: '同步节点',
    tasktype: 5
  }]
}
