<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
            <a-form-model-item label="优秀比例" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="excellent">
              <a-input-number v-model="model.excellent" placeholder="请输入优秀比例" style="width: 50%" @change="inputChange" /> %
            </a-form-model-item>
            <a-form-model-item label="良好比例" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="fine">
              <a-input-number v-model="model.fine" placeholder="请输入良好比例" style="width: 50%" @change="inputChange" /> %
            </a-form-model-item>
            <a-form-model-item label="一般比例" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="common">
              <a-input-number v-model="model.common" placeholder="请输入一般比例" style="width: 50%" @change="inputChange" /> %
            </a-form-model-item>
<!--            <a-form-model-item label="启用" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="enable">-->
<!--              <a-switch v-model="model.enable" @change="onChange" />-->
<!--            </a-form-model-item>-->
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

import { httpAction } from '@/api/manage'

export default {
    name: 'AssessBusinessLevelRatioForm',
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
           excellent: [
              { required: true, message: '请输入优秀比例!'},
              { pattern: /^-?\d+$/, message: '请输入整数!'},
           ],
           fine: [
              { required: true, message: '请输入良好比例!'},
              { pattern: /^-?\d+$/, message: '请输入整数!'},
           ],
           common: [
              { required: true, message: '请输入一般比例!'},
              { pattern: /^-?\d+$/, message: '请输入整数!'},
           ],
        },
        url: {
          add: "/modules/business/assessBusinessLevelRatio/add",
          edit: "/modules/business/assessBusinessLevelRatio/edit",
          queryById: "/modules/business/assessBusinessLevelRatio/queryById"
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
      onChange(checked){
      },
      inputChange(){
      }
    }
  }
</script>