<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="3" :lg="7" :md="8" :sm="24">
            <a-form-item label="开始年度">
              <t-dict-select-tag @change="searchQuery" placeholder="请选择年度" v-model="queryParam.currentYear"
                                 dictCode="assess_year" />
            </a-form-item>
          </a-col>
          <a-col :xl="3" :lg="7" :md="8" :sm="24">
            <a-form-item label="结束年度">
              <t-dict-select-tag @change="searchQuery" placeholder="请选择年度" v-model="queryParam.endYear"
                                 dictCode="assess_year" />
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="考核单元">
              <t-select-user-by-dep :disabled="queryParam.trial" @change="searchQuery" :multi="false"
                                    placeholder="考核单元" :year="queryParam.currentYear" :get-leader="true"
                                    v-model="queryParam.leader" store="id" text="realname" />
            </a-form-item>
          </a-col>

          <a-col :xl="4" :lg="7" :md="8" :sm="24">
            <a-form-item label="单位类型">
              <a-select :disabled="queryParam.trial" @change="searchQuery" placeholder="按单位类型筛选"
                        v-model="queryParam.departType">
                <a-select-option value="bureau">局机关处室</a-select-option>
                <a-select-option value="basic">基层单位</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col style="z-index: 9" :xl="4" :lg="7" :md="8" :sm="24">
            <a-form-item label="排名后百分比">
              <div style="width: 120px;">
                <a-input :disabled="queryParam.trial" style="cursor: pointer;" readOnly @focus="numMenuHeight = '100px'"
                         @focusout="numMenuHeight = '0'" v-model="queryParam.nums"
                         @click="changeNumMenu">
                  <a-icon @click="numMenuHeight = numMenuHeight === '0' ? '100px' : '0'" slot="suffix"
                          :type="numMenuHeight === '0' ? 'down' : 'up'"
                          style="color: rgba(0,0,0,.45); cursor: pointer;" />
                </a-input>
                <div class="num-menu" :style="{height: numMenuHeight}">
                  <div class="num-menu-item" @click="clickNumItem(30)">
                    30%
                  </div>
                  <div class="num-menu-item" @click="clickNumItem(20)">
                    20%
                  </div>
                  <div style="display: flex; align-items: center; justify-content: center; " class="num-menu-item">
                    <a-input @focus="numMenuHeight = '100px'" @keydown.enter="inputNum" @focusout="inputNum"
                             style="width: 90%; height: 28px; font-size: 16px" v-model="inputNums"
                             placeholder="自定义" />
                  </div>
                </div>
              </div>
            </a-form-item>
          </a-col>

          <a-col :xl="4" :lg="7" :md="8" :sm="24">
            <a-form-item label="类型">
              <a-select :disabled="queryParam.trial" @change="searchQuery" placeholder="按类型筛选"
                        v-model="queryParam.type">
                <a-select-option value="z">正职</a-select-option>
                <a-select-option value="f">副职</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :xl="4" :lg="7" :md="8" :sm="24">
            <a-form-item label="查询试用期人员">
              <a-switch @change="searchQuery" v-model="queryParam.trial" />
            </a-form-item>
          </a-col>

          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>

            <span v-if="queryParam.trial" style="font-size: 18px; margin: 0 20px">
              当前选择条件：全部试用期人员（考核单元内）
            </span>


              <span v-else style="font-size: 18px; margin: 0 20px">
                当前选择条件：
                <span v-if="queryParam.leader && queryParam.leader != ''">{{ leaderMap[queryParam.leader]
                  }}考核单元内</span>
                <span v-else>所有考核单元内</span>
                <span
                  v-if="queryParam.departType && queryParam.departType != ''">{{ queryParam.departType === 'bureau' ? '，局机关处室' : '，基层单位'
                  }}</span>
                <span v-if="queryParam.type && queryParam.type != ''">{{ queryParam.type === 'z' ? '正职' : '副职'
                  }}</span>
                <span v-if="queryParam.nums && queryParam.nums != ''">后{{ queryParam.nums }}%</span>
                <span>人员</span>
              </span>
              <a-button :disabled="totalData.length <= 0" type="primary" @click="downloadExcel" :loading="loading" icon="download" style="margin-left: 8px">按当前条件导出名单</a-button>
            </span>

          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <!--      <a-button @click="reRank" type="primary" icon="redo" :loading="reRankLoading">重新计算分数及排名</a-button>-->
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :scroll="{ y: 520 }"
        :columns="columns"
        :dataSource="totalData"
        :pagination="false"
        :loading="loading"
        @change="handleTableChange"
      >
        <template slot="appraisee" slot-scope="text, record">
          <div style="width: 96%; margin: auto">
            {{ text === 'group' ? record.depart_dictText + '-领导班子' : text.split('@')[0] }}
          </div>
        </template>

        <template slot="scopeRanking1" slot-scope="text, record">
              <span>{{ (record.type === '22' || record.type === '23') && record.departType === 'bureau' ? record.scopeRanking : ''
                }}</span>
        </template>

        <template slot="scopeRanking2" slot-scope="text, record">
          <span>{{ record.type === '32' && record.departType !== 'bureau' ? record.scopeRanking : '' }}</span>
        </template>

        <template slot="scopeRanking3" slot-scope="text, record">
          <span>{{ record.type === '21' && record.departType === 'bureau' ? record.scopeRanking : '' }}</span>
        </template>

        <template slot="scopeRanking4" slot-scope="text, record">
          <span>{{ record.type === '31' && record.departType !== 'bureau' ? record.scopeRanking : '' }}</span>
        </template>

        <template slot="ranking1" slot-scope="text, record">
              <span>{{ (record.type === '22' || record.type === '23') && record.departType === 'bureau' ? record.ranking : ''
                }}</span>
        </template>

        <template slot="ranking2" slot-scope="text, record">
          <span>{{ record.type === '32' && record.departType !== 'bureau' ? record.ranking : '' }}</span>
        </template>

        <template slot="ranking3" slot-scope="text, record">
          <span>{{ record.type === '21' && record.departType === 'bureau' ? record.ranking : '' }}</span>
        </template>

        <template slot="ranking4" slot-scope="text, record">
          <span>{{ record.type === '31' && record.departType !== 'bureau' ? record.ranking : '' }}</span>
        </template>

        <template slot="depart" slot-scope="text, record">
          {{ text.startsWith('JG') ? '局管总师、二巡' : text }}
        </template>

        <template slot="status" slot-scope="text, record">
          <a-tag style="width: 66px" :color="record.filledNum / record.num === 1 ? '#87d068' : '#f81d22'">
            {{ record.filledNum }} /
            {{ record.num }}
          </a-tag>
          <!--          <div style='width: 96%; margin: auto'>-->
          <!--            <a-progress :percent="toFixedO(record.filledNum / record.num * 100)" size="small" status="active" />-->
          <!--          </div>-->
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
              <a @click="handleEdit(record)">查看曲线</a>
            </span>
      </a-table>
      <!--        <a-tab-pane key="3" tab="领导班子">-->
      <!--          <a-table-->
      <!--            ref="table"-->
      <!--            size="middle"-->
      <!--            bordered-->
      <!--            rowKey="id"-->
      <!--            class="j-table-force-nowrap"-->
      <!--            :scroll="{ y: 520 }"-->
      <!--            :columns="groupColumns"-->
      <!--            :dataSource="groupData"-->
      <!--            :pagination="false"-->
      <!--            :loading="loading"-->
      <!--            @change="handleTableChange"-->
      <!--          >-->
      <!--            <template slot="appraisee" slot-scope="text, record">-->
      <!--              <div style="width: 96%; margin: auto">-->
      <!--                {{ text === 'group' ? record.depart_dictText + '-领导班子' : text.split('@')[0] }}-->
      <!--              </div>-->
      <!--            </template>-->

      <!--            <template slot="status" slot-scope="text, record">-->
      <!--              <a-tag style="width: 66px" :color="record.filledNum / record.num === 1 ? '#87d068' : '#f81d22'">-->
      <!--                {{ record.filledNum }} /-->
      <!--                {{ record.num }}-->
      <!--              </a-tag>-->
      <!--              &lt;!&ndash;          <div style='width: 96%; margin: auto'>&ndash;&gt;-->
      <!--              &lt;!&ndash;            <a-progress :percent="toFixedO(record.filledNum / record.num * 100)" size="small" status="active" />&ndash;&gt;-->
      <!--              &lt;!&ndash;          </div>&ndash;&gt;-->
      <!--            </template>-->

      <!--            <template slot="htmlSlot" slot-scope="text">-->
      <!--              <div v-html="text"></div>-->
      <!--            </template>-->
      <!--            <template slot="imgSlot" slot-scope="text, record">-->
      <!--              <span v-if="!text" style="font-size: 16px; font-style: italic">无图片</span>-->
      <!--              <img-->
      <!--                v-else-->
      <!--                :src="getImgView(text)"-->
      <!--                :preview="record.id"-->
      <!--                height="25px"-->
      <!--                alt=""-->
      <!--                style="max-width: 80px; font-size: 16px; font-style: italic"-->
      <!--              />-->
      <!--            </template>-->
      <!--            <template slot="fileSlot" slot-scope="text">-->
      <!--              <span v-if="!text" style="font-size: 16px; font-style: italic">无文件</span>-->
      <!--              <a-button v-else :ghost="true" type="primary" icon="download" size="small" @click="downloadFile(text)">-->
      <!--                下载-->
      <!--              </a-button>-->
      <!--            </template>-->

      <!--            <span slot="action" slot-scope="text, record">-->
      <!--          <a @click="handleEdit(record)">编辑</a>-->

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
      <!--        </span>-->
      <!--          </a-table>-->
      <!--        </a-tab-pane>-->

    </div>

    <sta-modal ref="modalForm" @ok="modalFormOk" />
    <progress-modal ref="progressModal" />

    <t-modal
      title="导出民主测评成绩"
      :width="800"
      :visible="downloadGradeVisible"
      :maskClosable="false"
      switchFullscreen
      @ok="downloadGrade"
      :simple-submit="true"
      @cancel="handleCancelDownload">

      <div slot="footer">
        <a-button :loading="exportLoading" type="primary" @click="downloadGrade">确认</a-button>
      </div>

      <a-form-model :model="downloadForm" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="年度">
          <t-dict-select-tag placeholder="请选择年度" v-model="downloadForm.year"
                             dictCode="assess_year" />
        </a-form-model-item>
        <!--        <a-form-model-item label='范围'>-->
        <!--          <a-radio-group :default-value='"1"' v-model='downloadForm.scope'>-->
        <!--            <a-radio value='1'>-->
        <!--              全部-->
        <!--            </a-radio>-->
        <!--            <a-radio value='2'>-->
        <!--              局机关各处室-->
        <!--            </a-radio>-->
        <!--            <a-radio value='3'>-->
        <!--              基层单位-->
        <!--            </a-radio>-->
        <!--          </a-radio-group>-->
        <!--        </a-form-model-item>-->
        <!--        <a-form-model-item label='类型'>-->
        <!--          <a-radio-group :default-value='"1"' v-model='downloadForm.type'>-->
        <!--            <a-radio value='1'>-->
        <!--              全部-->
        <!--            </a-radio>-->
        <!--            <a-radio value='2'>-->
        <!--              正职-->
        <!--            </a-radio>-->
        <!--            <a-radio value='3'>-->
        <!--              副职-->
        <!--            </a-radio>-->
        <!--            <a-radio value='4'>-->
        <!--              基层单位领导班子-->
        <!--            </a-radio>-->
        <!--          </a-radio-group>-->
        <!--        </a-form-model-item>-->

      </a-form-model>

    </t-modal>

    <t-modal
      title="导出分管纪检工作处级领导干部民主测评成绩"
      :width="800"
      :visible="downloadGrade4jjVisible"
      :maskClosable="false"
      switchFullscreen
      @ok="downloadGrade4jj"
      :simple-submit="true"
      @cancel="handleCancelDownload">

      <a-form-model :model="downloadForm" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="年度">
          <t-dict-select-tag placeholder="请选择年度" v-model="downloadForm.year"
                             dictCode="assess_year" />
        </a-form-model-item>
      </a-form-model>

    </t-modal>
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import StaModal from './modules/StaModal'
import '@/assets/less/TableExpand.less'
import { getAnonymousAccount, getAssessingInfo, submitInitDemocratic } from '@/api/assessApis'
import TModal from '@/component/TModal.vue'
import { axios } from '@/utils/assessReq'
import ProgressModal from '@/views/assess/annual/democratic/modules/ProgressModal.vue'
import { getAction, putAction } from '@/api/manage'
import TSelectUserByDep from '@/component/TSelectUserByDep.vue'
import TDictSelectTag from '@/component/TDictSelectTag.vue'

