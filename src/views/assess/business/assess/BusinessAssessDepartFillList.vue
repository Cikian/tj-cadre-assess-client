<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper" v-has="'gbc:admin'">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="年度">
              <t-dict-select-tag @change='searchQuery' placeholder="请选择年度" v-model="queryParam.currentYear" dictCode="assess_year" />
            </a-form-item>
          </a-col>
          <a-col  :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="考核处室">
              <j-select-depart @change='searchQuery' placeholder="请选择考核处室" v-model="queryParam.reportDepart" />
            </a-form-item>
          </a-col>

          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="填报状态">
              <j-dict-select-tag @change='searchQuery' placeholder="请选择填报状态" v-model="queryParam.status" dictCode="report_status" />
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">

          </template>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
<!--              <a @click="handleToggleSearch" style="margin-left: 8px">-->
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
    <div class="table-operator">
      <a-button @click="initAssess" type="primary" icon="plus" v-has="'gbc:admin'">发起业务工作测评</a-button>
      <!-- TODO 未生效-->
      <!--      <a-button type="primary" icon="download" v-has="'gbc:admin'">导出</a-button>-->
    </div>

    <a-modal
      v-model="addAssessVisible"
      title="发起业务工作测评"
      ok-text="发起"
      cancel-text="取消"
      @ok="onSubmit"
      @cancel="handleClose"
    >
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
        <a-button key="submit" type="primary" :loading="btnLoading" @click="onSubmit"> 发起</a-button>
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
      </a-form-model>
    </a-modal>

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
        bordered
        rowKey="id"
        class="j-table-force-nowrap"
        :scroll="{ x: true }"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template slot="status" slot-scope="text, record">
          <a-tag
            :color="
              record.status === 1 ? 'red' : record.status === 2 ? 'orange' : record.status === 3 ? 'green' : 'pink'
            "
          >{{ record.status_dictText }}
          </a-tag
          >
        </template>

        <!--        <span slot='status' slot-scope='status'>-->
        <!--          <a-tag color='green' v-show='status === "已完成"'>{{ status }}</a-tag>-->
        <!--          <a-tag color='orange' v-show='status === "审核中"'>{{ status }}</a-tag>-->
        <!--          <a-tag color='red' v-show='status === "待提交"'>{{ status }}</a-tag>-->
        <!--          <a-tag color='pink' v-show='status === "被退回"'>{{ status }}</a-tag>-->
        <!--        </span>-->

        <template slot="warnStatus" slot-scope="text, record">
          <a-tag :color="record.warnStatus === 1 ? '#87d068' : record.warnStatus === 2 ? '#ff5500' : '#f81d22'">{{
              text
            }}
          </a-tag>
        </template>

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

        <span slot="action" slot-scope="text, record">
          <a v-show="record.status !== 2 && record.status !== 3" @click="handleEdit(record)"
             v-has="'depart:report'">填报</a>
          <a v-show="record.status !== 1 && record.status !== 4" @click="handleDetail(record)"
             v-has="'depart:report'">查看</a>
          <a-divider v-show="record.status !== 2 && record.status !== 3" type="vertical" v-has="'depart:report'" />
          <a v-show="record.status === 2" @click="handleEdit(record)" v-has="'depart:leader'">查看/修改</a>
          <a v-show="record.status !== 2" @click="handleDetail(record)" v-has="'depart:leader'">查看</a>
          <a @click="handleDetail(record)" v-has="'gbc:admin'">查看</a>
          <a-divider v-show="record.status === 2" type="vertical" v-has="'depart:leader'" />
          <a v-show="record.status === 2" @click="openRejected(record)" v-has="'depart:leader'">退回</a>
          <a-divider v-show="record.status === 2" type="vertical" v-has="'depart:leader'" />
          <a v-show="record.status === 2" @click="passAudit(record)" v-has="'depart:leader'">通过</a>
