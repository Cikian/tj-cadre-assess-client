<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
<!--          <a-col :span="24">-->
<!--            <a-form-model-item label="年度" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="currentYear">-->
<!--              <j-dict-select-tag type="list" v-model="model.currentYear" dictCode="assess_year" placeholder="请选择年度" />-->
<!--              {{model.currentYear}}-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
          <a-col v-has="'gbc:admin'" :span="24">
            <a-form-model-item label="被通报处室（单位）" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="departmentCode">
              <j-select-depart placeholder="请选择处室（单位）" v-model="model.departmentCode" />
<!--              {{model.departmentCode}}-->
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="通报单位" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="denounceUnit">
              <a-input v-model="model.denounceUnit" placeholder="请输入通报单位"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="通报项目" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="denounceProject">
              <a-input v-model="model.denounceProject" placeholder="请输入通报项目"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="通报时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="denounceTime">
              <j-date placeholder="请选择通报时间" v-model="model.denounceTime"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="填报人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="reportBy">
              <j-select-user-by-dep v-model="model.reportBy" :multi="true" store="id" text="realname" disabled/>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="证明材料" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="proof">
              <j-upload :biz-path='"/business/denounce"' v-model="model.proof"></j-upload>
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
    name: 'AssessBusinessDenounceForm',
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
           currentYear: [
              { required: true, message: '请输入年度!'},
           ],
           departmentCode: [
              { required: true, message: '请输入处室（单位）!'},
           ],
           denounceUnit: [
              { required: true, message: '请输入通报单位!'},
           ],
           denounceProject: [
              { required: true, message: '请输入通报项目!'},
           ],
           denounceTime: [
              { required: true, message: '请输入通报时间!'},
           ],
           reportBy: [
              { required: true, message: '请输入填报人!'},
           ],
        },
        url: {
          add: "/modules/assessBusinessDenounce/add",
          edit: "/modules/assessBusinessDenounce/edit",
          queryById: "/modules/assessBusinessDenounce/queryById"
        },
        currentDepart: {
          id: '',
          name: ''
        },
        currentAssess: {}
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
      add () {
        this.edit(this.modelDefault);

        this.model.reportBy = this.$store.getters.userInfo.id;
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
          //       this.$confirm({
          //   title: '消息提示',

          //   content: h => <div style="color:red;">{res.message}</div>,

          //   onOk:()=> {

          //   },

          //   onCancel:()=> {

          //   },



          // });
                this.$success({
                  title: '成功',
                  content: res.message
                })
                that.$emit('ok');
              }else{
                // that.$message.warning(res.message);
          //       this.$confirm({
          //   title: '消息提示',

          //   content: h => <div style="color:red;">{res.message}</div>,

          //   onOk:()=> {

          //   },

          //   onCancel:()=> {

          //   },



          // });
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
</style>