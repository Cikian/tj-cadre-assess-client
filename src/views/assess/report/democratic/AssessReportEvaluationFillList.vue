<template>
  <a-card :bordered='false'>
    <!-- 查询区域 -->
<!--    <div class='table-page-search-wrapper'>-->
<!--      <a-form layout='inline' @keyup.enter.native='searchQuery'>-->
<!--        <a-row :gutter='24'>-->
<!--          <a-col :xl='6' :lg='7' :md='8' :sm='24'>-->
<!--            <a-form-item label='年度'>-->
<!--              <t-dict-select-tag placeholder='请选择年度' v-model='queryParam.currentYear' dictCode='assess_year' />-->
<!--            </a-form-item>-->
<!--          </a-col>-->
<!--          <a-col :xl='6' :lg='7' :md='8' :sm='24'>-->
<!--            <span style='float: left; overflow: hidden' class='table-page-search-submitButtons'>-->
<!--              <a-button type='primary' @click='searchQuery' icon='search'>查询</a-button>-->
<!--              <a-button type='primary' @click='searchReset' icon='reload' style='margin-left: 8px'>重置</a-button>-->
<!--              <a @click='handleToggleSearch' style='margin-left: 8px'>-->
<!--                {{ toggleSearchStatus ? '收起' : '展开' }}-->
<!--                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />-->
<!--              </a>-->
<!--            </span>-->
<!--          </a-col>-->
<!--        </a-row>-->
<!--      </a-form>-->
<!--    </div>-->
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class='table-operator'>
<!--      <a-button @click='initDemocratic' v-has="'gbc:admin'" type='primary' icon='plus'>发起一报告两评议民主测评</a-button>-->
<!--      <a-button v-if='anonymousUserList.length > 0' @click='anonymousUserVisible = true' type='link'-->
<!--      >点击查看匿名账号-->
<!--      </a-button-->
<!--      >-->
    </div>

    <!-- table区域-begin -->
    <div>
<!--      <div class='ant-alert ant-alert-info' style='margin-bottom: 16px'>-->
<!--        <i class='anticon anticon-info-circle ant-alert-icon'></i> 已选择-->
<!--        <a style='font-weight: 600'>{{ selectedRowKeys.length }}</a-->
<!--        >项-->
<!--        <a style='margin-left: 24px' @click='onClearSelected'>清空</a>-->
<!--      </div>-->

      <a-table
        ref='table'
        size='middle'
        bordered
        rowKey='id'
        class='j-table-force-nowrap'
        :scroll='{ x: true }'
        :columns='columns'
        :dataSource='dataSource'
        :pagination='ipagination'
        :loading='loading'
        @change='handleTableChange'
      >
        <template slot='status' slot-scope='text, record'>
          <div style='width: 96%; margin: auto'>
            <!--            <a-progress :percent="toFixedO(record.filledNum / record.num * 100)" size="small" status="active" />-->
            <a-tag style='width: 66px' :color='record.filledNum/record.num === 1 ? "#87d068" : "#f81d22"'>
              {{ record.filledNum }} /
              {{ record.num }}
            </a-tag>
          </div>
        </template>

        <template slot='htmlSlot' slot-scope='text'>
          <div v-html='text'></div>
        </template>
        <template slot='imgSlot' slot-scope='text, record'>
          <span v-if='!text' style='font-size: 16px; font-style: italic'>无图片</span>
          <img
            v-else
            :src='getImgView(text)'
            :preview='record.id'
            height='25px'
            alt=''
            style='max-width: 80px; font-size: 16px; font-style: italic'
          />
        </template>
        <template slot='fileSlot' slot-scope='text'>
          <span v-if='!text' style='font-size: 16px; font-style: italic'>无文件</span>
          <a-button v-else :ghost='true' type='primary' icon='download' size='small' @click='downloadFile(text)'>
            下载
          </a-button>
        </template>

        <span slot='action' slot-scope='text, record'>
          <a @click='handleEdit(record)'>测评</a>
        </span>
      </a-table>
    </div>


    <t-modal
      :visible='anonymousUserVisible'
      title='一报告两评议民主评议匿名账号'
      :width='800'
      :simple-submit='true'
      @ok='handleClose'
      @cancel='handleClose'
    >
      <a-button type='primary' icon='file-excel' style='margin-bottom: 20px' @click='openExport()'>导出Excel</a-button>
      <a-table :columns='userColumns' :dataSource='anonymousUserList' :pagination='false' :scroll='{ y: 500 }'>
      </a-table>
    </t-modal>

    <assess-report-evaluation-fill-modal ref='modalForm' @ok='modalFormOk' />
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import AssessReportEvaluationFillModal from './modules/AssessReportEvaluationFillModal.vue'
import '@/assets/less/TableExpand.less'
import { getAnonymousAccount, submitInitReportDemocratic } from '@/api/assessApis'
import moment from 'moment'
import TModal from '@/component/TModal.vue'
import tjTitle from '@/component/TjTitle'
import { axios } from '@/utils/assessReq'
import TDictSelectTag from '@/component/TDictSelectTag.vue'

