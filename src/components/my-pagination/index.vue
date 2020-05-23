<template>
  <el-pagination
    :layout="currentLayout"
    :page-sizes="sizes"
    :current-page="page"
    :page-size="size"
    :total="total"
    :page-count="pageCount"
    :background="background"
    :small="small"
    style="text-align:right;"
    @size-change="onSizeChange"
    @current-change="onCurrentChange"
  >
    <slot>
      <span v-if="checkedCount>0" class="ad-pagination__selection">，已选 {{ checkedCount }} 条</span>
    </slot>
  </el-pagination>
</template>

<script>
/**
 * pagination 分页组件
 * 使用说明
    <my-pagination
    ref="pager"
    :page.sync="pager.currentPage"
    :size.sync="pager.pageSize"
    :total="pager.total"
    :checked-count="sels.length"
    @get-page="getData"
    />
    this.pager = this.$refs.pager.getPager()
    this.pager.total = res.data.total
*/
import { addResizeListener, removeResizeListener } from 'element-ui/lib/utils/resize-event'

const layouts = {
  full: 'total, slot, sizes, prev, jumper, next',
  fullPager: 'total, slot, sizes, prev, pager, next',
  simple: 'prev, jumper, next'
}
export default {
  name: 'MyPagination',
  props: {
    layout: {
      type: String,
      default: layouts.full
    },
    sizes: {
      type: Array,
      default() {
        return [10, 20, 50, 100]
      }
    },
    size: {
      type: Number,
      default: 10
    },
    total: {
      type: Number,
      default: 0
    },
    page: {
      type: Number,
      default: 1
    },
    checkedCount: {
      type: Number,
      default: 0
    },
    background: {
      type: Boolean,
      default: true
    },
    small: {
      type: Boolean,
      default: false
    },
    autoLayout: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      currentLayout: layouts[this.layout] || this.layout
    }
  },
  computed: {
    pageCount() {
      return this.total > 0 && this.size > 0
        ? Math.ceil(this.total / this.size)
        : 1
    }
  },
  watch: {
    layout(val) {
      this.currentLayout = layouts[val] || this.layout
    }
  },
  mounted() {
    if (this.autoLayout) {
      this.proxyChangeLayout = this.changeLayout.bind(this)
      addResizeListener(this.$el, this.proxyChangeLayout)
    }
  },
  beforeDestroy() {
    this.proxyChangeLayout && removeResizeListener(this.$el, this.proxyChangeLayout)
  },
  methods: {
    onSizeChange(val) {
      this.$emit('update:size', val)
      this.$emit('size-change', val)
      this.$emit('get-page')
    },
    onCurrentChange(val) {
      this.$emit('update:page', val)
      this.$emit('current-change', val)
      this.$emit('get-page')
    },
    changeLayout() {
      const rect = this.$el.getBoundingClientRect()
      if (rect.width >= 800) {
        this.currentLayout = layouts[this.layout] || this.layout
      } else {
        this.currentLayout = layouts.simple
      }
    },
    getPager() {
      return {
        total: this.total,
        pageSize: this.size,
        currentPage: this.page
      }
    }
  }
}
</script>
