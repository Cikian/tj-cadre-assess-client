<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div v-has="'gbc:admin'" class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="5" :lg="7" :md="8" :sm="24">
            <a-form-item label="年度">
              <t-dict-select-tag @change='searchQuery' placeholder="请选择年度" v-model="queryParam.currentYear" dictCode="assess_year" />
            </a-form-item>
          </a-col>
          <a-col  :xl="5" :lg="7" :md="8" :sm="24">
            <a-form-item label="处室">
              <j-select-depart @change='searchQuery' placeholder="请选择处室" v-model="queryParam.depart" />
            </a-form-item>
          </a-col>
          <a-col :xl="5" :lg="7" :md="8" :sm="24">
            <a-form-item label="填报状态">
              <j-dict-select-tag @change='searchQuery' placeholder="请选择填报状态" v-model="queryParam.status" dictCode="report_status" />
            </a-form-item>
          </a-col>
          <a-col v-has="'gbc:admin'" :xl="4" :lg="7" :md="8" :sm="24">
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <!--              <a @click="handleToggleSearch" style="margin-left: 8px">-->
              <!--                {{ toggleSearchStatus ? '收起' : '展开' }}-->
              <!--                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>-->
              <!--              </a>-->
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="initAssess" type="primary" v-has="'gbc:admin'" icon="plus">发起考核</a-button>
<!--      <a-button type="primary" icon="download" @click="openExport()">导出新提拔干部信息</a-button>-->
      <!--      <a-button type='primary' icon='download' @click="handleExportXls('一报告两评议填报')">导出</a-button>-->
      <!--      <a-upload name='file' :showUploadList='false' :multiple='false' :headers='tokenHeader' :action='importExcelUrl'-->
      <!--                @change='handleImportExcel'>-->
      <!--        <a-button type='primary' icon='import'>导入</a-button>-->
      <!--      </a-upload>-->
      <!-- 高级查询区域 -->
      <!--      <j-super-query :fieldList='superFieldList' ref='superQueryModal'-->
      <!--                     @handleSuperQuery='handleSuperQuery'></j-super-query>-->
      <!--      <a-dropdown v-if='selectedRowKeys.length > 0'>-->
      <!--        <a-menu slot='overlay'>-->
      <!--          <a-menu-item key='1' @click='batchDel'>-->
      <!--            <a-icon type='delete' />-->
      <!--            删除-->
      <!--          </a-menu-item>-->
      <!--        </a-menu>-->
      <!--        <a-button style='margin-left: 8px'> 批量操作-->
      <!--          <a-icon type='down' />-->
      <!--        </a-button>-->
      <!--      </a-dropdown>-->
    </div>

    <!-- table区域-begin -->
    <div>
<!--      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px">-->
<!--        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择-->
<!--        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a-->
<!--        >项-->

<!--        <a style="margin-left: 24px" @click="onClearSelected">清空</a>-->
<!--      </div>-->

      <a-table
        ref="table"
        size="middle"
        :scroll="{ x: true }"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        class="j-table-force-nowrap"
        @change="handleTableChange"
      >
        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="imgSlot" slot-scope="text, record">
          <span v-if="!text" style="font-size: 16px; font-style: italic">无图片</span>
          <img
            v-else
            :src="getImgView(text)"
            :preview="record.id"
            height="25px"
            alt=""
            style="max-width: 80px; font-size: 16px; font-style: italic"
          />
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 16px; font-style: italic">无文件</span>
          <a-button v-else :ghost="true" type="primary" icon="download" size="small" @click="downloadFile(text)">
            下载
          </a-button>
        </template>

        <!-- 新增的状态列渲染模板 -->
        <template slot="status" slot-scope="text, record">
          <span
            :class="getStatusBackgroundColor(record.status_dictText)"
            :style="{ padding: '2px 4px', borderRadius: '4px' }"
          >
            {{ text }}
          </span>
        </template>

        <span slot="action" slot-scope="text, record">
          <a v-show="record.status==='1' || record.status==='4'" v-has="'depart:report'" @click="handleEdit(record)">填报</a>
          <a v-show="record.status==='2' || record.status==='3'" v-has="'depart:report'" @click="handleDetail(record)">查看</a>

          <a v-show="record.status === '2'" @click="handleEdit(record)" v-has="'depart:leader'">查看/修改</a>
          <a v-show="record.status !== '2'" @click="handleDetail(record)" v-has="'depart:leader'">查看</a>
          <a @click="handleDetail(record)" v-has="'gbc:admin'">查看</a>
