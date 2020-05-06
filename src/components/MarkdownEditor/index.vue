<template>
  <div :id="id" class="ad-markdown" />
</template>

<script>
// api https://nhn.github.io/tui.editor/latest/
// 插件 https://github.com/nhn/tui.editor/tree/master/plugins npm install --save @toast-ui/editor-plugin-${pluginName}

import 'codemirror/lib/codemirror.css' // Editor's Dependency Style
import '@toast-ui/editor/dist/toastui-editor.css' // Editor's Style
import 'tui-color-picker/dist/tui-color-picker.css'
import 'highlight.js/styles/vs.css'

import Editor from '@toast-ui/editor'
import '@toast-ui/editor/dist/i18n/zh-cn'
import colorSyntax from '@toast-ui/editor-plugin-color-syntax'
import tableMergedCell from '@toast-ui/editor-plugin-table-merged-cell'

import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight'
// all
// import hljs from 'highlight.js'
// part
import hljs from 'highlight.js/lib/highlight'
import cs from 'highlight.js/lib/languages/cs'
import xml from 'highlight.js/lib/languages/xml'
import json from 'highlight.js/lib/languages/json'
import html from 'highlight.js/lib/languages/htmlbars'
import css from 'highlight.js/lib/languages/css'
import scss from 'highlight.js/lib/languages/scss'
import javascript from 'highlight.js/lib/languages/javascript'
hljs.registerLanguage('net', cs)
hljs.registerLanguage('html', html)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('css', css)
hljs.registerLanguage('scss', scss)
hljs.registerLanguage('json', json)
hljs.registerLanguage('xml', xml)
// import typescript from 'highlight.js/lib/languages/typescript'
// hljs.registerLanguage('typescript', typescript)

import defaultOptions from './default-options'

export default {
  name: 'MarkdownEditor',
  props: {
    id: {
      type: String,
      required: false,
      default() {
        return _.uniqueId('markdown-editor-')
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
      default: 'wysiwyg'
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
        this.editor.setMarkdown(newValue)
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
        el: document.getElementById(this.id),
        plugins: [colorSyntax, tableMergedCell, [codeSyntaxHighlight, { hljs }]],
        ...this.editorOptions
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
      this.editor.remove()
    },
    setMarkdown(value) {
      this.editor.setMarkdown(value)
    },
    getMarkdown() {
      return this.editor.getMarkdown()
    },
    setHtml(value) {
      this.editor.setHtml(value)
    },
    getHtml() {
      return this.editor.getHtml()
    },
    setImg(src) {
      const isMarkdownMode = this.editor.isMarkdownMode()
      if (isMarkdownMode) {
        this.editor.getCodeMirror().replaceSelection(`![img](${src})`)
      } else {
        const range = this.editor.getRange()
        if (range && range.startContainer && (range.startContainer.className.indexOf('el-main') > -1)) {
          return
        }
        const img = document.createElement('img')
        img.src = src
        img.alt = ''
        range.insertNode(img)
      }
    }
  }
}
</script>

<style scoped>
.ad-markdown >>> .tui-editor-defaultUI .te-switch-button{
  border-right-width: 0px;
}
.ad-markdown >>> .tui-editor-defaultUI .te-switch-button.markdown{
  vertical-align: 1px;
}
</style>
