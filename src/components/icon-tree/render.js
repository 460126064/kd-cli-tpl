import IconFont from '@/components/iconfont'
import { Checkbox, Radio } from 'iview'
export default function () {
  return (h, { root, node, data }) => {
    return this.data.length ? (
      <span
        class={[this.currentSelect === data || data.selected ? 'iv-tree-selected' : '', 'iv-pointer', 'iv-icon-wrapper', this.className(data)]}
        data-data={JSON.stringify(data)}
        onClick={e => this.onSelectChange(root, node, data)}>
        {
          !this.showSingleCheck && ((typeof this.showCheckBox) === 'function' ? this.showCheckBox(root, node, data) : this.showCheckBox) ? (<Checkbox
            style="margin-right: 4px;"
            value={data.checked}
            indeterminate={data.indeterminate}
            {...{ on: { 'on-change': e => this.onChange(e, root, node, data) } }}></Checkbox>) : ''
        }
        {
          ((typeof this.showSingleCheck) === 'function' ? this.showSingleCheck(root, node, data) : this.showSingleCheck) ? (<Radio
            style="margin-right: 4px;"
            value={data.selected}
            indeterminate={data.indeterminate}
            {...{ on: { 'on-change': e => this.onChange(e, root, node, data) } }}></Radio>) : ''
        }
        {this.showIcon ? (<IconFont
          class="iv-icon"
          type={this.iconMap[data.data.type]}></IconFont>) : ''}
        <span>{this.getTitle(data[this.treeMap.title], data)} </span>
        {
          this.showExtend ? (<IconFont
            onClick={e => this.onIconExtend(e, data)}
            class="iv-pointer iv-hover-color iv-icon-extend"
            type="gift"></IconFont>) : ''
        }

        {
          this.$slots.extend ? this.$slots.extend : ''
        }
      </span>
    ) : '暂无数据'
  }
}
