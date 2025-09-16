<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="领导">
              <j-select-user-by-dep placeholder="请选择领导" v-model="queryParam.leaderId" store='id' text='realname' />
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <!--              <a @click="handleToggleSearch" style="margin-left: 8px">-->
              <!--                {{ toggleSearchStatus ? '收起' : '展开' }}-->
              <!--                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>-->
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
      <!--      <a-button type="primary" icon="download" @click="handleExportXls('领导分管处室（单位）配置')">导出</a-button>-->
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
      <div v-if="undistributed!=='' || repeated!==''" class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <span v-if="undistributed!==''"><span style="color: #ff4d4d; font-weight: bold">当前未被分管处室（单位）：</span><span style="font-weight: bold">{{ undistributed }}</span><br></span>
        <span v-if="repeated!==''"><span style="color: #ff4d4d; font-weight: bold">被重复分管的处室（单位）：</span><span style="font-weight: bold">{{ repeated }}</span></span>
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
        @change="handleTableChange">

        <template slot="depart" slot-scope="text">
          <j-ellipsis :value="text" :length="60" />
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
    </div>

    <assess-leader-depart-config-modal ref="modalForm" @ok="modalFormOk"></assess-leader-depart-config-modal>
  </a-card>
</template>

<script>

import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import AssessLeaderDepartConfigModal from './modules/AssessLeaderDepartConfigModal'
import { getAction } from '@/api/manage'

export default {
  name: 'AssessLeaderDepartConfigList',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    AssessLeaderDepartConfigModal
  },
  data() {
    return {
      description: '领导分管处室（单位）配置管理页面',
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
          title: '领导',
          width: 200,
          align: 'center',
          dataIndex: 'leaderId_dictText'
        },
        {
          title: '分管处室（单位）',
          width: 200,
          align: 'center',
          dataIndex: 'departId_dictText',
          scopedSlots: { customRender: 'depart' }
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
        list: '/modules/assessLeaderDepartConfig/list',
        delete: '/modules/assessLeaderDepartConfig/delete',
        deleteBatch: '/modules/assessLeaderDepartConfig/deleteBatch',
        exportXlsUrl: '/modules/assessLeaderDepartConfig/exportXls',
        importExcelUrl: 'modules/assessLeaderDepartConfig/importExcel'

      },
      dictOptions: {},
      superFieldList: [],
      undistributed: '',
      repeated: '',
    }
  },
  created() {
    this.getSuperFieldList()
    this.getUndistributed()
    this.getRepeated()
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
      fieldList.push({ type: 'sel_user', value: 'leaderId', text: '领导' })
      fieldList.push({ type: 'sel_depart', value: 'departId', text: '分管处室（单位）' })
      this.superFieldList = fieldList
    },
    getUndistributed() {
      getAction('/modules/assessLeaderDepartConfig/undistributed').then((res) => {
        if (res.success) {
          this.undistributed = res.result
        }
      })
    },

    getRepeated() {
      getAction('/modules/assessLeaderDepartConfig/repeated').then((res) => {
        if (res.success) {
          this.repeated = res.result
        }
      })
    },

    modalFormOk() {
      // 新增/修改 成功时，重载列表
      this.loadData()
      //清空列表选中
      this.onClearSelected()
      this.getUndistributed()
      this.getRepeated()
    },
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>