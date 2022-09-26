<template>
  <my-container
    left-aside-width="280px"
    :left-aside-resize-options="resizeOptions"
    :show-left-aside="true"
    :resizable="true"
    :show-header="false"
    :show-footer="false"
    :main-style="'padding:0px;'"
  >
    <template #left-aside>
      <my-page-org />
    </template>
    <my-page-user />
  </my-container>
</template>

<script>
import MyPageOrg from './organization'
import MyPageUser from './user'
import resizable from '@/directive/resizable'

/**
 * 数据字典类型
 */
export default {
  name: 'User',
  _sync: {
    disabled: false,
    title: '用户管理',
    desc: '',
    cache: true
  },
  components: { MyPageOrg, MyPageUser },
  directives: { resizable },
  computed: {
    resizeOptions() {
      return {
        handles: 'e',
        onlySize: true,
        minWidth: 160,
        maxWidth: 500,
        autoCalcRange: false
      }
    }
  }
}
</script>
