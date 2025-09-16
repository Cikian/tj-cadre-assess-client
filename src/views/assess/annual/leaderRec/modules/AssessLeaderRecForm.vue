<template>
  <div style='overflow-y: scroll; height: 800px'>
    <!-- 操作按钮区域 -->

    <div style='font-size: 20px; font-weight: bold; padding: 20px 20px'>
      <span>{{ model.leader_dictText + model.currentYear + '年度推优信息' }}</span>
    </div>

    <a-tabs default-active-key='1' @change='tabChange'>

      <a-tab-pane key='1' tab='局机关领导干部' force-render>
        <div style='overflow-y: scroll; max-height: 650px'>
          <a-table
            ref='groupTable'
            size='middle'
            bordered
            rowKey='id'
            :columns='columns'
            :dataSource='bureauData'
            :pagination='false'
          >

            <template slot='depart' slot-scope='text, record, index'>
              {{ record.departName === '局管总师二巡' ? '局管总师二巡' : text }}
            </template>

            <template slot='twoYear' slot-scope='text, record, index'>
              {{ text === '是' ? text : '' }}
            </template>

            <template slot='enable' slot-scope='text, record, index'>
              <span v-if='record.disciplineRecommend === true'>纪检组推优</span>
              <span v-else-if='record.canExcellent === false'>不可推优</span>
              <!-- <a-tooltip :title="record.disciplineRecommend == true ? '纪检组推优' : ''">

                <a-switch
                  v-model='bureauData[index].leaderRecommend'
                  :disabled='record.locked'
                  @change='handleEnableChange(record, index)'
                ></a-switch>
              </a-tooltip> -->
            </template>

            <span slot='action' slot-scope='text, record'>
              <a @click='handleEdit(record)'>编辑</a>
            </span>
          </a-table>
        </div>
      </a-tab-pane>

      <a-tab-pane key='2' tab='领导班子' force-render>
        <div style='overflow-y: scroll; max-height: 570px'>
          <a-table
            ref='groupTable'
            size='middle'
            bordered
            rowKey='id'
            :columns='groupSummaryColumns'
            :dataSource='groupData'
            :pagination='false'
          >
            <template slot='enable' slot-scope='text, record, index'>

              <span v-if='record.canExcellent === false'>不可推优</span>
            </template>
            <span slot='action' slot-scope='text, record'>
              <a @click='handleEdit(record)'>编辑</a>
            </span>
          </a-table>
        </div>
      </a-tab-pane>

      <a-tab-pane key='3' tab='分局、参公' force-render>
        <div style='overflow-y: scroll; max-height: 570px'>
          <a-table
            ref='groupTable'
            size='middle'
            bordered
            rowKey='id'
            :columns='basicColumns'
            :dataSource='basicData'
            :pagination='false'
          >

            <template slot='depart' slot-scope='text, record, index'>
              {{ record.departName === '局管总师二巡' ? '局管总师二巡' : text }}
            </template>

            <template slot='twoYear' slot-scope='text, record, index'>
              {{ text === '是' ? text : '' }}
            </template>

            <template slot='enable' slot-scope='text, record, index'>
              <span v-if='record.disciplineRecommend === true'>纪检组推优</span>
              <span v-else-if='record.canExcellent === false'>不可推优</span>
              <!-- <a-tooltip :title="record.disciplineRecommend == true ? '纪检组推优' : ''"> -->
              <!-- <a-switch
                v-model='basicData[index].leaderRecommend'
                :disabled='record.locked'
                @change='handleEnableChange(record, index)'
              ></a-switch> -->
              <!-- </a-tooltip> -->
            </template>
            <span slot='action' slot-scope='text, record'>
              <a @click='handleEdit(record)'>编辑</a>
            </span>
          </a-table>
        </div>
      </a-tab-pane>

      <a-tab-pane key='4' tab='事业单位'>
        <div style='overflow-y: scroll; max-height: 570px'>
          <a-table
            ref='table'
            size='middle'
            bordered
            rowKey='id'
            :columns='institutionColumns'
            :dataSource='institutionData'
            :pagination='false'
          >
            <template slot='depart' slot-scope='text, record, index'>
              {{ record.departName === '局管总师二巡' ? '局管总师二巡' : text }}
            </template>

            <template slot='enable' slot-scope='text, record, index'>

              <span v-if='record.disciplineRecommend === true'>纪检组推优</span>
              <span v-else-if='record.canExcellent === false'>不可推优</span>
              <!-- <a-tooltip :title="record.disciplineRecommend == true ? '纪检组推优' : ''">
                <a-switch
                  v-model='institutionData[index].leaderRecommend'
                  :disabled='record.locked'
                  @change='handleEnableChange(record, index)'
                ></a-switch>
              </a-tooltip> -->
            </template>
            <span slot='action' slot-scope='text, record'>
              <a @click='handleEdit(record)'>编辑</a>
            </span>
          </a-table>
        </div>
      </a-tab-pane>
    </a-tabs>

    <assess-leader-rec-item-modal ref='modalForm' @ok='submitCallback'></assess-leader-rec-item-modal>

  </div>
