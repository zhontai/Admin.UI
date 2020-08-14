<template>
  <my-container>
    <template #header>
      <el-form class="ad-form-query" :inline="true" :model="filter" @submit.native.prevent>
        <el-form-item>
          <el-input
            v-model="filter.createdUserName"
            placeholder="操作账号"
            clearable
            @keyup.enter.native="onSearch"
          >
            <template #prefix>
              <i class="el-input__icon el-icon-search" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
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
      <el-table-column prop="apiLabel" label="操作名称" width="" />
      <el-table-column prop="apiPath" label="操作接口" width="" />
      <!-- <el-table-column prop="browser" label="浏览器" width="100" />
      <el-table-column prop="os" label="操作系统" width="100" /> -->
      <!-- <el-table-column prop="elapsedMilliseconds" width="70">
        <template #header>
          耗时<br>毫秒
        </template>
      </el-table-column> -->
      <el-table-column prop="elapsedMilliseconds" label="耗时(毫秒)" width="100" />
      <el-table-column prop="status" label="操作状态" width="80">
        <template v-slot="{row}">
          <el-tag
            :type="row.status ? 'success' : 'danger'"
            disable-transitions
          >{{ row.status ? '成功' : '失败' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="msg" label="操作消息" />
      <el-table-column prop="createdTime" label="操作时间" :formatter="formatCreatedTime" width />
    </el-table>

    <template #footer>
      <my-pagination
        ref="pager"
        :total="total"
        @get-page="getList"
      />
    </template>
  </my-container>
</template>

<script>
import { formatTime } from '@/utils'
import { getOprationLogPage } from '@/api/admin/opration-log'
import MyContainer from '@/components/my-container'

export default {
  name: 'OprationLog',
  components: { MyContainer },
  data() {
    return {
      filter: {
        name: ''
      },
      list: [],
      total: 0,
      listLoading: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    formatCreatedTime: function(row, column, time) {
      return formatTime(time, 'YYYY-MM-DD HH:mm')
    },
    onSearch() {
      this.$refs.pager.setPage(1)
      this.getList()
    },
    // 获取列表
    async getList() {
      const pager = this.$refs.pager.getPager()
      const para = {
        ...pager,
        filter: this.filter
      }
      this.listLoading = true
      const res = await getOprationLogPage(para)
      this.listLoading = false

      if (!res?.success) {
        return
      }

      this.total = res.data.total
      this.list = res.data.list
    }
  }
}
</script>
