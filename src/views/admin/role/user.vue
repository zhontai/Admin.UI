<template>
  <my-container>
    <!--顶部操作-->
    <template #header>
      <el-form class="ad-form-query" :inline="true" :model="filter" @submit.native.prevent>
        <el-form-item>
          <my-search v-model="filter.name" :placeholder="'姓名'" @click="onSearch" />
        </el-form-item>
        <el-form-item v-if="checkPermission(['api:admin:role:add-role-user'])">
          <el-button type="primary" @click="onAdd">添加员工</el-button>
        </el-form-item>
        <el-form-item v-if="checkPermission(['api:admin:role:remove-role-user'])">
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
              <p>确定要移除吗？</p>
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
        <el-empty :image-size="100" description="暂无员工" />
      </template>
      <el-table-column type="selection" width="50" />
      <el-table-column prop="name" label="姓名" width />
    </el-table>

    <!--选择用户-->
    <my-select-user
      title="添加员工"
      :visible.sync="selectUserVisible"
      :sure-loading.sync="sureLoading"
      @click="onSelectUsers"
    />
  </my-container>
</template>

<script>
import roleApi from '@/api/admin/role'
import MyConfirmButton from '@/components/my-confirm-button'
import MySearch from '@/components/my-search'
import MySelectUser from '@/components/my-select-window/user'

/**
 * 角色用户
 */
export default {
  name: 'MyRoleUser',
  _sync: {
    disabled: true
  },
  components: { MyConfirmButton, MySearch, MySelectUser },
  props: {
    roleId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      filter: {
        name: ''
      },
      users: [],
      total: 0,
      sels: [], // 列表选中列
      listLoading: false,
      deleteLoading: false,
      selectUserVisible: false,
      sureLoading: false
    }
  },
  watch: {
    roleId: {
      immediate: true,
      handler(val) {
        if (val > 0) {
          this.$nextTick(() => {
            this.getUsers()
          })
        }
      }
    }
  },
  methods: {
    onRoleChange(row) {
      if (row?.id > 0) {
        this.orgId = row.id
        this.getUsers()
      }
    },
    // 查询
    onSearch() {
      this.getUsers()
    },

    // 获取用户列表
    async getUsers() {
      this.listLoading = true
      const res = await roleApi.getRoleUserList({
        roleId: this.roleId,
        name: this.filter.name
      })
      this.listLoading = false

      if (!res?.success) {
        return
      }

      const data = res.data
      data.forEach(d => {
        d._loading = false
      })
      this.users = data
    },
    onAdd() {
      this.selectUserVisible = true
    },
    // 批量删除验证
    batchDeleteValidate() {
      const isValid = true

      return isValid
    },
    // 批量删除
    async onBatchDelete() {
      const userIds = this.sels?.map(a => a.id)
      const para = { userIds, roleId: this.roleId }
      this.deleteLoading = true
      const res = await roleApi.removeRoleUser(para)
      this.deleteLoading = false

      if (!res?.success) {
        return
      }
      this.$message({
        message: this.$t('admin.removeOk'),
        type: 'success'
      })

      this.getUsers()
    },
    // 选择
    onSelsChange(sels) {
      this.sels = sels
    },
    // 选择用户
    async onSelectUsers(userList) {
      if (!(userList?.length > 0)) {
        this.selectUserVisible = false
        return
      }
      const userIds = userList?.map(a => a.id)
      const para = { userIds, roleId: this.roleId }
      this.sureLoading = true
      const res = await roleApi.addRoleUser(para)
      this.sureLoading = false

      if (!res?.success) {
        return
      }

      this.selectUserVisible = false
      this.getUsers()
      this.$message({
        message: this.$t('admin.saveOk'),
        type: 'success'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.my-search :deep(.el-input-group__prepend) {
  background-color: #fff;
}
:deep() {
    .el-table::before{
      height: 0px
    }
}
</style>
