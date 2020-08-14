<template>
  <section v-loading="pageLoading" style="height:100%;">
    <el-container style="height:100%;">
      <el-container>
        <el-header class="header" height="auto" style="padding:5px 10px 5px 10px;text-align:right;">
          <span style="float:left;font-size:14px;line-height: 28px;">{{ document.form.label }}</span>
          <el-button v-if="checkPermission(['api:admin:document:updatecontent'])" type="primary" :disabled="!hasDocument" :loading="document.loadingSave" @click="save(false)">保存文档</el-button>
        </el-header>
        <el-main class="main" style="padding:0px 5px 5px 5px;">
          <div style="height:calc(100% - 2px);">
            <my-markdown-editor ref="markdownEditor" v-model="document.form.content" :height="'100%'" />
          </div>
        </el-main>
      </el-container>
      <el-aside width="300px" style="padding:0px;border-left: 1px solid #e6e6e6;">
        <el-container style="height:100%;overflow:hidden;">
          <el-header class="header" height="auto" style="padding:5px 10px 6px 10px;border-bottom: 1px solid #e6e6e6;text-align:right;">
            <div v-show="isDocTab">
              <el-button-group>
                <el-button type="primary" @click="getDocuments">刷新</el-button>
                <el-dropdown v-if="checkPermission(['api:admin:document:addgroup','api:admin:document:addmenu'])">
                  <el-button type="primary">
                    新增<i class="el-icon-arrow-down el-icon--right" />
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu :visible-arrow="false" style="margin-top: 2px;">
                      <el-dropdown-item v-if="checkPermission(['api:admin:document:addgroup'])" icon="el-icon-folder" @click.native="onOpenAddGroup">新增分组</el-dropdown-item>
                      <el-dropdown-item v-if="checkPermission(['api:admin:document:addmenu'])" icon="el-icon-tickets" @click.native="onOpenAddMenu">新增菜单</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </el-button-group>
            </div>
            <div v-show="isImgTab">
              <el-button-group>
                <el-button type="primary" :disabled="!hasDocument" @click="getDocumentImages">刷新</el-button>
                <el-upload
                  v-if="hasDocument && checkPermission(['api:admin:document:uploadimage'])"
                  ref="upload"
                  action="/api/admin/document/uploadimage"
                  multiple
                  :headers="token"
                  :data="{id:document.form.id}"
                  :show-file-list="false"
                  :before-upload="onBeforeUpload"
                  :on-success="onUploadSuccess"
                  :on-error="onUploadError"
                  style="display: inline-block;"
                >
                  <el-button type="primary">
                    <i class="el-icon-upload el-icon--left" />上传图片
                  </el-button>
                </el-upload>
                <el-button v-else-if="checkPermission(['api:admin:document:uploadimage'])" type="primary" :disabled="!hasDocument">
                  <i class="el-icon-upload el-icon--left" />上传图片
                </el-button>
              </el-button-group>
            </div>
          </el-header>
          <el-main ref="tabContainer" class="main" :style="isImgTab?'padding:5px 10px 10px 10px':'padding:0px 5px 5px 5px;'">
            <div v-show="isDocTab" style="height:100%;">
              <el-table
                ref="treeTable"
                v-loading="listLoading"
                highlight-current-row
                :data="documentTree"
                row-key="id"
                current-row-key="id"
                :show-header="false"
                :default-expand-all="false"
                :expand-row-keys="expandRowKeys"
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
                style="width: 100%;"
                @current-change="onCurrentChange"
              >
                <el-table-column label="文档" width>
                  <template v-slot="{row}">
                    <i :class="row.icon" />
                    {{ row.label }}
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="checkPermission([
                    'api:admin:document:updategroup',
                    'api:admin:document:updatemenu',
                    'api:admin:document:softdelete'])"
                  label="操作"
                  align="right"
                >
                  <template v-slot="{ $index, row }">
                    <el-button
                      v-if="(row.type === 1 && checkPermission(['api:admin:document:updategroup']))
                        || (row.type === 2 && checkPermission(['api:admin:document:updatemenu']))"
                      type="text"
                      icon="el-icon-edit"
                      @click="onEdit($index, row)"
                    />
                    <my-confirm-button
                      v-if="checkPermission(['api:admin:document:softdelete'])"
                      type="text"
                      :loading="row._loading"
                      :icon="'el-icon-delete'"
                      @click="onDelete($index, row)"
                    >
                      <template #content>
                        <p>确定要删除吗？</p>
                      </template>
                    </my-confirm-button>
                  </template>
                </el-table-column>
                <template #empty>
                  暂无文档
                </template>
              </el-table>
            </div>
            <div v-show="isImgTab" v-loading="document.loadingImageList" style="height:100%;">
              <el-row :gutter="10" class="mc-upload-list">
                <el-col v-for="img in document.images" :key="(img.uid?img.uid:img.src)" :span="12" class="mc-upload-list__item">
                  <el-image v-if="img.src" :src="img.src" lazy :fit="'scale-down'" class="image-container" @click="onSelectImage(img.src)">
                    <template #error>
                      <div class="image-slot">
                        <i class="el-icon-picture-outline" />
                      </div>
                    </template>
                  </el-image>
                  <div
                    v-else
                    v-loading="img.loading"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.6)"
                    element-loading-text="上传中"
                    style="height: 120px;margin-top: 5px;"
                  >
                    <el-image :fit="'scale-down'" class="image-container">
                      <template #error>
                        <div class="image-slot">
                          <i class="el-icon-picture-outline" />
                        </div>
                      </template>
                    </el-image>
                  </div>
                  <span class="mc-upload-list__item-actions">
                    <span class="cm-upload-list__item-preview" @click="onOpenViewer(img.src)"><i class="el-icon-zoom-in" /></span>
                    <span v-if="checkPermission(['api:admin:document:deleteimage'])" class="cm-upload-list__item-delete" @click="onDeleteImage(img.src)"><i class="el-icon-delete" /></span>
                  </span>
                </el-col>
              </el-row>
            </div>
          </el-main>
          <el-footer style="height: auto;padding: 0px;">
            <el-tabs
              ref="tabs"
              :value="document.tabName"
              :stretch="false"
              tab-position="bottom"
              type="border-card"
              @tab-click="onTabClick"
            >
              <el-tab-pane :name="document.tabs.doc" label="文档管理" />
              <el-tab-pane :name="document.tabs.img" label="文档图片" />
            </el-tabs>
          </el-footer>
        </el-container>
      </el-aside>
    </el-container>

    <!--分组-->
    <el-dialog
      v-if="checkPermission(['api:admin:document:addgroup','api:admin:document:updategroup'])"
      :title="(documentGroup.form.id > 0 ? '编辑':'新增')+'分组'"
      :visible.sync="documentGroup.visible"
      :close-on-click-modal="false"
      @close="onCloseGroup"
    >
      <el-form ref="documentGroupForm" :model="documentGroup.form" label-width="100px" :rules="formRules">
        <el-form-item prop="parentIds" label="父级" width>
          <el-cascader
            :key="documentGroup.key"
            v-model="documentGroup.form.parentIds"
            placeholder="请选择，支持搜索功能"
            style="width: 100%;"
            :options="groupTree"
            :props="{ checkStrictly: true, value: 'id' }"
            filterable
          />
        </el-form-item>
        <el-form-item label="名称" prop="label">
          <el-input v-model="documentGroup.form.label" auto-complete="off" />
        </el-form-item>
        <el-form-item label="命名" prop="name">
          <el-input v-model="documentGroup.form.name" auto-complete="off" />
        </el-form-item>
        <el-form-item prop="opened" label="默认展开" width>
          <el-switch v-model="documentGroup.form.opened" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click.native="documentGroup.visible = false">取消</el-button>
          <my-confirm-button type="submit" :validate="validateGroup" :loading="documentGroup.loading" @click="onSubmitGroup" />
        </div>
      </template>
    </el-dialog>

    <!--菜单-->
    <el-dialog
      v-if="checkPermission(['api:admin:document:addmenu','api:admin:document:updatemenu'])"
      :title="(documentMenu.form.id > 0 ? '编辑':'新增')+'菜单'"
      :visible.sync="documentMenu.visible"
      :close-on-click-modal="false"
      @close="onCloseMenu"
    >
      <el-form ref="menuForm" :model="documentMenu.form" label-width="100px" :rules="formRules">
        <el-form-item prop="parentIds" label="父级" width>
          <el-cascader
            :key="documentMenu.key"
            v-model="documentMenu.form.parentIds"
            placeholder="请选择，支持搜索功能"
            style="width: 100%;"
            :options="groupTree"
            :props="{ checkStrictly: true, value: 'id'}"
            filterable
          />
        </el-form-item>
        <el-form-item label="名称" prop="label">
          <el-input v-model="documentMenu.form.label" auto-complete="off" />
        </el-form-item>
        <el-form-item label="命名" prop="name">
          <el-input v-model="documentMenu.form.name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="documentMenu.form.description" auto-complete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click.native="documentMenu.visible = false">取消</el-button>
          <my-confirm-button type="submit" :validate="validateMenu" :loading="documentMenu.loading" @click="onSubmitMenu" />
        </div>
      </template>
    </el-dialog>

    <!--图片查看器-->
    <image-viewer
      v-if="showViewer"
      :z-index="2000"
      :initial-index="imageIndex"
      :on-close="onCloseViewer"
      :url-list="imageUrls"
    />
  </section>
