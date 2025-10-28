<template>
  <t-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    @ok="handleOk"
    :simple-submit="true"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
    cancelText="关闭">


    <div style="overflow-y: scroll;height:570px">
<!--      <a-button type="primary" icon="download" @click="exportExl">导出Excel</a-button>-->
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="false"
        class="j-table-force-nowrap"
      >

        <template slot="inspection" slot-scope="text, record, index">
          <a-switch v-model="dataSource[index].inspection" @change="handleEnableChange(record,index)"></a-switch>
        </template>


      </a-table>
    </div>

    <!--    <export-excel ref='exportExl' @ok='exportModalOk' @over='downloadOver' />-->
    <export-excel @ok="exportOk" ref="exportExl" />

    <div v-show="showNoDataMask" class="no-data-mask">
      <span>当前没有正在进行中的考核</span>
    </div>
  </t-modal>
</template>

<script>
import { putAction } from '@/api/manage'
import store from '@/store'
import TModal from '@/component/TModal.vue'
import { getAction } from '@/api/manage'
import { getAssessingInfo } from '@/api/assessApis'
import ExportExcel from '@/views/assess/annual/summary/modules/ExportExcel.vue'

export default {
  name: 'InspectionModal',
  components: {
    ExportExcel,
    TModal
  },
  props: {
    formDisable: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      title: '纪检组推优',
      showNoDataMask: false, // 控制遮罩层显示
      width: 1200,
      visible: false,
      disableSubmit: false,
      assessingInfo: {},
      queryType: 'person',
      dataSource: [],
      basicList: [],
      basicNameList: [],
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
          title: '单位',
          align: 'center',
          dataIndex: 'depart_dictText'
        },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'person'
        },
        {
          title: '测评分数',
          align: 'center',
          dataIndex: 'score'
        },
        {
          title: '班子内排名',
          align: 'center',
          dataIndex: 'scopeRanking'
        },
        {
          title: '总排名',
          align: 'center',
          dataIndex: 'ranking'
        },
        {
          title: '纪检组推荐',
          align: 'center',
          dataIndex: 'inspection',
          scopedSlots: { customRender: 'inspection' }
        }
      ]

    }
  },
  mounted() {
    this.getfun()
  },
  methods: {
    getfun() {

      // 获取当前考核信息
      getAssessingInfo('annual').then(res => {
        if (res.success) {
          this.assessingInfo = res.result
          if (res.assessing === false) {
            this.showNoDataMask = true // 显示无数据遮罩
          } else {
// 获取推优列表
            getAction('/modules/assessAnnualSummary/getInspection?year=' + res.result.currentYear).then(res => {
              this.dataSource = res.result.records

              // 初始化数据，根据 inspection 设置开关状态和锁定状态
              this.dataSource = this.dataSource.map(item => ({
                ...item,
                inspection: item.inspection
              }))

              // this.dataSource.forEach(item => {
              //   if (item.inspection) {
              //     this.basicList.push(item.id)
              //     this.basicNameList.push(item.person)
              //   }
              // })
              this.basicList = []
              this.basicNameList = []
              this.dataSource.forEach(item => {
                if (item.inspection) {
                  // 检查 basicList 是否已包含 item.id
                  if (!this.basicList.includes(item.id)) {
                    this.basicList.push(item.id)
                  }

                  // 检查 basicNameList 是否已包含 item.person
                  if (!this.basicNameList.includes(item.person)) {
                    this.basicNameList.push(item.person)
                  }
                }
              })

            })

          }

        } else {
          // this.$message.error(res.message)
          // this.$confirm({
          //   title: '消息提示',

          //   content: h => <div style='color:red;'>{res.message}</div>,

          //   onOk: () => {

          //   },

          //   onCancel: () => {

          //   }

          // })

          this.showNoDataMask = true // 显示无数据遮罩
        }
      })

    },
    exportOk() {
      // this.$refs.exportExl.visible = false

    },
    exportExl() {
      this.$refs.exportExl.initData()
      this.$refs.exportExl.visible = true
    },
    handleEnableChange(record, index) {
      if (this.basicList.includes(record.id)) {
        // 如果已经在basicList中，不做任何操作
        this.dataSource[index].inspection = false // 关闭开关
        this.basicList = this.basicList.filter(id => id !== record.id)
        // 移除basicNameList中的record.person_dictText
        this.basicNameList = this.basicNameList.filter(name => name !== record.person)
      } else {
        // 如果不在basicList中，添加到basicList
        this.basicList.push(record.id)
        this.basicNameList.push(record.person)
      }
    },

    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      const basicNames = this.basicNameList.join('，')
      const message = `${basicNames};`

      this.$confirm({
        title: '确认修推荐以下人员？',
        content: message,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          putAction('/modules/assessAnnualSummary/inspection', {
            list: this.basicList,
            year: this.assessingInfo.currentYear
          }).then((res) => {
            if (res.success) {
              this.visible = false
              this.$emit('loadData')
            } else {

            }
          })
          // this.$message.success('修改成功！');
          // this.$confirm({
          //   title: '消息提示',
          //   content: h => <div style='color:red;'>修改成功！</div>,

          //   onOk: () => {
          //   },
          //   onCancel: () => {
          //   }
          // })
          this.$success({
            title: '成功',
            content: '修改成功！'
          })
        }
      })

    },
    submitCallback() {
      this.$emit('ok')
      this.visible = false
    },
    handleCancel() {
      this.close()
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

</style>