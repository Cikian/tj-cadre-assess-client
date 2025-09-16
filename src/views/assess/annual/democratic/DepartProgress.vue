<template>
  <a-card :bordered='false'>
    <!-- 查询区域 -->
    <div class='table-page-search-wrapper'>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class='table-operator'>
      <!--      </a-dropdown>-->
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref='table'
        size='middle'
        bordered
        rowKey='id'
        class='j-table-force-nowrap'
        :scroll='{ y: 520 }'
        :columns='departColumns'
        :dataSource='dataSource'
        :pagination='false'
        :loading='loading'
        :rowSelection='{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }'
        @change='handleTableChange'
      >

        <template slot='status' slot-scope='text, record'>
          <a-tag style='width: 66px' :color="record.filledNum / record.num === 1 ? '#87d068' : '#f81d22'">
            {{ record.filledNum }} /
            {{ record.num }}
          </a-tag>
          <!--          <div style='width: 96%; margin: auto'>-->
          <!--            <a-progress :percent="toFixedO(record.filledNum / record.num * 100)" size="small" status="active" />-->
          <!--          </div>-->
        </template>

      </a-table>


    </div>
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import AssessDemocraticEvaluationSummaryModal from './modules/AssessDemocraticEvaluationSummaryModal'
import '@/assets/less/TableExpand.less'
import moment from 'moment/moment'
import { getAnonymousAccount, getAssessingInfo, submitInitDemocratic } from '@/api/assessApis'
import TModal from '@/component/TModal.vue'
import { axios } from '@/utils/assessReq'
import ProgressModal from '@/views/assess/annual/democratic/modules/ProgressModal.vue'
import { getAction } from '@/api/manage'
import TSelectUserByDep from '@/component/TSelectUserByDep.vue'
import TDictSelectTag from '@/component/TDictSelectTag.vue'

export default {
  name: 'DepartProgress',
  mixins: [JeecgListMixin],
  components: {
    TDictSelectTag,
    TSelectUserByDep,
    ProgressModal,
    TModal,
    AssessDemocraticEvaluationSummaryModal
  },
  data() {
    return {
      anonymousUserList: [],
      anonymousUserVisible: false,
      description: '民主测评汇总管理页面',
      // 表头

      departColumns: [
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
          title: '处室（单位）',
          align: 'center',
          dataIndex: 'depart_dictText',
          scopedSlots: { customRender: 'depart' }
        },
        {
          title: '截止日期',
          align: 'center',
          dataIndex: 'endDate'
        },
        {
          title: '已测评数量',
          align: 'center',
          dataIndex: 'filledNum'
        },
        {
          title: '共需测评数量',
          align: 'center',
          dataIndex: 'num'
        },
        {
          title: '测评进度',
          align: 'center',
          scopedSlots: { customRender: 'status' }
        }
      ],
      url: {
        list: '/modules/annual/democraticSummary/departP',
        delete: '/modules/annual/democraticSummary/delete',
        deleteBatch: '/modules/annual/democraticSummary/deleteBatch',
        exportXlsUrl: '/modules/annual/democraticSummary/exportXls',
        importExcelUrl: 'modules/annual/democraticSummary/importExcel'
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
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      openProgressVisible: false,
      totalData: [],
      groupData: []
    }
  },
  created() {
    this.getSuperFieldList()
    getAnonymousAccount('annual').then((res) => {
      if (res.success) {
        this.anonymousUserList = res.result.records
      } else {
        this.anonymousUserList = []
      }
    })
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    yearChange() {
      this.form.assessName = this.form.currentYear + '年度考核民主测评'
    },
    loadData() {
      getAssessingInfo("annual").then(res => {
        if (res.success){
          this.getDepartData(res.result.currentYear)
        } else {

        }
      })
    },

    getDepartData(year) {
      getAction('/modules/annual/democraticSummary/getDepartProgressByYear?year=' + year).then((res) => {
        if (res.success) {
          this.dataSource = res.result.records
        }
      })
    },

    openProgress() {
      this.$refs.progressModal.visible = true
    },
    initDictConfig() {
    },
    getSuperFieldList() {
      let fieldList = []
      fieldList.push({ type: 'string', value: 'currentYear', text: '年度', dictCode: 'assess_year' })
      fieldList.push({ type: 'string', value: 'appraisee', text: '测评对象', dictCode: 'sys_user,realname,id' })
      fieldList.push({ type: 'string', value: 'assessName', text: '测评名称', dictCode: '' })
      fieldList.push({ type: 'sel_depart', value: 'depart', text: '单位' })
      fieldList.push({ type: 'BigDecimal', value: 'score', text: '分数', dictCode: '' })
      fieldList.push({ type: 'string', value: 'type', text: '测评类型', dictCode: 'democratic_type' })
      fieldList.push({ type: 'date', value: 'startDate', text: '开始时间' })
      fieldList.push({ type: 'date', value: 'endDate', text: '结束时间' })
      this.superFieldList = fieldList
    },
    initDemocratic() {
      let date = new Date()
      let year = date.getFullYear()
      this.form.assessName = year + '年度考核民主测评'
      this.form.currentYear = year
      this.initModalVisible = true
    },
    onSubmit() {
      this.btnLoading = true
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          submitInitDemocratic(this.form).then((res) => {
            if (res.success) {
              this.initModalVisible = false
              this.anonymousUserList = res.result.records
              this.loadData()
            } else {
              // this.$message.error(res.message)
              // this.$confirm({
              //   title: '消息提示',

              //   content: (h) => <div style="color:red;">{res.message}</div>,

              //   onOk: () => {
              //   },

              //   onCancel: () => {
              //   },
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
      this.initModalVisible = false
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
        .post('/modules/annual/democraticSummary/exportExcel', {}, { responseType: 'blob' })
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
@import '~@assets/less/common.less';
</style>
