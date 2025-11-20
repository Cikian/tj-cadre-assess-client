<template>
  <a-card :bordered='false'>
    <!-- 查询区域 -->
    <div class='table-page-search-wrapper'>
      <a-form layout='inline' @keyup.enter.native='searchQuery'>
        <a-row :gutter='24'>
          <a-col :xl='3' :lg='7' :md='8' :sm='24'>
            <a-form-item style='width: 150px' label='年度'>
              <t-dict-select-tag placeholder='请选择年度' v-model='queryParam.currentYear' dictCode='assess_year' @change="searchQuery" />
            </a-form-item>
          </a-col>
          <a-col :xl='6' :lg='7' :md='8' :sm='24'>
            <a-form-item style='width: 300px' label='领导'>
              <t-select-user-by-dep :show-btn='false' :is-scope='true' placeholder='按领导筛选' :get-leader='true'
                                    v-model='queryParam.leader' store='id' text='realname' @change="searchQuery"  />
            </a-form-item>
          </a-col>
          <a-col :xl='6' :lg='7' :md='8' :sm='24'>
            <span style='float: left; overflow: hidden' class='table-page-search-submitButtons'>
              <a-button type='primary' @click='searchQuery' icon='search'>查询</a-button>
              <a-button type='primary' @click='searchReset' icon='reload' style='margin-left: 8px'>重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class='table-operator'>
      <a-button v-has="'gbc:admin'" type='primary' icon='form' @click='openExcellentNum'>优秀名额分配</a-button>
      <a-button v-has="'gbc:admin'" @click='initRec' type='primary' icon='ordered-list'>初始化推优列表</a-button>
      <a-button :loading='flushLoading' v-if='dataSource.length > 0' v-has="'gbc:admin'" @click='flushRec' type='primary' icon='redo'>
        刷新推优列表
      </a-button>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref='table'
        size='middle'
        :scroll='{x:true}'
        bordered
        rowKey='id'
        :columns='columns'
        :dataSource='dataSource'
        :pagination='false'
        :loading='loading'
        @change='handleTableChange'>

        <template slot='bureauRec' slot-scope='text, record'>
          <div style='font-size: 16px; line-height: 20px' v-html="text"></div>
        </template>
        <template slot='groupRec' slot-scope='text, record'>
          <div style='font-size: 16px; line-height: 20px' v-html="text"></div>
        </template>
        <template slot='basicRec' slot-scope='text, record'>
          <div style='font-size: 16px; line-height: 20px' v-html="text"></div>
        </template>
        <template slot='institutionRec' slot-scope='text, record'>
          <div style='font-size: 16px; line-height: 20px' v-html="text"></div>
        </template>

        <!-- <template slot="status" slot-scope="text, record">
          <a-tag
            :color="
              record.status === 1 ? 'red' : record.status === 2 ? 'orange' : record.status === 3 ? 'green' : 'pink'
            "
            >{{ record.status_dictText }}
          </a-tag>
        </template> -->


        <template slot='status' slot-scope='text, record, index'>
          <a-tag :color="
          record.status === '1' ? 'red' : record.status === '2' ? 'orange' : record.status === '3' ? 'green' : 'pink'
        "> {{ getStatusText(record.status) }}
          </a-tag>
        </template>
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
          <a v-show='role === "admin" || (role==="fcz" && record.status === "5") || (role==="cz" && record.status === "6") ' @click='handleEdit(record)'>编辑</a>
          <a-divider v-show='record.status!=="2" && record.status!=="3"' type='vertical' />
          <a v-show='record.status!=="2" && record.status!=="3"' @click='pushDown(record)'>推送</a>
          <a-divider v-has="'gbc:admin'" v-show='record.status==="3"' type='vertical' />
          <a v-has="'gbc:admin'" v-show='record.status==="3"' @click='returned(record)'>重新推优</a>
        </span>

      </a-table>

