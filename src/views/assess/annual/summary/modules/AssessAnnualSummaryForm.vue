<template>
  <a-spin :spinning="confirmLoading">
    <tj-title value="基本信息" />
    <br />
    <table class="msgtable">
      <tr>
        <td>姓名：</td>
        <td v-if='model.type'>{{ model.person }}</td>
        <td v-else>{{ model.depart_dictText }}—领导班子</td>
        <td>处室（单位）：</td>
        <td>{{ model.depart_dictText }}</td>
      </tr>
      <tr>
        <td v-if='model.type'>职务职级：</td>
        <td v-if='model.type'>{{ model.position }}</td>
        <td>年度：</td>
        <td>{{ model.currentYear }}</td>
      </tr>
      <tr>
        <td>民主测评结果：</td>
        <td><span v-if='democraticEvaluation.ranking'>第{{ democraticEvaluation.ranking }}名（ <span v-if='democraticEvaluation.score'>{{ democraticEvaluation.score }}分</span> ）</span> </td>
        <td>考核等次：</td>
        <td>
          <a-select :disabled="changeDisable" v-model="model.level" style="width: 120px">
            <a-select-option v-for="(item, i) in annualLevelDict" :key="i" :value="item.value" :label="item.text">
              {{ item.text }}
            </a-select-option>
          </a-select>
        </td>
      </tr>
    </table>
    <br />
    <tj-title value="考核小组评测" />
    <br />
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <div class="row-box">
          <div class="row">
            <div v-if='model.type' style="width: 30%" class="row-item" v-show="model.type !== 'group'">
              <div style=" display: inline-block;align-items: center;font-weight: bold;font-size: 15px;">
                <span>党组织书记考核：</span>
              </div>
              <div style="display: inline-block;width: 20%;">
                <span style="font-weight: bold; color: red"> {{ model.partyAssess === 'Y' ? '好' : '' }} </span>
              </div>
            </div>

            <div style="width: 70%" class="row-item">
              <div style=" display: inline-block;align-items: center;font-weight: bold;font-size: 15px;">
                <span>业务工作考核结果：</span>
              </div>
              <div class="row-content">
                <span v-if='businessGrade.level'>
                  {{ businessGrade.level === '1' ? '优秀' : businessGrade.level === '2' ? '良好' : '一般' }}
                </span>
              </div>
            </div>
          </div>

          <div class="row" style="height: 30px" v-show="model.type !== 'group'">
            <div class="row-item">
              <div class="row-label">
                <span>不能评优情况汇总：</span>
              </div>
            </div>
          </div>

          <div style="width: 100%; padding: 0 20px" v-show="model.type !== 'group'">
            <a-textarea
              :disabled="changeDisable"
              style="width: 100%; margin-top: 10px; margin-bottom: 15px"
              v-model="model.remark"
              readOnly
              rows="4"
              placeholder=""
            />
          </div>

          <div v-if='model.type' class="row" style="margin-top: 20px" v-show="model.type !== 'group'">
            <div class="row-item">
              <div class="row-label">
                <span>是否连续两年评为优秀：</span>
              </div>
              <div class="row-content">
                <!--                <j-switch :disabled='changeDisable' v-model='model.thirdClass'></j-switch>-->
                <a-radio-group v-model="model.thirdClass">
                  <a-radio :disabled="model.thirdClass !== 'Y'" :value="'Y'">是</a-radio>
                  <a-radio disabled :value="'N'">否</a-radio>
                </a-radio-group>
              </div>
            </div>
          </div>

          <div class="row" v-show="model.type">
            <div class="row-item">
              <div class="row-label">
                <span>纪检推荐结果：</span>
              </div>
              <div class="row-content">
                <!--                <j-switch disabled v-model='model.disciplineRecommend'></j-switch>-->
                <a-radio-group v-model="model.disciplineRecommend">
                  <a-radio :disabled="model.disciplineRecommend !== 'Y'" :value="'Y'">是</a-radio>
                  <a-radio disabled :value="'N'">否</a-radio>
                </a-radio-group>
              </div>
            </div>
          </div>
        </div>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>
import { httpAction } from '@/api/manage'
import { getAnnualDemocraticGradeByAnnualId, getBusinessGradeByDepartId, getDictItems } from '@/api/assessApis'
import TjTitle from '@/component/TjTitle.vue'

