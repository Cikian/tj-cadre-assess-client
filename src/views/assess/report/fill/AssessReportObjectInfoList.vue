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
      <a-button type='primary' icon='download' @click="handleExportXls('评议对象有关信息汇总表')">导出</a-button>
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

    <assess-report-object-info-modal ref='modalForm' @ok='modalFormOk'></assess-report-object-info-modal>
  </a-card>
</template>

<script>

import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import AssessReportObjectInfoModal from './modules/AssessReportObjectInfoModal'
import { filterMultiDictText } from '@/components/dict/JDictSelectUtil'
import { FormTypes } from '@/utils/JEditableTableUtil'

export default {
  name: 'AssessReportObjectInfoList',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    AssessReportObjectInfoModal
  },
  data() {
    return {
      description: '评议对象有关信息汇总表管理页面',
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
          title: '姓名',
          align: 'center',
          dataIndex: 'name_dictText'
        },
        {
          title: '出生年月',
          align: 'center',
          dataIndex: 'birthday',
          customRender: function(text) {
            return !text ? '' : (text.length > 10 ? text.substr(0, 10) : text)
          }
        },
        {
          title: '现任职务',
          align: 'center',
          dataIndex: 'presentPosition'
        },
        {
          title: '入党时间',
          align: 'center',
          dataIndex: 'joinPartyDate',
          customRender: function(text) {
            return !text ? '' : (text.length > 10 ? text.substr(0, 10) : text)
          }
        },
        {
          title: '参加工作时间',
          align: 'center',
          dataIndex: 'joinWorkDate',
          customRender: function(text) {
            return !text ? '' : (text.length > 10 ? text.substr(0, 10) : text)
          }
        },
        {
          title: '是否进行谈话推荐',
          align: 'center',
          dataIndex: 'talkRecommend',
          customRender: (text) => (text ? filterMultiDictText(this.dictOptions['talkRecommend'], text) : '')
        },
        {
          title: '是否进行会议推荐',
          align: 'center',
          dataIndex: 'meetRecommend',
          customRender: (text) => (text ? filterMultiDictText(this.dictOptions['meetRecommend'], text) : '')
        },
        {
          title: '是否进行考察',
          align: 'center',
          dataIndex: 'inspect',
          customRender: (text) => (text ? filterMultiDictText(this.dictOptions['inspect'], text) : '')
        },
        {
          title: '是否进行干部人事档案审核',
          align: 'center',
          dataIndex: 'fileReview',
          customRender: (text) => (text ? filterMultiDictText(this.dictOptions['fileReview'], text) : '')
        },
        {
          title: '是否进行个人有关事项查核',
          align: 'center',
          dataIndex: 'personalReview',
          customRender: (text) => (text ? filterMultiDictText(this.dictOptions['personalReview'], text) : '')
        },
        {
          title: '是否征求纪检监察机关意见',
          align: 'center',
          dataIndex: 'disciplineOpinion',
          customRender: (text) => (text ? filterMultiDictText(this.dictOptions['disciplineOpinion'], text) : '')
        },
        {
          title: '是否有不得列为考察对象的情形',
          align: 'center',
          dataIndex: 'nonAssessSituation',
          customRender: (text) => (text ? filterMultiDictText(this.dictOptions['nonAssessSituation'], text) : '')
        },
        {
          title: '是否经会议集体讨论决定',
          align: 'center',
          dataIndex: 'discuss',
          customRender: (text) => (text ? filterMultiDictText(this.dictOptions['discuss'], text) : '')
        },
        {
          title: '参会人员是否符合规定要求',
          align: 'center',
          dataIndex: 'accord',
          customRender: (text) => (text ? filterMultiDictText(this.dictOptions['accord'], text) : '')
        },
        {
          title: '是否进行公示',
          align: 'center',
          dataIndex: 'publicity',
          customRender: (text) => (text ? filterMultiDictText(this.dictOptions['publicity'], text) : '')
        },
        {
          title: '是否有举报反应，有无进行查核',
          align: 'center',
          dataIndex: 'expose',
          customRender: (text) => (text ? filterMultiDictText(this.dictOptions['expose'], text) : '')
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
        list: '/modules/report/assessReportObjectInfo/list',
        delete: '/modules/report/assessReportObjectInfo/delete',
        deleteBatch: '/modules/report/assessReportObjectInfo/deleteBatch',
        exportXlsUrl: '/modules/report/assessReportObjectInfo/exportXls',
        importExcelUrl: 'modules/report/assessReportObjectInfo/importExcel'

      },
      dictOptions: {},
      superFieldList: []
    }
  },
  created() {
    this.$set(this.dictOptions, 'talkRecommend', [{ text: '是', value: 'Y' }, { text: '否', value: 'N' }])
    this.$set(this.dictOptions, 'meetRecommend', [{ text: '是', value: 'Y' }, { text: '否', value: 'N' }])
    this.$set(this.dictOptions, 'inspect', [{ text: '是', value: 'Y' }, { text: '否', value: 'N' }])
    this.$set(this.dictOptions, 'fileReview', [{ text: '是', value: 'Y' }, { text: '否', value: 'N' }])
    this.$set(this.dictOptions, 'personalReview', [{ text: '是', value: 'Y' }, { text: '否', value: 'N' }])
    this.$set(this.dictOptions, 'disciplineOpinion', [{ text: '是', value: 'Y' }, { text: '否', value: 'N' }])
    this.$set(this.dictOptions, 'nonAssessSituation', [{ text: '是', value: 'Y' }, { text: '否', value: 'N' }])
    this.$set(this.dictOptions, 'discuss', [{ text: '是', value: 'Y' }, { text: '否', value: 'N' }])
    this.$set(this.dictOptions, 'accord', [{ text: '是', value: 'Y' }, { text: '否', value: 'N' }])
    this.$set(this.dictOptions, 'publicity', [{ text: '是', value: 'Y' }, { text: '否', value: 'N' }])
    this.$set(this.dictOptions, 'expose', [{ text: '否', value: '1' }, { text: '是,有', value: '2' }, { text: '是,无', value: '3' }])
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
      fieldList.push({ type: 'sel_user', value: 'name', text: '姓名' })
      fieldList.push({ type: 'date', value: 'birthday', text: '出生年月' })
      fieldList.push({ type: 'string', value: 'presentPosition', text: '现任职务', dictCode: '' })
      fieldList.push({ type: 'string', value: 'joinPartyDate', text: '入党时间' })
      fieldList.push({ type: 'date', value: 'joinWorkDate', text: '参加工作时间' })
      fieldList.push({ type: 'switch', value: 'talkRecommend', text: '是否进行谈话推荐' })
      fieldList.push({ type: 'switch', value: 'meetRecommend', text: '是否进行会议推荐' })
      fieldList.push({ type: 'switch', value: 'inspect', text: '是否进行考察' })
      fieldList.push({ type: 'switch', value: 'fileReview', text: '是否进行干部人事档案审核' })
      fieldList.push({ type: 'switch', value: 'personalReview', text: '是否进行个人有关事项查核' })
      fieldList.push({ type: 'switch', value: 'disciplineOpinion', text: '是否征求纪检监察机关意见' })
      fieldList.push({ type: 'switch', value: 'nonAssessSituation', text: '是否有不得列为考察对象的情形' })
      fieldList.push({ type: 'switch', value: 'discuss', text: '是否经会议集体讨论决定' })
      fieldList.push({ type: 'switch', value: 'accord', text: '参会人员是否符合规定要求' })
      fieldList.push({ type: 'switch', value: 'publicity', text: '是否进行公示' })
      fieldList.push({ type: 'string', value: 'expose', text: '是否有举报反映，有无进行查核' , dictCode: 'hasReport' })
      this.superFieldList = fieldList
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>