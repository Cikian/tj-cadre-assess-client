<template xmlns:background-color='http://www.w3.org/1999/xhtml'>
  <a-row :gutter='10'>
    <a-col :md='12' :sm='24'>
      <a-card :bordered='false'>

        <div style='background: #fff;padding-left:16px;height: 100%; margin-top: 5px'>
          <a-alert type='info' :showIcon='true'>
            <div slot='message'>
              当前选择：<span v-if='this.currSelected.title'>{{ getCurrSelectedTitle() }}</span>
              <a v-if='this.currSelected.title' style='margin-left: 10px' @click='onClearSelected'>取消选择</a>
            </div>
          </a-alert>
          <a-input-search @search='onSearch' style='width:100%;margin-top: 10px' placeholder='请输入部门名称' />
          <!-- 树-->
          <a-col :md='10' :sm='24'>
            <a-tree
              multiple
              @select='onSelect'
              :selectedKeys='selectedKeys'
              :treeData='departTree'
              :expandedKeys='iExpandedKeys'
              :autoExpandParent='autoExpandParent'
              @expand='onExpand' />
          </a-col>
        </div>
      </a-card>

      <!--树操作-->
      <div class='drawer-bootom-button'>
        <a-dropdown :trigger="['click']" placement='topCenter'>
          <a-menu slot='overlay'>
            <a-menu-item key='5' @click='expandAll'>展开所有</a-menu-item>
            <a-menu-item key='6' @click='closeAll'>合并所有</a-menu-item>
          </a-menu>
          <a-button>
            树操作
            <a-icon type='up' />
          </a-button>
        </a-dropdown>
      </div>

    </a-col>
    <a-col :md='12' :sm='24'>
      <a-tabs defaultActiveKey='1'>
        <a-tab-pane tab='被考核单位' key='1' forceRender>
          <contact-modal ref='departContact' />
        </a-tab-pane>
      </a-tabs>
    </a-col>
  </a-row>
