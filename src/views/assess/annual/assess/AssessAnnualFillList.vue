<template>
  <a-card :bordered='false'>
    <!-- 查询区域 -->
    <div class='table-page-search-wrapper'>
      <a-form layout='inline' @keyup.enter.native='searchQuery'>
        <a-row :gutter='24'>
          <a-col :xl='6' :lg='7' :md='8' :sm='24'>
            <a-form-item label='年度'>
              <t-dict-select-tag placeholder='请选择年度' v-model='queryParam.currentYear' dictCode='assess_year' @change="searchQuery" />
            </a-form-item>
          </a-col>
          <a-col :xl='6' :lg='7' :md='8' :sm='24' v-has="'gbc:admin'">
            <a-form-item label='处室'>
              <j-select-depart placeholder='请选择处室' v-model='queryParam.depart' @change="searchQuery" />
            </a-form-item>
          </a-col>
          <a-col :xl='6' :lg='7' :md='8' :sm='24' v-has="'gbc:admin'">
            <a-form-item label='状态'>
              <j-dict-select-tag placeholder='请选择状态' v-model='queryParam.status' dictCode='report_status' @change="searchQuery" />
            </a-form-item>
          </a-col>
          <template v-if='toggleSearchStatus'>
            <!--            <a-col :xl="6" :lg="7" :md="8" :sm="24">-->
            <!--              <a-form-item label="领导干部">-->
            <!--                <j-select-user-by-dep placeholder="请选择领导干部" v-model="queryParam.leader" />-->
            <!--              </a-form-item>-->
            <!--            </a-col>-->

          </template>
          <a-col :xl='6' :lg='7' :md='8' :sm='24'>
            <span style='float: left; overflow: hidden' class='table-page-search-submitButtons'>
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
    <div class='table-operator'>
