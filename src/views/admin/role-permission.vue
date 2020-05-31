<template>
  <section style="padding:10px;">
    <el-row :gutter="10">
      <el-col :span="6" class="toolbar roles">
        <el-card>
          <template #header>
            <div class="clearfix">
              <span>角色</span>
              <el-button
                :loading="loadingRoles"
                type="text"
                style="float: right; padding: 3px 0"
                @click="getRoles"
              >刷新</el-button>
            </div>
          </template>
          <div
            v-for="o in roles"
            :key="o.id"
            :class="o.id == roleId ? 'active' : ''"
            class="item role-item"
            @click="roleSelect(o.id)"
          >
            <span>{{ o.name }}</span>
            <span style="float:right;">{{ o.description }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" class="toolbar perms">
        <el-card>
          <template #header>
            <div class="clearfix">
              <span>权限</span>
              <my-confirm-button
                v-if="checkPermission(['api:admin:permission:assign'])"
                :validate="saveValidate"
                :loading="loadingSave"
                :disabled="disabledSave"
                :placement="'left'"
                type="text"
                class="save"
                style="float: right;"
                @click="save"
              >
                <template #content>
                  <p>确定要保存吗？</p>
                </template>
                保存
              </my-confirm-button>
              <el-button
                :loading="loadingPermissions"
                type="text"
                style="float: right; padding: 3px 0"
                @click="getPermissions"
              >刷新</el-button>
            </div>
          </template>
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
            <el-table-column label="菜单接口" width>
              <template v-slot="{ $index, row }">
                <el-checkbox-group v-if="row.apis && row.apis.length > 0" v-model="chekedApis">
                  <el-checkbox v-for="api in row.apis" :key="api.id" :label="api.id" @change="(value)=>onChange(value, row.id)">{{ api.label }}</el-checkbox>
                </el-checkbox-group>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import { treeToList, listToTree, getTreeParentsWithSelf } from '@/utils'
import { getRoleListPage } from '@/api/admin/role'
import {
  getPermissions,
  getPermissionIds,
  addRolePermission
} from '@/api/admin/permission'
import MyConfirmButton from '@/components/my-confirm-button'

export default {
  name: 'Assign',
  components: {
    MyConfirmButton
  },
  data() {
    return {
      roles: [],
      roleId: 0,
      permissionTree: [],
      apis: [],
      loadingRoles: false,
      loadingPermissions: false,
      loadingSave: false,
      checkedPermissions: [],
      chekedApis: []
    }
  },
  computed: {
    disabledSave() {
      return !(
        this.roleId > 0 &&
        (this.checkedPermissions.length > 0 || this.chekedApis.length > 0)
      )
    }
  },
  mounted() {
    this.getRoles()
    this.getPermissions()
  },
  methods: {
    // 获取角色列表
    async getRoles() {
      this.loadingRoles = true
      const res = await getRoleListPage()
      this.loadingRoles = false
      this.roles = res.data?.list
    },
    // 获取权限树
    async getPermissions() {
      this.loadingPermissions = true
      this.onSelectAll([])

      const para = {}
      const res = await getPermissions(para)
      this.loadingPermissions = false
      const tree = listToTree(_.cloneDeep(res.data))
      this.permissionTree = tree
      this.getRolePermission()
    },
    // 获取角色权限
    async getRolePermission() {
      if (!this.roleId > 0) {
        return
      }

      this.loadingPermissions = true
      const para = { roleId: this.roleId }
      const res = await getPermissionIds(para)

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
    },
    // 验证保存
    saveValidate() {
      let isValid = true
      if (!(this.roleId > 0)) {
        this.$message({
          message: '请选择角色！',
          type: 'warning'
        })
        isValid = false
        return isValid
      }
      if (!(this.checkedPermissions.length > 0 || this.chekedApis.length > 0)) {
        this.$message({
          message: '请选择权限！',
          type: 'warning'
        })
        isValid = false
        return isValid
      }
      return isValid
    },
    // 保存权限
    async save() {
      const permissionIds = [...this.checkedPermissions]
      if (this.chekedApis.length > 0) {
        permissionIds.push(...this.chekedApis)
      }
      const para = { permissionIds, roleId: this.roleId }

      this.loadingSave = true
      const res = await addRolePermission(para)
      this.loadingSave = false

      if (!res?.success) {
        return
      }

      this.$message({
        message: this.$t('admin.saveOk'),
        type: 'success'
      })
    },
    roleSelect(id) {
      this.roleId = id
      this.onSelectAll([])
      this.getRolePermission()
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

      const parents = getTreeParentsWithSelf(this.permissionTree, row.id)
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
        const parents = getTreeParentsWithSelf(this.permissionTree, id)
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
    }
  }
}
</script>

<style scoped>
.role-item {
  font-size: 14px;
  cursor: pointer;
  padding: 10px;
}

.role-item.active {
  background: #ebf5ff;
}

.role-item:hover {
  background: #ebf5ff;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.save >>> [_button] {
  padding: 3px 0px;
}
</style>
