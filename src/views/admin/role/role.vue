<template>
  <my-container v-loading="pageLoading" :show-footer="false">
    <!--查询-->
    <template #header>
      <el-form class="ad-form-query" :inline="true" :model="filter" @submit.native.prevent>
        <el-form-item>
          <my-search v-model="filter.name" :placeholder="'角色名'" @click="onSearch" />
        </el-form-item>
        <el-form-item v-if="checkPermission(['api:admin:role:add'])">
          <el-button type="primary" @click="onAdd">新增</el-button>
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

    <el-collapse v-model="activeNames">
      <el-collapse-item title="一致性 Consistency" name="1">
        <template slot="title">
          默认
        </template>
        <!--列表-->
        <el-table
          v-loading="listLoading"
          :data="roles"
          highlight-current-row
          height="'100%'"
          :show-header="false"
          style="width: 100%;height:100%;"
          @selection-change="selsChange"
        >
          <template #empty>
            <el-empty :image-size="100" />
          </template>
          <el-table-column type="selection" width="50" />
          <el-table-column prop="name" label="角色名" width />
          <el-table-column v-if="checkPermission(['api:admin:role:update','api:admin:role:softdelete'])" label="操作" width="180">
            <template #default="{ $index, row }">
              <el-dropdown v-if="checkPermission(['api:admin:role:update'])" split-button type="primary" style="margin-left:10px;" @click="onEdit($index, row)" @command="(command)=>onCommand(command,row)">
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
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>

    <!--选择权限-->
    <my-select-permission
      :role-id="roleId"
      :title="title"
      :visible.sync="selectPermissionVisible"
      @click="onSelectPermission"
    />

    <!--新增窗口-->
    <my-window
      v-if="checkPermission(['api:admin:role:add'])"
      title="新增角色"
      embed
      drawer
      :visible.sync="addFormVisible"
      @close="closeAddForm"
    >
      <el-form
        ref="addForm"
        :model="addForm"
        :rules="addFormRules"
        label-width="80px"
        :inline="false"
      >
        <el-row>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <el-form-item label="角色名" prop="name">
              <el-input v-model="addForm.name" auto-complete="off" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <el-form-item label="编码" prop="code">
              <el-input v-model="addForm.code" auto-complete="off" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <el-form-item label="状态" prop="enabled">
              <el-select v-model="addForm.enabled" placeholder="请选择角色状态" style="width:100%;">
                <el-option
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
            <el-form-item label="说明" prop="description">
              <el-input v-model="addForm.description" type="textarea" :rows="2" auto-complete="off" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <my-confirm-button type="submit" :validate="addFormValidate" :loading="addLoading" @click="onAddSubmit" />
      </template>
    </my-window>

    <!--编辑窗口-->
    <my-window
      v-if="checkPermission(['api:admin:role:update'])"
      title="编辑角色"
      embed
      drawer
      :visible.sync="editFormVisible"
      @close="closeEditForm"
    >
      <el-form
        ref="editForm"
        :model="editForm"
        :rules="editFormRules"
        label-width="80px"
        :inline="false"
      >
        <el-row>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <el-form-item label="角色名" prop="name">
              <el-input v-model="editForm.name" auto-complete="off" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <el-form-item label="编码" prop="code">
              <el-input v-model="editForm.code" auto-complete="off" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <el-form-item label="状态" prop="enabled">
              <el-select v-model="editForm.enabled" placeholder="请选择角色状态" style="width:100%;">
                <el-option
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
            <el-form-item label="说明" prop="description">
              <el-input v-model="editForm.description" type="textarea" :rows="2" auto-complete="off" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <my-confirm-button type="submit" :validate="editFormValidate" :loading="editLoading" @click="onEditSubmit" />
      </template>
    </my-window>
  </my-container>
</template>

<script>
import { formatTime } from '@/utils'
import roleApi from '@/api/admin/role'
import permissionApi from '@/api/admin/permission'
import MyConfirmButton from '@/components/my-confirm-button'
import MySelectPermission from '@/components/my-select-window/permission'
import MyWindow from '@/components/my-window'
import MySearch from '@/components/my-search'
import resizable from '@/directive/resizable'

