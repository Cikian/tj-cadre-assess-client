<template>
  <a-spin :spinning="confirmLoading" style="max-height: 680px">
    <!--    <a-descriptions bordered style='margin-bottom: 30px' :column='2' :size='"small"'>-->
    <!--      <a-descriptions-item label='被考核单位（处室）'>-->
    <!--        <j-ellipsis :value='model.departId_dictText' :length='11' />-->
    <!--      </a-descriptions-item>-->
    <!--      <a-descriptions-item label='年度'>-->
    <!--        {{ model.currentYear }}-->
    <!--      </a-descriptions-item>-->
    <!--      <a-descriptions-item label='分数'>-->
    <!--        {{ model.score }}-->
    <!--      </a-descriptions-item>-->
    <!--      <a-descriptions-item label='排名'>-->
    <!--        {{ model.ranking }}-->
    <!--      </a-descriptions-item>-->
    <!--    </a-descriptions>-->

    <!--    主表-->
    <table class="msgtable">
      <tr>
        <td>被考核单位（处室）：</td>
        <td>{{ model.departId_dictText }}</td>
        <td>年度：</td>
        <td>{{ model.currentYear }}</td>
      </tr>
      <tr>
        <td>分数：</td>
        <td>{{ model.score }}</td>
        <td>排名：</td>
        <td>{{ model.ranking }}</td>
      </tr>
      <tr>
        <td>等次：</td>
        <td colspan="3">
          <j-dict-select-tag style="width: 30%; margin: 0 auto" type="list" v-model="model.level"
                             dictCode="assess_level" placeholder="请选择等次" />
        </td>
      </tr>
    </table>

    <j-form-container :disabled="formDisabled">

      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail"
                    style="display: flex;justify-content: space-between;">
        <div class="bgone">
          <div>
            <a-form-model-item label="加分" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="addSubtractPoints">
              <a-input-number :min="0" :step="0.1" v-model="model.addPoints" placeholder="加分" style="width: 100%" />
            </a-form-model-item>
          </div>
          <div>
            <a-form-model-item label="加分原因" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="level">
              <a-textarea v-model="model.addReason" rows="3" placeholder="加分原因" />
            </a-form-model-item>
          </div>

        </div>
        <div class="bgtwo">

          <div>
            <a-form-model-item label="减分" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="addSubtractPoints">
              <a-input-number :min="0" :step="0.1" v-model="model.subtractPoints" placeholder="减分" style="width: 100%" />
            </a-form-model-item>
          </div>
          <div>
            <a-form-model-item label="减分原因" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="level">
              <a-textarea v-model="model.subtractReason" rows="3" placeholder="减分原因" />
            </a-form-model-item>
          </div>
        </div>

      </a-form-model>
    </j-form-container>

    <a-tabs default-active-key="1" size="default" style="height: 5%">
      <a-tab-pane key="1" tab="评分详情">
        <a-table
          :columns="gradeDetailsColumns"
          :data-source="gradeDetails"
          :pagination="false"
          :scroll="{ y: 240 }"
        >
        </a-table>
      </a-tab-pane>
      <a-tab-pane key="2" :tab="recognitionTabTile">
        <div class="double-table">
          <div class="vs">
            <img src="@/assets/cadre/vs.png">
          </div>
          <a-table
            :columns="commendColumns"
            :data-source="commends"
            :pagination="false"
            class="recognition"
          >
            <template slot="title">表彰情况</template>
            <template slot="fileSlot" slot-scope="text">
              <span v-if="!text" style="font-size: 16px;font-style: italic;">无文件</span>
              <a-button
                v-else
                :ghost="true"
                type="primary"
                icon="download"
                size="small"
                @click="downloadFile(text)">
                下载
              </a-button>
            </template>
          </a-table>


          <a-table
            :columns="denounceColumns"
            :data-source="denounces"
            :pagination="false"
            class="report"
          >
            <template slot="title">通报情况</template>
            <template slot="fileSlot" slot-scope="text">
              <span v-if="!text" style="font-size: 16px;font-style: italic;">无文件</span>
              <a-button
                v-else
                :ghost="true"
                type="primary"
                icon="download"
                size="small"
                @click="downloadFile(text)">
                下载
              </a-button>
            </template>
          </a-table>


        </div>
      </a-tab-pane>
    </a-tabs>

  </a-spin>
</template>

<script>

import { getFileAccessHttpUrl, httpAction } from '@/api/manage'
import { getCommendByDepartAndYear, getDenounceByDepartAndYear, getGradeDetails } from '@api/assessApis'

