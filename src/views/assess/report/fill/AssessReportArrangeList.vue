<template>
  <a-card :bordered='false'>
    <!-- 查询区域 -->
    <div class='table-page-search-wrapper'>
      <a-form layout='inline' @keyup.enter.native='searchQuery'>
        <a-row :gutter='24'>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class='table-operator'>
      <a-button @click='handleAdd' type='primary' icon='plus'>新增</a-button>
      <a-button type='primary' icon='download' @click="handleExportXls('一报告两评议工作安排')">导出</a-button>
      <a-upload name='file' :showUploadList='false' :multiple='false' :headers='tokenHeader' :action='importExcelUrl'
                @change='handleImportExcel'>
        <a-button type='primary' icon='import'>导入</a-button>
      </a-upload>
      <!-- 高级查询区域 -->
      <j-super-query :fieldList='superFieldList' ref='superQueryModal'
                     @handleSuperQuery='handleSuperQuery'></j-super-query>
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
      <div class='ant-alert ant-alert-info' style='margin-bottom: 16px;'>
        <i class='anticon anticon-info-circle ant-alert-icon'></i> 已选择 <a
        style='font-weight: 600'>{{ selectedRowKeys.length }}</a>项
        <a style='margin-left: 24px' @click='onClearSelected'>清空</a>
      </div>

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
        :rowSelection='{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}'
        class='j-table-force-nowrap'
        @change='handleTableChange'>

        <template slot='htmlSlot' slot-scope='text'>
          <div v-html='text'></div>
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
          <a @click='handleEdit(record)'>编辑</a>

          <a-divider type='vertical' />
          <a-dropdown>
            <a class='ant-dropdown-link'>更多 <a-icon type='down' /></a>
            <a-menu slot='overlay'>
              <a-menu-item>
                <a @click='handleDetail(record)'>详情</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title='确定删除吗?' @confirm='() => handleDelete(record.id)'>
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>

    <assess-report-arrange-modal ref='modalForm' @ok='modalFormOk'></assess-report-arrange-modal>
  </a-card>
</template>

<script>

import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import AssessReportArrangeModal from './modules/AssessReportArrangeModal'

export default {
  name: 'AssessReportArrangeList',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    AssessReportArrangeModal
  },
  data() {
    return {
      description: '一报告两评议工作安排管理页面',
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
          title: '单位名称',
          align: 'center',
          dataIndex: 'depart_dictText'
        },
        {
          title: '年度',
          align: 'center',
          dataIndex: 'currentYear_dictText'
        },
        {
          title: '单位人数',
          align: 'center',
          dataIndex: 'num'
        },
        {
          title: '民主测评参加范围',
          align: 'center',
          dataIndex: 'partinScope'
        },
        {
          title: '民主测评应道人数',
          align: 'center',
          dataIndex: 'partinNum'
        },
        {
          title: '参与民主测评的科级干部',
          align: 'center',
          dataIndex: 'partiSectionLeader_dictText'
        },
        {
          title: '参与民主测评的科级干部人数',
          align: 'center',
          dataIndex: 'sectionLeaderNum'
        },
        {
          title: '不参加民主评议的科级领导干部',
          align: 'center',
          dataIndex: 'nonPartin_dictText'
        },
        {
          title: '不参加民主评议的原因',
          align: 'center',
          dataIndex: 'nonPartinReason'
        },
        {
          title: '需要说明的情况',
          align: 'center',
          dataIndex: 'remark'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 147,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/modules/report/assessReportArrange/list',
        delete: '/modules/report/assessReportArrange/delete',
        deleteBatch: '/modules/report/assessReportArrange/deleteBatch',
        exportXlsUrl: '/modules/report/assessReportArrange/exportXls',
        importExcelUrl: 'modules/report/assessReportArrange/importExcel'

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
    initDictConfig() {
    },
    getSuperFieldList() {
      let fieldList = []
      fieldList.push({ type: 'sel_depart', value: 'depart', text: '单位名称' })
      fieldList.push({ type: 'string', value: 'currentYear', text: '年度', dictCode: 'assess_year' })
      fieldList.push({ type: 'int', value: 'num', text: '单位人数', dictCode: '' })
      fieldList.push({ type: 'string', value: 'partinScope', text: '民主测评参加范围', dictCode: '' })
      fieldList.push({ type: 'int', value: 'partinNum', text: '民主测评应道人数', dictCode: '' })
      fieldList.push({ type: 'sel_user', value: 'partiSectionLeader', text: '参与民主测评的科级干部' })
      fieldList.push({ type: 'int', value: 'sectionLeaderNum', text: '参与民主测评的科级干部人数', dictCode: '' })
      fieldList.push({ type: 'sel_user', value: 'nonPartin', text: '不参加民主评议的科级领导干部' })
      fieldList.push({ type: 'Text', value: 'nonPartinReason', text: '不参加民主评议的原因', dictCode: '' })
      fieldList.push({ type: 'Text', value: 'remark', text: '需要说明的情况', dictCode: '' })
      this.superFieldList = fieldList
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>