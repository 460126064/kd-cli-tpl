<template>
  <div class="iv-card" :class="status" :style="style">
    <span class="iv-inline-block">
      <div v-for="(item, i) in data" :key="i">{{ item }}</div>
    </span>
    <Icon
      v-if="showCloseBtn"
      type="close-circled"
      class="iv-close"
      @click="onClose"></Icon>
  </div>
</template>

<script>
export default {
  name: 'status-card',
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    },
    status: {
      type: String,
      default: 'default'
    },
    color: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '96px'
    },
    height: {
      type: String,
      default: '96px'
    },
    showCloseBtn: {
      type: Boolean,
      default: false
    }
  },
  created () {
    this.style = {
      backgroundColor: this.color,
      width: this.width || '96px',
      height: this.height || '96px',
      lineHeight: this.height || '96px'
    }
  },
  methods: {
    onClose () {
      this.$emit('on-close', this.data)
    }
  }
}
</script>

<style lang="scss" scoped>
.iv-card {
  position: relative;
  display:inline-block;
  vertical-align: middle;
  font-family:PingFang-SC-Medium;
  border-radius: 4px;
  font-size:14px;
  font-weight:500;
  text-align: center;
  &:hover {
    .iv-close {
      display: block;
    }
  }
  .iv-close {
    display: none;
    position: absolute;
    font-size: 13px;
    top: 5px;
    right: 5px;
    color: rgba(0, 0, 0, .5);
    cursor: pointer;
    &:hover {
      color: rgba(0, 0, 0, .8);
    }
  }
}
.iv-inline-block {
  display: inline-block;
  line-height:22px;
  vertical-align:middle;
}
.success {
  background: #D9F7BE;
}
.warning {
  background: #FFF1B8;
}
.default {
  background: rgba(0, 0, 0, .15);
}
.error {
  background: #FFCCC7;
}
</style>
