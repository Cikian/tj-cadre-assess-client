<template>
  <j-form-container :disabled="disabled">
    <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">

      <div class="form-row" style="margin-bottom: 15px">
        <div class="form-row-left" v-if="departType !== 'bureau'">
          <div class="form-item-title">
            <span style="color: red">* </span>联系人：
          </div>
          <div class="form-item-input">
            <a-input v-model="model.contacts" placeholder="请输入联系人"></a-input>
          </div>
        </div>

        <div :class="departType === 'bureau'? 'form-row-left' : 'form-row-right'">
          <div class="form-item-title"><span style="color: red">&nbsp;&nbsp;  </span>本单位正职人数：</div>
          <div class="form-item-input">
            {{ model.chiefNum }}
          </div>
        </div>
      </div>

      <div class="form-row" style="margin-bottom: 15px">
        <div class="form-row-left" v-if="departType !== 'bureau'">
          <div class="form-item-title"><span style="color: red">* </span>办公电话：</div>
          <div class="form-item-input">
            <a-input v-model="model.officeTel" placeholder="请输入办公电话" style="width: 100%"></a-input>
          </div>
        </div>
        <div :class="departType === 'bureau'? 'form-row-left' : 'form-row-right'">
          <div class="form-item-title"><span style="color: red">&nbsp;&nbsp;  </span>本单位副职人数：</div>
          <div class="form-item-input">
            {{ model.deputyNum }}
          </div>
        </div>
      </div>

      <div class="form-row" style="margin-bottom: 15px">
        <div class="form-row-left" v-if="departType !== 'bureau'">
          <div class="form-item-title"><span style="color: red">&nbsp;&nbsp;</span>手机：</div>
          <div class="form-item-input">
            <a-input v-model="model.contactsPhone" placeholder="请输入手机" style="width: 100%"></a-input>
          </div>
        </div>
        <div :class="departType === 'bureau'? 'form-row-left' : 'form-row-right'">
          <div class="form-item-title"><span style="color: red">* </span> <span v-if="departType === 'bureau'">参与民主测评其他人数：</span><span
            v-else>职工代表人数：</span></div>
          <div class="form-item-input">

            <a-tooltip placement="topLeft">
              <template slot="title">
                <span
                  v-if="departType === 'bureau'">请输入本处室参加民主测评的其他人员（除本处室正副处长以及党组织关系在本处室的局管总师和二巡的其他人员）</span>
                <span v-else>请输入本单位参加民主测评的职工代表人数</span>
              </template>
              <a-input-number v-model="model.voteC" @change="numChange" placeholder="请输入参加民主测评职工代表人数"
                              style="width: 100%" />
            </a-tooltip>

          </div>
        </div>
      </div>

      <div class="form-row" style="margin-bottom: 15px">
        <div class="form-row-left">
          <div class="form-item-title"><span style="color: red">&nbsp;&nbsp;</span>需要说明的情况：</div>
          <div class="form-item-input">
            <a-textarea v-model="model.remark" rows="4" placeholder="请输入需要说明的情况" style="width: 100%" />
          </div>
        </div>
        <!--        <div class="form-row-right">-->
        <!--          <div class="form-item-title"><span style="color: red">&nbsp;&nbsp; </span>参加民主测评总人数：</div>-->
        <!--          <div class="form-item-input">-->
        <!--            {{ model.voteNum }}-->
        <!--          </div>-->
        <!--        </div>-->
      </div>

      <!--      <div class='form-row' style='margin-bottom: 15px'>-->
      <!--        <div class='form-row-left'>-->
      <!--          <div class='form-item-title'>-->
      <!--            <span style='color: red'>&nbsp;&nbsp;</span>推荐优秀副职：-->
      <!--          </div>-->
      <!--          <div class='form-item-input'>-->
      <!--            <t-select-user-by-dep v-model='model.recommend' rows='4' placeholder='选择推荐优秀副职，原则上不可多选'-->
      <!--                                    store='id' text='realname' :depart-id='model.depart' :get-leader='false'-->
      <!--                                    style='width: 100%' />-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
    </a-form-model>
  </j-form-container>
</template>
<script>
import { VALIDATE_NO_PASSED } from '@/utils/JEditableTableUtil'
import TSelectUserByDep from '@/component/TSelectUserByDep.vue'

