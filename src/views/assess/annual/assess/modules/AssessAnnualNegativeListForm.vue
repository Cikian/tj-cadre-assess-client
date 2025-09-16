<template>
  <a-spin :spinning='confirmLoading'>
    <j-form-container :disabled='formDisabled'>
      <a-form-model ref='form' :model='model' :rules='validatorRules' slot='detail'>
        <a-form-model-item label='负面清单对象' :labelCol='labelCol' :wrapperCol='wrapperCol' prop='type'>
          <a-select v-model='model.type' placeholder='请选择负面清单对象' :default-value="'1'">
            <a-select-option :value="'1'">单位</a-select-option>
            <a-select-option :value="'2'">个人</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label='年度' :labelCol='labelCol' :wrapperCol='wrapperCol' prop='currentYear'>
          <a-input readOnly v-model='model.currentYear' placeholder='请输入年度' />
        </a-form-model-item>
        <a-form-model-item label='对象' :labelCol='labelCol' :wrapperCol='wrapperCol' prop='depart'>
          <j-select-depart v-if='model.type === "1"' v-model='model.depart' />
          <j-select-user-by-dep v-else v-model='model.depart' :multi='true' store='id' text='realname' />
        </a-form-model-item>
        <a-form-model-item label='内容' :labelCol='labelCol' :wrapperCol='wrapperCol' prop='content'>
          <a-textarea v-model='model.content' placeholder='请输入内容'
                      :auto-size='{ minRows: 3, maxRows: 5 }'></a-textarea>

        </a-form-model-item>
        <a-form-model-item label='证明文件' :labelCol='labelCol' :wrapperCol='wrapperCol' prop='files'>
          <j-upload v-model='model.files'></j-upload>
        </a-form-model-item>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

import { httpAction } from '@/api/manage'
import { getAssessingInfo, getCurrentUserDepart } from '@/api/assessApis'

export default {
  name: 'AssessAnnualNegativeListForm',
  components: {},
  props: {
    //表单禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false
    },
    skipAudit: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data() {
    return {
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      confirmLoading: false,
      validatorRules: {
        depart: [
          { required: true, message: '请选择负面清单对象!' }
        ],
        content: [
          { required: true, message: '请输入负面清单内容!' }
        ],
        reportDepart: [
          { required: true, message: '请输入填写单位!' }
        ],
        currentYear: [
          { required: true, message: '请输入年度!' }
        ],
        type: [
          { required: true, message: '请选择负面清单对象类型!' }
        ]
      },
      url: {
        add: '/modules/annual/assessAnnualNegativeList/add',
        edit: '/modules/annual/assessAnnualNegativeList/edit',
        queryById: '/modules/annual/assessAnnualNegativeList/queryById'
      },
      currentDepart: {
        id: '',
        name: ''
      },
    }
  },
  computed: {
    formDisabled() {
      return this.disabled
    },
    getSkipAudit() {
      return this.skipAudit
    },
  },
  created() {
    //备份model原始值
    this.modelDefault = JSON.parse(JSON.stringify(this.model))
  },
  methods: {
    add() {
      this.edit(this.modelDefault)
    },
    edit(record) {
      this.model = Object.assign({}, record)
      this.visible = true

      getAssessingInfo('annual').then(res => {
        if (res.success) {
          this.assessingData = res.result
          this.model.currentYear = this.assessingData.currentYear
        } else {
          // this.$message.error(res.message)
          this.$error({
            title: '错误',
            content: res.message
          })
        }
      })

      getCurrentUserDepart().then(res => {
        if (res.success) {
          this.currentDepart.id = res.result.departId
          this.currentDepart.name = res.result.departName
          this.model.reportDepart = this.currentDepart.id
        }
      })
    },
    submitForm() {
      if (this.getSkipAudit){
        this.model.status = "3"
      } else {
        this.model.status = "2"
      }

      const that = this
      // 触发表单验证
      this.$refs.form.validate(valid => {
        if (valid) {
          that.confirmLoading = true
          let httpurl = ''
          let method = ''
          if (!this.model.id) {
            httpurl += this.url.add
            method = 'post'
          } else {
            httpurl += this.url.edit
            method = 'put'
          }
          httpAction(httpurl, this.model, method).then((res) => {
            if (res.success) {
              // that.$message.success(res.message)
              this.$success({
                title: '成功',
                content: res.message
              })
              that.$emit('ok')
            } else {
              // that.$message.warning(res.message)
              this.$warning({
                title: '警告',
                content: res.message
              })
            }
          }).finally(() => {
            that.confirmLoading = false
          })
        }

      })
    }
  }
}
</script>