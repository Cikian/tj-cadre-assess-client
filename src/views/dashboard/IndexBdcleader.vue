<template>
  <div class="page-header-index-wide">

    <a-row :gutter="24">
      <a-col :sm="24" :md="12" :xl="6" style=" marginBottom: '24px'" >
        <div style="height: 200px;padding: 30px ;border-radius: 10px;position: relative;" class="bgarea">

          <div style="font-size: 20px;font-weight: 700;">平时考核测评</div>
          <div
               style="display: flex;align-items: center;font-size: 18px" class="bgbutnow" @click="towrite">
               去测评
            <!-- <div :class="`dot-${getColor(index)}`"></div> -->
            <!-- {{ item.name }} -->

            <!-- <img @click="towrite" src="../../assets/下载.png" v-if="item.name=='填报中'" type="arrow-right"
                 style="width:100px;height:100px;font-weight: 800;color: rgb(11, 73, 206);position: absolute;right: 5%;" />

            <img src="../../assets/完成.png" v-if="item.name=='填报完成'" type="check"
                 style="width:100px;height:100px;font-weight: 800;color: rgb(11, 73, 206);position: absolute;right: 5%;" />
            <img src="../../assets/播放.png" v-if="item.name=='审核中'" type="redo"
                 style="width:100px;height:100px;font-weight: 800;color: rgb(11, 73, 206);position: absolute;right: 5%;" /> -->
            <!-- <router-link to="/assess/regular/report" style="text-decoration: none; color: inherit;position: absolute;top:-100%;right:5%"> -->
            <!-- <img @click="towrite" src="../../assets/返回.png" v-if="item.name=='已驳回'" type="exclamation"
                 style="width:100px;height:100px;font-weight: 800;color: rgb(11, 73, 206);position: absolute;right: 5%" /> -->
            <!-- </router-link> -->
          </div>

        </div>
      </a-col>



      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }" >
        <div style="height: 200px;padding: 30px ;border-radius: 10px;position: relative;" class="bgarea4">

          <div style="font-size: 20px;font-weight: 700;">年度考核民主测评</div>
          <div
               style="display: flex;align-items: center;font-size: 18px;" class="bgbutnow" @click="towrite4">
               去测评
            <!-- <div :class="`dot-${getColor(index)}`"></div> -->
            <!-- {{ item.name }} -->
            <!-- <img @click="towrite3" src="../../assets/下载.png" v-if="item.name=='填报中'" type="arrow-right"
                 style="width:100px;height:100px;font-weight: 800;color: rgb(11, 73, 206);position: absolute;right: 5%;" />
            <img src="../../assets/完成.png" v-if="item.name=='填报完成'" type="check"
                 style="width:100px;height:100px;font-weight: 800;color: rgb(11, 73, 206);position: absolute;right: 5%;" />
            <img src="../../assets/播放.png" v-if="item.name=='审核中'" type="redo"
                 style="width:100px;height:100px;font-weight: 800;color: rgb(11, 73, 206);position: absolute;right: 5%;" />
            <img @click="towrite3" src="../../assets/返回.png" v-if="item.name=='已驳回'" type="exclamation"
                 style="width:100px;height:100px;font-weight: 800;color: rgb(11, 73, 206);position: absolute;right: 5%;" /> -->
          </div>

        </div>
      </a-col>

      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }" >
        <div style="height: 200px;padding: 30px ;border-radius: 10px;position: relative;" class="bgarea3">

          <div style="font-size: 20px;font-weight: 700;">年度考核推优</div>
          <div
               style="display: flex;align-items: center;font-size: 18px;" class="bgbutnow" @click="towrite3">
               去推优
            <!-- <div :class="`dot-${getColor(index)}`"></div> -->
            <!-- {{ item.name }} -->
            <!-- <img @click="towrite3" src="../../assets/下载.png" v-if="item.name=='填报中'" type="arrow-right"
                 style="width:100px;height:100px;font-weight: 800;color: rgb(11, 73, 206);position: absolute;right: 5%;" />
            <img src="../../assets/完成.png" v-if="item.name=='填报完成'" type="check"
                 style="width:100px;height:100px;font-weight: 800;color: rgb(11, 73, 206);position: absolute;right: 5%;" />
            <img src="../../assets/播放.png" v-if="item.name=='审核中'" type="redo"
                 style="width:100px;height:100px;font-weight: 800;color: rgb(11, 73, 206);position: absolute;right: 5%;" />
            <img @click="towrite3" src="../../assets/返回.png" v-if="item.name=='已驳回'" type="exclamation"
                 style="width:100px;height:100px;font-weight: 800;color: rgb(11, 73, 206);position: absolute;right: 5%;" /> -->
          </div>

        </div>
      </a-col>

      <!-- <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }"
             v-if="this.annualIndexEmployeelist && canFillNegative">
        <div style="height: 200px;padding: 30px ;border-radius: 10px;position: relative;" class="bgarea2">

          <div style="font-size: 20px;font-weight: 700;">负面清单</div>
          <div style="display: flex;align-items: center;font-size: 18px;" class="bgbutnow" @click="openNegativeModal">
            去填写
          </div>

        </div>
      </a-col> -->

    </a-row>
    <a-row :gutter="24">
      <a-card
        style="padding-top:0;margin-left: 12px;margin-right: 12px"
        :bordered="false"
        title="通知公告">
        <SysAnnouncementList></SysAnnouncementList>
      </a-card>
    </a-row>

    <!--    <div class="rightbox">-->
    <!--      <div style="font-size: 20px;font-weight: 800;">-->
    <!--        待处理事件-->
    <!--      </div>-->
    <!--      <div v-for="item in commissionItems" style="display: flex;align-items: center;font-size: 18px;margin-top: 20px;">-->
    <!--        <router-link :to="item.route"-->
    <!--                     style="text-decoration: none; color: inherit; display: flex;align-items: center;font-size: 18px;margin-top: 20px;">-->
    <!--          <div :class="`dots-${getColors(item.status)}`"></div>-->
    <!--          {{ item.name }}-->
    <!--        </router-link>-->
    <!--      </div>-->
    <!--    </div>-->

    <assess-annual-negative-list-modal ref="negativeForm"></assess-annual-negative-list-modal>

  </div>
