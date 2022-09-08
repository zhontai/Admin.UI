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
          <div class="role-box">
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
          </div>
          <!--分页-->
          <my-pagination
            ref="pager"
            :total="total"
            :auto-layout="false"
            layout="simpleJumper"
            @get-page="getRoles"
          />
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
          <el-tree
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
import { listToTree, treeToListWithChildren, getParentsAndSelf } from '@/utils/tree'
import roleApi from '@/api/admin/role'
import permissionApi from '@/api/admin/permission'
import MyConfirmButton from '@/components/my-confirm-button'

export default {
  name: 'RolePermission',
  components: {
    MyConfirmButton
  },
  data() {
    return {
      roles: [],
      total: 0,
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
    // disabledSave() {
    //   return !(
    //     this.roleId > 0 &&
    //     (this.checkedPermissions.length > 0 || this.chekedApis.length > 0)
    //   )
    // }
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
      var pager = this.$refs.pager.getPager()
      const params = {
        ...pager
      }
      this.loadingRoles = true
      const res = await roleApi.getPage(params)
      this.loadingRoles = false

      this.total = res.data.total
      this.roles = res.data?.list
    },
    // 获取权限树
    async getPermissions() {
      this.loadingPermissions = true

      const para = {}
      const res = await permissionApi.getPermissionList(para)
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
      const res = await permissionApi.getRolePermissionList(para)

      this.loadingPermissions = false
      const permissionIds = res.data
      const rows = treeToListWithChildren(this.permissionTree)
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
      // if (!(this.checkedPermissions.length > 0 || this.chekedApis.length > 0)) {
      //   this.$message({
      //     message: '请选择权限！',
      //     type: 'warning'
      //   })
      //   isValid = false
      //   return isValid
      // }
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
      const res = await permissionApi.assign(para)
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

.save :deep([_button]) {
  padding: 3px 0px;
}

.role-box{
  margin-bottom:10px;
  border-bottom:1px solid #E4E7ED;
}

:deep(.el-tree-node.is-expanded>.el-tree-node__children:last-child){
  display:flex;
  flex-wrap:wrap;
}
</style>
