<template>
  <!--  业务工作测评填报-->
  <a-spin :spinning="confirmLoading" style="overflow-y: scroll; max-height: 950px">
    <j-form-container :disabled="false">
      <!-- 主表单区域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <table>
          <tr>
            <td>考核名称</td>
            <td>{{ model.assessName }}</td>
            <td>年度</td>
            <td>{{ model.currentYear }}</td>
          </tr>
          <tr>
            <td>考核处室</td>
            <td>{{ model.reportDepart_dictText }}</td>
            <td>填报人</td>
            <td>
              <span>{{ model.reportBy }}</span>
            </td>
          </tr>
          <tr>
            <td v-if="model.auditBy">审核人</td>
            <td v-if="model.auditBy">{{ model.auditBy }}</td>
          </tr>

          <tr v-show="model.remark !== '' && model.remark !== null">
            <td>退回原因：</td>
            <td colspan="3">
              <div style="color: red">
                {{ model.remark }}
              </div>
            </td>

          </tr>
        </table>
        <div class="tag">
          <img src="@/assets/cadre/status/待提交.png" v-show="model.status === 1">
          <img src="@/assets/cadre/status/审核中.png" v-show="model.status === 2">
          <img src="@/assets/cadre/status/已完成.png" v-show="model.status === 3">
          <img src="@/assets/cadre/status/已退回.png" v-show="model.status === 4">
        </div>

        <!--        <seal :show-time='false' v-if="model.status === 3" style="position: absolute; top: -10px; right: 0" :show-title="true" :title="'审核人'" :content="model.auditBy" />-->

      </a-form-model>
    </j-form-container>

    <div style="margin: 10px 10px;">

      <!--       -->
      <tj-title value="本处室（单位）被表彰、通报批评情况"></tj-title>


      <div style="width: 100%;height:auto; display: flex; justify-content: space-between; padding: 30px 50px 0 0px;">

        <div class="onegood">
          <div class="good">
            <div class="control">
              <div>
                <img v-if="commendData.length>0" src="../../../../../assets/选中框1-1.png" alt="">
                <img v-if="commendData.length===0 && model.nonCommend" src="../../../../../assets/选中框1-2.png"
                     @click="checkBoxChangeC" alt="">
                <img v-if="commendData.length===0 && !model.nonCommend"
                     src="../../../../../assets/选中框1-2 (1).png"
                     @click="checkBoxChangeC" alt="">
                <span style="margin-left: 14px;font-size: 18px;">无表彰</span>
              </div>
              <img v-if="this.model.nonCommend || formDisabled" src="../../../../../assets/新增表彰2.png" alt=""
                   @click="handleAddC">
              <img v-else src="../../../../../assets/新增表彰1.png" alt=""
                   @click="handleAddC">

            </div>


          </div>
          <div>
            <a-table
              ref="table"
              size="middle"
              rowKey="id"
              class="onegoodtable"
              :scroll="{ x: true }"
              :columns="columnsgood"
              :dataSource="commendData"
              :pagination="false"
            >
              <span slot="action" slot-scope="text, record">
                <a :disabled="formDisabled" @click="handleEditC(record)">编辑</a>
                <a-divider type="vertical" />
                <a :disabled="formDisabled" @click="handleDeleteC(record.id)">删除</a>
              </span>
            </a-table>
          </div>

        </div>

        <div class="oneright">


          <div class="bad">
            <div class="control">
              <div>
                <img v-if="denounceData.length>0" src="../../../../../assets/选中框2-1.png" alt="">
                <img v-if="denounceData.length===0 && model.nonDenounce"
                     src="../../../../../assets/选中框2-2.png"
                     @click="checkBoxChangeD" alt="">
                <img v-if="denounceData.length===0 && !model.nonDenounce"
                     src="../../../../../assets/矩形 69 (2).png"
                     @click="checkBoxChangeD" alt="">
                <span style="margin-left: 14px;font-size: 18px;">无通报批评</span>
              </div>
              <img v-if="model.nonDenounce || formDisabled" src="../../../../../assets/新增通报2.png" alt=""
                   @click="handleAddD">
              <img v-else src="../../../../../assets/新增通报1.png" alt="" @click="handleAddD">
              <!-- <img src="../../../../../assets/矩形 69 (2).png" alt=""> 无通报
            <img src="../../../../../assets/新增通报1.png" alt=""> -->
            </div>
          </div>
          <div>
            <a-table
              ref="table"
              size="middle"
              rowKey="id"
              class="j-table-force-nowrap"
              :scroll="{ x: true }"
              :columns="columnsbad"
              :dataSource="denounceData"
              :pagination="false"
            >
              <span slot="action" slot-scope="text, record">
                <a :disabled="formDisabled" @click="handleEditD(record)">编辑</a>
                <a-divider type="vertical" />
                <a :disabled="formDisabled" @click="handleDeleteD(record.id)">删除</a>
              </span>
            </a-table>
          </div>
        </div>
        <!-- <a-checkbox :disabled='commendData.length > 0' @change='checkBoxChangeC'>
          无表彰
        </a-checkbox>
        <a-button :disabled='noCommend' style='margin: 0 20px; display: inline-block' @click='handleAddC'
                  type='primary' icon='plus'>新增表彰
        </a-button>
        <a-checkbox :disabled='denounceData.length > 0' @change='checkBoxChangeD'>
          无通报
        </a-checkbox>
        <a-button :disabled='noDenounce' style='display: inline-block' @click='handleAddD' type='primary' icon='plus'>
          新增通报
        </a-button> -->
      </div>
    </div>
    <div style="display: flex;padding-left: 12px">
      <tj-title value="业务工作测评"></tj-title>
    </div>
    <div style="display: flex;padding-left: 12px">
      <span style="margin-top: 24px;color: #cc0000;font-size: 16px;" v-if="mustFillDepart!=''">
        您当前必须考核得处室（单位）是【{{mustFillDepart}}】！
      </span>
    </div>

    <div style="padding-left: 12px;padding-right: 12px;">
      <t-editable-table
        :ref="refKeys[0]"
        :loading="assessBusinessFillItemTable.loading"
        :columns="assessBusinessFillItemTable.columns"
        :dataSource="assessBusinessFillItemTable.dataSource"
        :maxHeight="500"
        :disabled="formDisabled"
        :rowNumber="true"
        :rowSelection="true"
        :actionButton="true" />
    </div>
    <assess-business-commend-modal ref="modalFormC" @ok="modalFormOkC"></assess-business-commend-modal>
    <assess-business-denounce-modal ref="modalFormD" @ok="modalFormOkD"></assess-business-denounce-modal>

  </a-spin>
