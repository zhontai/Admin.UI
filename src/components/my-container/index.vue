<template>
  <section style="height:100%;">
    <el-container style="height:100%;position:relative;">
      <el-header height="auto" style="padding:10px 0px 0px 10px;">
        <slot name="header" />
      </el-header>
      <el-main style="padding:0px 10px;">
        <slot />
      </el-main>
      <el-footer height style="padding:5px 0px 10px 10px;">
        <slot name="footer" />
      </el-footer>
    </el-container>
  </section>
</template>

<script>
/**
 * container 容器组件
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
  name: 'MyContainer'
}
</script>
