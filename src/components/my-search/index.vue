<template>
  <el-input
    v-model="filter.value"
    placeholder="请输入"
    class="my-search"
    clearable
    @keyup.enter.native="onSearch"
  >
    <el-select
      slot="prepend"
      v-model="filter.field"
      placeholder="请选择"
      style="width:100px;"
      @change="onChange"
    >
      <el-option
        v-for="(o, index) in newFields"
        :key="index"
        :label="o.label"
        :value="o.value"
      />
    </el-select>
    <template #append>
      <el-button icon="el-icon-search" @click="onSearch" />
    </template>
  </el-input>
</template>

<script>
/**
 * 查询组件
 * 使用说明
  import MySearch from '@/components/my-search'
  components: { MySearch }
  fields: [
    { value: 'userName', label: '用户名', default: true },
    { value: 'nickName', label: '昵称', type: 'string' },
    { value: 'createdTime', label: '创建时间', type: 'date', config: { type: 'date' }}
  ],
  <my-search :fields="fields" @click="onSearch" />
*/
export default {
  name: 'MySearch',
  props: {
    fields: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    const newFields = []
    this.fields.forEach(a => {
      if (!a.type || a.type === 'string') {
        newFields.push(a)
      }
    })

    let fieldValue = ''
    if (newFields.length > 0) {
      const field = newFields.find(a => a.default === true)
      if (field) {
        fieldValue = field.value
      } else {
        fieldValue = newFields[0].value
      }
    }
    return {
      newFields: newFields,
      filter: {
        field: fieldValue,
        operator: 'Equal',
        value: ''
      }
    }
  },
  computed: {
  },
  watch: {

  },
  mounted() {

  },
  methods: {
    onChange(value) {
      // const field = this.fields.find(a => a.value === value)
      this.filter.value = ''
    },
    // 查询
    onSearch() {
      const dynamicFilter = this.filter.value !== '' ? { ...this.filter } : null
      this.$emit('click', dynamicFilter)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .my-search-window{
  .el-dialog__body{
    padding:10px;
  }
}
</style>
