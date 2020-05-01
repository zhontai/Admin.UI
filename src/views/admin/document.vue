<template>
  <section style="height:100%;">
    <el-container style="height:100%;">
      <el-container>
        <el-header class="header" height="auto" style="padding:5px 10px 5px 10px;text-align:right;">
          <span style="float:left;font-size:14px;line-height: 28px;">{{ document.form.label }}</span>
          <el-button type="primary" :disabled="!hasDocument" :loading="document.loadingSave" @click="save">保存文档</el-button>
        </el-header>
        <el-main class="main" style="padding:0px 5px 5px 5px;">
          <div style="height:calc(100% - 2px);">
            <markdown-editor ref="markdownEditor" v-model="document.form.content" :height="'100%'" />
          </div>
        </el-main>
      </el-container>
      <el-aside width="300px" style="padding:0px;border-left: 1px solid #e6e6e6;">
        <el-container style="height:100%;overflow:hidden;">
          <el-header class="header" height="auto" style="padding:5px 10px 6px 10px;border-bottom: 1px solid #e6e6e6;text-align:right;">
            <div v-show="isDocTab">
              <el-button-group>
                <el-button type="primary" @click="getDocuments">刷新</el-button>
                <el-dropdown>
                  <el-button type="primary">
                    新增<i class="el-icon-arrow-down el-icon--right" />
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu :visible-arrow="false" style="margin-top: 2px;">
                      <el-dropdown-item icon="el-icon-folder" @click.native="onOpenAddGroup">新增分组</el-dropdown-item>
                      <el-dropdown-item icon="el-icon-tickets" @click.native="onOpenAddMenu">新增菜单</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </el-button-group>
            </div>
            <div v-show="isImgTab">
              <el-button-group>
                <el-button type="primary" :disabled="!hasDocument" @click="getDocumentImages">刷新</el-button>
                <el-upload
                  v-if="hasDocument"
                  ref="upload"
                  action="/api/admin/document/uploadimage"
                  multiple
                  :headers="token"
                  :data="uploadData"
                  :show-file-list="false"
                  :before-upload="beforeUpload"
                  :on-success="onSuccess"
                  :on-error="onError"
                  style="display: inline-block;"
                >
                  <el-button type="primary">
                    <i class="el-icon-upload el-icon--left" />上传图片
                  </el-button>
                </el-upload>
                <el-button v-else type="primary" :disabled="!hasDocument">
                  <i class="el-icon-upload el-icon--left" />上传图片
                </el-button>
              </el-button-group>
            </div>
          </el-header>
          <el-main class="main" :style="isImgTab?'padding:5px 10px 10px 10px':'padding:0px 5px 5px 5px;'">
            <div v-show="isDocTab" style="height:100%;">
              <el-table
                v-loading="listLoading"
                highlight-current-row
                :data="documentTree"
                row-key="id"
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
                <el-table-column label="操作" align="right">
                  <template v-slot="{ $index, row }">
                    <el-button type="text" icon="el-icon-edit" @click="onEdit($index, row)" />
                    <confirm-button
                      type="text"
                      :loading="row._loading"
                      :icon="'el-icon-delete'"
                      @click="onDelete($index, row)"
                    >
                      <template #content>
                        <p>确定要删除吗？</p>
                      </template>
                    </confirm-button>
                  </template>
                </el-table-column>
                <template #empty>
                  暂无文档
                </template>
              </el-table>
            </div>
            <div v-show="isImgTab" v-loading="document.loadingImageList" style="height:100%;">
              <el-row :gutter="10">
                <el-col v-for="(image, index) in document.images" :key="'doc_img_'+index" :span="12">
                  <el-image :src="image" lazy :fit="'cover'" class="image-container" @click="onSelectImage(image)">
                    <template #error>
                      <div class="image-slot">
                        <i class="el-icon-picture-outline" />
                      </div>
                    </template>
                  </el-image>
                </el-col>
              </el-row>
            </div>
          </el-main>
          <el-footer style="height: auto;padding: 0px;">
            <el-tabs
              ref="tabs"
              value="docs"
              :stretch="false"
              tab-position="bottom"
              type="border-card"
              @tab-click="onTabClick"
            >
              <el-tab-pane name="docs" label="文档管理" />
              <el-tab-pane name="imgs" label="文档图片" />
            </el-tabs>
          </el-footer>
        </el-container>
      </el-aside>
    </el-container>

    <!--分组-->
    <el-dialog
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
          <confirm-button type="submit" :validate="validateGroup" :loading="documentGroup.loading" @click="onSubmitGroup" />
        </div>
      </template>
    </el-dialog>

    <!--菜单-->
    <el-dialog
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
          <confirm-button type="submit" :validate="validateMenu" :loading="documentMenu.loading" @click="onSubmitMenu" />
        </div>
      </template>
    </el-dialog>
  </section>
