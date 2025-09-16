<template>
  <t-modal
    :title="title"
    :width="width"
    :visible="visible"
    :simple-submit="true"
    @ok="handleOk"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
    cancelText="关闭">
    <assess-regular-result-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit"></assess-regular-result-form>
  </t-modal>
</template>

<script>
import TModal from '@/component/TModal'
  import AssessRegularResultForm from './AssessRegularResultForm'
  export default {
    name: 'AssessRegularResultModal',
    components: {
      AssessRegularResultForm,TModal
    },
    data () {
      return {
        title:'',
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
<style scoped>
  /deep/ .ant-modal-content {
  position: relative;
  background-color: rgb(246, 248, 248);
  background-clip: padding-box;
  border: 0;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  pointer-events: auto;
}

/deep/ .ant-modal-header {
  padding: 16px 24px;
  color: rgba(0, 0, 0, 0.65);
  background: rgb(246, 248, 248);
  border-bottom: 0px solid #e8e8e8;
  border-radius: 4px 4px 0 0;
}

/deep/ .ant-form-horizontal {
  position: relative;
  background-color: white;
  border: 1px solid rgb(234, 235, 234);;
  padding: 10px 0px;
}

/deep/ .ant-modal-footer {
  padding: 10px 16px;
  text-align: right;
  background: transparent;
  border-top: 0px solid #e8e8e8;
  border-radius: 0 0 4px 4px;
}

/deep/ .ant-form-item label {
  position: relative;
  margin-right: 10px;
  font-family: 思源黑体;
  font-size: 16px;
  font-weight: 500;
  color: rgb(9, 24, 52);
  text-align: right;
  margin-right: 10px;
  width: 90px;
  min-width: 90px;

}
</style>