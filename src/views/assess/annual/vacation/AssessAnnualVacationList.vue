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
              <j-select-user-by-dep placeholder="请选择姓名" v-model="queryParam.name" />
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="单位（处室）">
              <j-select-depart placeholder="请选择单位（处室）" v-model="queryParam.depart" />
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
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="downloadAccountabilityFile()">下载休假信息</a-button>
      <!--      <a-button type="primary" icon="download" @click="handleExportXls('年度考核休假情况')">导出</a-button>-->
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

      <span style='font-size: 18px; color: #fa5050'>当前年度全年工作日共：</span><span style='font-size: 18px; color: #fa2323;'>{{workDay}}</span><span style='font-size: 18px; color: #fa5050; margin-left: 10px'>天，</span>
      <span style='font-size: 18px; color: #fa5050'>全年休假超过{{workDay / 2}}个工作日，年度考核不可评优</span>
      <a style='margin-left: 22px; font-size: 20px' @click='workDayVisible = true' href="#">修改</a>
    </div>

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
        @change="handleTableChange"
      >
        <!--        <template slot='status' slot-scope='text, record'>-->
        <!--          <a-tag :color='record.status === 1 ? "orange" : record.status === 2 ? "red" : "green"' >{{ record.status_dictText }}</a-tag>-->
        <!--        </template>-->

        <template slot="date" slot-scope="text, record">
          <span>{{ record.startDate }} — {{ record.endDate }}</span>
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
        <template slot="status_dictText" slot-scope="text, record">
          <a-tag
            :color='record.status === 1 ? "red" : record.status === 2 ? "orange" : record.status === 3 ? "green" : "pink" '>
            {{ record.status === 1 ? ' ' : record.status === 2 ? '审核中' : record.status === 3 ? '已采用' : '未采用' }}
          </a-tag>
        </template>

        <span slot="action" slot-scope="text, record">
          <a v-has="'gbc:admin'" @click="handleEdit(record)">修改</a>
          <a-divider v-has="'gbc:admin'" type="vertical" />
          <a v-has="'gbc:admin'" @click="handleadopt(record)">采用</a>
          <a-divider v-has="'gbc:admin'" type="vertical" />
          <a v-has="'gbc:admin'" @click="handleNoUse(record)">不采用</a>
          <!-- <a-dropdown>
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
          </a-dropdown> -->
        </span>
      </a-table>
    </div>

    <t-modal
      ref="modalForm"
      title="下载休假情况"
      :width="500"
      :visible="downloadVisible"
      @ok="openExport"
      @cancel="closeDownload"
      :simple-submit="true"
      @close="closeDownload">

      <a-form-model :model="downloadForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-model-item label="年度">
          <t-dict-select-tag placeholder="请选择年度" v-model="downloadForm.currentYear" dictCode="assess_year" />
        </a-form-model-item>
        <a-form-model-item label="单位（处室）">
          <j-select-depart placeholder="请选择单位（处室）" v-model="downloadForm.depart" />
        </a-form-model-item>
      </a-form-model>

    </t-modal>

    <assess-annual-vacation-modal ref="modalForm" @ok="modalFormOk"></assess-annual-vacation-modal>

    <a-modal v-model="workDayVisible" title="修改当前年度工作日" @ok="workDayOk">
      <a-input-number v-model="workDay" :min="0" :max="366" />
    </a-modal>
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import AssessAnnualVacationModal from './modules/AssessAnnualVacationModal.vue'
import { axios } from '@/utils/assessReq'
import { getAction, postAction } from '@/api/manage'
import TDictSelectTag from '@/component/TDictSelectTag.vue'
import TModal from '@/component/TModal.vue'

