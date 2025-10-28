<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="5" :lg="7" :md="8" :sm="24">
            <a-form-item label="年度">
              <t-dict-select-tag placeholder="请选择年度" v-model="queryParam.currentYear" dictCode="assess_year" />
            </a-form-item>
          </a-col>
          <a-col  :xl="5" :lg="7" :md="8" :sm="24" v-has="'gbc:admin'">
            <a-form-item label="处室">
              <j-select-depart placeholder="请选择处室" v-model="queryParam.departmentCode" />
            </a-form-item>
          </a-col>
<!--          <a-col :xl="5" :lg="7" :md="8" :sm="24">-->
<!--            <a-form-item label="预警状态">-->
<!--              <j-dict-select-tag placeholder="请选择预警状态" v-model="queryParam.warnStatus" dictCode="warn_status" />-->
<!--            </a-form-item>-->
<!--          </a-col>-->
          <a-col :xl="5" :lg="7" :md="8" :sm="24" v-has="'gbc:admin'">
            <a-form-item label="填报状态">
              <j-dict-select-tag placeholder="请选择填报状态" v-model="queryParam.status" dictCode="report_status" @change="searchQuery" />
            </a-form-item>
          </a-col>
          <a-col :xl="4" :lg="7" :md="8" :sm="24">
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <!--      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>-->
      <!--      <a-button type="primary" icon="download" @click="handleExportXls('平时考核填报')">导出</a-button>-->
      <!--      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">-->
      <!--        <a-button type="primary" icon="import">导入</a-button>-->
      <!--      </a-upload>-->
<!--      <a-button @click="handleStartProcess" type="primary" v-has="'rsc:admin'" icon="import"> 发起考核流程</a-button>-->
      <!-- 高级查询区域 -->
      <!--      <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query>-->
      <!--      <a-dropdown v-if="selectedRowKeys.length > 0">-->
      <!--        <a-menu slot="overlay">-->
      <!--          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>-->
      <!--        </a-menu>-->
      <!--        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>-->
      <!--      </a-dropdown>-->
    </div>

    <!-- table区域-begin -->
    <div>
      <!--      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">-->
      <!--        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项-->
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
          <a v-show="(record.status == '1' || record.status == '4') && assessingInfo.assessing" v-has="'depart:report'"
             @click="handleEdit(record)">填报</a>
<!--          <a @click="handleEdit(record)">填报</a>-->
          <a v-show="record.status == '2' || record.status == '3' || !assessingInfo.assessing" v-has="'depart:report'" @click="handleDetail(record)">详情</a>

          <a-divider v-show="record.status == '1' || record.status == '4'" type="vertical" v-has="'depart:leader'" />
          <a-divider v-show="record.status == '2' || record.status == '3'" type="vertical" v-has="'depart:leader'" />

          <a v-show="record.status != '2' || !assessingInfo.assessing" @click="handleDetail(record)" v-has="'depart:leader'">详情</a>
          <a @click="handleDetail(record)" v-has="'gbc:admin'">详情</a>
          <a @click="handleDetail(record)" v-has="'rsc:admin'">详情</a>
          <a v-show="record.status == '2' && assessingInfo.assessing" @click="handleEdit(record)" v-has="'depart:leader'">查看/修改</a>

          <a-divider type="vertical" v-show="record.status == '2'" v-has="'depart:leader'" />

          <a-popconfirm title="确定退回吗?" @confirm="() => handleReject(record.id)">
            <a v-show="record.status == '2'" v-has="'depart:leader'">退回</a>
          </a-popconfirm>

          <a-divider type="vertical" v-show="record.status == '2'" v-has="'depart:leader'" />

            <a @click='handlePass(record.id)' v-show="record.status == '2'" v-has="'depart:leader'">通过</a>
<!--            <a @click='handlePass(record.id)' v-show="record.status == '2'" >通过</a>-->

          <a-divider type="vertical" v-show="record.status == '2'" v-has="'depart:leader'" />
        </span>

        <template slot="status_dictText" slot-scope="text, record">
          <a-tag
            :color="
              record.status === '1'
                ? 'red'
                : record.status === '2'
                ? 'orange'
                : record.status === '3'
                ? 'green'
                : 'pink'
            "
          >{{ record.status_dictText }}
          </a-tag
          >
        </template>

        <template slot="warnStatus" slot-scope="text, record">
          <a-tag :color="record.warnStatus === '1' ? '#87d068' : record.warnStatus === '2' ? '#ff5500' : '#f81d22'">{{
              text
            }}
          </a-tag>
        </template>
      </a-table>
    </div>

    <a-modal
      v-model="rejectedVisible"
      title=""
      ok-text="通过"
      cancel-text="取消"
      @ok="onSubmitRejected"
      @cancel="handleClose"
    >
      <a-form-model ref="rejectedForm" :model="rejectedForm">
        <a-form-model-item label="审核人姓名" prop="name">
          <a-textarea v-model="rejectedForm.name" :autoSize="{ minRows: 4 }" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <assess-regular-report-modal ref="modalForm" @ok="modalFormOk" />
    <assess-regular-process-modal ref="processModalForm" @ok="processModalFormOk" />
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import AssessRegularReportModal from './modules/AssessRegularReportModal'
import AssessRegularProcessModal from './modules/AssessRegularProcessModal'
import { getAction } from '@/api/manage'
import '@/assets/less/TableExpand.less'
import TDictSelectTag from '@/component/TDictSelectTag.vue'
import { getAssessingInfo } from '@/api/assessApis'

