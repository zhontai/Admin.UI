<template>
  <my-container v-loading="pageLoading">
    <!--顶部操作-->
    <template #header>
      <el-form class="ad-form-query" :inline="true" @submit.native.prevent>
        <el-form-item>
          <my-search :fields="fields" @click="onSearch" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onsearchWindowVisible">高级查询</el-button>
        </el-form-item>
        <el-form-item v-if="checkPermission(['api:admin:user:add'])">
          <el-button type="primary" @click="onAdd">添加员工</el-button>
        </el-form-item>
        <el-form-item v-if="checkPermission(['api:admin:user:batchsoftdelete'])">
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
              <p>确定要批量删除吗？</p>
            </template>
            移除员工
          </my-confirm-button>
        </el-form-item>
      </el-form>
    </template>

    <!--列表-->
    <el-table
      v-loading="listLoading"
      :data="users"
      highlight-current-row
      height="'100%'"
      style="width: 100%;height:100%;"
      @selection-change="onSelsChange"
    >
      <template #empty>
        <el-empty :image-size="100" />
      </template>
      <el-table-column type="selection" width="50" />
      <el-table-column prop="userName" label="用户名" width />
      <el-table-column prop="nickName" label="昵称" width />
      <el-table-column prop="roleNames" label="角色" width>
        <template #default="{row}">
          {{ row.roleNames ? row.roleNames.join(','):'' }}
        </template>
      </el-table-column>
      <el-table-column prop="createdTime" label="创建时间" :formatter="formatCreatedTime" width />
      <el-table-column prop="status" label="状态" width>
        <template #default="{row}">
          <el-tag :type="row.status == 0 ? 'success' : 'danger'" disable-transitions>
            {{ row.status == 0 ? '正常' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <template #footer>
      <my-pagination
        ref="pager"
        :total="total"
        :checked-count="sels.length"
        @get-page="getUsers"
      />
    </template>

    <!--高级查询窗口-->
    <my-search-window
      :visible.sync="searchWindowVisible"
      :fields="fields"
      :modal="false"
      @click="onSearchFilter"
    />

    <!--新增窗口-->
    <my-window
      v-if="checkPermission(['api:admin:user:add'])"
      title="新增用户"
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
          <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="18">
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
              <el-form-item label="用户名" prop="userName">
                <el-input
                  v-model="addForm.userName"
                  autocomplete="off"
                  :readonly="userNameReadonly"
                  @focus="userNameReadonly = false"
                  @blur="userNameReadonly = true"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
              <el-form-item label="密码" prop="password">
                <el-input v-model="addForm.password" show-password autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
              <el-form-item label="昵称" prop="nickName">
                <el-input v-model="addForm.nickName" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
              <el-form-item label="角色" prop="roleIds">
                <el-select v-model="addForm.roleIds" multiple placeholder="请选择角色" style="width:100%;">
                  <el-option
                    v-for="item in select.roles"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <my-confirm-button type="submit" :validate="addFormvalidate" :loading="addLoading" @click="onAddSubmit" />
      </template>
    </my-window>

    <!--编辑窗口-->
    <my-window
      v-if="checkPermission(['api:admin:user:update'])"
      title="编辑用户"
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
          <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="18">
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
              <el-form-item label="用户名" prop="userName">
                <el-input v-model="editForm.userName" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
              <el-form-item label="昵称" prop="nickName">
                <el-input v-model="editForm.nickName" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
              <el-form-item label="角色" prop="roleIds">
                <el-select v-model="editForm.roleIds" multiple placeholder="请选择角色" style="width:100%;">
                  <el-option
                    v-for="item in select.roles"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <my-confirm-button type="submit" :validate="editFormvalidate" :loading="editLoading" @click="onEditSubmit" />
      </template>
    </my-window>
  </my-container>
</template>

<script>
import { formatTime } from '@/utils'
import userApi from '@/api/admin/user'
import MyContainer from '@/components/my-container'
import MyConfirmButton from '@/components/my-confirm-button'
import MySearch from '@/components/my-search'
import MySearchWindow from '@/components/my-search-window'
import MyWindow from '@/components/my-window'

export default {
  name: 'MyUser',
  _sync: {
    disabled: true
  },
  components: { MyContainer, MyConfirmButton, MySearch, MySearchWindow, MyWindow },
  data() {
    return {
      // 高级查询字段
      fields: [
        { value: 'userName', label: '用户名', default: true },
        { value: 'nickName', label: '昵称', type: 'string' },
        { value: 'createdTime', label: '创建时间', type: 'date', operator: 'daterange',
          config: { type: 'daterange', format: 'yyyy-MM-dd', valueFormat: 'yyyy-MM-dd' }
        }
      ],
      searchWindowVisible: false,
      dynamicFilter: null,

      users: [],
      roles: [],
      select: { roles: [] },
      total: 0,
      sels: [], // 列表选中列
      listLoading: false,

      pageLoading: false,
      addDialogFormVisible: false,
      editFormVisible: false, // 编辑界面是否显示
      editLoading: false,
      editFormRules: {
        userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
      },
      userNameReadonly: true,
      // 编辑界面数据
      editForm: {
        id: 0,
        userName: '',
        nickName: '',
        roleIds: []
      },

      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      // 新增界面数据
      addForm: {
        userName: '',
        nickName: '',
        password: '',
        roleIds: []
      },
      deleteLoading: false
    }
  },
  async mounted() {
    await this.getUsers()
  },
  methods: {
    formatCreatedTime(row, column, time) {
      return formatTime(time, 'YYYY-MM-DD HH:mm')
    },
    // 查询
    onSearch(dynamicFilter) {
      this.$refs.pager.setPage(1)
      this.dynamicFilter = dynamicFilter
      this.getUsers()
    },

    // 高级查询显示
    onsearchWindowVisible() {
      this.searchWindowVisible = true
    },
    // 高级查询
    onSearchFilter(dynamicFilter) {
      this.$refs.pager.setPage(1)
      this.dynamicFilter = dynamicFilter
      this.getUsers()
      this.searchWindowVisible = false
    },

    // 获取用户列表
    async getUsers() {
      var pager = this.$refs.pager.getPager()
      const params = {
        ...pager,
        dynamicFilter: this.dynamicFilter
      }

      this.listLoading = true
      const res = await userApi.getPage(params)
      this.listLoading = false

      if (!res?.success) {
        return
      }

      this.total = res.data.total
      const data = res.data.list
      data.forEach(d => {
        d._loading = false
      })
      this.users = data
    },
    // 显示编辑界面
    async onEdit(index, row) {
      this.pageLoading = true
      const res = await userApi.get({ id: row.id })
      this.pageLoading = false
      if (res && res.success) {
        const { form, select } = res.data
        this.select = select
        this.editForm = form
        this.editFormVisible = true
      }
    },
    closeEditForm() {
      this.$refs.editForm.resetFields()
    },
    // 编辑验证
    editFormvalidate() {
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

      const res = await userApi.update(para)
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
      this.getUsers()
    },
    // 显示新增界面
    async onAdd() {
      this.pageLoading = true
      const res = await userApi.getSelect()
      this.pageLoading = false
      if (res && res.success) {
        const { select } = res.data
        this.select = select
        this.addFormVisible = true
      }
    },
    closeAddForm() {
      this.$refs.addForm.resetFields()
    },
    // 新增验证
    addFormvalidate() {
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

      const res = await userApi.add(para)
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
      this.getUsers()
    },
    // 删除验证
    deleteValidate(row) {
      let isValid = true
      if (row && row.userName === 'admin') {
        this.$message({
          message: row.nickName + '，禁止删除！',
          type: 'warning'
        })
        isValid = false
      }

      return isValid
    },
    // 删除
    async onDelete(index, row) {
      row._loading = true
      const para = { id: row.id }
      const res = await userApi.softDelete(para)
      row._loading = false

      if (!res?.success) {
        return
      }
      this.$message({
        message: this.$t('admin.deleteOk'),
        type: 'success'
      })
      this.getUsers()
    },
    // 批量删除验证
    batchDeleteValidate() {
      let isValid = true
      var row = this.sels && this.sels.find(s => s.userName === 'admin')
      if (row && row.userName === 'admin') {
        this.$message({
          message: row.nickName + '，禁止删除！',
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
      const res = await userApi.batchSoftDelete(para.ids)
      this.deleteLoading = false

      if (!res?.success) {
        return
      }
      this.$message({
        message: this.$t('admin.batchDeleteOk'),
        type: 'success'
      })

      this.getUsers()
    },
    // 选择
    onSelsChange(sels) {
      this.sels = sels
    }
  }
}
</script>

<style lang="scss" scoped>
.my-search :deep(.el-input-group__prepend) {
  background-color: #fff;
}
</style>
