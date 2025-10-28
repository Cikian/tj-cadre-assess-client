<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="3" :lg="7" :md="8" :sm="24">
            <a-form-item label="年度">
              <t-dict-select-tag @change="searchQuery" placeholder="请选择年度" v-model="queryParam.currentYear"
                                 dictCode="assess_year" />
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="考核单元">
              <t-select-user-by-dep  @change="searchQuery" :multi="false" placeholder="按考核单元筛选" :year="queryParam.currentYear" :get-leader="true"
                                    v-model="queryParam.leader" store="id" text="realname" />
            </a-form-item>
          </a-col>
          <a-col :xl="3" :lg="7" :md="8" :sm="24">
            <a-form-item label="类型">
              <a-select @change="searchQuery" placeholder="按类型筛选" v-model="queryParam.type">
                <a-select-option value="z">正职</a-select-option>
                <a-select-option value="f">副职</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xl="4" :lg="7" :md="8" :sm="24">
            <a-form-item label="单位类型">
              <a-select @change="searchQuery" placeholder="按单位类型筛选" v-model="queryParam.departType">
                <a-select-option value="bureau">局机关处室</a-select-option>
                <a-select-option value="basic">基层单位</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xl="4" :lg="7" :md="8" :sm="24">
            <a-form-item label="单位">
              <j-select-depart placeholder="按单位筛选" v-model="queryParam.depart" :multi="true" />
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
          </template>
          <a-col :xl="4" :lg="7" :md="8" :sm="24">
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
      <!--      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>-->
      <!--      <a-button @click="initDemocratic" type="primary" icon="plus">发起年度民主测评</a-button>-->
      <!--      <a-button v-if="anonymousUserList.length > 0" @click="anonymousUserVisible = true" type="link"-->
      <!--        >点击查看匿名账号</a-button-->
      <!--      >-->
      <a-button @click="openProgress" type="primary" icon="clock-circle">查看局领导民主测评进度</a-button>
      <a-button @click="openDownloadGrade" type="primary" icon="download">导出民主测评成绩</a-button>
      <a-button @click="openDownloadGrade4jj" type="primary" icon="download">导出分管纪检工作处级领导干部民主测评成绩
      </a-button>
      <a-button @click="reRank" type="primary" icon="redo" :loading="reRankLoading">重新计算分数及排名</a-button>

      <!--      <a-button type="primary" icon="download" @click="handleExportXls('民主测评汇总')">导出</a-button>-->
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

    <!-- table区域-begin -->
    <div>
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="处室（单位）测评进度">
          <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            class="j-table-force-nowrap"
            :scroll="{ y: 520 }"
            :columns="departColumns"
            :dataSource="dataSource"
            :pagination="false"
            :loading="loading"
            @change="handleTableChange"
          >

            <template slot="status" slot-scope="text, record">
              <a-tag style="width: 66px" :color="record.filledNum / record.num === 1 ? '#87d068' : '#f81d22'">
                {{ record.filledNum }} /
                {{ record.num }}
              </a-tag>
              <!--          <div style='width: 96%; margin: auto'>-->
              <!--            <a-progress :percent="toFixedO(record.filledNum / record.num * 100)" size="small" status="active" />-->
              <!--          </div>-->
            </template>

          </a-table>
        </a-tab-pane>
        <a-tab-pane key="2" tab="个人汇总排名">
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
              <span>{{ (record.type === '22' || record.type === '23') && record.departType === 'bureau' ? text : ''
                }}</span>
            </template>

            <template slot="scopeRanking2" slot-scope="text, record">
              <span>{{ record.type === '32' && record.departType !== 'bureau' ? text : '' }}</span>
            </template>

            <template slot="scopeRanking3" slot-scope="text, record">
              <span>{{ record.type === '21' && record.departType === 'bureau' ? text : '' }}</span>
            </template>

            <template slot="scopeRanking4" slot-scope="text, record">
              <span>{{ record.type === '31' && record.departType !== 'bureau' ? text : '' }}</span>
            </template>

            <template slot="ranking1" slot-scope="text, record">
              <span>{{ (record.type === '22' || record.type === '23') && record.departType === 'bureau' ? text : ''
                }}</span>
            </template>

            <template slot="ranking2" slot-scope="text, record">
              <span>{{ record.type === '32' && record.departType !== 'bureau' ? text : '' }}</span>
            </template>

            <template slot="ranking3" slot-scope="text, record">
              <span>{{ record.type === '21' && record.departType === 'bureau' ? text : '' }}</span>
            </template>

            <template slot="ranking4" slot-scope="text, record">
              <span>{{ record.type === '31' && record.departType !== 'bureau' ? text : '' }}</span>
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
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handleDetail(record)">详情</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="3" tab="领导班子排名">
          <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            class="j-table-force-nowrap"
            :scroll="{ y: 520 }"
            :columns="groupColumns"
            :dataSource="groupData"
            :pagination="false"
            :loading="loading"
            @change="handleTableChange"
          >
            <template slot="appraisee" slot-scope="text, record">
              <div style="width: 96%; margin: auto">
                {{ text === 'group' ? record.depart_dictText + '-领导班子' : text.split('@')[0] }}
              </div>
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
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handleDetail(record)">详情</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
          </a-table>
        </a-tab-pane
        >

      </a-tabs>
    </div>

    <a-modal
      v-model="initModalVisible"
      title="发起年度考核民主测评"
      ok-text="发起"
      :width="700"
      cancel-text="取消"
      @ok="onSubmit"
      @cancel="handleClose"
    >
      <template slot="footer">
        <a-button
          key="back"
          @click="
            initModalVisible = false
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

    <t-modal
      :visible="anonymousUserVisible"
      title="年度考核民主测评匿名账号"
      :width="800"
      :simple-submit="true"
      @ok="handleClose"
      @cancel="handleClose"
    >
      <a-button type="primary" icon="file-excel" style="margin-bottom: 20px" @click="openExport()">导出Excel</a-button>
      <a-table :columns="userColumns" :dataSource="anonymousUserList" :pagination="false" :scroll="{ y: 500 }">
      </a-table>
    </t-modal>

    <assess-democratic-evaluation-summary-modal ref="modalForm" @ok="modalFormOk" />
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
import AssessDemocraticEvaluationSummaryModal from './modules/AssessDemocraticEvaluationSummaryModal'
import '@/assets/less/TableExpand.less'
import moment from 'moment/moment'
import { getAnonymousAccount, getAssessingInfo, submitInitDemocratic } from '@/api/assessApis'
import TModal from '@/component/TModal.vue'
import { axios } from '@/utils/assessReq'
import ProgressModal from '@/views/assess/annual/democratic/modules/ProgressModal.vue'
import { getAction, putAction } from '@/api/manage'
import TSelectUserByDep from '@/component/TSelectUserByDep.vue'
import TDictSelectTag from '@/component/TDictSelectTag.vue'

