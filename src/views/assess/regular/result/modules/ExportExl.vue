<template>
  <t-modal
    title="导出类型"
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
        <a-form-model-item label="选择年度">
          <t-dict-select-tag placeholder="请选择年度" v-model="form.currentYear" dictCode="assess_year" />
        </a-form-model-item>
        <a-form-model-item label="选择类型">
          <a-select v-model="form.type" placeholder="请选择导出范围" @change="handleSelectChange">
            <a-select-option value="全部">全部考核结果</a-select-option>
            <!-- 固定选项 -->
            <a-select-option v-if="personnelDepartment" :value="personnelDepartment">{{
                personnelDepartment
              }}
            </a-select-option>
            <!-- 动态选项 -->
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
import TDictSelectTag from '@/component/TDictSelectTag.vue'

export default {
  name: 'ExportExl',
  components: {
    TDictSelectTag,
    TModal,
    GradeModel
  },
  props: {
    fileName: {
      type: String,
      default: ''
    },
    personnelDepartment: {
      // 接收父组件传来的“人事处”选项
      type: String,
      default: ''
    },
    personnelValue: {
      // 接收父组件传来的动态选项 value
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      width: 800,
      visible: false,
      disableSubmit: false,
      loading: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        type: '', // 用于选择类型
        currentYear: ''
      },
      selectedValue: 0, // 用于存储选择的 value
      url: {
        getAllEmployee: '/regular/report/exportEmployeeExcel',
        getAllCadres: '/regular/report/exportCadresExcel',
        getAllClerk: '/regular/report/exportClerkExcel'
      }
    }
  },
  methods: {
    add() {
      this.visible = true
      this.loading = true
      this.$nextTick(() => {
      })
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
    handleSelectChange(value) {
      // 根据选择的类型设置 selectedValue
      this.selectedValue = value === '全部' ? 2 : this.personnelValue
    },

    handleOk() {
      this.visible = false
      this.$emit('ok')

      // 调用 downdetails 方法，传递选择的 value
      this.downdetails(this.selectedValue) // 传递选择的 value
    },

    downdetails(value) {
      const urlMap = {
        0: this.url.getAllEmployee,
        1: this.url.getAllCadres,
        2: this.url.getAllClerk
      }

      let selectUrl = urlMap[value] || '' // 提供默认值

      // 检查 url 是否为有效的字符串
      if (typeof selectUrl !== 'string' || selectUrl.trim() === '') {
        console.error('下载URL无效:', selectUrl)
        return
      }

      if (this.form.currentYear || this.form.currentYear !== '') {
        selectUrl += `?currentYear=${this.form.currentYear}`
      }

      axios
        .get(selectUrl, { responseType: 'blob' })
        .then((res) => {
          if (res && res.headers) {
            let contentDisposition = res.headers['content-disposition']
            let fileName = contentDisposition ? contentDisposition.split('filename=')[1] : `${this.fileName}.xls`
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
    }
  }
}
</script>
