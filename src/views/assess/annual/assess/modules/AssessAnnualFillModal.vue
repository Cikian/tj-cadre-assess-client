<template>
  <t-modal
    ref="tmodal"
    :title="title"
    :width="1200"
    :visible="visible"
    :maskClosable="false"
    :switchFullscreen="false"
    :simple-submit="disableSubmit"
    :is-yw-fill="true"
    @ok="handleOk"
    @save="handleSave"
    @auditPass='auditPass'
    :slots="['footerPrefix']"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
  >
    <assess-annual-fill-form
      ref="realForm"
      @changeLoading="changeLoading"
      @ok="submitCallback"
      :disabled="disableSubmit"
    />
  </t-modal>
</template>

<script>
import AssessAnnualFillForm from './AssessAnnualFillForm.vue'
import TModal from '@/component/TModal.vue'

export default {
  name: 'AssessAnnualFillModal',
  components: {
    TModal,
    AssessAnnualFillForm,
  },
  data() {
    return {
      title: '',
      width: 800,
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
        this.$refs.tmodal.toggleFullscreen()
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      this.$refs.realForm.handleOk()
    },
    submitCallback() {
      this.$emit('ok')
      this.visible = false
    },
    handleCancel() {
      this.close()
    },
    handleSave() {
      this.$refs.realForm.handleSave()
    },
    changeLoading() {
      this.$refs.tmodal.changeLoading()
    },
    auditPass() {
      this.$refs.realForm.passAndSubmit()
      this.$refs.tmodal.changeLoading()
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
