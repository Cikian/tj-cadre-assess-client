<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24" >
            <a-form-model-item label="填报id" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="reportFillId">
              <a-input v-model="model.reportFillId" placeholder="请输入填报id" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="年度" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="currentYear">
              <t-dict-select-tag type="list" v-model="model.currentYear" dictCode="assess_year" placeholder="请选择年度" disabled/>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="测评名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="assessName">
              <a-input v-model="model.assessName" placeholder="请输入测评名称" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="单位" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="depart">
              <j-select-depart v-model="model.depart" :multi="true" disabled />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="开始时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="startDate">
              <j-date placeholder="请选择开始时间" v-model="model.startDate" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="结束时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="endDate">
              <j-date placeholder="请选择结束时间" v-model="model.endDate" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="测评人数" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="num">
              <a-input-number v-model="model.num" placeholder="请输入测评人数" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="已完成数量" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="filledNum">
              <a-input-number v-model="model.filledNum" placeholder="请输入已完成数量" style="width: 100%" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
      <!-- 子表单区域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="一报告两评议民主测评项" :key="refKeys[0]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[0]"
          :loading="assessReportEvaluationItemTable.loading"
          :columns="assessReportEvaluationItemTable.columns"
          :dataSource="assessReportEvaluationItemTable.dataSource"
          :maxHeight="300"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          :actionButton="true"/>
      </a-tab-pane>
    </a-tabs>
  </a-spin>
</template>

<script>

  import { getAction } from '@/api/manage'
  import { FormTypes,getRefPromise,VALIDATE_NO_PASSED } from '@/utils/JEditableTableUtil'
  import { JEditableTableModelMixin } from '@/mixins/JEditableTableModelMixin'
  import { validateDuplicateValue } from '@/utils/util'
  import TDictSelectTag from '@/component/TDictSelectTag.vue'

  export default {
    name: 'AssessReportEvaluationSummaryForm',
    mixins: [JEditableTableModelMixin],
    components: {
      TDictSelectTag
    },
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
        model:{
        },
        // 新增时子表默认添加几行空数据
        addDefaultRowNum: 1,
        validatorRules: {
        },
        refKeys: ['assessReportEvaluationItem', ],
        tableKeys:['assessReportEvaluationItem', ],
        activeKey: 'assessReportEvaluationItem',
        // 一报告两评议民主测评项
        assessReportEvaluationItemTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '测评项描述',
              key: 'topic',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '输入类型',
              key: 'inputType',
              type: FormTypes.select,
              dictCode:"report_democracy_type",
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
            {
              title: '填写',
              key: 'fill',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能为空' }],
            },
          ]
        },
        url: {
          add: "/modules/report/reportDemocratic/add",
          edit: "/modules/report/reportDemocratic/edit",
          queryById: "/modules/report/reportDemocratic/queryById",
          assessReportEvaluationItem: {
            list: '/modules/report/reportDemocratic/queryAssessReportEvaluationItemByMainId'
          },
        }
      }
    },
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    computed: {
      formDisabled(){
        return this.disabled
      },
    },
    created () {
    },
    methods: {
      addBefore(){
        this.assessReportEvaluationItemTable.dataSource=[]
      },
      getAllTable() {
        let values = this.tableKeys.map(key => getRefPromise(this, key))
        return Promise.all(values)
      },
      /** 调用完edit()方法之后会自动调用此方法 */
      editAfter() {
        this.$nextTick(() => {
        })
        // 加载子表数据
        if (this.model.id) {
          let params = { id: this.model.id }
          this.requestSubTableData(this.url.assessReportEvaluationItem.list, params, this.assessReportEvaluationItemTable)
        }
      },
      //校验所有一对一子表表单
      validateSubForm(allValues){
          return new Promise((resolve,reject)=>{
            Promise.all([
            ]).then(() => {
              resolve(allValues)
            }).catch(e => {
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
          assessReportEvaluationItemList: allValues.tablesValue[0].values,
        }
      },
      validateError(msg){
        // this.$message.error(msg)
        // this.$confirm({
        //         title: '消息提示',
        //         content: h => <div style='color:red;'>{msg}</div>,
        //         onOk: () => {
        //         },
        //         onCancel: () => {
        //         }
        //       })
        this.$error({
          title: '错误',
          content: msg,
        })
      },

    }
  }
</script>

<style scoped>
</style>