export default {
  name: 'AssessReportEvaluationFillList',
  mixins: [JeecgListMixin],
  components: {
    TDictSelectTag,
    TModal,
    AssessReportEvaluationFillModal,
    tjTitle
  },
  data() {
    return {
      anonymousUserList: [],
      anonymousUserVisible: false,
      description: '一报告两评议民主测评汇总管理页面',
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
          dataIndex: 'currentYear_dictText'
        },
        {
          title: '测评名称',
          align: 'center',
          dataIndex: 'assessName'
        },
        {
          title: '单位',
          align: 'center',
          dataIndex: 'depart_dictText'
        },
        {
          title: '结束时间',
          align: 'center',
          dataIndex: 'endDate',
          customRender: function(text) {
            return !text ? '' : text.length > 10 ? text.substr(0, 10) : text
          }
        },
        {
          title: '填报状态',
          align: 'center',
          scopedSlots: { customRender: 'status' }
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
      userColumns: [
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
          title: '处室（单位）',
          align: 'center',
          dataIndex: 'depart_dictText'
        },
        {
          title: '用户名',
          align: 'center',
          dataIndex: 'username'
        },
        {
          title: '密码',
          align: 'center',
          dataIndex: 'pwdPlainText'
        }
      ],

      url: {
        list: '/modules/report/reportDemocratic/list',
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
        assessName: [{ required: true, message: '请输入考核名称', trigger: 'blur' }],
        currentYear: [{ required: true, message: '请输入年度', trigger: 'change' }],
        deadline: [{ required: true, message: '请选择截止日期', trigger: 'change' }]
      },
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      userInfo: {}
    }
  },
  created() {
    this.getSuperFieldList()
    getAnonymousAccount('report').then((res) => {
      if (res.success) {
        this.anonymousUserList = res.result.records
      } else {
        this.anonymousUserList = []
      }
    })

    this.userInfo = JSON.parse(localStorage.getItem("pro__Login_Userinfo")).value

    if (this.userInfo.realname === '匿名用户') {
      this.columns = this.columns.filter(e => (e.title !== '填报状态'))
    }
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
    yearChange(val) {
      let year = val.target.value
      this.form.assessName = year + '一报告两评议民主测评'
    },
    onSubmit() {
      this.btnLoading = true
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          submitInitReportDemocratic(this.form).then((res) => {
            if (res.success) {
              this.initModalVisible = false
              this.anonymousUserList = res.result.records
              this.loadData()
            } else {
              // this.$message.error(res.message)
              // this.$confirm({
              //   title: '消息提示',
              //   content: (h) => <div style='color:red;'>{res.message}</div>,
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
      this.anonymousUserVisible = false
    },
    disabledDate(current) {
      // Can not select days before today and today
      return current && current < moment().endOf('day')
    },
    // 去掉小数
    toFixedO(num) {
      return Number(num.toFixed(0))
    },
    openExport() {
      axios
        .post('/modules/report/assessReportDemocracyConfig/exportExcel', {}, { responseType: 'blob' })
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
    }
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
  border: 1px solid rgb(234, 235, 234);
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
