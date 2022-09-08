<template>
  <my-container v-loading="pageLoading">
    <!--顶部操作-->
    <template #header>
      <el-form class="ad-form-query" :inline="true" :model="filter" @submit.native.prevent>
        <el-form-item>
          <my-search v-model="filter.name" :placeholder="'姓名'" @click="onSearch" />
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
        <el-empty :image-size="100" />
      </template>
      <el-table-column type="selection" width="50" />
      <el-table-column prop="name" label="姓名" width />
    </el-table>
  </my-container>
</template>

<script>
import { formatTime } from '@/utils'
import userApi from '@/api/admin/user'
import MyConfirmButton from '@/components/my-confirm-button'
import MySearch from '@/components/my-search'

export default {
  name: 'MyUser',
  _sync: {
    disabled: true
  },
  components: { MyConfirmButton, MySearch },
  data() {
    return {
      filter: {
        name: ''
      },
      users: [],
      total: 0,
      sels: [], // 列表选中列
      listLoading: false,
      pageLoading: false,
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
    onSearch() {
      this.getUsers()
    },

    // 获取用户列表
    async getUsers() {
      this.listLoading = true
      const res = await userApi.getList(this.filter)
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
:deep() {
    .el-table::before{
      height: 0px
    }
}
</style>
