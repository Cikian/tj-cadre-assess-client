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
            <a-form-model-item label="现任职务" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="presentPosition">
              <a-input v-model="model.presentPosition" placeholder="请输入现任职务"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="入党时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="joinPartyDate">
              <a-input placeholder="请输入入党时间" v-model="model.joinPartyDate"  style="width: 100%"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="参加工作时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="joinWorkDate">
              <j-date placeholder="请选择参加工作时间" v-model="model.joinWorkDate"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="是否进行谈话推荐" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="talkRecommend">
              <j-switch v-model="model.talkRecommend"  ></j-switch>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="是否进行会议推荐" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="meetRecommend">
              <j-switch v-model="model.meetRecommend"  ></j-switch>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="是否进行考察" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="inspect">
              <j-switch v-model="model.inspect"  ></j-switch>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="是否进行干部人事档案审核" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="fileReview">
              <j-switch v-model="model.fileReview"  ></j-switch>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="是否进行个人有关事项查核" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="personalReview">
              <j-switch v-model="model.personalReview"  ></j-switch>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="是否征求纪检监察机关意见" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="disciplineOpinion">
              <j-switch v-model="model.disciplineOpinion"  ></j-switch>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="是否有不得列为考察对象的情形" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="nonAssessSituation">
              <j-switch v-model="model.nonAssessSituation"  ></j-switch>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="是否经会议集体讨论决定" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="discuss">
              <j-switch v-model="model.discuss"  ></j-switch>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="参会人员是否符合规定要求" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="accord">
              <j-switch v-model="model.accord"  ></j-switch>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="是否进行公示" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="publicity">
              <j-switch v-model="model.publicity"  ></j-switch>
            </a-form-model-item>
          </a-col>
<!--          <a-col :span="24">-->
<!--            <a-form-model-item label="是否有举报反映，有无进行查核" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="expose">-->
<!--              <j-switch v-model="model.expose"></j-switch>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
          <a-col :span="24" >
            <a-form-model-item label="是否有举报反映，有无进行查核" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="expose">
              <j-dict-select-tag type="list" v-model="model.expose"  placeholder="请选择是否有举报反映，有无进行查核" />
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
    name: 'AssessReportObjectInfoForm',
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
          add: "/modules/report/assessReportObjectInfo/add",
          edit: "/modules/report/assessReportObjectInfo/edit",
          queryById: "/modules/report/assessReportObjectInfo/queryById"
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
                content: res.message,

              })
                that.$emit('ok');
              }else{
                // that.$message.warning(res.message);
              //   this.$confirm({
              //   title: '消息提示',
              //   content: h => <div style='color:red;'>{res.message}</div>,
              //   onOk: () => {
              //     console.log('OK')
              //   },
              //   onCancel: () => {
              //     console.log('Cancel')
              //   }
              // })
              this.$error({
                title: '错误',
                content: res.message})
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