</template>

<script>
import MarkdownEditor from '@/components/MarkdownEditor'
import ConfirmButton from '@/components/ConfirmButton'
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
  getContent
} from '@/api/admin/document'

export default {
  name: 'Document',
  components: { MarkdownEditor, ConfirmButton },
  data() {
    return {
      documentTree: [],
      expandRowKeys: [],
      listLoading: false,

      formRules: {
        parentId: [{ required: true, message: '请选择父级', trigger: 'change' }],
        parentIds: [{ required: true, message: '请选择父级', trigger: 'change' }],
        label: [{ required: true, message: '请输入名称', trigger: ['blur'] }],
        name: [{ required: true, message: '请输入命名', trigger: ['blur'] }]
      },

      document: {
        tabName: 'docs',
        timer: '',
        first: true,
        form: {
          label: '',
          content: ''
        },
        images: [],
        loadingSave: false,
        loadingImageList: false
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
      return this.document.tabName === 'docs'
    },
    isImgTab() {
      return this.document.tabName === 'imgs'
    },
    hasDocument() {
      return this.document.form.id > 0
    },
    uploadData() {
      return { id: this.document.form.id }
    }
  },
  watch: {
    'document.form.content'(newVal, oldVal) {
      if (this.document.first) {
        this.document.first = false
        return
      }

      if (this.document.timer) {
        clearTimeout(this.document.timer)
        this.document.timer = ''
      }

      const me = this
      this.document.timer = setTimeout(function() { me.save(me, true) }, 10000)
    }
  },
  mounted() {
    this.getDocuments()
  },
  beforeDestroy() {
    if (this.document.timer) {
      clearTimeout(this.document.timer)
      this.document.timer = ''
    }
  },
  methods: {
    async save(e, autoSave = false) {
      if (!this.hasDocument) {
        return
      }

      if (this.document.timer) {
        clearTimeout(this.document.timer)
        this.document.timer = ''
      }
      this.document.form.html = this.$refs.markdownEditor.getHtml()

      this.document.loadingSave = true
      const res = await updateContent(this.document.form)
      this.document.loadingSave = false
      if (!(res && res.success === true)) {
        if (res.msg && !autoSave) {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
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
    beforeUpload(file) {
      // file.uid

      // debugger
    },
    onSelectImage(src) {
      this.$refs.markdownEditor.setImg(src)
    },
    onSuccess(res, file) {
      if (!(res && res.code === 1)) {
        if (res.msg) {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
        return
      }
      this.document.images.unshift(res.data)
    },
    onError(err, file) {
      const res = err.message ? JSON.parse(err.message) : {}
      if (!(res && res.code === 1)) {
        if (res.msg) {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
        return
      }
    },
    async onCurrentChange(currentRow, oldCurrentRow) {
      if (currentRow.type === 1) {
        return
      }

      if (this.document.timer) {
        await this.save(this, true)
      }

      this.document.form = {}
      this.document.images = []

      const loading = this.$loading()
      const res = await getContent({ id: currentRow.id })
      loading.close()
      if (res && res.success) {
        this.document.first = true
        this.document.form = { ...res.data }
      }
    },
    // 点击选项卡
    onTabClick(tab) {
      if (this.document.tabName !== tab.name) {
        this.document.tabName = tab.name
        if (this.document.tabName === 'imgs' && !(this.document.images.length > 0)) {
          this.getDocumentImages()
        }
      }
    },
    // 获取文档列表
    async getDocuments() {
      const para = {
        // key: this.filters.label
      }

      this.document.form = {
        label: '',
        content: ''
      }

      this.listLoading = true
      const res = await getDocuments(para)
      this.listLoading = false

      if (!res.success) {
        if (res.msg) {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
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
    // 获取文档列表
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

      if (!res.success) {
        if (res.msg) {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
        return
      }

      this.document.images = res.data
    },
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

      if (!(res && res.success === true)) {
        if (res.msg) {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
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

      if (!(res && res.success === true)) {
        if (res.msg) {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
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

      if (!res.success) {
        this.$message({
          message: res.msg,
          type: 'error'
        })
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
  height:130px;
  line-height: 130px;
  width:100%;
  cursor: pointer;
  margin-top:5px;
  border: 1px solid #d7dae2;
  border-radius: 4px;
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
</style>
