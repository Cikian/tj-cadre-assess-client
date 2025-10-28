<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="试用期人员" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="people">
              <a-select
                show-search
                :value="model.people"
                placeholder="请输入姓名"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @focus='handleSearch'
                @search="handleSearch"
                @change="handleChange"
                option-label-prop="label"
                style='white-space: pre'
              >
                <a-select-option v-for="d in searchData" :key="d.value" :lable='d.label'>
                  {{ d.text }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>

        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

import { httpAction } from '@/api/manage'
import { searchUser } from '@/api/assessApis'
import moment from 'moment/moment'
import TSelectUserByDep from '@/component/TSelectUserByDep.vue'

export default {
    name: 'TrialPeopleConfigForm',
    components: {
      TSelectUserByDep
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
        value: undefined,
        searchData: [],
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
          add: "/assess/annual/trialPeopleConfig/add",
          edit: "/assess/annual/trialPeopleConfig/edit",
          queryById: "/assess/annual/trialPeopleConfig/queryById"
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

      handleSearch(value) {
        // fetch(value, data => (this.searchData = data));
        searchUser(value).then(res => {
          if (res.success && res.result.length > 0) {
            this.searchData = res.result
          } else {
            this.model.people = ''
          }
        })
      },
      handleChange(value) {
        this.model.people = value.split('@')[0];
        this.model.hashId = value;
        // fetch(value, data => (this.searchData = data));
        searchUser(value).then(res => {
          if (res.success && res.result.length > 0) {
            this.searchData = res.result
            let sex = this.searchData[0].value.split('@')[1]
            this.model.sex = sex

            this.model.birth = moment(this.searchData[0].value.split('@')[2], 'YYYYMMDD')
          } else {
            this.model.people = value
            this.model.sex = ''
            this.model.birth = undefined
          }
        })
      },
    }
  }
</script>