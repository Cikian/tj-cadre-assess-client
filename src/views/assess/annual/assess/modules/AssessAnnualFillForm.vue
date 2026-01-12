<template>
  <a-spin :spinning='confirmLoading' style='padding: 0 80px'>
    <j-form-container :disabled='formDisabled'>
      <!-- 主表单区域 -->
      <a-form-model ref='form' :model='model' :rules='validatorRules' slot='detail'>
        <table class='msgtable'>
          <tr>
            <td>年度</td>
            <td>{{ model.currentYear }}</td>
            <td>考核名称</td>
            <td>{{ model.assessName }}</td>
          </tr>
          <tr>
            <td>处室</td>
            <td>{{ model.depart_dictText }}</td>
            <td>填报人</td>
            <td>{{ model.reportBy }}</td>
          </tr>
          <tr>
            <td>被考核对象</td>
            <td>{{ leaderNames }}</td>
<!--            <td v-if='model.auditBy'>审核人</td>-->
<!--            <td v-if='model.auditBy'>{{ model.auditBy }}</td>-->
            <td v-if='model.remark' style="color: #ff3838">退回原因</td>
            <td v-if='model.remark' style="color: #ff3838">{{ model.remark }}</td>
          </tr>
        </table>

        <div class='tag'>
          <img src='@/assets/cadre/status/待提交.png' v-show='model.status == 1'>
          <img src='@/assets/cadre/status/审核中.png' v-show='model.status == 2'>
          <img src='@/assets/cadre/status/已完成.png' v-show='model.status == 3'>
          <img src='@/assets/cadre/status/已退回.png' v-show='model.status == 4'>
        </div>

        <!--        <seal :show-time='false' v-if="model.status == 3" style="position: absolute; top: -10px; right: 0" :show-title="true" :title="'审核人'" :content="model.auditBy" />-->

        <!--        <a-row>-->
        <!--          &lt;!&ndash;          <a-col :span="12" >&ndash;&gt;-->
        <!--          &lt;!&ndash;            <a-form-model-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="status">&ndash;&gt;-->
        <!--          &lt;!&ndash;              <j-dict-select-tag type="list" v-model="model.status" dictCode="report_status" placeholder="请选择状态" />&ndash;&gt;-->
        <!--          &lt;!&ndash;            </a-form-model-item>&ndash;&gt;-->
        <!--          &lt;!&ndash;          </a-col>&ndash;&gt;-->
        <!--          <a-col :span='12'>-->
        <!--            <a-form-model-item label='备注' :labelCol='labelCol' :wrapperCol='wrapperCol' prop='remark'>-->
        <!--              <a-textarea v-model='model.remark' rows='4' placeholder='请输入备注' />-->
        <!--            </a-form-model-item>-->
        <!--          </a-col>-->
        <!--        </a-row>-->
      </a-form-model>
    </j-form-container>

    <div ref='container' style='overflow-y: scroll; width: 100%'>
      <div style='margin-top: 20px'>
        <a-affix ref='fix' :target='() => this.$refs.container'>
          <div style='background-color: #fff; padding: 10px 20px' ref='div1'>
            <tj-title value='本处室(单位)年度考核工作安排'></tj-title>
          </div>
        </a-affix>
        <assess-annual-arrange-form
          ref='assessAnnualArrangeForm'
          @validateError='validateError'
          :disabled='formDisabled'
          :leaders='model.leader'
          :depart-name='model.depart_dictText'
          @saveRow='addLeader'
          :depart-type='model.departType'
        ></assess-annual-arrange-form>
      </div>

      <!--      <div v-if="model.departType !== 'bureau'" style="padding-top: 20px; background-color: white; margin: 10px 0px">-->
      <div style='background-color: white; margin: 20px 0px'>
        <a-affix ref='fix' :target='() => this.$refs.container'>
          <div
            style='background-color: #fff; padding: 10px 20px; display: flex; align-items: center; position: relative'
            ref='div22'
          >
            <t-title></t-title>
            <tj-title value='上传年度工作总结'></tj-title>
          </div>
        </a-affix>

        <!--        <t-upload :multiple="false" :dragger="true" tip-text="点击此处选择述职报告或直接将述职报拖到此处上传"-->
        <!--                  text="点击上传述职报告" style="padding: 0px 0px 30px 0px; width: 95%; margin: 0 auto"-->
        <!--                  v-model="model.reportFile" />-->
        <jeupload
          :type='"annual"'
          :allow-type='["doc","wps","docx"]'
          :disabled='formDisabled'
          :multiple='false'
          :dragger='true'
          :deorper='de'
          :logal='model.depart_dictText'
          v-model='model.duty'
        ></jeupload>
      </div>

      <div style='margin-top: 20px'>
        <a-affix ref='fix' :target='() => this.$refs.container'>
          <div
            style='background-color: #fff; padding: 10px 20px; display: flex; align-items: center; position: relative'
            ref='div2'
          >
            <tj-title value='上传述职报告（含党组织关系在本处室（单位）的局管总师和二巡）'></tj-title>
            <!--            <span style="font-size: 16px; font-weight: 600; margin-left: 20px">{{ model.currentYear }}年度</span>-->
            <tj-title v-if='model.departType !== "bureau"' :bold='false' :size=18
                      :value='"本单位共可推荐"+model.excellentDeputyNum+"名优秀副职，剩余可推荐" + (model.excellentDeputyNum - this.excellentDeputyNum) + "名"'></tj-title>
          </div>

        </a-affix>

        <a-spin tip='数据加载中...' :spinning='regularGradeLoading'>
          <a-empty v-if='regularGrade.length === 0' :imageStyle="{ height: '70px' }" style='height: 100px'>
            <span slot='description'> 当前无被测评对象 </span>
          </a-empty>

          <a-table v-else :columns='regularGradeColumns' :data-source='regularGrade' :pagination='false'>
            <!--            <template slot="quarter1" slot-scope="text, record, index">-->
            <!--              {{text === "A" ? "好" : text === "B" ? "较好"}}-->
            <!--            </template>-->

            <template slot='quarter1' slot-scope='text, record, index'>
              <div key='quarter1'>
                <j-dict-select-tag
                  v-if='record.editable'
                  type='list'
                  :value='text'
                  dictCode='regular_assess_level'
                  style='width: 100px'
                  @change="(e) => handleChange(e, record.hashId, 'quarter1')"
                />
                <template v-else>
                  {{ text }}
                </template>
              </div>
            </template>

            <template slot='quarter2' slot-scope='text, record, index'>
              <div key='quarter2'>
                <j-dict-select-tag
                  v-if='record.editable'
                  type='list'
                  :value='text'
                  dictCode='regular_assess_level'
                  style='width: 100px'
                  @change="(e) => handleChange(e, record.hashId, 'quarter2')"
                />
                <template v-else>
                  {{ text }}
                </template>
              </div>
            </template>

            <template slot='quarter3' slot-scope='text, record, index'>
              <div key='quarter3'>
                <j-dict-select-tag
                  v-if='record.editable'
                  type='list'
                  :value='text'
                  dictCode='regular_assess_level'
                  style='width: 100px'
                  @change="(e) => handleChange(e, record.hashId, 'quarter3')"
                />
                <template v-else>
                  {{ text }}
                </template>
              </div>
            </template>

            <template slot='quarter4' slot-scope='text, record, index'>
              <div key='quarter4'>
                <j-dict-select-tag
                  v-if='record.editable'
                  type='list'
                  :value='text'
                  dictCode='regular_assess_level'
                  style='width: 100px'
                  @change="(e) => handleChange(e, record.hashId, 'quarter4')"
                />
                <template v-else>
                  {{ text }}
                </template>
              </div>
            </template>

            <template slot='excellentDeputy' slot-scope='text, record, index'>
              <j-switch
                v-model='regularGrade[index].excellentDeputy'
                @change='switchChange'
                :disabled="record.type !== 'deputy' || formDisabled || (excellentDeputyNum >= model.excellentDeputyNum && regularGrade[index].excellentDeputy!=='Y')"
              ></j-switch>
            </template>

            <template slot='operation' slot-scope='text, record, index'>
              <div class='editable-row-operations'>
                <span v-if='record.editable'>
                  <a @click='() => save(record.hashId)'>保存</a>
                  <a-divider type='vertical' />
                  <a-popconfirm title='确定关闭?' @confirm='() => cancel(record.hashId)'>
                    <a>关闭</a>
                  </a-popconfirm>
                </span>
                <span v-else>
                  <a :disabled="editingKey !== '' || !record.hasRegular || formDisabled"
                     @click='() => editRow(record.hashId)'>填写</a>
                </span>
              </div>
            </template>

            <template slot='fileSlot' slot-scope='text, record, index'>
              <jeupload
                :disabled='formDisabled'
                :allow-type='["doc","wps","docx"]'
                :type='"annual"'
                :deorper='per'
                :logal='record.realname'
                v-model='regularGrade[index].dutyReport'
                :text="'上传'"
              ></jeupload>

              <!--              <a-button v-else type="primary" icon="download" @click="downloadFile(record.dutyReport)"> 下载 </a-button>-->
            </template>
          </a-table>
        </a-spin>
      </div>

      <div style='margin-top: 20px'>
        <a-affix ref='fix' :target='() => this.$refs.container'>
          <div
            style='background-color: #fff; padding: 10px 100px 10px 20px; display: flex; align-items: center; justify-content: space-between'
            ref='div2'>
            <tj-title value='领导干部受问责情况'></tj-title>
            <div>
              <a-checkbox v-model='model.nonAccountability' :disabled='accountabilityData.length > 0 || formDisabled'
                          @change='checkBoxChangeA'>
                无问责
              </a-checkbox>
              <a-button :disabled='model.nonAccountability || formDisabled' @click='handleAddA' type='primary'
                        icon='plus'>
                新增问责
              </a-button>
            </div>
          </div>

        </a-affix>

        <a-spin tip='数据加载中...' :spinning='accountabilityLoading'>
          <a-table
            size='middle'
            bordered
            rowKey='id'
            :columns='accountabilityColumns'
            :dataSource='accountabilityData'
            :pagination='false'
          >
            <template slot='fileSlot' slot-scope='text'>
              <span v-if='!text' style='font-size: 16px; font-style: italic'>无文件</span>
              <a-button v-else type='primary' icon='download' @click='downloadFile(text)'> 下载</a-button>
            </template>

            <span slot='action' slot-scope='text, record'>
              <a :disabled='formDisabled' @click='handleEditA(record)'>编辑</a>
              <a-divider type='vertical' />
              <a :disabled='formDisabled' @click='handleDeleteA(record.id)'>删除</a>
            </span>
          </a-table>
        </a-spin>
      </div>

      <div style='margin-top: 20px'>
        <a-affix ref='fix' :target='() => this.$refs.container'>
          <div
            style='background-color: #fff; padding: 10px 100px 10px 20px; display: flex; align-items: center; justify-content: space-between'
            ref='div2'>
            <tj-title value='领导干部半年以上休假情况'></tj-title>
            <div>
              <a-checkbox v-model='model.nonVacation' :disabled='vacationData.length > 0 || formDisabled'
                          @change='checkBoxChangeV'>
                无休假
              </a-checkbox>
              <a-button :disabled='model.nonVacation || formDisabled' @click='handleAddV' type='primary' icon='plus'>
                新增休假
              </a-button>
            </div>
          </div>
        </a-affix>

        <a-spin tip='数据加载中...' :spinning='vacationLoading'>
          <a-table
            size='middle'
            bordered
            rowKey='id'
            :columns='vacationColumns'
            :dataSource='vacationData'
            :pagination='false'
          >
            <template slot='date' slot-scope='text, record'>
              <span>{{ record.startDate }} — {{ record.endDate }}</span>
            </template>

            <template slot='fileSlot' slot-scope='text'>
              <span v-if='!text' style='font-size: 16px; font-style: italic'>无文件</span>
              <a-button v-else type='primary' icon='download' @click='downloadFile(text)'> 下载</a-button>
            </template>
            <span slot='action' slot-scope='text, record'>
              <a :disabled='formDisabled' @click='handleEditV(record)'>编辑</a>
              <a-divider type='vertical' />
              <a :disabled='formDisabled' @click='handleDeleteV(record.id)'>删除</a>
            </span>
          </a-table>
        </a-spin>
      </div>
    </div>
    <!--    <div style='height: 130px;'>-->
    <!--      <div style='background-color: #fff; padding: 10px 0'>-->
    <!--        <tj-title value='述职报告'></tj-title>-->
    <!--      </div>-->
    <!--      <a-empty v-if='leaderObjList.length === 0' :imageStyle='{"height": "70px"}' style='height: 100px'>-->
    <!--        <span slot='description'> 当前未选择领导干部 </span>-->
    <!--      </a-empty>-->

    <!--      <a-descriptions v-else layout='vertical' bordered :column='leaderObjList.length' size='small'>-->
    <!--        <a-descriptions-item v-for='(item, i) in leaderObjList' :key='item.personId' :label='item.personId_dictText'>-->
    <!--          <jeupload v-if='!item.dutyReport' v-model='item.dutyReport'></jeupload>-->
    <!--          <a-button-->
    <!--            v-else-->
    <!--            :ghost='true'-->
    <!--            type='primary'-->
    <!--            icon='download'-->
    <!--            size='small'-->
    <!--            @click='downloadFile(item.dutyReport)'>-->
    <!--            下载-->
    <!--          </a-button>-->
    <!--        </a-descriptions-item>-->
    <!--      </a-descriptions>-->
    <!--    </div>-->
    <!-- 子表单区域 -->
    <assess-annual-accountability-modal ref='aForm' @ok='aModalFormOk'></assess-annual-accountability-modal>
    <assess-annual-vacation-modal ref='vForm' @ok='vModalFormOk'></assess-annual-vacation-modal>
  </a-spin>

