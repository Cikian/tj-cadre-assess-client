<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="年度">
              <t-dict-select-tag @change="searchQuery" placeholder="请选择年度" v-model="queryParam.year" dictCode="assess_year" />
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
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
        :pagination="false"
        :loading="loading"
      >
        <!--        <template slot='status' slot-scope='text, record'>-->
        <!--          <a-tag :color='record.status === 1 ? "orange" : record.status === 2 ? "red" : "green"' >{{ record.status_dictText }}</a-tag>-->
        <!--        </template>-->

        <template slot='level' slot-scope='text, record'>
          <a-tag
            :color="record.level === '1' ? '#f50' : record.level === '2' ? '#87d068' : record.level === '3' ? '#2db7f5' : record.level === '4' ? '#ff0000' : '#545454'">
                <span
                  v-if='record.identityType === "公务员" || record.identityType === "参公"'>{{ record.level === '1' ? '优秀' : record.level === '2' ? '称职' : record.level === '3' ? '基本称职' : record.level === '4' ? '不称职' : record.level === '5' ? '不确定等次' : '-'
                  }}</span>
            <span
              v-else>{{ record.level === '1' ? '优秀' : record.level === '2' ? '合格' : record.level === '3' ? '基本合格' : record.level === '4' ? '不合格' : record.level === '5' ? '不确定等次' : '-'
              }}</span>
          </a-tag>
        </template>

      </a-table>
    </div>

  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import TDictSelectTag from '@/component/TDictSelectTag.vue'
import TModal from '@/component/TModal.vue'
import { getAction } from '@/api/manage'

export default {
  name: 'AssessAnnualVacationList',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    TModal,
    TDictSelectTag,
  },
  data() {
    return {
      description: '年度考核结果',
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
          title: '姓名',
          align: 'center',
          dataIndex: 'name'
        },
        {
          title: '单位（处室）',
          align: 'center',
          dataIndex: 'depart'
        },
        {
          title: '年度',
          align: 'center',
          dataIndex: 'year'
        },
        {
          title: '等次',
          align: 'center',
          dataIndex: 'level',
          scopedSlots: { customRender: 'level' }
        },
      ],
      url: {
        list: '/modules/assessAnnualSummary/departRes',
      },
      dictOptions: {},
      superFieldList: [],
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
    loadData(arg) {
      if (!this.url.list) {
        this.$message.error('请设置url.list属性!')
        return
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      var params = this.getQueryParams()//查询条件
      this.loading = true
      getAction(this.url.list, params).then((res) => {
        if (res.success) {
          //update-begin---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
          this.dataSource = res.result.records || res.result
          console.log("this.dataSource")
          console.log(this.dataSource)
          if (res.result.total) {
            this.ipagination.total = res.result.total
          } else {
            this.ipagination.total = 0
          }
          //update-end---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
        } else {
          this.$confirm({
            title: '提示',
            content: res.message,
            onOk: () => {
            }
          })
        }
      }).finally(() => {
        this.loading = false
      })
    },
    initDictConfig() {
    },
    getSuperFieldList() {
      let fieldList = []
      fieldList.push({ type: 'string', value: 'name', text: '姓名' })
      fieldList.push({ type: 'string', value: 'depart', text: '单位（处室）' })
      fieldList.push({ type: 'string', value: 'year', text: '年度' })
      fieldList.push({ type: 'string', value: 'level', text: '等次' })
      this.superFieldList = fieldList
    },
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
