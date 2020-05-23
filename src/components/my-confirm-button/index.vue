<!--
一般提交
<my-confirm-button @click="syncApi" :icon="'el-icon-refresh'" style="margin:0px;">
    <template #content>
      <p>确定要同步Api吗？</p>
    </template>
    同步Api
</my-confirm-button>

行删除
<my-confirm-button type="delete" @click="handleDel($index, row)" :loading="row._loading"/>

表单验证
<my-confirm-button type="submit" @click="editSubmit" :validate="editFormvalidate" :loading="editLoading"/>

设置位置
<my-confirm-button @click="submit" :validate="editFormvalidate" :placement="'top-start'" :loading="editLoading">
    <template #content>
      <p>确定要更新基本信息吗？</p>
    </template>
    更新基本信息
</my-confirm-button>
-->
<template>
  <span style="margin-left:10px;line-height: 1;display: inline-block;">
    <el-popover
      ref="popover"
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
          <el-button type="text" @click="visible = false">取消</el-button>
          <el-button type="primary" @click="sure">确定</el-button>
        </div>
      </slot>
    </el-popover>
    <el-button
      v-popover:popover
      :icon="icon"
      :type="buttonType"
      :loading="loading"
      :disabled="disabled"
      _button
      @click="valid"
    >
      <slot>{{ buttonText }}</slot>
    </el-button>
  </span>
</template>

<script>
export default {
  name: 'MyConfirmButton',
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
      buttonType: this.type === 'delete' ? 'danger' : (this.type === 'submit' ? 'primary' : this.type),
      buttonText: this.type === 'delete' ? '删除' : (this.type === 'submit' ? '提交' : ''),
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
