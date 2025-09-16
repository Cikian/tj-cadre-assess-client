<template>
  <j-form-container :disabled='disabled'>
    <a-form-model ref='form' :model='model' :rules='validatorRules' slot='detail'>

      <div class='form-row'>
        <div class='form-row-left'>
          <div class='form-item-title'>
            <span style='color: red'>&nbsp;&nbsp; </span>单位名称：
          </div>
          <div class='form-item-input'>
            <span>{{ model.depart_dictText }}</span>
          </div>
        </div>

<!--        <div class='form-row-right'>-->
<!--          <div class='form-item-title'>-->
<!--            <span style='color: red'>* </span>单位人数：-->
<!--          </div>-->
<!--          <div class='form-item-input'>-->
<!--            <a-form-model-item prop='peopleNum'>-->
<!--              <a-input-number v-model='model.num' placeholder='请输入人数' style='width: 100%' />-->
<!--            </a-form-model-item>-->
<!--          </div>-->
<!--        </div>-->
      </div>

      <div class='form-row'>
        <div class='form-row-left'>
          <div class='form-item-title'>
            <span style='color: red'>&nbsp;&nbsp; </span>被评议对象：
          </div>
          <div class='form-item-input'>
            <a-tooltip placement="topLeft">
              <template slot="title">
                <span>填写《新提拔干部名册》后自动带入</span>
              </template>
              <a-input readOnly v-model='model.partinScope' />
            </a-tooltip>
          </div>
        </div>
        <div class='form-row-right'>
          <div class='form-item-title'>
            <span style='color: red'>* </span>单位人数：
          </div>
          <div class='form-item-input'>
            <a-form-model-item prop='assessPartinNum'>
              <a-input-number v-model='model.num' placeholder='请输入单位人数' style='width: 400px !important;' />
            </a-form-model-item>
          </div>
        </div>
      </div>

<!--      <div class='form-row' style='margin-bottom: 15px'>-->
<!--        <div class='form-row-left'>-->
<!--          <div class='form-item-title'>-->
<!--            <span style='color: red'>* </span>参加民主测评的科级领导干部：-->
<!--          </div>-->
<!--          <div class='form-item-input'>-->
<!--            &lt;!&ndash;            <j-select-user-by-dep v-model='model.leaders' :multi='true' store='id' text='realname'&ndash;&gt;-->
<!--            &lt;!&ndash;                                  style='width: 100%' />&ndash;&gt;-->
<!--            {{ model.partiSectionLeader_dictText }}-->
<!--            &lt;!&ndash;            {{ this.model.leaders }}&ndash;&gt;-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->

<!--      <div class='form-row' style='margin-bottom: 15px'>-->
<!--        <div class='form-row-left'>-->
<!--          <div class='form-item-title'>-->
<!--            <span style='color: red'>&nbsp;&nbsp;</span>不参加民主测评的科级干部：-->
<!--          </div>-->
<!--          <div class='form-item-input'>-->
<!--            <t-select-user-by-dep ref='nonAssessRef' v-model='model.nonPartin' rows='4' placeholder='请选择不参加民主测评的科级干部'-->
<!--              store='id' text='realname' :depart-id='model.depart' :get-leader='true' @change='partinLeadersChange'-->
<!--              style='width: 100%' />-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->

<!--      <div :class='model.nonPartin ? "form-row" : "form-row-none"' v-show='isNotEmptyStr(model.nonPartin)'-->
<!--        style='margin-bottom: 15px'>-->
<!--        <div class='form-row-left'>-->
<!--          <div class='form-item-title'>-->
<!--            <span style='color: red'>* </span>不参加民主测评原因：-->
<!--          </div>-->
<!--          <div class='form-item-input'>-->
<!--            <a-textarea v-model='model.nonPartinReason' rows='4' placeholder='不参加民主测评原因' style='width: 100%' />-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->

      <div class='form-row' style='margin-bottom: 15px'>
        <div class='form-row-left'>
          <div class='form-item-title'>
            <span style='color: red'>* </span>民主测评参加范围：
          </div>
          <div class='form-item-input'>