export default {
  name: 'StaList',
  mixins: [JeecgListMixin],
  components: {
    TDictSelectTag,
    TSelectUserByDep,
    ProgressModal,
    TModal,
    StaModal
  },
  data() {
    return {
      numMenuHeight: '0',
      downloadGradeVisible: false,
      downloadGrade4jjVisible: false,
      anonymousUserList: [],
      anonymousUserVisible: false,
      description: '民主测评汇总管理页面',
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
          title: '测评对象',
          align: 'center',
          dataIndex: 'appraisee',
          width: 100,
          scopedSlots: { customRender: 'appraisee' }
        },
        {
          title: '单位',
          align: 'center',
          dataIndex: 'depart_dictText',
          scopedSlots: { customRender: 'depart' }
        },
        {
          title: '年度',
          align: 'center',
          width: 70,
          dataIndex: 'currentYear_dictText'
        },
        // {
        //   title: '测评名称',
        //   align: 'center',
        //   dataIndex: 'assessName',
        // },
        // {
        //   title: '测评类型',
        //   align: 'center',
        //   dataIndex: 'type_dictText',
        // },
        // {
        //   title: '开始时间',
        //   align: 'center',
        //   dataIndex: 'startDate',
        //   customRender: function (text) {
        //     return !text ? '' : text.length > 10 ? text.substr(0, 10) : text
        //   },
        // },
        // {
        //   title: '结束时间',
        //   align: 'center',
        //   dataIndex: 'endDate',
        //   customRender: function (text) {
        //     return !text ? '' : text.length > 10 ? text.substr(0, 10) : text
        //   },
        // },
        {
          title: '分数',
          align: 'center',
          width: 110,
          dataIndex: 'score'
        },
        {
          title: '考核单元内正职排名（处室）',
          align: 'center',
          width: 110,
          scopedSlots: { customRender: 'scopeRanking1' }
        },
        {
          title: '考核单元内正职排名（基层）',
          align: 'center',
          width: 110,
          scopedSlots: { customRender: 'scopeRanking2' }
        },
        {
          title: '考核单元内副职排名（处室）',
          align: 'center',
          width: 110,
          scopedSlots: { customRender: 'scopeRanking3' }
        },
        {
          title: '考核单元内副职排名（基层）',
          align: 'center',
          width: 110,
          scopedSlots: { customRender: 'scopeRanking4' }
        },
        {
          title: '正职排名（处室）',
          align: 'center',
          width: 110,
          scopedSlots: { customRender: 'ranking1' }
        },
        {
          title: '正职排名（基层）',
          align: 'center',
          width: 110,
          scopedSlots: { customRender: 'ranking2' }
        },
        {
          title: '副职排名（处室）',
          align: 'center',
          width: 110,
          scopedSlots: { customRender: 'ranking3' }
        },
        {
          title: '副职排名（基层）',
          align: 'center',
          width: 110,
          scopedSlots: { customRender: 'ranking4' }
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
      groupColumns: [
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
          title: '测评对象',
          align: 'center',
          dataIndex: 'appraisee',
          scopedSlots: { customRender: 'appraisee' }
        },
        {
          title: '单位',
          align: 'center',
          dataIndex: 'depart_dictText'
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
          title: '民主测评分数',
          align: 'center',
          dataIndex: 'score'
        },
        {
          title: '民主测评排名',
          align: 'center',
          dataIndex: 'ranking'
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
      queryParam: {
        nums: 20
      },

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
        },
        {
          title: '选票类型',
          align: 'center',
          dataIndex: 'voteType'
        }
      ],
      url: {
        list: '/modules/annual/democraticSummary/listPro',
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
      groupData: [],
      downloadForm: {
        year: ''
      },
      reRankLoading: false,
      exportLoading: false,
      menuVisible: false,
      inputNums: undefined,
      leaderMap: {}
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
    getAction('/common/allLeaders').then(res => {
      console.log('获取领导')
      console.log(res)
      if (res.success) {
        this.leaderMap = res.result
      } else {
        this.leaderMap = []
      }
    })
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    searchReset() {
      this.queryParam = {
        nums: 20
      }
      this.loadData(1)
    },
    handleEdit: function(record) {
      this.$refs.modalForm.edit(record, this.queryParam)
      this.$refs.modalForm.title = '年度考核民主测评变化曲线'
      this.$refs.modalForm.disableSubmit = false
    },
    clickNumItem(num) {
      this.queryParam.nums = num
      this.numMenuHeight = '0'
      this.searchQuery()
    },
    inputNum() {
      if (this.inputNums) {
        let num = this.inputNums
        // 去除数字以外的字符
        num = num.replace(/[^0-9]/g, '')
        // 去除开头的所有0
        num = num.replace(/^0+/, '')
        // 如果num是空字符串，则设置为30
        if (num === '') {
          num = 20
        }
        // 限制输入范围
        if (num < 0) {
          num = 0
        } else if (num > 100) {
          num = 100
        }

        this.queryParam.nums = num
        this.inputNums = undefined
      } else {
        this.inputNums = undefined
      }
      this.searchQuery()
    },
    changeNumMenu() {
      this.menuVisible = !this.menuVisible
    },
    formatter(value) {
      return `${value}%`
    },
    downloadGrade() {
      this.exportLoading = true
      axios
        .post('/modules/annual/democraticSummary/export', this.downloadForm, { responseType: 'blob', timeout: 60000 })
        .then((res) => {
          if (res && res.headers) {
            // if (res.data.type == 'application/json') {
            //   // this.$message.error('当前条件下暂无要导出的考核结果!')
            //   this.$error({
            //     title: '错误',
            //     content: '当前条件下暂无要导出的考核结果!'
            //   })
            //   this.$emit('over')
            //   return
            // }
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
            this.exportLoading = false
          } else {
            console.error('Response headers are undefined')
          }
        })
        .catch((error) => {
          console.error('Error downloading file:', error)
        })
    },
    downloadGrade4jj() {
      axios
        .post('/modules/annual/democraticSummary/export4jj', this.downloadForm, { responseType: 'blob' })
        .then((res) => {
          if (res && res.headers) {
            // if (res.data.type == 'application/json') {
            //   // this.$message.error('当前条件下暂无要导出的考核结果!')
            //   this.$error({
            //     title: '错误',
            //     content: '当前条件下暂无要导出的考核结果!'
            //   })
            //   this.$emit('over')
            //   return
            // }
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

    handleCancelDownload() {
      this.downloadGradeVisible = false
      this.downloadGrade4jjVisible = false
      this.downloadForm = {
        year: ''
      }
    },

    openDownloadGrade() {
      getAssessingInfo('annual').then(res => {
        if (res.success) {
          this.downloadForm.year = res.result.currentYear
        }
      })
      this.downloadGradeVisible = true
    },

    openDownloadGrade4jj() {
      getAssessingInfo('annual').then(res => {
        if (res.success) {
          this.downloadForm.year = res.result.currentYear
        }
      })
      this.downloadGrade4jjVisible = true
    },

    yearChange() {
      this.form.assessName = this.form.currentYear + '年度考核民主测评'
    },

    loadData(arg) {
      if (!this.url.list) {
        // this.$message.error('请设置url.list属性!')
        this.$error({
          title: '错误',
          content: '请设置url.list属性!'
        })
        return
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      var params = this.getQueryParams()//查询条件

      console.log('查询条件')
      console.log(params)

      this.loading = true

      if (this.queryParam.currentYear) {
        this.queryParam.startYear = this.queryParam.currentYear
      }

      getAction(this.url.list, params).then((res) => {
        if (res.success) {
          //update-begin---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
          this.totalData = res.result.records || res.result

          // 过滤掉type为99的数据
          this.groupData = this.totalData.filter(item => item.type === '99')
          this.totalData = this.totalData.filter(item => item.type !== '99')

          this.getDepartData(this.totalData)

          if (res.result.total) {
            this.ipagination.total = res.result.total
          } else {
            this.ipagination.total = 0
          }
          //update-end---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
        } else {
          // this.$message.warning(res.message)
          this.$warning({
            title: '警告',
            content: res.message
          })
        }
      }).finally(() => {
        this.loading = false
      })
    },

    getDepartData(list) {
      let departIds = []
      this.dataSource = []

      getAction('/modules/annual/democraticSummary/getDemocraticProgressByYear?year=' + this.queryParam.currentYear).then((res) => {
        if (res.success) {
          this.dataSource = res.result.records
        }
      })

      // for (let i = 0; i < list.length; i++) {
      //   if (departIds.indexOf(list[i].depart) !== -1) {
      //     continue
      //   }
      //   departIds.push(list[i].depart)
      //   let obj = {
      //     depart: list[i].depart_dictText,
      //     currentYear: list[i].currentYear,
      //     endDate: list[i].endDate,
      //     filledNum: list[i].filledNum,
      //     num: list[i].num,
      //     score: list[i].score,
      //     ranking: list[i].ranking,
      //   }
      //   this.dataSource.push(obj)
      // }
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

    reRank() {

      this.reRankLoading = true

      putAction('/modules/annual/democraticSummary/rerank').then(res => {
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
    },

    downloadExcel() {
      this.loading = true

      axios
        .post('/modules/annual/democraticSummary/people2Excel', this.queryParam, {
          responseType: 'blob' // 设置响应类型为 blob
        })
        .then((res) => {
          if (res && res.headers) {
            let contentDisposition = res.headers['content-disposition']
            let fileName = contentDisposition ? contentDisposition.split('filename=')[1] : '名单.xlsx'
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
        }).finally(() => {
        this.loading = false
      })
    },
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';

.num-menu {
  width: 100%;
  border-radius: 5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  overflow: hidden;
}

.num-menu-item {
  width: 100%;
  height: 32px;
  text-align: center;
  line-height: 32px;
  font-size: 16px;
  border-radius: 3px;
  background-color: white;
  transition: all 0.3s ease;
}

.num-menu-item:hover {
  background-color: #e6f7ff;
  cursor: pointer;
}
</style>