<!--          <a v-show="record.status === 2" @click="passAudit(record)">通过</a>-->

          <!--          <a-divider type="vertical" />-->
          <!--          <a-dropdown>-->
          <!--            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>-->
          <!--            <a-menu slot="overlay">-->
          <!--              <a-menu-item>-->
          <!--                <a @click="handleDetail(record)">详情</a>-->
          <!--              </a-menu-item>-->
          <!--              <a-menu-item>-->
          <!--                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">-->
          <!--                  <a>删除</a>-->
          <!--                </a-popconfirm>-->
          <!--              </a-menu-item>-->
          <!--            </a-menu>-->
          <!--          </a-dropdown>-->
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
      <a-form-model ref="passForm" style="padding-top: 40px" :model="passForm" :label-col="labelCol"
                    :wrapper-col="wrapperCol">
        <a-form-model-item label="审核人姓名" prop="name">
          <a-textarea v-model="passForm.name" :autoSize="{ minRows: 4 }" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <business-assess-depart-fill-modal
      @rejectedAudit="rejectedAudit"
      @submitAndConfirm="testA"
      ref="modalForm"
      @ok="modalFormOk"
    />
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import BusinessAssessDepartFillModal from './modules/BusinessAssessDepartFillModal'
import { filterMultiDictText } from '@/components/dict/JDictSelectUtil'
import '@/assets/less/TableExpand.less'
import { submitBusinessFill, passTheAudit, rejectedTheAudit } from '@/api/assessApis'
import moment from 'moment/moment'
import TDictSelectTag from '@/component/TDictSelectTag.vue'

