<template>
  <my-window
    v-loading="loadingPermissions"
    :title="title"
    :modal="modal"
    :wrapper-closable="true"
    :modal-append-to-body="modalAppendToBody"
    :visible.sync="visible"
    :before-close="onCancel"
    embed
    drawer
    size="100%"
    @opened="onSearch"
  >
    <el-table
      ref="multipleTable"
      :data="permissionTree"
      :default-expand-all="true"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      row-key="id"
      highlight-current-row
      style="width: 100%;"
      @select-all="onSelectAll"
      @select="onSelect"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column prop="label" label="导航菜单" width="200" />
      <el-table-column label="菜单操作" width>
        <template #default="{ row }">
          <el-checkbox-group v-if="row.apis && row.apis.length > 0" v-model="chekedApis">
            <el-checkbox v-for="api in row.apis" :key="api.id" :label="api.id" @change="(value)=>onChange(value, row.id)">{{ api.label }}</el-checkbox>
          </el-checkbox-group>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <el-button @click.native="onCancel">取消</el-button>
      <my-confirm-button type="submit" :loading="setPermissionLoading" @click="onSure" />
    </template>
  </my-window>
</template>

<script>
import { listToTree, treeToList, getParentsAndSelf } from '@/utils/tree'
import permissionApi from '@/api/admin/permission'
import MyConfirmButton from '@/components/my-confirm-button'
import MyWindow from '@/components/my-window'

export default {
  name: 'MySelectPermission',
  components: { MyConfirmButton, MyWindow },
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
    setPermissionLoading: {
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
      permissionTree: [],
      apis: [],
      loadingPermissions: false,
      checkedPermissions: [],
      chekedApis: []
    }
  },
  methods: {
    // 取消
    onCancel() {
      this.chekedApis = []
      this.checkedPermissions = []
      this.$refs.multipleTable.clearSelection()
      this.$emit('update:visible', false)
      this.$emit('cancel')
    },
    // 确定
    onSure() {
      const permissionIds = [...this.checkedPermissions]
      if (this.chekedApis.length > 0) {
        permissionIds.push(...this.chekedApis)
      }
      this.$emit('click', permissionIds)
    },
    // 查询
    onSearch() {
      this.getPermissions()
    },
    selectApis(checked, row) {
      if (row.apis) {
        row.apis.forEach(a => {
          const index = this.chekedApis.indexOf(a.id)
          if (checked) {
            if (index === -1) {
              this.chekedApis.push(a.id)
            }
          } else {
            if (index > -1) {
              this.chekedApis.splice(index, 1)
            }
          }
        })
      }
    },
    onSelectAll(selection) {
      const selections = treeToList(selection)
      const rows = treeToList(this.permissionTree)
      const checked = selections.length === rows.length
      rows.forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(row, checked)
        this.selectApis(checked, row)
      })

      this.checkedPermissions = this.$refs.multipleTable.selection.map(s => {
        return s.id
      })
    },
    onSelect(selection, row) {
      const checked = selection.some(s => s.id === row.id)
      if (row.children && row.children.length > 0) {
        const rows = treeToList(row.children)
        rows.forEach(r => {
          this.$refs.multipleTable.toggleRowSelection(r, checked)
          this.selectApis(checked, r)
        })
      } else {
        this.selectApis(checked, row)
      }

      const parents = getParentsAndSelf(treeToList(this.permissionTree), row)
      parents.forEach(parent => {
        const checked = this.checkedPermissions.includes(parent.id)
        if (!checked) {
          this.$refs.multipleTable.toggleRowSelection(parent, true)
        }
      })

      this.checkedPermissions = this.$refs.multipleTable.selection.map(s => {
        return s.id
      })
    },
    onChange(value, id) {
      if (value) {
        const parents = getParentsAndSelf(treeToList(this.permissionTree), { id })
        parents.forEach(parent => {
          const checked = this.checkedPermissions.includes(parent.id)
          if (!checked) {
            this.$refs.multipleTable.toggleRowSelection(parent, true)
          }
        })

        this.checkedPermissions = this.$refs.multipleTable.selection.map(s => {
          return s.id
        })
      }
    },
    // 获取权限树
    async getPermissions() {
      this.loadingPermissions = true
      this.onSelectAll([])

      const para = {}
      const res = await permissionApi.getPermissionList(para)
      this.loadingPermissions = false
      const tree = listToTree(_.cloneDeep(res.data))
      this.permissionTree = tree
      this.bindPermissions()
    },
    // 绑定权限
    async bindPermissions() {
      if (!(this.roleId > 0 || this.tenantId > 0)) {
        return
      }

      this.loadingPermissions = true
      const para = { roleId: this.roleId }
      const res = await (this.tenant ? permissionApi.getTenantPermissionList({ tenantId: this.tenantId }) : permissionApi.getRolePermissionList(para))

      this.loadingPermissions = false
      const permissionIds = res.data
      const rows = treeToList(this.permissionTree)
      rows.forEach(row => {
        const checked = permissionIds.includes(row.id)
        this.$refs.multipleTable.toggleRowSelection(row, checked)
      })
      this.checkedPermissions = this.$refs.multipleTable.selection.map(s => {
        return s.id
      })

      const apiIds = []
      permissionIds.forEach(permissionId => {
        if (!this.checkedPermissions.includes(permissionId)) {
          apiIds.push(permissionId)
        }
      })
      this.chekedApis = apiIds
    }
  }
}
</script>
