<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="年度">
              <t-dict-select-tag @change='searchQuery' placeholder="请选择年度" v-model="queryParam.currentYear" dictCode="assess_year" />
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="单位（处室）">
              <j-select-depart @change='searchQuery' placeholder="请选择单位（处室）" v-model="queryParam.departId"/>
            </a-form-item>
          </a-col>

          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="等次">
              <j-dict-select-tag @change='searchQuery' placeholder="请选择等次" v-model="queryParam.level" dictCode="assess_level" />
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">

<!--            <a-col :xl="6" :lg="7" :md="8" :sm="24">-->
<!--              <a-form-item label="单位类型">-->
<!--                <j-dict-select-tag-->
<!--                  placeholder="请选择单位类型"-->
<!--                  v-model="queryParam.departType"-->
<!--                  dictCode="score_depart_type"-->
<!--                />-->
<!--              </a-form-item>-->
<!--            </a-col>-->
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

    <div class="table-operator">
      <a-button type="primary" icon="download" @click="openNonAssess()">当前未被考核处室（单位）
        <a-badge style="margin-left: 10px" :count="nonAssessData.length" />
      </a-button>
      <a-button type="primary" icon="download" @click="open">导出各处室（单位）测评成绩PDF</a-button>
      <a-button type="primary" icon="download" @click="openExport">测评成绩汇总（含加减分）</a-button>
      <a-button @click="downExcel" type="primary" icon="download">按年度范围下载成绩</a-button>
      <a-button @click="downdetails" type="primary" icon="download">导出业务测评明细</a-button>
      <a-button @click="searchByDeparts" type="primary" icon="download">选择单位查询</a-button>
      <a-button @click="reCalBusnessRank" type="primary" icon="download">重新计算排名</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px">
        <!--        <i class='anticon anticon-info-circle ant-alert-icon'></i> 已选择 <a-->
        <!--        style='font-weight: 600'>{{ selectedRowKeys.length }}</a>项-->
        <!--        <a style='margin-left: 24px' @click='onClearSelected'>清空</a>-->
        <!--        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-->
        <span>当前年度优秀比例：{{ excellentProportion }}%，</span>
        <span>良好比例：{{ goodProportion }}%，</span>
        <span>一般比例：{{ generalProportion }}%</span>
      </div>
      <a-tabs v-model:activeKey="activeKey" type="card" @change="callback">
        <a-tab-pane v-for="item in departTypeDict" :key="item.value" :tab="item.title">

        </a-tab-pane>
      </a-tabs>

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
        <template slot="depart" slot-scope="text, record">
          <j-ellipsis :value="text" :length="18" />
        </template>

        <template slot="addReason" slot-scope="text, record">
          <j-ellipsis :value="text" :length="20" />
        </template>

        <template slot="subtractReason" slot-scope="text, record">
          <j-ellipsis :value="text" :length="20" />
        </template>

        <template slot="level" slot-scope="text, record">
          <a-tag :color="record.level === '1' ? '#fc5531' : record.level === '2' ? '#87d068' : '#2db7f5'"
            >{{ text }}
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
          <a v-has='"gbc:admin"' @click="handleEdit(record)">编辑</a>

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

    <assess-business-export-modal ref="open" @ok="exportModalOk" @over="downloadOver"></assess-business-export-modal>

    <assess-business-non-assess-modal ref="nonAssessModal"></assess-business-non-assess-modal>

    <assess-business-grade-modal ref="modalForm" @ok="modalFormOk"></assess-business-grade-modal>

    <download-modal ref="downloadModal"></download-modal>

    <export-modal ref="exportModal" @ok="exportModalOk" @over="downloadOver" />
<!--    <export-details ref="exportDetails" @ok="exportModalOk" @over="downloadOver" />-->
    <search-by-departs-modal ref="departsModal" @ok="getQueryParam"></search-by-departs-modal>
    <search-by-departs-result-modal ref="departsResultModal"></search-by-departs-result-modal>
    <export-by-year-modal ref="exportBusinessDetailsModal" @ok="exportBusinessDetailsModalOk"></export-by-year-modal>
    <export-by-year-modal ref="exportBusinessResultModal" @ok="exportBusinessResultModalOk"></export-by-year-modal>
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import AssessBusinessGradeModal from './modules/AssessBusinessGradeModal.vue'
import { getAssessingInfo, getBusinessNonAssessDepart, getProportionCount } from '@api/assessApis'
import AssessBusinessExportModal from './modules/AssessBusinessExportModal.vue'
import DownloadModal from '@/component/modal/DownloadModal.vue'
import AssessBusinessNonAssessModal from '@/views/assess/business/summary/modules/AssessBusinessNonAssessModal.vue'
import ExportModal from '../../business/summary/modules/ExportModal.vue'
import ExportDetails from '../../business/summary/modules/ExportDetails.vue'
import SearchByDepartsModal from './modules/SearchByDepartsModal'
import SearchByDepartsResultModal from './modules/SearchByDepartsResultModal'
import { axios } from '@/utils/assessReq'
import TDictSelectTag from '@/component/TDictSelectTag.vue'
import { getAction } from '@/api/manage'
import ExportByYearModal from '@/views/assess/common/ExportByYearModal.vue'

