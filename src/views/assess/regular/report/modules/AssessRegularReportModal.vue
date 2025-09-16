<template>
  <t-modal
    title="平时考核成绩填报"
    :width="1200"
    :visible="visible"
    :maskClosable="false"
    @ok="handleOk"
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
    @cancel="handleCancel"
  >
    <assess-regular-report-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit" />

    <template slot="footer">
      <a-button v-if="!disableSubmit" type="primary" @click="handleSave">保存</a-button>
      <a-button v-if="!disableSubmit" type="primary" v-has="'depart:report'" @click="handleSubmit">提交</a-button>
      <a-button type="primary" @click="handleCancel">关闭</a-button>
    </template>
  </t-modal>
</template>

<script>
import AssessRegularReportForm from './AssessRegularReportForm'
import TModal from '@/component/TModal'

export default {
  name: 'AssessRegularReportModal',
  components: {
    AssessRegularReportForm,
    TModal,
  },
  data() {
    return {
      title: '',
      width: 800,
      visible: false,
      disableSubmit: false,
    }
  },
  created() {},
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
    handleSave() {
      this.$refs.realForm.handleOk()
    },
    handleSubmit() {
      this.$refs.realForm.handleSubmit()
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
  border: 1px solid rgb(234, 235, 234);
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