<!--              <a-input v-model='model.scope' placeholder='请输入民主测评参加范围' />-->
             <span>
              {{model.scope}}
             </span>
            <!-- <span>民主测评参加范围原则上应与上年度一致，一般为参加领导班子和领导干部年度总结考核会议人员，基层党员干部群众代表原则上不少于10%；在职干部人数少于50人的单位，一般应组织全体干部参加。各单位参评人员实到人数一般不少于应到人数80%</span> -->
          </div>
        </div>
        <div class='form-row-right'>
          <div class='form-item-title'>
            <span style='color: red'>* </span>民主测评领导班子成员应评人数：
          </div>
          <div class='form-item-input'>
            <a-form-model-item prop='voteA'>
              <a-input-number @change="numChange" v-model='model.voteA' placeholder='请输入领导班子成员应评人数' style='width: 400px !important;' />
            </a-form-model-item>
          </div>
        </div>
      </div>

      <div class='form-row' style='margin-bottom: 15px'>
        <div class='form-row-left'>
          <div class='form-item-title'>
            <span style='color: red'>* </span>联系人：
          </div>
          <div class='form-item-input'>
            <a-input v-model='model.contacts' placeholder='请输入联系人'></a-input>
          </div>
        </div>
        <div class='form-row-right'>
          <div class='form-item-title'>
            <span style='color: red'>* </span>民主评议职工代表参评人数：
          </div>
          <div class='form-item-input'>
            <a-form-model-item prop='voteB'>
              <a-input-number @change="numChange" v-model='model.voteB' placeholder='请输入民主评议职工代表应评人数' style='width: 400px !important;' />
            </a-form-model-item>
          </div>
        </div>
      </div>

      <div class='form-row' style='margin-bottom: 15px'>
        <div class='form-row-left'>
          <div class='form-item-title'>
            <span style='color: red'>* </span>办公电话：
          </div>
          <div class='form-item-input'>
            <a-input v-model='model.officeTel' placeholder='请输入办公电话'></a-input>
          </div>
        </div>
        <div class='form-row-right'>
          <div class='form-item-title'>
            <span style='color: red'>* </span>民主评议参评总人数：
          </div>
          <div class='form-item-input'>
            <a-form-model-item prop='partinNum'>
              <a-input readOnly v-model='model.partinNum' placeholder='无需输入，自动计算' style='width: 400px !important;' />
            </a-form-model-item>
          </div>
        </div>
      </div>

      <div class='form-row' style='margin-bottom: 15px'>
        <div class='form-row-left'>
          <div class='form-item-title'>
            <span style='color: red'>&nbsp;&nbsp;</span>需要说明的情况：
          </div>
          <div class='form-item-input'>
            <a-textarea v-model='model.remark' rows='4' placeholder='请输入需要说明的情况' style='width: 100% !important;' />
          </div>
        </div>
      </div>

<!--      <div class='form-row'>-->
<!--        <div class='form-row-left'>-->
<!--          <div class='form-item-title'>-->
<!--            <span style='color: red'>* </span>联系人：-->
<!--          </div>-->
<!--          <div class='form-item-input'>-->
<!--            <a-input v-model='model.contacts' placeholder='请输入联系人'></a-input>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class='form-row-right'>-->
<!--          <div class='form-item-title'>-->
<!--            <span style='color: red'>* </span>办公电话：-->
<!--          </div>-->
<!--          <div class='form-item-input'>-->
<!--            <a-input v-model='model.officeTel' placeholder='请输入办公电话' style='width: 50%'></a-input>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->

<!--      <div class='form-row'>-->
<!--        <div class='form-row-left'>-->
<!--          <div class='form-item-title'>-->
<!--            <span style='color: red'>&nbsp;&nbsp;</span>手机：-->
<!--          </div>-->
<!--          <div class='form-item-input'>-->
<!--            <a-form-model-item prop='contactsPhone'>-->
<!--              <a-input v-model='model.contactsPhone' placeholder='请输入手机' style='width: 100%'></a-input>-->
<!--            </a-form-model-item>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
    </a-form-model>
  </j-form-container>
