<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <table>
          <tr>
            <td style="width: 160px; text-align: center">考核名称</td>
            <td style="width: 30%">{{ model.assessName }}</td>
            <td style="width: 160px; text-align: center">处室</td>
            <td>{{ model.departmentCode_dictText }}</td>
          </tr>
          <tr>
            <td style="width: 160px; text-align: center">年度</td>
            <td>{{ model.currentYear }}</td>
            <td style="width: 160px; text-align: center">填报人</td>
            <td>{{ model.reportBy }}</td>
          </tr>
          <tr>
            <td style="width: 160px; text-align: center">季度</td>
            <td>{{ model.currentQuarter }}</td>
            <td style="width: 160px; text-align: center" v-if="model.auditBy">审核人</td>
            <td v-if="model.auditBy">{{ model.auditBy }}</td>
          </tr>
        </table>
        <div class="tag">
          <img src="@/assets/cadre/status/待提交.png" v-show="model.status === '1'">
          <img src="@/assets/cadre/status/审核中.png" v-show="model.status === '2'">
          <img src="@/assets/cadre/status/已完成.png" v-show="model.status === '3'">
          <img src="@/assets/cadre/status/已退回.png" v-show="model.status === '4'">
        </div>

        <!-- 印章效果 -->
<!--        <div class="seal">-->
<!--          <div>审核人</div>-->
<!--          <div class="seal-status">{{ model.auditBy }}</div>-->
<!--          <div>{{model.updateTime}}</div>-->
<!--        </div>-->

<!--        <seal :show-time='false' v-if="model.status === '3'" style="position: absolute; top: -10px; right: 0" :show-title="true" :title="'审核人'" :content="model.auditBy" />-->


      </a-form-model>
    </j-form-container>
    <!-- 子表单区域 -->
    <a-tabs style="height: 600px" v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="平时考核成绩填报" :key="refKeys[0]" :forceRender="true">
        <div
          style="
            width: 100%;
            text-align: left;
            margin: 10px auto 20px;
            font-size: 20px;
            font-weight: bold; /* 字体加粗 */
            padding: 10px;
          "
        >
          当前季度共可评“好”等次 <span style="color: red"> {{ totalQuota }}</span
        >人，剩余可评 <span style="color: red">{{ remainingQuota }}</span> 人
        </div>
        <t-editable-table-reg
          :ref="refKeys[0]"
          :loading="assessRegularReportItemTable.loading"
          :columns="assessRegularReportItemTable.columns"
          :dataSource="assessRegularReportItemTable.dataSource"
          :maxHeight="430"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="false"
          :actionButton="false"
          @valueChange="handleEditClosed"
        />
      </a-tab-pane>
    </a-tabs>
  </a-spin>
</template>

<script>
import { getAction } from '@/api/manage'
import { FormTypes, getRefPromise, VALIDATE_NO_PASSED } from '@/utils/JEditableTableUtil'
import { JEditableTableModelMixin } from '@/mixins/JEditableTableModelMixin'
import store from '@/store'
import TEditableTableReg from '@/component/TEditableTableReg.vue'
import seal from '@/component/Seal.vue'
import { getCurrentUserRoles } from '@/api/assessApis'

