<template>
  <container>
    <template #header>
      <el-form class="ad-form-query" :inline="true" :model="filter" @submit.native.prevent>
        <el-form-item>
          <el-input
            v-model="filter.createdUserName"
            placeholder="登录账号"
            clearable
            @keyup.enter.native="getList"
          >
            <template #prefix>
              <i class="el-input__icon el-icon-search" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList">查询</el-button>
        </el-form-item>
      </el-form>
    </template>

    <el-table
      v-loading="listLoading"
      :data="list"
      highlight-current-row
      height="'100%'"
      style="width: 100%;height:100%;"
    >
      <el-table-column prop="id" label="编号" width="80" />
      <el-table-column prop="createdUserName" label="操作账号" width="100">
        <template v-slot="{row}">
          {{ row.createdUserName }}<br>{{ row.nickName }}
        </template>
      </el-table-column>
      <el-table-column prop="ip" label="IP地址" width="130" />
      <el-table-column prop="browser" label="浏览器" width="100" />
      <el-table-column prop="os" label="操作系统" width="100" />
      <!-- <el-table-column prop="elapsedMilliseconds" width="70">
            <template  #header>
              耗时<br>毫秒
            </template>
          </el-table-column> -->
      <el-table-column prop="elapsedMilliseconds" label="耗时(毫秒)" width="100" />
      <el-table-column prop="status" label="登录状态" width="80">
        <template v-slot="{row}">
          <el-tag
            :type="row.status ? 'success' : 'danger'"
            disable-transitions
          >{{ row.status ? '成功' : '失败' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="msg" label="登录消息" width="" />
      <el-table-column prop="createdTime" label="登录时间" :formatter="formatCreatedTime" width />
    </el-table>

    <template #footer>
      <pagination
        ref="pager"
        :page.sync="pager.currentPage"
        :size.sync="pager.pageSize"
        :total="pager.total"
        @get-page="getList"
      />
    </template>
  </container>
</template>

<script>
import { formatTime } from '@/utils'
import { getLoginLogPage } from '@/api/admin/login-log'
import Container from '@/components/Container'
import Pagination from '@/components/Pagination'

export default {
  name: 'LoginLog',
  components: { Container, Pagination },
  data() {
    return {
      filter: {
        name: ''
      },
      list: [],
      pager: {},
      listLoading: false
    }
  },
  mounted() {
    this.pager = this.$refs.pager.getPager()
    this.getList()
  },
  methods: {
    formatCreatedTime: function(row, column, time) {
      return formatTime(time, 'yyyy-MM-dd hh:mm')
    },
    // 获取列表
    async getList() {
      const para = {
        currentPage: this.pager.currentPage,
        pageSize: this.pager.pageSize,
        filter: this.filter
      }
      this.listLoading = true
      const res = await getLoginLogPage(para)
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

      this.pager.total = res.data.total
      this.list = res.data.list
    }
  }
}
</script>

<style scoped>
.a{
      display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    /* box-sizing: border-box; */
    flex-direction: column;
}
.b{
      -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    flex-grow: 1;
}
</style>
