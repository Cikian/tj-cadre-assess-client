<template>
  <t-modal
    title="导出历史考核人员信息"
    :width="width"
    :visible="visible"
    :simple-submit="true"
    @ok="handleOk"
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="loading">
      <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="年度">
          <a-select v-model="form.currentYear" placeholder="请选择年度">
            <a-select-option v-for="(item, i) in yearDict" :key="item.value" :value="item.value">
              {{ item.text }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="季度">
          <a-select v-model="form.quarter" placeholder="请选择季度">
            <a-select-option key="1" value="1">
              1
            </a-select-option>
            <a-select-option key="2" value="2">
              2
            </a-select-option>
            <a-select-option key="3" value="3">
              3
            </a-select-option>
            <a-select-option key="4" value="4">
              4
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </t-modal>
</template>

<script>
import GradeModel from '@/component/GradeModel.vue'
import TModal from '@/component/TModal.vue'
import { getDictItemByCode } from '@/utils/commonUtils'
import { axios } from '@/utils/assessReq'

export default {
  name: 'ExportModal',
  components: {
    TModal,
    GradeModel,
  },
  data() {
    return {
      width: 600,
      visible: false,
      downModalVisible: false,
      disableSubmit: false,

      loading: false,

      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      form: {
        currentYear: '',
        quarter: '',
      },

      yearDict: [],
      departTypeDict: [],
    }
  },
  methods: {
    add() {
      this.visible = true
      this.loading = true
      this.$nextTick(() => {})
    },
    async initData() {
      this.visible = true
      this.$nextTick(async () => {
        try {
          const [yearDict] = await Promise.all([getDictItemByCode('assess_year')])
          this.yearDict = yearDict
          this.form.currentYear = yearDict[0].value
        } catch (error) {
          console.error('Error fetching dictionary items:', error)
        } finally {
          this.loading = false
        }
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      this.visible = false
      this.$emit('ok')
      axios
        .post(`/common/downloadReportFile?year=${this.form.currentYear}&quarter=${this.form.quarter}`, null, { responseType: 'blob' })
        .then((res) => {
          if (res && res.headers) {
            let contentDisposition = res.headers['content-disposition']
            let fileName = contentDisposition ? contentDisposition.split('filename=')[1] : 'file.zip'
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