export default {
  name: 'AssessRegularReportForm',
  mixins: [JEditableTableModelMixin],
  components: { seal, TEditableTableReg },
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      model: {},
      currentUserInfo: {},
      // 新增时子表默认添加几行空数据
      addDefaultRowNum: 1,
      validatorRules: {
        assessName: [{ required: true, message: '请输入考核名称!' }],
        currentYear: [{ required: true, message: '请输入年度!' }],
        departmentCode: [{ required: true, message: '请输入处室!' }],
        deadline: [{ required: true, message: '请输入截止日期!' }]
      },
      refKeys: ['assessRegularReportItem'],
      tableKeys: ['assessRegularReportItem'],
      activeKey: 'assessRegularReportItem',
      // 平时考核填报明细表
      assessRegularReportItemTable: {
        loading: false,
        dataSource: [],
        columns: [
          {
            title: '姓名',
            key: 'name',
            disabled: true,
            dictCode: 'sys_user,realname,id',
            width: '150px',
            placeholder: '请输入${title}',
            defaultValue: '',
            validateRules: [{ required: true, message: '${title}不能为空' }]
          },
          {
            title: '第一季度',
            key: 'quarter1',
            type: FormTypes.select,
            dictCode: 'regular_assess_level',
            disabled: false,
            placeholder: '请输入${title}',
            defaultValue: ''
          },
          {
            title: '第二季度',
            key: 'quarter2',
            type: FormTypes.select,
            dictCode: 'regular_assess_level',
            disabled: false,
            placeholder: '请输入${title}',
            defaultValue: ''
          },
          {
            title: '第三季度',
            key: 'quarter3',
            type: FormTypes.select,
            dictCode: 'regular_assess_level',
            disabled: false,
            placeholder: '请输入${title}',
            defaultValue: ''
          },
          {
            title: '第四季度',
            key: 'quarter4',
            type: FormTypes.select,
            dictCode: 'regular_assess_level',
            disabled: false,
            placeholder: '请输入${title}',
            defaultValue: ''
          }
        ]
      },
      url: {
        add: '/regular/report/add',
        edit: '/regular/report/edit',
        queryById: '/regular/report/queryById',
        assessRegularReportItem: {
          list: '/regular/report/queryByMainId',
          sublistRemainingSeats: '/regular/report/sublistRemainingSeats'
        }
      },
      totalQuota: 0,
      remainingQuota: 0
    }
  },
  props: {
    //表单禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  computed: {
    formDisabled() {
      return this.disabled
    }
  },
  created() {
    // debugger
    this.currentUserInfo = store.getters.userInfo
    this.$watch('model.currentQuarter', (newValue, oldValue) => {
      if (newValue) {
        const quarters = ['quarter1', 'quarter2', 'quarter3', 'quarter4']
        this.assessRegularReportItemTable.columns.forEach((column) => {
          if (quarters.includes(column.key)) {
            column.disabled = column.key !== `quarter${newValue}`
          }
        })
      }
    })
  },
  methods: {
    addBefore() {
      this.assessRegularReportItemTable.dataSource = []
    },
    getAllTable() {
      let values = this.tableKeys.map((key) => getRefPromise(this, key))
      return Promise.all(values)
    },
    /** 调用完edit()方法之后会自动调用此方法 */
    editAfter() {
      this.$nextTick(() => {
      })
      // 加载子表数据
      if (this.model.id) {
        let params = { id: this.model.id }
        this.requestSubTableData(this.url.assessRegularReportItem.list, params, this.assessRegularReportItemTable)
        this.computeRemainingSeats(params) //计算剩余座位数
        this.checkReportPerson()
      }
    },
    //校验所有一对一子表表单
    validateSubForm(allValues) {
      return new Promise((resolve, reject) => {
        Promise.all([])
          .then(() => {
            resolve(allValues)
          })
          .catch((e) => {
            if (e.error === VALIDATE_NO_PASSED) {
              // 如果有未通过表单验证的子表，就自动跳转到它所在的tab
              this.activeKey = e.index == null ? this.activeKey : this.refKeys[e.index]
            } else {
              console.error(e)
            }
          })
      })
    },
    /** 整理成formData */
    classifyIntoFormData(allValues) {
      let main = Object.assign(this.model, allValues.formValue)
      return {
        ...main, // 展开
        assessRegularReportItemList: allValues.tablesValue[0].values
      }
    },
    validateError(msg) {
      // this.$message.error(msg)
      // this.$confirm({
      //   title: '消息提示',
      //   content: (h) => <div style="color:red;">{msg}</div>,
      //   onOk: () => {
      //   },
      //   onCancel: () => {
      //   }
      // })
      this.$error({
        title: '错误',
        content: msg
      })
    },
    checkReportPerson() {
      getCurrentUserRoles().then(res => {
        if (res.success) {
          // 判断数组中是否包含"department_cadre_admin"
          if (!res.result.includes("department_cadre_admin")){
            if (!this.model.reportBy) {
              // this.model.reportBy = this.currentUserInfo.id
              this.model.reportBy = this.currentUserInfo.realname
            }
          }
        }
      })
    },
    handleSubmit() {
      // 获取当前季度
      const currentQuarter = this.model.currentQuarter

      // 根据当前季度检查是否填写
      const currentQuarterKey = `quarter${currentQuarter}`

      // 获取当前季度的内容
      // 确保 dataSource 是最新的
      const currentQuarterValue = this.assessRegularReportItemTable.dataSource.map((item) => item[currentQuarterKey])

      // 检查是否有未填写的项
      const isAllFilled = currentQuarterValue.every((value) => value !== null && value !== undefined && value !== '')

      if (!isAllFilled) {
        this.$warning({
          title: '提示',
          content: '当前季度的内容尚未全部填写，请检查！'
        })
        return // 阻止提交
      }

      this.model.status = '2' // 提交时，状态变更为已完成
      this.handleOk()
    },

    computeRemainingSeats(params) {
      // 计算剩余座位数
      getAction(this.url.assessRegularReportItem.sublistRemainingSeats, params).then((res) => {
        this.totalQuota = res.totalQuota
        this.remainingQuota = res.remainingQuota
      })
    },
    handleEditClosed(event) {
      let { row, column } = event

      // 获取所有单元格的值
      this.$refs.assessRegularReportItem.getValuesPromise().then((res) => {
        // 更新 dataSource 为最新的值
        this.assessRegularReportItemTable.dataSource = res

        // 计算当前 A 的总数
        const countA = res.filter((item) => item[column.key] === 'A').length

        // 检查数量是否超过总配额
        if (countA > this.totalQuota) {
          // 提示用户
          this.$warning({
            title: '提示',
            content: '超过所给名额，无法设置为 “好”'
          })

          // 将当前单元格的值设置为 null
          this.$refs.assessRegularReportItem.setValues([
            {
              rowKey: row.id, // 使用当前行的 key
              values: { [column.key]: null } // 设置为 null
            }
          ])
        } else {
          // 更新 remainingQuota
          this.remainingQuota = this.totalQuota - countA
        }
      })
    }
  }
}
</script>

<style scoped>
table {
  margin: 0 auto;
  width: 95%;
  height: 110px;
  font-size: 16px;
  font-weight: 500;
  color: #091834;

  tr {
    td {
      padding-left: 30px;
      border: 1px solid #CCD4D7;
      border-collapse: collapse; /* 移除单元格之间的间隔 */

      /deep/ i {
        display: none;
      }

      /deep/ .ant-input {
        //width: 100%;
        font-size: 16px;
        font-weight: 500;
        color: #091834;
        border: 0;
        transform: translateX(-30px);
        background-color: white;
      }
    }

    td:nth-child(1), td:nth-child(3) {
      background-color: #F4F8FA;
      color: #25477C;
    }
  }
}

.tag {
  position: absolute;
  top: -10px;
  right: 0;
}

</style>
