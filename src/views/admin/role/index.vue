<template>
  <my-container
    :show-left-aside="true"
    :left-aside-resize-options="resizeOptions"
    :resizable="true"
    :show-header="false"
    :show-footer="false"
    :main-style="'padding:0px;'"
  >
    <template #left-aside>
      <my-page-role />
    </template>
    <my-page-role-user />
  </my-container>
</template>

<script>
import MyPageRole from './role'
import MyPageRoleUser from './user'
import resizable from '@/directive/resizable'

/**
 * 数据字典类型
 */
export default {
  name: 'Role',
  _sync: {
    disabled: false,
    title: '角色管理',
    desc: '',
    cache: true
  },
  components: { MyPageRole, MyPageRoleUser },
  directives: { resizable },
  computed: {
    resizeOptions() {
      return {
        handles: 'e',
        onlySize: true,
        minWidth: 400,
        maxWidth: 800,
        autoCalcRange: false
      }
    }
  }
}
</script>
