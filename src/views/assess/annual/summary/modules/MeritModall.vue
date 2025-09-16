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
    <a-form style='margin: 0 0 20px 0' layout='inline' @keyup.enter.native='searchQuery'>
      <a-form-item label='姓名'>
        <a-input @change='searchQuery' placeholder='模糊搜索姓名' v-model='queryParam.depart' />
      </a-form-item>
    </a-form>
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
        <!-- <template slot="enable" slot-scope="text, record, index">
          <a-tooltip :title="record.disciplineRecommend=='Y' ? '纪检组推优' : ''">
            <a-switch
            v-model='dataSource[index].leaderRecommend'

              :disabled="record.locked"
              @change=" handleEnableChange( record, index)"
            ></a-switch>
          </a-tooltip>
        </template> -->

        <template slot='thirdClass' slot-scope='text, record, index'>
          <a-switch v-model='dataSource[index].thirdClass' @change='handleEnableChange(record,index)'></a-switch>
        </template>


      </a-table>
    </div>


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
import TSelectDepart from '@/views/config/modules/TSelectDepart.vue'

export default {
  name: 'MeritModal',
  components: {
    TSelectDepart,
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
      queryParam: {
        depart: ''
      },
      title: '',
      showNoDataMask: false, // 控制遮罩层显示
      width: 1200,
      visible: false,
      disableSubmit: false,
      assessingInfo: {},
      queryType: 'person',
      dataSources: '',
      dataSource: '',
      basiclist: [],
      basicnamelist: [],
      bureaunamelist: [],
      groupnamelist: [],
      institutionnamelist: [],
      basicNum: '',
      bureauNum: '',
      groupNum: '',
      institutionNum: '',
      dataflag: false,

      searchText: '',
      searchInput: null,
      searchedColumn: '',

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
          width: 60,
          align: 'center',
          dataIndex: 'depart_dictText'
        },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'person',
        },
        {
          title: '是否连续两年评为优秀',
          align: 'center',
          scopedSlots: { customRender: 'thirdClass' },
          dataIndex: 'thirdClass'
        }

      ],

      catchDataSources: []

    }
  },
  mounted() {

    // 获取当前考核信息
    getAssessingInfo('annual').then(res => {
      if (res.success) {
        this.assessingInfo = res.result
        if (res.assessing == false) {
          this.showNoDataMask = true // 显示无数据遮罩
        } else {
          this.loadData()
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
  methods: {
    searchQuery() {
      if (!this.queryParam.depart || this.queryParam.depart === '') {
        this.dataSource = this.catchDataSources
        return
      } else {
        // this.catchDataSources = this.dataSource
        this.dataSource = this.catchDataSources.filter(item => item.person.includes(this.queryParam.depart))
      }
    },


    loadData() {

      // 获取推优列表
      let url = '/modules/assessAnnualSummary/getMerit'
      if (this.queryParam.depart) {
        url += `?depart=${this.queryParam.depart}`
      }
      getAction(url).then(res => {

        this.dataSources = res.result.records.filter(item => item.recommendType == 'group')
        this.dataSource = res.result.records.filter(item => item.recommendType != 'group')
        // 初始化数据，根据 disciplineRecommend 设置开关状态和锁定状态
        this.dataSource = this.dataSource.map(item => ({
          ...item,
          leaderRecommend: item.thirdClass == 'Y' ? true : false,
          thirdClass: item.thirdClass == 'Y' ? true : false
        }))

        this.basiclist = []
        this.basicnamelist = []

        let thirdTemp1 = []
        let thirdTemp2 = []

        this.dataSource.forEach(item => {
          if (item.thirdClass) {
            // 检查 basicList 是否已包含 item.id
            if (!this.basiclist.includes(item.id)) {
              this.basiclist.push(item.id)
            }

            // 检查 basicNameList 是否已包含 item.person
            if (!this.basicnamelist.includes(item.person)) {
              this.basicnamelist.push(item.person)
            }

            thirdTemp1.push(item)
          } else {
            thirdTemp2.push(item)
          }

        })

        this.dataSource = [...thirdTemp1, ...thirdTemp2]
        this.catchDataSources = this.dataSource

      })
    },
    handleEnableChange(record, index) {

      if (this.basiclist.includes(record.id)) {
        // 如果已经在basiclist中，不做任何操作
        this.dataSource[index].thirdClass = false // 关闭开关
        this.basiclist = this.basiclist.filter(id => id !== record.id)
        // 移除basicnamelist中的record.person_dictText
        this.basicnamelist = this.basicnamelist.filter(name => name !== record.person)

      } else {
        // 如果不在basiclist中，添加到basiclist
        this.basiclist.push(record.id)
        this.basicnamelist.push(record.person)

      }
    },

    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      const basicNames = this.basicnamelist.join('，')
      const message = `${basicNames};`

      this.$confirm({
        title: '确认修改人员',
        content: message,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          putAction('/modules/assessAnnualSummary/merit', {
            list: this.basiclist,
            year: this.assessingInfo.currentYear
          }).then((res) => {
            if (res.success) {
              this.visible = false
              this.$emit('loadData')
            } else {

            }
          })

          this.$confirm({
            title: '消息提示',
            content: h => <div style='color:red;'>修改成功！</div>,
            onOk: () => {
            },

            onCancel: () => {
            }

          })
        },
        onCancel: () => {
          // this.$message.info('已取消');
          // this.$confirm({
          //   title: '消息提示',

          //   content: h => <div style="color:red;">已取消</div>,

          //   onOk: () => {

          //   },

          //   onCancel: () => {

          //   }

          // })
          this.$info({
            title: '消息',
            content: '已取消'
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