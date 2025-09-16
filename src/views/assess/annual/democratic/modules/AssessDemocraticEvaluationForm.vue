<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24" >
            <a-form-model-item label="测评对象" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="appraisee">
              <a-input v-model="model.appraisee" placeholder="请输入测评对象" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="年度" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="currentYear">
              <a-input v-model="model.currentYear" placeholder="请输入年度" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="考核名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="assessName">
              <a-input v-model="model.assessName" placeholder="请输入考核名称" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="单位（处室）" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="depart">
              <j-select-depart v-model="model.depart" :multi="true"  />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="分数" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="score">
              <a-input v-model="model.score" placeholder="请输入分数" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="type">
              <j-dict-select-tag type="list" v-model="model.type" dictCode="democratic_type" placeholder="请选择类型" />
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
        </a-row>
      </a-form-model>
    </j-form-container>
      <!-- 子表单区域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="民主测评项" :key="refKeys[0]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[0]"
          :loading="assessDemocraticEvaluationItemTable.loading"
          :columns="assessDemocraticEvaluationItemTable.columns"
          :dataSource="assessDemocraticEvaluationItemTable.dataSource"
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

import { FormTypes, getRefPromise, VALIDATE_NO_PASSED } from '@/utils/JEditableTableUtil'
import { JEditableTableModelMixin } from '@/mixins/JEditableTableModelMixin'

export default {
    name: 'AssessDemocraticEvaluationForm',
    mixins: [JEditableTableModelMixin],
    components: {
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
        refKeys: ['assessDemocraticEvaluationItem', ],
        tableKeys:['assessDemocraticEvaluationItem', ],
        activeKey: 'assessDemocraticEvaluationItem',
        // 民主测评项
        assessDemocraticEvaluationItemTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '项目',
              key: 'itemName',
              type: FormTypes.input,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '项目分数',
              key: 'itemScore',
              type: FormTypes.inputNumber,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
            {
              title: '得分',
              key: 'score',
              type: FormTypes.inputNumber,
              width:"200px",
              placeholder: '请输入${title}',
              defaultValue:'',
            },
          ]
        },
        url: {
          add: "/modules/annual/democraticEvaluation/add",
          edit: "/modules/annual/democraticEvaluation/edit",
          queryById: "/modules/annual/democraticEvaluation/queryById",
          assessDemocraticEvaluationItem: {
            list: '/modules/annual/democraticEvaluation/queryAssessDemocraticEvaluationItemByMainId'
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
        this.assessDemocraticEvaluationItemTable.dataSource=[]
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
          this.requestSubTableData(this.url.assessDemocraticEvaluationItem.list, params, this.assessDemocraticEvaluationItemTable)
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
          assessDemocraticEvaluationItemList: allValues.tablesValue[0].values,
        }
      },
      validateError(msg){
        // this.$message.error(msg)
        // this.$confirm({
        //     title: '消息提示',

        //     content: h => <div style="color:red;">{msg}</div>,

        //     onOk:()=> {

        //     },

        //     onCancel:()=> {

        //     },



        //   });
        this.$error({
          title: '错误',
          content: msg
        })
      },

    }
  }
</script>

<style scoped>
</style>