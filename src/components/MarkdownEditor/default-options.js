export default {
  previewStyle: 'vertical', // tab, vertical
  initialEditType: 'wysiwyg', // markdown, wysiwyg
  height: '400px', // 300px | auto
  minHeight: '300px',
  language: 'zh-CN',
  useDefaultHTMLSanitizer: true,
  useCommandShortcut: true,
  usageStatistics: true,
  toolbarItems: [
    'heading', 'bold', 'italic', 'strike', 'divider',
    'hr', 'quote', 'divider',
    'ul', 'ol', 'task', 'indent', 'outdent', 'divider',
    'table', 'image', 'link', 'divider',
    'code', 'codeblock'
  ],
  hideModeSwitch: false,
  customConvertor: null
}
