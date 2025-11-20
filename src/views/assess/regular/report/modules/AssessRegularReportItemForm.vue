<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row :gutter="16">
          <a-col span="12">
            <a-form-item label="姓名" prop="name" :disabled="true">
              <a-input v-model="model.name" placeholder="请输入姓名" :disabled="isEdit" />
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item label="性别" prop="sex">
              <a-select v-model="model.sex" placeholder="请选择性别" :disabled="isEdit">
                <a-select-option :value="1">男</a-select-option>
                <a-select-option :value="2">女</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col span="12">
            <a-form-item label="出生日期" prop="birthDate" >
              <a-date-picker v-model="model.birthDate" placeholder="请选择出生日期" :disabled="isEdit" />
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item label="所在处室（单位）" prop="departmentCode">
              <j-select-depart v-model="model.departmentCode" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col span="12">
            <a-form-item label="类别" prop="positionType">
              <a-select v-model="model.positionType" placeholder="请选择类别">
                <a-select-option value="正职">正职</a-select-option>
                <a-select-option value="副职">副职</a-select-option>
                <a-select-option value="其他">其他</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item label="是否局领导考核" prop="isLeader">
              <a-radio-group v-model="model.isLeader">
                <a-radio value="1">是</a-radio>
                <a-radio value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col span="12">
            <a-form-item label="管理部门" prop="adminDepartment">
              <a-select v-model="model.adminDepartment" placeholder="请选择身份">
                <a-select-option value="干部处">干部处</a-select-option>
                <a-select-option value="人事处">人事处</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col span="12">
            <a-form-item label="职务" prop="post">
              <a-input v-model="model.post" placeholder="请输入职务" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col span="12">
            <a-form-item label="职级" prop="rank">
              <a-input v-model="model.rank" placeholder="请输入职级" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

import { httpAction, getAction } from '@/api/manage'
import { validateDuplicateValue } from '@/utils/util'

export default {
  name: 'AssessRegularReportItemForm',
  components: {},
  props: {
    //表单禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data() {
    return {
      isEdit: false,
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
        name: [
          { required: true, message: '请输入姓名!' }
        ],
        departmentCode: [
          { required: true, message: '请输入所在处室!' }
        ]
      },
      url: {
        add: '/regular/report/addAdjustmentItem',
        edit: '/regular/item/edit',
        queryById: '/regular/item/queryById'
      }
    }
  },
  computed: {
    formDisabled() {
      return this.disabled
    }
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
              that.$message.success(res.message)
              that.$emit('ok')
            } else {
              that.$message.warning(res.message)
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