<template>
  <span>
    <Checkbox
      v-if="status === 'check'"
      @on-change="onCheck"
      :value="true"></Checkbox>
    <Icon
      v-show="status === 'disabled'"
      class="iv-pointer"
      size="16"
      color="#f40"
      @click="onDis"
      onselectstart="return false;"
      type="close-circled"></Icon>
     <Checkbox
       v-if="status == 'empty'"
       @on-change="onEmpty"
       :value="false"></Checkbox>
  </span>
</template>

<script>
export default {
  name: 'checkbox',
  props: {
    value: {
      default: 'empty'
    }
  },
  data () {
    return {
      val: false,
      status: this.value,
      mapState: ['empty', 'check', 'disabled']
    }
  },
  watch: {
    status (newVal) {
      this.$emit('input', newVal)
    }
  },
  methods: {
    onEmpty () {
      this.status = 'check'
    },
    onCheck () {
      this.status = 'disabled'
    },
    onDis () {
      this.status = 'empty'
    }
  },
  components: {}
}
</script>
