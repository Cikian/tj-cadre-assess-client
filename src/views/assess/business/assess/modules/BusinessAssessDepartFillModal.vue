<template>
  <t-modal
    ref='tjmodal'
    :title='title'
    :width='width'
    :max-he='width'
    :visible='visible'
    :maskClosable='false'
    :simple-submit="disableSubmit"
    :is-yw-fill="true"
    fullscreen
    @ok='handleOk'
    @save='handleSave'
    @auditPass='auditPass'
    @rejectedAudit='rejectedAudit()'
    :slots="['footerPrefix']"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel='handleCancel'>
    <business-assess-depart-fill-form @changeLoading='changeLoading' ref='realForm' @ok='submitCallback'  />
  </t-modal>
</template>

<script>

import BusinessAssessDepartFillForm from './BusinessAssessDepartFillForm'
import TModal from '@/component/TModal'
import type from '@views/exception/type'

export default {
  name: 'BusinessAssessDepartFillModal',
  computed: {
    type() {
      return type
    }
  },
  components: {
    TModal,
    BusinessAssessDepartFillForm
  },
  data() {
    return {
      title: '',
      width: 1200,
      visible: false,
      disableSubmit: false,
      assessData: {}
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
      this.assessData = record
      this.$nextTick(() => {
        this.$refs.realForm.edit(record)
        this.$refs.realForm.disabled=this.disableSubmit
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      this.$refs.realForm.beforeHandleOk()
    },
    handleSave() {
      this.$refs.realForm.handleSave()
    },
    submitCallback() {
      this.$emit('ok')
      this.visible = false
    },
    auditPass() {
      this.$refs.realForm.passAndSubmit()
      this.$refs.tjmodal.changeLoading()
    },
    changeLoading() {
      this.$refs.tjmodal.changeLoading()
    },
    rejectedAudit() {
      this.$emit('rejectedAudit', this.assessData.id)
    },
    handleCancel() {
      this.close()
    }
  }
}
</script>

<style lang='less' scoped>
</style>