</template>

<script>
import { getAction } from '@/api/manage'
import TModal from '@/component/TModal.vue'
import AssessLeaderRecItemModal from '@/views/assess/annual/leaderRec/modules/AssessLeaderRecItemModal.vue'

export default {
  name: 'AssessLeaderRecForm',
  components: {
    AssessLeaderRecItemModal,
    TModal
  },
  props: {
    formDisable: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  computed: {},
  watch: {
    basicList: 'updateRembut',
    bureauList: 'updateRembut',
    groupList: 'updateRembut',
    institutionList: 'updateRembut'
  },
  data() {
    return {
      title: '',
      rembutton: false,
      showNoDataMask: false, // 控制遮罩层显示
      width: 896,
      visible: true,
      disableSubmit: false,
      assessingInfo: {},
      queryType: 'person',
      bureauData: [],
      institutionData: [],
      basicData: [],
      groupData: [],
      basicList: [],
      bureauList: [],
      groupList: [],
      institutionList: [],
      basicNameList: [],
      bureauNameList: [],
      groupNameList: [],
      institutionNameList: [],
      basicNum: '',
      bureauNum: '',
      groupNum: '',
      institutionNum: '',
      basicTrueNum: '',
      bureauTrueTNum: '',
      groupTrueNum: '',
      institutionTrueNum: '',

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
          title: '处室',
          align: 'center',
          dataIndex: 'depart',
          width: 180,
          scopedSlots: { customRender: 'depart' }
        },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'name'
        },
        {
          title: '类别',
          align: 'center',
          dataIndex: 'type'
        },
        {
          title: '考核单元内民主测评排名',
          align: 'center',
          width: 100,
          dataIndex: 'democraticRanking'
        },
        {
          title: '不能评优情况汇总',
          align: 'center',
          width: 500,
          dataIndex: 'remark'
        },
        {
          title: '参考信息',
          align: 'center',
          dataIndex: 'negativeList',
          width: 500,
        },
        {
          title: '连续两年评为优秀',
          align: 'center',
          width: 100,
          dataIndex: 'twoYear',
          scopedSlots: { customRender: 'twoYear' }
        },
        // {
        //   title: '评优建议',
        //   align: 'center',
        //   dataIndex: 'suggestion',
        // },
        {
          title: '推优情况',
          align: 'center',
          dataIndex: 'leaderRecommend',
          scopedSlots: { customRender: 'enable' }
        },
        {
          title: '操作',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      groupSummaryColumns: [
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
          title: '领导班子',
          align: 'center',
          width: 180,
          dataIndex: 'depart'
        },
        {
          title: ' 民主测评排名',
          align: 'center',
          width: 100,
          dataIndex: 'democraticRanking'
        },
        {
          title: '不能评优情况汇总',
          align: 'center',
          width: 600,
          dataIndex: 'remark'
        },
        {
          title: '参考信息',
          align: 'center',
          width: 600,
          dataIndex: 'negativeList'
        },
        // {
        //   title: '评优建议',
        //   align: 'center',
        //   dataIndex: 'suggestion',
        // },
        {
          title: '推优情况',
          align: 'center',
          dataIndex: 'leaderRecommend',
          width: 150,
          scopedSlots: { customRender: 'enable' }
        },
        {
          title: '操作',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      basicColumns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 50,
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },

        {
          title: '单位',
          align: 'center',
          width: 140,
          dataIndex: 'depart'
        },
        {
          title: '姓名',
          align: 'center',
          width: 100,
          dataIndex: 'name'
        },
        {
          title: '类别',
          align: 'center',
          width: 80,
          dataIndex: 'type'
        },
        {
          title: '民主测评排名',
          align: 'center',
          width: 100,
          dataIndex: 'democraticRanking'
        },
        {
          title: '不能评优情况汇总',
          align: 'center',
          width: 470,
          dataIndex: 'remark'
        },
        {
          title: '参考信息',
          align: 'center',
          width: 470,
          dataIndex: 'negativeList'
        },
        {
          title: '所在单位推荐优秀副职情况',
          align: 'center',
          width: 140,
          dataIndex: 'excellentDeputy'
        },
        {
          title: '连续两年评为优秀',
          align: 'center',
          width: 100,
          dataIndex: 'twoYear',
          scopedSlots: { customRender: 'twoYear' }
        },
        // {
        //   title: '连续两年评为优秀',
        //   align: 'center',
        //   dataIndex: 'twoYear',
        // },
        // {
        //   title: '评优建议',
        //   align: 'center',
        //   dataIndex: 'suggestion',
        // },
        {
          title: '推优情况',
          align: 'center',
          width: 120,
          dataIndex: 'leaderRecommend',
          scopedSlots: { customRender: 'enable' }
        },
        {
          title: '操作',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      institutionColumns: [
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
          width: 180,
          dataIndex: 'depart'
        },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'name'
        },
        {
          title: '类别',
          align: 'center',
          dataIndex: 'type'
        },
        {
          title: '民主测评排名',
          align: 'center',
          width: 100,
          dataIndex: 'democraticRanking'
        },
        {
          title: '不能评优情况汇总',
          align: 'center',
          width: 500,
          dataIndex: 'remark'
        },
        {
          title: '参考信息',
          align: 'center',
          width: 500,
          dataIndex: 'negativeList'
        },
        {
          title: '所在单位推荐优秀副职情况',
          align: 'center',
          width: 140,
          dataIndex: 'excellentDeputy'
        },
        // {
        //   title: '连续两年评为优秀',
        //   align: 'center',
        //   dataIndex: 'twoYear',
        // },
        // {
        //   title: '评优建议',
        //   align: 'center',
        //   dataIndex: 'suggestion',
        // },
        {
          title: '推优情况',
          align: 'center',
          dataIndex: 'leaderRecommend',
          scopedSlots: { customRender: 'enable' }
        },
        {
          title: '操作',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      msg: '',
      model: {}
    }
  },
  mounted() {
  },
  methods: {
    handleEdit: function(record) {
      this.$refs.modalForm.edit(record)
      this.$refs.modalForm.title = '编辑'
      this.$refs.modalForm.disableSubmit = false
    },
    edit(record) {
      this.model = record
      // 获取推优列表
      this.loadData()
    },
    loadData() {
      getAction('/modules/assessAnnualSummary/getLeaderRecommendListByMainId?mainId=' + this.model.id).then((res) => {
        if (res.success) {
          this.bureauData = res.result.bureau
          this.institutionData = res.result.institution
          this.basicData = res.result.basic
          this.groupData = res.result.group
          // 初始化数据，根据 disciplineRecommend 设置开关状态和锁定状态
          this.institutionData = this.institutionData.map((item) => ({
            ...item,
            // leaderRecommend: item.disciplineRecommend == true ? true : false,
            // locked: item.disciplineRecommend == true || item.canExcellent == false ? true : false,
            leaderRecommend: item.disciplineRecommend === true,
            locked: item.disciplineRecommend === true || item.canExcellent === false
          }))

          // 根据 disciplineRecommend 添加到相应列表
          this.institutionData.forEach((record) => {
            if (record.disciplineRecommend) {
              if (record.recommendType === 'group') {
                this.groupList.push(record.id)
                this.groupNameList.push(record.depart)
              } else if (record.recommendType === 'basic') {
                this.basicList.push(record.id)
                this.basicNameList.push(record.name)
              } else if (record.recommendType === 'bureau') {
                this.bureauList.push(record.id)
                this.bureauNameList.push(record.name)
              } else if (record.recommendType === 'institution') {
                this.institutionList.push(record.id)
                this.institutionNameList.push(record.name)
              }
              this.rembutton = true
            }
          })

          this.bureauData = this.bureauData.map((item) => ({
            ...item,
            // leaderRecommend: item.disciplineRecommend == true ? true : false,
            // locked: item.disciplineRecommend == true || item.canExcellent == false ? true : false,
            leaderRecommend: item.disciplineRecommend === true,
            locked: item.disciplineRecommend === true || item.canExcellent === false
          }))

          // 根据 disciplineRecommend 添加到相应列表
          this.bureauData.forEach((record) => {
            if (record.disciplineRecommend === true) {
              if (record.recommendType === 'group') {
                this.groupList.push(record.id)
                this.groupNameList.push(record.depart)
              } else if (record.recommendType === 'basic') {
                this.basicList.push(record.id)
                this.basicNameList.push(record.name)
              } else if (record.recommendType === 'bureau') {
                this.bureauList.push(record.id)
                this.bureauNameList.push(record.name)
              } else if (record.recommendType === 'institution') {
                this.institutionList.push(record.id)
                this.institutionNameList.push(record.name)
              }
              this.rembutton = true
            }
          })

          this.basicData = this.basicData.map((item) => ({
            ...item,
            // leaderRecommend: item.disciplineRecommend === true ? true : false,
            // locked: item.disciplineRecommend == true || item.canExcellent == false ? true : false,
            leaderRecommend: item.disciplineRecommend === true,
            locked: item.disciplineRecommend === true || item.canExcellent === false
          }))
          // 根据 disciplineRecommend 添加到相应列表
          this.basicData.forEach((record) => {
            if (record.disciplineRecommend === true) {
              if (record.recommendType === 'group') {
                this.groupList.push(record.id)
                this.groupNameList.push(record.depart)
              } else if (record.recommendType === 'basic') {
                this.basicList.push(record.id)
                this.basicNameList.push(record.name)
              } else if (record.recommendType === 'bureau') {
                this.bureauList.push(record.id)
                this.bureauNameList.push(record.name)
              } else if (record.recommendType === 'institution') {
                this.institutionList.push(record.id)
                this.institutionNameList.push(record.name)
              }
              this.rembutton = true
            }
          })

          this.groupData = this.groupData.map((item) => ({
            ...item,
            locked: item.canExcellent === false
          }))
        }
      })

    },

    updateRembut() {
      this.rembutton =
        this.basicList.length > 0 ||
        this.bureauList.length > 0 ||
        this.groupList.length > 0 ||
        this.institutionList.length > 0
    },
    handleEnableChange(record, index) {
      if (record.recommendType == 'group') {
        if (this.groupList.includes(record.name)) {
          // 如果已经在groupList中，不做任何操作
          // this.$message.info('该记录已存在于列表中！')
          this.error({
            title: '错误',
            content: '该记录已存在于列表中！'
          })
          this.groupData[index].leaderRecommend = false // 关闭开关
          this.groupList = this.groupList.filter((name) => name !== record.name)
          // 移除groupNameList中的record.name
          this.groupNameList = this.groupNameList.filter((depart) => depart !== record.depart)
          this.groupNum++
        } else {
          // 如果不在groupList中，添加到groupList
          if (this.groupNum <= 0) {
            // this.$message.error('推优人数已达上限！')
            this.error({
              title: '错误',
              content: '推优人数已达上限！'
            })
            this.groupData[index].leaderRecommend = false // 关闭开关
            this.groupList = this.groupList.filter((name) => name !== record.name)
            // 移除groupNameList中的record.name
            this.groupNameList = this.groupNameList.filter((depart) => depart !== record.depart)
          } else {
            this.groupList.push(record.name)
            this.groupNameList.push(record.depart)
            this.rembutton = true
            this.groupNum--
            // this.showSuccessMessage()
          }
        }
      } else if (record.recommendType == 'basic') {
        if (this.basicList.includes(record.hashId)) {
          // 如果已经在basicList中，不做任何操作
          this.basicData[index].leaderRecommend = false // 关闭开关
          this.basicList = this.basicList.filter((hashId) => hashId !== record.hashId)
          // 移除basicNameList中的record.name
          this.basicNameList = this.basicNameList.filter((name) => name !== record.name)
          // this.showSuccessMessage()
          this.basicNum++
        } else {
          // 如果不在basicList中，添加到basicList
          if (this.basicNum <= 0) {
            // this.$message.error('推优人数已达上限！')
            this.$error({
              title: '错误',
              content: '推优人数已达上限！'
            })
            this.basicData[index].leaderRecommend = false // 关闭开关
            this.basicList = this.basicList.filter((hashId) => hashId !== record.hashId)
            // 移除basicNameList中的record.name
            this.basicNameList = this.basicNameList.filter((name) => name !== record.name)
          } else {
            this.basicList.push(record.hashId)
            this.basicNameList.push(record.name)
            this.rembutton = true
            this.basicNum--
            // this.showSuccessMessage()
          }
        }
      } else if (record.recommendType == 'bureau') {
        if (this.bureauList.includes(record.hashId)) {
          // 如果已经在bureauList中，不做任何操作

          this.bureauData[index].leaderRecommend = false // 关闭开关

          this.bureauList = this.bureauList.filter((hashId) => hashId !== record.hashId)
          // 移除bureauNameList中的record.name
          this.bureauNameList = this.bureauNameList.filter((name) => name !== record.name)
          // this.showSuccessMessage()
          this.bureauNum++
        } else {
          // 如果不在bureauList中，添加到bureauList
          if (this.bureauNum <= 0) {
            // this.$message.error('推优人数已达上限！')
            this.$error({
              title: '错误',
              content: '推优人数已达上限！'
            })
            this.bureauData[index].leaderRecommend = false // 关闭开关
            this.bureauList = this.bureauList.filter((hashId) => hashId !== record.hashId)
            // 移除bureauNameList中的record.name
            this.bureauNameList = this.bureauNameList.filter((name) => name !== record.name)
          } else {
            this.bureauList.push(record.hashId)
            this.bureauNameList.push(record.name)
            this.bureauNum--
            this.rembutton = true
            // this.showSuccessMessage()
          }
        }
      } else if (record.recommendType == 'institution') {
        if (this.institutionList.includes(record.hashId)) {
          // 如果已经在institutionList中，不做任何操作

          this.institutionData[index].leaderRecommend = false // 关闭开关

          this.institutionList = this.institutionList.filter((hashId) => hashId !== record.hashId)
          // 移除institutionNameList中的record.name
          this.institutionNameList = this.institutionNameList.filter((name) => name !== record.name)
          // this.showSuccessMessage()
          this.institutionNum++
        } else {
          // 如果不在institutionList中，添加到institutionList
          if (this.institutionNum <= 0) {
            // this.$message.error('推优人数已达上限！')
            this.$error({
              title: '错误',
              content: '推优人数已达上限！'
            })
            this.institutionData[index].leaderRecommend = false // 关闭开关
            this.institutionList = this.institutionList.filter((hashId) => hashId !== record.hashId)
            // 移除institutionNameList中的record.name
            this.institutionNameList = this.institutionNameList.filter((name) => name !== record.name)
          } else {
            this.institutionList.push(record.hashId)
            this.institutionNameList.push(record.name)
            this.institutionNum--
            this.rembutton = true
            // this.showSuccessMessage()
          }
        }
      }

    },
    tabChange(key) {
      if (key === '2') {
        this.queryType = 'group'
      } else {
        this.queryType = 'person'
      }
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {

    },
    submitCallback() {
      this.loadData()
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
