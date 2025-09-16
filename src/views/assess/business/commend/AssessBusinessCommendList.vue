<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="年度">
              <t-dict-select-tag
                @change='searchQuery'
                placeholder="请选择年度"
                v-model="queryParam.currentYear"
                dictCode="assess_year"
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
      <a-button type="primary" icon="download" v-has="'gbc:admin'" @click="handleExportXls()">导出表彰信息</a-button>
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
        <span slot="status_dictText" slot-scope="value, record">
          <a-tag color="#7ac23c" v-if="record.status == 3">已采用</a-tag>
<!--          <a-tag color="#1890FF" v-else-if="record.status == 1">审核中</a-tag>-->
          <a-tag color="#c1ad15" v-else-if="record.status == 2">审核中</a-tag>
          <a-tag color="#cc0000" v-else-if="record.status == 4">未采用</a-tag>
          <a-tag color="#1890FF" v-else>审核中</a-tag>
        </span>

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
          <a-divider v-has='"gbc:admin"' type="vertical" />
          <a v-has='"gbc:admin"' @click='check(record.id, 4)'>不采用</a>
          <a-divider v-has='"gbc:admin"' type="vertical" />
          <a v-has='"gbc:admin"' @click='check(record.id, 3)'>采用</a>
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

    <assess-business-commend-modal ref="modalForm" @ok="modalFormOk"></assess-business-commend-modal>
    <assess-business-export-modal ref="open" @ok="exportModalOk" @over="downloadOver"></assess-business-export-modal>
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import AssessBusinessCommendModal from './modules/AssessBusinessCommendModal.vue'
import AssessBusinessExportModal from './modules/AssessBusinessExportModal.vue'
import { getAction } from '@/api/manage'
import TDictSelectTag from '@/component/TDictSelectTag.vue'

export default {
  name: 'AssessBusinessCommendList',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    TDictSelectTag,
    AssessBusinessCommendModal,
    AssessBusinessExportModal,
  },
  data() {
    return {
      description: '表彰管理页面',
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
          title: '年度',
          align: 'center',
          width: 80,
          dataIndex: 'currentYear_dictText',
        },
        {
          title: '处室（单位）',
          align: 'center',
          width: 200,
          dataIndex: 'departmentCode_dictText',
        },
        {
          title: '表彰单位',
          align: 'center',
          width: 300,
          dataIndex: 'commendUnit',
        },
        {
          title: '表彰项目',
          align: 'center',
          width: 500,
          dataIndex: 'commendProject',
        },
        {
          title: '表彰时间',
          align: 'center',
          width: 180,
          dataIndex: 'commendTime',
          customRender: function (text) {
            return !text ? '' : text.length > 10 ? text.substr(0, 10) : text
          },
        },
        // {
        //   title:'填报人',
        //   align:"center",
        //   dataIndex: 'reportBy_dictText'
        // },
        {
          title: '证明材料',
          align: 'center',
          dataIndex: 'proof',
          scopedSlots: { customRender: 'fileSlot' },
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status_dictText',
          scopedSlots: { customRender: 'status_dictText' },
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        list: '/modules/assessBusinessCommend/list',
        delete: '/modules/assessBusinessCommend/delete',
        deleteBatch: '/modules/assessBusinessCommend/deleteBatch',
        exportXlsUrl: '/modules/assessBusinessCommend/exportXls',
        importExcelUrl: 'modules/assessBusinessCommend/importExcel',
      },
      dictOptions: {},
      superFieldList: [],
    }
  },
  created() {
    this.getSuperFieldList()
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
  },
  methods: {
    initDictConfig() {},
    getSuperFieldList() {
      let fieldList = []
      fieldList.push({ type: 'string', value: 'currentYear', text: '年度', dictCode: 'year_code,year_value,year_key' })
      fieldList.push({ type: 'sel_depart', value: 'departmentCode', text: '处室（单位）' })
      fieldList.push({ type: 'string', value: 'commendUnit', text: '表彰单位', dictCode: 'sys_depart,depart_name,id' })
      fieldList.push({ type: 'string', value: 'commendProject', text: '表彰项目', dictCode: '' })
      fieldList.push({ type: 'date', value: 'commendTime', text: '表彰时间' })
      fieldList.push({ type: 'sel_user', value: 'reportBy', text: '填报人' })
      fieldList.push({ type: 'string', value: 'proof', text: '证明材料', dictCode: '' })
      this.superFieldList = fieldList
    },
    check(id, status) {
      let obj = {}
      obj.id = id
      obj.status = status
      getAction('/modules/assessBusinessCommend/check', obj).then((res) => {
        if (res.success) {
          // this.$message.success('更新成功!')
          this.loadData()
        } else {
          this.$error({ title: '更新失败', content: res.message })
        }
      })
    },
    handleExportXls() {
      this.$refs.open.initData()
      this.$refs.open.visible = true
    },
  },
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