export default {
  name: 'AssessRegularReportList',
  mixins: [JeecgListMixin],
  components: {
    TDictSelectTag,
    AssessRegularProcessModal,
    AssessRegularReportModal
  },
  data() {
    return {
      description: '平时考核填报管理页面',
      queryParam: {},
      rejectedVisible: false,
      rejectedForm: {
        id: '',
        name: ''
      },
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 40,
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
          dataIndex: 'currentYear_dictText'
        },
        {
          title: '季度',
          align: 'center',
          dataIndex: 'currentQuarter_dictText'
        },
        {
          title: '处室',
          align: 'center',
          dataIndex: 'departmentCode_dictText'
        },
        {
          title: '截止日期',
          align: 'center',
          dataIndex: 'deadline'
        },
        // {
        //   title: '预警状态',
        //   align: 'center',
        //   dataIndex: 'warnStatus_dictText',
        //   scopedSlots: { customRender: 'warnStatus' },
        // },
        {
          title: '填报状态',
          align: 'center',
          dataIndex: 'status_dictText',
          scopedSlots: { customRender: 'status_dictText' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 200,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/regular/report/list',
        delete: '/regular/report/delete',
        deleteBatch: '/regular/report/deleteBatch',
        exportXlsUrl: '/regular/report/exportXls',
        importExcelUrl: '/regular/report/importExcel'
      },
      dictOptions: {},
      superFieldList: [],
      assessingInfo: {}
    }
  },
  created() {
    this.getSuperFieldList()
    getAssessingInfo("regular").then(res => {
      if (res.success) {
        this.assessingInfo = res.result
      }
    })
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
      fieldList.push({ type: 'string', value: 'assessName', text: '考核名称', dictCode: '' })
      fieldList.push({ type: 'string', value: 'currentYear', text: '年度', dictCode: 'assess_year' })
      fieldList.push({ type: 'string', value: 'currentQuarter', text: '季度', dictCode: 'assess_quarter' })
      fieldList.push({ type: 'sel_depart', value: 'departmentCode', text: '处室' })
      fieldList.push({ type: 'datetime', value: 'deadline', text: '截止日期' })
      fieldList.push({ type: 'string', value: 'warnStatus', text: '预警状态', dictCode: 'warn_status' })
      fieldList.push({ type: 'string', value: 'status', text: '填报状态', dictCode: 'report_status' })
      fieldList.push({ type: 'string', value: 'reportPerson', text: '填报人', dictCode: '' })
      this.superFieldList = fieldList
    },
    handleStartProcess() {
      this.$refs.processModalForm.add()
      this.$refs.processModalForm.title = '发起平时考核'
      this.$refs.processModalForm.disableSubmit = false
    },
    processModalFormOk() {
      this.$refs.processModalForm.close()
      this.loadData()
    },
    handlePass(id) {
      // this.rejectedVisible = true
      this.rejectedForm.id = id
      this.onSubmitRejected()
    },
    onSubmitRejected() {
      getAction(`/regular/report/approveRequest?id=${this.rejectedForm.id}&name=${this.rejectedForm.name}`).then(
        (res) => {
          if (res.success) {
            // this.$message.success(res.message)
            this.$success({
              title: '操作成功',
              content: res.message
            })
            this.loadData()
            this.rejectedVisible = false
          } else {
            // this.$message.error(res.message)
            this.$error({
              title: '错误',
              content: res.message
            })
          }
        }
      )
      this.handleClose()
    },
    handleClose() {
      this.rejectedForm.id = ''
      this.rejectedForm.name = ''
    },
    handleReject(id) {
      getAction(`/regular/report/reject?id=${id}`).then((res) => {
        if (res.success) {
          // this.$message.success(res.message)
          this.$success({
            title: '操作成功',
            content: res.message
          })
          this.loadData()
        } else {
          // this.$message.error(res.message)
          this.$error({
            title: '错误',
            content: res.message
          })
        }
      })
    }
    // handleReject(id) {
    //   getAction(`/regular/report/reject?id=${id}`).then((res) => {
    //     if (res.success) {
    //       this.$message.success(res.message)
    //       this.loadData()
    //     } else {
    //       this.$message.error(res.message)
    //     }
    //   })
    // },
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';

p {
  color: #db733c;
}
</style>
