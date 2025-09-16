<template>
  <a-card :bordered='false'>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="年度">
              <t-dict-select-tag placeholder="请选择年度" v-model="queryParam.currentYear" dictCode="assess_year" />
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="单位（处室）">
              <j-select-depart placeholder="请选择单位（处室）" v-model="queryParam.depart" />
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
            <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class='table-operator'>
      <a-button @click='handleAdd' type='primary' icon='plus'>新增</a-button>
      <a-button type='primary' icon='download' @click="handleExportXls('年度考核负面清单')">导出</a-button>
      <!--      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">-->
      <!--        <a-button type="primary" icon="import">导入</a-button>-->
      <!--      </a-upload>-->
      <!-- 高级查询区域 -->
      <!--      <j-super-query :fieldList='superFieldList' ref='superQueryModal'-->
      <!--                     @handleSuperQuery='handleSuperQuery'></j-super-query>-->
      <a-dropdown v-if='selectedRowKeys.length > 0'>
        <a-menu slot='overlay'>
          <a-menu-item key='1' @click='batchDel'>
            <a-icon type='delete' />
            删除
          </a-menu-item>
        </a-menu>
        <a-button style='margin-left: 8px'> 批量操作
          <a-icon type='down' />
        </a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>

      <a-table
        ref='table'
        size='middle'
        :scroll='{x:true}'
        bordered
        rowKey='id'
        :columns='columns'
        :dataSource='dataSource'
        :pagination='ipagination'
        :loading='loading'
        @change='handleTableChange'>

        <template slot='type' slot-scope='text'>
          {{ text === '1' ? '单位' : '个人' }}
        </template>

        <template slot='content' slot-scope='text'>
          <div style='font-size: 16px; line-height: 20px' v-html="text"></div>
        </template>

        <template slot='htmlSlot' slot-scope='text'>
          <div v-html='text'></div>
        </template>

        <template slot='status' slot-scope='text, record'>
          <a-tag
            :color='record.status === "1" ? "red" : record.status === "2" ? "orange" : record.status === "3" ? "green" : "pink" '>
            {{ record.status === '1' ? ' ' : record.status === '2' ? '审核中' : record.status === '3' ? '已采用' : '未采用'
            }}
          </a-tag>
        </template>


        <template slot='imgSlot' slot-scope='text,record'>
          <span v-if='!text' style='font-size: 16px;font-style: italic;'>无图片</span>
          <img v-else :src='getImgView(text)' :preview='record.id' height='25px' alt=''
               style='max-width:80px;font-size: 16px;font-style: italic;' />
        </template>
        <template slot='fileSlot' slot-scope='text'>
          <span v-if='!text' style='font-size: 16px;font-style: italic;'>无文件</span>
          <a-button
            v-else
            :ghost='true'
            type='primary'
            icon='download'
            size='small'
            @click='downloadFile(text)'>
            下载
          </a-button>
        </template>

        <span slot='action' slot-scope='text, record'>
          <a @click='handleEdit(record)' v-has="'gbc:admin'">编辑</a>
          <a-divider type='vertical' v-has="'gbc:admin'" />
          <a @click='openRejected(record)' v-has="'gbc:admin'">不采用</a>
          <a-divider type='vertical' v-has="'gbc:admin'" />
          <a @click='passAudit(record)' v-has="'gbc:admin'">采用</a>
        </span>

      </a-table>
    </div>

    <assess-annual-negative-list-modal ref='modalForm' @ok='addOk'></assess-annual-negative-list-modal>
  </a-card>
</template>

<script>

import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import AssessAnnualNegativeListModal from './modules/AssessAnnualNegativeListModal.vue'
import { putAction } from '@/api/manage'
import TDictSelectTag from '@/component/TDictSelectTag.vue'

export default {
  name: 'AssessAnnualNegativeListList',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    TDictSelectTag,
    AssessAnnualNegativeListModal
  },
  data() {
    return {
      description: '年度考核负面清单管理页面',
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '年度',
          align: 'center',
          dataIndex: 'currentYear'
        },
        {
          title: '单位',
          align: 'center',
          dataIndex: 'depart_dictText'
        },
        {
          title: '人员',
          align: 'center',
          dataIndex: 'person'
        },
        {
          title: '对象',
          align: 'center',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '填写单位',
          align: 'center',
          dataIndex: 'reportDepart_dictText'
        },
        {
          title: '内容',
          align: 'center',
          width: 620,
          dataIndex: 'content',
          scopedSlots: { customRender: 'content' }
        },

        {
          title: '证明文件',
          align: 'center',
          dataIndex: 'files',
          scopedSlots: { customRender: 'fileSlot' }
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status_dictText',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          width: 180,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/modules/annual/assessAnnualNegativeList/list',
        delete: '/modules/annual/assessAnnualNegativeList/delete',
        deleteBatch: '/modules/annual/assessAnnualNegativeList/deleteBatch',
        exportXlsUrl: '/modules/annual/assessAnnualNegativeList/exportXls',
        importExcelUrl: 'modules/annual/assessAnnualNegativeList/importExcel'

      },
      dictOptions: {},
      superFieldList: []
    }
  },
  created() {
    this.getSuperFieldList()
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    addOk() {
      this.loadData()
      //清空列表选中
      this.onClearSelected()

      let that = this
      this.$confirm({
        title: '是否继续新增负面清单?',
        content: '若希望继续新增负面清单，请点击“继续新增”按钮',
        okText: '继续新增',
        cancelText: '关闭',
        onOk() {
          that.handleAdd()
        },
        onCancel() {
        }
      })
    },

    handleAdd: function() {
      this.$refs.modalForm.add()
      this.$refs.modalForm.title = '新增'
      this.$refs.modalForm.disableSubmit = false
      this.$refs.modalForm.skipAudit = true
    },
    initDictConfig() {
    },
    getSuperFieldList() {
      let fieldList = []
      fieldList.push({ type: 'sel_depart', value: 'depart', text: '对象' })
      fieldList.push({ type: 'Text', value: 'content', text: '内容', dictCode: '' })
      fieldList.push({ type: 'string', value: 'reportDepart', text: '填写单位', dictCode: '' })
      fieldList.push({ type: 'string', value: 'files', text: '证明文件', dictCode: '' })
      fieldList.push({ type: 'string', value: 'status', text: '状态', dictCode: 'report_status' })
      fieldList.push({ type: 'string', value: 'currentYear', text: '年度', dictCode: 'assess_year' })
      fieldList.push({ type: 'string', value: 'type', text: '类型', dictCode: '' })
      this.superFieldList = fieldList
    },
    openRejected(record) {
      record.status = '4'
      putAction('/modules/annual/assessAnnualNegativeList/passOrReject', record).then(res => {
        if (res.success) {
          // this.$message.success(res.message)
          this.loadData()
        } else {
          // this.$message.error(res.message)
          this.$error({
            title: '消息提示',
            content: h => <div style="color:red;">{res.message}</div>
          })
        }
      })
    },
    passAudit(record) {
      record.status = '3'
      putAction('/modules/annual/assessAnnualNegativeList/passOrReject', record).then(res => {
        if (res.success) {
          // this.$message.success(res.message)
          this.loadData()
        } else {
          // this.$message.error(res.message)
          this.$error({
            title: '消息提示',
            content: h => <div style="color:red;">{res.message}</div>
          })
        }
      })
    }


  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>