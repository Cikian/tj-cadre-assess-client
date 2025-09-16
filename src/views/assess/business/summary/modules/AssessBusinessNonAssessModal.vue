<template>
  <t-modal
    title="当前未被考核单位"
    :width="width"
    :visible="visible"
    :simple-submit="true"
    @ok="handleOk"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
    cancelText="关闭">

    <a-spin :spinning="loading">
      <div style="overflow-y: scroll; width: 100%; height: 460px">
        <a-table
          ref="table"
          size="middle"
          :scroll="{x:true}"
          bordered
          rowKey="id"
          :columns="columns"
          :dataSource="departData"
          :pagination="false"
          :loading="loading"
          class="j-table-force-nowrap">

          <template slot="depart" slot-scope="text, record">
            <j-ellipsis :value="text" :length="18" />
          </template>

          <template slot="action" slot-scope="text, record">
            <t-select-depart @change="e => selectChange(record, e)" text="alias" v-model="record.selected" :multi="true" :depart-type="record.departType === '1' ? '2,3' : '1'" />
          </template>

        </a-table>
      </div>
    </a-spin>

  </t-modal>


</template>

<script>

import TModal from '@/component/TModal.vue'
import TSelectDepart from '@/component/TSelectDepart.vue'
import { submitMustAssess } from '@/api/assessApis'

export default {
  name: 'AssessBusinessNonAssessModal',
  components: {
    TSelectDepart,
    TModal
  },
  data() {
    return {
      width: 800,
      visible: false,
      disableSubmit: false,
      departData: [],
      loading: false,

      labelCol: { span: 4 },
      wrapperCol: { span: 14 },

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
          title: '单位（处室）',
          align: 'center',
          dataIndex: 'alias',
          width: 260,
          scopedSlots: { customRender: 'depart' }
        },
        {
          title: '指定处室（单位）考核',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],

      mustAssess: [],

    }
  },
  methods: {
    add() {
      this.visible = true
      this.loading = true
      this.$nextTick(() => {
      })
    },
    close() {
      this.$emit('close')
      this.mustAssess = []
      // 清空record的selected
      this.departData.forEach(item => {
        delete item.selected
      })
      this.visible = false
    },
    handleOk() {
      submitMustAssess(this.mustAssess).then(res => {
        if (res.success) {
          // this.$message.success('操作成功')
          // this.$confirm({
          //       title: '消息提示',
          //       content: h => <div style='color:red;'>{res.message}</div>,
          //       onOk: () => {
          //       },
          //       onCancel: () => {
          //       }
          //     })
          this.$success({
            title: '成功',
            content: res.message
          })
          this.close()
        }
      })
      this.close()
    },
    handleCancel() {
      this.close()
    },
    selectChange(record, selected) {

      // 将原来的数据删除
      this.mustAssess = this.mustAssess.filter(item => item.assessedDepart !== record.id)
      let assess = {
        assessedDepart: record.id,
        assessDeparts: selected
      }
      this.mustAssess.push(assess)
    }
  }
}
</script>