export default {
  name: 'AssessDemocraticEvaluationSummaryList',
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
          dataIndex: 'scopeRanking',
          width: 110,
          scopedSlots: { customRender: 'scopeRanking1' }
        },
        {
          title: '考核单元内正职排名（基层）',
          align: 'center',
          dataIndex: 'scopeRanking',
          width: 110,
          scopedSlots: { customRender: 'scopeRanking2' }
        },
        {
          title: '考核单元内副职排名（处室）',
          align: 'center',
          dataIndex: 'scopeRanking',
          width: 110,
          scopedSlots: { customRender: 'scopeRanking3' }
        },
        {
          title: '考核单元内副职排名（基层）',
          align: 'center',
          dataIndex: 'scopeRanking',
          width: 110,
          scopedSlots: { customRender: 'scopeRanking4' }
        },
        {
          title: '正职排名（处室）',
          align: 'center',
          dataIndex: 'ranking',
          width: 110,
          scopedSlots: { customRender: 'ranking1' }
        },
        {
          title: '正职排名（基层）',
          align: 'center',
          dataIndex: 'ranking',
          width: 110,
          scopedSlots: { customRender: 'ranking2' }
        },
        {
          title: '副职排名（处室）',
          align: 'center',
          dataIndex: 'ranking',
          width: 110,
          scopedSlots: { customRender: 'ranking3' }
        },
        {
          title: '副职排名（基层）',
          align: 'center',
          dataIndex: 'ranking',
          width: 110,
          scopedSlots: { customRender: 'ranking4' }
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
        list: '/modules/annual/democraticSummary/list',
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
      exportLoading: false
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
    downloadGrade() {
      this.exportLoading = true
      axios
        .post('/modules/annual/democraticSummary/export', this.downloadForm, { responseType: 'blob',timeout:60000 })
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
      this.loading = true
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
        } else {
          this.$confirm({
            title: '民主测评不存在',
            content: res.message,
            onOk: () => {}
          })
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

      putAction('/modules/annual/democraticSummary/rerank').then(res =>{
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
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
