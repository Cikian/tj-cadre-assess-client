<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
<!--        <a-form-model-item label="年度" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
<!--          {{ model.currentYear }}-->
<!--        </a-form-model-item>-->
        <a-form-model-item label="负面清单对象" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="type">
          <a-select v-model="model.type" placeholder="请选择负面清单对象" :default-value="'1'">
            <a-select-option :value="'1'">单位</a-select-option>
            <a-select-option :value="'2'">个人</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="单位" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="depart">
          <t-select-depart :disabled='!model.type' v-if='model.type === "1"' text="alias" v-model="model.depart" :depart-type="'2,3,4'" />
          <j-select-depart :disabled='!model.type' v-else v-model="model.depart" />
        </a-form-model-item>
        <a-form-model-item v-if='model.type === "2"' label="对象" :labelCol="labelCol" :wrapperCol="wrapperCol"
                           prop="depart">
          <a-select
            show-search
            :value="model.person"
            placeholder="请输入姓名"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            @focus='handleSearch'
            @search="handleSearch"
            @change="handleChange"
            option-label-prop="label"
            :disabled='!model.depart'
            style="white-space: pre"
          >
            <a-select-option v-for="d in searchData" :key="d.value" :lable="d.label">
              {{ d.text }}
            </a-select-option>
          </a-select>

        </a-form-model-item>
        <a-form-model-item label="内容" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="content">
          <a-textarea v-model="model.content" placeholder="请输入内容"
                      :auto-size="{ minRows: 3, maxRows: 5 }"></a-textarea>

        </a-form-model-item>
        <a-form-model-item label="证明文件" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="files">
          <j-upload :biz-path='"/annual/negative"' v-model="model.files"></j-upload>
        </a-form-model-item>
      </a-form-model>
    </j-form-container>

    <div v-show="showNoDataMask" class="no-data-mask">
      <span>当前没有正在进行中的考核</span>
    </div>
  </a-spin>
</template>

<script>

import { httpAction } from '@/api/manage'
import { getAssessingInfo, getCurrentUserDepart, searchUser } from '@/api/assessApis'
import TSelectDepart from '@/component/TSelectDepart.vue'

export default {
  name: 'AssessAnnualNegativeListForm',
  components: { TSelectDepart },
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
      showNoDataMask: false, // 控制遮罩层显示
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
      value: undefined,
      searchData: []
    }
  },
  computed: {
    formDisabled() {
      return this.disabled
    },
    getSkipAudit() {
      return this.skipAudit
    }
  },
  created() {
    //备份model原始值
    this.modelDefault = JSON.parse(JSON.stringify(this.model))
  },
  methods: {
    handleSearch(value) {
      if (this.model.depart === null || this.model.depart === undefined || this.model.depart === '') {
        this.$warning({
          title: '请先选择单位',
          content: '请先选择单位后再次尝试搜索'
        })
        return
      }
      let depart = this.model.depart
      // fetch(value, data => (this.searchData = data));
      searchUser(value, depart).then(res => {
        if (res.success && res.result.length > 0) {
          this.searchData = res.result
        } else {
          this.model.person = value
        }
      })
    },
    handleChange(value) {
      this.model.person = value.split('@')[0]
      this.model.hashId = value
      // fetch(value, data => (this.searchData = data));

      searchUser(value).then(res => {
        if (res.success && res.result.length > 0) {
          this.searchData = res.result
        } else {
          this.model.person = value
        }
      })
    },
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
          if (this.assessingData.assessing === false) {
            this.showNoDataMask = true // 显示无数据遮罩
          }
        } else {
          // this.$message.error(res.message)
          // this.$confirm({
          //   title: '消息提示',

          //   content: h => <div style="color:red;">{res.message}</div>,

          //   onOk: () => {

          //   },

          //   onCancel: () => {

          //   }

          // })
          this.$error({
            title: '错误',
            content: res.message
          })

          this.showNoDataMask = true // 显示无数据遮罩
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
      if (this.getSkipAudit) {
        this.model.status = '3'
        this.model.reportDepart = '干部处管理员'
      } else {
        this.model.status = '2'
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
              // this.$success({
              //   title: '成功',
              //   content: res.message
              // })
              that.$emit('ok')
            } else {
              this.$warning({
                title: res.message,
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
<style scoped>
.no-data-mask {
  position: absolute;
  top: 10%;
  left: 0;
  width: 100%;
  height: 90%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  font-size: 26px;
  font-weight: 700;
}

</style>