<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="name">
              <a-input v-model="model.name" placeholder="请输入姓名" disabled ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="性别" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sex">
              <j-dict-select-tag type="list" v-model="model.sex" dictCode="sex" placeholder="请选择性别" disabled/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="电话" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="phone">
              <a-input v-model="model.phone" placeholder="请输入电话" disabled ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="职务职级" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="post">
              <j-dict-select-tag type="list" v-model="model.post" dictCode="sys_position,name,code" placeholder="请选择职务职级" disabled/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="是否局领导考核" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="isLeader">
              <j-dict-select-tag type="list" v-model="model.isLeader" dictCode="yn" placeholder="是否局领导考核" disabled/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="所在处室" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="departmentCode">
              <j-select-depart v-model="model.departmentCode" :multi="true" disabled />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="年度" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="currentYear">
              <t-dict-select-tag type="list" v-model="model.currentYear" dictCode="assess_year" placeholder="请选择年度" disabled/>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="第一季度" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="quarter1">
              <j-dict-select-tag type="list" v-model="model.quarter1" dictCode="regular_assess_level" placeholder="请选择第一季度" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="第二季度" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="quarter2">
              <j-dict-select-tag type="list" v-model="model.quarter2" dictCode="regular_assess_level" placeholder="请选择第二季度" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="第三季度" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="quarter3">
              <j-dict-select-tag type="list" v-model="model.quarter3" dictCode="regular_assess_level" placeholder="请选择第三季度" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="第四季度" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="quarter4">
              <j-dict-select-tag type="list" v-model="model.quarter4" dictCode="regular_assess_level" placeholder="请选择第四季度" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="note">
              <a-input v-model="model.note" placeholder="请输入备注"  ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

import { httpAction } from '@/api/manage'
import TDictSelectTag from '@/component/TDictSelectTag.vue'

export default {
    name: 'AssessRegularResultForm',
    components: {
      TDictSelectTag
    },
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    data () {
      return {
        model:{
         },
        labelCol: {
          xs: { span: 26 },
          sm: { span: 7 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        validatorRules: {
           name: [
              { required: true, message: '请输入姓名!'},
           ],
           departmentCode: [
              { required: true, message: '请输入所在处室!'},
           ],
           currentYear: [
              { required: true, message: '请输入年度!'},
           ],
        },
        url: {
          add: "/regular/result/add",
          edit: "/regular/result/edit",
          queryById: "/regular/result/queryById"
        }
      }
    },
    computed: {
      formDisabled(){
        return this.disabled
      },
    },
    created () {
       //备份model原始值
      this.modelDefault = JSON.parse(JSON.stringify(this.model));
    },
    methods: {
      add () {
        this.edit(this.modelDefault);
      },
      edit (record) {
        this.model = Object.assign({}, record);
        this.visible = true;
      },
      submitForm () {
        const that = this;
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            httpAction(httpurl,this.model,method).then((res)=>{
              if(res.success){
                // that.$message.success(res.message);
              //   this.$confirm({
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
                that.$emit('ok');
              }else{
                // that.$message.warning(res.message);
              //   this.$confirm({
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
              that.confirmLoading = false;
            })
          }

        })
      },
    }
  }
</script>