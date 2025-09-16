<template>
  <t-modal
    title="导出年份"
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
          <a-select v-model="form.startYear" placeholder="选择开始年度" style="width: 180px">
            <a-select-option v-for="(item, i) in yearDict" :key="item.value" :value="item.value">
              {{ item.text }}
            </a-select-option>
          </a-select>

          <span style="margin: 0 10px; font-size: 16px">至</span>

          <a-select v-model="form.endYear" placeholder="选择结束年度" style="width: 180px">
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
        startYear: '',
        endYear: '',
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
      const nStartYear = parseInt(this.form.startYear);
      const nEndYear = parseInt(this.form.endYear);
      if (isNaN(nStartYear) ||isNaN(nEndYear)){
        this.$message.warning("请选择开始年度和结束年度");
        return;
      }
      if (nStartYear>nEndYear){
        this.$message.warning("开始年度不能大于结束年度");
        return;
      }
      let that=this;
      axios.get('/modules/assessBusinessGrade/hasBusnessGradeBetween', { params:{startYear:nStartYear,endYear:nEndYear} }).then((result) => {
        if (!result.data.success){
          that.$message.warning(result.data.message);
          return;
        }else {
          this.visible = false
          axios
            .post('/modules/assessBusinessGrade/downloadDuty', this.form, { responseType: 'blob' })
            .then((res) => {
              if (res && res.headers) {
                let contentDisposition = res.headers['content-disposition']
                let fileName = contentDisposition ? contentDisposition.split('filename=')[1] : '历史业务测评成绩.xlsx'
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
        }
      })

    },

    handleCancel() {
      this.close()
    },
  },
}
</script>