</template>

<script>
import { deleteAction, getAction, getFileAccessHttpUrl } from '@/api/manage'
import { getRefPromise } from '@/utils/JEditableTableUtil'
import { JEditableTableModelMixin } from '@/mixins/JEditableTableModelMixin'
import AssessAnnualArrangeForm from './AssessAnnualArrangeForm.vue'
import TEditableTable from '@/component/TEditableTable.vue'
import TjTitle from '@/component/TjTitle.vue'
import jeupload from '@/component/jeupload'
import {
  fillAnnualFill,
  getAccountabilityByLeaderIds,
  getAnnualArrange,
  getAnnualSummaryList,
  getAssessingInfo,
  getCurrentUserDepart,
  getGroupSummaryByFillId,
  getLeadersRegularGrade,
  getVacationByLeaderIds,
  saveAnnualFill
} from '@/api/assessApis'
import store from '@/store'
import TjSubtitle from '@/component/TjSubtitle.vue'
import { isEmpty } from 'xe-utils/methods'
import TUpload from '@/component/TUplod.vue'
import AssessAnnualAccountabilityModal
  from '@/views/assess/annual/accountability/modules/AssessAnnualAccountabilityModal.vue'
import AssessAnnualVacationModal from '@/views/assess/annual/vacation/modules/AssessAnnualVacationModal.vue'
import seal from '@/component/Seal.vue'

