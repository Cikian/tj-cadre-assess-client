<template>
  <div class="page-header-index-wide">
    <div style="font-weight: 700;font-size: 30px;margin: 10px 10px;display: flex;align-items: center;">
      <img style="width: 35px;height: 35px;margin: 5px 5px;" src="../../assets/list.png" alt="">
      当前考核
    </div>
    <a-row :gutter="24">

      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px',position:relative }"
             v-if="this.regularIndexLeaderlist">
        <div style="width: 35px;height: 35px;margin: 5px 5px;position: absolute;top:10px;right: 40px;z-index: 3;">
          <img src="../../assets/组合 1184.png" alt="">
        </div>
        <chart-card style="height: 160px;border-radius: 20px" :loading="loading" title="平时考核"
                    :total="regularcomputed+'%'">
          <!-- <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip> -->


          <div>
            <mini-progress color="rgb(2, 96, 254)" :target="regularcomputed" :percentage="regularcomputed"
                           :height="8" />
          </div>

          <template slot="footer" style="display: flex;align-items: center;">
            <div style="display: flex; justify-content: space-between; width: 100%">
              <div style="display: flex;">
                <div flag="down" style="margin-right: 16px;;display: flex;align-items: center;">
                  <!-- <div style="width: 10px;height: 10px;background-color: green;border-radius: 50%;"></div> -->
                  <span slot="term">已完成</span>
                  <span style="color: rgb(22, 201, 121);font-weight: 600;margin-left: 2px;">
                    {{ regularIndexLeaderlist.complete }}
                  </span>
                </div>
                <div flag="up" style="margin-right: 16px;display: flex;align-items: center;">
                  <!-- <div style="width: 10px;height: 10px;background-color: red;border-radius: 50%;"></div> -->
                  <span slot="term">未完成</span>
                  <span style="color: rgb(252, 164, 19);font-weight: 600;margin-left: 2px;">
                    {{ regularIndexLeaderlist.uncompleted }}
                  </span>

                </div>
              </div>
              <div>
                <a-dropdown>
                  <div class="stop-assess">结束平时考核</div>
                  <a-menu slot="overlay">
                    <a-menu-item @click="stopAssessing('regular')">
                      <div style="width: 50px" class="stop-assess">结束</div>
                    </a-menu-item>
                    <a-menu-item @click="revocation('regular')">
                      <div style="width: 50px; background-color: #ff6715" class="stop-assess">撤回
                      </div>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </div>
            </div>
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }" v-if="this.regularIndexLeaderlist===null">
        <div style="width: 35px;height: 35px;margin: 5px 5px;position: absolute;top:10px;right: 40px;z-index: 3;">
          <img src="../../assets/组合 1184.png" alt="">
        </div>
        <chart-card style="height: 160px;font-size: 20px;" :loading="loading" title="平时考核">
          当前无正在进行的平时考核
          <template slot="footer">
            <div style="display: flex;align-items: center; justify-content: right; height: 100%">
              <div style="background-color: #ff4d00" @click="downloadDepartName" type="primary" icon="import"
                   class="finallyb">下载标准简称
              </div>

              <div style="background-color: #ff4d00" @click='downloadFile("/template/发起平时考核上传人员模板.xlsx")'
                   type="primary" icon="import" class="finallyb"> 下载上传模板
              </div>

              <div @click="handleStartProcess" type="primary" v-has="'rsc:admin'" icon="import" class="finallyb"> 发起平时考核
              </div>
            </div>
          </template>
        </chart-card>
      </a-col>


    </a-row>


    <div style="font-weight: 700;font-size: 30px;margin: 10px 10px;display: flex;align-items: center;">
      <img style="width: 35px;height: 35px;margin: 5px 5px;" src="../../assets/list.png" alt="">快捷入口
    </div>
    <a-row :gutter="24" class="bgcenter" style="display: flex;flex-wrap: wrap; ">
      <div style="width: 30%;margin: 5px 20px;" :style="{ marginBottom: '24px' }" v-for="item in settinglist">
        <router-link :to="item.route" style="text-decoration: none; color: inherit;">
          <div style="background-color: white;width:100%;height:100px;display: flex;border-radius: 20px;">
            <div
              style="padding: 10px 10px;font-weight: 700;display: flex;align-items: center;width:20%;justify-content: right;">
              <img style="width:60px;height:60px" :src="item.img" alt="">
            </div>
            <div style="width:80%">
              <div style="padding: 10px 10px;font-weight: 700;font-size: 20px;text-align: left;">
                {{ item.name }}
              </div>
              <div style="padding: 5px 10px;text-align: left;font-size: 14px;">
                {{ item.text }}
              </div>

            </div>
          </div>
        </router-link>
      </div>

    </a-row>
    <div style="font-weight: 700;font-size: 30px;margin: 10px 10px;display: flex;align-items: center;">
      <img style="width: 35px;height: 35px;margin: 5px 5px;" src="../../assets/list.png" alt=""> 当前未填报处室（单位）信息
    </div>
    <a-row :gutter="12">
      <a-card :loading="loading" :class="{ 'anty-list-cust':true }" :bordered="false" :style="{ marginTop: '24px' }">

        <a-tabs v-model="indexBottomTab" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
          <!-- <div class="extra-wrapper" slot="tabBarExtraContent">
            <a-radio-group v-model="indexRegisterType" @change="changeRegisterType">
              <a-radio-button value="转移登记">转移登记</a-radio-button>
              <a-radio-button value="抵押登记">抵押登记</a-radio-button>
              <a-radio-button value="">所有</a-radio-button>
            </a-radio-group>
          </div> -->

          <a-tab-pane loading="true" tab="平时考核" key="1">


            <a-table :pagination="false" :dataSource="dataSource1" rowKey="id" :columns="columns"
                     style="height:400px;overflow-y: scroll;">
              <template slot="deadline" slot-scope="text, record, index">
                {{ formatDeadline(text) }}
              </template>
            </a-table>
          </a-tab-pane>
        </a-tabs>


      </a-card>
    </a-row>
    <assess-regular-process-modal ref="processModalForm" @ok="processModalFormOk" />
    <a-modal
      v-model="annualAssessVisible"
      title="发起年度考核"
      :width="700"
      ok-text="发起"
      cancel-text="取消"
      @ok="onSubmitAnnual"
      @cancel="handleClose"
    >
      <template slot="footer">
        <a-button
          key="back"
          @click="
            annualAssessVisible = false
            form.deadline = ''
          "
        >
          取消
        </a-button>
        <a-button key="submit" type="primary" :loading="btnLoading" @click="onSubmitAnnual"> 发起</a-button>
      </template>

      <a-form-model ref="ruleForm" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="annualRules">
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
      <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="head"
        :action="importExcelUrl"
        @change="handleImportExcel"
        v-if="form.currentYear && form.assessName"
      >
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>

      <a style="display: inline-block; margin-left: 20px" v-if="showresult" @click="showtable = true"
      >解析成功，点击查看结果</a
      >

      <div v-if="showtable" style="height: 350px; margin-top: 10px">
        <a-table
          :scroll="{ y: 300 }"
          :columns="[
            { title: '姓名', dataIndex: 'person', key: 'person', width: '30%', align: 'center' },
            { title: '性别', dataIndex: 'sex_dictText', key: 'sex_dictText', width: '30%', align: 'center' },

            {
              title: '单位',
              dataIndex: 'depart_dictText',
              key: 'depart_dictText',
              align: 'center',
              scopedSlots: { customRender: 'depart' },
            },
          ]"
          :dataSource="itemList"
          :pagination="false"
          :rowKey="record => itemList.findIndex(item => item === record)"
        >
          <template slot="birth" slot-scope="text, record, index">
            <div>
              {{ formatDate(text) }}
            </div>
          </template>
          <template slot="depart" slot-scope="text, record, index">
            <div class="truncate-text">
              {{ text }}
            </div>
          </template>
        </a-table>
      </div>
    </a-modal>
    <a-modal
      v-model="addAssessVisible"
      title="发起业务工作测评"
      ok-text="发起"
      cancel-text="取消"
      @ok="onSubmit2"
      @cancel="handleClose"
    >
      <template slot="footer">
        <a-button
          key="back"
          @click="
            addAssessVisible = false
            form2.deadline = ''
          "
        >
          取消
        </a-button>
        <a-button key="submit" type="primary" :loading="btnLoading" @click="onSubmit2"> 发起</a-button>
      </template>

      <a-form-model ref="ruleForm2" :model="form2" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules2">
        <a-form-model-item label="年度" prop="currentYear">
          <a-input v-model="form2.currentYear" @change="yearChange2" />
        </a-form-model-item>
        <a-form-model-item label="考核名称" prop="assessName">
          <a-input v-model="form2.assessName" />
        </a-form-model-item>

        <a-form-model-item label="截止日期" prop="deadline">
          <a-date-picker
            v-model="form2.deadline"
            :disabled-date="disabledDate"
            type="date"
            placeholder="请选择截至日期"
            style="width: 100%"
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <a-modal :width="1200" v-model="addAssessVisible3" ok-text="发起" cancel-text="取消" @ok="onSubmit3"
             @cancel="handleClose">
      <template slot="title">
        <tj-title :value="'发起一报告两评议'"></tj-title>
      </template>

      <template slot="footer">
        <a-button
          key="back"
          @click="
            addAssessVisible3 = false
            form3.deadline = ''
          "
        >
          取消
        </a-button>
        <a-button key="submit" type="primary" :loading="btnLoading" @click="onSubmit3"> 发起</a-button>
      </template>

      <a-form-model ref="ruleForm3" :model="form3" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules2">
        <a-form-model-item label="年度" prop="currentYear">
          <a-input v-model="form3.currentYear" @change="yearChange3" />
        </a-form-model-item>

        <a-form-model-item label="考核名称" prop="assessName">
          <a-input v-model="form3.assessName" />
        </a-form-model-item>

        <a-form-model-item label="截止日期" prop="deadline">
          <a-date-picker
            v-model="form3.deadline"
            :disabled-date="disabledDate"
            type="date"
            placeholder="请选择截至日期"
            style="width: 100%"
          />
        </a-form-model-item>
        <a-form-model-item label="民主评议参加范围" prop="scope">
          <a-textarea v-model="form3.scope" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import ChartCard from '@/components/ChartCard'
