<template>
  <div :id="id" class="ad-markdown" />
</template>

<script>
// api https://nhn.github.io/tui.editor/latest/
// 插件 https://github.com/nhn/tui.editor/tree/master/plugins npm install --save @toast-ui/editor-plugin-${pluginName}

import 'codemirror/lib/codemirror.css' // Editor's Dependency Style
import '@toast-ui/editor/dist/toastui-editor.css' // Editor's Style
import Editor from '@toast-ui/editor'
import '@toast-ui/editor/dist/i18n/zh-cn'

import 'tui-color-picker/dist/tui-color-picker.css'
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css'
import colorSyntax from '@toast-ui/editor-plugin-color-syntax'
import tableMergedCell from '@toast-ui/editor-plugin-table-merged-cell'

import 'prismjs/themes/prism.css'
import Prism from 'prismjs'
import 'prismjs/components/prism-csharp'
import 'prismjs/components/prism-aspnet'
import 'prismjs/components/prism-scss'
import 'prismjs/components/prism-json'
// import 'prismjs/components/prism-markup'
// import 'prismjs/components/prism-javascript'
// import 'prismjs/components/prism-css'
// import 'prismjs/components/prism-xml-doc'

import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css'
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight'

import defaultOptions from './default-options'

export default {
  name: 'MyMarkdownEditor',
  props: {
    id: {
      type: String,
      required: false,
      default() {
        return _.uniqueId('my-markdown-editor-')
      }
    },
    value: {
      type: String,
      default: ''
    },
    options: {
      type: Object,
      default() {
        return defaultOptions
      }
    },
    height: {
      type: String,
      required: false,
      default: '400px'
    },
    language: {
      type: String,
      required: false,
      default: 'zh-CN'
    },
    mode: {
      type: String,
      default: 'wysiwyg' // markdown wysiwyg
    }
  },
  data() {
    return {
      editor: null
    }
  },
  computed: {
    editorOptions() {
      const options = _.assign({}, defaultOptions, this.options)
      options.initialEditType = this.mode
      options.height = this.height
      options.language = this.language
      return options
    }
  },
  watch: {
    value(newValue, oldValue) {
      if (newValue !== oldValue && newValue !== this.editor.getMarkdown()) {
        this.editor.setMarkdown(newValue ?? '')
      }
    },
    language(val) {
      this.destroyEditor()
      this.initEditor()
    },
    height(newValue) {
      this.editor.height(newValue)
    },
    mode(newValue) {
      this.editor.changeMode(newValue)
    }
  },
  mounted() {
    this.initEditor()
  },
  destroyed() {
    this.destroyEditor()
  },
  methods: {
    initEditor() {
      this.editor = new Editor({
        el: document.querySelector('#' + this.id),
        ...this.editorOptions,
        plugins: [colorSyntax, tableMergedCell, [codeSyntaxHighlight, { highlighter: Prism }]]
      })
      if (this.value) {
        this.editor.setMarkdown(this.value)
      }
      this.editor.on('change', () => {
        this.$emit('input', this.editor.getMarkdown())
      })
    },
    destroyEditor() {
      if (!this.editor) return
      this.editor.off('change')
      this.editor.destroy()
    },
    setMarkdown(value) {
      this.editor.setMarkdown(value)
    },
    getMarkdown() {
      return this.editor.getMarkdown()
    },
    getEditor() {
      return this.editor
    },
    setHtml(value) {
      this.editor.setHTML(value)
    },
    getHtml() {
      return this.editor.getHTML()
    },
    setImg(src) {
      const isMarkdownMode = this.editor.isMarkdownMode()
      if (isMarkdownMode) {
        this.editor.replaceSelection(`![img](${src})`)
      } else {
        this.editor.exec('addImage', {
          imageUrl: src,
          altText: 'img'
        })
      }
    }
  }
}
</script>

<style scoped>
.ad-markdown :deep(.tui-editor-defaultUI .te-switch-button){
  border-right-width: 0px;
}
.ad-markdown :deep(.tui-editor-defaultUI .te-switch-button.markdown){
  vertical-align: 1px;
}
.ad-markdown :deep(.toastui-editor-ww-container){
  position: absolute;
  width: 100%;
}
</style>