<!--          <a v-has="'gbc:admin'" @click="handleDetail(record)">查看</a>-->
          <a-divider v-has="'depart:report'" v-show="record.status === '2'" type="vertical" />
          <a-divider v-has="'depart:leader'" v-show="record.status === '2'" type="vertical" />
          <a v-show="record.status === '2'" @click="openRejected(record)" v-has="'depart:leader'">退回</a>
          <a-divider v-has="'gbc:admin'" v-show="record.status === '3' && assessingInfo.assessing && assessingInfo.currentYear === record.currentYear" type="vertical" />
          <a v-show="record.status === '3' && assessingInfo.assessing && assessingInfo.currentYear === record.currentYear" @click="openRejected(record)" v-has="'gbc:admin'">退回</a>
          <a-divider v-show="record.status === '2'" type="vertical" v-has="'depart:leader'" />
          <a v-show="record.status === '2'" @click="passAudit(record)" v-has="'depart:leader'">通过</a>
        </span>
      </a-table>
    </div>

    <a-modal
      v-model="rejectedVisible"
      title="退回理由（选填）"
      ok-text="退回"
      cancel-text="取消"
      @ok="onSubmitRejected"
      @cancel="handleClose"
    >
      <a-form-model
        ref="rejectedForm"
        :model="rejectedForm"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :rules="rules"
      >
        <a-form-model-item label="退回理由" prop="rejectedRemark">
          <a-textarea v-model="rejectedForm.rejectedRemark" :autoSize="{ minRows: 4 }" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <a-modal
      v-model="passVisible"
      title=""
      ok-text="通过"
      cancel-text="取消"
      @ok="onSubmitPass"
      @cancel="handleClosePass"
    >
      <a-form-model ref="passForm" :model="passForm">
        <a-form-model-item label="审核人姓名" prop="name">
          <a-textarea v-model="passForm.name" :autoSize="{ minRows: 4 }" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <a-modal v-model="addAssessVisible" ok-text="发起" cancel-text="取消" @ok="onSubmit" @cancel="handleClose">
      <template slot="title">
        <tj-title :value="'发起一报告两评议'"></tj-title>
      </template>

      <template slot="footer">
        <a-button
          key="back"
          @click="
            addAssessVisible = false
            form.deadline = ''
          "
        >
          取消
        </a-button>
        <a-button key="submit" type="primary" :loading="btnLoading" @click="onSubmit"> 发起 </a-button>
      </template>

      <a-form-model ref="ruleForm" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules">
        <a-form-model-item label="年度" prop="currentYear">
          <a-input v-model="form.currentYear" @change="yearChange" />
        </a-form-model-item>

        <a-form-model-item label="考核名称" prop="assessName">
          <a-input v-model="form.assessName" />
        </a-form-model-item>

        <a-form-model-item label="截止日期" prop="deadline">
          <a-date-picker
            v-model="form.deadline"
            :disabled-date="disabledDate"
            type="date"
            placeholder="请选择截至日期"
            style="width: 100%"
          />
        </a-form-model-item>
        <a-form-model-item label="民主评议参加范围" prop="scope">
          <a-textarea v-model="form.scope" autosize='true'/>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <assess-report-fill-modal ref="modalForm" @ok="modalFormOk"></assess-report-fill-modal>
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import AssessReportFillModal from './modules/AssessReportFillModal'
import { getAssessingInfo, passTheReport, rejectedTheAudit, submitReportInit } from '@/api/assessApis'
import moment from 'moment/moment'
import TDictSelectTag from '@/component/TDictSelectTag.vue'

import TjTitle from '@/component/TjTitle.vue'
import { getAction } from '@/api/manage'

