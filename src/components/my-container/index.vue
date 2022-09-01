<template>
  <el-container class="my-container" style="height: 100%;">
    <el-aside
      v-if="showLeftAside"
      v-resizable="currentLeftAsideResizeOptions"
      :width="leftAsideWidth"
      :style="leftAsideStyle"
    >
      <slot name="left-aside" />
    </el-aside>
    <el-main style="height:100%;">
      <section style="height:100%;">
        <el-container style="height:100%;position:relative;">
          <el-header v-if="showHeader" height="auto" :style="headerStyle">
            <slot name="header" />
          </el-header>
          <el-main :style="mainStyle">
            <slot />
          </el-main>
          <el-footer v-if="showFooter" height :style="footerStyle">
            <slot name="footer" />
          </el-footer>
        </el-container>
      </section>
    </el-main>
    <el-aside
      v-if="showRightAside"
      v-resizable="currentRightAsideResizeOptions"
      :width="rightAsideWidth"
      :style="rightAsideStyle"
    >
      <slot name="right-aside" />
    </el-aside>
  </el-container>
</template>

<script>
/**
 * 容器组件
 * 使用说明
<my-container>
  <template #header>
    <el-form />
  </template>
  <el-table />
  <template #footer>
    <my-pagination />
  </template>
</my-container>
 */
import resizable from '@/directive/resizable'
export default {
  name: 'MyContainer',
  directives: { resizable },
  props: {
    showHeader: {
      type: Boolean,
      default: true
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    showLeftAside: {
      type: Boolean,
      default: false
    },
    showRightAside: {
      type: Boolean,
      default: false
    },
    // 可更改尺寸
    resizable: {
      type: Boolean,
      default: false
    },
    leftAsideWidth: {
      type: String,
      default: '25%'
    },
    rightAsideWidth: {
      type: String,
      default: '25%'
    },
    leftAsideResizeOptions: {
      type: Object,
      default: null
    },
    rightAsideResizeOptions: {
      type: Object,
      default: null
    },
    headerStyle: {
      type: [String, JSON],
      default: 'padding:10px 0px 0px 10px;'
    },
    mainStyle: {
      type: [String, JSON],
      default: 'padding:0px 10px;'
    },
    footerStyle: {
      type: [String, JSON],
      default: 'padding:5px 0px 10px 10px;'
    },
    leftAsideStyle: {
      type: [String, JSON],
      default: 'border-right: 1px solid #e6e6e6;position: relative;overflow:unset;'
    },
    rightAsideStyle: {
      type: [String, JSON],
      default: 'border-left: 1px solid #e6e6e6;position: relative;overflow:unset;'
    }
  },
  computed: {
    currentLeftAsideResizeOptions() {
      return {
        maxWidth: '45%',
        disabled: !this.resizable,
        ...this.leftAsideResizeOptions,
        rangeDom: '.my-container',
        handles: 'e',
        onlySize: true
      }
    },
    currentRightAsideResizeOptions() {
      return {
        maxWidth: '45%',
        disabled: !this.resizable,
        ...this.rightAsideResizeOptions,
        rangeDom: '.my-container',
        handles: 'w',
        onlySize: true
      }
    }
  }
}
</script>
