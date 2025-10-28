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
  name: 'ExportPeopleModal',
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
      console.log("点击后第二")
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
        .post(`/common/downloadAnnualFile?year=${this.form.currentYear}`, null, { responseType: 'blob' })
        .then((res) => {
          if (res && res.headers) {
            let contentDisposition = res.headers['content-disposition']
            let fileName = contentDisposition ? contentDisposition.split('filename=')[1] : this.form.currentYear + '年度考核人员名单.zip'
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