<!--      <a-button @click="initAssess" type="primary" v-has="'gbc:admin'" icon="plus">发起年度考核</a-button>-->
      <a-button v-has="'gbc:admin'" @click='confirmVoteNum' type='primary' icon='ordered-list'>民主测评前匿名票核对</a-button>

      <a-button v-has="'gbc:admin'" @click='beforeInitDemocratic' type='primary' icon='plus'>发起年度民主测评</a-button>
      <a-button v-has="'gbc:admin'" @click='openExportPeople' type='primary' icon='download'>下载历史考核人员信息</a-button>
      <a-button v-has="'depart:report'" @click='exportResVisible = true' type='primary' icon='download'>下载往年填报情况</a-button>
      <a-button v-has="'depart:leader'" @click='exportResVisible = true' type='primary' icon='download'>下载往年填报情况</a-button>

      <!--      <a-button @click="openNegativeModal" type="primary" icon="plus" v-if="canFillNegative">负面清单录入</a-button>-->
      <!--      <a-button type="primary" icon="download" @click="openExport()">导出Excel</a-button>-->
      <!--      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>-->
      <!--      <a-button type="primary" icon="download" @click="handleExportXls('年度考核填报列表')">导出</a-button>-->
      <!--      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">-->
      <!--        <a-button type="primary" icon="import">导入</a-button>-->
      <!--      </a-upload>-->
      <!--      &lt;!&ndash; 高级查询区域 &ndash;&gt;-->
      <!--      <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query>-->
      <!--      <a-dropdown v-if="selectedRowKeys.length > 0">-->
      <!--        <a-menu slot="overlay">-->
      <!--          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>-->
      <!--        </a-menu>-->
      <!--        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>-->
      <!--      </a-dropdown>-->
    </div>

    <a-modal
      v-model='addAssessVisible'
      title='发起年度考核'
      :width='700'
      ok-text='发起'
      cancel-text='取消'
      @ok='onSubmit'
      @cancel='handleClose'
    >
      <template slot='footer'>
        <a-button
          key='back'
          @click="
            addAssessVisible = false
            form.deadline = ''
          "
        >
          取消
        </a-button>
        <a-button key='submit' type='primary' :loading='btnLoading' @click='onSubmit'> 发起</a-button>
      </template>

      <a-form-model ref='ruleForm' :model='form' :label-col='labelCol' :wrapper-col='wrapperCol' :rules='rules'>
        <a-form-model-item label='考核名称' prop='assessName'>
          <a-input v-model='form.assessName' />
        </a-form-model-item>

        <a-form-model-item label='年度' prop='currentYear'>
          <a-input v-model='form.currentYear' />
        </a-form-model-item>

        <a-form-model-item label='截止日期' prop='deadline'>
          <a-date-picker
            v-model='form.deadline'
            :disabled-date='disabledDate'
            type='date'
            placeholder='请选择截至日期'
            style='width: 100%'
          />
        </a-form-model-item>
      </a-form-model>
      <a-upload
        name='file'
        :showUploadList='false'
        :multiple='false'
        :headers='head'
        :action='importExcelUrl'
        @change='handleImportExcel'
        v-if='form.currentYear && form.assessName'
      >
        <a-button type='primary' icon='import'>导入</a-button>
      </a-upload>

      <a style='display: inline-block; margin-left: 20px' v-if='showresult' @click='showtable = true'
      >解析成功，点击查看结果</a
      >

      <div v-if='showtable' style='height: 350px; margin-top: 10px'>
        <a-table
          :scroll='{ y: 300 }'
          :columns="[
            { title: '姓名', dataIndex: 'person', key: 'person', width: '20%', align: 'center' },
            { title: '性别', dataIndex: 'sex_dictText', key: 'sex_dictText', width: '14%', align: 'center' },
            {
              title: '出生年月',
              dataIndex: 'birth',
              key: 'birth',
              width: '20%',
              align: 'center',
              scopedSlots: { customRender: 'birth' },
            },
            {
              title: '单位',
              dataIndex: 'depart_dictText',
              key: 'depart_dictText',
              align: 'center',
              scopedSlots: { customRender: 'depart' },
            },
          ]"
          :dataSource='itemList'
          :pagination='false'
          :rowKey='(record) => itemList.findIndex((item) => item === record)'
        >
          <template slot='birth' slot-scope='text, record, index'>
            <div>
              {{ formatDate(text) }}
            </div>
          </template>
          <template slot='depart' slot-scope='text, record, index'>
            <div class='truncate-text'>
              {{ text }}
            </div>
          </template>
        </a-table>
      </div>
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
          <a-tag
            :color="
              record.status === 1 ? 'red' : record.status === 2 ? 'orange' : record.status === 3 ? 'green' : 'pink'
            "
          >{{ record.status_dictText }}
          </a-tag>
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
<!--          <a @click="handleEdit(record)">填报</a>-->
          <a v-show='record.status == 1 || record.status == 4' @click='handleEdit(record)'
             v-has="'depart:report'">填报</a>
          <a v-show='record.status == 2 || record.status == 3' @click='handleDetail(record)'
             v-has="'depart:report'">查看</a>
          <a @click='handleDetail(record)' v-has="'gbc:admin'">查看</a>

          <a-divider v-has="'gbc:admin'" v-show="record.status == '3' && assessingInfo.assessing && assessingInfo.currentYear === record.currentYear" type="vertical" />
          <a v-show="record.status == '3' && assessingInfo.assessing && assessingInfo.currentYear === record.currentYear" @click="openRejected(record)" v-has="'gbc:admin'">退回</a>


          <a-divider type='vertical' v-has="'depart:report'" />
          <a v-show='record.status == 2' @click='handleEdit(record)' v-has="'depart:leader'">查看/修改</a>
          <a v-show='record.status != 2' @click='handleDetail(record)' v-has="'depart:leader'">查看</a>
          <a-divider v-show="record.status == '2'" type='vertical' v-has="'depart:leader'" />
          <a v-show="record.status == '2'" @click='openRejected(record)' v-has="'depart:leader'">退回</a>


          <a-divider v-show="record.status == '2'" type='vertical' v-has="'depart:leader'" />
          <a v-show='record.status == 2' @click='passAudit(record)' v-has="'depart:leader'">通过</a>
          <!--          <a @click="passAudit(record)">通过</a>-->

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

    <assess-annual-fill-modal ref='modalForm' @ok='modalFormOk' />
    <assess-annual-negative-list-modal ref='negativeForm'></assess-annual-negative-list-modal>
    <export-people-modal ref="exportModal"></export-people-modal>

    <a-modal
      v-model='rejectedVisible'
      title='退回理由（选填）'
      ok-text='退回'
      cancel-text='取消'
      @ok='onSubmitRejected'
      @cancel='handleClose'
    >
      <a-form-model
        ref='rejectedForm'
        :model='rejectedForm'
        :label-col='labelCol'
        :wrapper-col='wrapperCol'
        :rules='rules'
      >
        <a-form-model-item label='退回理由' prop='rejectedRemark'>
          <a-textarea v-model='rejectedForm.rejectedRemark' :autoSize='{ minRows: 4 }' />
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <a-modal
      v-model='passVisible'
      title=''
      ok-text='通过'
      cancel-text='取消'
      @ok='onSubmitPass'
      @cancel='handleClosePass'
    >
      <a-form-model ref='passForm' :model='passForm'>
        <a-form-model-item label='审核人姓名' prop='name'>
          <a-textarea v-model='passForm.name' :autoSize='{ minRows: 4 }' />
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <a-modal
      v-model='initModalVisible'
      title='发起年度考核民主测评'
      ok-text='发起'
      :width='700'
      cancel-text='取消'
      @ok='onSubmitDemocratic'
      @cancel='handleClose'
    >
      <template slot='footer'>
        <a-button
          key='back'
          @click="
            initModalVisible = false
            form.deadline = ''"
        >
          取消
        </a-button>
        <a-button key='submit' type='primary' :loading='btnLoading' @click='onSubmitDemocratic'> 发起</a-button>
      </template>

      <a-form-model ref='ruleForm' :model='form' :label-col='labelCol' :wrapper-col='wrapperCol' :rules='rules'>
        <a-form-model-item label='年度' prop='currentYear'>
          <a-input disabled v-model='form.currentYear' @change='yearChange' />
        </a-form-model-item>

        <a-form-model-item label='考核名称' prop='assessName'>
          <a-input v-model='form.assessName' />
        </a-form-model-item>

        <a-form-model-item label='截止日期' prop='deadline'>
          <a-date-picker
            v-model='form.deadline'
            :disabled-date='disabledDate'
            type='date'
            placeholder='请选择截至日期'
            style='width: 100%'
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <a-modal
      title='年度考核民主测评匿名票确认'
      :width='1200'
      v-model='confirmVoteNumVisible'
      @ok='handleCloseConfirmVoteNum'
      @cancel='handleCloseConfirmVoteNum'
    >

      <template slot="footer">
        <a-button key="submit" type="primary" @click="handleCloseConfirmVoteNum">
          确认
        </a-button>
      </template>

      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="局机关各处室">
          <a-table
            :columns='confirmVoteNumColumns1'
            :data-source='confirmVoteNumList1'
            :pagination='false'
            :scroll='{ y: 500 }'
          >

            <template slot='total' slot-scope='text, record, index'>
              {{ text }} 票
            </template>

            <span slot='action' slot-scope='text, record'>
          <a @click='handleEditVoteNum(record)'>编辑</a>
        </span>

          </a-table>
        </a-tab-pane>
        <a-tab-pane key="2" tab="基层单位">
          <a-table
            :columns='confirmVoteNumColumns2'
            :data-source='confirmVoteNumList2'
            :pagination='false'
            :scroll='{ y: 500 }'
          >

            <template slot='total' slot-scope='text, record, index'>
              {{ text }} 票
            </template>

            <span slot='action' slot-scope='text, record'>
          <a @click='handleEditVoteNum(record)'>编辑</a>
        </span>

          </a-table>
        </a-tab-pane>
      </a-tabs>


    </a-modal>

    <a-modal
      title='年度考核民主测评匿名票确认'
      :width='800'
      v-model='editVoteNumVisible'
      ok-text='确认'
      cancel-text='关闭'
      @ok='submitVoteNumChange'
      @cancel='closeEditVoteNum'
    >

      <a-form-model ref='voteNumRuleForm' :model='voteNumForm' :label-col='{ span: 12 }' :wrapper-col='{ span: 12 }'>
        <a-form-model-item label='单位' prop='currentYear'>
          <span style='font-size: 18px'>{{ voteNumForm.depart}}</span>
        </a-form-model-item>
        <a-form-model-item v-show='voteNumForm.departType !== "1"' label='党政主要领导匿名票数量'>
          <a-input-number v-model='voteNumForm.voteA' />
        </a-form-model-item>
        <a-form-model-item :label='voteNumForm.departType === "1" ? "总师、二巡、正副处长匿名票数量" : "领导班子成员匿名票数量"'>
          <a-input-number v-model='voteNumForm.voteB' />
        </a-form-model-item>
        <a-form-model-item :label='voteNumForm.departType === "1" ? "其他人员匿名票数量" : "干部职工代表匿名票数量"'>
          <a-input-number v-model='voteNumForm.voteC' />
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <t-modal
      :title="'下载往年填报信息'"
      ref='exportRes'
      :width='800'
      :visible='exportResVisible'
      :simple-submit='true'
      @ok='downloadAssess'
      @cancel='exportResVisible = false'
    >

      <div slot="footer">
        <a-button :loading='exportLoading' type="primary" @click="downloadAssess">确认</a-button>
      </div>
      <a-form-model :label-col='{ span: 4 }' :wrapper-col='{ span: 14 }'>
        <a-form-model-item label='年度'>
          <t-dict-select-tag placeholder='请选择年度' v-model='exportResYear'
                             dictCode='assess_year' />
        </a-form-model-item>
      </a-form-model>
    </t-modal>


  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import AssessAnnualFillModal from './modules/AssessAnnualFillModal'
