<template>
  <t-modal
    :title="'考核人员调整'"
    :visible="visible"
    fullscreen
    :simple-submit="true"
    @ok="visible = false"
    @cancel="visible = false"
    cancelText="关闭"
  >
    <a-card :bordered="false">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
          <a-row :gutter="24">
            <a-col :xl="4" :lg="7" :md="8" :sm="24">
              <a-form-item label="姓名">
                <j-input placeholder="请输入姓名" v-model="queryParam.name" @change="searchQuery"></j-input>
              </a-form-item>
            </a-col>
            <a-col :xl="4" :lg="7" :md="8" :sm="24">
              <a-form-item label="性别">
                <j-dict-select-tag placeholder="请选择性别" v-model="queryParam.sex" dictCode="sex"
                                   @change="searchQuery" />
              </a-form-item>
            </a-col>
            <a-col :xl="4" :lg="7" :md="8" :sm="24">
              <a-form-item label="是否局领导考核">
                <j-dict-select-tag placeholder="请选择是否局领导考核" v-model="queryParam.isLeader" dictCode="yn"
                                   @change="searchQuery" />
              </a-form-item>
            </a-col>
            <a-col :xl="4" :lg="7" :md="8" :sm="24">
              <a-form-item label="所在处室">
                <j-select-depart placeholder="请选择所在处室" v-model="queryParam.departmentCode"
                                 @change="searchQuery" />
              </a-form-item>
            </a-col>
            <a-col :xl="4" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 查询区域-END -->

      <!-- 操作按钮区域 -->
      <div class="table-operator">
        <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
        <!-- 高级查询区域 -->
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

          <template slot="htmlSlot" slot-scope="text">
            <div v-html="text"></div>
          </template>
          <template slot="imgSlot" slot-scope="text,record">
            <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
            <img v-else :src="getImgView(text)" :preview="record.id" height="25px" alt=""
                 style="max-width:80px;font-size: 12px;font-style: italic;" />
          </template>
          <template slot="fileSlot" slot-scope="text">
            <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
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

          <span slot="name" slot-scope="text, record">
            {{ record.delFlag == 1 ? (text + '（不参与本次考核）') : text }}
          </span>

          <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
            <a-popconfirm v-if="record.delFlag == 0" title="确定该人员不再参与本次考核吗?"
                          @confirm="() => handleRemove(record.id)">
                  <a>取消考核</a>
                </a-popconfirm>

            <a-popconfirm v-else title="确定该人员继续参与本次考核吗?" @confirm="() => handleGoon(record.id)">
                  <a>继续考核</a>
                </a-popconfirm>
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handleDetail(record)">详情</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm
                  title="点击确定后将彻底删除该人员本年度平时考核数据，确定删除吗？如果不参与本次考核，请点击左侧“取消考核”按钮！"
                  @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

        </a-table>
      </div>

      <assess-regular-report-item-modal ref="modalForm" @ok="modalFormOk"></assess-regular-report-item-modal>

    </a-card>
  </t-modal>
</template>

<script>

import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import AssessRegularReportItemModal from './AssessRegularReportItemModal'
import { filterMultiDictText } from '@/components/dict/JDictSelectUtil'
import TModal from '@/component/TModal.vue'
import { deleteAction, putAction } from '@/api/manage'

export default {
  name: 'AssessRegularReportItemList',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    TModal,
    AssessRegularReportItemModal
  },
  data() {
    return {
      visible: false,
      description: '平时考核填报明细表管理页面',
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
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '性别',
          align: 'center',
          dataIndex: 'sex_dictText'
        },
        {
          title: '职务职级',
          align: 'center',
          dataIndex: 'post'
        },
        {
          title: '所在处室',
          align: 'center',
          dataIndex: 'departmentCode_dictText'
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
        list: '/regular/item/list',
        delete: '/regular/item/delete',
        remove: '/regular/item/remove',
        goon: '/regular/item/goon',
        deleteBatch: '/regular/item/deleteBatch',
        exportXlsUrl: '/regular/item/exportXls',
        importExcelUrl: 'regular/item/importExcel'

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
    handleEdit: function(record) {
      this.$refs.modalForm.edit(record)
      this.$refs.modalForm.title = '编辑'
      this.$refs.modalForm.disableSubmit = false
    },
    initDictConfig() {
    },
    getSuperFieldList() {
      let fieldList = []
      fieldList.push({ type: 'string', value: 'name', text: '姓名', dictCode: '' })
      fieldList.push({ type: 'int', value: 'sex', text: '性别', dictCode: 'sex' })
      fieldList.push({ type: 'string', value: 'post', text: '职务职级', dictCode: '' })
      fieldList.push({ type: 'string', value: 'isLeader', text: '是否处级领导', dictCode: 'yn' })
      fieldList.push({ type: 'sel_depart', value: 'departmentCode', text: '所在处室' })
      this.superFieldList = fieldList
    },
    handleRemove(id) {
      deleteAction(this.url.remove, { id: id }).then((res) => {
        if (res.success) {
          //重新计算分页问题
          this.reCalculatePage(1)
          this.$message.success(res.message)
          this.loadData()
          this.$emit('ok')
        } else {
          this.$message.warning(res.message)
        }
      })
    },

    handleGoon(id) {
      putAction(this.url.goon + `?id=${id}`).then((res) => {
        if (res.success) {
          //重新计算分页问题
          this.reCalculatePage(1)
          this.$message.success(res.message)
          this.loadData()
          this.$emit('ok')
        } else {
          this.$message.warning(res.message)
        }
      })
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
