<template>
  <div>
    <!-- 操作按钮区域 -->


    <a-tabs default-active-key='1' @change='tabChange'>
      <!-- <div style="overflow-y: scroll;height:570px"> -->

      <a-tab-pane key='1' tab='局机关领导干部' force-render>
        局机关领导干部共可推优 <span :style='bureauStyle'>{{ bureauTrueNum }}</span>人 &nbsp;&nbsp;&nbsp;&nbsp;
        还可推优 <span :style='bureauStyle'>{{ bureauNum }}</span>人 <br>
<!--        <div style='overflow-y: scroll; max-height: 570px'>-->
        <div style='margin-top: 20px'>
          <a-table
            ref='groupTable'
            size='middle'
            bordered
            rowKey='id'
            :columns='columns'
            :dataSource='bureauData'
            :pagination='false'
            :scroll="{ y: 450 }"

          >
            <!-- <template slot='enable' slot-scope='text, record, index'>
              <a-switch v-model='bureauData[index].leaderRecommend'  @change='handleEnableChanges(record,index)'></a-switch>
            </template> -->

            <template slot='depart' slot-scope='text, record, index'>
              {{ record.departName === '局管总师二巡' ? '局管总师二巡' : text }}
            </template>

            <template slot='twoYear' slot-scope='text, record, index'>
              {{ text === "是" ? text : "" }}
            </template>

            <template slot='disciplineRecommend' slot-scope='text, record, index'>
              {{ record.disciplineRecommend ? "纪检组推优" : "" }}
            </template>

            <template slot='enable' slot-scope='text, record, index'>
              <a-tooltip :title="record.disciplineRecommend == true ? '纪检组推优' : ''">
                <a-switch
                  v-model='bureauData[index].leaderRecommend'
                  :disabled='record.locked || disvalue == 3'
                  @change='handleEnableChange(record, index)'
                ></a-switch>
              </a-tooltip>
            </template>
          </a-table>
        </div>
      </a-tab-pane>

      <a-tab-pane key='2' tab='领导班子' force-render>
        领导班子共可推优 <span :style='bureauStyless'>{{ groupTrueNum }}</span>个&nbsp;&nbsp;&nbsp;&nbsp;
        还可推优 <span :style='bureauStyless'>{{ groupNum }}</span>个<br>
<!--        <div style='overflow-y: scroll; max-height: 570px'>-->
        <div style='margin-top: 20px'>
          <a-table
            ref='groupTable'
            size='middle'
            bordered
            rowKey='id'
            :columns='groupSummaryColumns'
            :dataSource='groupData'
            :pagination='false'
            :scroll="{ y: 450 }"

          >
            <!-- <template slot='enable' slot-scope='text, record, index'>
              <a-switch v-model='bureauData[index].leaderRecommend'  @change='handleEnableChanges(record,index)'></a-switch>
            </template> -->
            <template slot='enable' slot-scope='text, record, index'>
              <a-switch
                v-model='groupData[index].leaderRecommend'
                :disabled='record.locked || disvalue == 3'
                @change='handleEnableChange(record, index)'
              ></a-switch>
            </template>
          </a-table>
        </div>
      </a-tab-pane>

      <a-tab-pane key='3' tab='分局、参公' force-render>
        分局、参公领导干部共可推优 <span :style='bureauStyles'>{{ basicTrueNum }}</span>人&nbsp;&nbsp;&nbsp;&nbsp;
        还可推优 <span :style='bureauStyles'>{{ basicNum }}</span>人<br>