export default {
  name: 'AssessBusinessGradeList',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    TDictSelectTag,
    AssessBusinessNonAssessModal,
    DownloadModal,
    AssessBusinessExportModal,
    AssessBusinessGradeModal,
    ExportModal,
    ExportByYearModal,
    ExportDetails,
    SearchByDepartsModal,
    SearchByDepartsResultModal
  },
  data() {
    return {
      queryParam:{
        departType:'1',
        pageNo:1,
        pageSize : 100
      },
      ipagination: {
        current: 1,
        pageSize: 100,
        pageSizeOptions: ['100'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: false,
        showSizeChanger: false,
        total: 0
      },
      disableMixinCreated:true,
      description: '业务工作测评成绩汇总管理页面',
      departTypeDict:[
        {
          title:'局机关各处室',
          value:'1'
        },
        {
          title:'分局',
          value:'2'
        },
        {
          title:'事业单位+参公',
          value:'3,4'
        },
      ],
      activeKey:'1',
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: '',
          key:'rowIndex',
          width:60,
          align:"center",
          customRender:function (t,r,index) {
            return parseInt(index)+1;
          }
        },
        {
          title: '年度',
          align: 'center',
          dataIndex: 'currentYear_dictText',
        },
        {
          title: '单位（处室）',
          align: 'center',
          dataIndex: 'departId_dictText',
          scopedSlots: { customRender: 'depart' },
          width: 150,
        },
        {
          title: '排名',
          align: 'center',
          dataIndex: 'ranking',
        },
        {
          title: '最终分数',
          align: 'center',
          dataIndex: 'score',
        },
        {
          title:'测评得分',
          align:"center",
          dataIndex: 'assessScore'
        },
        {
          title: '加分',
          align: 'center',
          dataIndex: 'addPoints',
        },
        {
          title: '减分',
          align: 'center',
          dataIndex: 'subtractPoints',
        },
        {
          title: '加分原因',
          align: 'center',
          dataIndex: 'addReason',
          width: 250,
          scopedSlots: { customRender: 'addReason' },
        },
        {
          title: '减分原因',
          align: 'center',
          dataIndex: 'subtractReason',
          width: 250,
          scopedSlots: { customRender: 'subtractReason' },
        },
        {
          title: '等次',
          align: 'center',
          dataIndex: 'level_dictText',
          scopedSlots: { customRender: 'level' },
        },
        // {
        //   title:'单位类型',
        //   align:"center",
        //   dataIndex: 'departType_dictText'
        // },
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
        list: '/modules/assessBusinessGrade/list',
        delete: '/modules/assessBusinessGrade/delete',
        deleteBatch: '/modules/assessBusinessGrade/deleteBatch',
        exportXlsUrl: '/modules/assessBusinessGrade/exportXls',
        importExcelUrl: 'modules/assessBusinessGrade/importExcel',
        reCalBusnessRank: 'modules/assessBusinessGrade/reCalBusinessRank',
      },
      dictOptions: {},
      superFieldList: [],
      excellentProportion: '',
      goodProportion: '',
      generalProportion: '',
      exportModalVisible: false,
      downloadModalVisible: false,
      lastAssessYear: '',
      assessingInfo: {},
      nonAssessData: [],
    }
  },
  created() {
    this.queryParam.pageNo=1;
    this.queryParam.pageSize=100;
    this.loadData()
    //初始化字典配置 在自己页面定义
    this.initDictConfig()
    this.getSuperFieldList()
    this.getAssessing();
  },
  mounted(){
    this.loadData()
    this.getAssessing();
    this.initDictConfig()
    this.getSuperFieldList()
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
  },
  methods: {
    getQueryParam(queryParam){
      this.$refs.departsResultModal.initData(queryParam)
    },
    searchReset() {
      this.queryParam = {}
      this.queryParam.departType = '1'
      this.queryParam.pageNo=1;
      this.queryParam.pageSize=100;
      this.activeKey = '1'
      this.loadData(1)
    },
    callback(key) {
      this.queryParam.departType = key
      this.queryParam.pageNo=1;
      this.queryParam.pageSize=100;
      this.loadData(1)
      this.getStatisticsCounts(this.queryParam.departType)
    },
    searchByDeparts(){
      this.$refs.departsModal.initData(this.lastAssessYear)
      this.$refs.departsModal.visible = true
    },
    initDictConfig() {},
    getSuperFieldList() {
      let fieldList = []
      fieldList.push({ type: 'string', value: 'currentYear', text: '年度', dictCode: 'year_code,year_value,year_key' })
      fieldList.push({ type: 'int', value: 'ranking', text: '排名', dictCode: '' })
      fieldList.push({ type: 'sel_depart', value: 'departId', text: '单位（处室）' })
      fieldList.push({ type: 'BigDecimal', value: 'score', text: '分数', dictCode: '' })
      fieldList.push({ type: 'BigDecimal', value: 'assessScore', text: '测评得分', dictCode: '' })
      fieldList.push({ type: 'BigDecimal', value: 'addSubtractPoints', text: '加减分', dictCode: '' })
      fieldList.push({ type: 'string', value: 'addReason', text: '加分原因', dictCode: '' })
      fieldList.push({ type: 'string', value: 'subtractReason', text: '减分原因', dictCode: '' })
      fieldList.push({ type: 'int', value: 'level', text: '等次', dictCode: 'assess_level' })
      fieldList.push({ type: 'int', value: 'departType', text: '单位类型', dictCode: 'score_depart_type' })
      this.superFieldList = fieldList
    },
    handleEdit: function (record) {
      this.$refs.modalForm.edit(record)
      this.$refs.modalForm.title = record.departId_dictText + ' — 业务工作测评详情'
      this.$refs.modalForm.disableSubmit = false
    },

    getStatisticsCounts(type) {
      getProportionCount(this.lastAssessYear, type).then((res) => {
        if (res.success) {
          this.excellentProportion = res.result.excellentProportion
          this.goodProportion = res.result.goodProportion
          this.generalProportion = res.result.generalProportion
        } else {
          this.excellentProportion = '0'
          this.goodProportion = '0'
          this.generalProportion = '0'
        }
      })
    },

    modalFormOk() {
      // 新增/修改 成功时，重载列表
      this.loadData()
      //清空列表选中
      this.onClearSelected()

      this.getStatisticsCounts()
    },

    exportModalOk() {
      this.$refs.downloadModal.changeVisible()
    },

    downloadOver() {
      this.$refs.downloadModal.changePercentTo100()
    },

    openNonAssess() {
      if (this.assessingInfo.assessing) {
        this.$refs.nonAssessModal.departData = this.nonAssessData
        this.$refs.nonAssessModal.visible = true
      } else {
        this.$info({
          title: '消息提示',
          content: this.assessingInfo.assessName + '已结束！'
        })
      }
    },

    getAssessing() {
      getAssessingInfo('business').then((res) => {
        if (res.success) {
          this.assessingInfo = res.result
          this.lastAssessYear = this.assessingInfo.currentYear
          this.getStatisticsCounts()
          this.getNonAssess(this.assessingInfo.currentYear)
        }
      })
    },

    getNonAssess(year) {
      getBusinessNonAssessDepart(year).then((res) => {
        if (res.success) {
          this.nonAssessData = res.result
        }
      })
    },
    openExport() {
      this.$refs.exportBusinessResultModal.initData(this.lastAssessYear);
      this.$refs.exportBusinessResultModal.visible = true;
    },
    exportBusinessResultModalOk(year){
      let that=this;
      axios.get('/modules/assessBusinessGrade/hasBusnessGrade', { params:{currentYear:year} }).then((result) => {
        if (!result.data.success){
          that.$message.warning(result.data.message);
          return;
        }else {
          that.$refs.exportBusinessResultModal.visible = false;
          axios
            .get('/modules/assessBusinessGrade/exportExcel', { responseType: 'blob',params:{year:year} })
            .then((res) => {
              if (res && res.headers) {
                let contentDisposition = res.headers['content-disposition']
                let fileName = contentDisposition ? contentDisposition.split('filename=')[1] : '汇总.xlsx'
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
      })

    },
    open() {
      this.$refs.open.initData(this.lastAssessYear)
      this.$refs.open.visible = true
    },
    downExcel() {
      this.$refs.exportModal.initData()
      this.$refs.exportModal.visible = true
    },
    downdetails() {
      this.$refs.exportBusinessDetailsModal.initData(this.lastAssessYear)
      this.$refs.exportBusinessDetailsModal.visible = true
    },
    exportBusinessDetailsModalOk(year){
      if (year==undefined||year==''){
        this.$message.warning("请选择导出年度！")
        return;
      }
      this.$refs.exportBusinessDetailsModal.visible = false;
      axios
        .post('/modules/assessBusinessGrade/assessmentDetailExport', { year: year }, { responseType: 'blob' })
        .then((res) => {
          if (res && res.headers) {
            let contentDisposition = res.headers['content-disposition']
            let fileName = contentDisposition ? contentDisposition.split('filename=')[1] : '业务测评结果明细.xlsx'
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
    reCalBusnessRank(){
      let that=this;
      getAction(this.url.reCalBusnessRank).then(res => {
        if (res.success) {
          that.queryParam.departType = '1'
          that.queryParam.pageNo=1;
          that.queryParam.pageSize=100;
          that.activeKey = '1'
          that.loadData(1)
          this.getStatisticsCounts()
          that.$message.success("计算成功！")
        }
      })
    }
  },
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
