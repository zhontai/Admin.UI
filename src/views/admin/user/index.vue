<template>
  <my-container
    :show-left-aside="true"
    :resizable="true"
    :show-header="false"
    :show-footer="false"
    :main-style="'padding:0px;'"
  >
    <template #left-aside>
      <my-organization @current-change="onCurrentChange" />
    </template>
    <my-user :organization-id="organizationId" />
  </my-container>
</template>

<script>
import MyOrganization from './organization'
import MyUser from './user'
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
  components: { MyOrganization, MyUser },
  directives: { resizable },
  data() {
    return {
      organizationId: null
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
      this.organizationId = currentRow.id
    }
  }
}
</script>
