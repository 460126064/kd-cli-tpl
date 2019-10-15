<template>
  <LayoutFull :list="list">
    <template #list>
      <Form slot="one">
        <Row>
          <Col span="12">
            <FormItem label="姓名">
              <Input />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="年龄">
              <Input />
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Table :columns="columns" slot="two"></Table>
    </template>
  </LayoutFull>
</template>
<script>
import LayoutFull from '@/components/layout/layout-full'
export default {
  props: {},
  data () {
    return {
      list: [{
        title: '第一组表单',
        slotName: 'one',
        secondTitle: '第一组第二title',
        formLayout: true
      }, {
        title: '第二组表单',
        slotName: 'two'
      }],
      columns: [{
        title: '姓名'
      }, {
        title: '入党时间'
      }]
    }
  },
  components: {
    LayoutFull
  },
  created () {},
  methods: {}
}
</script>
<style lang="scss" scoped>
</style>
