<template>
  <t-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
    cancelText="关闭">
    <assess-annual-negative-list-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit" :skip-audit='skipAudit'></assess-annual-negative-list-form>
  </t-modal>
</template>

<script>

import AssessAnnualNegativeListForm from './AssessAnnualNegativeListForm.vue'
import TModal from '@/component/TModal.vue'

export default {
    name: 'AssessAnnualNegativeListModal',
    components: {
      TModal,
      AssessAnnualNegativeListForm
    },
    data () {
      return {
        title:'',
        width:800,
        visible: false,
        disableSubmit: false,
        skipAudit: false
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