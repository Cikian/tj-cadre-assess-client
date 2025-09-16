<template>
  <t-modal
    title="局领导测评进度"
    :width="width"
    :visible="visible"
    :simple-submit="true"
    @ok="handleCancel"
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
    @cancel="handleCancel"
    cancelText="关闭"
  >

    <a-table
      ref="table"
      size="middle"
      :scroll="{ x: true }"
      bordered
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
      class="j-table-force-nowrap"
      rowKey="name"

    >

      <!--        <template slot="quarter1" slot-scope="text">-->
      <!--          {{ !text ? '空' : text }}-->
      <!--        </template>-->
      <!--        <template slot="quarter2" slot-scope="text">-->
      <!--          {{ !text ? '空' : text }}-->
      <!--        </template>-->
      <!--        <template slot="quarter3" slot-scope="text">-->
      <!--          {{ !text ? '空' : text }}-->
      <!--        </template>-->
      <!--        <template slot="quarter4" slot-scope="text">-->
      <!--          {{ !text ? '空' : text }}-->
      <!--        </template>-->

      <template slot="name" slot-scope="text, record">
        {{text}}

      </template>
      <template slot="status" slot-scope="text, record">
        <a-badge v-if="record.status" status="success" text="已完成" />
        <a-badge v-else status="processing" text="测评中" />
      </template>
    </a-table>

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
  name: 'LeaderDetailModal',
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
      detailVisible: false,
      dataSource: [],
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          },
        },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '测评状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
        }
      ],


    }
  },
  created() {
    // this.init()
  },
  methods: {
    init() {
      getAction('/regular/result/leaderPro').then(res => {
        if (res.success) {
          let r = res.result
          // r为对象，从前往后遍历r的属性，以属性名称作为name，属性值作为status，存入一个对象{name,status}，存入dataSource
          for (let key in r) {
            let obj = {
              name: key,
              status: r[key]
            }
            this.dataSource.push(obj)
          }
          console.log(this.dataSource)

        }
      })
    },

    openDetail(type) {
      this.$emit('detail', type)
    },

    close() {
      this.visible = false
      this.dataSource = []
    },

    handleCancel() {
      this.close()
    }
  }
}
</script>
