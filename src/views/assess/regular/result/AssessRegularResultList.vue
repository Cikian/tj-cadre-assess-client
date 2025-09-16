<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="年度">
              <t-dict-select-tag placeholder="请选择年度" v-model="queryParam.currentYear" dictCode="assess_year" />
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="姓名">
              <j-input placeholder="请选择姓名" v-model="queryParam.name"/>
            </a-form-item>
          </a-col>
<!--          <a-col :xl="6" :lg="7" :md="8" :sm="24">-->
<!--            <a-form-item label="姓名">-->
<!--              <j-select-user-by-dep placeholder="请选择姓名" v-model="queryParam.name" />-->
<!--            </a-form-item>-->
<!--          </a-col>-->
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="所在处室">
              <j-select-depart placeholder="请选择所在处室" v-model="queryParam.departmentCode" />
            </a-form-item>
          </a-col>
          <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
          <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
<!--          <a-button-->
<!--            type="primary"-->
<!--            icon="download"-->
<!--            style="margin-left: 8px"-->
<!--            @click="handleExportXls('平时考核员工信息清单')"-->
<!--            >导出</a-button-->
<!--          >-->
        </a-row>
        <a-row style="margin-bottom: 16px">
          <a-col :xl="24" :lg="7" :md="8" :sm="24">
            <a-button @click="openExport" type="primary" icon="clock-circle" style="margin-right: 8px">下载历史考核人员信息</a-button>
            <a-button style="margin-right: 8px" @click="openAdjustment" type="primary" icon="edit">考核人员调整</a-button>
            <a-button type="primary" icon="download" @click="handleExportXls('平时考核员工信息清单')">导出考核成绩</a-button>
            <a-button type="primary" icon="pie-chart" style="margin-left: 8px"
                      @click="openAssessDetail">查看考核信息
            </a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- table区域-begin -->
    <div>
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

<!--        <template slot="quarter1" slot-scope="text">-->
<!--          {{ !text ? '空' : text }}-->
<!--        </template>-->
<!--        <template slot="quarter2" slot-scope="text">-->
<!--          {{ !text ? '空' : text }}-->
<!--        </template>-->
<!--        <template slot="quarter3" slot-scope="text">-->
<!--          {{ !text ? '空' : text }}-->
<!--        </template>-->
<!--        <template slot="quarter4" slot-scope="text">-->
<!--          {{ !text ? '空' : text }}-->
<!--        </template>-->

        <template slot="name" slot-scope="text, record">
          <span>{{record.delFlag == 1 ? text + "（不参与考核）" : text}}</span>
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

        </span>
      </a-table>
    </div>
<!--    <export-modal ref="exportModal" @ok="exportModalOk" @over="downloadOver"></export-modal>-->
    <export-modal ref="exportModal"></export-modal>
    <personnelAdjustment @ok="loadData" ref="adjustment"></personnelAdjustment>

    <assess-regular-result-modal ref="modalForm" @ok="modalFormOk"></assess-regular-result-modal>
    <ExportExl
      ref="exportExl"
      :fileName="currentFileName"
      :personnelDepartment="currentPersonnelDepartment"
      :personnelValue="currentPersonnelValue"
      :url="this.url.exportXlsUrl"
    />
    <detail-modal ref="detailModal" @detail="openDetail"></detail-modal>
    <detail-item-modal ref="detailItemModal" @callBack="openDetail()"></detail-item-modal>
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import AssessRegularResultModal from './modules/AssessRegularResultModal'
import { filterMultiDictText } from '@/components/dict/JDictSelectUtil'
import ExportModal from '@/views/assess/regular/result/modules/ExportModal.vue'
import PersonnelAdjustment from '@/views/assess/regular/report/modules/PersonnelAdjustment.vue'
import ExportExl from '@/views/assess/regular/result/modules/ExportExl.vue'
import TDictSelectTag from '@/component/TDictSelectTag.vue'
import DetailModal from '@/views/assess/regular/result/modules/DetailModal.vue'
import DetailItemModal from '@/views/assess/regular/result/modules/DetailItemModal.vue'

