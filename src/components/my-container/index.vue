<template>
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

export default {
  name: 'MyContainer',
  props: {
    showHeader: {
      type: Boolean,
      default: true
    },
    showFooter: {
      type: Boolean,
      default: true
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
    }
  }
}
</script>