<!--      <div v-show="!assessing" class="no-data-mask">-->
<!--        <span>当前没有正在进行中的考核</span>-->
<!--      </div>-->
    </div>

    <assess-leader-rec-modal ref='modalForm' @ok='modalFormOk'></assess-leader-rec-modal>

    <t-modal
      ref='excellentNum'
      :title="'优秀名额管理-当前考核年度：' + lastAssessYear"
      :width='1860'
      :visible='excellentManVisible'
      fullscreen
      :confirm-loading='confirmLoading'
      :simple-submit='true'
      @ok='submitExcellentMan'
      @cancel='cancelExcellentMan'
      :maskClosable="false"
      :switchFullscreen="false"
      :slots="['footerPrefix']"
      :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    >
      <div style='display: flex; justify-content: left; margin-bottom: 20px'>

        <a-button style='display: inline-block' type='primary' icon='download' @click='getExcellentNumExcel'>导出优秀名额管理表
        </a-button>
        <a-button style='display: inline-block; margin-left: 20px' type='primary' icon='download'
                  @click='beforeExportRecommendPDF'>
          导出纸质推荐表
        </a-button>
      </div>
      <span
        v-if='bureauOver || groupOver || basicOver || institutionOver'
        style='color: red; font-size: 18px; margin-left: 20px'
      >
        当前
        <span style='font-size: 18px; font-weight: bold' v-if='bureauOver'>局机关领导干部实际分配优秀名额数量 </span>
        <span style='font-size: 18px; font-weight: bold' v-if='groupOver'>领导班子实际分配优秀名额数量 </span>
        <span style='font-size: 18px; font-weight: bold' v-if='basicOver'>分局+参公领导干部实际分配优秀名额数量 </span>
        <span style='font-size: 18px; font-weight: bold' v-if='institutionOver'
        >事业单位领导干部实际分配优秀名额数量
        </span>
        大于理论优秀名额数量，请仔细核对确认！
      </span>

      <a-table
        bordered
        :scroll='{ y: 390 }'
        rowKey='id'
        :columns='excellentManColumns'
        :data-source='excellentItems'
        :pagination='false'
        :loading='excellentManLoading'
      >
        <template slot='depart' slot-scope='text, record, index'>
          <div style='font-size: 16px; line-height: 20px' v-html="text"></div>
        </template>

        <template slot='bureauNum' slot-scope='text, record, index'> {{ text }}</template>

        <template slot='bureauRatio' slot-scope='text, record, index'> {{ text * 100 }}%</template>

        <template slot='bureauTheoryNum' slot-scope='text, record, index'> {{ toFixedNumber(text, 2) }}</template>

        <template slot='bureauTrueNum' slot-scope='text, record, index'>
          <a-input-number
            v-if='index !== excellentItems.length - 1'
            :min='0'
            style='width: 60px'
            v-model='excellentItems[index].bureauTrueNum'
            :precision='0'
            @change="excellentNumChanged('bureau')"
          ></a-input-number>

          <span v-else>{{ text }}</span>
        </template>

        <template slot='groupNum' slot-scope='text, record, index'> {{ text }}</template>

        <template slot='groupRatio' slot-scope='text, record, index'> {{ text * 100 }}%</template>

        <template slot='groupTheoryNum' slot-scope='text, record, index'> {{ toFixedNumber(text, 2) }}</template>

        <template slot='groupTrueNum' slot-scope='text, record, index'>
          <a-input-number
            v-if='index !== excellentItems.length - 1'
            :min='0'
            style='width: 60px'
            v-model='excellentItems[index].groupTrueNum'
            :precision='0'
            @change="excellentNumChanged('group')"
          ></a-input-number>

          <span v-else>{{ text }}</span>
        </template>

        <template slot='basicNum' slot-scope='text, record, index'> {{ text }}</template>

        <template slot='basicRatio' slot-scope='text, record, index'> {{ text * 100 }}%</template>

        <template slot='basicTheoryNum' slot-scope='text, record, index'> {{ toFixedNumber(text, 2) }}</template>

        <template slot='basicTrueNum' slot-scope='text, record, index'>
          <a-input-number
            v-if='index !== excellentItems.length - 1'
            :min='0'
            style='width: 60px'
            v-model='excellentItems[index].basicTrueNum'
            :precision='0'
            @change="excellentNumChanged('basic')"
          ></a-input-number>

          <span v-else>{{ text }}</span>
        </template>

        <template slot='institutionNum' slot-scope='text, record, index'> {{ text }}</template>

        <template slot='institutionRatio' slot-scope='text, record, index'> {{ text * 100 }}%</template>

        <template slot='institutionTheoryNum' slot-scope='text, record, index'> {{ toFixedNumber(text, 2) }}</template>

        <template slot='institutionTrueNum' slot-scope='text, record, index'>
          <a-input-number
            v-if='index !== excellentItems.length - 1'
            :min='0'
            style='width: 60px'
            v-model='excellentItems[index].institutionTrueNum'
            :precision='0'
            @change="excellentNumChanged('institution')"
          ></a-input-number>

          <span v-else>{{ text }}</span>
        </template>
      </a-table>

      <div style='margin: 40px 20px; color: #ff7349'>
        {{ message }}
      </div>
    </t-modal>
    <t-modal
      :title="'导出纸质推荐表'"
      ref='exportRecommendPDF'
      :width='1000'
      :visible='exportRecommendPDFVisible'
      :simple-submit='true'
      @ok='cancelExportRecommendPDF'
      @cancel='cancelExportRecommendPDF'
    >
      <a-form-item label='请选择局领导'>
        <t-select-user-by-dep :get-leader='true' placeholder='请选择局领导' v-model='exportRecommendLeader' store='id'
                              text='realname' />
      </a-form-item>
      <div style='display: flex; justify-content: space-between'>
        <a-button :disabled='exportRecommendLeader ===""' style='display: inline-block' type='primary' icon='download'
                  @click='submitExportRecommendPDF("bureau")'>下载局机关推荐表
        </a-button>
        <a-button :disabled='exportRecommendLeader ===""' style='display: inline-block' type='primary' icon='download'
                  @click='submitExportRecommendPDF("group")'>下载领导班子推荐表
        </a-button>
        <a-button :disabled='exportRecommendLeader ===""' style='display: inline-block' type='primary' icon='download'
                  @click='submitExportRecommendPDF("basic")'>下载分局+参公推荐表
        </a-button>
        <a-button :disabled='exportRecommendLeader ===""' style='display: inline-block' type='primary' icon='download'
                  @click='submitExportRecommendPDF("institution")'>下载事业单位推荐表
        </a-button>
      </div>
    </t-modal>
  </a-card>