export default {
  name: 'AssessAnnualArrangeForm',
  components: { TSelectUserByDep },
  props: {
    disabled: {
      type: Boolean,
      default: false,
      required: false
    },
    departName: {
      type: String,
      default: '',
      required: false
    },
    departType: {
      type: String,
      default: '',
      required: false
    }
  },
  data() {
    return {
      objectData: [],
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
        peopleNum: [{ required: false }, { pattern: /^-?\d+$/, message: '请输入整数!' }],
        assessPartinNum: [{ required: false }, { pattern: /^-?\d+$/, message: '请输入整数!' }],
        evaluationNum: [{ required: false }, { pattern: /^-?\d+$/, message: '请输入整数!' }],
        contactsPhone: [{ required: false }, { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码!' }]
      },
      confirmLoading: false,
      tempLeaders: '',
      tempLeaderNames: '',
      objectColumns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: '10%',
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '姓名',
          dataIndex: 'name',
          width: '20%',
          align: 'center',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '性别',
          dataIndex: 'sex',
          width: '20%',
          align: 'center',
          scopedSlots: { customRender: 'sex' }
        },
        {
          title: '单位',
          dataIndex: 'depart',
          width: '20%',
          align: 'center',
          scopedSlots: { customRender: 'depart' }
        },
        {
          title: '职级',
          dataIndex: 'position',
          width: '20%',
          align: 'center',
          scopedSlots: { customRender: 'position' }
        },
        {
          title: '操作',
          dataIndex: 'operation',
          width: '10%',
          align: 'center',
          scopedSlots: { customRender: 'operation' }
        }
      ],

      editingKey: '',
      cacheData: undefined,
      tempModel: {},
      currentDepart: {
        id: '',
        name: '',
        departType: ''
      }
    }
  },

  created() {
    //备份model原始值
    this.modelDefault = JSON.parse(JSON.stringify(this.model))
  },
  methods: {
    // initFormData(url, id, leaders, leadersName) {
    //   this.tempLeaders = leaders
    //   this.tempLeaderNames = leadersName
    //   this.clearFormData()
    //   if (!id) {
    //     this.edit(this.modelDefault)
    //   } else {
    //     getAction(url, { id: id }).then((res) => {
    //       if (res.success) {
    //         let records = res.result.records
    //         if (records && records.length > 0) {
    //           if (records[0].nonAssess === null || records[0].nonAssess === '') {
    //             records[0].leaders = leaders
    //             records[0].leaders_dictText = leadersName
    //           }
    //           this.edit(records[0])
    //         }
    //       }
    //     })
    //   }
    // },
    // changeLeaders(aurl, aid, leaders, leadersName) {
    //   this.initFormData(aurl, aid, leaders, leadersName)
    // },
    numChange() {
      if (!this.model.chiefNum || this.model.chiefNum <= 0) {
        this.model.chiefNum = 0
      }

      if (!this.model.deputyNum || this.model.deputyNum <= 0) {
        this.model.deputyNum = 0
      }

      if (this.model.chiefNum >= 0 && this.model.deputyNum >= 0 && this.model.voteC && this.model.voteC >= 0) {
        this.model.voteNum = this.model.chiefNum + this.model.deputyNum + this.model.voteC
      } else {
        this.model.voteNum = 0
      }
    },
    edit(record) {
      this.model = Object.assign({}, record)
      this.cacheData = this.objectData.map(item => ({ ...item }))

    },
    getFormData() {
      let formdata_arr = []
      this.$refs.form.validate((valid) => {
        if (valid) {
          let isNullObj = true
          Object.keys(this.model).forEach((key) => {
            if (this.model[key]) {
              isNullObj = false
            }
          })
          if (!isNullObj) {
            formdata_arr.push(this.model)
          }
        } else {
          this.$emit('validateError', '年度考核工作安排表单校验未通过')
        }
      })
      return formdata_arr
    },
    validate(index) {
      return new Promise((resolve, reject) => {
        // 验证主表表单
        this.$refs.form.validate((valid) => {
          !valid ? reject({ error: VALIDATE_NO_PASSED, index }) : resolve()
        })
      })
        .then((values) => {
          return Promise.resolve()
        })
        .catch((error) => {
          return Promise.reject(error)
        })
    },
    clearFormData() {
      this.$refs.form.clearValidate()
    },

    handleChange(value, key, column) {
      const newData = [...this.objectData]
      const target = newData.find(item => key === item.id)
      if (target) {
        target[column] = value
        this.objectData = newData
      }
    },

    addRow() {
      if (this.editingKey !== '') {
        // this.$message.warning('请先保存正在编辑的行')
        // this.$confirm({
        //   title: '消息提示',

        //   content: h => <div style="color:red;font-size:18px">请先保存正在编辑的行</div>,

        //   onOk: () => {

        //   },

        //   onCancel: () => {

        //   }

        // })
        this.$error({
          title: '消息提示',
          content: '请先保存正在编辑的行'
        })
        return
      }
      this.objectData.push({
        id: this.objectData.length + 1,
        name: '',
        sex: '',
        // depart: that.model.depart_dictText,
        depart: this.departName,
        position: ''
      })
      this.cacheData = this.objectData.map(item => ({ ...item }))
      this.cancelAll()
      this.editRow(this.objectData.length)

    },

    editRow(key) {
      const newData = [...this.objectData]
      const target = newData.find(item => key === item.id)
      this.editingKey = key
      if (target) {
        target.editable = true
        this.objectData = newData
      }
    },

    saveRow(key) {
      const newData = [...this.objectData]
      const newCacheData = [...this.cacheData]
      const target = newData.find(item => key === item.id)

      if (target.name === '' || target.sex === '' || target.position === '') {
        // this.$message.warning('信息不全，不可保存')
        // this.$confirm({
        //   title: '消息提示',

        //   content: h => <div style="color:red;font-size:18px">信息不全，不可保存</div>,

        //   onOk: () => {

        //   },

        //   onCancel: () => {

        //   }

        // })
        this.$error({
          title: '消息提示',
          content: '信息不全，不可保存'
        })
        return
      }

      const targetCache = newCacheData.find(item => key === item.id)
      if (target && targetCache) {
        delete target.editable
        this.objectData = newData
        Object.assign(targetCache, target)
        this.cacheData = newCacheData
      }
      this.editingKey = ''

      let hashId = target.name + target.sex + target.depart + target.position

      this.$emit('saveRow', hashId)

    },
    cancel(key) {
      const newData = [...this.objectData]
      const target = newData.find(item => key === item.id)
      this.editingKey = ''
      if (target) {
        Object.assign(target, this.cacheData.find(item => key === item.id))
        delete target.editable
        this.objectData = newData
      }
    },

    cancelAll() {
      this.editingKey = ''
      for (let i = 0; i < this.objectData.length; i++) {
        delete this.objectData[i].editable
      }
    }

  }
}
</script>

<style scoped lang="less">
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
  width: 50%;
  display: flex;
  align-items: center;
}

.form-item-title {
  width: 35%;
  height: 100%;
}

.form-item-input {
  width: 65%;
  display: flex;
  align-items: center;
}

.ant-form-item {
  margin: 0;
}
</style>
