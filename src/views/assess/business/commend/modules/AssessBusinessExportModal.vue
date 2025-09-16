<template>
  <t-modal
    title="表彰汇总导出"
    :width="width"
    :visible="visible"
    :simple-submit="true"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="loading">
      <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="年度">
          <j-dict-select-tag
            placeholder="请选择年度"
            v-model="form.currentYear"
            dictCode="assess_year"
          />
        </a-form-model-item>
<!--        <a-form-model-item label="导出类型">-->
<!--          <a-select v-model="form.exportType" placeholder="请选择导出类型">-->
<!--            <a-select-option value="1"> 全部 </a-select-option>-->
<!--            <a-select-option value="2"> 处室（单位） </a-select-option>-->
<!--          </a-select>-->
<!--        </a-form-model-item>-->

<!--        <a-form-model-item label="按单位选择" v-if="form.exportType === '2'">-->
<!--          <j-select-depart v-model="form.departmentIds" :multi="true" />-->
<!--        </a-form-model-item>-->
      </a-form-model>
    </a-spin>
  </t-modal>
</template>

<script>
import GradeModel from '@/component/GradeModel.vue'
import TModal from '@/component/TModal.vue'
import { axios } from '@/utils/assessReq'

export default {
  name: 'AssessBusinessExportModal',
  components: {
    TModal,
    GradeModel,
  },
  data() {
    return {
      width: 600,
      visible: false,
      disableSubmit: false,
      loading: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      form: {
        exportType: '1', // 默认选择全部
        departmentIds: '',
        currentYear:''
      },
    }
  },
  methods: {
    add() {
      this.visible = true
      this.loading = true
    },
    async initData() {
      this.visible = true
      this.loading = false // 由于没有异步请求，这里可以直接设为 false
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      // let ids = [] // 默认值为一个空数组

      // 根据选择的导出类型设置 ids
      // if (this.form.exportType === '2') {
      //   ids = this.form.departmentIds.split(',') // 选择单位时赋值，确保它是一个数组
      // }

      this.visible = false
      this.$emit('ok')

      // 将 ids 转换为 JSON 字符串
      // const params = JSON.stringify(ids) // 将 ids 转换为 JSON 字符串
      let params={};
      params.currentYear=this.form.currentYear;
      axios
        .get('/modules/assessBusinessCommend/exportExcel', {
          params:params,
          headers: {
            'Content-Type': 'application/json', // 确保是 JSON 格式
          },
          responseType: 'blob',
        })
        .then((res) => {
          if (res && res.headers) {
            let contentDisposition = res.headers['content-disposition']
            let fileName = contentDisposition ? contentDisposition.split('filename=')[1] : '表彰信息汇总表.xlsx'
            let realname = decodeURIComponent(fileName)
            let contentType = res.headers['content-type']
            let url = window.URL.createObjectURL(new Blob([res.data], { type: contentType }))
            let link = document.createElement('a')
            link.href = url
            link.setAttribute('download', realname)
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
