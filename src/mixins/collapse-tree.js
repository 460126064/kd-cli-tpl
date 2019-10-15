import { mapGetters, mapMutations } from 'vuex'
export default {
  data () {
    return {
      treeCollapse: false
    }
  },
  computed: {
    ...mapGetters([
      'isCollapsed',
      'sliderWidth'
    ])
  },
  methods: {
    ...mapMutations([
      'TREEWIDTH'
    ]),
    changeTreeWidth () {
      let width = this.sliderWidth + (this.sliderWidth - 80)
      this.TREEWIDTH(this.treeCollapse ? this.sliderWidth : width)
      this.treeCollapse = !this.treeCollapse
    }
  }
}
