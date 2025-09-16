<template>
  <t-modal
    ref="tmodal"
    :title="title"
    :width="width"
    :visible="visible"
    @ok="handleOk"
    @save="handleSave"
    :auditPass="pass"
    :slots="['footerPrefix']"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    :simple-submit="disableSubmit"
    :is-yw-fill="true"
    @cancel="handleCancel"
    cancelText="关闭">
    <assess-report-fill-form ref="realForm" @changeLoading="changeLoading" @ok="submitCallback"
                             :disabled="disableSubmit"></assess-report-fill-form>
  </t-modal>
</template>

<script>

import AssessReportFillForm from './AssessReportFillForm'
import TModal from '@/component/TModal.vue'

export default {
  name: 'AssessReportFillModal',
  components: {
    TModal,
    AssessReportFillForm
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
    pass() {
      this.$refs.realForm.pass()
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      if (this.disableSubmit){
        this.close()
      } else {
        this.$refs.realForm.submitForm()
      }

    },
    handleSave() {
      this.$refs.realForm.handleSave()
    },
    submitCallback() {
      this.$emit('ok')
      this.visible = false
    },
    handleCancel() {
      this.close()
    },
    changeLoading() {
      this.$refs.tmodal.changeLoading()
    }
  }
}
</script>