export default {
  name: 'MyRole',
  _sync: {
    disabled: true
  },
  components: { MyConfirmButton, MySelectPermission, MyWindow, MySearch },
  directives: { resizable },
  data() {
    return {
      activeNames: ['1', '2'],
      filter: {
        name: ''
      },
      roles: [],
      total: 0,
      sels: [], // 列表选中列
      statusList: [
        { name: '激活', value: true },
        { name: '禁用', value: false }
      ],
      listLoading: false,

      pageLoading: false,
      addDialogFormVisible: false,
      editFormVisible: false, // 编辑界面是否显示
      editLoading: false,
      editFormRules: {
        name: [{ required: true, message: '请输入角色名', trigger: 'blur' }],
        code: [{ required: true, message: '请输入编码', trigger: 'blur' }],
        enabled: [{ required: true, message: '请输入状态', trigger: 'change' }]
      },
      // 编辑界面数据
      editForm: {
        id: 0,
        name: '',
        description: '',
        enabled: ''
      },
      editFormRef: null,

      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [{ required: true, message: '请输入角色名', trigger: 'blur' }],
        code: [{ required: true, message: '请输入编码', trigger: 'blur' }],
        enabled: [{ required: true, message: '请输入状态', trigger: 'change' }]
      },
      // 新增界面数据
      addForm: {
        name: '',
        description: '',
        enabled: true
      },
      addFormRef: null,
      deleteLoading: false,

      selectPermissionVisible: false,
      currentRow: null
    }
  },
  computed: {
    roleId() {
      return this.currentRow?.id
    },
    title() {
      return `设置${this.currentRow?.name}（${this.currentRow?.code}）权限`
    },
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
    this.getRoles()
  },
  beforeUpdate() {
    // console.log('update')
  },
  methods: {
    formatCreatedTime: function(row, column, time) {
      return formatTime(time, 'YYYY-MM-DD HH:mm')
    },
    onSearch() {
      this.getRoles()
    },
    // 获取角色列表
    async getRoles() {
      this.listLoading = true
      const res = await roleApi.getList(this.filter)
      this.listLoading = false

      if (!res?.success) {
        return
      }

      const data = res.data
      data.forEach(d => {
        d._loading = false
      })
      this.roles = data
    },
    // 显示编辑界面
    async onEdit(index, row) {
      this.pageLoading = true
      const res = await roleApi.get({ id: row.id })
      this.pageLoading = false
      if (res && res.success) {
        const data = res.data
        this.editForm = data
        this.editFormVisible = true
      }
    },
    closeEditForm() {
      this.$refs.editForm.resetFields()
    },
    // 显示新增界面
    onAdd() {
      this.addFormVisible = true
    },
    closeAddForm() {
      this.$refs.addForm.resetFields()
    },
    // 编辑验证
    editFormValidate: function() {
      let isValid = false
      this.$refs.editForm.validate(valid => {
        isValid = valid
      })
      return isValid
    },
    // 编辑
    async onEditSubmit() {
      this.editLoading = true
      const para = _.cloneDeep(this.editForm)

      const res = await roleApi.update(para)
      this.editLoading = false

      if (!res?.success) {
        return
      }

      this.$message({
        message: this.$t('admin.updateOk'),
        type: 'success'
      })
      this.$refs['editForm'].resetFields()
      this.editFormVisible = false
      this.getRoles()
    },
    // 新增验证
    addFormValidate: function() {
      let isValid = false
      this.$refs.addForm.validate(valid => {
        isValid = valid
      })
      return isValid
    },
    // 新增
    async onAddSubmit() {
      this.addLoading = true
      const para = _.cloneDeep(this.addForm)

      const res = await roleApi.add(para)
      this.addLoading = false

      if (!res?.success) {
        return
      }

      this.$message({
        message: this.$t('admin.addOk'),
        type: 'success'
      })
      this.$refs['addForm'].resetFields()
      this.addFormVisible = false
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
      const res = await roleApi.batchSoftDelete(para.ids)
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
    selsChange: function(sels) {
      this.sels = sels
    },
    // 选择权限
    async onSelectPermission(permissionIds) {
      const para = { permissionIds, roleId: this.roleId }
      this.loadingSave = true
      const res = await permissionApi.assign(para)
      this.loadingSave = false

      if (!res?.success) {
        return
      }

      this.selectPermissionVisible = false
      this.$message({
        message: this.$t('admin.saveOk'),
        type: 'success'
      })
    },
    // 更多操作
    onCommand(command, row) {
      if (command === 'setPermission') {
        this.currentRow = row
        this.selectPermissionVisible = true
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
}
</style>
