<template>
  <t-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    @ok="close"
    :simple-submit="true"
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-button @click="openExport" type="primary" icon="plus">下载报告</a-button>
    <a-table
      ref="table"
      size="middle"
      bordered
      rowKey="id"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
    >
      <span slot="action" slot-scope="text, record">
        <a :disabled="formDisable" v-has="'gbc:admin'" @click="returned(record)">重新推优</a>
      </span>
    </a-table>

    <div v-show="showNoDataMask" class="no-data-mask">
      <span>当前没有正在进行中的考核</span>
    </div>
  </t-modal>
</template>

<script>
import { putAction } from '@/api/manage'
import store from '@/store'
import TModal from '@/component/TModal.vue'
import { getAction } from '@/api/manage'
import { getAssessingInfo } from '@/api/assessApis'
import { axios } from '@/utils/assessReq'

export default {
  name: 'LeaderRecommendModal',
  components: {
    TModal,
  },
  props: {
    formDisable: {
      required: false,
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      title: '',
      showNoDataMask: false, // 控制遮罩层显示
      width: 1500,
      visible: false,
      disableSubmit: false,
      assessingInfo: {},
      dataSource: '',

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
          title: '局领导',
          align: 'center',
          width: 100,
          dataIndex: 'leader_dictText',
        },
        {
          title: '推优详情',
          align: 'center',
          children: [
            {
              title: '局机关领导干部',
              align: 'center',
              width: 300,
              dataIndex: 'bureau',
            },
            {
              title: '基层单位领导班子',
              align: 'center',
              width: 300,
              dataIndex: 'group_dictText',
            },
            {
              title: '分局+参公领导干部',
              align: 'center',
              width: 300,
              dataIndex: 'basic',
            },
            {
              title: '事业单位领导干部',
              align: 'center',
              width: 300,
              dataIndex: 'institution',
            },
          ],
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' },
        },
      ],
    }
  },
  mounted() {
    // 获取当前考核信息
    this.loadData()
  },
  methods: {
    loadData() {
      getAssessingInfo('annual').then((res) => {
        if (res.success) {
          this.assessingInfo = res.result

          if (res.assessing === false) {
            this.showNoDataMask = true // 显示无数据遮罩
          } else {
            // 获取推优
            getAction('/modules/assessAnnualSummary/getRecommendTemp').then((res) => {
              if (res.success) {
                this.dataSource = res.result.records
              }
            })
          }
        } else {
          // this.$message.error(res.message)
          // this.$confirm({
          //   title: '消息提示',
          //   content: (h) => <div style="color:red;">{res.message}</div>,
          //   onOk: () => {
          //   },
          //   onCancel: () => {
          //   },
          // })
          this.showNoDataMask = true // 显示无数据遮罩
        }
      })
    },
    returned(record) {
      this.$confirm({
        title: '确认退回',
        content: '确认退回吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          putAction('/modules/assessAnnualSummary/return?id=' + record.leader).then((res) => {
            if (res.success) {
              // this.$message.success('退回成功！')
              this.$success({
                title: '成功',
                content: '退回成功！',
              })
              this.loadData()
              this.$emit('refresh')
            } else {
              // this.$message.error(res.message)
              this.$error({
                title: '错误',
                content: res.message,
              })
            }
          })
        },
        onCancel: () => {
        },
      })
    },
    openExport() {
      axios
        .post('/modules/assessAnnualSummary/exportExl', {}, { responseType: 'blob' })
        .then((res) => {
          if (res && res.headers) {
            let contentDisposition = res.headers['content-disposition']
            let fileName = contentDisposition ? contentDisposition.split('filename=')[1] : '局领导推荐优秀情况汇总.xlsx'
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
    close() {
      this.$emit('close')
      this.visible = false
    },
    submitCallback() {
      this.$emit('ok')
      this.visible = false
    },
    handleCancel() {
      this.close()
    },
  },
}
</script>
<style scoped>
.no-data-mask {
  position: absolute;
  top: 10%;
  left: 0;
  width: 100%;
  height: 90%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  font-size: 26px;
  font-weight: 700;
}
</style>
