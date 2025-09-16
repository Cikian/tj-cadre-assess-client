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
      <a-button type="primary" icon="download" @click="handleExportXls('年度考核优秀比例设置')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <!-- 高级查询区域 -->
      <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
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
        class="j-table-force-nowrap"
        @change="handleTableChange">

        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="groupRatio" slot-scope="text">
          {{text}}%
        </template>
        <template slot="bureauRatio" slot-scope="text">
          {{text}}%
        </template>
        <template slot="basicRatio" slot-scope="text">
          {{text}}%
        </template>
        <template slot="institutionRatio" slot-scope="text">
          {{text}}%
        </template>
        <!-- bureauRatio    basicRatio   institutionRatio-->
        <template slot='enable' slot-scope='text, record, index'>
          <a-switch v-model='dataSource[index].enable' @change='handleEnableChange(dataSource[index].enable, index)'></a-switch>
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

    <assess-annual-excellent-ratio-modal ref="modalForm" @ok="modalFormOk"></assess-annual-excellent-ratio-modal>
  </a-card>
</template>

<script>

import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import AssessAnnualExcellentRatioModal from './modules/AssessAnnualExcellentRatioModal'
import { putAction } from '@/api/manage'

export default {
    name: 'AssessAnnualExcellentRatioList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      AssessAnnualExcellentRatioModal
    },
    data () {
      return {
        description: '年度考核优秀比例设置管理页面',
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
            title:'领导班子优秀比例',
            align:"center",
            dataIndex: 'groupRatio',
            scopedSlots: { customRender: 'groupRatio' },
          },
          {
            title:'局机关优秀比例',
            align:"center",
            dataIndex: 'bureauRatio',
            scopedSlots: { customRender: 'bureauRatio' },
          },
          {
            title:'分局、参公优秀比例',
            align:"center",
            dataIndex: 'basicRatio',
            scopedSlots: { customRender: 'basicRatio' },
          },
          {
            title:'事业单位优秀比例',
            align:"center",
            dataIndex: 'institutionRatio',
            scopedSlots: { customRender: 'institutionRatio' },
          },
          {
            title:'启用',
            align:"center",
            dataIndex: 'enable',
            scopedSlots: { customRender: 'enable' },

            // customRender: (text) => (text ? filterMultiDictText(this.dictOptions['enable'], text) : ''),
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: "/modules/annual/assessAnnualExcellentRatio/list",
          delete: "/modules/annual/assessAnnualExcellentRatio/delete",
          deleteBatch: "/modules/annual/assessAnnualExcellentRatio/deleteBatch",
          exportXlsUrl: "/modules/annual/assessAnnualExcellentRatio/exportXls",
          importExcelUrl: "modules/annual/assessAnnualExcellentRatio/importExcel",

        },
        dictOptions:{},
        superFieldList:[],
      }
    },
    created() {
      this.$set(this.dictOptions, 'enable', [{text:'是',value:'1'},{text:'否',value:'0'}])
    this.getSuperFieldList();
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
    },
    methods: {
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'BigDecimal',value:'groupRatio',text:'领导班子优秀比例',dictCode:''})
        fieldList.push({type:'BigDecimal',value:'bureauRatio',text:'局机关优秀比例',dictCode:''})
        fieldList.push({type:'BigDecimal',value:'basicRatio',text:'分局、参公优秀比例 ',dictCode:''})
        fieldList.push({type:'BigDecimal',value:'institutionRatio',text:'事业单位优秀比例',dictCode:''})
        fieldList.push({type:'switch',value:'enable',text:'启用'})
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
        putAction(`/modules/annual/assessAnnualExcellentRatio/updateEnable?id=` +this.dataSource[i].id).then(res => {
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