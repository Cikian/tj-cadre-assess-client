<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
    cancelText="关闭">
    <assess-annual-summary-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit"></assess-annual-summary-form>
  </j-modal>
</template>

<script>

import AssessAnnualSummaryForm from './AssessAnnualSummaryForm.vue'

export default {
    name: 'AssessAnnualSummaryModal',
    components: {
      AssessAnnualSummaryForm
    },
    props: {
      formDisable: {
        required: false,
        type: Boolean,
        default: false
      },
    },
    data () {
      return {
        title:'',
        width:896,
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
      edit (record, formDisable) {
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.edit(record, formDisable);
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