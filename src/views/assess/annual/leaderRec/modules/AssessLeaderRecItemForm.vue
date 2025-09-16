<template>
  <a-spin :spinning='confirmLoading'>
    <j-form-container :disabled='formDisabled'>
      <a-form-model ref='form' :model='model' :rules='validatorRules' slot='detail'>
        <a-row>
          <a-col :span='12'>
            <a-form-model-item :label='model.recommendType === "group" ? "领导班子" : "姓名"' :labelCol='labelCol'
                               :wrapperCol='wrapperCol'>
              <span class='info'>{{ model.name }}</span>
            </a-form-model-item>
          </a-col>
          <a-col :span='12'>
            <a-form-model-item label='单位（处室）' :labelCol='labelCol' :wrapperCol='wrapperCol'>
              <span class='info'>{{ model.depart }}</span>
            </a-form-model-item>
          </a-col>

          <a-col :span='12'>
            <a-form-model-item v-show='model.recommendType !== "group"' label='类别' :labelCol='labelCol'
                               :wrapperCol='wrapperCol'>
              <span class='info'>{{ model.type }}</span>
            </a-form-model-item>
          </a-col>

          <a-col :span='12'>
            <a-form-model-item label='评优建议' :labelCol='labelCol' :wrapperCol='wrapperCol'>
              <!--              <span class='info' v-show='model.canExcellent === false'>不能评优</span>-->
              <!--              <span class='info' v-show='model.canExcellent !== false'>可以评优</span>-->
              <!--              <span class='info' v-show='model.disciplineRecommend'>已被纪检组推优</span>-->

              <a-select v-model='model.canExcellent' placeholder='请输入不能评优情况汇总'>
                <a-select-option :value='true'>可以评优</a-select-option>
                <a-select-option :value='false'>不能评优</a-select-option>
              </a-select>

            </a-form-model-item>
          </a-col>

          <a-col :span='12'>
            <a-form-model-item label='不能评优情况汇总' :labelCol='labelCol' :wrapperCol='wrapperCol'>
              <a-textarea :auto-size='{ minRows: 5, maxRows: 5 }' v-model='model.remark'
                          placeholder='请输入不能评优情况汇总'></a-textarea>
            </a-form-model-item>
          </a-col>
          <a-col :span='12'>
            <a-form-model-item label='参考信息' :labelCol='labelCol' :wrapperCol='wrapperCol'>
              <a-textarea :auto-size='{ minRows: 5, maxRows: 5 }' v-model='model.negativeList'
                          placeholder='请输入参考信息'></a-textarea>
            </a-form-model-item>
          </a-col>

          <a-col :span='12'>
            <a-form-model-item :label='model.recommendType === "bureau" ? "考核单元内民主测评排名" : "民主测评排名"'
                               :labelCol='labelCol' :wrapperCol='wrapperCol'>
              <span class='info'>{{ model.democraticRanking }}</span>
            </a-form-model-item>
          </a-col>

          <a-col :span='12'>
            <a-form-model-item label='连续两年评为优秀' :labelCol='labelCol' :wrapperCol='wrapperCol'>
              <span class='info'>{{ model.twoYear }}</span>
            </a-form-model-item>
          </a-col>

          <a-col v-show='model.recommendType !== "bureau" && model.recommendType !== "group"' :span='12'>
            <a-form-model-item label='所在单位推荐情况' :labelCol='labelCol' :wrapperCol='wrapperCol'>
              <span class='info'>{{ model.excellentDeputy }}</span>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

import { putAction } from '@/api/manage'
import TDictSelectTag from '@/component/TDictSelectTag.vue'
import TCategorySelect from '@/component/TCategorySelect.vue'

export default {
  name: 'AssessLeaderRecItemForm',
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
      url: {
        add: '/assess/leader/rec/add',
        edit: '/assess/leader/rec/edit',
        queryById: '/assess/leader/rec/queryById'
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
      let obj = this.model
      putAction(this.url.edit, obj).then((res) => {
        if (res.success) {
          // that.$message.success(res.message)
          this.$success({
            title: '消息提示',
            content: h => <div style='color:red;font-size:18px'>{res.message}</div>
          })
          that.$emit('ok')
        } else {
          // that.$message.warning(res.message)
          this.$error({
            title: '消息提示',
            content: h => <div style='color:red;font-size:18px'>{res.message}</div>
          })
        }
      }).finally(() => {
        that.confirmLoading = false
      })

    }
  }

}
</script>
<style lang='less' scoped>
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

.info {
  font-size: 18px;
  font-weight: bold;
}
</style>