export default {
  name: 'AssessAnnualSummaryForm',
  components: {
    TjTitle
  },
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
      validatorRules: {},
      url: {
        add: '/modules/assessAnnualSummary/add',
        edit: '/modules/assessAnnualSummary/edit',
        queryById: '/modules/assessAnnualSummary/queryById'
      },
      businessGrade: {},
      democraticEvaluation: {},
      partyAssessDict: [],
      businessAssessLevelDict: [],
      annualLevelDict: [],
      changeDisable: false,
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
    edit(record, formDisable) {
      this.model = Object.assign({}, record)
      this.visible = true
      this.changeDisable = formDisable

      // 获取业务工作测评成绩以及民主测评成绩
      getBusinessGradeByDepartId(this.model.depart, this.model.currentYear).then((res) => {
        if (res.success && res.result.records.length > 0) {
          this.businessGrade = res.result.records[0]
        } else {
          this.businessGrade = {level: ''}
        }
      })
      // 获取民主测评成绩
      getAnnualDemocraticGradeByAnnualId(this.model.id).then((res) => {
        if (res.success && res.result.records.length > 0) {
          this.democraticEvaluation = res.result.records[0]
        }else {
          this.democraticEvaluation = {ranking: '', score: ''}
        }
      })
      // 获取字典数据
      getDictItems('party_assess').then((res) => {
        if (res.success) {
          this.partyAssessDict = res.result
        }
      })

      getDictItems('assess_level').then((res) => {
        if (res.success) {
          this.businessAssessLevelDict = res.result
        }
      })

      this.getAnnualLevelItems(this.model.identityType)
    },

    getAnnualLevelItems(type){
      switch (type){
        case '公务员':
          this.annualLevelDict = [
            { value: '1', text: '优秀' },
            { value: '2', text: '称职' },
            { value: '3', text: '基本称职' },
            { value: '4', text: '不称职' },
            { value: '5', text: '不确定等次' },
          ]
          break
        case '参公':
          this.annualLevelDict = [
            { value: '1', text: '优秀' },
            { value: '2', text: '称职' },
            { value: '3', text: '基本称职' },
            { value: '4', text: '不称职' },
            { value: '5', text: '不确定等次' },
          ]
          break
        case '事业':
          this.annualLevelDict = [
            { value: '1', text: '优秀' },
            { value: '2', text: '合格' },
            { value: '3', text: '基本合格' },
            { value: '4', text: '不合格' },
            { value: '5', text: '不确定等次' },
          ]
          break
        default:
          this.annualLevelDict = [
            { value: '1', text: '优秀' },
            { value: '2', text: '良好' },
            { value: '3', text: '一般' },
            { value: '4', text: '较差' },
            { value: '5', text: '不确定等次' },
          ]
      }
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
                // that.$message.success(res.message)
                // this.$confirm({
                //   title: '消息提示',

                //   content: (h) => <div style="color:red;">{res.message}</div>,

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
                // that.$message.warning(res.message)
                // this.$confirm({
                //   title: '消息提示',

                //   content: (h) => <div style="color:red;">{res.message}</div>,

                //   onOk: () => {
                //   },

                //   onCancel: () => {
                //   }
                // })
                this.$warning({
                  title: res.message,
                  content: res.message
                })
              }
            })
            .finally(() => {
              that.confirmLoading = false
            })
        }
      })
    },
    // 只保留字符串中“-”后面的内容
    getStrAfterSymbol(text) {
      if (text) {
        let index = text.lastIndexOf('-')
        return text.substring(index + 1)
      }
    },

  },
  watch: {
    model: {
      handler(newvalue, oldvalue) {
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.label .ant-descriptions-item-colon {
  width: 150px;
}

.row-box {
  width: 100%;
}

.row {
  display: flex;
  height: 66px;
  align-items: center;
  width: 100%;
  padding: 0 10px;
  justify-content: left;
}

.row-item {
  display: flex;
  width: 50%;
  height: 100%;
  align-items: center;
  padding: 0 10px;
}

.row-label {
  display: inline-block;
  align-items: center;
  width: 50%;
  font-weight: bold;
  font-size: 15px;
}

.row-content {
  display: inline-block;
  max-width: 80%;
  min-width: 50%;
}

.msgtable {
  margin: 0 auto;
  width: 95%;
  height: 121px;
  font-size: 16px;
  font-weight: 500;
  color: #091834;

  tr {
    td {
      padding-left: 30px;
      border: 1px solid #ccd4d7;
      border-collapse: collapse; /* 移除单元格之间的间隔 */
    }

    td:nth-child(1),
    td:nth-child(3) {
      //width: 200px;
      background-color: #f4f8fa;
      color: #25477c;
    }

    td:nth-child(2),
    td:nth-child(4) {
      //width: 300px;
    }
  }
}
</style>