import ACol from 'ant-design-vue/es/grid/Col'
import ATooltip from 'ant-design-vue/es/tooltip/Tooltip'
import MiniArea from '@/components/chart/MiniArea'
import MiniBar from '@/components/chart/MiniBar'
import MiniProgress from '@/components/chart/MiniProgress'
import RankList from '@/components/chart/RankList'
import Bar from '@/components/chart/Bar'
import LineChartMultid from '@/components/chart/LineChartMultid'
import HeadInfo from '@/components/tools/HeadInfo.vue'
import { getAction, getFileAccessHttpUrl } from '@/api/manage'
import Trend from '@/components/Trend'
import { getLoginfo, getVisitInfo } from '@/api/api'
import AssessRegularProcessModal from '@/views/assess/regular/report/modules/AssessRegularProcessModal.vue'
import { revocationAssess, stopAssess, submitAnnualFill, submitBusinessFill, submitReportInit } from '@/api/assessApis'
import moment from 'moment/moment'
import Vue from 'vue'
import { ACCESS_TOKEN, TENANT_ID } from '@/store/mutation-types'
import TjTitle from '@/component/TjTitle.vue'
import { axios } from '@/utils/assessReq'

const rankList = []
for (let i = 0; i < 7; i++) {
  rankList.push({
    name: '白鹭岛 ' + (i + 1) + ' 号店',
    total: 1234.56 - i * 100
  })
}
const barData = []
for (let i = 0; i < 12; i += 1) {
  barData.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200
  })
}
export default {
  name: 'IndexChart',
  components: {
    TjTitle,
    AssessRegularProcessModal,
    ATooltip,
    ACol,
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress,
    RankList,
    Bar,
    Trend,
    LineChartMultid,
    HeadInfo
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
    regularcomputed() {
      // 将小数转换为百分比格式，并返回数值类型
      return parseFloat((this.regularIndexLeaderlist.percent * 100).toFixed(0))
    },
    businesscomputed() {
      // 将小数转换为百分比格式，并返回数值类型
      return parseFloat((this.businessIndexLeaderlist.percent * 100).toFixed(0))
    },
    annualcomputed() {
      // 将小数转换为百分比格式，并返回数值类型
      return parseFloat((this.annualIndexLeaderlist.percent * 100).toFixed(0))
    },
    reportcomputed() {
      // 将小数转换为百分比格式，并返回数值类型
      return parseFloat((this.reportIndexLeaderlist.percent * 100).toFixed(0))
    }

  },
  data() {
    return {
      settinglist: [

        {
          name: '领导分管处室配置',
          text: '设置及修改各局领导分管的处室（单位）',
          route: '/sys/config/leaderBond',
          img: require('@/assets/组合 1197.png')
        }
      ],
      loading: true,
      cardCount: {
        sll: 100,
        bjl: 87,
        isll: 15,
        ibjl: 9
      },

      todaySll: 60,
      todayBjl: 54,
      todayISll: 13,
      todayIBjl: 7,

      chartData: {
        sll: [],
        bjl: [],
        isll: [],
        ibjl: []
      },

      diskInfo: [
        { name: 'C盘', restPPT: 7 },
        { name: 'D盘', restPPT: 5 }
      ],

      registerTypeList: [{
        text: '业务受理'
      }, {
        text: '业务管理'
      }, {
        text: '文件管理'
      }, {
        text: '信息查询'
      }],
      rules2: {
        assessName: [{ required: true, message: '请输入考核名称', trigger: 'blur' }],
        currentYear: [{ required: true, message: '请输入年度', trigger: 'change' }],
        deadline: [{ required: true, message: '请选择截止日期', trigger: 'change' }]
      },
      dataSource1: [],
      dataSource2: [],
      dataSource3: [],
      dataSource4: [],
      columns: [
        {
          title: '年度',
          align: 'center',
          dataIndex: 'currentYear'
        },
        {
          title: '名称',
          align: 'center',
          dataIndex: 'assessName'
        },
        {
          title: '单位',
          align: 'center',
          dataIndex: 'departmentCode'
        },
        {
          title: '截止日期',
          align: 'center',
          dataIndex: 'deadline',
          scopedSlots: { customRender: 'deadline' }
        }],
      columns1: [
        {
          title: '年度',
          align: 'center',
          dataIndex: 'currentYear'
        },
        {
          title: '名称',
          align: 'center',
          dataIndex: 'assessName'
        },
        {
          title: '单位',
          align: 'center',
          dataIndex: 'reportDepart'
        },
        {
          title: '截止日期',
          align: 'center',
          dataIndex: 'deadline',
          scopedSlots: { customRender: 'deadline' }
        }],
      columns2: [
        {
          title: '年度',
          align: 'center',
          dataIndex: 'currentYear'
        },
        {
          title: '名称',
          align: 'center',
          dataIndex: 'assessName'
        },
        {
          title: '单位',
          align: 'center',
          dataIndex: 'depart'
        },
        {
          title: '截止日期',
          align: 'center',
          dataIndex: 'deadline',
          scopedSlots: { customRender: 'deadline' }
        }],
      ipagination1: {
        current: 1,
        pageSize: 5,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0

      },
      ipagination2: {
        current: 1,
        pageSize: 5,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      indexRegisterType: '转移登记',
      indexBottomTab: '1',
      center: null,
      rankList,
      barData,
      loginfo: {},
      visitFields: ['ip', 'visit'],
      visitInfo: [],
      indicator: <a-icon type="loading" style="font-size: 24px" spin />,
      regularIndexLeaderlist: {},
      businessIndexLeaderlist: {},
      annualIndexLeaderlist: {},
      reportIndexLeaderlist: {},
      form: {
        assessName: '',
        currentYear: '',
        deadline: undefined
      },
      form2: {
        assessName: '',
        currentYear: '',
        deadline: undefined
      },
      form3: {
        assessName: '',
        currentYear: '',
        deadline: undefined,
        scope: ''
      },
      scope: '',
      annualAssessVisible: false,
      btnLoading: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      annualRules: {
        assessName: [{ required: true, message: '请输入考核名称', trigger: 'blur' }],
        currentYear: [{ required: true, message: '请输入年度', trigger: 'change' }],
        deadline: [{ required: true, message: '请选择截止日期', trigger: 'change' }]
      },
      showresult: false,
      showtable: false,
      head: {},
      itemList: [],
      url: {
        exportXlsUrl: '/modules/annual/assessAnnualFill/exportXls',
        importExcelUrl: 'modules/annual/assessAnnualFill/getExcelData'
      },
      addAssessVisible: false,
      addAssessVisible3: false

    }
  },
  created() {
    // 获取接口信息
    this.loadData()
    // this.loadDataSource1()
    // this.loadDataSource2()

    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
    this.initLogInfo()

    getAction('/modules/report/assessReportArrange/getScope').then((res) => {
      if (res.success) {
        this.scope = res.result
      }
    })
  },
  watch: {
    form: {
      handler(newValue) {
        this.head['year'] = newValue.currentYear
        this.head['X-Access-Token'] = Vue.ls.get(ACCESS_TOKEN)
        let tenantid = Vue.ls.get(TENANT_ID)
        if (tenantid) {
          this.head['tenant-id'] = tenantid
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    yearChange() {
      this.form.assessName = this.form.currentYear + '年度考核'
    },
    yearChange2() {
      this.form2.assessName = this.form2.currentYear + '年业务工作测评'
    },
    yearChange3() {
      this.form3.assessName = this.form3.currentYear + '年一报告两评议'
    },
    handleClose() {
      this.form.assessName = ''
      this.form.currentYear = ''
      this.form.deadline = ''
      this.form2.assessName = ''
      this.form2.currentYear = ''
      this.form2.deadline = ''
      this.form3.assessName = ''
      this.form3.currentYear = ''
      this.form3.deadline = ''
      this.itemList = []
      this.showresult = false
      this.showtable = false
      this.annualAssessVisible = false
      this.addAssessVisible = false
      this.addAssessVisible3 = false
    },

    initReportAssess() {
      let date = new Date()
      let year = date.getFullYear()
      this.form3.assessName = year + '年一报告两评议'
      this.form3.currentYear = year
      this.addAssessVisible3 = true
      this.form3.scope = this.scope
    },

    disabledDate(current) {
      // Can not select days before today and today
      return current && current < moment().endOf('day')
    },
    loadData() {
      getAction('/regular/report/getIndexInfo').then(res => {
        this.regularIndexLeaderlist = res.result.regularIndexLeader
        this.businessIndexLeaderlist = res.result.businessIndexLeader
        this.annualIndexLeaderlist = res.result.annualIndexLeader
        this.reportIndexLeaderlist = res.result.reportIndexLeader
        if (res.result.regularIndexLeader) {
          this.dataSource1 = res.result.regularIndexLeader.reports
        }
        if (res.result.businessIndexLeader) {
          this.dataSource2 = res.result.businessIndexLeader.reports
        }
        if (res.result.reportIndexLeader) {
          this.dataSource3 = res.result.reportIndexLeader.reports
        }
        if (res.result.annualIndexLeader) {
          this.dataSource4 = res.result.annualIndexLeader.reports
        }
        // this.dataSource1 = res.result.regularIndexLeader.reports
        // this.dataSource2 = res.result.businessIndexLeader.reports
        // this.dataSource3 = res.result.reportIndexLeader.reports
        // this.dataSource4 = res.result.annualIndexLeader.reports

      })
    },
    handleStartProcess() {
      this.$refs.processModalForm.add()
      this.$refs.processModalForm.title = '发起平时考核'
      this.$refs.processModalForm.disableSubmit = false
      this.loadData()
    },
    processModalFormOk() {
      this.$refs.processModalForm.close()
      this.loadData()
    },
    onSubmit2() {
      this.btnLoading = true
      this.$refs.ruleForm2.validate((valid) => {
        if (valid) {
          submitBusinessFill(this.form2).then((res) => {
            if (res.success) {
              this.addAssessVisible = false
              this.handleClose()
              this.loadData()
            } else {
              // this.$message.error(res.message)
              this.$confirm({
                title: '消息提示',

                content: (h) => <div style="color:red;">{res.message}</div>,

                onOk: () => {
                },

                onCancel: () => {
                }
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
    onSubmit3() {
      this.btnLoading = true

      this.$refs.ruleForm3.validate((valid) => {
        if (valid) {
          submitReportInit(this.form3).then((res) => {
            if (res.success) {
              this.addAssessVisible3 = false
              this.handleClose()
              this.loadData()
            } else {
              // this.$message.error(res.message)
              this.$confirm({
                title: '消息提示',
                content: (h) => <div style="color:red;">{res.message}</div>,
                onOk: () => {
                },
                onCancel: () => {
                }
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

    stopAssessing(type) {
      this.$confirm({
        title: '确定要结束考核吗？',
        content: '结束考核后成绩将归档，各处室（单位）将无法填写！',
        onOk: () => {
          stopAssess(type).then(res => {
            if (res.success) {
              this.loadData()
            }
          })
        },
        onCancel: () => {
        }
      })
    },
    revocation(type) {
      this.$confirm({
        title: '确定要撤回考核吗？',
        content: '撤回后需重新发起，若已经有处室（单位）填写，重新发起后需要重新填写！',
        onOk: () => {
          revocationAssess(type).then(res => {
            if (res.success) {
              this.loadData()
            }
          })
        },
        onCancel: () => {
        }
      })
    },

    initBusinessAssess() {
      let date = new Date()
      let year = date.getFullYear()
      this.form2.assessName = year + '年业务工作测评'
      this.form2.currentYear = year
      this.addAssessVisible = true
    },

    initAnnualAssess() {
      let date = new Date()
      let year = date.getFullYear()
      this.form.assessName = year + '年度考核'
      this.form.currentYear = year
      this.annualAssessVisible = true
    },
    onSubmitAnnual() {
      if (this.itemList.length === 0) {
        this.openConfirm('未上传考核名单', '请先上传考核名单')
        return
      }
      this.btnLoading = true
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.form.summaryList = this.itemList
          submitAnnualFill(this.form).then((res) => {
            if (res.success) {
              this.handleClose()
              this.loadData()
            } else {
              // this.$message.error(res.message)
              this.$confirm({
                title: '消息提示',

                content: (h) => <div style="color:red;">{res.message}</div>,

                onOk: () => {
                },

                onCancel: () => {
                }
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

    handleImportExcel(info) {
      if (info.file.status === 'done') {
        // this.$message.success(`${info.file.name} 文件上传成功`)
        const mes = `${info.file.name} 文件上传成功`
        this.$confirm({
          title: '消息提示',

          content: (h) => <div style="color:red;">{mes}</div>,

          onOk: () => {
          },

          onCancel: () => {
          }
        })
        this.itemList = info.file.response.result.records
        this.showresult = true
      } else if (info.file.status === 'error') {
        // this.$message.error(`${info.file.name} 文件上传失败.`)
        const mess = `${info.file.name} 文件上传失败`
        this.$confirm({
          title: '消息提示',

          content: (h) => <div style="color:red;">{mess}</div>,

          onOk: () => {
          },

          onCancel: () => {
          }
        })
      }
    },

    formatDeadline(dateString) {
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = date.getMonth() + 1 // getMonth() 返回 0-11
      const day = date.getDate()

      return `${year}-${month}-${day}`
    },
    changeRegisterType(e) {
      this.indexRegisterType = e.target.value
      // if(this.indexBottomTab=="1"){
      //   this.loadDataSource1()
      // }else{
      //   this.loadDataSource2()
      // }
    },
    tableChange1(pagination) {
      this.ipagination1.current = pagination.current
      this.ipagination1.pageSize = pagination.pageSize
      this.queryTimeoutInfo()
    },
    tableChange2(pagination) {
      this.ipagination2.current = pagination.current
      this.ipagination2.pageSize = pagination.pageSize
      this.queryNodeTimeoutInfo()
    },
    getFlowRateNumber(value) {
      return Number(value)
    },
    getPercentFormat(value) {
      if (value == 100) {
        return '超时'
      } else {
        return value + '%'
      }
    },
    getPercentColor(value) {
      let p = Number(value)
      if (p >= 90 && p < 100) {
        return 'rgb(244, 240, 89)'
      } else if (p >= 100) {
        return 'red'
      } else {
        return 'rgb(16, 142, 233)'
      }
    },

    // loadDataSource1(){
    //   this.dataSource1 = dataSource1.filter(item=>{
    //     if(!this.indexRegisterType){
    //       return true
    //     }
    //     return item.type==this.indexRegisterType
    //   })
    // },
    // loadDataSource2(){
    //   this.dataSource2 = dataSource2.filter(item=>{
    //     if(!this.indexRegisterType){
    //       return true
    //     }
    //     return item.type==this.indexRegisterType
    //   })
    // },
    initLogInfo() {
      getLoginfo(null).then((res) => {
        if (res.success) {
          Object.keys(res.result).forEach(key => {
            res.result[key] = res.result[key] + ''
          })
          this.loginfo = res.result
        }
      })
      getVisitInfo().then(res => {
        if (res.success) {
          this.visitInfo = res.result
        }
      })
    },

    downloadDepartName() {
      axios
        .post(
          '/common/downLoadDepartName',
          {},
          { responseType: 'blob' }
        )
        .then((res) => {
          if (res && res.headers) {
            let contentDisposition = res.headers['content-disposition']
            let fileName = contentDisposition ? contentDisposition.split('filename=')[1] : 'export.pdf'
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
            this.exportLoading = false
            this.exportResVisible = false
          } else {
            console.error('Response headers are undefined')
            this.exportLoading = false
            this.exportResVisible = false
          }
        })
        .catch((error) => {
          console.error('Error downloading file:', error)
        })
    },
    downloadFile(text) {
      if (!text) {
        this.$message.warning('未知的文件')
        return
      }
      if (text.indexOf(',') > 0) {
        text = text.substring(0, text.indexOf(','))
      }
      let url = getFileAccessHttpUrl(text)
      window.open(url)
    }
  }
}
</script>

<style lang="less" scoped>
.stop-assess {
  border-radius: 16px;
  padding: 5px 10px;
  box-shadow: 0 4px 10px 0 rgba(182, 55, 66, 0.2);
  background: rgb(255, 21, 29);
  color: rgb(255, 255, 255);
  font-family: 思源黑体;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.bgcenter {
  background-image: url("../../assets/矩形 491.png");
  background-size: 102% 110%;
  background-position: 60% 55%;
  background-repeat: no-repeat;
  padding: 10px 0;
}

.finallyb {
  border-radius: 16px;
  padding: 5px 10px;
  box-shadow: 0px 4px 10px 0px rgba(252, 140, 19, 0.42);
  background: rgb(252, 140, 19);
  color: rgb(255, 255, 255);
  font-family: 思源黑体;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

/deep/ .chart-card-content {
  margin-bottom: 12px;
  position: relative;
  height: 16px;
  width: 100%;
}

/deep/ .total {
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  white-space: nowrap;
  color: rgb(2, 96, 254);
  margin-top: 4px;
  margin-bottom: 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 38px;
  height: 38px;
}

/deep/ .chart-card-header .meta {
  color: rgb(9, 24, 52) !important;
  font-size: 18px !important;
  font-weight: 700 !important;
}


.circle-cust {
  position: relative;
  top: 28px;
  left: -100%;
}

.extra-wrapper {
  line-height: 55px;
  padding-right: 24px;

  .extra-item {
    display: inline-block;
    margin-right: 24px;

    a {
      margin-left: 24px;
    }
  }
}

/* 首页访问量统计 */
.head-info {
  position: relative;
  text-align: left;
  padding: 0 32px 0 0;
  min-width: 125px;

  &.center {
    text-align: center;
    padding: 0 32px;
  }

  span {
    color: rgba(0, 0, 0, .45);
    display: inline-block;
    font-size: .95rem;
    line-height: 42px;
    margin-bottom: 4px;
  }

  p {
    line-height: 42px;
    margin: 0;

    a {
      font-weight: 600;
      font-size: 1rem;
    }
  }
}

.extra-wrapper {
  line-height: 55px;
  padding-right: 24px;

  .extra-item {
    display: inline-block;
    margin-right: 24px;

    a {
      margin-left: 24px;
    }
  }
}

.item-group {
  padding: 20px 0 8px 24px;
  font-size: 0;

  a {
    color: rgba(0, 0, 0, 0.65);
    display: inline-block;
    font-size: 16px;
    margin-bottom: 13px;
    width: 25%;
  }
}

.item-group {
  .more-btn {
    margin-bottom: 13px;
    text-align: center;
  }
}

.list-content-item {
  color: rgba(0, 0, 0, .45);
  display: inline-block;
  vertical-align: middle;
  font-size: 16px;
  margin-left: 40px;
}

@media only screen and (min-width: 1600px) {
  .list-content-item {
    margin-left: 60px;
  }
}

@media only screen and (max-width: 1300px) {
  .list-content-item {
    margin-left: 20px;
  }

  .width-hidden4 {
    display: none
  }
}

.list-content-item {
  span {
    line-height: 20px;
  }
}

.list-content-item {
  p {
    margin-top: 4px;
    margin-bottom: 0;
    line-height: 22px;
  }
}

.anty-list-cust {
  .ant-list-item-meta {
    flex: 0.3 !important;
  }
}

.anty-list-cust {
  .ant-list-item-content {
    flex: 1 !important;
    justify-content: flex-start !important;
    margin-left: 20px;
  }
}

/deep/ td {
  background-color: white !important;
}
</style>