import '@/assets/less/TableExpand.less'
import moment from 'moment'
import {
  checkAnnualFill,
  getAssessingInfo,
  passTheAnnual,
  rejectedTheAudit,
  submitAnnualFill,
  submitInitDemocratic
} from '@/api/assessApis'
import AssessAnnualNegativeListModal from '@/views/assess/annual/negativeList/modules/AssessAnnualNegativeListModal.vue'
import { axios } from '@/utils/assessReq'
import Vue from 'vue'
import { ACCESS_TOKEN, TENANT_ID } from '@/store/mutation-types'
import { getAction, putAction } from '@/api/manage'
import TDictSelectTag from '@/component/TDictSelectTag.vue'
import AssessAnnualFillForm from '@/views/assess/annual/assess/modules/AssessAnnualFillForm.vue'
import TModal from '@/component/TModal.vue'
import jeupload from '@/component/jeupload.vue'
import ExportPeopleModal from '@/views/assess/annual/assess/modules/ExportPeopleModal.vue'

export default {
  name: 'AssessAnnualFillList',
  mixins: [JeecgListMixin],
  components: {
    ExportPeopleModal,
    jeupload,
    TModal, AssessAnnualFillForm,
    TDictSelectTag,
    AssessAnnualNegativeListModal,
    AssessAnnualFillModal
  },
  data() {
    return {
      description: '年度考核填报列表管理页面',
      showresult: false,
      showtable: false,
      rejectedVisible: false,
      exportResVisible: false,

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
          title: '名称',
          align: 'center',
          dataIndex: 'assessName'
        },
        {
          title: '处室（单位）',
          align: 'center',
          dataIndex: 'depart_dictText'
        },
        // {
        //   title:'领导干部',
        //   align:"center",
        //   dataIndex: 'leader_dictText'
        // },
        {
          title: '填报状态',
          align: 'center',
          dataIndex: 'status_dictText',
          scopedSlots: { customRender: 'status' }
        },
        // {
        //   title: '填报人',
        //   align: 'center',
        //   dataIndex: 'reportBy',
        // },
        // {
        //   title:'备注',
        //   align:"center",
        //   dataIndex: 'remark'
        // },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 147,
          scopedSlots: { customRender: 'action' }
        }
      ],
      confirmVoteNumColumns1: [
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
          title: '处室',
          align: 'center',
          dataIndex: 'departName'
        },
        {
          title: '总师、二巡、正副处长',
          align: 'center',
          dataIndex: 'voteB'
        },
        {
          title: '其他人员',
          align: 'center',
          dataIndex: 'voteC'
        },
        {
          title: '共',
          align: 'center',
          dataIndex: 'total',
          scopedSlots: { customRender: 'total' }
        },
        // {
        //   title: '填报人',
        //   align: 'center',
        //   dataIndex: 'reportBy',
        // },
        // {
        //   title:'备注',
        //   align:"center",
        //   dataIndex: 'remark'
        // },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 147,
          scopedSlots: { customRender: 'action' }
        }
      ],
      confirmVoteNumColumns2: [
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
          title: '单位',
          align: 'center',
          dataIndex: 'departName'
        },
        {
          title: '党政主要领导',
          align: 'center',
          dataIndex: 'voteA'
        },
        {
          title: '领导班子成员',
          align: 'center',
          dataIndex: 'voteB'
        },
        {
          title: '干部职工代表',
          align: 'center',
          dataIndex: 'voteC'
        },
        {
          title: '共',
          align: 'center',
          dataIndex: 'total',
          scopedSlots: { customRender: 'total' }
        },
        // {
        //   title: '填报人',
        //   align: 'center',
        //   dataIndex: 'reportBy',
        // },
        // {
        //   title:'备注',
        //   align:"center",
        //   dataIndex: 'remark'
        // },
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
        list: '/modules/annual/assessAnnualFill/list',
        delete: '/modules/annual/assessAnnualFill/delete',
        deleteBatch: '/modules/annual/assessAnnualFill/deleteBatch',
        exportXlsUrl: '/modules/annual/assessAnnualFill/exportXls',
        importExcelUrl: 'modules/annual/assessAnnualFill/getExcelData'
      },
      dictOptions: {},
      superFieldList: [],

      rules: {
        assessName: [{ required: true, message: '请输入考核名称', trigger: 'blur' }],
        currentYear: [{ required: true, message: '请输入年度', trigger: 'change' }],
        deadline: [{ required: true, message: '请选择截止日期', trigger: 'change' }]
      },
      addAssessVisible: false,
      assessingData: [],
      form: {
        assessName: '',
        currentYear: '',
        deadline: undefined
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      btnLoading: false,
      negativeVisible: false,
      head: {},
      itemList: [],
      canFillNegative: false,
      rejectedForm: {
        assess: 'annual',
        rejectedRemark: '', // 退回理由
        assessId: ''
      },
      passVisible: false,
      passForm: {
        id: '',
        name: ''
      },
      initModalVisible: false,
      confirmVoteNumList1: [],
      confirmVoteNumList2: [],
      confirmVoteNumVisible: false,
      editVoteNumVisible: false,
      currentAssess: {},
      voteNumForm: {
        id: '',
        depart: '',
        departType: '',
        voteA: 0,
        voteB: 0,
        voteC: 0
      },
      assessingInfo: {},
      exportLoading: false,
      exportResYear: '',

    }
  },
  created() {
    this.getSuperFieldList()

    getAssessingInfo("annual").then(res => {
      if (res.success){
        this.assessingInfo = res.result
      }
    })
  },
  mounted() {
    this.checkCanFillNegative()
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
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
    downloadAssess() {
      this.exportLoading = true
      let year = this.exportResYear
      if (year == null || year === '' || year === undefined) {
        year = 0
      }
      axios
        .post(
          '/modules/assessAnnualSummary/downLoadFill?year=' + year,
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

    openExportPeople() {
      this.$refs.exportModal.initData()
      this.$refs.exportModal.visible = true
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
          //   },
          // })
          this.$success({
            title: '消息提示',
            content: (h) => <div style='color:red;'>{res.message}</div>
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
            title: '消息提示',
            content: (h) => <div style='color:red;'>{res.message}</div>
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
      passTheAnnual(this.passForm.id, this.passForm.name).then((res) => {
        if (res.success) {
          // this.$message.success(res.message)
          // this.$confirm({
          //   title: '消息提示',
          //   content: (h) => <div style="color:red;">{res.message}</div>,
          //   onOk: () => {
          //   },
          //   onCancel: () => {
          //   },
          // })
          this.$success({
            title: '消息提示',
            content: (h) => <div style='color:red;'>{res.message}</div>
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
            title: '消息提示',
            content: (h) => <div style='color:red;'>{res.message}</div>
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
    openRejected(record) {
      this.rejectedVisible = true
      this.rejectedForm.assessId = record.id
    },
    checkCanFillNegative() {
      getAction('/common/canFillNegative').then((res) => {
        if (res.success) {
          this.canFillNegative = res.result
        }
      })
    },
    formatDate(dateStr) {
      if (!dateStr) return ''
      const year = dateStr.substring(0, 4)
      const month = dateStr.substring(4, 6)
      const day = dateStr.substring(6, 8)
      return `${year}-${month}-${day}`
    },
    initDictConfig() {
    },
    getSuperFieldList() {
      let fieldList = []
      fieldList.push({ type: 'string', value: 'currentYear', text: '年度', dictCode: 'assess_year' })
      fieldList.push({ type: 'string', value: 'assessName', text: '名称', dictCode: '' })
      fieldList.push({ type: 'sel_depart', value: 'depart', text: '处室' })
      fieldList.push({ type: 'sel_user', value: 'leader', text: '领导干部' })
      fieldList.push({ type: 'int', value: 'status', text: '状态', dictCode: 'report_status' })
      fieldList.push({ type: 'string', value: 'reportBy', text: '填报人', dictCode: '' })
      fieldList.push({ type: 'string', value: 'remark', text: '备注', dictCode: '' })
      this.superFieldList = fieldList
    },
    handleEdit: function(record) {
      this.$refs.modalForm.edit(record)
      this.$refs.modalForm.title = '年度考核填报'
      this.$refs.modalForm.disableSubmit = false
    },
    handleEditVoteNum: function(record) {
      this.voteNumForm.id = record.id
      this.voteNumForm.depart = record.departName
      this.voteNumForm.departType = record.departType
      this.voteNumForm.voteA = record.voteA
      this.voteNumForm.voteB = record.voteB
      this.voteNumForm.voteC = record.voteC

      this.editVoteNumVisible = true
    },
    closeEditVoteNum: function() {
      this.voteNumForm.id = ''
      this.voteNumForm.depart = ''
      this.voteNumForm.departType = ''
      this.voteNumForm.voteA = 0
      this.voteNumForm.voteB = 0
      this.voteNumForm.voteC = 0

      this.editVoteNumVisible = false
    },
    initAssess() {
      let date = new Date()
      let year = date.getFullYear()
      this.form.assessName = year + '年度考核'
      this.form.currentYear = year
      this.addAssessVisible = true
    },
    openNegativeModal() {
      this.$refs.negativeForm.add()
      this.$refs.negativeForm.title = '负面清单录入'
      this.$refs.negativeForm.disableSubmit = false
    },
    onSubmit() {
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
              this.addAssessVisible = false
              this.loadData()
            } else {
              // this.$message.error(res.message)
              // this.$confirm({
              //   title: '消息提示',

              //   content: (h) => <div style="color:red;font-size:18px">{res.message}</div>,

              //   onOk: () => {
              //   },

              //   onCancel: () => {
              //   },
              // })
              this.$error({
                title: '消息提示',
                content: (h) => <div style='color:red;font-size:18px'>{res.message}</div>
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
      this.itemList = []
      this.showresult = false
      this.showtable = false
    },
    handleCloseConfirmVoteNum() {
      this.confirmVoteNumList1 = []
      this.confirmVoteNumList2 = []
      this.confirmVoteNumVisible = false
    },
    disabledDate(current) {
      // Can not select days before today and today
      return current && current < moment().endOf('day')
    },
    openExport() {
      axios.post('/modules/annual/assessAnnualFill/exportExcel', {}, { responseType: 'blob' }).then((res) => {
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
        }
      })
    },
    handleImportExcel(info) {
      if (info.file.status === 'done') {
        // this.$message.success(`${info.file.name} 文件上传成功`)
        const mes = `${info.file.name} 文件解析成功`
        this.$success({
          title: '消息提示',
          content: (h) => <div style='color:red;font-size:18px'>{mes}</div>
        })
        this.itemList = info.file.response.result.records
        this.showresult = true
      } else if (info.file.status === 'error') {
        // this.$message.error(`${info.file.name} 文件上传失败.`)
        const mess = `${info.file.name} 文件上传失败`
        this.$error({
          title: '消息提示',
          content: (h) => <div style='color:red;font-size:18px'>{mess}</div>
        })
      }
    },

    openConfirm(title, content) {
      this.$confirm({
        title: title,
        content: (h) => content,
        onOk() {
        },
        onCancel() {
        },
        class: 'test'
      })
    },

    confirmVoteNum() {
      getAssessingInfo('annual').then((res) => {
        if (res.success) {
          this.currentAssess = res.result
          if (!this.currentAssess.assessing) {

            this.$warning({
              content: (h) => <div style='color:red;'>当前无正在进行中的年度考核</div>
            })

          } else {
            getAction('/modules/annual/assessAnnualFill/getVoteNumList?year=' + this.currentAssess.currentYear).then(res => {
              if (res.success) {
                let list = res.result

                this.confirmVoteNumList1 = list.filter(item => item.departType === '1')
                this.confirmVoteNumList2 = list.filter(item => item.departType !== '1')

                this.confirmVoteNumVisible = true
              }
            })

          }

        }

      })
    },


    beforeInitDemocratic() {

      getAssessingInfo('annual').then((res) => {
        if (res.success) {
          this.currentAssess = res.result
          if (!this.currentAssess.assessing) {

            this.$warning({
              title: '当前无正在进行中的年度考核',
              content: (h) => <div style='color:red;'>当前无正在进行中的年度考核，无法发起民主测评</div>
            })

          } else {

            checkAnnualFill().then(res1 => {
              if (res1.success && res1.result) {
                this.form.assessName = this.currentAssess.currentYear + '年度考核民主测评'
                this.form.currentYear = this.currentAssess.currentYear
                this.initDemocratic()
              } else {
                this.$confirm({
                  title: '年度考核安排尚未全部填写完成',
                  content: (h) => <div
                    style='color:red;'>当前存在年度考核安排未填写完成的处室（单位），是否强制发起民主测评？强制发起后，目前未填写年度考核安排的处室（单位）将无法参与民主测评！</div>,
                  onOk: () => {
                    this.form.assessName = this.currentAssess.currentYear + '年度考核民主测评'
                    this.form.currentYear = this.currentAssess.currentYear
                    this.initDemocratic()
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

    initDemocratic() {
      this.confirmVoteNumVisible = false
      this.initModalVisible = true
    },

    onSubmitDemocratic() {
      this.btnLoading = true
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          submitInitDemocratic(this.form).then((res) => {
            if (res.success) {
              this.initModalVisible = false
              this.loadData()
            } else {
              // this.$message.error(res.message)
              this.$error({
                title: '消息提示',
                content: (h) => <div style='color:red;'>{res.message}</div>
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

    submitVoteNumChange(){
      putAction('/modules/annual/assessAnnualFill/editVoteNum', this.voteNumForm).then(res => {
        if (res.success){
          this.closeEditVoteNum();
          this.$success({
            title: '消息提示',
            content: (h) => <div>{res.message}</div>
          })
          this.confirmVoteNum()
        } else {
          this.$error({
            title: '消息提示',
            content: (h) => <div style='color:red;'>{res.message}</div>
          })
        }
      })

    },

    yearChange() {
      this.form.assessName = this.form.currentYear + '年度考核民主测评'
    }

  }

}
</script>
<style scoped>
.test {
  font-size: 18px;
}

/deep/ .ant-table-tbody .ant-table-row td {
  padding-top: 15px;
  padding-bottom: 15px;
  background-color: white !important;
}

.truncate-text {
  white-space: nowrap; /* 防止文本换行 */
  overflow: hidden; /* 超出部分隐藏 */
  text-overflow: ellipsis; /* 显示省略号 */
  max-width: 150px; /* 设置最大宽度，可以根据需要调整 */
}

@import '~@assets/less/common.less';
</style>