</template>
<script>
import TSelectUserByDep from '@/component/TSelectUserByDep.vue'
import { getReportArrange, getReportNewLeaders } from '@/api/assessApis'

export default {
  name: 'AssessAnnualArrangeForm',
  components: { TSelectUserByDep },
  props: {
    disabled: {
      type: Boolean,
      default: false,
      required: false
    },
    objects: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      validatorRules: {
        num: [
          { required: false },
          { pattern: /^-?\d+$/, message: '请输入整数!' }
        ],
        partinNum: [
          { required: false },
          { pattern: /^-?\d+$/, message: '请输入整数!' }
        ],
        // evaluationNum: [
        //   { required: false },
        //   { pattern: /^-?\d+$/, message: '请输入整数!' }
        // ],
        contactsPhone: [
          { required: false },
          { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码!' }
        ]
      },
      confirmLoading: false,
      tempLeaders: '',
      tempLeaderNames: ''
    }
  },
  created() {
    //备份model原始值
    this.modelDefault = JSON.parse(JSON.stringify(this.model))
  },
  watch: {
    objects: {
      handler: function (val) {
        if (val && val.length > 0) {
          this.model.partinScope = val.map(item => item.name).join('，')
        } else {
          this.model.partinScope = ''
        }
      },
      immediate: true
    }
  },
  methods: {
    initFormData(fillId) {
      // this.clearFormData()
      if (!fillId) {
        this.edit(this.modelDefault)
      } else {
        getReportArrange(fillId).then(res => {
          if (res.success) {
            let records = res.result.records
            if (records && records.length > 0) {
              if (records[0].nonPartin === null || records[0].nonPartin === "") {
                // records[0].leaders = leaders
                // records[0].leaders_dictText = leadersName
              }
              this.edit(records[0])
            }
          }
        })
      }
    },
    numChange() {
      if (this.model.voteA < 0) {
        this.model.voteA = 0
      }

      if (this.model.voteB < 0) {
        this.model.voteB = 0
      }

      if (this.model.voteA && this.model.voteB && this.model.voteA >= 0 && this.model.voteB >= 0) {
        this.model.partinNum = this.model.voteA + this.model.voteB
      } else {
        this.model.partinNum = 0
      }
    },
    changeLeaders(aurl, aid, leaders, leadersName) {
      this.initFormData(aurl, aid, leaders, leadersName)
    },
    edit(record) {
      this.model = Object.assign({}, record)
    },

    clearFormData() {
      this.$refs.form.clearValidate()
    },
    isNotEmptyStr(s) {
      return typeof s == 'string' && s.length > 0
    },

    partinLeadersChange(e) {
      if (e === null || e === '') {
        this.model.leaders = this.tempLeaders
        this.model.leaders_dictText = this.tempLeaderNames
      }

      let selectedLeaders = this.$refs.nonAssessRef.storeVals
      let selectedLeaderNames = this.$refs.nonAssessRef.textVals
      // 将tempLeaders中的selectedLeaders去掉
      let tempLeaders = this.tempLeaders.split(',')
      let tempLeaderNames = this.tempLeaderNames.split('，')
      let newTempLeaders = []
      let newTempLeaderNames = []
      for (let i = 0; i < tempLeaders.length; i++) {
        if (selectedLeaders.indexOf(tempLeaders[i]) === -1) {
          newTempLeaders.push(tempLeaders[i])
          newTempLeaderNames.push(tempLeaderNames[i])
        }
      }
      this.model.leaders = newTempLeaders.join(',')
      this.model.leaders_dictText = newTempLeaderNames.join('，')
    },

  }
}
</script>

<style scoped>
.form-row {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  margin: 10px auto;
  transition: height 5s ease-in-out;
  font-size: 16px;
  font-weight: 600;
}

.form-row-none {
  height: 0;
}

.form-row-left {
  width: 45%;
  display: flex;
}

.form-row-right {
  width: 55%;
  display: flex;
  align-items: center;
}

.form-item-title {
  padding-left: 40px;
  width: 35%;
  height: 100%;
}

.form-item-input {
  width: 65%;
  display: flex;
  align-items: center;
}
.ant-form-item{
  margin: 0;
}
</style>
