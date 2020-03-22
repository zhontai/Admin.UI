<!--
一般提交
<confirm-button @click="syncApi" :icon="'el-icon-refresh'" style="margin:0px;">
    <p slot="content">确定要同步Api吗？</p>
    同步Api
</confirm-button>

行删除
<confirm-button type="delete" @click="handleDel($index, row)" :loading="row._loading"/>

表单验证
<confirm-button @click="editSubmit" :validate="editFormvalidate" :loading="editLoading"/>

设置位置
<confirm-button @click="submit" :validate="editFormvalidate" :placement="'top-start'" :loading="editLoading">
    <p slot="content">确定要更新基本信息吗？</p>
    更新基本信息
</confirm-button>
-->
<template>
  <span style="margin-left:10px;line-height: 1;display: inline-block;">
    <el-popover
      v-model="visible"
      :placement="placement"
      width="160"
      :disabled="disabledPopover"
      :trigger="'click'"
      :title="title"
      :content="content"
      @hide="hide"
    >
      <slot name="content">
        <p>{{ type === 'delete' ? '确定要删除该记录吗？' : '确定提交吗？' }}</p>
      </slot>
      <slot name="footer">
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="visible = false">取消</el-button>
          <el-button type="primary" size="mini" @click="sure">确定</el-button>
        </div>
      </slot>
      <el-button
        slot="reference"
        :icon="icon"
        :type="buttonType"
        :size="size"
        :loading="loading"
        :disabled="disabled"
        _button
        @click="valid"
      >
        <slot>{{ type === 'delete' ? '删除' : '提交' }}</slot>
      </el-button>
    </el-popover>
  </span>
</template>

<script>
export default {
  name: 'ConfirmButton',
  props: {
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placement: {
      type: String,
      default: 'top-end'
    },
    type: {
      type: String,
      default: 'primary' // 提交 primary 删除 delete danger
    },
    icon: {
      type: String,
      default: ''
    },
    validate: {
      type: Function,
      default: null
    },
    validateData: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      visible: false,
      disabledPopover: this.validate !== null,
      size: this.type === 'delete' ? 'small' : '',
      buttonType: this.type === 'delete' ? 'danger' : this.type,
      style: ''
    }
  },
  computed: {},
  watch: {},
  mounted: function() {},
  methods: {
    hide() {
      if (this.validate) {
        this.disabledPopover = true
      }
    },
    valid() {
      if (this.validate) {
        const isValid = this.validate(this.validateData)
        if (isValid) {
          this.disabledPopover = false
        }
      }
    },
    sure() {
      this.visible = false
      this.$emit('click')
    }
  }
}
</script>
