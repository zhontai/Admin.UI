<template>
  <section>
    <el-row>
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" @submit.native.prevent>
          <el-form-item>
            <el-button type="primary" @click="getLogs">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-table v-loading="listLoading" :data="tableData" style="width: 100%">
      <el-table-column type="expand">
        <template #default="{row}">
          <div>{{ row.datetime }}</div>
          <div
            style="white-space: normal;word-break: break-all;line-height: 30px;"
            v-html="row.content"
          />
        </template>
      </el-table-column>
      <el-table-column label="Datetime" prop="datetime" width="220" />
      <el-table-column label="Content">
        <template #default="{row}">
          <div
            :class="row.logColor"
            v-html="row.content ? scope.row.content.substring(0, 100) : ''"
          />
        </template>
      </el-table-column>
      <!--<el-table-column-->
      <!--label="IP"-->
      <!--prop="ip">-->
      <!--</el-table-column>-->
    </el-table>
  </section>
</template>

<script>
import { getLogs } from '@/api'

export default {
  name: 'Log',
  data() {
    return {
      listLoading: true,
      tableData: []
    }
  },
  mounted() {
    this.getLog()
  },
  beforeDestroy() {
    window.clearInterval(this.t)
    this.connection.stop()
  },
  methods: {
    async getLog() {
      const para = {
        page: this.page,
        key: this.filters.LinkUrl
      }
      this.listLoading = true
      await getLogs(para)
    },
    getLogs: function() {
      this.listLoading = true
      this.connection.invoke('GetLatestCount', 1).catch(function(err) {
        return console.error(err)
      })
    }
  }
}
</script>
