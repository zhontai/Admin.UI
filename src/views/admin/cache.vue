<template>
  <section style="padding:10px;">
    <!--列表-->
    <el-table
      v-loading="listLoading"
      :data="caches"
      highlight-current-row
      style="width: 100%;height:100%;"
    >
      <el-table-column type="index" width="80" label="#" />
      <el-table-column prop="name" label="键名" width />
      <el-table-column prop="value" label="键值" width />
      <el-table-column prop="description" label="缓存名" width />
      <el-table-column label="操作" width="180">
        <template v-slot="{ $index, row }">
          <my-confirm-button
            type="delete"
            :loading="row._loading"
            :icon="'el-icon-delete'"
            style="margin-left:0px;"
            @click="onClearCache($index, row)"
          >
            <template #content>
              <p>确定要清除该缓存吗？</p>
            </template>
            清除
          </my-confirm-button>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
import { getCacheList, clearCache } from '@/api/admin/cache'
import MyConfirmButton from '@/components/my-confirm-button'
export default {
  name: 'Cache',
  components: {
    MyConfirmButton
  },
  data() {
    return {
      filter: {
        name: ''
      },
      caches: [],
      listLoading: false
    }
  },
  mounted() {
    this.getCaches()
  },
  methods: {
    // 获取缓存列表
    async getCaches() {
      this.listLoading = true
      const res = await getCacheList()
      this.listLoading = false

      if (!res?.success) {
        return
      }

      const data = res.data
      data.forEach(d => {
        d._loading = false
      })
      this.caches = data
    },
    // 清除缓存
    async onClearCache(index, row) {
      row._loading = true
      const para = { cacheKey: row.value }
      const res = await clearCache(para)
      row._loading = false

      if (!res?.success) {
        return
      }
      this.$message({
        message: '清除缓存成功',
        type: 'success'
      })
    }
  }
}
</script>