</template>
<script>
import { queryDepartTreeList, searchByKeywords } from '@/api/api'
import { httpAction, deleteAction } from '@/api/manage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import ContactModal from './modules/ContactModule'
import Vue from 'vue'
// 表头
const columns = [
  {
    title: '机构名称',
    dataIndex: 'departName'
  },
  {
    title: '机构类型',
    align: 'center',
    dataIndex: 'orgType'
  },
  {
    title: '机构编码',
    dataIndex: 'orgCode'
  },
  {
    title: '手机号',
    dataIndex: 'mobile'
  },
  {
    title: '传真',
    dataIndex: 'fax'
  },
  {
    title: '地址',
    dataIndex: 'address'
  },
  {
    title: '排序',
    align: 'center',
    dataIndex: 'departOrder'
  },
  {
    title: '操作',
    align: 'center',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'DepartList',
  mixins: [JeecgListMixin],
  components: {
    ContactModal
  },
  data() {
    return {
      iExpandedKeys: [],
      loading: false,
      autoExpandParent: true,
      currFlowId: '',
      currFlowName: '',
      disable: true,
      treeData: [],
      visible: false,
      departTree: [],
      rightClickSelectedKey: '',
      rightClickSelectedOrgCode: '',
      hiding: true,
      model: {},
      dropTrigger: '',
      depart: {},
      columns: columns,
      disableSubmit: false,
      selectedKeys: [],
      autoIncr: 1,
      currSelected: {},
      allTreeKeys: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      graphDatasource: {
        nodes: [],
        edges: []
      },
      validatorRules: {
        departName: [{ required: true, message: '请输入机构/部门名称!' }],
        orgCode: [{ required: true, message: '请输入机构编码!' }],
        orgCategory: [{ required: true, message: '请选择机构类型!' }],
        mobile: Vue.prototype.rules.mobile2
      },
      url: {
        delete: '/sys/sysDepart/delete',
        edit: '/sys/sysDepart/edit',
        deleteBatch: '/sys/sysDepart/deleteBatch',
        exportXlsUrl: 'sys/sysDepart/exportXls',
        importExcelUrl: 'sys/sysDepart/importExcel'
      },
      orgCategoryDisabled: false,
      oldDirectorUserIds: ''
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    loadData() {
      this.refresh()
    },
    loadTree() {
      var that = this
      that.treeData = []
      that.departTree = []
      queryDepartTreeList().then((res) => {
        if (res.success) {
          //部门全选后，再添加部门，选中数量增多
          this.allTreeKeys = []
          for (let i = 0; i < res.result.length; i++) {
            let temp = res.result[i]
            that.treeData.push(temp)
            that.departTree.push(temp)
            that.setThisExpandedKeys(temp)
            that.getAllKeys(temp)
          }
          this.loading = false
        }
      })
    },
    setThisExpandedKeys(node) {
      if (node.children && node.children.length > 0) {
        this.iExpandedKeys.push(node.key)
        for (let a = 0; a < node.children.length; a++) {
          this.setThisExpandedKeys(node.children[a])
        }
      }
    },
    refresh() {
      this.loading = true
      this.loadTree()
    },

    onExpand(expandedKeys) {
      this.iExpandedKeys = expandedKeys
      this.autoExpandParent = false
    },

    batchDel: function() {
      if (this.checkedKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
      } else {
        var ids = ''
        for (var a = 0; a < this.checkedKeys.length; a++) {
          ids += this.checkedKeys[a] + ','
        }
        var that = this
        this.$confirm({
          title: '确认删除',
          content: '确定要删除所选中的 ' + this.checkedKeys.length + ' 条数据，以及子节点数据吗?',
          onOk: function() {
            deleteAction(that.url.deleteBatch, { ids: ids }).then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.loadTree()
                that.onClearSelected()
              } else {
                that.$message.warning(res.message)
              }
            })
          }
        })
      }
    },
    onSearch(value) {
      let that = this
      if (value) {
        searchByKeywords({ keyWord: value }).then((res) => {
          if (res.success) {
            that.departTree = []
            for (let i = 0; i < res.result.length; i++) {
              let temp = res.result[i]
              that.departTree.push(temp)
            }
          } else {
            that.$message.warning(res.message)
          }
        })
      } else {
        that.loadTree()
      }

    },
    hide() {
      this.visible = false
    },
    onSelect(selectedKeys, e) {
      this.hiding = false
      let record = e.node.dataRef
      this.currSelected = Object.assign({}, record)
      this.model = this.currSelected
      this.selectedKeys = [record.key]
      this.model.parentId = record.parentId
      this.setValuesToForm(record)
      this.$refs.departContact.show(record.id)
      this.oldDirectorUserIds = record.directorUserIds

    },
    // 触发onSelect事件时,为部门树右侧的form表单赋值
    setValuesToForm(record) {
      if (record.orgCategory == '1') {
        this.orgCategoryDisabled = true
      } else {
        this.orgCategoryDisabled = false
      }
    },
    getCurrSelectedTitle() {
      return !this.currSelected.title ? '' : this.currSelected.title
    },
    onClearSelected() {
      this.hiding = true
      this.checkedKeys = []
      this.currSelected = {}
      this.selectedKeys = []
      this.$refs.departContact.departId = ''
    },

    submitCurrForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.currSelected.id) {
            this.$message.warning('请点击选择要修改部门!')
            return
          }

          //update-begin---author:wangshuai ---date:20200308  for：[JTC-119]在部门管理菜单下设置部门负责人
          this.currSelected.oldDirectorUserIds = this.oldDirectorUserIds
          //update-end---author:wangshuai ---date:20200308  for：[JTC-119]在部门管理菜单下设置部门负责人

          httpAction(this.url.edit, this.currSelected, 'put').then((res) => {
            if (res.success) {
              this.$message.success('保存成功!')
              this.loadTree()
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    },

    expandAll() {
      this.iExpandedKeys = this.allTreeKeys
    },
    closeAll() {
      this.iExpandedKeys = []
    },

    getAllKeys(node) {
      this.allTreeKeys.push(node.key)
      if (node.children && node.children.length > 0) {
        for (let a = 0; a < node.children.length; a++) {
          this.getAllKeys(node.children[a])
        }
      }
    }

  },
  created() {
    this.currFlowId = this.$route.params.id
    this.currFlowName = this.$route.params.name
    // this.loadTree()
  }

}
</script>
<style scoped>
.ant-card-body .table-operator {
  margin: 15px;
}

.anty-form-btn {
  width: 100%;
  text-align: center;
}

.anty-form-btn button {
  margin: 0 5px;
}

.anty-node-layout .ant-layout-header {
  padding-right: 0
}

.header {
  padding: 0 8px;
}

.header button {
  margin: 0 3px
}

.ant-modal-cust-warp {
  height: 100%
}

.ant-modal-cust-warp .ant-modal-body {
  height: calc(100% - 110px) !important;
  overflow-y: auto
}

.ant-modal-cust-warp .ant-modal-content {
  height: 90% !important;
  overflow-y: hidden
}

#app .desktop {
  height: auto !important;
}

/** Button按钮间距 */
.ant-btn {
  margin-left: 3px
}

.drawer-bootom-button {
  /*position: absolute;*/
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: left;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
}
</style>