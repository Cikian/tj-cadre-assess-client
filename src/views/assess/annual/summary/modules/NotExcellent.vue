<template>
  <t-modal :title="title" :width="width" :visible="visible" switchFullscreen @cancel="handleCancel" cancelText="关闭">
    <div>
      <div style="overflow-y: scroll; height: 570px">
        <a-table
          ref="table"
          size="middle"
          bordered
          rowKey="id"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="false"
          class="j-table-force-nowrap"
        />
      </div>

      <div v-show="showNoDataMask" class="no-data-mask">
        <span>当前没有正在进行中的考核</span>
      </div>
    </div>
  </t-modal>
</template>

<script>
import TModal from '@/component/TModal.vue'
import { getAction } from '@/api/manage'
import { getAssessingInfo } from '@/api/assessApis'

export default {
  name: 'NotExcellent',
  components: {
    TModal
  },
  data() {
    return {
      title: '非优秀考核单位',
      showNoDataMask: false,
      width: 1200,
      visible: false, // 控制弹窗的显示
      dataSource: [], // 用于存放表格数据
      columns: [
        {
          title: '单位',
          dataIndex: 'depart',
          align: 'center'
        }
      ]
    }
  },
  mounted() {
    // 获取当前考核信息
    this.loadData()
  },
  methods: {
    loadData() {
      getAssessingInfo('annual').then((res) => {
        if (res.success) {
          if (res.assessing === false) {
            this.showNoDataMask = true // 显示无数据遮罩
          } else {
            // 获取非优列表并更新 dataSource
            getAction('/modules/assessAnnualSummary/notExcellent').then((res) => {
              // 假设 res 是数组形式
              this.dataSource = res.map((item, index) => ({
                id: index + 1, // 可以用索引作为 ID，或者根据实际需求设置
                depart: item // 将部门名称放入数据源
              }))
              this.showNoDataMask = this.dataSource.length === 0 // 根据数据源长度显示无数据遮罩
            })
          }
        } else {
          this.showNoDataMask = true // 显示无数据遮罩
        }
      })
    },
    handleCancel() {
      this.visible = false
    }
  }
}
</script>

<style scoped>
.no-data-mask {
  position: absolute;
  top: 10%;
  left: 0;
  width: 100%;
  height: 90%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  font-size: 26px;
  font-weight: 700;
}

.j-table-force-nowrap .ant-table-tbody > tr > td {
  white-space: nowrap; /* 防止内容换行 */
}

.ant-modal {
  top: 20px; /* 调整弹窗位置 */
}

.ant-modal-header {
  background-color: #f0f2f5; /* 设置弹窗头部背景色 */
}

.ant-modal-title {
  font-weight: bold; /* 设置弹窗标题字体加粗 */
}
</style>