</template>

<script>
import MyMarkdownEditor from '@/components/my-markdown-editor'
import MyConfirmButton from '@/components/my-confirm-button'
import { listToTree, getTreeParents } from '@/utils'
import {
  getDocuments,
  getDocumentImages,
  removeDocument,
  addGroup,
  addMenu,
  updateGroup,
  updateMenu,
  updateContent,
  getGroup,
  getMenu,
  getContent,
  deleteImage
} from '@/api/admin/document'

let prevOverflow = ''

export default {
  name: 'Doc',
  components: { MyMarkdownEditor, MyConfirmButton },
  data() {
    const tabs = { doc: 'docTab', img: 'imgTab' }
    return {
      documentTree: [],
      expandRowKeys: [],
      pageLoading: false,
      listLoading: false,

      formRules: {
        parentId: [{ required: true, message: '请选择父级', trigger: 'change' }],
        parentIds: [{ required: true, message: '请选择父级', trigger: 'change' }],
        label: [{ required: true, message: '请输入名称', trigger: ['blur'] }],
        name: [{ required: true, message: '请输入命名', trigger: ['blur'] }]
      },

      showViewer: false,
      imageSrc: '',
      document: {
        tabs,
        tabName: tabs.doc,
        timer: '',
        form: {
          label: '',
          content: ''
        },
        images: [],
        loadingSave: false,
        loadingImageList: false,
        imgScrollTop: 0,
        docScrollTop: 0
      },

      groupTree: [],
      menuTree: [],

      documentGroup: {
        addForm: {
          type: 1,
          parentId: 0,
          parentIds: [0],
          label: '',
          name: '',
          opened: true
        },
        form: {},
        visible: false,
        loading: false,
        key: 1
      },
      documentMenu: {
        addForm: {
          type: 2,
          parentId: 0,
          parentIds: [0],
          label: '',
          name: '',
          description: ''
        },
        form: {},
        visible: false,
        loading: false,
        key: 1
      }
    }
  },
  computed: {
    token() {
      return { 'Authorization': 'Bearer ' + this.$store.getters.token }
    },
    isDocTab() {
      return this.document.tabName === this.document.tabs.doc
    },
    isImgTab() {
      return this.document.tabName === this.document.tabs.img
    },
    hasDocument() {
      return this.document.form.id > 0
    },
    imageIndex() {
      let previewIndex = 0
      const srcIndex = this.document.images.findIndex(a => a.src === this.imageSrc)
      if (srcIndex >= 0) {
        previewIndex = srcIndex
      }
      return previewIndex
    },
    imageUrls() {
      return this.document.images.map(a => a.src)
    }
  },
  watch: {
    'document.form.content'(newVal, oldVal) {
      if (!(this.document.form.id > 0) || this.document.form._first) {
        this.document.form._first = false
        this.clearTimer()
        return
      }

      this.clearTimer()

      const me = this
      this.document.timer = setTimeout(function() { me.save(true) }, 10000)
    },
    'document.tabName'(newVal, oldVal) {
      const $el = this.$refs.tabContainer?.$el
      if ($el) {
        const scrollTop = $el.scrollTop
        let toScrollTop = 0
        if (newVal === this.document.tabs.doc) {
          toScrollTop = this.document.docScrollTop
          this.document.imgScrollTop = scrollTop > 0 ? scrollTop : 0
        } else if (newVal === this.document.tabs.img) {
          toScrollTop = this.document.imgScrollTop
          this.document.docScrollTop = scrollTop > 0 ? scrollTop : 0
        }
        this.$nextTick(function() {
          $el.scrollTop = toScrollTop
        })
      }
    }
  },
  mounted() {
    this.getDocuments()
  },
  beforeDestroy() {
    this.clearTimer()
  },
  methods: {
    // 清除自动保存任务
    clearTimer() {
      if (this.document.timer) {
        clearTimeout(this.document.timer)
        this.document.timer = ''
      }
    },
    // 保存文档
    async save(autoSave = false) {
      if (!this.hasDocument) {
        return
      }

      if (this.document.timer) {
        clearTimeout(this.document.timer)
        this.document.timer = ''
      }

      this.document.form.html = this.$refs.markdownEditor.getHtml()

      this.document.loadingSave = true
      const res = await updateContent(this.document.form, { noErrorMsg: autoSave })
      this.document.loadingSave = false
      if (!res?.success) {
        return
      }

      this.document.form.version++
      if (!autoSave) {
        this.$message({
          message: this.$t('admin.saveOk'),
          type: 'success'
        })
      }
    },
    // 上传前
    onBeforeUpload(file) {
      this.document.images.unshift({
        loading: true,
        src: '',
        uid: file.uid
      })
    },
    // 选择图片
    onSelectImage(src) {
      this.$refs.markdownEditor.setImg(src)
    },
    // 上传成功
    onUploadSuccess(res, file, fileList) {
      const img = this.document.images.find(a => a.uid === file.uid)
      img.loading = false

      if (!res?.code === 1) {
        return
      }
      img.src = res.data
    },
    // 上传失败
    onUploadError(err, file) {
      const res = err.message ? JSON.parse(err.message) : {}
      if (!(res?.code === 1)) {
        if (res.msg) {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      }
      const img = this.document.images.find(a => a.uid === file.uid)
      img.loading = false
    },
    // 清空数据
    clearCurrentData() {
      this.document.form = { content: '' }
      this.document.images = []
    },
    // 行切换
    async onCurrentChange(currentRow, oldCurrentRow) {
      if (!currentRow) {
        this.clearCurrentData()
        return
      }

      if (currentRow.type === 1) {
        return
      }

      if (this.document.timer) {
        await this.save(true)
      }

      this.clearCurrentData()

      this.pageLoading = true
      const res = await getContent({ id: currentRow.id })
      this.pageLoading = false
      if (res && res.success) {
        this.document.form = { ...res.data, _first: res.data.content !== '' }
      }
    },
    // 点击选项卡
    onTabClick(tab) {
      if (this.document.tabName !== tab.name) {
        this.document.tabName = tab.name
        if (this.document.tabName === this.document.tabs.img && !(this.document.images.length > 0)) {
          this.getDocumentImages()
        }
      }
    },
    // 获取文档列表
    async getDocuments() {
      const para = {
        // key: this.filters.label
      }

      this.$refs.treeTable.setCurrentRow()

      this.listLoading = true
      const res = await getDocuments(para)
      this.listLoading = false

      if (!res?.success) {
        return
      }

      const list = res.data

      // 分组树
      const groups = list.filter(l => l.type === 1)
      this.groupTree = listToTree(_.cloneDeep(groups), {
        id: 0,
        parentId: 0,
        label: '我的文档'
      })
      ++this.documentGroup.key

      // 菜单树
      const menus = list.filter(l => l.type === 1 || l.type === 2)
      this.menuTree = listToTree(_.cloneDeep(menus), {
        id: 0,
        parentId: 0,
        label: '我的文档'
      })
      ++this.documentMenu.key

      // 文档列表
      const keys = list.filter(l => l.opened).map(l => l.id + '')
      this.expandRowKeys = keys

      list.forEach(l => {
        l._loading = false
      })
      const tree = listToTree(list)
      this.documentTree = tree
    },
    // 获取文档图片列表
    async getDocumentImages() {
      if (!this.hasDocument) {
        return
      }
      const para = {
        id: this.document.form.id
      }

      this.document.loadingImageList = true
      const res = await getDocumentImages(para)
      this.document.loadingImageList = false

      if (!res?.success) {
        return
      }
      this.document.images = res.data?.map(s => {
        return { src: s }
      })
    },
    // 删除图片
    async onDeleteImage(src) {
      if (!src) {
        return
      }

      const para = { documentId: this.document.form.id, url: src }
      this.pageLoading = true
      const res = await deleteImage(para)
      this.pageLoading = false

      if (!res?.success) {
        return
      }

      this.$message({
        message: this.$t('admin.deleteOk'),
        type: 'success'
      })

      const index = this.document.images.findIndex(a => a.src === src)
      this.document.images.splice(index, 1)
    },
    // 打开图片预览
    onOpenViewer(src) {
      if (!src) {
        return
      }

      this.imageSrc = src

      // prevent body scroll
      prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      this.showViewer = true
    },
    // 关闭图片预览
    onCloseViewer() {
      document.body.style.overflow = prevOverflow
      this.showViewer = false
    },
    // @row-dblclick="onRowDblClick"
    // onRowDblClick(row, col, e) {
    //   this.document.tabName = this.document.tabs.img
    //   if (!(this.document.images.length > 0)) {
    //     this.getDocumentImages()
    //   }
    // },
    // 权限分组方法
    onOpenAddGroup() {
      this.documentGroup.form = _.cloneDeep(this.documentGroup.addForm)
      this.documentGroup.visible = true
    },
    onCloseGroup() {
      this.$refs.documentGroupForm.resetFields()
      ++this.documentGroup.key
    },
    validateGroup: function() {
      let isValid = false
      this.$refs.documentGroupForm.validate(valid => {
        isValid = valid
      })

      return isValid
    },
    async onSubmitGroup() {
      this.documentGroup.loading = true
      const para = _.cloneDeep(this.documentGroup.form)
      para.parentId = para.parentIds.pop()

      let res
      if (para.id > 0) {
        res = await updateGroup(para)
      } else {
        res = await addGroup(para)
      }

      this.documentGroup.loading = false

      if (!res?.success) {
        return
      }

      this.$message({
        message: this.$t('admin.submitOk'),
        type: 'success'
      })
      this.documentGroup.visible = false
      this.getDocuments()
    },

    // 菜单方法
    onOpenAddMenu() {
      this.documentMenu.form = _.cloneDeep(this.documentMenu.addForm)
      this.documentMenu.visible = true
      ++this.documentMenu.key
    },
    onCloseMenu() {
      this.$refs.menuForm.resetFields()
      ++this.documentMenu.key
    },
    validateMenu: function() {
      let isValid = false
      this.$refs.menuForm.validate(valid => {
        isValid = valid
      })

      return isValid
    },
    async onSubmitMenu() {
      this.documentMenu.loading = true
      const para = _.cloneDeep(this.documentMenu.form)
      para.parentId = para.parentIds.pop()

      let res
      if (para.id > 0) {
        res = await updateMenu(para)
      } else {
        res = await addMenu(para)
      }
      this.documentMenu.loading = false

      if (!res?.success) {
        return
      }

      this.$message({
        message: this.$t('admin.submitOk'),
        type: 'success'
      })
      this.documentMenu.visible = false
      this.getDocuments()
    },
    // 显示编辑界面
    async onEdit(index, row) {
      const parents = getTreeParents(this.documentTree, row.id)
      const parentIds = parents.map(p => p.id)
      parentIds.unshift(0)

      const type = row.type
      const loading = this.$loading()
      if (type === 1) {
        const res = await getGroup({ id: row.id })
        loading.close()
        if (res && res.success) {
          const data = res.data
          data.parentIds = parentIds
          this.documentGroup.form = data
          this.documentGroup.visible = true
          ++this.documentGroup.key
        }
      } else if (type === 2) {
        const res = await getMenu({ id: row.id })
        loading.close()
        if (res && res.success) {
          const data = res.data
          data.parentIds = parentIds
          this.documentMenu.form = data
          this.documentMenu.visible = true
          ++this.documentMenu.key
        }
      }
    },
    // 删除
    async onDelete(index, row) {
      row._loading = true
      const para = { id: row.id }
      const res = await removeDocument(para)
      row._loading = false

      if (!res?.success) {
        return
      }
      this.$message({
        message: this.$t('admin.deleteOk'),
        type: 'success'
      })
      this.getDocuments()
    }
  }
}
</script>

<style lang="scss" scoped>
.image-container{
  height:120px;
  line-height: 120px;
  width:100%;
  cursor: pointer;
  margin-top:5px;
  // border: 1px solid #d7dae2;
  background: #f5f7fa;
  &:hover{
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  }
}

::v-deep .image-slot{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 30px;
}

.mc-upload-list{
  .mc-upload-list__item{
    position: relative;
    .mc-upload-list__item-actions{
      position: absolute;
      bottom: 0;
      left: 5px;
      right: 5px;
      color: #fff;
      background-color: rgba(0,0,0,.5);
      text-align: right;
      font-size: 18px;
      padding: 3px 10px;
      opacity: 0;
      transition: opacity .3s;
      span{
        cursor: pointer;
        display: inline-block;
        &+span{
          margin-left:15px;
        }
        &:hover{
          color: #409eff;
        }
      }
    }
    &:hover{
      .mc-upload-list__item-actions{
        opacity: 1;
      }
    }
  }
}
</style>
