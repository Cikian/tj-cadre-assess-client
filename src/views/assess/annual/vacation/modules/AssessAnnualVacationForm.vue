<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="处室（单位）" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="depart">
              <j-select-depart v-if="isAdmin" v-model="model.depart" :multi="false" />
              <span v-else>{{ currentDepart.name }}</span>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="年度" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="currentYear">
              <t-dict-select-tag v-if="isAdmin" type="list" v-model="model.currentYear" dictCode="assess_year"
                                 placeholder="请选择年度" />
              <!--              <span>{{ currentYear }}</span>-->
              <span v-else>{{ model.currentYear }}</span>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="name">
              <!--              <a-input v-model="model.name" placeholder="请输入姓名"></a-input>-->
              <a-select
                show-search
                :value="model.name"
                placeholder="请输入姓名"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @focus='handleSearch'
                @search="handleSearch"
                @change="handleChange"
                option-label-prop="lable"
                style="white-space: pre"
              >
                <a-select-option v-for="d in searchData" :key="d.value" :lable="d.lable">
                  {{ d.text }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>

          <a-col :span="12">
            <a-form-model-item label="性别" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sex">

              <a-select disabled v-model="model.sex" placeholder="请选择性别">
                <a-select-option value="男">
                  男
                </a-select-option>
                <a-select-option value="女">
                  女
                </a-select-option>
              </a-select>

            </a-form-model-item>
          </a-col>

          <a-col :span="12">
            <a-form-model-item label="出生日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="birth">
              <a-date-picker disabled v-model="model.birth" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="休假类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="type">
              <j-dict-select-tag type="list" v-model="model.type" dictCode="vacation_type"
                                 placeholder="请选择休假类型" />
            </a-form-model-item>
          </a-col>

          <a-col :span="12">
            <a-form-model-item label="起止时间" :labelCol="labelCol" :wrapperCol="wrapperCol" required>
              <a-range-picker
                format="YYYY-MM-DD"
                @change="datePickerOnChange"
                v-model="startAndEndDate"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="请假工作日天数" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="days" required>
              <a-input-number
                v-model="model.days"
                :min="0"
                :max='366'
              />
            </a-form-model-item>
          </a-col>

          <!--          <a-col :span="12">-->
          <!--            <a-form-model-item label="休假开始时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="startDate">-->
          <!--              <j-date placeholder="请选择休假开始时间" v-model="model.startDate"  style="width: 100%" />-->
          <!--            </a-form-model-item>-->
          <!--          </a-col>-->
          <!--          <a-col :span="12">-->
          <!--            <a-form-model-item label="休假结束时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="endDate">-->
          <!--              <j-date placeholder="请选择休假结束时间" v-model="model.endDate"  style="width: 100%" />-->
          <!--            </a-form-model-item>-->
          <!--          </a-col>-->
          <a-col :span="12">
            <a-form-model-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="remark">
              <a-textarea v-model="model.remark" placeholder="请输入备注"></a-textarea>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

import { httpAction } from '@/api/manage'
import { getAssessingInfo, getCurrentUserDepart, getCurrentUserRoles, searchUser } from '@/api/assessApis'
import moment from 'moment/moment'
import TDictSelectTag from '@/component/TDictSelectTag.vue'

export default {
  name: 'AssessAnnualVacationForm',
  components: { TDictSelectTag },
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
      value: undefined,
      searchData: [],
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      confirmLoading: false,
      validatorRules: {
        currentYear: [
          { required: true, message: '请输入年度!' }
        ],
        name: [
          { required: true, message: '请输入姓名!' }
        ],
        depart: [
          { required: true, message: '请输入单位（处室）!' }
        ],
        birth: [
          { required: true, message: '请输选择出生日期!' }
        ],
        sex: [
          { required: true, message: '请选择性别!' }
        ],
        type: [
          { required: true, message: '请输入休假类型!' }
        ],
        startDate: [
          { required: true, message: '请输入休假开始时间!' }
        ],
        endDate: [
          { required: true, message: '请输入休假结束时间!' }
        ],
        days: [
          { required: true, message: '请输入休假工作日天数!' }
        ],
      },
      url: {
        add: '/modules/assessAnnualVacation/add',
        edit: '/modules/assessAnnualVacation/edit',
        queryById: '/modules/assessAnnualVacation/queryById'
      },
      currentYear: '',
      currentDepart: {
        id: '',
        name: ''
      },
      startAndEndDate: [],
      isAdmin: false

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
    getCurrentUserRoles().then(res => {
      if (res.success) {
        if (res.result.includes('department_cadre_admin')) {
          this.isAdmin = true
        }
      }
    })
  },
  methods: {
    handleSearch(value) {
      // fetch(value, data => (this.searchData = data));
      let depart = this.currentDepart.id
      if (this.isAdmin) {
        depart = undefined
        if (this.model.depart !== undefined && this.model.depart !== null && this.model.depart !== '') {
          depart = this.model.depart
        }
      }
      searchUser(value, depart).then(res => {
        if (res.success && res.result.length > 0) {
          this.searchData = res.result
        } else {
          this.model.name = value
        }
      })
    },
    handleChange(value) {
      this.model.name = value.split('@')[0]
      this.model.hashId = value
      // fetch(value, data => (this.searchData = data));
      let depart = this.currentDepart.id
      if (this.isAdmin) {
        depart = undefined
        if (this.model.depart !== undefined && this.model.depart !== null && this.model.depart !== '') {
          depart = this.model.depart
        }
      }
      searchUser(value, depart).then(res => {
        if (res.success && res.result.length > 0) {
          this.searchData = res.result
          let sex = this.searchData[0].value.split('@')[1]
          this.model.sex = sex

          this.model.birth = moment(this.searchData[0].value.split('@')[2], 'YYYYMMDD')
        } else {
          this.model.name = value
          this.model.sex = ''
          this.model.birth = undefined
        }
      })
    },
    add() {
      this.edit(this.modelDefault)
      this.startAndEndDate = []

      getAssessingInfo("annual").then(res => {
        if (res.success) {
          this.currentYear = res.result.currentYear
          this.model.currentYear = res.result.currentYear
        }
      })

      getCurrentUserDepart().then(res => {
        if (res.success) {
          this.currentDepart.id = res.result.departId
          this.currentDepart.name = res.result.departName
          this.model.depart = res.result.departId
        }
      })
    },
    edit(record) {
      this.model = Object.assign({}, record)
      this.visible = true

      this.currentYear = this.model.currentYear
      this.currentDepart.name = this.model.depart_dictText
      this.currentDepart.id = this.model.depart
      this.startAndEndDate = [moment(this.model.startDate, 'YYYY-MM-DD'), moment(this.model.endDate, 'YYYY-MM-DD')]
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
          this.model.depart_dictText = this.currentDepart.name
          httpAction(httpurl, this.model, method).then((res) => {
            if (res.success) {
              // that.$message.success(res.message)
              this.$success({
                title: res.message,
                // content: h => <div style='color:red;'>{res.message}</div>,
                onOk: () => {
                },
                onCancel: () => {
                }
              })
              that.$emit('ok')
            } else {
              // that.$message.warning(res.message)
              this.$error({
                title: res.message,
                // content: h => <div style='color:red;'>{res.message}</div>,
                onOk: () => {
                },
                onCancel: () => {
                }
              })
            }
          }).finally(() => {
            that.confirmLoading = false
          })
        }

      })
    },

    datePickerOnChange(date, dateString) {
      this.model.startDate = dateString[0]
      this.model.endDate = dateString[1]
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .ant-form {
  background-color: #FFFFFF;
  padding-top: 20px;
  padding-right: 20px;

  .ant-row {
    .ant-form-item-label {
      width: 25%;
    }

    .ant-form-item-control-wrapper {
      width: 70%;
    }
  }
}
</style>