export default {
  name: 'AssessReportFillList',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    TDictSelectTag,
    TjTitle,
    AssessReportFillModal,
  },
  data() {
    return {
      description: '一报告两评议填报管理页面',
      queryParam: {},
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          },
        },
        {
          title: '年度',
          align: 'center',
          dataIndex: 'currentYear',
        },
        {
          title: '考核名称',
          align: 'center',
          dataIndex: 'assessName',
        },
        {
          title: '单位（处室）',
          align: 'center',
          dataIndex: 'depart_dictText',
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status_dictText',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 147,
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        list: '/modules/report/assessReportFill/list',
        delete: '/modules/report/assessReportFill/delete',
        deleteBatch: '/modules/report/assessReportFill/deleteBatch',
        exportXlsUrl: '/modules/report/assessReportFill/exportXls',
        importExcelUrl: 'modules/report/assessReportFill/importExcel',
      },
      dictOptions: {},
      superFieldList: [],

      form: {
        assessName: '',
        currentYear: '',
        deadline: undefined,
        scope: '',
      },
      scope: "原则上应与上年度一致，一般为参加领导班子和领导干部年度总结考核会议人员,基层党员干部群众代表原则上不少于10%;在职干部人数少于50人的单位，一般应组织全体干部参加。各单位参评人员实到人数一般不少于应到人数 80%。",
      addAssessVisible: false,
      btnLoading: false,
      labelCol: { span: 9 },
      wrapperCol: { span: 14 },
      rules: {
        assessName: [{ required: true, message: '请输入考核名称', trigger: 'blur' }],
        currentYear: [{ required: true, message: '请输入年度', trigger: 'change' }],
        deadline: [{ required: true, message: '请选择截止日期', trigger: 'change' }],
      },
      rejectedVisible: false,
      rejectedForm: {
        assess: 'report',
        rejectedRemark: '', // 退回理由
        assessId: '',
      },
      passVisible: false,
      passForm: {
        id: '',
        name: '',
      },
      assessingInfo: {}
    }
  },
  created() {
    this.getSuperFieldList()
    getAction('/modules/report/assessReportArrange/getScope').then((res) => {
      if (res.success) {
        if (res.result!=undefined&&res.result!=null){
          this.scope = res.result
        }
      }
    })

    getAssessingInfo("report").then(res => {
      if (res.success){
        this.assessingInfo = res.result
      }
    })

  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
  },
  methods: {
    getStatusBackgroundColor(status) {
      if (status === '待提交') {
        return 'red'
      } else if (status === '审核中') {
        return 'blue'
      } else if (status === '被退回') {
        return 'red'
      }
      return 'green' // 默认颜色
    },

    initDictConfig() {},
    handleEdit: function (record) {
      this.$refs.modalForm.edit(record)
      this.$refs.modalForm.title = '一报告两评议填报'
      this.$refs.modalForm.disableSubmit = false
    },
    getSuperFieldList() {
      let fieldList = []
      fieldList.push({ type: 'string', value: 'currentYear', text: '年度', dictCode: 'assess_year' })
      fieldList.push({ type: 'string', value: 'assessName', text: '考核名称', dictCode: '' })
      fieldList.push({ type: 'sel_depart', value: 'depart', text: '单位（处室）' })
      fieldList.push({ type: 'string', value: 'status', text: '状态', dictCode: 'report_status' })
      this.superFieldList = fieldList
    },
    yearChange(val) {
      let year = val.target.value
      this.form.assessName = year + '一报告两评议民主测评'
    },
    initAssess() {
      let date = new Date()
      let year = date.getFullYear()
      this.form.assessName = year + '年一报告两评议'
      this.form.currentYear = year
      this.addAssessVisible = true
      this.form.scope = this.scope
    },
    onSubmit() {
      this.btnLoading = true

      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          submitReportInit(this.form).then((res) => {
            if (res.success) {
              this.addAssessVisible = false
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
                content: res.message,
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

    openRejected(record) {
      this.rejectedVisible = true
      this.rejectedForm.assessId = record.id
    },

    onSubmitRejected() {
      rejectedTheAudit(this.rejectedForm).then((res) => {
        if (res.success) {
          // this.$message.success(res.message)
          this.$success({
            title: '消息提示',
            content: (h) => <div style="color:red;">{res.message}</div>,
          })
          this.loadData()
          this.rejectedVisible = false

          this.$refs.modalForm.visible = false
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
            content: res.message,
          })
          this.loadData()
        }
      })
    },
    passAudit(record) {
      // this.passVisible = true
      this.passForm.id = record.id
      this.onSubmitPass()
    },
    onSubmitPass() {
      passTheReport(this.passForm.id, this.passForm.name).then((res) => {
        if (res.success) {
          // this.$message.success(res.message)
          this.$success({
            title: '消息提示',
            content: (h) => <div style="color:red;">{res.message}</div>,
          })
          this.loadData()
          this.passVisible = false
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
            content: res.message,
          })
          this.loadData()
          this.passVisible = false
        }
      })
    },
    handleClosePass() {
      this.passForm.id = ''
      this.passForm.name = ''
    },
  },
}
</script>
<style scoped>
@import '~@assets/less/common.less';

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
  width: 120px;
  min-width: 90px;
}

/* /deep/ [data-v-08594f6a] .ant-modal-title {
    margin: 0;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
    word-wrap: break-word;
    border-left: 1px solid blue;
} */

.red {
  color: #f5222d;
  background: #fff1f0;
  border-color: #ffa39e;
}

.green {
  color: #52c41a;
  background: #f6ffed;
  border-color: #b7eb8f;
}

.blue {
  color: #1890ff;
  background: #e6f7ff;
  border-color: #91d5ff;
}
</style>
