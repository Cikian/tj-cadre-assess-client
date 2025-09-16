<template>
  <t-modal
    :title='title'
    :width='width'
    :visible='visible'
    switchFullscreen
    @ok='handleOk'
    :simple-submit='true'
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel='handleCancel'
    cancelText='关闭'>


    <div style='overflow-y: scroll;height:570px'>
      <a-table
        ref='table'
        size='middle'
        bordered
        rowKey='id'
        :columns='columns'
        :dataSource='dataSource'
        :pagination='false'
        class='j-table-force-nowrap'
      >

        <template slot='excellentDeputyNum' slot-scope='text, record, index'>
          <a-input-number v-model='dataSource[index].excellentDeputyNum' />
        </template>


      </a-table>
    </div>

    <!--    <export-excel ref='exportExl' @ok='exportModalOk' @over='downloadOver' />-->
    <export-excel @ok='exportOk' ref='exportExl' />

    <div v-show='showNoDataMask' class='no-data-mask'>
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
  name: 'ExcellentDeputyNumModal',
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
      title: '基层单位优秀副职名额管理',
      showNoDataMask: false, // 控制遮罩层显示
      width: 1100,
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
          title: '名额',
          align: 'center',
          dataIndex: 'excellentDeputyNum',
          scopedSlots: { customRender: 'excellentDeputyNum' }
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
            getAction('/modules/annual/assessAnnualFill/excellentDeputyNumList?year=' + this.assessingInfo.currentYear).then(result => {
              this.dataSource = result.result.records

            })
          }
        } else {
          this.showNoDataMask = true // 显示无数据遮罩
        }
      })


    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {

      let obj = {}

      // 去掉dataSource中元素的currentYear_dictText、depart_dictText属性
      this.dataSource.forEach(item => {
        // 将item.id作为obj的key，item.excellentDeputyNum作为obj的value
        obj[item.id] = item.excellentDeputyNum
      })

      console.table(obj)

      putAction('/modules/annual/assessAnnualFill/excellentDeputyNumChange', this.dataSource ).then(res => {
        if (res.success) {
          this.$success({
            title: '成功',
            content: res.message
          })
          this.submitCallback()
        } else {
          this.$error({
            title: '操作失败',
            content: res.message
          })
        }
      })

    },
    submitCallback() {
      this.$emit('loadData')
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