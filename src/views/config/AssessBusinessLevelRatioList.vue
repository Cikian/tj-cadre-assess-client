<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('业务工作测评等次默认比例')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
                @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <!-- 高级查询区域 -->
      <j-super-query :fieldList="superFieldList" ref="superQueryModal"
                     @handleSuperQuery="handleSuperQuery"></j-super-query>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete" />
            删除
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a
        style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        :scroll="{x:true}"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        class="j-table-force-nowrap"
        @change="handleTableChange"
      >

        <template slot="excellent" slot-scope="text, record">
          {{ text }}%
        </template>
        <template slot="fine" slot-scope="text, record">
          {{ text }}%
        </template>
        <template slot="common" slot-scope="text, record">
          {{ text }}%
        </template>
        <template slot="enable" slot-scope="text, record, index">
          <a-switch v-model="dataSource[index].enable" @change="changeEnable(record, index)" />
        </template>
        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="imgSlot" slot-scope="text,record">
          <span v-if="!text" style="font-size: 16px;font-style: italic;">无图片</span>
          <img v-else :src="getImgView(text)" :preview="record.id" height="25px" alt=""
               style="max-width:80px;font-size: 16px;font-style: italic;" />
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 16px;font-style: italic;">无文件</span>
          <a-button
            v-else
            :ghost="true"
            type="primary"
            icon="download"
            size="small"
            @click="downloadFile(text)">
            下载
          </a-button>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="handleDetail(record)">详情</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </span>

      </a-table>
    </div>

    <assess-business-level-ratio-modal ref="modalForm" @ok="modalFormOk"></assess-business-level-ratio-modal>
  </a-card>
</template>

<script>

import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import AssessBusinessLevelRatioModal from './modules/AssessBusinessLevelRatioModal'
import { postAction } from '@/api/manage'

export default {
  name: 'AssessBusinessLevelRatioList',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    AssessBusinessLevelRatioModal
  },
  data() {
    return {
      description: '业务工作测评等次默认比例管理页面',
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
          title: '优秀比例',
          align: 'center',
          dataIndex: 'excellent',
          scopedSlots: { customRender: 'excellent' }
        },
        {
          title: '良好比例',
          align: 'center',
          dataIndex: 'fine',
          scopedSlots: { customRender: 'fine' }
        },
        {
          title: '一般比例',
          align: 'center',
          dataIndex: 'common',
          scopedSlots: { customRender: 'common' }
        },
        {
          title: '启用',
          align: 'center',
          dataIndex: 'enable',
          scopedSlots: { customRender: 'enable' }
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
      url: {
        list: '/modules/business/assessBusinessLevelRatio/list',
        delete: '/modules/business/assessBusinessLevelRatio/delete',
        deleteBatch: '/modules/business/assessBusinessLevelRatio/deleteBatch',
        exportXlsUrl: '/modules/business/assessBusinessLevelRatio/exportXls',
        importExcelUrl: 'modules/business/assessBusinessLevelRatio/importExcel'

      },
      dictOptions: {},
      superFieldList: []
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
      fieldList.push({ type: 'BigDecimal', value: 'excellent', text: '优秀比例', dictCode: '' })
      fieldList.push({ type: 'BigDecimal', value: 'fine', text: '良好比例', dictCode: '' })
      fieldList.push({ type: 'BigDecimal', value: 'common', text: '一般比例', dictCode: '' })
      fieldList.push({ type: 'int', value: 'enable', text: '启用', dictCode: '' })
      this.superFieldList = fieldList
    },
    changeEnable(record, index) {
      let that = this
      if (!record.enable) {
        that.dataSource[index].enable = true
        that.$message.warning('至少保留一个启用状态！')
        return
      }
      that.$confirm({
        title: '提示',
        content: '确定要修改启用此配置吗？',
        onOk() {
          postAction('/modules/business/assessBusinessLevelRatio/changeEnable?cid=' + record.id).then(res => {
            if (res.success) {
              that.$message.success(res.message)
              that.loadData()
            } else {
              that.dataSource[index].enable = !record.enable
              that.$message.error(res.message)
            }
          })
        },
        onCancel() {
          that.dataSource[index].enable = !record.enable
        }
      })
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>