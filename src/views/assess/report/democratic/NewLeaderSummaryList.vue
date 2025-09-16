<template>
  <a-card :bordered='false'>
    <!-- 查询区域 -->
    <div class='table-page-search-wrapper'>
      <a-form layout='inline' @keyup.enter.native='searchQuery'>
        <a-row :gutter='24'>
          <a-col :xl='6' :lg='7' :md='8' :sm='24'>
            <a-form-item label='年度'>
              <t-dict-select-tag @change='searchQuery' placeholder='请选择年度' v-model='queryParam.year' dictCode='assess_year' />
            </a-form-item>
          </a-col>
          <a-col :xl='6' :lg='7' :md='8' :sm='24'>
            <a-form-item label='排序列'>
              <a-select @change='searchQuery' placeholder='请选择顺序' v-model='queryParam.var1'>
                <a-select-option value='re'>认同率</a-select-option>
                <a-select-option value='di'>不认同率</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xl='6' :lg='7' :md='8' :sm='24'>
            <a-form-item label='顺序'>
              <a-select @change='searchQuery' placeholder='请选择顺序' v-model='queryParam.var2'>
                <a-select-option value='asc'>升序</a-select-option>
                <a-select-option value='desc'>降序</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if='toggleSearchStatus'>

          </template>
          <a-col :xl='6' :lg='7' :md='8' :sm='24'>
            <span style='float: left;overflow: hidden;' class='table-page-search-submitButtons'>
              <a-button type='primary' @click='searchQuery' icon='search'>查询</a-button>
              <a-button type='primary' @click='searchReset' icon='reload' style='margin-left: 8px'>重置</a-button>
<!--              <a @click='handleToggleSearch' style='margin-left: 8px'>-->
<!--                {{ toggleSearchStatus ? '收起' : '展开' }}-->
<!--                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />-->
<!--              </a>-->
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->

    <!-- table区域-begin -->
    <div>
<!--      <div class='ant-alert ant-alert-info' style='margin-bottom: 16px;'>-->
<!--        <i class='anticon anticon-info-circle ant-alert-icon'></i> 已选择 <a-->
<!--        style='font-weight: 600'>{{ selectedRowKeys.length }}</a>项-->
<!--        <a style='margin-left: 24px' @click='onClearSelected'>清空</a>-->
<!--      </div>-->
      <a-button style="margin-bottom: 20px" type="primary" icon="download" @click="getExcellentNumExcel">导出新提拔干部信息（排名）</a-button>
      <a-button style="margin-left: 20px" @click='openExport' type='primary' icon='download'>下载干部选拔任用工作专题报告</a-button>
      <a-button style="margin-left: 20px" type="primary" icon="download" @click="openExportFile()">导出新提拔干部信息</a-button>
      <a-button style="margin-left: 20px" @click='reRank' type='primary' icon='redo' :loading='reRankLoading'>重新计算分数及排名</a-button>


      <a-table
        ref='table'
        size='middle'
        bordered
        rowKey='id'
        :scroll='{x:true}'
        :columns='columns'
        :dataSource='dataSource'
        :pagination='false'
        :loading='loading'
        @change='handleTableChange'>

        <!--        <template slot='status' slot-scope='text, record'>-->
        <!--          <div style='width: 96%; margin: auto'>-->
        <!--&lt;!&ndash;            <a-progress :percent="toFixedO(record.filledNum / record.num * 100)" size="small" status="active" />&ndash;&gt;-->
        <!--            <a-tag style='width: 66px' :color='record.filledNum/record.num === 1 ? "#87d068" : "#f81d22"'>{{ record.filledNum }} /-->
        <!--              {{ record.num }}-->
        <!--            </a-tag>-->
        <!--          </div>-->
        <!--        </template>-->

        <template slot='originalPosition' slot-scope='text, record'>
          {{ text }}&nbsp;&nbsp;{{ record.originalDate }}
        </template>

        <template slot='currentPosition' slot-scope='text, record'>
          {{ text }}&nbsp;&nbsp;{{ record.curDate }}
        </template>

        <template slot='recognitionRate' slot-scope='text, record'>
          {{ text === null ? 0 : text }}%
        </template>

        <template slot='identityRate' slot-scope='text, record'>
          {{ text === null ? 0 : text }}%
        </template>

        <template slot='disagreementRate' slot-scope='text, record'>
          {{ text === null ? 0 : text }}%
        </template>

        <template slot='unknownRate' slot-scope='text, record'>
          {{ text === null ? 0 : text }}%
        </template>

        <!--        <span slot="action" slot-scope="text, record">-->
        <!--          <a @click="handleEdit(record)">详情</a>-->
        <!--        </span>-->

      </a-table>
    </div>
    <assess-annual-summary-export-modal
      ref='exportModal'
    ></assess-annual-summary-export-modal>
  </a-card>
