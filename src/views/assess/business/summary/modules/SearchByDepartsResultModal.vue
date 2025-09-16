<template>
  <t-modal
    title="按单位查询"
    :width="width"
    :visible="visible"
    :simple-submit="true"
    @ok="handleOk"
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="loading">
      <a-button type="primary" icon="download" @click="downdetails" style="margin-bottom: 12px">导出成绩</a-button>
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
          <j-ellipsis :value="text" :length="10" />
        </template>

        <template slot="subtractReason" slot-scope="text, record">
          <j-ellipsis :value="text" :length="10" />
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
      </a-table>
    </a-spin>
  </t-modal>
</template>

<script>
import GradeModel from '@/component/GradeModel.vue'
import TModal from '@/component/TModal.vue'
import { axios } from '@/utils/assessReq'
import { getAction, getFileAccessHttpUrl } from '@/api/manage'

export default {
  name: 'SearchByDepartsResultModal',
  components: {
    TModal,
    GradeModel,
  },
  data() {
    return {
      dataSource:[],
      loading: false,
      width: 1200,
      visible: false,
      downModalVisible: false,
      disableSubmit: false,
      columns: [
        // {
        //   title: '#',
        //   dataIndex: '',
        //   key:'rowIndex',
        //   width:60,
        //   align:"center",
        //   customRender:function (t,r,index) {
        //     return parseInt(index)+1;
        //   }
        // },
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
          width: 300,
        },
        {
          title: '排名',
          align: 'center',
          dataIndex: 'ranking',
        },
        {
          title: '分数',
          align: 'center',
          dataIndex: 'score',
        },
        // {
        //   title:'测评得分',
        //   align:"center",
        //   dataIndex: 'assessScore'
        // },
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
          width: 200,
          scopedSlots: { customRender: 'addReason' },
        },
        {
          title: '减分原因',
          align: 'center',
          dataIndex: 'subtractReason',
          width: 200,
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
        // {
        //   title: '操作',
        //   dataIndex: 'action',
        //   align: 'center',
        //   fixed: 'right',
        //   width: 147,
        //   scopedSlots: { customRender: 'action' },
        // },
      ],
      /* 分页参数 */
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      url: {
        searchByDeparts: '/modules/assessBusinessGrade/searchByDeparts',
      },
      queryParam:{

      }
    }
  },
  methods: {
    handleTableChange(pagination, filters, sorter) {
      //分页、排序、筛选变化时触发
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field
        this.isorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
      }
      this.ipagination = pagination
      this.loadData()
    },
    add() {
      this.visible = true
      this.loading = true
      this.$nextTick(() => {})
    },
    /* 图片预览 */
    getImgView(text) {
      if (text && text.indexOf(',') > 0) {
        text = text.substring(0, text.indexOf(','))
      }
      return getFileAccessHttpUrl(text)
    },
    /* 文件下载 */
    // update--autor:lvdandan-----date:20200630------for：修改下载文件方法名uploadFile改为downloadFile------
    downloadFile(text) {
      if (!text) {
        // this.$message.warning('未知的文件')
        this.$warning({
          title: '警告',
          content: '未知的文件'
        })
        return
      }
      if (text.indexOf(',') > 0) {
        text = text.substring(0, text.indexOf(','))
      }
      let url = getFileAccessHttpUrl(text)
      window.open(url)
    },
    async initData(queryParams) {
      this.visible = true
      this.$nextTick(async () => {
        // 此处的 yearDict 似乎不再需要，可以根据需要移除
        this.loading = false
        this.queryParam = queryParams
        this.loadData()
      })
    },
    loadData(){
      getAction(this.url.searchByDeparts,this.queryParam).then(res=>{
        if(res.success){
          this.loading = false
          this.dataSource = res.result.records
        }
      })
    },
    close() {

      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      // this.visible = false
      // this.$emit('ok')
    },

    downdetails() {
      axios
        .get("/modules/assessBusinessGrade/exportExcelByParam"+"?currentYear="+this.queryParam.currentYear+"&&departIds="+this.queryParam.departId,{ responseType: 'blob' })
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
    },

    handleCancel() {
      this.close()
    },
  },
}
</script>
