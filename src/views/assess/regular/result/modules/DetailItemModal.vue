<template>
  <t-modal
    title="详情"
    :width="width"
    :visible="visible"
    :simple-submit="true"
    @ok="handleCancel"
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
    @cancel="handleCancel"
    cancelText="关闭"
  >

    <div style="overflow-y: auto; height: 600px">
      <a-descriptions bordered>
        <a-descriptions-item v-for="(item, i) in data" :key="i" :label="item.name" :span="2">
          {{ item.num }}
        </a-descriptions-item>
      </a-descriptions>
    </div>
  </t-modal>

</template>


<script>
import GradeModel from '@/component/GradeModel.vue'
import TModal from '@/component/TModal.vue'
import { getDictItemByCode } from '@/utils/commonUtils'
import { axios } from '@/utils/assessReq'
import { getAction } from '@/api/manage'

export default {
  name: 'DetailItemModal',
  components: {
    TModal,
    GradeModel
  },
  data() {
    return {
      width: 800,
      visible: false,
      disableSubmit: false,
      loading: false,
      form: {},
      detailVisible: false,
      data: []
    }
  },
  created() {
  },
  methods: {
    initData(type) {
      getAction('/regular/report/getDetailItem?type=' + type).then(res => {
        console.log(res)
        if (res.success) {
          this.data = res.result
          this.visible = true
        } else {
          this.$message.error(res.message)
        }
      })
    },

    close() {
      this.visible = false
    },

    handleCancel() {
      this.close()
    }
  }
}
</script>
