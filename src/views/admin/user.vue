<template>
  <section>
    <!--工具条-->
    <el-row>
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form size="small" :inline="true" :model="filter" @submit.native.prevent>
          <el-form-item>
            <el-input
              v-model="filter.name"
              placeholder="用户名/昵称"
              clearable
              @keyup.enter.native="getUsers"
            >
              <i slot="prefix" class="el-input__icon el-icon-search" />
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getUsers">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onAdd">新增</el-button>
          </el-form-item>
          <el-form-item>
            <confirm-button
              v-if="sels.length > 0"
              :type="'delete'"
              :placement="'bottom-end'"
              :loading="deleteLoading"
              :validate="batchDeleteValidate"
              style="margin-left: 0px;"
              @click="onBatchDelete"
            >
              <p slot="content">确定要批量删除吗？</p>批量删除
            </confirm-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!--列表-->
    <el-table
      v-loading="listLoading"
      :data="users"
      highlight-current-row
      style="width: 100%;"
      @selection-change="selsChange"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column type="index" width="80" />
      <el-table-column prop="userName" label="用户名" width />
      <el-table-column prop="name" label="姓名" width />
      <el-table-column prop="roleNames" label="角色" width>
        <template v-slot="{row}">
          {{ row.roleNames ? row.roleNames.join(','):'' }}
        </template>
      </el-table-column>
      <el-table-column prop="createdTime" label="创建时间" :formatter="formatCreatedTime" width />
      <el-table-column prop="status" label="状态" width>
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status == 0 ? 'success' : 'danger'"
            disable-transitions
          >{{ scope.row.status == 0 ? '正常' : '禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template v-slot="{ $index, row }">
          <el-button size="small" @click="onEdit($index, row)">编辑</el-button>
          <confirm-button
            type="delete"
            :loading="row._loading"
            :validate="deleteValidate"
            :validate-data="row"
            @click="onDelete($index, row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-row>
      <el-col :span="24" class="pagination">
        <el-pagination
          layout="total, slot, sizes, prev, jumper, next"
          :current-page.sync="currentPage"
          :page-size.sync="pageSize"
          :total="total"
          :page-count="pageCount"
          background
          style="text-align:right;"
        >
          <span class="el-pagination__count">，{{ pageCount }} 页</span>
        </el-pagination>
      </el-col>
    </el-row>

    <!--编辑界面-->
    <el-drawer
      title="编辑用户"
      :wrapper-closable="true"
      :visible.sync="editFormVisible"
      direction="btt"
      size="'auto'"
      class="el-drawer__wrapper"
      @close="closeEditForm"
    >
      <section style="padding:24px 48px 74px 24px;">
        <el-form
          ref="editForm"
          :model="editForm"
          :rules="editFormRules"
          label-width="80px"
          :inline="false"
          size="small"
        >
          <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="18">
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
                <el-form-item label="用户名" prop="userName">
                  <el-input v-model="editForm.userName" autocomplete="off" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="editForm.name" autocomplete="off" />
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
                      v-for="item in roles"
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
      </section>
      <div class="drawer-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <confirm-button :validate="editFormvalidate" :loading="editLoading" @click="onEditSubmit" />
      </div>
    </el-drawer>

    <!--新增界面-->
    <el-drawer
      title="新增用户"
      :wrapper-closable="true"
      :visible.sync="addFormVisible"
      direction="btt"
      size="auto"
      class="el-drawer__wrapper"
      @close="closeAddForm"
    >
      <section style="padding:24px 48px 74px 24px;">
        <el-form
          ref="addForm"
          :model="addForm"
          :rules="addFormRules"
          label-width="80px"
          :inline="false"
          size="small"
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
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="addForm.name" autocomplete="off" />
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
                      v-for="item in roles"
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
      </section>
      <div class="drawer-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <confirm-button :validate="addFormvalidate" :loading="addLoading" @click="onAddSubmit" />
      </div>
    </el-drawer>
  </section>
</template>

<script>
import { formatTime } from '@/utils'
import { getRoleListPage } from '@/api/admin/role'
import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser, getUser } from '@/api/admin/user'
import ConfirmButton from '@/components/ConfirmButton'

export default {
  name: 'Users',
  components: {
    ConfirmButton
  },
  data() {
    return {
      filter: {
        name: ''
      },
      users: [],
      roles: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      listLoading: false,
      sels: [], // 列表选中列

      addDialogFormVisible: false,
      editFormVisible: false, // 编辑界面是否显示
      editLoading: false,
      editFormRules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
      },
      userNameReadonly: true,
      // 编辑界面数据
      editForm: {
        id: 0,
        name: '',
        userName: '',
        nickName: '',
        roleIds: []
      },

      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
      },
      // 新增界面数据
      addForm: {
        name: '',
        userName: '',
        nickName: '',
        password: '',
        roleIds: []
      },
      deleteLoading: false
    }
  },
  computed: {
    pageCount() {
      return this.total > 0 && this.pageSize > 0
        ? Math.ceil(this.total / this.pageSize)
        : 1
    }
  },
  watch: {
    currentPage() {
      this.getUsers()
    },
    pageSize() {
      this.getUsers()
    }
  },
  async mounted() {
    this.getUsers()
    const res = await getRoleListPage()
    if (res && res.success) {
      this.roles = res.data.list
    }
  },
  methods: {
    formatCreatedTime: function(row, column, time) {
      return formatTime(time, 'yyyy-MM-dd hh:mm')
    },
    // 获取用户列表
    async getUsers() {
      const para = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        filter: this.filter
      }
      this.listLoading = true
      const res = await getUserListPage(para)
      this.listLoading = false

      if (!res.success) {
        if (res.msg) {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
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
      const loading = this.$loading()
      const res = await getUser({ id: row.id })
      loading.close()
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
    editFormvalidate: function() {
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

      const res = await editUser(para)
      this.editLoading = false

      if (res.success) {
        this.$message({
          message: this.$t('admin.updateOk'),
          type: 'success'
        })
        this.$refs['editForm'].resetFields()
        this.editFormVisible = false
        this.getUsers()
      } else {
        this.$message({
          message: res.msg,
          type: 'error'
        })
      }
    },
    // 新增验证
    addFormvalidate: function() {
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

      const res = await addUser(para)
      this.addLoading = false

      if (res.success) {
        this.$message({
          message: this.$t('admin.addOk'),
          type: 'success'
        })
        this.$refs['addForm'].resetFields()
        this.addFormVisible = false
        this.getUsers()
      } else {
        this.$message({
          message: res.msg,
          type: 'error'
        })
      }
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
      const res = await removeUser(para)
      row._loading = false

      if (!res.success) {
        this.$message({
          message: res.msg,
          type: 'error'
        })
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
      const res = await batchRemoveUser(para.ids)
      this.deleteLoading = false

      if (!res.success) {
        this.$message({
          message: res.msg,
          type: 'error'
        })
        return
      }
      this.$message({
        message: this.$t('admin.batchDeleteOk'),
        type: 'success'
      })

      this.getUsers()
    },
    selsChange: function(sels) {
      this.sels = sels
    }
  }
}
</script>
