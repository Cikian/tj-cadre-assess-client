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
            <a-form-item label="单位（处室）">
              <j-select-depart placeholder="请选择单位（处室）" v-model="queryParam.depart" />
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="姓名">
              <j-dict-select-tag
                placeholder="请选择姓名"
                v-model="queryParam.personnel"
                dictCode="assess_annual_accountability,personnel,personnel"
              />
            </a-form-item>
          </a-col>
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
      <a-button type="primary" icon="download" @click="downloadAccountabilityFile()">下载受问责情况</a-button>
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
        <template slot="reason" slot-scope="text">
          <div style='font-size: 16px; line-height: 20px' v-html="text"></div>
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
      ref="downloadModal"
      title="下载受问责情况"
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

    <assess-annual-accountability-modal ref="modalForm" @ok="modalFormOk"></assess-annual-accountability-modal>
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import AssessAnnualAccountabilityModal from './modules/AssessAnnualAccountabilityModal.vue'
import { axios } from '@/utils/assessReq'
import { postAction } from '@/api/manage'
import TDictSelectTag from '@/component/TDictSelectTag.vue'
import TModal from '@/component/TModal.vue'

export default {
  name: 'AssessAnnualAccountabilityList',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    TModal,
    TDictSelectTag,
    AssessAnnualAccountabilityModal
  },
  data() {
    return {
      description: '年度考核受问责情况管理页面',
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
          title: '姓名',
          align: 'center',
          dataIndex: 'personnel'
        },
        {
          title: '年度',
          align: 'center',
          dataIndex: 'currentYear'
        },
        {
          title: '单位（处室）',
          align: 'center',
          dataIndex: 'depart_dictText'
        },
        {
          title: '问责类型',
          align: 'center',
          dataIndex: 'type',
          customRender: (text, record) => (text ? record['typeText'] : '')
        },
        {
          title: '文号',
          align: 'center',
          width: 110,
          dataIndex: 'referenceNo'
        },
        {
          title: '事由',
          align: 'center',
          width: 350,
          dataIndex: 'reason',
          scopedSlots: { customRender: 'reason' }
        },
        {
          title: '给予处理部门',
          align: 'center',
          width: 180,
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
        //   title: '影响期',
        //   align: 'center',
        //   dataIndex: 'endDate',
        //   customRender: function(text) {
        //     return !text ? '' : text.length > 10 ? text.substr(0, 10) : text
        //   }
        // },
        {
          title: '证明材料',
          align: 'center',
          dataIndex: 'proof',
          scopedSlots: { customRender: 'fileSlot' }
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status_dictText',
          scopedSlots: { customRender: 'status_dictText' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 180,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/modules/annual/assessAnnualAccountability/list',
        delete: '/modules/annual/assessAnnualAccountability/delete',
        deleteBatch: '/modules/annual/assessAnnualAccountability/deleteBatch',
        exportXlsUrl: '/modules/annual/assessAnnualAccountability/exportXls',
        importExcelUrl: 'modules/annual/assessAnnualAccountability/importExcel'
      },
      dictOptions: {},
      superFieldList: [],
      downloadForm: {
        currentYear: '',
        depart: '0'
      },
      downloadVisible: false
    }
  },
  created() {
    this.getSuperFieldList()
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
      fieldList.push({ type: 'sel_user', value: 'personnel', text: '姓名' })
      fieldList.push({ type: 'string', value: 'currentYear', text: '年度', dictCode: 'assess_year' })
      fieldList.push({ type: 'sel_depart', value: 'depart', text: '单位（处室）' })
      fieldList.push({ type: 'string', value: 'type', text: '问责类型' })
      fieldList.push({ type: 'string', value: 'typeText', text: '问责类型', dictCode: '' })
      fieldList.push({ type: 'string', value: 'referenceNo', text: '文号', dictCode: '' })
      fieldList.push({ type: 'string', value: 'reason', text: '事由', dictCode: '' })
      fieldList.push({ type: 'string', value: 'processingDepart', text: '给予处理部门', dictCode: '' })
      fieldList.push({ type: 'date', value: 'effectiveDate', text: '生效日期' })
      fieldList.push({ type: 'date', value: 'startDate', text: '影响期开始' })
      // fieldList.push({ type: 'date', value: 'endDate', text: '影响期结束' })
      fieldList.push({ type: 'string', value: 'proof', text: '证明材料', dictCode: '' })
      fieldList.push({ type: 'int', value: 'status', text: '状态', dictCode: 'apply_status' })
      this.superFieldList = fieldList
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

    openExport() {
      axios
        .post('/modules/annual/assessAnnualAccountability/exportExcel?year=' + this.downloadForm.currentYear + '&depart=' + this.downloadForm.depart, {}, { responseType: 'blob' })
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

            this.closeDownload()
          } else {
            console.error('Response headers are undefined')
          }
        })
        .catch((error) => {
          console.error('Error downloading file:', error)
        })
    },
    handleadopt(res) {
      postAction('/modules/annual/assessAnnualAccountability/adopt', res).then((res) => {
        if (res) {
          // this.$message.success('修改成功！')
          this.loadData(1)
        } else {
          // this.$message.error('修改失败！')
          this.$error({
            title: '操作失败',
            content: '修改失败！'
          })
        }
      })
    },
    handleNoUse(res) {
      postAction('/modules/annual/assessAnnualAccountability/noAdopt', res).then((res) => {
        if (res) {
          // this.$message.success('修改成功！')
          this.loadData(1)
        } else {
          // this.$message.error('修改失败！')
          this.$error({
            title: '操作失败',
            content: '修改失败！'
          })
        }
      })
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
