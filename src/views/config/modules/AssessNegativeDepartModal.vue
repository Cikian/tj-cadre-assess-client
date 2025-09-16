<template>
  <t-modal
    title="负面清单填写权限"
    :width="width"
    :visible="visible"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
    :simple-submit="true"
    cancelText="关闭">
    <assess-negative-depart-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit"></assess-negative-depart-form>
  </t-modal>
</template>

<script>

import AssessNegativeDepartForm from './AssessNegativeDepartForm'
import TModal from '@/component/TModal.vue'

export default {
    name: 'AssessNegativeDepartModal',
    components: {
      TModal,
      AssessNegativeDepartForm
    },
    data () {
      return {
        title:'负面清单填写权限',
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