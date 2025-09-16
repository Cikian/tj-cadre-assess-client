<template>
  <t-modal
    title="导出各处室（单位）测评成绩"
    :width="width"
    :visible="visible"
    :simple-submit="true"
    @ok="handleOk"
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="loading">
      <a-form-model :model="form" >
        <a-row :gutter="24">
          <a-col :span='24'>
            <a-form-model-item label="年度" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select v-model="form.currentYear" placeholder="请选择年度">
                <a-select-option v-for="(item, i) in yearDict" :key="item.value" :value="item.value">
                  {{ item.text }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span='10' >
            <a-form-model-item label="是否合并" :label-col="{ span: 11 }" :wrapper-col="{ span: 8 }">
              <a-switch v-model="form.merge"></a-switch>
            </a-form-model-item>
          </a-col>
          <a-col :span='14' >
            <a-form-model-item label="是否显示测评处室（单位）" :label-col="{ span: 18 }" :wrapper-col="{ span: 6 }">
              <a-switch v-model="form.exportDepart"></a-switch>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>

    </a-spin>
  </t-modal>
</template>

<script>
import AssessBusinessGradeForm from './AssessBusinessGradeForm.vue'
import GradeModel from '@/component/GradeModel.vue'
import TModal from '@/component/TModal.vue'
import { getDictItemByCode } from '@/utils/commonUtils'
import { axios } from '@/utils/assessReq'

export default {
  name: 'AssessBusinessExportModal',
  components: {
    TModal,
    AssessBusinessGradeForm,
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
        merge: false,
        exportDepart: false,
      },

      yearDict: [],
    }
  },
  methods: {
    add() {
      this.visible = true
      this.loading = true
      this.$nextTick(() => {})
    },
    async initData(year) {
      this.visible = true
      this.$nextTick(async () => {
        try {
          const [yearDict] = await Promise.all([
            getDictItemByCode('assess_year')
          ])
          this.yearDict = yearDict
          this.form.currentYear = year;
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
      let that=this;
      axios.get('/modules/assessBusinessGrade/hasBusnessGrade', { params:{currentYear:that.form.currentYear} }).then((result) => {
        if (!result.data.success){
          that.$message.warning(result.data.message);
          return;
        }else {
          that.visible = false;
          that.$emit('ok');
          axios
            .post('/modules/assessBusinessGrade/exportPdf', that.form, { responseType: 'blob',timeout:300000 })
            .then((res) => {
              if (res && res.headers) {
                let contentDisposition = res.headers['content-disposition']
                let fileName = contentDisposition ? contentDisposition.split('filename=')[1] : '各处室（单位）测评成绩.pdf'
                let realname = decodeURIComponent(fileName)
                let contentType = res.headers['content-type']
                let url = window.URL.createObjectURL(new Blob([res.data], { type: contentType }))
                let link = document.createElement('a')
                link.href = url
                link.setAttribute('download', realname) // 使用后端设置的文件名
                document.body.appendChild(link)
                link.click()
                that.$emit('over')
                document.body.removeChild(link)
              } else {
                console.error('Response headers are undefined')
              }
            })
            .catch((error) => {
              console.error('Error downloading file:', error)
            })
        }
      })

    },

    handleCancel() {
      this.close()
    },
  },
}
</script>
