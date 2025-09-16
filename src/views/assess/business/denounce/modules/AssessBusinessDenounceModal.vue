<template>
  <t-modal
    :title="title"
    :width="width"
    :visible="visible"
    @ok="handleOk"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
    :simple-submit="true"
    cancelText="关闭">
    <assess-business-denounce-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit"></assess-business-denounce-form>
  </t-modal>
</template>

<script>
import TModal from '@/component/TModal'
import AssessBusinessDenounceForm from './AssessBusinessDenounceForm.vue'

export default {
    name: 'AssessBusinessDenounceModal',
    components: {
      AssessBusinessDenounceForm,TModal
    },
    data () {
      return {
        title:'新增通报',
        width:1000,
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