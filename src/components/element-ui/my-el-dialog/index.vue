<template>
  <transition
    name="dialog-fade"
    @after-enter="afterEnter"
    @after-leave="afterLeave"
  >
    <div
      v-show="visible"
      class="el-dialog__wrapper"
      @click.self="handleWrapperClick"
    >
      <div
        :key="key"
        ref="dialog"
        role="dialog"
        aria-modal="true"
        :aria-label="title || 'dialog'"
        :class="['el-dialog', { 'is-fullscreen': fullscreen, 'el-dialog--center': center }, customClass]"
        :style="style"
      >
        <my-container   
          header-style="padding:0px;" 
          footer-style="padding:0px;"
        >
          <template #header>
            <div class="el-dialog__header" @dblclick="handleMaximize">
              <slot name="title">
                <span class="el-dialog__title">{{ title }}</span>
              </slot>
              <div class="el-dialog__headertool">
                <i
                  v-if="showMaximize"
                  type="button"
                  aria-label="Maximize"
                  @click="handleMaximize"
                  :class="['el-dialog__close', 'el-icon', fullscreen ? 'el-icon-copy-document' : 'el-icon-full-screen']" 
                />
                <i
                  v-if="showClose"
                  type="button"
                  aria-label="Close"
                  @click="handleClose"
                  class="el-dialog__close el-icon el-icon-close" 
                />
              </div>
            </div>
          </template>
          <div v-if="rendered" class="el-dialog__body"><slot /></div>
          <template #footer>
            <div v-if="$slots.footer" class="el-dialog__footer">
              <slot name="footer" />
            </div>
          </template>
        </my-container>
      </div>
    </div>
  </transition>
</template>

<script>
import Popup from 'element-ui/src/utils/popup'
import Migrating from 'element-ui/src/mixins/migrating'
import emitter from 'element-ui/src/mixins/emitter'

export default {
  name: 'MyElDialog',
  mixins: [Popup, emitter, Migrating],

  props: {
    title: {
      type: String,
      default: ''
    },

    modal: {
      type: Boolean,
      default: true
    },

    modalAppendToBody: {
      type: Boolean,
      default: true
    },

    appendToBody: {
      type: Boolean,
      default: false
    },

    lockScroll: {
      type: Boolean,
      default: true
    },

    closeOnClickModal: {
      type: Boolean,
      default: true
    },

    closeOnPressEscape: {
      type: Boolean,
      default: true
    },

    showMaximize: {
      type: Boolean,
      default: true
    },

    showClose: {
      type: Boolean,
      default: true
    },

    width: {
      type: String,
      default: null
    },

    fullscreen: Boolean,

    customClass: {
      type: String,
      default: ''
    },

    top: {
      type: String,
      default: '15vh'
    },
    beforeClose: {
      type: Function,
      default: null
    },
    center: {
      type: Boolean,
      default: false
    },

    destroyOnClose: Boolean
  },

  data() {
    return {
      closed: false,
      key: 0,
      cacheStyle: {
        left: null,
        top: null,
        marginLeft: null,
        marginTop: this.top,
        width: this.width,
        height: null
      }
    }
  },

  computed: {
    style() {
      let style = {}
      if (!this.fullscreen) {
        style = { ...this.cacheStyle }
      } else {
        const dialogStyle = this.$refs.dialog.style
        this.cacheStyle.left = dialogStyle.left
        this.cacheStyle.top = dialogStyle.top
        this.cacheStyle.marginLeft = dialogStyle.marginLeft
        this.cacheStyle.marginTop = dialogStyle.marginTop
        this.cacheStyle.width = dialogStyle.width
        this.cacheStyle.height = dialogStyle.height
      }
      return style
    }
  },

  watch: {
    visible(val) {
      if (val) {
        this.closed = false
        this.$emit('open')
        this.$el.addEventListener('scroll', this.updatePopper)
        this.$nextTick(() => {
          this.$refs.dialog.scrollTop = 0
        })
        if (this.appendToBody) {
          document.body.appendChild(this.$el)
        }
      } else {
        this.$el.removeEventListener('scroll', this.updatePopper)
        if (!this.closed) this.$emit('close')
        if (this.destroyOnClose) {
          this.$nextTick(() => {
            this.key++
          })
        }
      }
    }
  },

  mounted() {
    if (this.visible) {
      this.rendered = true
      this.open()
      if (this.appendToBody) {
        document.body.appendChild(this.$el)
      }
    }
  },

  destroyed() {
    // if appendToBody is true, remove DOM node after destroy
    if (this.appendToBody && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  },

  methods: {
    getMigratingConfig() {
      return {
        props: {
          'size': 'size is removed.'
        }
      }
    },
    handleWrapperClick() {
      if (!this.closeOnClickModal) return
      this.handleClose()
    },
    handleMaximize(){
      this.$emit('update:fullscreen', !this.fullscreen)
    },
    handleClose() {
      if (typeof this.beforeClose === 'function') {
        this.beforeClose(this.hide)
      } else {
        this.hide()
      }
    },
    hide(cancel) {
      if (cancel !== false) {
        this.$emit('update:visible', false)
        this.$emit('close')
        this.closed = true
      }
    },
    updatePopper() {
      this.broadcast('ElSelectDropdown', 'updatePopper')
      this.broadcast('ElDropdownMenu', 'updatePopper')
    },
    afterEnter() {
      this.$emit('opened')
    },
    afterLeave() {
      this.$emit('closed')
    }
  }
}
</script>
