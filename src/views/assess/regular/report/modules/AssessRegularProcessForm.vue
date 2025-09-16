<template>
  <a-spin :spinning="confirmLoading" style="max-height: 500px">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row style="align-items: center">
          <a-col :span="24" >
            <a-form-model-item  label="年度" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="currentYear">
              <a-input v-model="model.currentYear" placeholder="请输入年度" @change="infoChange" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="季度" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="currentQuarter">
              <j-dict-select-tag
                type="list"
                v-model="model.currentQuarter"
                dictCode="assess_quarter"
                placeholder="请选择季度"
                @change="infoChange"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="考核名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="assessName">
              <a-input v-model="model.assessName" placeholder="请输入考核名称"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="截止日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="deadline">
              <j-date
                placeholder="请选择截止日期"
                v-model="model.deadline"
                :show-time="false"
                date-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>
<script>
import { httpAction } from '@/api/manage'

export default {
  name: 'AssessRegularProcessForm',
  components: {},
  props: {
    //表单禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      newlist: [],
      iserror: 1,
      model: {
        assessName: '',
        currentYear: null,
        currentQuarter: null,
        deadline: null,
        reportItems: [],
        conflictItems: [],
        conflictHashId: [],
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      confirmLoading: false,
      validatorRules: {
        assessName: [{ required: true, message: '请输入考核名称!' }],
        currentYear: [
          { required: true, message: '请输入年度!' },
          { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!' },
        ],
        currentQuarter: [
          { required: true, message: '请输入季度!' },
          { pattern: /^-?\d+\.?\d*$/, message: '请输入数字!' },
        ],
        deadline: [{ required: true, message: '请输入截止日期!' }],
      },
      url: {
        startProcess: '/regular/report/startProcess',
        editProcess: '/regular/report/conflictSolution',
      },
    }
  },
  computed: {
    formDisabled() {
      return this.disabled
    },
  },
  watch: {
    'model.currentYear': {
      immediate: true,
      handler(newValue) {
        this.updateAssessName()
      },
    },
    'model.currentQuarter': {
      immediate: true,
      handler(newValue) {
        this.updateAssessName()
      },
    },
    // // 当 currentYear 变化时，重新查询已保存的条件
    // this.model.currentYear:{
    //   immediate: true,
    //   handler() {
    //     this.model.assessName="年平时考核"
    //   }
    //   }
  },
  created() {
    //备份model原始值
    this.model.assessName = 'XXXX年第X季度平时考核'
    this.modelDefault = JSON.parse(JSON.stringify(this.model))
    this.$bus.$on('updateReportItems', (reportItems) => {
      this.model.reportItems = reportItems
    })
    this.$bus.$on('updateReportItemsnewlist', (reportItems) => {
      this.model.conflictHashId = reportItems
    })
  },
  methods: {
    add() {
      this.edit(this.modelDefault)
    },
    edit(record) {
      this.model = Object.assign({}, record)
      this.visible = true
    },
    submitForm() {
      const that = this
      // 触发表单验证
      this.$refs.form.validate((valid) => {
        if (valid) {
          that.confirmLoading = true
          let httpurl = ''
          let method = ''

          if (this.iserror !== 2) {
            httpurl += this.url.startProcess
            method = 'post'
          } else {
            httpurl += this.url.editProcess
            method = 'post'
          }

          httpAction(httpurl, this.model, method)
            .then((res) => {
              if (res.success) {
                this.$emit('ok')
                // that.$message.success(res.message)
                this.$success({
                  title: res.message,
                  // content: h => <div style='color:red;'>{res.message}</div>,
                })
                // that.$emit('ok')
              } else {
                // that.$message.warning(res.message)
                this.$error({
                  title: res.message,
                  // content: h => <div style='color:red;'>{res.message}</div>,
                  onOk: () => {
                  },
                  onCancel: () => {
                  },
                })
                if (res.result) {
                  this.$emit('confirmfun', res.result)
                  this.iserror = 2
                  // that.$emit('ok')
                } else {
                  that.$emit('ok')
                  this.iserror = 1
                }
              }
            })
            .finally(() => {
              that.confirmLoading = false
            })
        }
      })
    },
    updateAssessName() {
      const year = this.model.currentYear || 'XXXX'
      const quarter = this.model.currentQuarter || 'X'
      // 更新考核名称
      this.model.assessName = `${year}年第${quarter}季度平时考核`
      this.$emit('formDataUpdated', { ...this.model })
    },
    infoChange() {
      this.$emit('formChange', this.model.currentYear, this.model.currentQuarter)
    },
  },
  beforeDestroy() {
    // 清理 event listener
    this.$bus.$off('updateReportItems')
  },
}
</script>