</template>

<script>

import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import AssessLeaderRecModal from './modules/AssessLeaderRecModal'
import { getAction, putAction } from '@/api/manage'
import TDictSelectTag from '@/component/TDictSelectTag.vue'
import TSelectUserByDep from '@/component/TSelectUserByDep.vue'
import {
  checkAnnualFill, checkAssessing,
  getAssessingInfo,
  getCurrentUserRoles,
  getEnableRatioItems,
  updateExcellentNum
} from '@/api/assessApis'
import TModal from '@/component/TModal.vue'
import { axios } from '@/utils/assessReq'
import { toFixedNumber } from 'xe-utils/methods'

export default {
  name: 'AssessBusinessLevelRatioList',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    TModal,
    TSelectUserByDep,
    TDictSelectTag,
    AssessLeaderRecModal
  },
  data() {
    return {
      description: '业务工作测评等次默认比例管理页面',
      // 表头
      flushLoading: false,
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
          title: '局领导',
          align: 'center',
          dataIndex: 'leader_dictText',
          scopedSlots: { customRender: 'leader' }
        },
        {
          title: '年度',
          align: 'center',
          dataIndex: 'currentYear',
          scopedSlots: { customRender: 'currentYear' }
        },
        {
          title: '机关处室推优情况',
          align: 'center',
          width: 280,
          dataIndex: 'bureauRec',
          scopedSlots: { customRender: 'bureauRec' }
        },
        {
          title: '领导班子推优情况',
          align: 'center',
          width: 280,
          dataIndex: 'groupRec',
          scopedSlots: { customRender: 'groupRec' }
        },
        {
          title: '分局、参公推优情况',
          align: 'center',
          width: 280,
          dataIndex: 'basicRec',
          scopedSlots: { customRender: 'basicRec' }
        },
        {
          title: '事业单位推优情况',
          align: 'center',
          width: 280,
          dataIndex: 'institutionRec',
          scopedSlots: { customRender: 'institutionRec' }
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 160,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/assess/leader/rec/list',
        delete: '/assess/leader/rec/delete',
        deleteBatch: '/assess/leader/rec/deleteBatch',
        exportXlsUrl: '/assess/leader/rec/exportXls',
        importExcelUrl: 'assess/leader/rec/importExcel'

      },
      dictOptions: {},
      superFieldList: [],

      excellentManLoading: false,
      lastAssessYear: '',
      excellentItems: [],
      bureauOver: false,
      groupOver: false,
      basicOver: false,
      institutionOver: false,
      excellentManVisible: false,
      confirmLoading: false,
      exportRecommendPDFVisible: false,
      excellentManColumns: [
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
          title: '局领导',
          align: 'center',
          dataIndex: 'leader_dictText',
          customRender: (text, row, index) => {
            if (index < this.excellentItems.length - 1) {
              return text
            }
            return {
              children: text,
              attrs: {
                colSpan: 2
              }
            }
          }
        },
        {
          title: '分管处室（单位）',
          align: 'center',
          width: 200,
          dataIndex: 'depart_dictText',
          scopedSlots: { customRender: 'depart' },
          customRender: (text, row, index) => {
            if (index < this.excellentItems.length - 1) {
              return text
            }
            return {
              children: text,
              attrs: {
                colSpan: 0
              }
            }
          }
        },
        {
          title: '局机关领导干部',
          align: 'center',
          children: [
            {
              title: '人数',
              align: 'center',
              width: 70,
              dataIndex: 'bureauNum',
              scopedSlots: { customRender: 'bureauNum' }
            },
            {
              title: '优秀比例',
              align: 'center',
              width: 70,
              dataIndex: 'bureauRatio',
              scopedSlots: { customRender: 'bureauRatio' }
            },
            {
              title: '理论优秀名额数量',
              align: 'center',
              width: 80,
              dataIndex: 'bureauTheoryNum',
              scopedSlots: { customRender: 'bureauTheoryNum' }
            },
            {
              title: '实际分配优秀名额数量',
              align: 'center',
              dataIndex: 'bureauTrueNum',
              scopedSlots: { customRender: 'bureauTrueNum' }
            }
          ]
        },
        {
          title: '基层单位',
          align: 'center',
          children: [
            {
              title: '领导班子',
              align: 'center',
              children: [
                {
                  title: '领导班子数量',
                  align: 'center',
                  width: 90,
                  dataIndex: 'groupNum',
                  scopedSlots: { customRender: 'groupNum' }
                },
                {
                  title: '优秀比例',
                  align: 'center',
                  width: 70,
                  dataIndex: 'groupRatio',
                  scopedSlots: { customRender: 'groupRatio' }
                },
                {
                  title: '理论优秀名额数量',
                  align: 'center',
                  width: 80,
                  dataIndex: 'groupTheoryNum',
                  scopedSlots: { customRender: 'groupTheoryNum' }
                },
                {
                  title: '实际分配优秀名额数量',
                  align: 'center',
                  dataIndex: 'groupTrueNum',
                  scopedSlots: { customRender: 'groupTrueNum' }
                }
              ]
            },
            {
              title: '领导干部',
              align: 'center',
              dataIndex: 'groupNum',
              scopedSlots: { customRender: 'groupNum' },
              children: [
                {
                  title: '分局参公',
                  align: 'center',
                  width: 70,
                  dataIndex: 'basicNum',
                  scopedSlots: { customRender: 'basicNum' }
                },
                {
                  title: '优秀比例',
                  align: 'center',
                  width: 70,
                  dataIndex: 'basicRatio',
                  scopedSlots: { customRender: 'basicRatio' }
                },
                {
                  title: '理论优秀名额数量',
                  align: 'center',
                  width: 70,
                  dataIndex: 'basicTheoryNum',
                  scopedSlots: { customRender: 'basicTheoryNum' }
                },
                {
                  title: '实际分配优秀名额数量',
                  align: 'center',
                  dataIndex: 'basicTrueNum',
                  scopedSlots: { customRender: 'basicTrueNum' }
                },

                {
                  title: '事业单位',
                  align: 'center',
                  width: 70,
                  dataIndex: 'institutionNum',
                  scopedSlots: { customRender: 'institutionNum' }
                },
                {
                  title: '优秀比例',
                  align: 'center',
                  width: 70,
                  dataIndex: 'institutionRatio',
                  scopedSlots: { customRender: 'institutionRatio' }
                },
                {
                  title: '理论优秀名额数量',
                  align: 'center',
                  width: 70,
                  dataIndex: 'institutionTheoryNum',
                  scopedSlots: { customRender: 'institutionTheoryNum' }
                },
                {
                  title: '实际分配优秀名额数量',
                  align: 'center',
                  dataIndex: 'institutionTrueNum',
                  scopedSlots: { customRender: 'institutionTrueNum' }
                }
              ]
            }
          ]
        }
      ],
      role: '',
      assessing: false



    }
  },
  created() {
    this.getSuperFieldList()
    getAssessingInfo('annual').then((res) => {
      if (res.success) {
        this.lastAssessYear = res.result.currentYear
      }
    })

    getCurrentUserRoles().then(res => {
      if (res.success) {
        if (res.result.includes('department_cadre_admin')) {
          this.role = 'admin'
        }
        if (res.result.includes('gbc_cz')) {
          this.role = 'cz'
        }
        if (res.result.includes('gbc_fcz')) {
          this.role = 'fcz'
        }
      }
    })

    this.checkAssessing()
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    checkAssessing() {
      checkAssessing("annual").then(res => {
        if (res.success) {
          this.assessing = res.result
        }
      })
    },
    toFixedNumber,
    getStatusText(status) {
      switch (status) {
        case '1':
          return '待推送'
        case '2':
          return '已推送'
        case '3':
          return '已推优'
        case '4':
          return '被退回'
        case '5':
          return '副处长审核中'
        case '6':
          return '处长审核中'
        default:
          return '未知状态'
      }
    },
    initDictConfig() {
    },
    getSuperFieldList() {
      let fieldList = []
      fieldList.push({ type: 'sel_user', value: 'leader', text: '领导' })
      fieldList.push({ type: 'string', value: 'currentYear', text: '年度', dictCode: 'assess_year' })
      fieldList.push({ type: 'string', value: 'bureauRec', text: '机关处室推优情况' })
      fieldList.push({ type: 'string', value: 'groupRec', text: '领导班子推优情况', dictCode: '' })
      fieldList.push({ type: 'string', value: 'basicRec', text: '分局、参公推优情况', dictCode: '' })
      fieldList.push({ type: 'string', value: 'institutionRec', text: '事业单位推优情况', dictCode: '' })
      fieldList.push({ type: 'string', value: 'status', text: '状态', dictCode: '' })
      this.superFieldList = fieldList
    },

    beforeInit() {
      getAssessingInfo('annual').then((res) => {
        if (res.success) {
          let currentAssess = res.result
          if (!currentAssess.assessing) {
            this.$warning({
              title: '当前无正在进行中的年度考核',
              content: (h) => <div style='color:red;'>当前无正在进行中的年度考核，无法发起民主测评</div>
            })
          } else {
            checkAnnualFill().then(res => {
              if (res.success && res.result) {
                this.form.assessName = currentAssess.currentYear + '年度考核民主测评'
                this.form.currentYear = currentAssess.currentYear
                this.initRec()
              } else {
                this.$confirm({
                  title: '当前存在年度考核安排未填写完成的处室（单位）',
                  content: (h) => <div
                    style='color:red;'>当前存在年度考核安排未填写完成的处室（单位），是否继续初始化？</div>,
                  onOk: () => {
                    this.initRec()
                  },
                  onCancel: () => {
                  }
                })
              }
            })


          }
        }
      })
    },

    initRec() {
      getAction('/assess/leader/rec/init').then((res) => {
        if (res.success) {
          this.$success({
            title: '消息提示',
            content: (h) => <div style='color:red;'>{res.message}</div>
          })
          this.loadData()
        } else {
          this.$error({
            title: '消息提示',
            content: (h) => <div style='color:red;'>{res.message}</div>
          })
        }
      })
    },

    flushRec() {
      this.flushLoading = true
      getAction('/assess/leader/rec/flush').then((res) => {
        if (res.success) {
          this.$success({
            title: '消息提示',
            content: (h) => <div style='color:red;'>{res.message}</div>
          })
          this.flushLoading = false
          this.loadData()
        } else {
          this.$error({
            title: '消息提示',
            content: (h) => <div style='color:red;'>{res.message}</div>
          })
          this.flushLoading = false
        }
      })
    },

    returned(record) {
      this.$confirm({
        title: '确认退回',
        content: '确认退回吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          putAction('/modules/assessAnnualSummary/return?id=' + record.leader).then((res) => {
            if (res.success) {
              // this.$message.success('退回成功！')
              this.$success({
                title: '成功',
                content: '退回成功！',
              })
              this.loadData()
              this.$emit('refresh')
            } else {
              // this.$message.error(res.message)
              this.$error({
                title: '错误',
                content: res.message,
              })
            }
          })
        },
        onCancel: () => {
        },
      })
    },


    pushDown(record) {
      this.$confirm({
        title: '确认推送',
        content: '是否确认推送？',
        onOk: () => {
          putAction('/assess/leader/rec/pushDown?id=' + record.id, { id: record.id }).then((res) => {
            if (res.success) {
              this.$success({
                title: '消息提示',
                content: (h) => <div style='color:red;'>{res.message}</div>
              })
              this.loadData()
            } else {
              this.$error({
                title: '消息提示',
                content: (h) => <div style='color:red;'>{res.message}</div>
              })
            }
          })
        },
        onCancel: () => {
        }
      })
    },

    openExcellentNum() {
      if (this.assessing) {
        this.excellentManLoading = true
        getEnableRatioItems(this.lastAssessYear).then((res) => {
          if (res.success) {
            this.excellentItems = res.result.records
            this.dataHeading()
            this.message = res.message
            this.getOverTips()
            this.excellentManVisible = true
          }

          this.excellentManLoading = false
        })

        this.$nextTick(() => {
          this.$refs.excellentNum.toggleFullscreen()
        })
      } else {
        this.$error({
          title: '提示',
          content: (h) => <div style='color:red;'>当前无正在进行的年度考核！</div>
        })
      }
    },

    dataHeading() {
      if (this.excellentItems.length > 0) {
        let data = this.excellentItems
        let item = {
          bureauNum: 0,
          bureauTheoryNum: 0,
          bureauTrueNum: 0,
          groupNum: 0,
          groupTheoryNum: 0,
          groupTrueNum: 0,
          basicNum: 0,
          basicTheoryNum: 0,
          basicTrueNum: 0,
          institutionNum: 0,
          institutionTheoryNum: 0,
          institutionTrueNum: 0
        }
        item.leader_dictText = '合计'
        for (let i = 0; i < data.length; i++) {
          item.bureauNum += data[i].bureauNum
          item.bureauRatio = data[i].bureauRatio
          item.bureauTheoryNum += data[i].bureauTheoryNum
          item.bureauTrueNum += data[i].bureauTrueNum

          item.groupNum += data[i].groupNum
          item.groupRatio = data[i].groupRatio
          item.groupTheoryNum += data[i].groupTheoryNum
          item.groupTrueNum += data[i].groupTrueNum

          item.basicNum += data[i].basicNum
          item.basicRatio = data[i].basicRatio
          item.basicTheoryNum += data[i].basicTheoryNum
          item.basicTrueNum += data[i].basicTrueNum

          item.institutionNum += data[i].institutionNum
          item.institutionRatio = data[i].institutionRatio
          item.institutionTheoryNum += data[i].institutionTheoryNum
          item.institutionTrueNum += data[i].institutionTrueNum
        }
        this.excellentItems.push(item)
      }
    },

    getOverTips() {
      let num1 = 0
      let trueNum1 = 0
      let num2 = 0
      let trueNum2 = 0
      let num3 = 0
      let trueNum3 = 0
      let num4 = 0
      let trueNum4 = 0
      for (let i = 0; i < this.excellentItems.length; i++) {
        num1 += this.excellentItems[i].bureauTheoryNum
        trueNum1 += this.excellentItems[i].bureauTrueNum
        num2 += this.excellentItems[i].groupTheoryNum
        trueNum2 += this.excellentItems[i].groupTrueNum
        num3 += this.excellentItems[i].basicTheoryNum
        trueNum3 += this.excellentItems[i].basicTrueNum
        num4 += this.excellentItems[i].institutionTheoryNum
        trueNum4 += this.excellentItems[i].institutionTrueNum
      }
      this.bureauOver = trueNum1 > num1
      this.groupOver = trueNum2 > num2
      this.basicOver = trueNum3 > num3
      this.institutionOver = trueNum4 > num4
    },

    submitExcellentMan() {
      updateExcellentNum(this.excellentItems).then((res) => {
        if (res.success) {
          this.$success({
            title: res.message
          })
          this.excellentManVisible = false
        } else {
          this.$error({
            title: res.message
          })
        }
      })
    },

    cancelExcellentMan() {
      this.excellentManVisible = false
      this.basicOver = false
      this.bureauOver = false
      this.groupOver = false
      this.institutionOver = false
    },

    excellentNumChanged(type) {
      switch (type) {
        case 'bureau':
          let num1 = 0
          let trueNum1 = 0
          for (let i = 0; i < this.excellentItems.length - 1; i++) {
            num1 += this.excellentItems[i].bureauTheoryNum
            trueNum1 += this.excellentItems[i].bureauTrueNum
          }
          this.bureauOver = trueNum1 > num1
          this.excellentItems[this.excellentItems.length - 1].bureauTrueNum = trueNum1
          break
        case 'group':
          let num2 = 0
          let trueNum2 = 0
          for (let i = 0; i < this.excellentItems.length - 1; i++) {
            num2 += this.excellentItems[i].groupTheoryNum
            trueNum2 += this.excellentItems[i].groupTrueNum
          }
          this.groupOver = trueNum2 > num2
          this.excellentItems[this.excellentItems.length - 1].groupTrueNum = trueNum2
          break
        case 'basic':
          let num3 = 0
          let trueNum3 = 0
          for (let i = 0; i < this.excellentItems.length - 1; i++) {
            num3 += this.excellentItems[i].basicTheoryNum
            trueNum3 += this.excellentItems[i].basicTrueNum
          }
          this.basicOver = trueNum3 > num3
          this.excellentItems[this.excellentItems.length - 1].basicTrueNum = trueNum3
          break
        case 'institution':
          let num4 = 0
          let trueNum4 = 0
          for (let i = 0; i < this.excellentItems.length - 1; i++) {
            num4 += this.excellentItems[i].institutionTheoryNum
            trueNum4 += this.excellentItems[i].institutionTrueNum
          }
          this.institutionOver = trueNum4 > num4
          this.excellentItems[this.excellentItems.length - 1].institutionTrueNum = trueNum4
          break
        default:
          break
      }
    },

    getExcellentNumExcel() {
      getAssessingInfo('annual').then((res) => {
        axios
          .post(
            '/modules/annual/assessAnnualExcellentNum/exportExcel?year=' + res.result.currentYear,
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
      })
    },

    beforeExportRecommendPDF() {
      this.$confirm({
        title: '提示',
        content: '导出纸质推荐表前请确认已经分配相关局领导的优秀名额并提交，如已分配优秀名额，点击“确认”继续。',
        onOk: () => {
          this.submitExportRecommendPDF()
        }
      })
    },

    submitExportRecommendPDF(type) {
      getAssessingInfo('annual').then((res) => {
        axios
          .post(
            '/modules/assessAnnualSummary/exportRecommendExcel?year=' + res.result.currentYear + '&type=' + type + '&leader=' + this.exportRecommendLeader,
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
      })
    },


    exportRecommendPDF() {
      this.exportRecommendPDFVisible = true
    },

    cancelExportRecommendPDF() {
      this.exportRecommendPDFVisible = false
      this.exportRecommendLeader = ''
    },


  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';

.no-data-mask {
  position: absolute;
  top: 10%;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  font-size: 26px;
  font-weight: 700;
}
</style>