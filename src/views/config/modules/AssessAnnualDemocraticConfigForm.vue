<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <div style="display: flex; justify-content: space-between; width: 100%">
          <div style="width: 49%">
            <a-form-model-item label="指标名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 16 }" prop="name">
              <a-input v-model="model.name" placeholder="请输入指标名称" style="width: 100%"></a-input>
            </a-form-model-item>
          </div>

          <div style="width: 49%">
            <a-form-model-item label="测评对象" :labelCol="{ span: 5 }" :wrapperCol="{ span: 16 }" prop="type">
              <j-dict-select-tag
                type="list"
                v-model="model.type"
                dictCode="democratic_type"
                placeholder="请选择测评对象"
                style="width: 100%"
              />
            </a-form-model-item>
          </div>
        </div>
        <div style="display: flex; justify-content:left; width: 100%">
          <div style="width: 26%">
            <a-form-model-item label="A票权重" :labelCol="{ span: 9 }" :wrapperCol="{ span: 10 }" prop="weightA">
              <a-input v-model="model.weightA" style="width: 100%" suffix="%" />
            </a-form-model-item>
          </div>
          <div style="width: 26%">
            <a-form-model-item label="B票权重" :labelCol="{ span: 8 }" :wrapperCol="{ span: 10 }" prop="weightB">
              <a-input v-model="model.weightB" style="width: 100%" suffix="%" />
            </a-form-model-item>
          </div>
          <div style="width: 25%">
            <a-form-model-item label="C票权重" :labelCol="{ span: 8 }" :wrapperCol="{ span: 10 }" prop="weightC">
              <a-input v-model="model.weightC" style="width: 100%" suffix="%" />
            </a-form-model-item>
          </div>
          <!-- <div style="width: 24%">
            <a-form-model-item label="D项权重" :labelCol="{ span: 8 }" :wrapperCol="{ span: 16 }" prop="weightD">
              <a-input v-model="model.weightD" style="width: 100%" suffix="%" />
            </a-form-model-item>
          </div> -->
        </div>
      </a-form-model>
    </j-form-container>
    <!-- 子表单区域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="民主测评指标项" :key="refKeys[0]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[0]"
          :loading="assessAnnualDemocraticItemTable.loading"
          :columns="assessAnnualDemocraticItemTable.columns"
          :dataSource="assessAnnualDemocraticItemTable.dataSource"
          :maxHeight="300"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          :actionButton="true"
        />
      </a-tab-pane>
    </a-tabs>
  </a-spin>
</template>

<script>
import { FormTypes, getRefPromise, VALIDATE_NO_PASSED, validateFormModelAndTables } from '@/utils/JEditableTableUtil'
import { JEditableTableModelMixin } from '@/mixins/JEditableTableModelMixin'

