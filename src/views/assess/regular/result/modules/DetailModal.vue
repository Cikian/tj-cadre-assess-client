<template>
  <t-modal
    title="考核信息"
    :width="width"
    :visible="visible"
    :simple-submit="true"
    @ok="handleCancel"
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
    @cancel="handleCancel"
    cancelText="关闭"
  >

    <a-descriptions bordered>
      <a-descriptions-item label="考核名称" :span='3'>
        {{ form.assessName }}
      </a-descriptions-item>
<!--      <a-descriptions-item label="当前年度">-->
<!--        {{ form.year }}-->
<!--      </a-descriptions-item>-->
<!--      <a-descriptions-item label="当前季度">-->
<!--        {{ form.quarter }}-->
<!--      </a-descriptions-item>-->
      <a-descriptions-item label="考核总人数">
        {{ form.totalNum }}
      </a-descriptions-item>
      <a-descriptions-item label="理论好等次名额">
        {{ form.totalGoodTheory }}
      </a-descriptions-item>
      <a-descriptions-item label="已评好等次人数">
        {{ form.totalGood }}
      </a-descriptions-item>
    </a-descriptions>
    <a-descriptions style='margin-top: 30px' bordered title="已分配好等次名额">
      <a-descriptions-item label="正处级及以上领导干部">
        {{ form.leaderTotal }}
      </a-descriptions-item>
      <a-descriptions-item label="已评好等次人数">
        {{ form.leaderGood }}
      </a-descriptions-item>
      <a-descriptions-item>
        <a-button @click="openDetail('leader')" type="link">详情</a-button>
      </a-descriptions-item>
      <a-descriptions-item label="其他人员">
        {{ form.depTotal }}
      </a-descriptions-item>
      <a-descriptions-item label="已评好等次人数">
        {{ form.deptGood }}
      </a-descriptions-item>
      <a-descriptions-item>
        <a-button @click="openDetail('other')" type="link">详情</a-button>
      </a-descriptions-item>
    </a-descriptions>
    <a-descriptions style='margin-top: 30px' bordered title="进度">
      <a-descriptions-item label="已填报处室">
        {{ form.over }}
      </a-descriptions-item>
      <a-descriptions-item label="未填报处室" :span="2">
        {{ form.notOver }}
      </a-descriptions-item>
      <a-descriptions-item label="进度">
        <a-progress
          :stroke-color="{
        from: '#108ee9',
        to: '#87d068',
      }"
          :percent="form.progress"
          status="active"
        />
      </a-descriptions-item>
    </a-descriptions>

  </t-modal>
</template>



<script>
import GradeModel from '@/component/GradeModel.vue'
import TModal from '@/component/TModal.vue'
import { getDictItemByCode } from '@/utils/commonUtils'
import { axios } from '@/utils/assessReq'
import { getAction } from '@/api/manage'
import DetailItemModal from '@/views/assess/regular/result/modules/DetailItemModal.vue'

export default {
  name: 'DetailModal',
  components: {
    DetailItemModal,
    TModal,
    GradeModel
  },
  data() {
    return {
      width: 1100,
      visible: false,
      disableSubmit: false,
      loading: false,
      form: {},
      detailVisible: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      getAction('/regular/result/detail').then(res => {
        console.log(res)
        if (res.success) {
          this.form = res.result
          // 将form中的progress转为数字
          this.form.progress = parseInt(this.form.progress)
        }
      })
    },

    openDetail(type) {
      this.$emit('detail', type)
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
