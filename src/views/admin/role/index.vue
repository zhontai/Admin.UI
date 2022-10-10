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
      <my-container v-loading="pageLoading" :show-footer="false">
        <!--查询-->
        <template #header>
          <el-form class="ad-form-query" :inline="true" @submit.native.prevent>
            <el-form-item>
              <el-input v-model="filterText" placeholder="筛选角色" clearable />
            </el-form-item>
            <el-form-item v-if="checkPermission(['api:admin:role:add'])">
              <el-dropdown @command="onAddCommand">
                <el-button type="primary">
                  新增<i class="el-icon-arrow-down el-icon--right" />
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu :visible-arrow="false" style="margin-top: 2px;">
                    <el-dropdown-item icon="el-icon-folder" command="addRoleGroup">新增分组</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-s-operation" command="addRole">新增角色</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-form-item>
            <el-form-item v-if="checkPermission(['api:admin:role:batchsoftdelete'])">
              <my-confirm-button
                :disabled="sels.length === 0"
                :type="'delete'"
                :placement="'bottom-end'"
                :loading="deleteLoading"
                :validate="batchDeleteValidate"
                style="margin-left: 0px;"
                @click="onBatchDelete"
              >
                <template #content>
                  <p>确定要删除吗？</p>
                </template>
                删除
              </my-confirm-button>
            </el-form-item>
          </el-form>
        </template>

        <el-collapse v-model="activeGroupList">
          <el-collapse-item v-for="(group, index) in tree" :key="group.id" :name="group.id">
            <template slot="title">
              {{ group.name }}

              <el-button type="text" size="medium" icon="el-icon-plus" style="margin-left:10px;" @click.stop="onAddRole(group)" />
              <el-button type="text" size="medium" icon="el-icon-edit" @click.stop="onEditGroup(group)" />
              <my-confirm-button
                type="text"
                icon="el-icon-delete"
                placement="bottom-end"
                :loading="group._loading"
                @valid.stop
                @click="onDelete(group)"
              >
                <template #content>
                  <p>确定要删除吗？</p>
                </template>
              </my-confirm-button>
              <!-- <el-button type="text" size="medium" icon="el-icon-delete" @click.stop="onDelete(group)" /> -->
            </template>
            <!--列表-->
            <el-table
              ref="table"
              :data="group.children"
              highlight-current-row
              :show-header="false"
              current-row-key="id"
              @selection-change="onSelectionChange"
              @current-change="(currentRow, oldCurrentRow) => onCurrentChange(currentRow, oldCurrentRow, index)"
            >
              <template #empty>
                <el-empty :image-size="50" description="暂无角色" />
              </template>
              <el-table-column type="selection" width="50" />
              <el-table-column prop="name" label="角色名" width />
              <el-table-column v-if="checkPermission(['api:admin:role:update','api:admin:role:softdelete'])" label="操作" width="180">
                <template #default="{ $index, row }">
                  <div style="display: inline-block;" @click.stop>
                    <el-dropdown
                      v-if="checkPermission(['api:admin:role:update'])"
                      split-button
                      style="margin-left:10px;"
                      @click="onEdit(row,$index)"
                      @command="(command)=>onCommand(command,row)"
                    >
                      编辑
                      <template #dropdown>
                        <el-dropdown-menu :visible-arrow="false" style="margin-top: 2px;width:90px;text-align:right;">
                          <el-dropdown-item v-if="checkPermission(['api:admin:permission:assign'])" command="setPermission">设置权限</el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                    <el-dropdown v-else-if="checkPermission(['api:admin:permission:assign'])" style="margin-left:10px;" @command="(command)=>onCommand(command,row)">
                      <el-button type="primary">
                        更多 <i class="el-icon-arrow-down el-icon--right" />
                      </el-button>
                      <template #dropdown>
                        <el-dropdown-menu :visible-arrow="false" style="margin-top: 2px;width:90px;text-align:right;">
                          <el-dropdown-item v-if="checkPermission(['api:admin:permission:assign'])" command="setPermission">设置权限</el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </div>

                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>

        <!--选择权限-->
        <my-select-permission
          :role-id="currentRow?.id"
          :title="permissionTitle"
          :visible.sync="selectPermissionVisible"
          :sure-loading.sync="sureLoading"
          @click="onSelectPermission"
        />

        <!--角色窗口-->
        <my-window
          v-if="checkPermission(['api:admin:role:add', 'api:admin:role:update'])"
          :title="roleTitle"
          embed
          drawer
          :visible.sync="role.visible"
          @close="onClose"
        >
          <el-form
            ref="form"
            :model="role.form"
            :rules="role.rules"
            label-width="80px"
            :inline="false"
          >
            <el-row>
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-form-item :label="`${addRole?'角色':'分组'}名称`" prop="name">
                  <el-input v-model="role.form.name" auto-complete="off" />
                </el-form-item>
              </el-col>
              <el-col v-if="addRole" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-form-item label="分组到" prop="parentId">
                  <el-select key="parentId" v-model="role.form.parentId" placeholder="请选择" style="width:100%;">
                    <el-option
                      v-for="item in groupList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <template #footer>
            <el-button @click.native="role.visible = false">取消</el-button>
            <my-confirm-button
              type="submit"
              :validate="validate"
              :loading="role.loading"
              @click="onSubmit"
            />
          </template>
        </my-window>
      </my-container>
    </template>
    <my-role-user :role-id="roleId" />
  </my-container>

