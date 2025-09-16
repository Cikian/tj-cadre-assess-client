<template>
  <t-modal
    title="导出"
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
        <a-form-model-item label="选择年度">
          <a-select v-model="form.year" placeholder="选择导出年度">
            <a-select-option v-for="(item, i) in yearDict" :key="item.value" :value="item.value" >
              {{ item.text }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </t-modal>
</template>

<script>
import TModal from '@/component/TModal.vue'
import { getDictItemByCode } from '@/utils/commonUtils'

export default {
  name: 'ExportByYearModal',
  components: {
    TModal
  },
  data() {
    return {
      width: 600,
      visible: false,
      downModalVisible: false,
      disableSubmit: false,

      loading: false,
      lastAssessYear:"",
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      form: {
        year: ''
      },

      yearDict: [],
      departTypeDict: [],
    }
  },
  created() {
  },
  methods: {
    add() {
      this.visible = true
      this.loading = true
      this.$nextTick(() => {})
    },
    async initData(year) {
      this.lastAssessYear=year;
      this.visible = true
      this.$nextTick(async () => {
        try {
          const [yearDict] = await Promise.all([getDictItemByCode('assess_year')])
          this.yearDict = yearDict;
          this.form.year = year;
        } catch (error) {
          console.error('Error fetching dictionary items:', error)
        } finally {
          this.loading = false
        }
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      this.$emit('ok',this.form.year)
    },

    handleCancel() {
      this.close()
    },
  },
}
</script>
