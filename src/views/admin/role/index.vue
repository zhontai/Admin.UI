<template>
  <my-container :show-left-aside="true" :resizable="true" :show-header="false" :show-footer="false" :main-style="'padding:0px;'">
    <template #left-aside>
      <my-role @current-change="onCurrentChange" />
    </template>
    <my-user :role-id="roleId" />
  </my-container>
</template>

<script>
import MyRole from './role'
import MyUser from './user'
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
  components: { MyRole, MyUser },
  directives: { resizable },
  data() {
    return {
      roleId: null
    }
  },
  computed: {
    resizeOptions() {
      return {
        handles: 'e',
        onlySize: true,
        minWidth: 280,
        maxWidth: 700
      }
    }
  },
  mounted() {
  },
  beforeUpdate() {
  },
  methods: {
    onCurrentChange(currentRow, oldCurrentRow) {
      this.roleId = currentRow.id
    }
  }
}
</script>
