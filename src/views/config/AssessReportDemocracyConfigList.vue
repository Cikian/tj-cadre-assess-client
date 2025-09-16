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
    </div>

    <!-- table区域-begin -->
    <div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        class="j-table-force-nowrap"
        :scroll="{x:true}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">

        <template slot='enable' slot-scope='text, record, index'>
          <a-switch v-model='dataSource[index].enable' @change='handleEnableChange(dataSource[index].enable, index)'></a-switch>
        </template>

        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="imgSlot" slot-scope="text,record">
          <span v-if="!text" style="font-size: 16px;font-style: italic;">无图片</span>
          <img v-else :src="getImgView(text)" :preview="record.id" height="25px" alt="" style="max-width:80px;font-size: 16px;font-style: italic;"/>
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

    <assess-report-democracy-config-modal style="height:auto" ref="modalForm" @ok="modalFormOk"/>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import AssessReportDemocracyConfigModal from './modules/AssessReportDemocracyConfigModal'
  import '@/assets/less/TableExpand.less'
  import { putAction } from '@/api/manage'

  export default {
    name: "AssessReportDemocracyConfigList",
    mixins:[JeecgListMixin],
    components: {
      AssessReportDemocracyConfigModal
    },
    data () {
      return {
        description: '一报告两评议民主测评配置管理页面',
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
            title:'测评名称',
            align:"center",
            dataIndex: 'democracyName'
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
            align:"center",
            fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/modules/report/assessReportDemocracyConfig/list",
          delete: "/modules/report/assessReportDemocracyConfig/delete",
          deleteBatch: "/modules/report/assessReportDemocracyConfig/deleteBatch",
          exportXlsUrl: "/modules/report/assessReportDemocracyConfig/exportXls",
          importExcelUrl: "modules/report/assessReportDemocracyConfig/importExcel",

        },
        dictOptions:{},
        superFieldList:[],
      }
    },
    created() {
      this.getSuperFieldList();
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
         fieldList.push({type:'string',value:'democracyName',text:'测评名称',dictCode:''})
        this.superFieldList = fieldList
      },
      handleEnableChange(value, i) {
        // if (value === false){
        //   this.$confirm({
        //     title: '提示',
        //     content: '至少保留一项配置启用！',
        //   })
        // }
        if (value === true) {
          putAction(`/modules/report/assessReportDemocracyConfig/updateEnable?id=` +this.dataSource[i].id).then(res => {
            this.$message.success(res.message)
            this.loadData()
          })
        } else if (value === false) {
          this.$message.error('至少保留一项配置启用！')
        }
        this.dataSource[i].enable = true

      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>