<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="name">
              <j-select-user-by-dep v-model="model.name" :multi="true" store="id" text="realname" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="出生年月" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="birthday">
              <j-date placeholder="请选择出生年月" v-model="model.birthday"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="原任职务及任职时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="originalPosition">
              <a-textarea v-model="model.originalPosition" rows="4" placeholder="请输入原任职务及任职时间" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="现任职务及任职时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="currentPosition">
              <a-textarea v-model="model.currentPosition" rows="4" placeholder="请输入现任职务及任职时间" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'

  export default {
    name: 'AssessReportNewLeaderForm',
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
        },
        url: {
          add: "/modules/report/assessReportNewLeader/add",
          edit: "/modules/report/assessReportNewLeader/edit",
          queryById: "/modules/report/assessReportNewLeader/queryById"
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