export default {
  name: 'AssessAnnualDemocraticConfigForm',
  mixins: [JEditableTableModelMixin],
  components: {},
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      model: {},
      // 新增时子表默认添加几行空数据
      addDefaultRowNum: 1,
      validatorRules: {
        type: [{ required: true, message: '请输入测评对象!' }],
        name: [{ required: true, message: '请输入指标名称!' }],
        weightA: [
          { required: true, message: '请输入A票权重!' },
          { pattern: /^-?\d+$/, message: '请输入整数!' },
        ],
        weightB: [
          { required: true, message: '请输入B票权重!' },
          { pattern: /^-?\d+$/, message: '请输入整数!' },
        ],
        weightC: [
          { required: true, message: '请输入C票权重!' },
          { pattern: /^-?\d+$/, message: '请输入整数!' },
        ],
        // weightD: [
        //   { required: true, message: '请输入D项权重!' },
        //   { pattern: /^-?\d+$/, message: '请输入整数!' },
        // ],
      },
      refKeys: ['assessAnnualDemocraticItem'],
      tableKeys: ['assessAnnualDemocraticItem'],
      activeKey: 'assessAnnualDemocraticItem',
      // 民主测评指标项
      assessAnnualDemocraticItemTable: {
        loading: false,
        dataSource: [],
        columns: [
          {
            title: '项目名称',
            key: 'itemName',
            type: 'textarea',
            width: '750px',
            placeholder: '请输入${title}',
            defaultValue: '',
            validateRules: [{ required: true, message: '${title}不能为空' }],
          },
          {
            title: '分数',
            key: 'score',
            type: FormTypes.inputNumber,
            width: '150px',
            placeholder: '请输入${title}',
            defaultValue: '',
            validateRules: [{ required: true, message: '${title}不能为空' }],
          },
        ],
      },
      url: {
        add: '/modules/democraticConfig/add',
        edit: '/modules/democraticConfig/edit',
        queryById: '/modules/democraticConfig/queryById',
        assessAnnualDemocraticItem: {
          list: '/modules/democraticConfig/queryAssessAnnualDemocraticItemByMainId',
        },
      },
    }
  },
  props: {
    //表单禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  computed: {
    formDisabled() {
      return this.disabled
    },
  },
  created() {},
  methods: {
    handleOk() {
      /** 触发表单验证 */
      this.getAllTable().then(tables => {
        /** 一次性验证主表和所有的次表 */
        const weightA = Number(this.model.weightA);
        const weightB = Number(this.model.weightB);
        const weightC = Number(this.model.weightC);
        if (weightA + weightB + weightC !== 100) {
          this.$error({
            title: '权重之和必须为100',
            content: '当前权重之和为：' + (weightA + weightB + weightC),
          });
          return Promise.reject(new Error('a + b + c 必须等于 100'));
        }

        return validateFormModelAndTables(this.$refs.form,this.model, tables)

      }).then(allValues => {
        /** 一次性验证一对一的所有子表 */
        const scores = allValues.tablesValue[0].values.map(item => Number(item.score));
        const totalScore = scores.reduce((sum, score) => sum + score, 0);

        if (isNaN(totalScore)) {
          this.$message.error('请输入有效的数值');
          return Promise.reject(new Error('请输入有效的数值'));
        }

        if (totalScore !== 100) {
          this.$error({
            title: '选项总分必须为100',
            content: '当前分数之和为：' + totalScore,
          });
          return Promise.reject(new Error('所有项的 score 必须等于 100'));
        }
        return this.validateSubForm(allValues)
      }).then(allValues => {
        if (typeof this.classifyIntoFormData !== 'function') {
          throw this.throwNotFunction('classifyIntoFormData')
        }
        let formData = this.classifyIntoFormData(allValues)
        // 发起请求
        return this.request(formData)
      }).catch(e => {
        if (e.error === VALIDATE_NO_PASSED) {
          // 如果有未通过表单验证的子表，就自动跳转到它所在的tab
          //update--begin--autor:liusq-----date:20210316------for：未通过表单验证跳转tab问题------
          this.activeKey = e.index == null ? this.activeKey : (e.paneKey?e.paneKey:this.refKeys[e.index])
          //update--end--autor:liusq-----date:20210316------for：未通过表单验证跳转tab问题------
        } else {
          console.error(e)
        }
      })
    },
    addBefore() {
      this.assessAnnualDemocraticItemTable.dataSource = []
    },
    getAllTable() {
      let values = this.tableKeys.map((key) => getRefPromise(this, key))
      return Promise.all(values)
    },
    /** 调用完edit()方法之后会自动调用此方法 */
    editAfter() {
      this.$nextTick(() => {})
      // 加载子表数据
      if (this.model.id) {
        let params = { id: this.model.id }
        this.requestSubTableData(this.url.assessAnnualDemocraticItem.list, params, this.assessAnnualDemocraticItemTable)
      }
    },
    //校验所有一对一子表表单
    validateSubForm(allValues) {
      return new Promise((resolve, reject) => {
        Promise.all([])
          .then(() => {
            resolve(allValues)
          })
          .catch((e) => {
            if (e.error === VALIDATE_NO_PASSED) {
              // 如果有未通过表单验证的子表，就自动跳转到它所在的tab
              this.activeKey = e.index == null ? this.activeKey : this.refKeys[e.index]
            } else {
              console.error(e)
            }
          })
      })
    },
    /** 整理成formData */
    classifyIntoFormData(allValues) {
      let main = Object.assign(this.model, allValues.formValue)
      return {
        ...main, // 展开
        assessAnnualDemocraticItemList: allValues.tablesValue[0].values,
      }
    },
    validateError(msg) {
      this.$message.error(msg)
    },
  },
}
</script>

<style scoped lang="less">
/deep/.ant-form {
  background-color: #ffffff;
  padding: 20px;
}
/deep/.ant-tabs{
  padding: 20px;
  margin-top: 20px;
  background-color: #ffffff;
}
</style>

