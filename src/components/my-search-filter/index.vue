<template>
  <el-tree
    :data="[dataTree]"
    :props="defaultProps"
    :expand-on-click-node="false"
    :default-expand-all="true"
    :indent="16"
    class="my-search-filter"
  >
    <template v-slot="{ node, data }">
      <template v-if="data.logic && !data.field">
        <span>
          <el-radio-group v-model="data.logic">
            <el-radio label="And">并且</el-radio>
            <el-radio label="Or">或者</el-radio>
          </el-radio-group>
          <el-button type="text" icon="el-icon-plus" @click="onAddGroup(data)">分组</el-button>
          <el-button type="text" icon="el-icon-plus" @click="onAddCondition(data)">条件</el-button>
          <el-button v-if="!data.root" icon="el-icon-minus" style="margin-left:8px;" @click="onDelete(node, data)" />
        </span>
      </template>
      <template v-else>
        <span>
          <el-select v-model="data.field" style="width:100px;" @change="(value)=>onChangeField(value, data)">
            <el-option
              v-for="(o, index) in fields"
              :key="index"
              :label="o.label"
              :value="o.value"
            />
          </el-select>
          <el-select v-model="data.operator" style="width:110px;margin-left:5px;">
            <el-option
              v-for="(op, index) in getOperators(data.type)"
              :key="index"
              :label="op.label"
              :value="op.value"
            />
          </el-select>
          <el-input
            v-if="!data.type || data.type === 'string'"
            v-model="data.value"
            style="width:150px;margin-left:5px;"
          />
          <el-date-picker
            v-if="data.type === 'date'"
            v-model="data.value"
            :type="data.config&&data.config.type?data.config.type:'date'"
            style="width:180px;margin-left:5px;"
          />
          <el-input-number
            v-if="data.type === 'number'"
            v-model="data.value"
            controls-position="right"
            style="width:120px;margin-left:5px;"
          />
          <el-switch v-if="data.type === 'bool'" v-model="data.value" style="margin-left:5px;" />
          <el-button icon="el-icon-minus" style="margin-left:5px;" @click="onDelete(node, data)" />
        </span>
      </template>
    </template>
  </el-tree>
</template>

<script>
export default {
  name: 'MySearchFilter',
  props: {
    // {field: '', label: '', value: '', type: 'string', config: {}}
    // type string:字符串 date:日期 number:数字 bool:布尔
    // config 控件配置
    fields: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    const operators = {
      string: [
        { label: '等于', value: 'Equals' },
        { label: '不等于', value: 'NotEqual' },
        { label: '包含', value: 'Contains' },
        { label: '不包含', value: 'NotContains' },
        { label: '开始以', value: 'StartsWith' },
        { label: '开始不是以', value: 'NotStartsWith' },
        { label: '结束以', value: 'EndsWith' },
        { label: '结束不是以', value: 'NotEndsWith' }
      ],
      date: [
        { label: '等于', value: 'Equals' },
        { label: '不等于', value: 'NotEqual' },
        { label: '小于', value: 'LessThan' },
        { label: '小于等于', value: 'LessThanOrEqual' },
        { label: '大于', value: 'GreaterThan' },
        { label: '大于等于', value: 'GreaterThanOrEqual' }
      ],
      number: [
        { label: '等于', value: 'Equals' },
        { label: '不等于', value: 'NotEqual' },
        { label: '小于', value: 'LessThan' },
        { label: '小于等于', value: 'LessThanOrEqual' },
        { label: '大于', value: 'GreaterThan' },
        { label: '大于等于', value: 'GreaterThanOrEqual' }
      ],
      bool: [
        { label: '等于', value: 'Equals' },
        { label: '不等于', value: 'NotEqual' }
      ]
    }
    const firstField = this.fields[0]
    return {
      dataTree: {
        root: true,
        logic: 'And',
        filters: []
      },
      defaultProps: {
        label: '',
        children: ['filters']
      },
      operators: operators,
      firstField: firstField
    }
  },
  computed: {
  },
  watch: {

  },
  mounted() {

  },
  methods: {
    getOperators(type) {
      const ops = this.operators[type || 'string']
      return ops && ops.length > 0 ? ops : ops['string']
    },
    onChangeField(value, data) {
      const field = this.fields.find(a => a.value === value)
      data.value = ''
      data.label = field.label
      data.type = field.type ? field.type : ''
      const firstOprator = this.getOperators(data.type)[0]
      data.operator = firstOprator.value
    },
    onAddGroup(data) {
      const newFilter = {
        logic: 'And'
      }
      if (!data.filters) {
        this.$set(data, 'filters', [])
      }
      data.filters.push(newFilter)
    },
    onAddCondition(data) {
      const firstOprator = this.getOperators(data.type)[0]
      const newFilter = {
        field: this.firstField.value,
        label: this.firstField.label,
        operator: firstOprator.value,
        value: '',
        filters: []
      }
      if (!data.filters) {
        this.$set(data, 'filters', [])
      }
      const index = data.filters.findIndex(a => a.logic && !a.field)
      if (index >= 0) {
        data.filters.splice(index, 0, newFilter)
      } else {
        data.filters.push(newFilter)
      }
    },
    onDelete(node, data) {
      const parent = node.parent
      const filters = parent.data.filters || parent.data
      const index = filters.findIndex(d => d === data)
      filters.splice(index, 1)
    },
    reset() {
      this.dataTree.filters = []
    },
    getDynamicFilter() {
      return _.cloneDeep(this.dataTree)
    }
  }
}
</script>

<style lang="scss" scoped>
 .my-search-filter ::v-deep{
  .el-tree-node__content{
    height:30px;
    margin-bottom: 5px;
  }
  .el-radio{
    margin-right: 10px;
  }
  .el-radio__label{
    padding-left: 5px;
  }
  .el-button [class*=el-icon-]+span{
    margin-left:2px;
  }
  .el-input-number .el-input__inner{
    text-align: left;
  }
}
</style>
