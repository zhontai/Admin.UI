<template>
  <my-window
    v-loading="loading"
    :title="title"
    :modal="modal"
    :wrapper-closable="true"
    :modal-append-to-body="modalAppendToBody"
    :visible.sync="visible"
    :before-close="onCancel"
    embed
    drawer
    size="100%"
    @opened="init"
  >
    <my-el-tree
      ref="tree"
      :data="tree"
      show-checkbox
      default-expand-all
      node-key="id"
      highlight-current
      :expand-on-click-node="false"
      check-on-click-node
      :indent="16"
    />
    <template #footer>
      <el-button @click.native="onCancel">取消</el-button>
      <my-confirm-button type="submit" :loading="sureLoading" @click="onSure" />
    </template>
  </my-window>
</template>

<script>
import { listToTree } from '@/utils/tree'
import permissionApi from '@/api/admin/permission'
import MyConfirmButton from '@/components/my-confirm-button'
import MyWindow from '@/components/my-window'
import MyElTree from '@/components/element-ui/my-el-tree'

export default {
  name: 'MySelectPermission',
  components: { MyConfirmButton, MyWindow, MyElTree },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    modal: {
      type: Boolean,
      default: false
    },
    modalAppendToBody: {
      type: Boolean,
      default: false
    },
    tenant: {
      type: Boolean,
      default: false
    },
    sureLoading: {
      type: Boolean,
      default: false
    },
    roleId: {
      type: Number,
      default: 0
    },
    tenantId: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: '设置权限'
    }
  },
  data() {
    return {
      tree: [],
      loading: false
    }
  },
  methods: {
    // 取消
    onCancel() {
      this.$emit('update:visible', false)
      this.$emit('cancel')
    },
    // 确定
    onSure() {
      const ids = this.$refs.tree.getCheckedKeys(true)
      this.$emit('click', ids)
    },
    // 初始化
    async init() {
      await this.initData()
      await this.setData()
    },
    // 初始化数据
    async initData() {
      this.loading = true
      const res = await permissionApi.getPermissionList()
      this.loading = false
      this.tree = listToTree(_.cloneDeep(res.data))
    },
    // 设置数据
    async setData() {
      if (!(this.roleId > 0 || this.tenantId > 0)) {
        return
      }

      this.loading = true
      const res = await (this.tenant ? permissionApi.getTenantPermissionList({ tenantId: this.tenantId })
        : permissionApi.getRolePermissionList({ roleId: this.roleId }))
      this.loading = false
      this.$refs.tree.setCheckedKeys(res.data)
    }
  }
}
</script>