<!--        <div style='overflow-y: scroll; max-height: 570px'>-->
        <div style='margin-top: 20px'>
          <a-table
            ref='groupTable'
            size='middle'
            bordered
            rowKey='id'
            :columns='basicColumns'
            :dataSource='basicData'
            :pagination='false'
            :scroll="{ y: 450 }"
          >

            <template slot='depart' slot-scope='text, record, index'>
              {{ record.departName === '局管总师二巡' ? '局管总师二巡' : text }}
            </template>

            <template slot='twoYear' slot-scope='text, record, index'>
              {{ text === "是" ? text : "" }}
            </template>

            <template slot='disciplineRecommend' slot-scope='text, record, index'>
              {{ record.disciplineRecommend ? "纪检组推优" : "" }}
            </template>

            <!-- <template slot='enable' slot-scope='text, record, index'>
              <a-switch v-model='bureauData[index].leaderRecommend'  @change='handleEnableChanges(record,index)'></a-switch>
            </template> -->
            <template slot='enable' slot-scope='text, record, index'>
              <a-tooltip :title="record.disciplineRecommend == true ? '纪检组推优' : ''">
                <a-switch
                  v-model='basicData[index].leaderRecommend'
                  :disabled='record.locked || disvalue == 3'
                  @change='handleEnableChange(record, index)'
                ></a-switch>
              </a-tooltip>
            </template>
          </a-table>
        </div>
      </a-tab-pane>

      <a-tab-pane key='4' tab='事业单位'>
        事业单位领导干部共可推优 <span :style='bureauStylesss'>{{ institutionTrueNum }}</span>人&nbsp;&nbsp;&nbsp;&nbsp;
        还可推优 <span :style='bureauStylesss'>{{ institutionNum }}</span>人&nbsp;&nbsp;&nbsp;&nbsp;
<!--        <div style='overflow-y: scroll; max-height: 570px'>-->
        <div style='margin-top: 20px'>
          <a-table
            ref='table'
            size='middle'
            bordered
            rowKey='id'
            :columns='basicColumns2'
            :dataSource='institutionData'
            :pagination='false'
            :scroll="{ y: 450 }"
          >

            <template slot='depart' slot-scope='text, record, index'>
              {{ record.departName === '局管总师二巡' ? '局管总师二巡' : text }}
            </template>

            <template slot='disciplineRecommend' slot-scope='text, record, index'>
              {{ record.disciplineRecommend ? "纪检组推优" : "" }}
            </template>

            <template slot='enable' slot-scope='text, record, index'>
              <a-tooltip :title="record.disciplineRecommend == true ? '纪检组推优' : ''">
                <a-switch
                  v-model='institutionData[index].leaderRecommend'
                  :disabled='record.locked || disvalue == 3'
                  @change='handleEnableChange(record, index)'
                ></a-switch>
              </a-tooltip>
            </template>
            <!--
                    <template slot='enable' slot-scope='text, record, index'>
                      <a-switch v-model='institutionData[index].leaderRecommend'  @change='handleEnableChange(record,index)'></a-switch>
                    </template> -->
          </a-table>
        </div>
      </a-tab-pane>
      <!-- </div> -->
    </a-tabs>

    <!-- 提交图标 -->
    <div
      v-if='rembutton'
      @click='checkNum'
      style='cursor: pointer'
    >
      <!-- <img src="@/assets/commit.png" alt="提交" style="width: 50px; height: 50px" /> -->
    </div>
    <!--    <div style="margin: 40px 20px; color: #ff7349">-->
    <!--      {{ msg }}-->
    <!--    </div>-->


    <div class='table-operator' style='position: absolute;right:0;margin-top: 10px;'>
      <!-- <a-button v-if="rembutton" type="danger" icon="plus" @click="handleOk">确定推优</a-button> -->
      <a-button v-if='rembutton' @click='checkNum' type='primary' style='width:300px;
  height:50px;border: 0;font-size: 28px;color: white;font-weight: 600;border-radius: 10px;' :disabled='disvalues'>提交
      </a-button>
    </div>

    <a-modal v-model="checkNumVisible" title="您有剩余可推优名额" @ok="handleOk">
      <p v-if='bureauNum > 0' style='color: red; font-size: 20px'>局机关领导干部剩余优秀名额：{{ bureauNum }}</p>
      <p v-if='groupNum > 0' style='color: red; font-size: 20px'>领导班子剩余优秀名额：{{ groupNum }}</p>
      <p v-if='basicNum > 0' style='color: red; font-size: 20px'>分局、参公剩余优秀名额：{{ basicNum }}</p>
      <p v-if='institutionNum > 0' style='color: red; font-size: 20px'>事业单位剩余优秀名额：{{ institutionNum }}</p>
      <p style='font-size: 22px'>您有剩余可推优名额，是否继续提交？</p>
    </a-modal>


  </div>
  <!-- <div v-show='showNoDataMask' class='no-data-mask'>
    <span>当前没有正在进行中的考核</span>
  </div> -->