export default {
  name: 'AssessRegularResultList',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    DetailItemModal,
    DetailModal,
    TDictSelectTag,
    ExportModal,
    ExportExl,
    PersonnelAdjustment,
    AssessRegularResultModal,
  },
  data() {
    return {
      description: '平时考核结果管理页面',
      disableMixinCreated: true,
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
          title: '姓名',
          align: 'center',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
        },
        // {
        //   title: '职务职级',
        //   align: 'center',
        //   dataIndex: 'rank',
        // },
        {
          title: '所在处室',
          align: 'center',
          dataIndex: 'departmentCode_dictText',
        },
        {
          title: '年度',
          align: 'center',
          dataIndex: 'currentYear_dictText',
        },
        {
          title: '第一季度',
          align: 'center',
          dataIndex: 'quarter1_dictText',
        },
        {
          title: '第二季度',
          align: 'center',
          dataIndex: 'quarter2_dictText',
        },
        {
          title: '第三季度',
          align: 'center',
          dataIndex: 'quarter3_dictText',
        },
        {
          title: '第四季度',
          align: 'center',
          dataIndex: 'quarter4_dictText',
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
        list: '/regular/result/list',
        delete: '/regular/result/delete',
        deleteBatch: '/regular/result/deleteBatch',
        exportXlsUrl: '/regular/report/regularCustomExport',
        importExcelUrl: 'regular/result/importExcel',
      },
      dictOptions: {},
      superFieldList: [],
      currentFileName: '',
      currentPersonnelDepartment: '公务员考核结果',
      currentPersonnelValue: 0,
    }
  },
  created() {
    this.queryParam.pageSize = 20
    this.queryParam.adminDepartment = '人事处'
    this.getSuperFieldList()
    this.loadData()
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
  },
  methods: {
    openDetail(type) {
      this.$refs.detailItemModal.initData(type)
    },
    initDictConfig() {},
    getSuperFieldList() {
      let fieldList = []
      fieldList.push({ type: 'sel_user', value: 'name', text: '姓名' })
      fieldList.push({ type: 'int', value: 'sex', text: '性别', dictCode: 'sex' })
      fieldList.push({ type: 'string', value: 'phone', text: '电话', dictCode: '' })
      fieldList.push({ type: 'string', value: 'post', text: '职务职级', dictCode: 'sys_position,name,code' })
      fieldList.push({ type: 'string', value: 'isLeader', text: '是否处级领导', dictCode: 'yn' })
      fieldList.push({ type: 'sel_depart', value: 'departmentCode', text: '所在处室' })
      fieldList.push({ type: 'string', value: 'currentYear', text: '年度', dictCode: 'assess_year' })
      fieldList.push({ type: 'string', value: 'quarter1', text: '第一季度', dictCode: 'regular_assess_level' })
      fieldList.push({ type: 'string', value: 'quarter2', text: '第二季度', dictCode: 'regular_assess_level' })
      fieldList.push({ type: 'string', value: 'quarter3', text: '第三季度', dictCode: 'regular_assess_level' })
      fieldList.push({ type: 'string', value: 'quarter4', text: '第四季度', dictCode: 'regular_assess_level' })
      fieldList.push({ type: 'string', value: 'note', text: '备注', dictCode: '' })
      this.superFieldList = fieldList
    },
    searchReset() {
      this.queryParam = {}
      this.queryParam.pageSize = 20
      this.queryParam.isLeader = 0
      this.queryParam.adminDepartment = '人事处'
      this.loadData(1)
    },

    openExport() {
      this.$refs.exportModal.initData()
      this.$refs.exportModal.visible = true
    },
    openAdjustment() {
      this.$refs.adjustment.title = '平时考核人员调整'
      this.$refs.adjustment.visible = true
    },
    handleExportXls(fileName) {
      this.currentFileName = fileName // 设置当前文件名
      this.$refs.exportExl.title = '导出详细信息'
      this.$refs.exportExl.visible = true
    },
    openAssessDetail(){
      this.$refs.detailModal.title = '考核信息'
      this.$refs.detailModal.visible = true
    }
  },
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
