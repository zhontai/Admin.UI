<template>
  <section style="padding:10px;">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="6" class="toolbar roles">
        <el-card>
          <template #header>
            <div class="clearfix">
              <span>角色</span>
              <el-button
                :loading="loadingRoles"
                type="text"
                style="float: right; padding: 3px 0"
                @click="refreshRoles"
              >刷新</el-button>
            </div>
          </template>
          <el-collapse v-model="activeGroupList">
            <el-collapse-item v-for="(group, index) in roleTree" :key="group.id" :name="group.id">
              <template slot="title">
                {{ group.name }}
              </template>
              <!--列表-->
              <el-table
                ref="table"
                :data="group.children"
                highlight-current-row
                :show-header="false"
                current-row-key="id"
                @current-change="(currentRow, oldCurrentRow) => onCurrentChange(currentRow, oldCurrentRow, index)"
              >
                <template #empty>
                  <el-empty :image-size="50" />
                </template>
                <el-table-column prop="name" label="角色名" width />
              </el-table>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="18" class="toolbar perms">
        <el-card>
          <template #header>
            <div class="clearfix">
              <span>权限</span>
              <my-confirm-button
                v-if="checkPermission(['api:admin:permission:assign'])"
                :validate="saveValidate"
                :loading="loadingSave"
                :disabled="loadingPermissions"
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
          <my-el-tree
            ref="tree"
            :data="permissionTree"
            show-checkbox
            default-expand-all
            node-key="id"
            highlight-current
            :expand-on-click-node="false"
            check-on-click-node
            :indent="16"
          />
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import { listToTree } from '@/utils/tree'
import roleApi from '@/api/admin/role'
import permissionApi from '@/api/admin/permission'
import MyConfirmButton from '@/components/my-confirm-button'
import MyElTree from '@/components/element-ui/my-el-tree'

export default {
  name: 'RolePermission',
  components: { MyConfirmButton, MyElTree },
  data() {
    return {
      roleTree: [],
      activeGroupList: [],
      total: 0,
      roleId: 0,
      permissionTree: [],
      apis: [],
      loadingRoles: false,
      loadingPermissions: false,
      loadingSave: false,
      tableIndex: -1
    }
  },
  mounted() {
    this.getRoles()
    this.getPermissions()
  },
  methods: {
    refreshRoles() {
      this.getRoles()
      this.getPermissions()
    },
    // 获取角色列表
    async getRoles() {
      this.loadingRoles = true
      const res = await roleApi.getList(this.filter)
      this.loadingRoles = false

      if (!res?.success) {
        return
      }

      const data = res.data
      this.groupList = data.filter(a => a.parentId === 0)
      this.activeGroupList = this.groupList.map(a => a.id)
      this.roleTree = listToTree(_.cloneDeep(data))
      this.$nextTick(() => {
        if (this.roleTree?.length > 0 && this.roleTree[0].children) {
          this.$refs.table[0].setCurrentRow(this.roleTree[0].children[0])
        }
      })
    },
    // 获取权限树
    async getPermissions() {
      this.loadingPermissions = true

      const res = await permissionApi.getPermissionList()
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
      const res = await permissionApi.getRolePermissionList({ roleId: this.roleId })
      this.loadingPermissions = false
      this.$refs.tree.setCheckedKeys(res.data)
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
      return isValid
    },
    // 保存权限
    async save() {
      const permissionIds = this.$refs.tree.getCheckedKeys()
      const input = { permissionIds, roleId: this.roleId }

      this.loadingSave = true
      const res = await permissionApi.assign(input)
      this.loadingSave = false

      if (!res?.success) {
        return
      }

      this.$message({
        message: this.$t('admin.saveOk'),
        type: 'success'
      })
    },
    onCurrentChange(currentRow, oldCurrentRow, tableIndex) {
      if (this.tableIndex > -1 && this.tableIndex !== tableIndex) {
        this.$refs.table[this.tableIndex].setCurrentRow({ id: 0 })
      }

      this.tableIndex = tableIndex
      this.currentRow = currentRow

      this.roleId = currentRow.id
      this.getRolePermission()
    }
  }
}
</script>

<style lang="scss" scoped>
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

.save :deep([_button]) {
  padding: 3px 0px;
}

:deep() {
  .el-collapse{
    border-top-width: 0px;
    border-bottom-width: 0px;
    .el-collapse-item__wrap{
      border-bottom-width: 0px;
    }
  }
}

</style>
