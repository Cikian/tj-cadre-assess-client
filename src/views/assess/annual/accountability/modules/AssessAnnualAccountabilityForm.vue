<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="单位（处室）" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="depart">
              <j-select-depart v-if="isAdmin" v-model="model.depart" :multi="false" />
              <span v-else>{{ currentDepart.name }}</span>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="年度" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="currentYear">
              <t-dict-select-tag v-if="isAdmin" type="list" v-model="model.currentYear" dictCode="assess_year"
                                 placeholder="请选择年度" />
              <span v-else>{{ model.currentYear }}</span>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="personnel">
              <!--              <a-input v-model='model.personnel' placeholder='请输入姓名'></a-input>-->
              <a-select
                show-search
                :value="model.personnel"
                placeholder="请输入姓名"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @focus='handleSearch'
                @search="handleSearch"
                @change="handleChange"
                option-label-prop="label"
                style="white-space: pre"
              >
                <a-select-option v-for="d in searchData" :key="d.value" :lable="d.label">
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
            <a-form-model-item label="问责类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="type">
              <t-category-select :multiple="true" v-model="model.type" pcode="B03" placeholder="请选择问责类型"
                                 back="typeText"
                                 @change="handleCategoryChange" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="文号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="referenceNo">
              <a-input v-model="model.referenceNo" placeholder="请输入文号"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="事由" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="reason">
              <a-textarea v-model="model.reason" placeholder="请输入事由"></a-textarea>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="给予处理部门" :labelCol="labelCol" :wrapperCol="wrapperCol"
                               prop="processingDepart">
              <a-input v-model="model.processingDepart" placeholder="请输入给予处理部门"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="生效日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="effectiveDate">
              <j-date @change="startDateChange" placeholder="请选择生效日期" v-model="model.effectiveDate"
                      style="width: 100%" />
            </a-form-model-item>
          </a-col>
<!--          <a-col :span="12">-->
<!--            <a-form-model-item label="影响期结束" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="endDate">-->
<!--              &lt;!&ndash;              <j-date placeholder='请选择影响期结束' v-model:value='model.endDate' style='width: 100%' />&ndash;&gt;-->
<!--              <a-date-picker v-model="endDate" style="width: 100%" />-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
          <a-col :span="12">
            <a-form-model-item label="证明材料" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="proof">
              <j-upload :multiple="false" :biz-path='"/annual/accountability"' v-model="model.proof"></j-upload>
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
import moment from 'moment'
import TDictSelectTag from '@/component/TDictSelectTag.vue'
import TCategorySelect from '@/component/TCategorySelect.vue'

export default {
  name: 'AssessAnnualAccountabilityForm',
  components: { TCategorySelect, TDictSelectTag },
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
        personnel: [
          { required: true, message: '请输入姓名!' }
        ],
        sex: [
          { required: true, message: '请选择性别!' }
        ],
        birth: [
          { required: true, message: '请选择出生日期!' }
        ],
        currentYear: [
          { required: true, message: '请输入年度!' }
        ],
        depart: [
          { required: true, message: '请输入单位（处室）!' }
        ],
        type: [
          { required: true, message: '请输入问责类型!' }
        ],
        reason: [
          { required: true, message: '请输入事由!' }
        ],
        effectiveDate: [
          { required: true, message: '请输入生效日期!' }
        ]
      },
      url: {
        add: '/modules/annual/assessAnnualAccountability/add',
        edit: '/modules/annual/assessAnnualAccountability/edit',
        queryById: '/modules/annual/assessAnnualAccountability/queryById'
      },
      currentDepart: {
        id: '',
        name: ''
      },
      // endDate: undefined,
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
      if (this.isAdmin){
        depart = undefined
        if (this.model.depart !== undefined && this.model.depart !== null && this.model.depart !== ''){
          depart = this.model.depart
        }
      }
      searchUser(value, depart).then(res => {
        if (res.success && res.result.length > 0) {
          this.searchData = res.result
        } else {
          this.model.personnel = value
        }
      })
    },
    handleChange(value) {
      this.model.personnel = value.split('@')[0]
      this.model.hashId = value
      // fetch(value, data => (this.searchData = data));

      let depart = this.currentDepart.id
      if (this.isAdmin){
        depart = undefined
        if (this.model.depart !== undefined && this.model.depart !== null && this.model.depart !== ''){
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
          this.model.personnel = value
          this.model.sex = ''
          this.model.birth = undefined
        }
      })
    },
    add() {
      this.edit(this.modelDefault)

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

      // this.endDate = this.model.endDate
      this.currentYear = this.model.currentYear
      this.currentDepart.id = this.model.depart
      this.currentDepart.name = this.model.depart_dictText

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
              // this.$confirm({
              //   title: '消息提示',

              //   content: h => <div style="color:red;font-size:18px">{res.message}</div>,

              //   onOk: () => {

              //   },

              //   onCancel: () => {

              //   }

              // })
              this.$success({
                title: '消息提示',
                content: res.message
              })
              that.$emit('ok')
            } else {
              // that.$message.warning(res.message)
              // this.$confirm({
              //   title: '消息提示',

              //   content: h => <div style="color:red;font-size:18px">{res.message}</div>,

              //   onOk: () => {

              //   },

              //   onCancel: () => {

              //   }

              // })
              this.$error({
                title: '消息提示',
                content: res.message
              })
            }
          }).finally(() => {
            that.confirmLoading = false
          })
        }

      })
    },
    handleCategoryChange(value, backObj) {

      // this.model = Object.assign(this.model, backObj)
      //
      // if (this.model.effectiveDate !== null && this.model.effectiveDate !== undefined && this.model.effectiveDate !== '') {
      //   getAccountabilityEndDate(this.model.type, this.model.effectiveDate).then(res => {
      //     if (res.success && res.result != null) {
      //       this.endDate = moment(res.result, 'YYYY-MM-DD')
      //       // 如果后台返回的日期小于当前日期，则默认为当前日期
      //       if (!this.endDate || this.endDate < moment()) {
      //         this.endDate = moment()
      //       }
      //       this.model.endDate = this.endDate
      //     } else {
      //       this.endDate = undefined
      //       this.model.endDate = undefined
      //     }
      //   })
      // }
    },

    startDateChange(value) {
      // if (this.model.type !== null && this.model.type !== undefined && this.model.type !== '') {
      //   getAccountabilityEndDate(this.model.type, value).then(res => {
      //     if (res.success && res.result != null) {
      //       this.endDate = moment(res.result, 'YYYY-MM-DD')
      //       this.model.endDate = this.endDate
      //     } else {
      //       this.endDate = undefined
      //       this.model.endDate = undefined
      //     }
      //   })
      // }
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
      width: 30%;
    }

    .ant-form-item-control-wrapper {
      width: 70%;
    }
  }
}
</style>