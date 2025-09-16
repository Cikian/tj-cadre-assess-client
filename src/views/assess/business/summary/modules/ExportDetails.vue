<template>
  <t-modal
    title="导出类型"
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
        <a-form-model-item label="选择类型">
          <a-select v-model="form.type" placeholder="选择导出类型" style="width: 400px">
            <a-select-option value="机关">机关</a-select-option>
            <a-select-option value="基层">基层</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </t-modal>
</template>

<script>
import GradeModel from '@/component/GradeModel.vue'
import TModal from '@/component/TModal.vue'
import { axios } from '@/utils/assessReq'

export default {
  name: 'ExportDetails',
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
      wrapperCol: { span: 14 },
      form: {
        type: '', // 修改为选择类型
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
        // 此处的 yearDict 似乎不再需要，可以根据需要移除
        this.loading = false
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      this.visible = false
      this.$emit('ok')

      // 调用 downdetails 方法，传递选择的类型
      this.downdetails(this.form.type)
    },

    downdetails(type) {
      axios
        .post('/modules/assessBusinessGrade/assessmentDetailExport', { type: type }, { responseType: 'blob' })
        .then((res) => {
          if (res && res.headers) {
            let contentDisposition = res.headers['content-disposition']
            let fileName = contentDisposition ? contentDisposition.split('filename=')[1] : '考核明细.xls'
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
