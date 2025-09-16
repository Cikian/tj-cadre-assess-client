<template>
  <grade-model
    :title="title"
    :width="width"
    :visible="visible"
    fullscreen
    @ok="handleOk"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
    cancelText="关闭">
    <assess-business-grade-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit"></assess-business-grade-form>
  </grade-model>
</template>

<script>

import AssessBusinessGradeForm from './AssessBusinessGradeForm.vue'
import GradeModel from '@/component/GradeModel.vue'

export default {
    name: 'AssessBusinessGradeModal',
    components: {
      AssessBusinessGradeForm,
      GradeModel
    },
    data () {
      return {
        title:'',
        width:1200,
        visible: false,
        disableSubmit: false
      }
    },
    methods: {
      add () {
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.add();
        })
      },
      edit (record) {
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.edit(record);
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        this.$refs.realForm.submitForm();
      },
      submitCallback(){
        this.$emit('ok');
        this.visible = false;
      },
      handleCancel () {
        this.close()
      }
    }
  }
</script>