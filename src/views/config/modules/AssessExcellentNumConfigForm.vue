<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="单位" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="depart">
              <j-select-depart v-model="model.depart" :multi="false" />
            </a-form-model-item>
          </a-col>

          <a-col :span="24">
            <a-form-model-item label="优秀副职数量" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="excellentNum">
              <a-input-number v-model="model.excellentNum" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>
import { httpAction } from '@/api/manage'
import TSelectUserByDep from '@/component/TSelectUserByDep.vue'

export default {
  name: 'AssessExcellentNumConfigForm',
  components: { TSelectUserByDep },
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
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      confirmLoading: false,
      validatorRules: {
        depart: [{ required: true, message: '请选择单位!' }],
        excellentNum: [{ required: true, message: '请输入数量!' }],
      },
      url: {
        add: '/modules/annual/assessExcellentNum/add',
        edit: '/modules/annual/assessExcellentNum/edit',
        queryById: '/modules/annual/assessExcellentNum/queryById',
      },
    }
  },
  computed: {
    formDisabled() {
      return this.disabled
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
    },
    submitForm() {
      const that = this
      // 触发表单验证
      this.$refs.form.validate((valid) => {
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
          httpAction(httpurl, this.model, method)
            .then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
            })
        }
      })
    },
  },
}
</script>
<style scoped lang="less">
/deep/.ant-form {
  background-color: #ffffff;
  padding: 20px;
}
</style>

