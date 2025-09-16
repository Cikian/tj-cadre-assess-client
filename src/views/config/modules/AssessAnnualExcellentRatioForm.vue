<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="领导班子优秀比例" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="groupRatio">
              <a-input-number v-model="model.groupRatio" placeholder="请输入领导班子优秀比例" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="局机关优秀比例" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="bureauRatio">
              <a-input-number v-model="model.bureauRatio" placeholder="请输入局机关优秀比例" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="分局、参公优秀比例" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="basicRatio">
              <a-input-number v-model="model.basicRatio" placeholder="请输入分局、参公优秀比例" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="事业单位优秀比例" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="institutionRatio">
              <a-input-number v-model="model.institutionRatio" placeholder="请输入事业单位优秀比例" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="启用" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="enable">
              <j-switch v-model="model.enable" :options="[1,0]" ></j-switch>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

import { httpAction } from '@/api/manage'

export default {
    name: 'AssessAnnualExcellentRatioForm',
    components: {
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
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        validatorRules: {
           groupRatio: [
              { required: true, message: '请输入领导班子优秀比例!'},
              { pattern: /^-?\d+$/, message: '请输入整数!'},
           ],
           bureauRatio: [
              { required: false},
              { pattern: /^-?\d+$/, message: '请输入整数!'},
           ],
        },
        url: {
          add: "/modules/annual/assessAnnualExcellentRatio/add",
          edit: "/modules/annual/assessAnnualExcellentRatio/edit",
          queryById: "/modules/annual/assessAnnualExcellentRatio/queryById"
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
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
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