</template>

<script>
import { getAction, putAction } from '@/api/manage'
import store from '@/store'
import TModal from '@/component/TModal.vue'
import { getAssessingInfo } from '@/api/assessApis'

export default {
  name: 'LeaderRecommendModal',
  components: {
    TModal
  },
  props: {
    formDisable: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  computed: {
    bureauStyle() {
      return {
        color: this.bureauNum > 0 ? 'green' : 'red',
        fontSize: '20px',
        fontWeight: '800'
      }
    },
    bureauStyles() {
      return {
        color: this.basicNum > 0 ? 'green' : 'red',
        fontSize: '20px',
        fontWeight: '800'
      }
    },
    bureauStyless() {
      return {
        color: this.groupNum > 0 ? 'green' : 'red',
        fontSize: '20px',
        fontWeight: '800'
      }
    },
    bureauStylesss() {
      return {
        color: this.institutionNum > 0 ? 'green' : 'red',
        fontSize: '20px',
        fontWeight: '800'
      }
    }
  },
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
      disvalues: false,
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
      bureauTrueNum: '',
      groupTrueNum: '',
      institutionTrueNum: '',
      checkNumVisible: false,

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
          width: 130,
          dataIndex: 'depart',
          scopedSlots: { customRender: 'depart' },
        },
        {
          title: '姓名',
          align: 'center',
          width: 90,
          dataIndex: 'name'
        },
        {
          title: '类别',
          align: 'center',
          width: 120,
          dataIndex: 'type'
        },
        {
          title: '考核单元内民主测评排名',
          align: 'center',
          width: 80,
          dataIndex: 'democraticRanking'
        },
        {
          title: '不能评优情况汇总',
          align: 'center',
          width: 400,
          dataIndex: 'remark'
        },
        {
          title: '参考信息',
          align: 'center',
          width: 450,
          dataIndex: 'negativeList'
        },
        {
          title: '连续两年评为优秀',
          align: 'center',
          width: 70,
          dataIndex: 'twoYear',
          scopedSlots: { customRender: 'twoYear' },
        },
        {
          title: '推优情况',
          align: 'center',
          dataIndex: 'disciplineRecommend',
          width: 90,
          scopedSlots: { customRender: 'disciplineRecommend' },
        },
        {
          title: '是否推优',
          align: 'center',
          scopedSlots: { customRender: 'enable' },
          dataIndex: 'leaderRecommend'
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
          width: 150,
          dataIndex: 'depart'
        },
        {
          title: ' 民主测评排名',
          align: 'center',
          width: 120,
          dataIndex: 'democraticRanking'
        },
        {
          title: '不能评优情况汇总',
          align: 'center',
          width: 450,
          dataIndex: 'remark'
        },
        {
          title: '参考信息',
          align: 'center',
          width: 450,
          dataIndex: 'negativeList'
        },
        // {
        //   title: '评优建议',
        //   align: 'center',
        //   dataIndex: 'suggestion',
        // },
        {
          title: '是否推优',
          align: 'center',
          width: 110,
          scopedSlots: { customRender: 'enable' },
          dataIndex: 'leaderRecommend'
        }
      ],
      basicColumns: [
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
          dataIndex: 'depart',
          width: 140,
          scopedSlots: { customRender: 'depart' },
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
          width: 60,
          dataIndex: 'type'
        },
        {
          title: '民主测评排名',
          align: 'center',
          width: 80,
          dataIndex: 'democraticRanking'
        },
        {
          title: '不能评优情况汇总',
          align: 'center',
          width: 300,
          dataIndex: 'remark'
        },
        {
          title: '参考信息',
          align: 'center',
          width: 380,
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
          width: 120,
          dataIndex: 'twoYear',
          scopedSlots: { customRender: 'twoYear' },
        },
        {
          title: '推优情况',
          align: 'center',
          width: 120,
          dataIndex: 'disciplineRecommend',
          scopedSlots: { customRender: 'disciplineRecommend' },
        },
        // {
        //   title: '评优建议',
        //   align: 'center',
        //   dataIndex: 'suggestion',
        // },
        {
          title: '是否推优',
          align: 'center',
          scopedSlots: { customRender: 'enable' },
          dataIndex: 'leaderRecommend'
        }
      ],
      basicColumns2: [
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
          width: 130,
          dataIndex: 'depart',
          scopedSlots: { customRender: 'depart' },
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
          width: 60,
          dataIndex: 'type'
        },
        {
          title: '民主测评排名',
          align: 'center',
          width: 80,
          dataIndex: 'democraticRanking'
        },
        {
          title: '不能评优情况汇总',
          align: 'center',
          width: 380,
          dataIndex: 'remark'
        },
        {
          title: '参考信息',
          align: 'center',
          width: 380,
          dataIndex: 'negativeList'
        },
        {
          title: '所在单位推荐优秀副职情况',
          align: 'center',
          width: 140,
          dataIndex: 'excellentDeputy'
        },
        {
          title: '推优情况',
          align: 'center',
          width: 120,
          dataIndex: 'disciplineRecommend',
          scopedSlots: { customRender: 'disciplineRecommend' },
        },
        {
          title: '是否推优',
          align: 'center',
          scopedSlots: { customRender: 'enable' },
          dataIndex: 'leaderRecommend'
        }
      ],
      recommendColumns: [
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
          title: '年度',
          align: 'center',
          dataIndex: 'currentYear_dictText'
        },

        {
          title: '单位',
          align: 'center',
          dataIndex: 'depart'
        },
        {
          title: '领导班子成员',
          align: 'center',
          dataIndex: 'name',
          scopedSlots: { customRender: 'person' }
        },
        {
          title: '是否推优',
          align: 'center',
          scopedSlots: { customRender: 'enable' },
          dataIndex: 'leaderRecommend'
        }
      ],
      msg: '',
      disvalue: ''
    }
  },
  mounted() {

    this.getLeaderRec()


    // 获取当前考核信息
    getAssessingInfo('annual').then((res) => {
      if (res.success) {
        this.assessingInfo = res.result

        if (res.assessing == false) {
          this.showNoDataMask = true // 显示无数据遮罩
        } else {
          // 获取推优列表
          getAction('/modules/assessAnnualSummary/getLeaderRecommendList').then((res) => {
            if (res.success) {


              this.msg = res.message
              this.bureauData = res.result.bureau
              this.institutionData = res.result.institution
              this.basicData = res.result.basic
              this.groupData = res.result.group
              // 初始化数据，根据 disciplineRecommend 设置开关状态和锁定状态
              this.institutionData = this.institutionData.map((item) => ({
                ...item,
                // leaderRecommend: item.disciplineRecommend == true ? true : false,
                // locked: item.disciplineRecommend == true || item.canExcellent == false ? true : false,
                leaderRecommend: item.disciplineRecommend === true || item.leaderRecommend === true,
                locked: item.disciplineRecommend === true || item.canExcellent === false || this.disvalue == 3
              }))

              // 根据 disciplineRecommend 添加到相应列表
              this.institutionData.forEach((record) => {
                if (record.disciplineRecommend === true) {
                  if (record.recommendType === 'basic') {
                    this.basicList.push(this.getDisName(record.hashId))
                    // this.basicNameList.push(record.name)
                  } else if (record.recommendType === 'bureau') {
                    this.bureauList.push(this.getDisName(record.hashId))
                    // this.bureauNameList.push(record.name)
                  } else if (record.recommendType === 'institution') {
                    this.institutionList.push(this.getDisName(record.hashId))
                    // this.institutionNameList.push(record.name)
                  }
                  this.rembutton = true
                }
              })

              this.bureauData = this.bureauData.map((item) => ({
                ...item,
                // leaderRecommend: item.disciplineRecommend == true ? true : false,
                // locked: item.disciplineRecommend == true || item.canExcellent == false ? true : false,
                leaderRecommend: item.disciplineRecommend === true || item.leaderRecommend === true,
                locked: item.disciplineRecommend === true || item.canExcellent === false || this.disvalue == 3
              }))

              // 根据 disciplineRecommend 添加到相应列表
              this.bureauData.forEach((record) => {
                if (record.disciplineRecommend === true) {
                  if (record.recommendType === 'basic') {
                    this.basicList.push(this.getDisName(record.hashId))
                    // this.basicNameList.push(record.name)
                  } else if (record.recommendType === 'bureau') {
                    this.bureauList.push(this.getDisName(record.hashId))
                    // this.bureauNameList.push(record.name)
                  } else if (record.recommendType === 'institution') {
                    this.institutionList.push(this.getDisName(record.hashId))
                    // this.institutionNameList.push(record.name)
                  }
                  this.rembutton = true
                }
              })

              this.basicData = this.basicData.map((item) => ({
                ...item,
                // leaderRecommend: item.disciplineRecommend === true ? true : false,
                // locked: item.disciplineRecommend == true || item.canExcellent == false ? true : false,
                leaderRecommend: item.disciplineRecommend === true || item.leaderRecommend === true,
                locked: item.disciplineRecommend === true || item.canExcellent === false || this.disvalue == 3
              }))
              // 根据 disciplineRecommend 添加到相应列表
              this.basicData.forEach((record) => {
                if (record.disciplineRecommend === true) {
                  if (record.recommendType === 'basic') {
                    this.basicList.push(this.getDisName(record.hashId))
                    // this.basicNameList.push(record.name)
                  } else if (record.recommendType === 'bureau') {
                    this.bureauList.push(this.getDisName(record.hashId))
                    // this.bureauNameList.push(record.name)
                  } else if (record.recommendType === 'institution') {
                    this.institutionList.push(this.getDisName(record.hashId))
                    // this.institutionNameList.push(record.name)
                  }
                  this.rembutton = true
                }
              })

              this.groupData = this.groupData.map((item) => ({
                ...item,
                // leaderRecommend: item.disciplineRecommend? true : false,
                // locked: item.canExcellent == false ? true : false,
                locked: item.canExcellent === false || this.disvalue == 3
              }))

              // 根据 disciplineRecommend 添加到相应列表
              // this.groupData.forEach(record => {
              //   if (record.disciplineRecommend == true) {
              //     if (record.recommendType === 'group') {
              //       this.groupList.push(record.id)
              //       this.groupNameList.push(record.depart)
              //     } else if (record.recommendType === 'basic') {
              //       this.basicList.push(record.id)
              //       this.basicNameList.push(record.name)
              //     } else if (record.recommendType === 'bureau') {
              //       this.bureauList.push(record.id)
              //       this.bureauNameList.push(record.name)
              //     } else if (record.recommendType === 'institution') {
              //       this.institutionList.push(record.id)
              //       this.institutionNameList.push(record.name)
              //     }
              //     this.rembutton = true
              //   }
              // })
            } else {
              this.$warning({
                title: '消息提示',
                content: (h) => <div style='color:red;'>{res.message}</div>
              })
            }
          })

          // 获取当前领导可推优数量
          getAction(
            '/modules/annual/assessAnnualExcellentNum/getRecommendData?year=' + this.assessingInfo.currentYear
          ).then((res) => {
            this.basicNum = Math.floor(res.result.basicTrueNum)
            this.bureauNum = Math.floor(res.result.bureauTrueNum)
            this.groupNum = Math.floor(res.result.groupTrueNum)
            this.institutionNum = Math.floor(res.result.institutionTrueNum)
            this.basicTrueNum = Math.floor(res.result.basicTrueNum)
            this.bureauTrueNum = Math.floor(res.result.bureauTrueNum)
            this.groupTrueNum = Math.floor(res.result.groupTrueNum)
            this.institutionTrueNum = Math.floor(res.result.institutionTrueNum)
          })
        }
      } else {
        // this.$message.error(res.message)
        this.$warning({
          title: '消息提示',
          content: (h) => <div style='color:red;'>{res.message}</div>
        })


        this.showNoDataMask = true // 显示无数据遮罩
      }
    })

    // // 获取当前领导可推优数量
    // getAction('/xxx?year=' + this.assessingInfo.currentYear).then(res => {

    // })

    // // 获取推优列表
    // getAction('/modules/assessAnnualSummary/recommendList?year=' + this.assessingInfo.currentYear).then(res => {

    // })
  },
  methods: {
    getDisName(val){
      // 以@分割val
      let arr = val.split('@')
      // 返回arr[0]
      return arr[0] + "(纪检推荐)" + "@" + arr[1] + "@" + arr[2]
    },
    getLeaderRec(){
      getAction('/assess/leader/rec/getByLeader').then((res) => {
        this.disvalue = res.result.status
        if (this.disvalue == 3) {
          this.disvalues = true
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
          this.groupData[index].leaderRecommend = false // 关闭开关
          this.groupList = this.groupList.filter((name) => name !== record.name)
          // 移除groupNameList中的record.name
          this.groupNameList = this.groupNameList.filter((depart) => depart !== record.depart)
          this.groupNum++
        } else {
          // 如果不在groupList中，添加到groupList
          if (this.groupNum <= 0) {
            // this.$message.error('推优人数已达上限！')
            this.$error({
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
    showSuccessMessage() {
      const groupSubmittedCount = this.groupList.length
      const groupRemainingSpots = this.groupNum - groupSubmittedCount
      const basicSubmittedCount = this.basicList.length
      const basicRemainingSpots = this.basicNum - basicSubmittedCount
      const bureauSubmittedCount = this.bureauList.length
      const bureauRemainingSpots = this.bureauNum - bureauSubmittedCount
      const institutionSubmittedCount = this.institutionList.length
      const institutionRemainingSpots = this.institutionNum - institutionSubmittedCount

      const message = `
    领导班子已提交 ${groupSubmittedCount} 人，还剩 ${groupRemainingSpots} 个名额；
    基层已提交 ${basicSubmittedCount} 人，还剩 ${basicRemainingSpots} 个名额；
    局机关已提交 ${bureauSubmittedCount} 人，还剩 ${bureauRemainingSpots} 个名额；
    事业单位已提交 ${institutionSubmittedCount} 人，还剩 ${institutionRemainingSpots} 个名额；
  `

      // this.$message.success(message);
      // this.$confirm({
      //   title: '消息提示',

      //   content: (h) => <div style="color:red;">{message}</div>,

      //   onOk: () => {
      //   },

      //   onCancel: () => {
      //   }
      // })
      this.$success({
        title: '消息提示',
        content: message
      })
    },
    handleEnableChanges(record, index) {
      if (record.recommendType == 'group') {
        if (this.groupList.includes(record.id)) {
          // 如果已经在groupList中，不做任何操作
          // this.$message.info('该记录已存在于列表中！');
          this.bureauData[index].leaderRecommend = false // 关闭开关

          this.groupList = this.groupList.filter((id) => id !== record.id)
          // 移除groupNameList中的record.name
          this.groupNameList = this.groupNameList.filter((name) => name !== record.depart)

          this.showSuccessMessage()
        } else {
          // 如果不在groupList中，添加到groupList
          if (this.groupList.length < this.groupNum) {
            this.groupList.push(record.id)
            this.groupNameList.push(record.depart)
            this.rembutton = true
            this.showSuccessMessage()
          } else {
            // this.$message.error('推优人数已达上限！');
            // this.$confirm({
            //   title: '消息提示',

            //   content: (h) => <div style="color:red;">推优人数已达上限！</div>,

            //   onOk: () => {
            //   },

            //   onCancel: () => {
            //   }
            // })
            this.$error({
              title: '错误',
              content: '推优人数已达上限！'
            })
            this.bureauData[index].leaderRecommend = false // 关闭开关
            this.groupList = this.groupList.filter((id) => id !== record.id)
            // 移除groupNameList中的record.name
            this.groupNameList = this.groupNameList.filter((name) => name !== record.depart)
          }
        }
      }

      //         else if(record.recommendType == 'basic'){

      //           if (this.basicList.includes(record.id)) {
      //             // 如果已经在basicList中，不做任何操作
      //             this.$message.info('该记录已存在于列表中！');
      //             this.bureauData[index].leaderRecommend = false; // 关闭开关

      //             this.basicList = this.basicList.filter(id => id !== record.id);
      //         // 移除basicNameList中的record.name
      //         this.basicNameList = this.basicNameList.filter(name => name !== record.name);

      //           } else {
      //             // 如果不在basicList中，添加到basicList
      //             if(this.basicList.length<this.basicNum){
      //               this.basicList.push(record.id);
      //               this.basicNameList.push(record.name);
      //               this.showSuccessMessage();
      //             }else{
      //               this.$message.error('推优人数已达上限！');
      //               this.bureauData[index].leaderRecommend = false; // 关闭开关
      //               this.basicList = this.basicList.filter(id => id !== record.id);
      //         // 移除basicNameList中的record.name
      //         this.basicNameList = this.basicNameList.filter(name => name !== record.name);
      //             }

      //           }}else if(record.recommendType == 'bureau'){

      //           if (this.bureauList.includes(record.id)) {
      //             // 如果已经在bureauList中，不做任何操作
      //             this.$message.info('该记录已存在于列表中！');
      //             this.bureauData[index].leaderRecommend = false; // 关闭开关

      //             this.bureauList = this.bureauList.filter(id => id !== record.id);
      //         // 移除bureauNameList中的record.name
      //         this.bureauNameList = this.bureauNameList.filter(name => name !== record.name);

      //           } else {
      //             // 如果不在bureauList中，添加到bureauList
      //             if(this.bureauList.length<this.bureauNum){
      //               this.bureauList.push(record.id);
      //               this.bureauNameList.push(record.name);
      //               this.showSuccessMessage();
      //             }else{
      //               this.$message.error('推优人数已达上限！');
      //               this.bureauData[index].leaderRecommend = false; // 关闭开关
      //               this.bureauList = this.bureauList.filter(id => id !== record.id);
      //         // 移除bureauNameList中的record.name
      //         this.bureauNameList = this.bureauNameList.filter(name => name !== record.name);
      //             }

      //           }

      //         }else if(record.recommendType == 'institution'){

      // if (this.institutionList.includes(record.id)) {
      //   // 如果已经在institutionList中，不做任何操作
      //   this.$message.info('该记录已存在于列表中！');
      //   this.bureauData[index].leaderRecommend = false; // 关闭开关

      //   this.institutionList = this.institutionList.filter(id => id !== record.id);
      // // 移除institutionNameList中的record.name
      // this.institutionNameList = this.institutionNameList.filter(name => name !== record.name);

      // } else {
      //   // 如果不在institutionList中，添加到institutionList
      //   if(this.institutionList.length<this.institutionNum){
      //     this.institutionList.push(record.id);
      //     this.institutionNameList.push(record.name);
      //     this.showSuccessMessage();
      //   }else{
      //     this.$message.error('推优人数已达上限！');
      //     this.bureauData[index].leaderRecommend = false; // 关闭开关
      //     this.institutionList = this.institutionList.filter(id => id !== record.id);
      // // 移除institutionNameList中的record.name
      // this.institutionNameList = this.institutionNameList.filter(name => name !== record.name);
      //   }

      // }

      // }

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

    checkNum(){
      if (this.basicNum > 0 || this.bureauNum > 0 || this.institutionNum > 0 || this.groupNum > 0) {
        this.checkNumVisible=true
      } else {
        this.handleOk()
      }
    },

    handleOk() {

      this.checkNumVisible = false

      let bureauNames = this.bureauNameList.join('，')
      let groupNames = this.groupNameList.join('，')
      let basicNames = this.basicNameList.join('，')
      let institutionNames = this.institutionNameList.join('，')
      let message1 = ''
      let message2 = ''
      let message3 = ''
      let message4 = ''
      if (this.bureauNameList.length > 0) message1 = `局机关：${bureauNames}`
      if (this.groupNameList.length > 0) message2 = `领导班子：${groupNames}`
      if (this.basicNameList.length > 0) message3 = `分局+参公：${basicNames}`
      if (this.institutionNameList.length > 0) message4 = `事业单位：${institutionNames}`

      this.$confirm({
        title: '确认推荐以下人员为优秀？',
        // content: message,
        content: h => <div style='font-weight: bold; font-size: 18px; margin-top: 20px'>
          <p>{message1}</p>
          <p>{message2}</p>
          <p>{message3}</p>
          <p>{message4}</p>
        </div>,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          let form = {
            basicList: this.basicList,
            bureauList: this.bureauList,
            groupList: this.groupList,
            institutionList: this.institutionList,
            leader: store.getters.userInfo.id,
            year: this.assessingInfo.currentYear
          }
          putAction('/modules/assessAnnualSummary/recommend', form).then((res) => {
            if (res.success) {
              this.$success({
                title: res.message
                // JSX support
              })
              this.getLeaderRec()
            } else {
              this.$error({
                title: res.message
                // JSX support
              })
              this.getLeaderRec()
            }
          })

          // this.$message.success('推优成功！');
        },
        onCancel: () => {
          // this.$message.info('已取消推优');
          // this.$confirm({
          //   title: '消息提示',
          //   content: (h) => <div style="color:red;">已取消推优</div>,
          //   onOk: () => {
          //   },
          //   onCancel: () => {
          //   }
          // })
          this.$info({
            title: '消息提示',
            content: '已取消推优'
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

/deep/ .ant-btn-primary-disabled, .ant-btn-primary.disabled, .ant-btn-primary[disabled], .ant-btn-primary-disabled:hover, .ant-btn-primary.disabled:hover, .ant-btn-primary[disabled]:hover, .ant-btn-primary-disabled:focus, .ant-btn-primary.disabled:focus, .ant-btn-primary[disabled]:focus, .ant-btn-primary-disabled:active, .ant-btn-primary.disabled:active, .ant-btn-primary[disabled]:active, .ant-btn-primary-disabled.active, .ant-btn-primary.disabled.active, .ant-btn-primary[disabled].active {
  color: rgba(0, 0, 0, 0.25);
  background-color: #d9d9d9;
  border-color: #d9d9d9;
  text-shadow: none;
  box-shadow: none;
}
</style>