</template>

<script>
import { deleteAction, getAction, httpAction } from '@/api/manage'
import { FormTypes, getRefPromise, VALIDATE_NO_PASSED, validateFormModelAndTables } from '@/utils/JEditableTableUtil'
import { JEditableTableModelMixin } from '@/mixins/JEditableTableModelMixin'
import { validateDuplicateValue } from '@/utils/util'
import DictModal from '@views/system/modules/DictModal.vue'
import { saveAndPassAudit, saveBusinessFill } from '@api/assessApis'
import store from '@/store'
import TEditableTable from '@/component/TEditableTable.vue'
import AssessBusinessCommendModal from '@/views/assess/business/commend/modules/AssessBusinessCommendModal.vue'
import AssessBusinessDenounceModal from '@/views/assess/business/denounce/modules/AssessBusinessDenounceModal.vue'
import TjTitle from '@/component/TjTitle.vue'
import seal from '@/component/Seal.vue'

export default {
  name: 'BusinessAssessDepartFillForm',
  mixins: [JEditableTableModelMixin],
  components: {
    seal,
    AssessBusinessDenounceModal,
    AssessBusinessCommendModal,
    TEditableTable,
    DictModal,
    TjTitle
  },
  data() {
    return {
      disabled: false,
      columnsgood: [
        {

          title: '表彰单位',
          align: 'center',
          dataIndex: 'commendUnit'

        },
        {
          title: '时间',
          align: 'center',
          dataIndex: 'commendTime'
        },
        {
          title: '内容',
          align: 'center',
          dataIndex: 'commendProject'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      columnsbad: [
        {

          title: '通报单位',
          align: 'center',
          dataIndex: 'denounceUnit'
        },
        {
          title: '时间',
          align: 'center',
          dataIndex: 'denounceTime'
        },
        {
          title: '内容',
          align: 'center',
          dataIndex: 'denounceProject'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      dataSourcegood: false,
      dataSourcebad: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      model: {},
      // 新增时子表默认添加几行空数据
      addDefaultRowNum: 1,
      validatorRules: {},
      refKeys: ['assessBusinessFillItem'],
      tableKeys: ['assessBusinessFillItem'],
      activeKey: 'assessBusinessFillItem',
      // 业务工作测评填报项目
      assessBusinessFillItemTable: {
        loading: false,
        dataSource: [],
        columns: [
          {
            title: '被考核处室（单位）',
            key: 'departCode_dictText',
            disabled: true,
            align: 'center',
            width: '200px',
            placeholder: '请输入${title}',
            defaultValue: ''
          },
          {
            title: '分数',
            key: 'score',
            type: FormTypes.select  ,
            width: '150px',
            placeholder: '请输入${title}',
            defaultValue: ''
          },
          {
            title: '扣分原因',
            key: 'reasonOfDeduction',
            type: FormTypes.input,
            width: '75%',
            placeholder: '请输入${title}',
            defaultValue: ''
          }
        ]
      },
      url: {
        add: '/modules/businessAssessDepartFill/add',
        edit: '/modules/businessAssessDepartFill/edit',
        queryById: '/modules/businessAssessDepartFill/queryById',
        assessBusinessFillItem: {
          list: '/modules/businessAssessDepartFill/queryAssessBusinessFillItemByMainId',
          queryAssessBusinessMustFill: '/modules/businessAssessDepartFill/queryAssessBusinessMustFill'
        }
      },
      currentUser: {},
      noCommend: false,
      noDenounce: false,
      commendData: [],
      denounceData: [],
      mustFillDepart: ''
    }
  },
  // props: {
  //   //表单禁用
  //   disabled: {
  //     type: Boolean,

  //   }
  // },
  computed: {
    formDisabled() {
      return this.disabled

    }

  },
  mounted() {
  },
  created() {
    this.currentUser = store.getters.userInfo
    // this.getCommendData()
    // this.getDenounceData()
//     GET:   /modules/assessBusiness/current/cd

// 查询参数：year : String   （年度）
//                  depart : String（单位ID）

// 返回示例：
// {
//   commend: [ ],
//   denounce: [ ]
// }

  },
  methods: {
    getCommendData() {

      // getAction('/modules/assessBusinessCommend/list').then(res => {
      //   if (res.success) {
      //     this.commendData = res.result.records
      //   }
      // })
      getAction('/modules/assessBusiness/current/cd', {
        year: this.model.currentYear,
        depart: this.model.reportDepart
      }).then(res => {
        this.commendData = res.result.commend
        this.denounceData = res.result.denounce
        // if (!fill) {
        //   if (this.commendData.length === 0) {
        //     this.noCommend = true
        //   }
        //   if (this.denounceData.length === 0) {
        //     this.noDenounce = true
        //   }
        // }
      })
    },
    getDenounceData() {
      getAction('/modules/assessBusinessDenounce/list').then(res => {
        if (res.success) {
          this.denounceData = res.result.records
        }
      })
    },
    checkBoxChangeC() {
      if (this.formDisabled) {
        return
      }
      if (this.model.nonCommend === undefined || this.model.nonCommend === null || this.model.nonCommend === false) {
        this.model.nonCommend = true
      } else {
        this.model.nonCommend = false
      }
    },
    checkBoxChangeD() {
      if (this.formDisabled) {
        return
      }
      if (this.model.nonDenounce === undefined || this.model.nonDenounce === null || this.model.nonDenounce === false) {
        this.model.nonDenounce = true
      } else {
        this.model.nonDenounce = false
      }
    },
    handleAddC: function() {
      if (this.model.nonCommend || this.formDisabled) {
        return
      }
      this.model.nonCommend = false
      this.$refs.modalFormC.add()
      this.$refs.modalFormC.title = '新增表彰'
      this.$refs.modalFormC.disableSubmit = false

    },
    handleAddD: function() {
      if (this.model.nonDenounce || this.formDisabled) {
        return
      }
      this.model.nonDenounce = false
      this.$refs.modalFormD.add()
      this.$refs.modalFormD.title = '新增通报批评'
      this.$refs.modalFormD.disableSubmit = false
    },
    handleEditC: function(record) {
      this.$refs.modalFormC.edit(record)
      this.$refs.modalFormC.title = '编辑'
      this.$refs.modalFormC.disableSubmit = false
    },
    handleEditD: function(record) {
      this.$refs.modalFormD.edit(record)
      this.$refs.modalFormD.title = '编辑'
      this.$refs.modalFormD.disableSubmit = false
    },
    handleDeleteC: function(id) {
      var that = this
      deleteAction('/modules/assessBusinessCommend/delete', { id: id }).then((res) => {
        if (res.success) {
          this.getCommendData()
        } else {
          // that.$message.warning(res.message)
          this.$error({
            title: '错误',
            content: res.message
          })
        }
      })
    },
    handleDeleteD: function(id) {
      var that = this
      deleteAction('/modules/assessBusinessDenounce/delete', { id: id }).then((res) => {
        if (res.success) {
          this.getCommendData()
        } else {
          // that.$message.warning(res.message)
          this.$error({
            title: '错误',
            content: res.message
          })
        }
      })
    },

    modalFormOkC() {
      // 新增/修改 成功时，重载列表
      this.getCommendData()
    },
    modalFormOkD() {
      // 新增/修改 成功时，重载列表
      this.getCommendData()
      // this.getDenounceData()
    },
    edit(record) {
      if (record && '{}' != JSON.stringify(record) && record.id) {
        this.tableReset()
      }

      if (typeof this.editBefore === 'function') this.editBefore(record)
      this.visible = true
      this.activeKey = this.refKeys[0]
      this.$refs.form.resetFields()
      this.model = Object.assign({}, record)
      if (this.model.reportBy === '' || this.model.reportBy === null) {
        this.model.reportBy = this.currentUser.realname
      }
      if (typeof this.editAfter === 'function') this.editAfter(this.model)

      this.getCommendData()
      this.mustFill()

    },
    addBefore() {
      this.assessBusinessFillItemTable.dataSource = []
    },
    getAllTable() {
      let values = this.tableKeys.map(key => getRefPromise(this, key))
      return Promise.all(values)
    },
    //查询必须填报项
    async mustFill() {
      this.mustFillDepart = ''
      let params = { id: this.model.id }
      let res = await getAction(this.url.assessBusinessFillItem.queryAssessBusinessMustFill, params)
      if (res.success) {
        let result = res.result.records
        let tempStr = ''
        if (result.length > 0) {
          result.forEach((value, index) => {
            tempStr += value.departCode_dictText
            if (index != result.length - 1) {
              tempStr += ','
            }
          })
          this.mustFillDepart = tempStr
        }
      }
    },
    /** 调用完edit()方法之后会自动调用此方法 */
    editAfter() {
      this.$nextTick(() => {
      })
      // 加载子表数据
      if (this.model.id) {
        let params = { id: this.model.id }
        this.requestSubTableData(this.url.assessBusinessFillItem.list, params, this.assessBusinessFillItemTable)
      }
    },
    requestSubTableData(url, params, tab, success) {
      tab.loading = true
      getAction(url, params).then(res => {
        let { result } = res
        let dataSource = []
        if (result) {
          if (Array.isArray(result)) {
            dataSource = result
          } else if (Array.isArray(result.records)) {
            dataSource = result.records
          }
        }
        for (let i = 0; i < dataSource.length; i++) {
          if (dataSource[i].score) {
            dataSource[i].score = this.getScoreArr(dataSource[i].score)
          }
        }
        tab.dataSource = dataSource
        console.log("表格数据")
        console.log(tab.dataSource)
        typeof success === 'function' ? success(res) : ''
      }).finally(() => {
        tab.loading = false
      })
    },

    getScoreArr(score){
      // 对5取余
      let arr = []
      score % 5 === 0 ? arr = [score] : arr = [score - (score % 5), score]
      console.log("处理分数")
      console.log(arr)
      return arr
    },

    //校验所有一对一子表表单
    validateSubForm(allValues) {
      return new Promise((resolve, reject) => {
        Promise.all([]).then(() => {
          resolve(allValues)
        }).catch(e => {
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
        assessBusinessFillItemList: allValues.tablesValue[0].values
      }
    },
    validateError(msg) {
      // this.$message.error(msg)
      // this.$confirm({
      //   title: '消息提示',

      //   content: h => <div style="color:red;">{res.message}</div>,

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

    handleSave() {
      /** 触发表单验证 */
      this.getAllTable().then(tables => {
        /** 一次性验证主表和所有的次表 */
        return validateFormModelAndTables(this.$refs.form, this.model, tables)
      }).then(allValues => {
        /** 一次性验证一对一的所有子表 */
        return this.validateSubForm(allValues)
      }).then(allValues => {
        if (typeof this.classifyIntoFormData !== 'function') {
          throw this.throwNotFunction('classifyIntoFormData')
        }
        let formData = this.classifyIntoFormData(allValues)
        console.log("保存的数据")
        console.log(formData)

        // 遍历formData
        for (let key in formData.assessBusinessFillItemList) {
          if (formData.assessBusinessFillItemList[key].score && formData.assessBusinessFillItemList[key].score instanceof Array) {
            formData.assessBusinessFillItemList[key].score = formData.assessBusinessFillItemList[key].score[formData.assessBusinessFillItemList[key].score.length - 1]
          }
        }

        saveBusinessFill(formData).then(res => {

          if (res.success) {
            this.$success({
              title: '成功',
              content: res.message
            })
            this.$emit('ok')
            this.close()
          } else {
            // this.$message.warning(res.message)
            // this.$confirm({
            //   title: '消息提示',

            //   content: h => <div style="color:red;">{res.message}</div>,

            //   onOk: () => {

            //   },

            //   onCancel: () => {

            //   }

            // })
            this.$warning({
              title: '警告',
              content: res.message
            })
          }
        })
      })

    },
    passAndSubmit() {
      /** 触发表单验证 */
      this.getAllTable().then(tables => {
        /** 一次性验证主表和所有的次表 */
        return validateFormModelAndTables(this.$refs.form, this.model, tables)
      }).then(allValues => {
        /** 一次性验证一对一的所有子表 */
        return this.validateSubForm(allValues)
      }).then(allValues => {
        if (typeof this.classifyIntoFormData !== 'function') {
          throw this.throwNotFunction('classifyIntoFormData')
        }
        let formData = this.classifyIntoFormData(allValues)
        saveAndPassAudit(formData).then(res => {
          if (res.success) {
            // this.$message.success(res.message)
            // this.$confirm({
            //   title: '消息提示',

            //   content: h => <div style="color:red;">{res.message}</div>,

            //   onOk: () => {

            //   },

            //   onCancel: () => {

            //   }

            // })
            this.$success({
              title: '成功',
              content: res.message
            })
            this.$emit('ok')
            this.close()
          } else {
            // this.$message.warning(res.message)
            // this.$confirm({
            //   title: '消息提示',

            //   content: h => <div style="color:red;">{res.message}</div>,

            //   onOk: () => {

            //   },

            //   onCancel: () => {

            //   }

            // })
            this.$error({
              title: '错误',
              content: res.message
            })
          }
          this.$emit('changeLoading')

        })
      })

    },

    beforeHandleOk() {
      /** 触发表单验证 */
      let hasScore = false
      this.getAllTable().then(tables => {
        /** 一次性验证主表和所有的次表 */
        return validateFormModelAndTables(this.$refs.form, this.model, tables)
      }).then(allValues => {
        /** 一次性验证一对一的所有子表 */
        return this.validateSubForm(allValues)
      }).then(allValues => {
        if (typeof this.classifyIntoFormData !== 'function') {
          throw this.throwNotFunction('classifyIntoFormData')
        }
        let formData = this.classifyIntoFormData(allValues)

        let items = formData.assessBusinessFillItemList
        for (let i = 0; i < items.length; i++) {
          if (items[i].score !== undefined && items[i].score !== null && items[i].score !== '') {
            hasScore = true
          }
        }
      }).then(() => {

        if (!hasScore) {
          this.$warning({
            title: '未填写分数',
            content: '请至少给一个单位评分'
          })
        } else {
          if (this.commendData.length <= 0 && (this.model.nonCommend === false || this.model.nonCommend === undefined || this.model.nonCommend === null)) {
            this.$warning({
              title: '未填写受表彰情况',
              content: '请填写本单位受表彰情况，如无表彰，请勾选新增表彰按钮左侧的“无表彰”'
            })
          } else if (this.denounceData.length <= 0 && (this.model.nonDenounce === false || this.model.nonDenounce === undefined || this.model.nonDenounce === null)) {
            this.$warning({
              title: '未填写受通报情况',
              content: '请填写本单位受通报情况，如无通报，请勾选新增通报按钮左侧的“无通报”'
            })
          } else {
            this.handleOk()
          }
        }

      })

    },

    handleOk() {
      /** 触发表单验证 */
      this.getAllTable().then(tables => {
        /** 一次性验证主表和所有的次表 */
        // console.log(this.$refs.form,this.model, tables)
        // const weightA = Number(this.model.weightA);
        // const weightB = Number(this.model.weightB);
        // const weightC = Number(this.model.weightC);
        // if (weightA + weightB + weightC !== 100) {
        //   this.$message.error('a + b + c 必须等于 100');
        //   return Promise.reject(new Error('a + b + c 必须等于 100'));
        // }

        return validateFormModelAndTables(this.$refs.form, this.model, tables)

      }).then(allValues => {
        /** 一次性验证一对一的所有子表 */
        // const scores = allValues.tablesValue[0].values.map(item => Number(item.score));
        // const totalScore = scores.reduce((sum, score) => sum + score, 0);

        // if (isNaN(totalScore)) {
        //   this.$message.error('请输入有效的数值');
        //   return Promise.reject(new Error('请输入有效的数值'));
        // }

        // if (totalScore !== 100) {
        //   this.$message.error('所有项的 score 必须等于 100');
        //   return Promise.reject(new Error('所有项的 score 必须等于 100'));
        // }
        // console.log(allValues.tablesValue[0].values)
        return this.validateSubForm(allValues)
      }).then(allValues => {
        if (typeof this.classifyIntoFormData !== 'function') {
          throw this.throwNotFunction('classifyIntoFormData')
        }
        let formData = this.classifyIntoFormData(allValues)

        // 遍历formData
        for (let key in formData.assessBusinessFillItemList) {
          if (formData.assessBusinessFillItemList[key].score && formData.assessBusinessFillItemList[key].score instanceof Array) {
            formData.assessBusinessFillItemList[key].score = formData.assessBusinessFillItemList[key].score[formData.assessBusinessFillItemList[key].score.length - 1]
          }
        }
        // 发起请求
        return this.request(formData)
      }).catch(e => {
        if (e.error === VALIDATE_NO_PASSED) {
          // 如果有未通过表单验证的子表，就自动跳转到它所在的tab
          //update--begin--autor:liusq-----date:20210316------for：未通过表单验证跳转tab问题------
          this.activeKey = e.index == null ? this.activeKey : (e.paneKey ? e.paneKey : this.refKeys[e.index])
          //update--end--autor:liusq-----date:20210316------for：未通过表单验证跳转tab问题------
        } else {
          console.error(e)
        }
      })
    },


    // request(formData) {
    //   let url = this.url.add, method = 'post'
    //   if (this.model.id) {
    //     url = this.url.edit
    //     method = 'put'
    //   }
    //   this.confirmLoading = true
    //   // httpAction(url, formData, method).then((res) => {
    //   //   if (res.success) {
    //   //     this.$message.success(res.message)
    //   //     this.$emit('ok')
    //   //     this.close()
    //   //   } else {
    //   //     this.$message.warning(res.message)
    //   //   }
    //   // }).finally(() => {
    //   //   this.confirmLoading = false
    //   // })
    // },

  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-spin-nested-loading {

  border: 0px solid rgb(234, 235, 234);

}

/* /deep/ .onegoodtable>.ant-table-thead > tr > th {
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
    text-align: left;
    background: rgb(253, 241, 226) !important;
    border-bottom: 1px solid #e8e8e8;
    transition: background 0.3s ease;
} */
.control {
  position: absolute;
  right: 0;
  width: 50%;
  height: 100px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 20px;
}

.onegood {
  width: 49%;
  height: auto;
}

.oneright {
  width: 49%;
  height: auto;
}

.good {
  width: 100%;
  height: auto;
  background-image: url("../../../../../assets/组合 1144.png");
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: 0% 0%;
  min-height: 100px;
  overflow: hidden;
  position: relative

}

.bad {
  width: 100%;
  background-image: url("../../../../../assets/组合 1145.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  min-height: 100px;
  height: auto;
  position: relative

}

.ant-spin-nested-loading {
  position: relative;
  background-color: white;
  border: 0px solid rgb(234, 235, 234);
  padding: 10px 0px;
}

table {
  margin: 0 auto;
  width: 95%;
  height: 150px;
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

/deep/ .ant-tag {
  padding: 3px 10px;
  font-size: 16px;
}

/deep/ .ant-tabs {
  width: 95%;
  height: 450px;
  margin: 0 auto;
  font-size: 18px;

  .ant-tabs-tab {
    font-size: 20px;
    font-weight: 700;
    color: #091834;
  }

  .ant-tabs-ink-bar {
    display: none !important;
  }

  .ant-row-flex {
    display: none;
  }

  .input-table {
    .thead {
      .tr {
        color: #4B5470;
        font-size: 16px;
        font-weight: 700;
      }
    }

    .tbody {
      .tr {
        .ant-select-selection-selected-value {
          color: #091834;
        }

        .td:nth-child(2) {
          //width: 250px !important;
          i {
            display: none;
          }
        }
      }
    }
  }
}
</style>