export default {
  name: 'AssessBusinessGradeForm',
  components: {},
  props: {
    //表单禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data() {
    return {
      model: {},
      labelCol: {
        xs: { span: 10 },
        sm: { span: 10 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      confirmLoading: false,
      validatorRules: {},
      gradeDetailsColumns: [
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
          title: '考核单位（处室）',
          align: 'center',
          dataIndex: 'reportDepart_dictText',
          scopedSlots: { customRender: 'depart' },
          width: 300
        },
        {
          title: '评分',
          align: 'center',
          dataIndex: 'score'
        },
        {
          title: '扣分原因',
          align: 'center',
          dataIndex: 'reasonOfDeduction',
          width: 400,
          scopedSlots: { customRender: 'reasonOfDeduction' }
        }
      ],
      commendColumns: [
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
          title: '表彰单位',
          align: 'center',
          dataIndex: 'commendUnit'
        },
        {
          title: '表彰项目',
          align: 'center',
          dataIndex: 'commendProject'
        },
        {
          title: '表彰时间',
          align: 'center',
          dataIndex: 'commendTime',
          customRender: function(text) {
            return !text ? '' : (text.length > 10 ? text.substr(0, 10) : text)
          }
        },
        {
          title: '证明材料',
          align: 'center',
          dataIndex: 'proof',
          scopedSlots: { customRender: 'fileSlot' }
        }
      ],
      denounceColumns: [
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
          title: '通报单位',
          align: 'center',
          dataIndex: 'denounceUnit'
        },
        {
          title: '通报项目',
          align: 'center',
          dataIndex: 'denounceProject'
        },
        {
          title: '通报时间',
          align: 'center',
          dataIndex: 'denounceTime',
          customRender: function(text) {
            return !text ? '' : (text.length > 10 ? text.substr(0, 10) : text)
          }
        },
        {
          title: '证明材料',
          align: 'center',
          dataIndex: 'proof',
          scopedSlots: { customRender: 'fileSlot' }
        }
      ],
      url: {
        add: '/modules/assessBusinessGrade/add',
        edit: '/modules/assessBusinessGrade/edit',
        queryById: '/modules/assessBusinessGrade/queryById'
      },
      gradeDetails: [],
      commends: [],
      denounces: []
    }
  },
  computed: {
    formDisabled() {
      return this.disabled
    },
    recognitionTabTile() {
      let title = '表彰、通报情况'
      return title + '(表彰：' + this.commends.length + '，通报：' + this.denounces.length + ')'
    }
  },
  created() {
    //备份model原始值
    this.modelDefault = JSON.parse(JSON.stringify(this.model))
  },
  methods: {
    add() {
      this.edit(this.modelDefault)
    },
    edit(record) {
      this.model = Object.assign({}, record)
      this.visible = true
      this.loadGradeDetails(this.model.id)
      this.loadCommends(this.model.departId, this.model.currentYear)
      this.loadDenounces(this.model.departId, this.model.currentYear)
    },

    loadGradeDetails(gradeId) {
      getGradeDetails(gradeId).then(res => {
        if (res.success) {
          this.gradeDetails = res.result.records
        }
      })
    },
    loadCommends(departId, year) {
      getCommendByDepartAndYear(departId, year).then(res => {
        if (res.success) {
          this.commends = res.result.records
        }
      })
    },
    loadDenounces(departId, year) {
      getDenounceByDepartAndYear(departId, year).then(res => {
        if (res.success) {
          this.denounces = res.result.records
        }
      })
    },

    submitForm() {
      const that = this
      // 触发表单验证
      this.$refs.form.validate(valid => {
        if (valid) {
          that.confirmLoading = true
          let httpurl = ''
          let method = ''
          if (!this.model.id) {
            httpurl += this.url.add
            method = 'post'
          } else {
            httpurl += this.url.edit
            method = 'put'
          }
          httpAction(httpurl, this.model, method).then((res) => {
            if (res.success) {
              // that.$message.success(res.message)
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
              that.$emit('ok')
            } else {
              // that.$message.warning(res.message)
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
          }).finally(() => {
            that.confirmLoading = false
          })
        }

      })
    },
    downloadFile(text) {
      if (!text) {
        // this.$message.warning('未知的文件')
        // this.$confirm({
        //   title: '消息提示',
        //   content: h => <div style="color:red;">未知的文件</div>,
        //   onOk: () => {
        //   },
        //   onCancel: () => {
        //   }
        // })
        this.$error({
          title: '错误',
          content: '未知的文件'
        })
        return
      }
      if (text.indexOf(',') > 0) {
        text = text.substring(0, text.indexOf(','))
      }
      let url = getFileAccessHttpUrl(text)
      window.open(url)
    }
  }
}
</script>
<style lang="less" scoped>
.bgone {
  width: 49%;
  background-image: url("../../../../../assets/组合 1144.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;

}

.bgtwo {
  width: 49%;
  background-image: url("../../../../../assets/组合 1145.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.msgtable {
  margin: 0 auto;
  width: 95%;
  height: 121px;
  font-size: 16px;
  font-weight: 500;
  color: #091834;

  tr {
    td {
      padding-left: 30px;
      border: 1px solid #CCD4D7;
      border-collapse: collapse; /* 移除单元格之间的间隔 */
    }

    td:nth-child(1), td:nth-child(3) {
      width: 200px;
      background-color: #F4F8FA;
      color: #25477C;
    }

    td:nth-child(2), td:nth-child(4) {
      width: 300px;
    }
  }
}

/deep/ .ant-form {
  margin: 50px auto;
  width: 95%;

  .ant-form-item-label {
    margin-left: 10px;
    text-align: left;
    width: 16%;
  }
}

.reason {
  display: flex;

  div {
    width: 80px;
  }
}

/deep/ .ant-tabs {
  margin: 0 auto;
  width: 95%;
}

/deep/ .ant-tabs-tab {
  text-align: center;
  font-size: 18px;
}

.double-table {
  width: 100%;
  height: 240px;
  overflow: auto;
  display: flex;
  position: relative;

  .vs {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 60px;
    z-index: 2;

    img {
      width: 100%;
      height: 100%;
    }
  }

  /deep/ .ant-table-wrapper {
    width: 50%;

  }

  .recognition {
    /deep/ .ant-table-title {
      padding-left: 40px;
      font-size: 16px;
      font-weight: 600;
      color: #FFF;
      background-color: #FD6F68;
    }

    /deep/ .ant-table-thead {
      tr {
        th {
          background-color: #F4F8FA;
          font-weight: 600;
          color: #FD6F68;
        }
      }
    }
  }

  .report {
    /deep/ .ant-table-title {
      padding-left: 40px;
      font-size: 16px;
      font-weight: 600;
      color: #FFF;
      background-color: #69B0FD;
    }

    /deep/ .ant-table-thead {
      tr {
        th {
          background-color: #F4F8FA;
          font-weight: 600;
          color: #69B0FD;
        }
      }
    }
  }

}
</style>