</template>

<script>

import { getAction } from '@/api/manage'
import Trend from '@/components/Trend'
import { getLoginfo, getVisitInfo } from '@/api/api'
import ChartCard from '@/components/ChartCard'
import ACol from 'ant-design-vue/es/grid/Col'
import ATooltip from 'ant-design-vue/es/tooltip/Tooltip'
import MiniArea from '@/components/chart/MiniArea'
import MiniBar from '@/components/chart/MiniBar'
import MiniProgress from '@/components/chart/MiniProgress'
import RankList from '@/components/chart/RankList'
import Bar from '@/components/chart/Bar'
import LineChartMultid from '@/components/chart/LineChartMultid'
import HeadInfo from '@/components/tools/HeadInfo.vue'
import SysAnnouncementList from '@/views/dashboard/SysAnnouncementList'
import AssessAnnualNegativeListModal from '@/views/assess/annual/negativeList/modules/AssessAnnualNegativeListModal.vue'

export default {
  name: 'IndexChart',
  components: {
    AssessAnnualNegativeListModal,
    ATooltip,
    ACol,
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress,
    RankList,
    Bar,
    Trend,
    LineChartMultid,
    HeadInfo,
    SysAnnouncementList
  },
  computed: {
    regularcomputed() {
      // 将小数转换为百分比格式，并返回数值类型
      return parseFloat((this.regularIndexEmployeelist.percent * 100).toFixed(0))
    },
    businesscomputed() {
      // 将小数转换为百分比格式，并返回数值类型
      return parseFloat((this.businessIndexEmployeelist.percent * 100).toFixed(0))
    },
    annualcomputed() {
      // 将小数转换为百分比格式，并返回数值类型
      return parseFloat((this.annualIndexEmployeelist.percent * 100).toFixed(0))
    },
    reportcomputed() {
      // 将小数转换为百分比格式，并返回数值类型
      return parseFloat((this.reportIndexEmployeelist.percent * 100).toFixed(0))
    }

  },
  data() {
    return {
      commissionItems: [],
      settinglist: [
        {
          name: '业务工作测评默认等次比例设置',
          text: '设置业务工作测评自动生成的优秀、良好、一般等次默认比例',
          route: '/config/businessLevelConfig',
          img: require('@/assets/imgs1.png')
        },
        // {
        //   name: '业务工作测评互评单位配置',
        //   text: '业务工作测评互评单位配置',
        //   route: '/sys/config/departContact'
        // },
        {
          name: '领导分管处室配置',
          text: '设置及修改各局领导分管的处室（单位）',
          route: '/sys/config/leaderBond',
          img: require('@/assets/imgs2.png')
        }, {
          name: '年度民主测评指标设置',
          text: '设置年度考核民主测评各类型票的权重以及测评项',
          route: '/sys/config/annual/democraticConfig',
          img: require('@/assets/imgs3.png')
        }, {
          name: '年度考核优秀比例配置',
          text: '设置年度考核各类型单位推优上限比例',
          route: '/sys/config/excratio',
          img: require('@/assets/imgs4.png')
        }, {
          name: '问责影响期配置',
          text: '设置各类型问责的影响期',
          route: '/sys/config/a-period',
          img: require('@/assets/imgs5.png')
        }, {
          name: '一报告两评议民主测评配置',
          text: '设置以及修改“一报告两评议”民主评议项、分数',
          route: '/sys/config/report/democracyConfig',
          img: require('@/assets/imgs6.png')
        }
      ],
      loading: true,
      cardCount: {
        sll: 100,
        bjl: 87,
        isll: 15,
        ibjl: 9
      },
      canFillNegative: false,

      todaySll: 60,
      todayBjl: 54,
      todayISll: 13,
      todayIBjl: 7,

      chartData: {
        sll: [],
        bjl: [],
        isll: [],
        ibjl: []
      },

      diskInfo: [
        { name: 'C盘', restPPT: 7 },
        { name: 'D盘', restPPT: 5 }
      ],

      dataSource1: [],
      dataSource2: [],
      dataSource3: [],
      dataSource4: [],
      columns: [
        {
          title: '年度',
          align: 'center',
          dataIndex: 'currentYear'
        }, {
          title: '名称',
          align: 'center',
          dataIndex: 'assessName'
        }, {
          title: '单位',
          align: 'center',
          dataIndex: 'departmentCode'
        }, {
          title: '截止日期',
          align: 'center',
          dataIndex: 'deadline'
        }],
      columns1: [
        {
          title: '年度',
          align: 'center',
          dataIndex: 'currentYear'
        }, {
          title: '名称',
          align: 'center',
          dataIndex: 'assessName'
        }, {
          title: '单位',
          align: 'center',
          dataIndex: 'reportDepart'
        }, {
          title: '截止日期',
          align: 'center',
          dataIndex: 'deadline'
        }],
      columns2: [
        {
          title: '年度',
          align: 'center',
          dataIndex: 'currentYear'
        }, {
          title: '名称',
          align: 'center',
          dataIndex: 'assessName'
        }, {
          title: '单位',
          align: 'center',
          dataIndex: 'depart'
        }, {
          title: '截止日期',
          align: 'center',
          dataIndex: 'deadline'
        }],
      ipagination1: {
        current: 1,
        pageSize: 5,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0

      },
      ipagination2: {
        current: 1,
        pageSize: 5,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      indexRegisterType: '转移登记',
      indexBottomTab: '1',
      center: null,

      loginfo: {},
      visitFields: ['ip', 'visit'],
      visitInfo: [],
      indicator: <a-icon type="loading" style="font-size: 24px" spin />,
      regularIndexEmployeelist: {},
      businessIndexEmployeelist: {},
      annualIndexEmployeelist: {},
      reportIndexEmployeelist: {}
    }
  },
  created() {
    // 获取接口信息
    // getAction('/regular/report/getPartial').then(res => {
    //   console.log('1114', res)
    //   this.regularIndexEmployeelist = res.result.regularIndexEmployee
    //   this.businessIndexEmployeelist = res.result.businessIndexEmployee
    //   this.annualIndexEmployeelist = res.result.annualIndexEmployee
    //   this.reportIndexEmployeelist = res.result.reportIndexEmployee
    //   this.commissionItems = res.result.commissionItems
    //   if (res.result.regularIndexEmployee) {
    //     this.dataSource1 = res.result.regularIndexEmployee.reports
    //   }
    //   if (res.result.businessIndexEmployee) {
    //     this.dataSource2 = res.result.businessIndexEmployee.reports
    //     console.log('1114222', this.dataSource2)
    //   }
    //   if (res.result.reportIndexEmployee) {
    //     this.dataSource3 = res.result.reportIndexEmployee.reports
    //     console.log('1114333', this.dataSource3)
    //   }
    //   if (res.result.annualIndexEmployee) {
    //     this.dataSource4 = res.result.annualIndexEmployee.reports
    //   }
    //   // this.dataSource1 = res.result.regularIndexEmployee.reports
    //   // this.dataSource2 = res.result.businessIndexEmployee.reports
    //   // this.dataSource3 = res.result.reportIndexEmployee.reports
    //   // this.dataSource4 = res.result.annualIndexEmployee.reports

    // })
    // this.loadDataSource1()
    // this.loadDataSource2()

    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
    this.initLogInfo()
    // this.checkCanFillNegative()
  },
  methods: {
    openNegativeModal() {
      this.$refs.negativeForm.add()
      this.$refs.negativeForm.title = '负面清单录入'
      this.$refs.negativeForm.disableSubmit = false
    },
    checkCanFillNegative() {
      getAction('/common/canFillNegative').then((res) => {
        console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||')
        console.log(res)
        if (res.success) {
          this.canFillNegative = res.result
        }
      })
    },
    towrite() {
      this.$router.push('/assess/regular/report/leader')
    },
    // towrites() {
    //   this.$router.push('/business/initAssess')
    // },
    // towrite2() {
    //   this.$router.push('/evaluation/fillList')
    // },
    towrite3() {
      this.$router.push('/annual/leader')
    },
    towrite4() {
      this.$router.push('/assess/annual/evaluation')
    },
    getColor(index) {
      switch (index) {
        case 0:
          return 'blue'
        case 1:
          return 'red'
        case 2:
          return 'green'
        case 3:
          return 'yellow'
        default:
          return 'default' // 可以根据需要添加更多的颜色
      }
    },
    getColors(value) {
      switch (value) {
        case '0':
          return 'green'
        case '1':
          return 'green'
        case '2':
          return 'yellow'
        case '3':
          return 'red'
        default:
          return 'default' // 可以根据需要添加更多的颜色
      }
    },
    changeRegisterType(e) {
      this.indexRegisterType = e.target.value
      // if(this.indexBottomTab=="1"){
      //   this.loadDataSource1()
      // }else{
      //   this.loadDataSource2()
      // }
    },
    tableChange1(pagination) {
      this.ipagination1.current = pagination.current
      this.ipagination1.pageSize = pagination.pageSize
      this.queryTimeoutInfo()
    },
    tableChange2(pagination) {
      this.ipagination2.current = pagination.current
      this.ipagination2.pageSize = pagination.pageSize
      this.queryNodeTimeoutInfo()
    },
    getFlowRateNumber(value) {
      return Number(value)
    },
    getPercentFormat(value) {
      if (value == 100) {
        return '超时'
      } else {
        return value + '%'
      }
    },
    getPercentColor(value) {
      let p = Number(value)
      if (p >= 90 && p < 100) {
        return 'rgb(244, 240, 89)'
      } else if (p >= 100) {
        return 'red'
      } else {
        return 'rgb(16, 142, 233)'
      }
    },

    // loadDataSource1(){
    //   this.dataSource1 = dataSource1.filter(item=>{
    //     if(!this.indexRegisterType){
    //       return true
    //     }
    //     return item.type==this.indexRegisterType
    //   })
    // },
    // loadDataSource2(){
    //   this.dataSource2 = dataSource2.filter(item=>{
    //     if(!this.indexRegisterType){
    //       return true
    //     }
    //     return item.type==this.indexRegisterType
    //   })
    // },
    initLogInfo() {
      getLoginfo(null).then((res) => {
        if (res.success) {
          Object.keys(res.result).forEach(key => {
            res.result[key] = res.result[key] + ''
          })
          this.loginfo = res.result
        }
      })
      getVisitInfo().then(res => {
        if (res.success) {
          this.visitInfo = res.result
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.bgbutnow {
  background-image: url("../../assets/矩形 495.png");
  height: 50px;
  line-height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: absolute;
  bottom: 10%;
  width: 80%;
  left: 10%;
  cursor: pointer;

}

.bgbutnows {
  background-image: url("../../assets/矩形 495.png");
  height: 50px;
  line-height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  color: rgb(177, 183, 195);
  position: absolute;
  bottom: 10%;
  width: 80%;
  left: 10%
}

.bgarea {
  background-image: url("../../assets/底图1.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  padding: 20px;

}

.bgarea2 {
  background-image: url("../../assets/底图2.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  padding: 20px;

}

.bgarea3 {
  background-image: url("../../assets/底图3.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  padding: 20px;

}

.bgarea4 {
  background-image: url("../../assets/底图2.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  padding: 20px;

}

.page-header-index-wide {
  position: relative;
}

.rightbox {
  position: absolute;
  right: 1%;
  top: 0%;
  width: 360px;
  height: 800px;
  background-color: white;
  padding: 20px;
}

/deep/ .ant-card-body {
  height: 100%;
  padding-top: 20px;
}

/deep/ .ant-card-head-title {
  font-size: 24px;
}

.dots-red {
  width: 10px;
  height: 10px;
  background-color: rgb(230, 73, 73);
  border-radius: 50%;
  margin-right: 10px;
}

.dots-orange {
  width: 10px;
  height: 10px;
  background-color: rgb(230, 123, 73);
  border-radius: 50%;
  margin-right: 10px;
}

.dots-yellow {
  width: 10px;
  height: 10px;
  background-color: rgb(230, 188, 73);
  border-radius: 50%;
  margin-right: 10px;
}

.dots-default {
  width: 10px;
  height: 10px;
  background-color: gray; /* 默认颜色 */
  border-radius: 50%;
  margin-right: 10px;
}

.dot-blue {
  width: 10px;
  height: 10px;
  background-color: rgb(81, 81, 197);
  border-radius: 50%;
  margin-right: 10px;
}

.dot-red {
  width: 10px;
  height: 10px;
  background-color: rgb(230, 73, 73);
  border-radius: 50%;
  margin-right: 10px;
}

.dot-green {
  width: 10px;
  height: 10px;
  background-color: rgb(64, 170, 64);
  border-radius: 50%;
  margin-right: 10px;
}

.dot-yellow {
  width: 10px;
  height: 10px;
  background-color: rgb(231, 231, 10);
  border-radius: 50%;
  margin-right: 10px;
}

.dot-default {
  width: 10px;
  height: 10px;
  background-color: gray; /* 默认颜色 */
  border-radius: 50%;
  margin-right: 10px;
}

/deep/ .chart-card-footer {
  display: none;
}

.circle-cust {
  position: relative;
  top: 28px;
  left: -100%;
}

.extra-wrapper {
  line-height: 55px;
  padding-right: 24px;

  .extra-item {
    display: inline-block;
    margin-right: 24px;

    a {
      margin-left: 24px;
    }
  }
}

/* 首页访问量统计 */
.head-info {
  position: relative;
  text-align: left;
  padding: 0 32px 0 0;
  min-width: 125px;

  &.center {
    text-align: center;
    padding: 0 32px;
  }

  span {
    color: rgba(0, 0, 0, .45);
    display: inline-block;
    font-size: .95rem;
    line-height: 42px;
    margin-bottom: 4px;
  }

  p {
    line-height: 42px;
    margin: 0;

    a {
      font-weight: 600;
      font-size: 1rem;
    }
  }
}

.extra-wrapper {
  line-height: 55px;
  padding-right: 24px;

  .extra-item {
    display: inline-block;
    margin-right: 24px;

    a {
      margin-left: 24px;
    }
  }
}

.item-group {
  padding: 20px 0 8px 24px;
  font-size: 0;

  a {
    color: rgba(0, 0, 0, 0.65);
    display: inline-block;
    font-size: 16px;
    margin-bottom: 13px;
    width: 25%;
  }
}

.item-group {
  .more-btn {
    margin-bottom: 13px;
    text-align: center;
  }
}

.list-content-item {
  color: rgba(0, 0, 0, .45);
  display: inline-block;
  vertical-align: middle;
  font-size: 16px;
  margin-left: 40px;
}

@media only screen and (min-width: 1600px) {
  .list-content-item {
    margin-left: 60px;
  }
}

@media only screen and (max-width: 1300px) {
  .list-content-item {
    margin-left: 20px;
  }

  .width-hidden4 {
    display: none
  }
}

.list-content-item {
  span {
    line-height: 20px;
  }
}

.list-content-item {
  p {
    margin-top: 4px;
    margin-bottom: 0;
    line-height: 22px;
  }
}

.anty-list-cust {
  .ant-list-item-meta {
    flex: 0.3 !important;
  }
}

.anty-list-cust {
  .ant-list-item-content {
    flex: 1 !important;
    justify-content: flex-start !important;
    margin-left: 20px;
  }
}

/deep/ td {
  background-color: white !important;
}
</style>