</template>

<script>

import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import AssessReportEvaluationSummaryModal from './modules/AssessReportEvaluationSummaryModal.vue'
import '@/assets/less/TableExpand.less'
import { getAssessingInfo, submitInitReportDemocratic } from '@/api/assessApis'
import moment from 'moment'
import TModal from '@/component/TModal.vue'
import tjTitle from '@/component/TjTitle'
import { getAction, putAction } from '@/api/manage'
import { axios } from '@/utils/assessReq'
import TDictSelectTag from '@/component/TDictSelectTag.vue'
import AssessAnnualSummaryExportModal from '@/views/assess/annual/summary/modules/AssessAnnualSummaryExportModal.vue'

export default {
  name: 'AssessReportEvaluationSummaryList',
  mixins: [JeecgListMixin],
  components: {
    AssessAnnualSummaryExportModal,
    TDictSelectTag,
    TModal,
    AssessReportEvaluationSummaryModal,
    tjTitle
  },
  data() {
    return {
      description: '新提拔干部评议汇总信息',
      reRankLoading: false,
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
          title: '姓名',
          align: 'center',
          dataIndex: 'name'
        },
        {
          title: '单位',
          align: 'center',
          width: 200,
          dataIndex: 'depart_dictText'
        },
        {
          title: '原任职务及时间',
          align: 'center',
          width: 300,
          dataIndex: 'originalPosition',
          scopedSlots: { customRender: 'originalPosition' }
        },
        {
          title: '现任职务及时间',
          align: 'center',
          width: 300,
          dataIndex: 'currentPosition',
          scopedSlots: { customRender: 'currentPosition' }
        },
        {
          title: '认同率',
          align: 'center',
          width: 100,
          dataIndex: 'recognitionRate',
          scopedSlots: { customRender: 'recognitionRate' }
        },
        {
          title: '基本认同率',
          align: 'center',
          width: 110,
          dataIndex: 'identityRate',
          scopedSlots: { customRender: 'identityRate' }
        },
        {
          title: '不认同率',
          align: 'center',
          width: 100,
          dataIndex: 'disagreementRate',
          scopedSlots: { customRender: 'disagreementRate' }
        },
        {
          title: '不了解率',
          align: 'center',
          width: 100,
          dataIndex: 'unknownRate',
          scopedSlots: { customRender: 'unknownRate' }
        }
        // {
        //   title: '操作',
        //   dataIndex: 'action',
        //   align: 'center',
        //   fixed: 'right',
        //   width: 147,
        //   scopedSlots: { customRender: 'action' }
        // }
      ],
      url: {
        list: '/modules/report/reportDemocratic/getNewLeaderSummary',
        delete: '/modules/report/reportDemocratic/delete',
        deleteBatch: '/modules/report/reportDemocratic/deleteBatch',
        exportXlsUrl: '/modules/report/reportDemocratic/exportXls',
        importExcelUrl: 'modules/report/reportDemocratic/importExcel'

      },
      dictOptions: {},
      superFieldList: [],
      form: {
        assessName: '',
        currentYear: '',
        deadline: undefined
      },
      initModalVisible: false,
      btnLoading: false,
      rules: {
        assessName: [
          { required: true, message: '请输入考核名称', trigger: 'blur' }
        ],
        currentYear: [
          { required: true, message: '请输入年度', trigger: 'change' }
        ],
        deadline: [{ required: true, message: '请选择截止日期', trigger: 'change' }]
      },
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
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
    openExport() {
      this.$refs.exportModal.initData()
      this.$refs.exportModal.type = 'report'
      this.$refs.exportModal.visible = true
    },
    initDictConfig() {
    },
    handleEdit: function(record) {
      this.$refs.modalForm.edit(record)
      this.$refs.modalForm.title = '编辑'
      this.$refs.modalForm.disableSubmit = false
    },
    searchQuery() {
      let url = this.url.list + '?code=2'
      if (this.queryParam.year) {
        url = url + '&year=' + this.queryParam.year
      }
      if (this.queryParam.var1) {
        url = url + '&var1=' + this.queryParam.var1
      }
      if (this.queryParam.var2) {
        url = url + '&var2=' + this.queryParam.var2
      }
      this.loadData(url)
      // 点击查询清空列表选中行
      // https://gitee.com/jeecg/jeecg-boot/issues/I4KTU1
      this.selectedRowKeys = []
      this.selectionRows = []
    },
    searchReset() {
      this.queryParam = {}
      this.loadData()
    },

    getExcellentNumExcel() {
      let url = '/modules/report/reportDemocratic/exportExcel?code=3'
      if (this.queryParam.year) {
        url = url + '&year=' + this.queryParam.year
      }
      if (this.queryParam.var1) {
        url = url + '&var1=' + this.queryParam.var1
      }
      if (this.queryParam.var2) {
        url = url + '&var2=' + this.queryParam.var2
      }
      axios
        .post(
          url,
          {},
          { responseType: 'blob' }
        )
        .then((res) => {
          if (res && res.headers) {
            let contentDisposition = res.headers['content-disposition']
            let fileName = contentDisposition ? contentDisposition.split('filename=')[1] : 'export.xlsx'
            let realname = decodeURIComponent(fileName)
            let contentType = res.headers['content-type']
            let url = window.URL.createObjectURL(new Blob([res.data], { type: contentType }))
            let link = document.createElement('a')
            link.href = url
            link.setAttribute('download', realname) // 使用后端设置的文件名
            document.body.appendChild(link)
            link.click()
            this.$emit('over')
            document.body.removeChild(link)
          } else {
            console.error('Response headers are undefined')
          }
        })
        .catch((error) => {
          console.error('Error downloading file:', error)
        })
    },

    loadData(url) {
      if (!url) {
        url = this.url.list
      }

      this.loading = true
      getAction(url).then((res) => {
        if (res.success) {
          //update-begin---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
          this.dataSource = res.result.records || res.result
          if (res.result.total) {
            this.ipagination.total = res.result.total
          } else {
            this.ipagination.total = 0
          }
          //update-end---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
        } else {
          // this.$message.warning(res.message)
          this.$error({
            title: '错误',
            content: res.message
          })
        }
      }).finally(() => {
        this.loading = false
      })
    },
    getSuperFieldList() {
      let fieldList = []
      fieldList.push({ type: 'string', value: 'reportFillId', text: '填报id', dictCode: '' })
      fieldList.push({ type: 'string', value: 'currentYear', text: '年度', dictCode: 'assess_year' })
      fieldList.push({ type: 'string', value: 'assessName', text: '测评名称', dictCode: '' })
      fieldList.push({ type: 'sel_depart', value: 'depart', text: '单位' })
      fieldList.push({ type: 'date', value: 'startDate', text: '开始时间' })
      fieldList.push({ type: 'date', value: 'endDate', text: '结束时间' })
      fieldList.push({ type: 'int', value: 'num', text: '测评人数', dictCode: '' })
      fieldList.push({ type: 'int', value: 'filledNum', text: '已完成数量', dictCode: '' })
      this.superFieldList = fieldList
    },
    initDemocratic() {
      let date = new Date()
      let year = date.getFullYear()
      this.form.assessName = year + '一报告两评议民主测评'
      this.form.currentYear = year
      this.initModalVisible = true
    },
    onSubmit() {
      this.btnLoading = true
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          submitInitReportDemocratic(this.form).then(res => {
            if (res.success) {
              this.initModalVisible = false
              this.loadData()
            } else {
              // this.$message.error(res.message)
              // this.$confirm({
              //   title: '消息提示',
              //   content: h => <div style='color:red;'>{res.message}</div>,
              //   onOk: () => {
              //   },
              //   onCancel: () => {
              //   }
              // })
              this.$error({
                title: '错误',
                content: res.message
              })
            }
            this.btnLoading = false
          })
        } else {
          this.btnLoading = false
          return false
        }
      })
    },
    handleClose() {
      this.form.assessName = ''
      this.form.currentYear = ''
      this.form.deadline = ''
    },
    disabledDate(current) {
      // Can not select days before today and today
      return current && current < moment().endOf('day')
    },
    // 去掉小数
    toFixedO(num) {
      return Number(num.toFixed(0))
    },

    openExportFile() {
      let url = '/modules/report/assessReportNewLeader/exportExcel';
      if (this.queryParam.year) {
        url +=  '?currentYear=' + this.queryParam.year
      }
      axios
        .post(url, {}, { responseType: 'blob' })
        .then((res) => {
          if (res && res.headers) {
            let contentDisposition = res.headers['content-disposition']
            let fileName = contentDisposition ? contentDisposition.split('filename=')[1] : 'export.xlsx'
            let realname = decodeURIComponent(fileName)
            let contentType = res.headers['content-type']
            let url = window.URL.createObjectURL(new Blob([res.data], { type: contentType }))
            let link = document.createElement('a')
            link.href = url
            link.setAttribute('download', realname) // 使用后端设置的文件名
            document.body.appendChild(link)
            link.click()
            this.$emit('over')
            document.body.removeChild(link)
          } else {
            console.error('Response headers are undefined')
          }
        })
        .catch((error) => {
          console.error('Error downloading file:', error)
        })
    },

    reRank(){

      this.reRankLoading = true

      putAction('/modules/report/reportDemocratic/rerank').then(res =>{
        if (res.success) {
          this.$success({
            title: '成功',
            content: res.message
          })
          this.reRankLoading = false
          this.loadData()
        } else {
          this.$error({
            title: '操作失败',
            content: res.message
          })
          this.reRankLoading = false
        }
      })
    },



  }
}
</script>
<style scoped>
/deep/ .ant-modal-content {
  position: relative;
  background-color: rgb(246, 248, 248);
  background-clip: padding-box;
  border: 0;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  pointer-events: auto;
}

/deep/ .ant-modal-header {
  padding: 16px 24px;
  color: rgba(0, 0, 0, 0.65);
  background: rgb(246, 248, 248);
  border-bottom: 0px solid #e8e8e8;
  border-radius: 4px 4px 0 0;
}

/deep/ .ant-form-horizontal {
  position: relative;
  background-color: white;
  border: 1px solid rgb(234, 235, 234);;
  padding: 10px 0px;
}

/deep/ .ant-modal-footer {
  padding: 10px 16px;
  text-align: right;
  background: transparent;
  border-top: 0px solid #e8e8e8;
  border-radius: 0 0 4px 4px;
}

/deep/ .ant-form-item label {
  position: relative;
  margin-right: 10px;
  font-family: 思源黑体;
  font-size: 16px;
  font-weight: 500;
  color: rgb(9, 24, 52);
  text-align: right;
  margin-right: 10px;
  width: 90px;
  min-width: 90px;

}

@import '~@assets/less/common.less';
</style>