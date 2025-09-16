<template>
  <t-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
    :simple-submit='true'
    cancelText="关闭">
    <assess-leader-config-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit"></assess-leader-config-form>
  </t-modal>
</template>

<script>

import AssessLeaderConfigForm from './AssessLeaderConfigForm'
import TModal from '@/component/TModal.vue'

export default {
    name: 'AssessLeaderConfigModal',
    components: {
      TModal,
      AssessLeaderConfigForm
    },
    data () {
      return {
        title:'',
        width:800,
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