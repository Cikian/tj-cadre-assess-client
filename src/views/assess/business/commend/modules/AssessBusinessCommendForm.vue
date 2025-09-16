<template>
  <a-spin :spinning='confirmLoading'>
    <j-form-container :disabled='formDisabled'>
      <a-form-model ref='form' :model='model' :rules='validatorRules' slot='detail'>
        <a-row>
          <!--          <a-col :span="24">-->
          <!--            <a-form-model-item label="年度" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="currentYear">-->
          <!--              {{model.currentYear}}-->
          <!--            </a-form-model-item>-->
          <!--          </a-col>-->
          <a-col v-has="'gbc:admin'" :span="24">
            <a-form-model-item label="被表彰处室（单位）" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="departmentCode">
<!--              {{ model.departmentCode }}-->
              <j-select-depart placeholder="请选择处室（单位）" v-model="model.departmentCode" />
            </a-form-model-item>
          </a-col>
          <a-col :span='24'>
            <a-form-model-item label='表彰单位' :labelCol='labelCol' :wrapperCol='wrapperCol' prop='commendUnit'>
              <a-input v-model='model.commendUnit' placeholder='请输入表彰单位'></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span='24'>
            <a-form-model-item label='表彰项目' :labelCol='labelCol' :wrapperCol='wrapperCol' prop='commendProject'>
              <a-input v-model='model.commendProject' placeholder='请输入表彰项目'></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span='24'>
            <a-form-model-item label='表彰时间' :labelCol='labelCol' :wrapperCol='wrapperCol' prop='commendTime'>
              <j-date placeholder='请选择表彰时间' v-model='model.commendTime' style='width: 100%' />
            </a-form-model-item>
          </a-col>
          <a-col :span='24'>
            <a-form-model-item label='填报人' :labelCol='labelCol' :wrapperCol='wrapperCol' prop='reportBy'>
              <j-select-user-by-dep v-model='model.reportBy' :multi='true' store='id' text='realname'
                                    :disabled='true' />
            </a-form-model-item>
          </a-col>
          <a-col :span='24'>
            <a-form-model-item label='证明材料' :labelCol='labelCol' :wrapperCol='wrapperCol' prop='proof'>
              <j-upload :biz-path='"/business/commend"' v-model='model.proof'></j-upload>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

import { httpAction } from '@/api/manage'
import { getAssessingInfo, getCurrentUserDepart } from '@/api/assessApis'

export default {
  name: 'AssessBusinessCommendForm',
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
        currentYear: [
          { required: true, message: '请输入年度!' }
        ],
        departmentCode: [
          { required: true, message: '请输入处室（单位）!' }
        ],
        commendUnit: [
          { required: true, message: '请输入表彰单位!' }
        ],
        commendProject: [
          { required: true, message: '请输入表彰项目!' }
        ],
        commendTime: [
          { required: true, message: '请输入表彰时间!' }
        ],
        reportBy: [
          { required: true, message: '请输入填报人!' }
        ]
        //  proof: [
        //     { required: true, message: '请输入证明材料!'},
        //  ],
      },
      url: {
        add: '/modules/assessBusinessCommend/add',
        edit: '/modules/assessBusinessCommend/edit',
        queryById: '/modules/assessBusinessCommend/queryById'
      },
      currentDepart: {
        id: '',
        name: ''
      },
      currentAssess: {}
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
    getAssessingInfo('business').then(res => {
      if (res.success) {
        this.currentAssess = res.result
        this.model.currentYear = res.result.currentYear
      }
    })

    getCurrentUserDepart().then(res => {
      if (res.success) {
        this.currentDepart.id = res.result.departId
        this.currentDepart.name = res.result.departName
        this.model.departmentCode = res.result.departId
      }
    })

  },
  methods: {
    add() {
      this.edit(this.modelDefault)

      this.model.reportBy = this.$store.getters.userInfo.id
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
          // this.model.status = 1
          httpAction(httpurl, this.model, method).then((res) => {
            if (res.success) {
              // that.$message.success(res.message);
              // this.$confirm({
              //   title: '消息提示',
              //   content: h => <div style='color:red;'>{res.message}</div>,
              //   onOk: () => {
              //   },
              //   onCancel: () => {
              //   }
              // })
              this.$success({
                title: '成功',
                content: res.message
              })
              that.$emit('ok')
            } else {
              // that.$message.warning(res.message);
              // this.$confirm({
              //   title: '消息提示',
              //   content: h => <div style='color:red;'>{res.message}</div>,
              //   onOk: () => {
              //   },
              //   onCancel: () => {
              //   }
              // })
              this.$error({
                title: '错误',
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
<style>
.ant-modal-content {
  position: relative;
  background-color: rgb(246, 248, 248);
  background-clip: padding-box;
  border: 0;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  pointer-events: auto;
}

.ant-modal-header {
  padding: 16px 24px;
  color: rgba(0, 0, 0, 0.65);
  background: rgb(246, 248, 248);
  border-bottom: 0px solid #e8e8e8;
  border-radius: 4px 4px 0 0;
}

.ant-spin-nested-loading {
  position: relative;
  background-color: white;
  border: 1px solid rgb(234, 235, 234);;
  padding: 10px 0px;
}

.ant-modal-footer {
  padding: 10px 16px;
  text-align: right;
  background: transparent;
  border-top: 0px solid #e8e8e8;
  border-radius: 0 0 4px 4px;
}

.ant-form-item label {
  position: relative;
  margin-right: 10px;
  font-family: 思源黑体;
  font-size: 16px;
  font-weight: 500;
  color: rgb(9, 24, 52);

}

.ant-select-selection__placeholder, .ant-select-search__field__placeholder {
  position: absolute;
  top: 50%;
  right: 9px;
  left: 0;
  max-width: 100%;
  height: 20px;
  margin-top: -10px;
  overflow: hidden;
  /* color: rgb(9, 24, 52);
font-family: 思源黑体; */
  color: #bfbfbf;
  line-height: 20px;
  white-space: nowrap;
  text-align: left;
  text-overflow: ellipsis;
}
</style>