export default {
  name: 'AssessAnnualFillForm',
  mixins: [JEditableTableModelMixin],
  components: {
    seal,
    AssessAnnualVacationModal,
    AssessAnnualAccountabilityModal,
    TUpload,
    TjSubtitle,
    TjTitle,
    TEditableTable,
    AssessAnnualArrangeForm,
    jeupload
  },
  data() {
    return {
      cacheData: undefined,
      editingKey: '',
      de: 'de',
      per: 'per',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      model: {},
      // 新增时子表默认添加几行空数据
      addDefaultRowNum: 1,
      validatorRules: {},
      refKeys: ['assessAnnualDutyReport', 'assessAnnualArrange'],
      tableKeys: ['assessAnnualDutyReport'],
      activeKey: 'assessAnnualDutyReport',
      // 述职报告
      assessAnnualDutyReportTable: {
        loading: false,
        dataSource: []
        // columns: [
        //   {
        //     title: '考核填报id',
        //     key: 'annualFillId',
        //     type: FormTypes.input,
        //     width: '200px',
        //     placeholder: '请输入${title}',
        //     defaultValue: '',
        //     validateRules: [{ required: true, message: '${title}不能为空' }]
        //   },
        //   {
        //     title: '人员id',
        //     key: 'personId',
        //     type: FormTypes.sel_user,
        //     width: '200px',
        //     placeholder: '请输入${title}',
        //     defaultValue: '',
        //     validateRules: [{ required: true, message: '${title}不能为空' }]
        //   },
        //   {
        //     title: '述职报告',
        //     key: 'dutyReport',
        //     type: FormTypes.upload,
        //     width: '200px',
        //     placeholder: '请输入${title}',
        //     defaultValue: '',
        //     validateRules: [{ required: true, message: '${title}不能为空' }]
        //   }
        // ]
      },
      url: {
        add: '/modules/annual/assessAnnualFill/add',
        edit: '/modules/annual/assessAnnualFill/edit',
        queryById: '/modules/annual/assessAnnualFill/queryById',
        assessAnnualDutyReport: {
          list: '/modules/annual/assessAnnualFill/queryAssessAnnualDutyReportByMainId'
        },
        assessAnnualArrange: {
          list: '/modules/annual/assessAnnualFill/queryAssessAnnualArrangeByMainId'
        }
      },
      leaderList: [],
      leaderNameList: [],
      leaderObjList: [],
      regularGradeColumns: [
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
          dataIndex: 'realname',
          key: 'realname',
          align: 'center'
        },
        {
          title: '类别',
          dataIndex: 'roleName',
          key: 'roleName',
          align: 'center'
        },
        {
          title: '第一季度',
          dataIndex: 'quarter1_dictText',
          key: 'quarter1',
          align: 'center',
          scopedSlots: { customRender: 'quarter1' }
        },
        {
          title: '第二季度',
          dataIndex: 'quarter2_dictText',
          key: 'quarter2',
          align: 'center',
          scopedSlots: { customRender: 'quarter2' }
        },
        {
          title: '第三季度',
          key: 'quarter3',
          dataIndex: 'quarter3_dictText',
          align: 'center',
          scopedSlots: { customRender: 'quarter3' }
        },
        {
          title: '第四季度',
          key: 'quarter4',
          dataIndex: 'quarter4_dictText',
          align: 'center',
          scopedSlots: { customRender: 'quarter4' }
        },
        {
          title: `推荐优秀副职`,
          key: 'excellentDeputy',
          dataIndex: 'excellentDeputy',
          align: 'center',
          scopedSlots: { customRender: 'excellentDeputy' }
        },
        {
          title: '编辑平时成绩',
          key: 'operation',
          align: 'center',
          scopedSlots: { customRender: 'operation' }
        },
        {
          title: '述职报告',
          key: 'dutyReport',
          dataIndex: 'dutyReport',
          align: 'center',
          scopedSlots: { customRender: 'fileSlot' }
        }
      ],
      accountabilityColumns: [
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
          dataIndex: 'personnel'
        },
        {
          title: '问责类型',
          align: 'center',
          dataIndex: 'typeText'
        },
        {
          title: '事由',
          align: 'center',
          dataIndex: 'reason',
          width: 200
        },
        {
          title: '给予处理部门',
          align: 'center',
          dataIndex: 'processingDepart'
        },
        {
          title: '生效日期',
          align: 'center',
          dataIndex: 'effectiveDate',
          customRender: function(text) {
            return !text ? '' : text.length > 10 ? text.substr(0, 10) : text
          }
        },
        // {
        //   title: '影响期至',
        //   align: 'center',
        //   dataIndex: 'endDate',
        //   scopedSlots: { customRender: 'date' }
        // },
        {
          title: '证明材料',
          align: 'center',
          dataIndex: 'proof',
          scopedSlots: { customRender: 'fileSlot' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'action' }
        }
      ],
      vacationColumns: [
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
          title: '姓名',
          align: 'center',
          dataIndex: 'name'
        },
        {
          title: '休假类型',
          align: 'center',
          dataIndex: 'type_dictText'
        },
        {
          title: '起止时间',
          align: 'center',
          dataIndex: 'startDate',
          scopedSlots: { customRender: 'date' }
        },
        {
          title: '备注',
          align: 'center',
          dataIndex: 'remark'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'action' }
        }
      ],

      regularGrade: [],
      accountabilityData: [],
      vacationData: [],

      assessingInfo: {},

      regularGradeLoading: true,
      accountabilityLoading: true,
      vacationLoading: true,
      currentUser: {},
      leaderNames: '',

      summaryList: [],
      groupSummary: {},
      currentDepart: {},
      excellentDeputyNum: 0
    }
  },
  props: {
    //表单禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  computed: {
    formDisabled() {
      return this.disabled
    }
  },
  mounted() {
  },
  created() {
  },
  methods: {
    handleEditA: function(record) {
      this.$refs.aForm.edit(record)
      this.$refs.aForm.title = '编辑'
      this.$refs.aForm.disableSubmit = false
    },
    handleDeleteA: function(id) {
      var that = this
      deleteAction('/modules/annual/assessAnnualAccountability/delete', { id: id }).then((res) => {
        if (res.success) {
          // that.$message.success(res.message)
          this.$success({
            title: '提示',
            content: res.message
          })
          this.getAccountability()
        } else {
          // that.$message.warning(res.message)
          this.$warning({
            title: '提示',
            content: res.message
          })
        }
      })
    },
    handleEditV: function(record) {
      this.$refs.vForm.edit(record)
      this.$refs.vForm.title = '编辑'
      this.$refs.vForm.disableSubmit = false
    },
    handleDeleteV: function(id) {
      var that = this
      deleteAction('/modules/assessAnnualVacation/delete', { id: id }).then((res) => {
        if (res.success) {
          // that.$message.success(res.message)
          this.$success({
            title: '提示',
            content: res.message
          })
          this.getVacation()
        } else {
          // that.$message.warning(res.message)
          this.$warning({
            title: '提示',
            content: res.message
          })
        }
      })
    },
    checkBoxChangeA(e) {
      this.model.nonAccountability = e.target.checked
    },
    checkBoxChangeV(e) {
      this.model.nonVacation = e.target.checked
    },
    handleAddA: function() {
      this.$refs.aForm.add()
      this.$refs.aForm.title = '新增问责情况'
      this.$refs.aForm.disableSubmit = false
    },
    handleAddV: function() {
      this.$refs.vForm.add()
      this.$refs.vForm.title = '新增休假情况'
      this.$refs.vForm.disableSubmit = false
    },
    aModalFormOk() {
      // 新增/修改 成功时，重载列表
      this.getAccountability()
    },
    vModalFormOk() {
      // 新增/修改 成功时，重载列表
      this.getVacation()
    },
    handleChange(value, key, column) {
      const newData = [...this.regularGrade]
      const target = newData.find((item) => key === item.hashId)
      if (target) {
        let a = column + '_dictText'
        target[column] = value
        if (value === 'A') {
          target[a] = '好'
        } else if (value === 'B') {
          target[a] = '较好'
        } else if (value === 'C') {
          target[a] = '一般'
        } else if (value === 'D') {
          target[a] = '较差'
        } else if (value === 'E') {
          target[a] = '不确定'
        }
        this.regularGrade = newData
      }
    },
    editRow(key) {
      const newData = [...this.regularGrade]
      const target = newData.find((item) => key === item.hashId)
      this.editingKey = key
      if (target) {
        target.editable = true
        this.regularGrade = newData
      }
    },
    save(key) {
      const newData = [...this.regularGrade]
      const newCacheData = [...this.cacheData]
      const target = newData.find((item) => key === item.hashId)
      const targetCache = newCacheData.find((item) => key === item.hashId)
      if (target && targetCache) {
        delete target.editable
        this.regularGrade = newData
        Object.assign(targetCache, target)
        this.cacheData = newCacheData
      }
      this.editingKey = ''
    },
    cancel(key) {
      const newData = [...this.regularGrade]
      const target = newData.find((item) => key === item.hashId)
      this.editingKey = ''
      if (target) {
        Object.assign(
          target,
          this.cacheData.find((item) => key === item.hashId)
        )
        delete target.editable
        this.regularGrade = newData
      }
    },

    edit(record) {
      if (record && '{}' != JSON.stringify(record) && record.id) {
        this.tableReset()
      }
      if (typeof this.editBefore === 'function') this.editBefore(record)
      this.visible = true
      this.activeKey = this.refKeys[0]
      this.$refs.form.resetFields()
      this.model = Object.assign({}, record)
      if (typeof this.editAfter === 'function') this.editAfter(this.model)

      this.currentUser = store.getters.userInfo
      if (!this.model.reportBy) {
        this.model.reportBy = this.currentUser.realname
        this.model.reportBy_dictText = this.currentUser.realname
      }

      if (this.model.departType === 'bureau') {
        // 删除key为regularGradeColumns的元素
        this.regularGradeColumns.splice(7, 2)
      }

      this.getArrangeData()

      if (this.model.departType !== 'bureau') {
        getGroupSummaryByFillId(this.model.id).then((res) => {
          if (res.success && res.result) {
            this.groupSummary = res.result
          }
        })
      }

      // 获取年度考核汇总项
      getAnnualSummaryList(this.model.id).then((res) => {
        if (res.success) {
          this.summaryList = res.result.records

          // 获取当前考核信息
          getAssessingInfo('annual').then((res) => {
            if (res.success) {
              this.assessingInfo = res.result
              // 获取平时成绩
              getLeadersRegularGrade(this.model.depart, this.assessingInfo.currentYear).then((res) => {
                if (res.success && res.result.records.length > 0 && this.model.departType !== 'basic') {
                  this.regularGrade = res.result.records
                  this.regularGradeLoading = false
                  this.cacheData = this.regularGrade.map((item) => ({ ...item }))

                  let leaderIds = ''
                  for (let i = 0; i < this.regularGrade.length; i++) {
                    // 将summaryList中的数据赋值给regularGrade
                    for (let j = 0; j < this.summaryList.length; j++) {
                      if (this.regularGrade[i].hashId === this.summaryList[j].hashId) {
                        this.regularGrade[i].excellentDeputy = this.summaryList[j].excellentDeputy
                        this.regularGrade[i].hasRegular = this.summaryList[j].hasRegular
                        this.regularGrade[i].personOrder = this.summaryList[j].personOrder

                        if (this.regularGrade[i].excellentDeputy === 'Y') {
                          this.excellentDeputyNum++
                        }
                        this.regularGrade[i].dutyReport = this.summaryList[j].dutyReport
                      }
                    }
                  }

                  if (this.summaryList.length !== this.regularGrade.length){
                    for (let i = 0; i < this.summaryList.length; i++) {
                      // 在regularGrade中找不到summaryList中的数据，则新增数据
                      if (!this.regularGrade.find((item) => item.hashId === this.summaryList[i].hashId)) {
                        let obj = {
                          hashId: this.summaryList[i].hashId,
                          realname: this.summaryList[i].person,
                          roleCode: this.summaryList[i].type,
                          roleName: this.summaryList[i].type_dictText,
                          quarter1: '',
                          quarter2: '',
                          quarter3: '',
                          quarter4: '',
                          excellentDeputy: this.summaryList[i].excellentDeputy,
                          dutyReport: this.summaryList[i].dutyReport,
                          type: this.summaryList[i].type,
                          hasRegular: this.summaryList[i].hasRegular,
                          personOrder: this.summaryList[i].personOrder
                        }
                        if (obj.excellentDeputy === 'Y') {
                          this.excellentDeputyNum++
                        }
                        this.regularGrade.push(obj)
                      }
                    }
                  }

                  // 对regularGrade进行排序，按照personOrder升序排序
                  this.regularGrade.sort((a, b) => a.personOrder - b.personOrder)

                  this.cacheData = this.regularGrade.map((item) => ({ ...item }))

                  for (let i = 0; i < this.regularGrade.length; i++) {
                    // 拼接领导Id
                    if (i < this.regularGrade.length - 1) {
                      leaderIds += this.regularGrade[i].hashId + ','
                      this.leaderNames += this.regularGrade[i].realname + '，'
                    } else {
                      leaderIds += this.regularGrade[i].hashId
                      this.leaderNames += this.regularGrade[i].realname
                    }
                  }

                  this.model.leader_dictText = this.leaderNames
                  this.model.leader = leaderIds
                } else {
                  if (res.success && res.result.records.length > 0) {
                    this.regularGradeLoading = false
                    let temp = res.result.records
                    let leaderIds = ''

                    for (let i = 0; i < this.summaryList.length; i++) {
                      if (i < this.summaryList.length - 1) {
                        leaderIds += this.summaryList[i].hashId + ','
                        this.leaderNames += this.summaryList[i].person + '，'
                      } else {
                        leaderIds += this.summaryList[i].hashId
                        this.leaderNames += this.summaryList[i].person
                      }
                      this.model.leader_dictText = this.leaderNames
                      this.model.leader = leaderIds
                      let target = temp.find((item) => item.hashId === this.summaryList[i].hashId)
                      if (target) {
                        let obj = {
                          hashId: this.summaryList[i].hashId,
                          realname: this.summaryList[i].person,
                          roleCode: this.summaryList[i].type,
                          roleName: this.summaryList[i].type_dictText,
                          quarter1: target.quarter1,
                          quarter1_dictText:
                            target.quarter1 === 'A'
                              ? '好'
                              : target.quarter1 === 'B'
                                ? '较好'
                                : target.quarter1 === 'C'
                                  ? '一般'
                                  : target.quarter1 === 'D'
                                    ? '较差'
                                    : target.quarter1 === 'E'
                                      ? '不确定'
                                      : '',
                          quarter2: target.quarter2,
                          quarter2_dictText:
                            target.quarter2 === 'A'
                              ? '好'
                              : target.quarter2 === 'B'
                                ? '较好'
                                : target.quarter2 === 'C'
                                  ? '一般'
                                  : target.quarter2 === 'D'
                                    ? '较差'
                                    : target.quarter2 === 'E'
                                      ? '不确定'
                                      : '',
                          quarter3: target.quarter3,
                          quarter3_dictText:
                            target.quarter3 === 'A'
                              ? '好'
                              : target.quarter3 === 'B'
                                ? '较好'
                                : target.quarter3 === 'C'
                                  ? '一般'
                                  : target.quarter3 === 'D'
                                    ? '较差'
                                    : target.quarter3 === 'E'
                                      ? '不确定'
                                      : '',
                          quarter4: target.quarter4,
                          quarter4_dictText:
                            target.quarter4 === 'A'
                              ? '好'
                              : target.quarter4 === 'B'
                                ? '较好'
                                : target.quarter4 === 'C'
                                  ? '一般'
                                  : target.quarter4 === 'D'
                                    ? '较差'
                                    : target.quarter4 === 'E'
                                      ? '不确定'
                                      : '',
                          excellentDeputy: this.summaryList[i].excellentDeputy,
                          dutyReport: this.summaryList[i].dutyReport,
                          type: this.summaryList[i].type,
                          hasRegular: this.summaryList[i].hasRegular
                        }
                        if (obj.excellentDeputy === 'Y') {
                          this.excellentDeputyNum++
                        }
                        this.regularGrade.push(obj)
                      } else {
                        let obj = {
                          hashId: this.summaryList[i].hashId,
                          realname: this.summaryList[i].person,
                          roleCode: this.summaryList[i].type,
                          roleName: this.summaryList[i].type_dictText,
                          quarter1: '',
                          quarter2: '',
                          quarter3: '',
                          quarter4: '',
                          excellentDeputy: this.summaryList[i].excellentDeputy,
                          dutyReport: this.summaryList[i].dutyReport,
                          type: this.summaryList[i].type,
                          hasRegular: this.summaryList[i].hasRegular,
                          personOrder: this.summaryList[i].personOrder
                        }
                        if (obj.excellentDeputy === 'Y') {
                          this.excellentDeputyNum++
                        }
                        this.regularGrade.push(obj)
                      }
                    }
                    this.regularGrade.sort((a, b) => a.personOrder - b.personOrder)
                    this.cacheData = this.regularGrade.map((item) => ({ ...item }))
                  } else {
                    this.regularGradeLoading = false

                    let leaderIds = ''

                    for (let i = 0; i < this.summaryList.length; i++) {
                      if (i < this.summaryList.length - 1) {
                        leaderIds += this.summaryList[i].hashId + ','
                        this.leaderNames += this.summaryList[i].person + '，'
                      } else {
                        leaderIds += this.summaryList[i].hashId
                        this.leaderNames += this.summaryList[i].person
                      }
                      this.model.leader_dictText = this.leaderNames
                      this.model.leader = leaderIds

                      let obj = {
                        hashId: this.summaryList[i].hashId,
                        realname: this.summaryList[i].person,
                        roleCode: this.summaryList[i].type,
                        roleName: this.summaryList[i].type_dictText,
                        quarter1: '',
                        quarter2: '',
                        quarter3: '',
                        quarter4: '',
                        excellentDeputy: this.summaryList[i].excellentDeputy,
                        dutyReport: this.summaryList[i].dutyReport,
                        type: this.summaryList[i].type,
                        hasRegular: this.summaryList[i].hasRegular,
                        personOrder: this.summaryList[i].personOrder
                      }
                      if (obj.excellentDeputy === 'Y') {
                        this.excellentDeputyNum++
                      }
                      this.regularGrade.push(obj)
                    }
                    this.regularGrade.sort((a, b) => a.personOrder - b.personOrder)
                    this.cacheData = this.regularGrade.map((item) => ({ ...item }))
                  }
                }

                // 获取述职报告
                // this.getDutyDepartDutyReport()

                // 获取问责
                this.getAccountability()
                // 获取休假
                this.getVacation()
                // 获取单位信息
                getCurrentUserDepart().then(res => {
                  if (res.success) {
                    this.currentDepart = res.result

                  }
                })
              })
            }
          })
        }
      })
    },

    // getDutyDepartDutyReport() {
    //   getDutyReport(this.model.id).then(res => {
    //     if (res.success) {
    //       this.leaderObjList = res.result.records
    //
    //       // todo：确定述职报告和平时成绩如何联系
    //       // 将述职报告和推荐优秀副职赋值给regularGrade
    //       for (let i = 0; i < this.leaderObjList.length; i++) {
    //         for (let j = 0; j < this.regularGrade.length; j++) {
    //           if (this.leaderObjList[i].personId === this.regularGrade[j].hashId) {
    //             this.regularGrade[j].dutyReport = this.leaderObjList[i].dutyReport
    //             this.regularGrade[j].excellentDeputy = this.leaderObjList[i].excellentDeputy
    //           }
    //         }
    //       }
    //     }
    //
    //     // const scrollView = this.$refs['container']
    //     // scrollView.addEventListener('scroll', this.affixChange, true)
    //   })
    // },


    getArrangeData() {
      // 获取工作安排
      getAnnualArrange(this.model.id).then((res) => {
        if (res.success) {
          this.$refs.assessAnnualArrangeForm.edit(res.result)
        }
      })
    },

    getAccountability() {
      // 获取问责
      getAccountabilityByLeaderIds(this.model.leader, this.model.currentYear).then((res) => {
        if (res.success) {
          this.accountabilityData = res.result.records
        }
        this.accountabilityLoading = false
      })
    },

    getVacation() {
      // 获取休假
      getVacationByLeaderIds(this.model.leader, this.model.currentYear).then((res) => {
        if (res.success) {
          this.vacationData = res.result.records
        }
        this.vacationLoading = false
      })
    },

    addBefore() {
      this.assessAnnualDutyReportTable.dataSource = []
      this.$refs.assessAnnualArrangeForm.clearFormData()
    },
    getAllTable() {
      let values = this.tableKeys.map((key) => getRefPromise(this, key))
      return Promise.all(values)
    },
    /** 调用完edit()方法之后会自动调用此方法 */
    editAfter() {
      // this.$nextTick(() => {
      //   if (this.model.departType !== 'bureau') {
      //     this.$refs.assessAnnualArrangeForm.initFormData(this.url.assessAnnualArrange.list, this.model.id, this.model.leader, this.model.leader_dictText)
      //   }
      // })
      // 加载子表数据
      if (this.model.id) {
        let params = { id: this.model.id }
        this.requestSubTableData(this.url.assessAnnualDutyReport.list, params, this.assessAnnualDutyReportTable)
      }
    },
    /** 整理成formData */
    classifyIntoFormData(allValues) {
      let main = Object.assign(this.model, allValues.formValue)
      return {
        ...main, // 展开
        assessAnnualDutyReportList: allValues.tablesValue[0].values,
        assessAnnualArrangeList: this.$refs.assessAnnualArrangeForm.getFormData()
      }
    },
    validateError(msg) {
      // this.$message.error(msg)
      // this.$confirm({
      //   title: '消息提示',

      //   content: (h) => <div style='color:red;font-size:18px'>{msg}</div>,

      //   onOk: () => {
      //   },

      //   onCancel: () => {
      //   }
      // })
      this.$warning({
        title: '消息提示',
        content: msg
      })
    },

    handleSave() {
      this.btnLoading = true
      this.$emit('changeLoading')

      let submitForm = this.model
      submitForm.assessAnnualArrangeList = [this.$refs.assessAnnualArrangeForm.model]

      // 处理述职报告
      for (let i = 0; i < this.regularGrade.length; i++) {
        for (let j = 0; j < this.summaryList.length; j++) {
          if (this.regularGrade[i].hashId === this.summaryList[j].hashId) {
            this.summaryList[j].dutyReport = this.regularGrade[i].dutyReport
            this.summaryList[j].excellentDeputy = this.regularGrade[i].excellentDeputy
            this.summaryList[j].quarter1 = this.regularGrade[i].quarter1
            this.summaryList[j].quarter2 = this.regularGrade[i].quarter2
            this.summaryList[j].quarter3 = this.regularGrade[i].quarter3
            this.summaryList[j].quarter4 = this.regularGrade[i].quarter4
          }
        }
      }

      if (!isEmpty(this.groupSummary)) {
        this.summaryList.push(this.groupSummary)
      }

      submitForm.summaryList = this.summaryList

      saveAnnualFill(submitForm).then((res) => {
        if (res.success) {
          // this.$message.success(res.message)
          // this.$confirm({
          //   title: '消息提示',

          //   content: (h) => <div style='color:red;font-size:18px'>{res.message}</div>,

          //   onOk: () => {
          //   },

          //   onCancel: () => {
          //   }
          // })
          this.$success({
            title: '消息提示',
            content: res.message
          })
          this.$emit('ok')
          this.close()
        } else {
          // this.$message.warning(res.message)
          // this.$confirm({
          //   title: '消息提示',

          //   content: (h) => <div style='color:red;font-size:18px'>{res.message}</div>,

          //   onOk: () => {
          //   },

          //   onCancel: () => {
          //   }
          // })
          this.$warning({
            title: '消息提示',
            content: res.message
          })
        }
        this.$emit('changeLoading')
      })
    },

    handleOk() {
      if (this.model.status === 3) {
        this.$emit('ok')
        return
      }

      this.btnLoading = true
      this.$emit('changeLoading')

      if (this.accountabilityData.length <= 0 && !this.model.nonAccountability) {
        this.$warning({
          title: '未填写受问责情况',
          content: '请填写本单位受问责情况，如无问责，请勾选新增问责按钮左侧的“无问责”'
        })
        this.$emit('changeLoading')
        return
      }
      if (this.vacationData.length <= 0 && !this.model.nonVacation) {
        this.$warning({
          title: '未填写休假情况',
          content: '请填写本单位休假情况，如无休假，请勾选新增休假按钮左侧的“无休假”'
        })
        this.$emit('changeLoading')
        return
      }

      // if (this.currentDepart.departType !== '1') {
      if (this.model.duty === null || this.model.duty === '') {
        this.$warning({
          title: '未上传年度工作总结',
          content: '请上传年度工作总结'
        })
        this.$emit('changeLoading')
        return
      }
      // }

      let submitForm = this.model
      submitForm.assessAnnualArrangeList = [this.$refs.assessAnnualArrangeForm.model]

      let hasExcellentDeputy = false

      // 处理述职报告
      for (let i = 0; i < this.regularGrade.length; i++) {
        if (this.model.departType !== 'bureau' && this.regularGrade[i].hasRegular
          && (this.regularGrade[i].quarter1 === '' || this.regularGrade[i].quarter1 === null)
          && (this.regularGrade[i].quarter2 === '' || this.regularGrade[i].quarter2 === null)
          && (this.regularGrade[i].quarter3 === '' || this.regularGrade[i].quarter3 === null)
          && (this.regularGrade[i].quarter4 === '' || this.regularGrade[i].quarter4 === null)) {
          this.$warning({
            title: '未填写 ' + this.regularGrade[i].realname + ' 的平时成绩',
            content: '单位中存在参与平时考核的人员，请至少填写其第四季度的平时成绩'
          })
          this.$emit('changeLoading')
          return
        }
        if (this.regularGrade[i].dutyReport === null || this.regularGrade[i].dutyReport === '') {
          this.$warning({
            title: '未上传 ' + this.regularGrade[i].realname + ' 的述职报告',
            content: '请上传 ' + this.regularGrade[i].realname + ' 的述职报告'
          })
          this.$emit('changeLoading')
          return
        }

        if (this.regularGrade[i].excellentDeputy === 'Y') {
          hasExcellentDeputy = true
        }

        for (let j = 0; j < this.summaryList.length; j++) {
          if (this.regularGrade[i].hashId === this.summaryList[j].hashId) {
            this.summaryList[j].dutyReport = this.regularGrade[i].dutyReport
            this.summaryList[j].excellentDeputy = this.regularGrade[i].excellentDeputy
            this.summaryList[j].quarter1 = this.regularGrade[i].quarter1
            this.summaryList[j].quarter2 = this.regularGrade[i].quarter2
            this.summaryList[j].quarter3 = this.regularGrade[i].quarter3
            this.summaryList[j].quarter4 = this.regularGrade[i].quarter4
          }
        }
      }

      if (this.model.departType !== 'bureau' && !hasExcellentDeputy) {
        let that = this
        this.$confirm({
          title: '消息提示',
          content: '未推荐优秀副职，是否继续提交？',
          onOk: () => {
            submitForm.summaryList = that.summaryList

            fillAnnualFill(submitForm).then((res) => {
              if (res.success) {
                // this.$message.success(res.message)
                // this.$confirm({
                //   title: '消息提示',
                //   content: (h) => <div style='color:red;font-size:18px'>{res.message}</div>,
                //   onOk: () => {
                //   },
                //   onCancel: () => {
                //   }
                // })
                that.$success({
                  title: '消息提示',
                  content: res.message
                })
                that.$emit('ok')
                that.close()
              } else {
                // this.$message.warning(res.message)
                // this.$confirm({
                //   title: '消息提示',
                //   content: (h) => <div style='color:red;font-size:18px'>{res.message}</div>,
                //   onOk: () => {
                //   },

                //   onCancel: () => {
                //   }
                // })
                that.$warning({
                  title: '消息提示',
                  content: res.message
                })
              }
              that.$emit('changeLoading')
            })
          },
          onCancel: () => {
            that.$emit('changeLoading')
          }
        })
      } else {
        submitForm.summaryList = this.summaryList

        fillAnnualFill(submitForm).then((res) => {
          if (res.success) {
            // this.$message.success(res.message)
            // this.$confirm({
            //   title: '消息提示',
            //   content: (h) => <div style='color:red;font-size:18px'>{res.message}</div>,
            //   onOk: () => {
            //   },
            //   onCancel: () => {
            //   }
            // })
            this.$success({
              title: '消息提示',
              content: res.message
            })
            this.$emit('ok')
            this.close()
          } else {
            // this.$message.warning(res.message)
            // this.$confirm({
            //   title: '消息提示',
            //   content: (h) => <div style='color:red;font-size:18px'>{res.message}</div>,
            //   onOk: () => {
            //   },

            //   onCancel: () => {
            //   }
            // })
            this.$warning({
              title: '消息提示',
              content: res.message
            })
          }
          this.$emit('changeLoading')
        })
      }

    },
    downloadFile(text) {
      if (!text) {
        // this.$message.warning('未知的文件')
        // this.$confirm({
        //   title: '消息提示',

        //   content: (h) => <div style='color:red;font-size:18px'>未知的文件</div>,

        //   onOk: () => {
        //   },

        //   onCancel: () => {
        //   }
        // })
        this.$warning({
          title: '消息提示',
          content: '未知的文件'
        })
        return
      }
      if (text.indexOf(',') > 0) {
        text = text.substring(0, text.indexOf(','))
      }
      let url = getFileAccessHttpUrl(text)
      window.open(url)
    },
    switchChange(value) {
      if (value === 'Y') {
        this.excellentDeputyNum++
      } else {
        if (this.excellentDeputyNum > 0) this.excellentDeputyNum--
      }
    },

    addLeader(hashId) {
      // this.getGradeByLeader(hashId)
      // this.getGradeByLeader('张三男自然资源调查监测处一级巡视员')
    }
  }
}
</script>

<style scoped lang='less'>
/deep/ .ant-form {
  background-color: #ffffff;
  padding: 20px;
}

.annual-fill-head {
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
}

.msgtable {
  margin: 0 auto;
  width: 95%;
  height: 150px;
  font-size: 16px;
  font-weight: 500;
  color: #091834;

  tr {
    td {
      padding-left: 30px;
      border: 1px solid #ccd4d7;
      border-collapse: collapse;
      /* 移除单元格之间的间隔 */
    }

    td:nth-child(1),
    td:nth-child(3) {
      color: rgb(9, 24, 52);
      font-size: 18px;
      font-weight: 400;
      line-height: 60px;
      background-color: #f4f8fa;
    }
  }
}

.ant-checkbox-wrapper {
  font-size: 18px;
}

//todo： 200px硬编码
:deep(.ant-upload-list-item-card-actions) {
  position: absolute;
  left: 200px !important;
  opacity: 0;
}

.tag {
  position: absolute;
  top: -10px;
  right: 0;
}

</style>