export default {
  name: 'AssessAnnualVacationList',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    TModal,
    TDictSelectTag,
    AssessAnnualVacationModal
  },
  data() {
    return {
      description: '年度考核休假情况管理页面',
      workDayVisible: false,
      workDay: 0,
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
          title: '姓名',
          align: 'center',
          dataIndex: 'name'
        },
        {
          title: '单位（处室）',
          align: 'center',
          dataIndex: 'depart_dictText'
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
          title: '天数',
          align: 'center',
          dataIndex: 'days',
          scopedSlots: { customRender: 'days' }
        },
        // {
        //   title:'休假开始时间',
        //   align:"center",
        //   dataIndex: 'startDate',
        //   customRender:function (text) {
        //     return !text?"":(text.length>10?text.substr(0,10):text)
        //   }
        // },
        // {
        //   title:'休假结束时间',
        //   align:"center",
        //   dataIndex: 'endDate',
        //   customRender:function (text) {
        //     return !text?"":(text.length>10?text.substr(0,10):text)
        //   }
        // },
        {
          title: '备注',
          align: 'center',
          width: 300,
          dataIndex: 'remark'
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status_dictText',
          width: 100,
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
        list: '/modules/assessAnnualVacation/list',
        delete: '/modules/assessAnnualVacation/delete',
        deleteBatch: '/modules/assessAnnualVacation/deleteBatch',
        exportXlsUrl: '/modules/assessAnnualVacation/exportXls',
        importExcelUrl: 'modules/assessAnnualVacation/importExcel'
      },
      dictOptions: {},
      superFieldList: [],
      downloadVisible: false,
      downloadForm: {
        currentYear: '',
        depart: '0'
      }
    }
  },
  created() {
    this.getSuperFieldList()
    this.getCurrentWorkDays()
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    getCurrentWorkDays(){
      getAction("/modules/assessAnnualVacation/getWorkDays").then(res => {
        if(res.success){
          this.workDay = res.result
        } else {
          this.workDay = 0
        }
      })
    },
    downloadAccountabilityFile() {
      this.downloadVisible = true
    },
    closeDownload() {
      this.downloadVisible = false
      this.downloadForm = {
        currentYear: '',
        depart: '0'
      }
    },
    workDayOk(){
      postAction('/modules/assessAnnualVacation/updateWorkDays?days=' + this.workDay).then(res => {
        if (res.success){
          this.$message.success(res.message)
          this.workDayVisible = false
        } else {
          this.$message.error(res.message)
        }
      })
    },
    initDictConfig() {
    },
    getSuperFieldList() {
      let fieldList = []
      fieldList.push({ type: 'string', value: 'currentYear', text: '年度', dictCode: 'assess_year' })
      fieldList.push({ type: 'sel_user', value: 'name', text: '姓名' })
      fieldList.push({ type: 'sel_depart', value: 'depart', text: '单位（处室）' })
      fieldList.push({ type: 'int', value: 'duty', text: '职级', dictCode: 'position_rank' })
      fieldList.push({ type: 'int', value: 'type', text: '休假类型', dictCode: 'vacation_type' })
      fieldList.push({ type: 'date', value: 'startDate', text: '休假开始时间' })
      fieldList.push({ type: 'date', value: 'endDate', text: '休假结束时间' })
      fieldList.push({ type: 'string', value: 'remark', text: '备注', dictCode: '' })
      fieldList.push({ type: 'int', value: 'status', text: '申请状态', dictCode: 'apply_status' })
      this.superFieldList = fieldList
    },
    openExport() {
      axios
        .post('/modules/assessAnnualVacation/exportExcel?year=' + this.downloadForm.currentYear + '&depart=' + this.downloadForm.depart, {}, { responseType: 'blob' })
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
    handleadopt(res) {
      postAction('/modules/assessAnnualVacation/adopt', res).then((res) => {
        if (res) {
          // this.$message.success('修改成功！')
          this.loadData(1)
        } else {
          // this.$message.error('修改失败！')
          this.$error({
            title: '错误',
            content: '修改失败！'
          })
        }
      })
    },
    handleNoUse(res) {
      postAction('/modules/assessAnnualVacation/noAdopt', res).then((res) => {
        if (res) {
          // this.$message.success('修改成功！')
          this.loadData(1)
        } else {
          // this.$message.error('修改失败！')
          this.$error({
            title: '错误',
            content: '修改失败！'
          })
        }
      })
    },
    confirm(e) {
      this.$message.success('Click on Yes');
    },
    cancel(e) {
      this.$message.error('Click on No');
    },
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
