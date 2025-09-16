<template>
  <t-modal
    title='民主测评局领导测评进度'
    :width='1500'
    :visible='visible'
    :maskClosable='false'
    switchFullscreen
    @ok='handleCancel'
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    :simple-submit='true'
    @cancel='handleCancel'>
    <a-table
      ref='table'
      size='middle'
      bordered
      rowKey='id'
      :columns='columns'
      :dataSource='dataSource'
      :pagination='false'
    >
      <template slot='over' slot-scope='text'>
        <span style='color: #00c000' v-html='text'></span>
      </template>
      <template slot='noOver' slot-scope='text'>
        <span  v-if='text !== null && text !== "" && text !== undefined'> {{ text.replace(/JG/g, "局管总师、二巡").replace(/,/g, "，") }}</span>
        <span v-else> {{ text }}</span>
      </template>
      <template slot='rate' slot-scope='text'>
        <a-progress :percent="text" status="active" />
      </template>
    </a-table>
  </t-modal>
</template>

<script>

import { getAction } from '@/api/manage'
import TModal from '@/component/TModal.vue'

export default {
  name: 'ProgressModal',
  components: { TModal },
  created() {
    getAction('/modules/annual/democraticSummary/getLeaderProgress').then(res => {
      if (res.success) {
        this.dataSource = res.result.records
      }
    })

  },
  computed: {
    replacedText(val) {
      return val.replace(/JG/g, "局管");
    }
  },

  data() {
    return {
      title: '',
      width: 800,
      visible: false,
      disableSubmit: false,
      dataSource: [],
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '局领导',
          align: 'center',
          dataIndex: 'leader',
          width: 122,
        },
        {
          title: '已评单位',
          align: 'center',
          width: 400,
          dataIndex: 'over_dictText',
          scopedSlots: { customRender: 'over' }
        },
        {
          title: '未评单位',
          align: 'center',
          width: 400,
          dataIndex: 'noOver_dictText',
          scopedSlots: { customRender: 'noOver' }
        },
        {
          title: '进度',
          align: 'center',
          width: 130,
          dataIndex: 'rate',
          scopedSlots: { customRender: 'rate' }
        }
      ]

    }
  },
  methods: {
    close() {
      this.visible = false
    },
    handleCancel() {
      this.close()
    }
  }
}
</script>

<style scoped>
</style>