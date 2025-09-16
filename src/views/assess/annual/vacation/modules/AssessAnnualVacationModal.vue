<template>
  <t-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
    @cancel="handleCancel"
    :simple-submit="true"
    cancelText="关闭"
  >
    <assess-annual-vacation-form
      ref="realForm"
      @ok="submitCallback"
      :disabled="disableSubmit"
    ></assess-annual-vacation-form>
  </t-modal>
</template>

<script>
import TModal from '@/component/TModal.vue'
import AssessAnnualVacationForm from './AssessAnnualVacationForm'

export default {
  name: 'AssessAnnualVacationModal',
  components: {
    AssessAnnualVacationForm,
    TModal,
  },
  data() {
    return {
      title: '',
      width: 1300,
      visible: false,
      disableSubmit: false,
    }
  },
  methods: {
    add() {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.realForm.add()
      })
    },
    edit(record) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.realForm.edit(record)
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      this.$refs.realForm.submitForm()
    },
    submitCallback() {
      this.$emit('ok')
      this.visible = false
    },
    handleCancel() {
      this.close()
    },
  },
}
</script>
<style lang="less" scoped>
/deep/.ant-modal-body {
  background-color: #f6f8f8;
  padding: 16px;
}
</style>