export default {
  name: 'BusinessAssessDepartFillList',
  mixins: [JeecgListMixin],
  components: {
    TDictSelectTag,
    BusinessAssessDepartFillModal
  },
  data() {
    return {
      description: '业务工作测评填报列表管理页面',
      formDisabled: false,
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
          title: '考核名称',
          align: 'center',
          dataIndex: 'assessName'
        },
        {
          title: '年度',
          align: 'center',
          dataIndex: 'currentYear'
        },
        {
          title: '截止日期',
          align: 'center',
          dataIndex: 'deadline',
          customRender: function(text) {
            return !text ? '' : text.length > 10 ? text.substr(0, 10) : text
          }
        },
        {
          title: '考核处室',
          align: 'center',
          dataIndex: 'reportDepart_dictText'
        },
        // {
        //   title:'被考核处室',
        //   align:"center",
        //   dataIndex: 'assessDepart_dictText'
        // },
        // {
        //   title: '预警状态',
        //   align: 'center',
        //   dataIndex: 'warnStatus_dictText',
        //   scopedSlots: { customRender: 'warnStatus' }
        // },
        {
          title: '填报状态',
          align: 'center',
          dataIndex: 'status_dictText',
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
      url: {
        list: '/modules/businessAssessDepartFill/listDistRole',
        delete: '/modules/businessAssessDepartFill/delete',
        deleteBatch: '/modules/businessAssessDepartFill/deleteBatch',
        exportXlsUrl: '/modules/businessAssessDepartFill/exportXls',
        importExcelUrl: 'modules/businessAssessDepartFill/importExcel'
      },
      dictOptions: {},
      superFieldList: [],
      addAssessVisible: false,
      rejectedVisible: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      assessData: [],
      form: {
        assessName: '',
        currentYear: '',
        deadline: undefined
      },
      rejectedForm: {
        assess: 'business',
        rejectedRemark: '', // 退回理由
        assessId: ''
      },

      rules: {
        assessName: [{ required: true, message: '请输入考核名称', trigger: 'blur' }],
        currentYear: [{ required: true, message: '请输入年度', trigger: 'change' }],
        deadline: [{ required: true, message: '请选择截止日期', trigger: 'change' }]
      },

      // 发起考核表单发起按钮加载
      btnLoading: false,
      passVisible: false,
      passForm: {
        id: '',
        name: ''
      }
    }
  },
  created() {
    this.getSuperFieldList()
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },

    statusColorClass() {
      if (this.queryParam.status === '待提交') {
        return 'status-pending'
      } else if (this.queryParam.status === '审核中') {
        return 'status-submitted'
      }
      return ''
    }
  },
  methods: {
    initDictConfig() {
    },
    getSuperFieldList() {
      let fieldList = []
      fieldList.push({ type: 'string', value: 'assessName', text: '考核名称', dictCode: '' })
      fieldList.push({ type: 'string', value: 'currentYear', text: '年度', dictCode: '' })
      fieldList.push({ type: 'date', value: 'deadline', text: '截止日期' })
      fieldList.push({ type: 'sel_depart', value: 'reportDepart', text: '考核处室' })
      fieldList.push({ type: 'sel_depart', value: 'assessDepart', text: '被考核处室' })
      fieldList.push({ type: 'int', value: 'warnStatus', text: '预警状态', dictCode: 'assess_warn_status' })
      fieldList.push({ type: 'int', value: 'status', text: '填报状态', dictCode: 'report_status' })
      this.superFieldList = fieldList
    },
    initAssess() {
      let date = new Date()
      let year = date.getFullYear()
      this.form.assessName = year + '年业务工作测评'
      this.form.currentYear = year
      this.addAssessVisible = true
    },
    hideModal() {
      this.addAssessVisible = false
    },
    yearChange() {
      this.form.assessName = this.form.currentYear + '年业务工作测评'
    },
    onSubmit() {
      this.btnLoading = true
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          submitBusinessFill(this.form).then((res) => {
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
    openRejected(record) {
      this.rejectedVisible = true
      this.rejectedForm.assessId = record.id
    },
    onSubmitRejected() {
      rejectedTheAudit(this.rejectedForm).then((res) => {
        if (res.success) {
          // this.$message.success(res.message)
          // this.$confirm({
          //   title: '消息提示',

          //   content: (h) => <div style="color:red;">{res.message}</div>,

          //   onOk: () => {
          //   },

          //   onCancel: () => {
          //   }
          // })
          this.$success({
            title: '成功',
            content: res.message
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
          //   }
          // })
          this.$error({
            title: '错误',
            content: res.message
          })
          this.loadData()
        }
      })
    },

    handleEdit: function(record) {
      this.$refs.modalForm.edit(record)
      this.$refs.modalForm.title = '业务工作测评填报'
      // this.$refs.modalForm.disableSubmit = true
      // this.formDisabled = true
    },

    testA() {
    },
    rejectedAudit(assessId) {
      let record = {
        id: assessId
      }
      this.openRejected(record)
    },
    handleClose() {
      this.form.assessName = ''
      this.form.currentYear = ''
      this.form.deadline = ''
      this.rejectedForm.assessId = ''
      this.rejectedForm.rejectedRemark = ''
    },

    checkAndEdit(record) {
      this.$refs.modalForm.edit(record)
      this.$refs.modalForm.title = '业务工作测评填报审核'
      this.$refs.modalForm.disableSubmit = false

    },
    passAudit(record) {
      // this.passVisible = true
      this.passForm.id = record.id
      this.onSubmitPass()
    },
    onSubmitPass() {
      passTheAudit(this.passForm.id, this.passForm.name).then((res) => {
        if (res.success) {
          // this.$message.success(res.message)
          // this.$confirm({
          //   title: '消息提示',

          //   content: (h) => <div style="color:red;">{res.message}</div>,

          //   onOk: () => {
          //   },

          //   onCancel: () => {
          //   }
          // })
          this.$success({
            title: '成功',
            content: res.message
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
          //   }
          // })
          this.$error({
            title: '错误',
            content: res.message
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

    disabledDate(current) {
      // Can not select days before today and today
      return current && current < moment().endOf('day')
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