</template>

<script>
import roleApi from '@/api/admin/role'
import permissionApi from '@/api/admin/permission'
import MyConfirmButton from '@/components/my-confirm-button'
import MySelectPermission from '@/components/my-select-window/permission'
import MyWindow from '@/components/my-window'
import resizable from '@/directive/resizable'
import { listToTree } from '@/utils/tree'
import MyRoleUser from './user'

/**
 * 角色管理
 */
export default {
  name: 'Role',
  _sync: {
    disabled: false,
    title: '角色管理',
    desc: '',
    cache: true
  },
  components: { MyConfirmButton, MySelectPermission, MyWindow, MyRoleUser },
  directives: { resizable },
  data() {
    return {
      filterText: '',
      dataList: [],
      tree: [],
      groupList: [],
      activeGroupList: [],
      sels: [], // 列表选中列
      pageLoading: false,
      deleteLoading: false,
      selectPermissionVisible: false,
      sureLoading: false,
      currentRow: null,
      tableIndex: -1,
      addRole: false,
      role: {
        init: {
          id: 0,
          parentId: 0,
          name: ''
        },
        form: {
          name: '',
          parentId: 0
        },
        visible: false,
        loading: false,
        rules: {
          name: [{ required: true, message: '请输入角色名', trigger: 'blur' }],
          parentId: [{ required: true, message: '请选择角色分组', trigger: 'change' }]
        }
      },
      roleId: null
    }
  },
  computed: {
    roleTitle() {
      return `${(this.role.form.id > 0 ? '编辑' : '新增')}${this.addRole ? '角色' : '分组'}`
    },
    permissionTitle() {
      return `设置${this.currentRow?.name}权限`
    },
    resizeOptions() {
      return {
        handles: 'e',
        onlySize: true,
        minWidth: 400,
        maxWidth: 800,
        autoCalcRange: false
      }
    }
  },
  watch: {
    filterText(val) {
      this.filterRoles(val)
    }
  },
  mounted() {
    this.getRoles()
  },
  methods: {
    filterRoles(val) {
      if (val) {
        const data = this.dataList.filter(a => a.parentId !== 0 && a.name.indexOf(val) > -1)
        this.tree = listToTree(_.cloneDeep(this.groupList.concat(data)))
      } else {
        this.tree = listToTree(_.cloneDeep(this.dataList))
      }
      this.$nextTick(() => {
        for (let index = 0; index < this.tree.length; index++) {
          if (this.tree[index].children?.length > 0) {
            this.$refs.table[index].setCurrentRow(this.tree[index].children[0])
            break
          }
        }
      })
    },
    // 获取角色列表
    async getRoles() {
      this.pageLoading = true
      const res = await roleApi.getList()
      this.pageLoading = false

      if (!res?.success) {
        return
      }

      const data = res.data
      data.forEach(d => {
        d._loading = false
      })
      this.dataList = data
      this.groupList = data.filter(a => a.parentId === 0)
      this.tree = listToTree(_.cloneDeep(data))
      this.tree.forEach(a => {
        if (a.children?.length > 0) {
          this.activeGroupList.push(a.id)
        }
      })
      this.$nextTick(() => {
        if (this.tree?.length > 0 && this.tree[0].children) {
          this.$refs.table[0].setCurrentRow(this.tree[0].children[0])
        }
      })
    },
    async edit(row) {
      this.pageLoading = true
      const res = await roleApi.get({ id: row.id })
      this.pageLoading = false
      if (res && res.success) {
        this.role.form = res.data
        this.role.visible = true
      }
    },
    // 显示编辑界面
    async onEdit(row, index) {
      this.addRole = true
      this.edit(row)
    },
    // 显示编辑界面
    async onEditGroup(row) {
      this.addRole = false
      this.edit(row)
    },
    // 关闭
    onClose() {
      this.role.form = {}
      this.$refs.form.resetFields()
    },
    // 验证
    validate: function() {
      let isValid = false
      this.$refs.form.validate(valid => {
        isValid = valid
      })
      return isValid
    },
    // 提交
    async onSubmit() {
      this.role.loading = true
      const para = _.cloneDeep(this.role.form)
      const res = await (para.id > 0 ? roleApi.update(para) : roleApi.add(para))
      this.role.loading = false

      if (!res?.success) {
        return
      }

      this.$message({
        message: para.id > 0 ? this.$t('admin.updateOk') : this.$t('admin.addOk'),
        type: 'success'
      })
      this.$refs.form.resetFields()
      this.role.visible = false
      this.getRoles()
    },
    // 批量删除验证
    batchDeleteValidate() {
      let isValid = true
      var row = this.sels && this.sels.find(s => s.name === 'admin')
      if (row && row.name === 'admin') {
        this.$message({
          message: row.description + '，禁止删除！',
          type: 'warning'
        })
        isValid = false
      }

      return isValid
    },
    // 批量删除
    async onBatchDelete() {
      const para = { ids: [] }
      para.ids = this.sels.map(s => {
        return s.id
      })

      this.deleteLoading = true
      const res = await roleApi.batchDelete(para.ids)
      this.deleteLoading = false

      if (!res?.success) {
        return
      }
      this.$message({
        message: this.$t('admin.batchDeleteOk'),
        type: 'success'
      })

      this.getRoles()
    },
    // 删除
    async onDelete(row) {
      row._loading = true
      const para = { id: row.id }
      const res = await roleApi.deleteAsync(para)
      row._loading = false

      if (!res?.success) {
        return
      }
      this.$message({
        message: this.$t('admin.deleteOk'),
        type: 'success'
      })
      this.getRoles()
    },
    onSelectionChange: function(sels) {
      this.sels = sels
    },
    // 选择权限
    async onSelectPermission(permissionIds) {
      const para = { permissionIds, roleId: this.currentRow?.id }
      this.sureLoading = true
      const res = await permissionApi.assign(para)
      this.sureLoading = false

      if (!res?.success) {
        return
      }

      this.selectPermissionVisible = false
      this.$message({
        message: this.$t('admin.saveOk'),
        type: 'success'
      })
    },
    // 新增操作
    onAddCommand(command) {
      this.role.form = this.role.init
      switch (command) {
        case 'addRole':
          this.addRole = true
          this.role.visible = true
          break
        case 'addRoleGroup':
          this.addRole = false
          this.role.visible = true
          break
        default:
          break
      }
    },
    // 新增角色操作
    onAddRole(row) {
      this.role.form = this.role.init
      this.role.form.parentId = row.id
      this.addRole = true
      this.role.visible = true
    },
    // 分组操作
    onGroupCommand(command, row) {
      switch (command) {
        case 'update':
          this.edit(row)
          break
        case 'delete':
          this.del(row)
          break
        default:
          break
      }
    },
    // 更多操作
    onCommand(command, row) {
      // 设置权限
      if (command === 'setPermission') {
        this.currentRow = row
        this.selectPermissionVisible = true
      }
    },
    onCurrentChange(currentRow, oldCurrentRow, tableIndex) {
      if (this.tableIndex > -1 && tableIndex !== this.tableIndex && currentRow?.id > 0) {
        this.$refs.table[this.tableIndex].setCurrentRow({ id: 0 })
      }

      this.tableIndex = tableIndex
      if (currentRow?.id > 0) {
        this.roleId = currentRow?.id
      }
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-collapse) {
    border-top-width: 0px;
    border-bottom-width: 0px;
    .el-collapse-item__wrap{
      border-bottom-width: 0px;
    }
}

:deep() {
    .el-table::before{
      height: 0px
    }
    .el-empty{
      padding:0px;
    }
    .el-table__empty-text{
      line-height: unset;
    }
}
</style>
