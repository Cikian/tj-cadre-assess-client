<template>
  <t-modal
    title="按单位查询"
    :width="width"
    :visible="visible"
    :simple-submit="true"
    @ok="handleOk"
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="loading">
      <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="年度">
          <j-dict-select-tag
            placeholder="请选择年度"
            v-model="queryParam.currentYear"
            dictCode="assess_year"
          />
        </a-form-model-item>
        <a-form-item label="单位（处室）">
          <j-select-depart placeholder="请选择单位（处室）" v-model="queryParam.departId" :multi="true"/>
        </a-form-item>
      </a-form-model>
    </a-spin>
  </t-modal>
</template>

<script>
import GradeModel from '@/component/GradeModel.vue'
import TModal from '@/component/TModal.vue'
import { axios } from '@/utils/assessReq'
import {getAction} from '@/api/manage'

export default {
  name: 'SearchByDepartsModal',
  components: {
    TModal,
    GradeModel,
  },
  data() {
    return {
      width: 800,
      visible: false,
      downModalVisible: false,
      disableSubmit: false,
      url: {
        searchByDeparts: '/modules/assessBusinessGrade/searchByDeparts',
      },
      loading: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
      form: {
        type: '', // 修改为选择类型
      },
      yearDict: [],
      departTypeDict: [],
      queryParam:{

      }
    }
  },
  methods: {
    add() {
      this.visible = true
      this.loading = true
      this.$nextTick(() => {})
    },
    async initData(year) {
      this.queryParam = {}
      this.queryParam.currentYear = year;
      this.visible = true
      this.$nextTick(async () => {
        // 此处的 yearDict 似乎不再需要，可以根据需要移除
        this.loading = false
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      this.$emit('ok',this.queryParam)
    },

    downdetails(type) {

    },

    handleCancel() {
      this.close()
    },
  },
}
</script>
