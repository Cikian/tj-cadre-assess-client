<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">

    </div>

    <!-- table区域-begin -->
    <div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        class="j-table-force-nowrap"
        :scroll="{x:true}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="false"
        :loading="loading"
        @change="handleTableChange">

        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="imgSlot" slot-scope="text,record">
          <span v-if="!text" style="font-size: 16px;font-style: italic;">无图片</span>
          <img v-else :src="getImgView(text)" :preview="record.id" height="25px" alt=""
               style="max-width:80px;font-size: 16px;font-style: italic;" />
        </template>
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

        <span slot="action" slot-scope="text, record">
          <a @click="openDemocraticFill(record.departId)">测评</a>
        </span>

      </a-table>
    </div>

    <t-modal
      ref="tjmodal"
      :title="'年度民主测评表'"
      :width="1400"
      :visible="democraticFillModalVisible"
      :maskClosable="false"
      :switchFullscreen="true"
      @ok="beforeOk"
      @cancel="fillCancel"
      :simple-submit="true"
    >
      <a-tabs :default-active-key="0" @change="tabChange">
        <a-tab-pane type="card" v-for="(fillPane, i) in democraticFillFormList" :key="i"
                    :tab='fillPane.appraisee === "group" ? "领导班子" : fillPane.appraisee.split("@")[0]'>
          <!--                    :tab='fillPane.appraisee === null ? "领导班子" : (getStrAfterSymbol(democraticFillFormList[i].type_dictText) + "—" + fillPane.appraisee.split("@")[0]) '>-->
          <div class="head-box">
            <!--            <div class='head-row'>-->
            <!--              <div class='head-row-item'>-->
            <!--                <span style='width: 80px' class='head-row-label'>测评对象：</span><span>{{ democraticFillFormList[i].appraisee_dictText-->
            <!--                }}</span>-->
            <!--              </div>-->
            <!--              <div class='head-row-item'>-->
            <!--                <span class='head-row-label'>处室（单位）：</span><span>{{ democraticFillFormList[i].depart_dictText-->
            <!--                }}</span>-->
            <!--              </div>-->
            <!--            </div>-->
            <!--            <div class='head-row'>-->
            <!--              <div class='head-row-item'>-->
            <!--                <span style='width: 80px' class='head-row-label'>测评类型：</span><span>{{ democraticFillFormList[i].type_dictText }}</span>-->
            <!--              </div>-->
            <!--              <div class='head-row-item'>-->
            <!--                <span class='head-row-label'>年度：</span><span>{{ democraticFillFormList[i].currentYear }}</span>-->
            <!--              </div>-->
            <!--            </div>-->
            <table class="msgtable">
              <tr>
                <td style="text-align: center">测评对象</td>
                <td>
                  {{ democraticFillFormList[i].appraisee === 'group' ? democraticFillFormList[i].depart_dictText + '-领导班子' : democraticFillFormList[i].appraisee.split('@')[0]
                  }}
                </td>
                <td style="text-align: center">处室（单位）</td>
                <td>{{ democraticFillFormList[i].depart_dictText }}</td>
              </tr>
              <tr>
                <td style="text-align: center">测评类型</td>
                <td>{{ democraticFillFormList[i].type_dictText }}</td>
                <td style="text-align: center">年度</td>
                <td>{{ democraticFillFormList[i].currentYear }}</td>
              </tr>
            </table>
          </div>

          <!--          <a-divider />-->

          <a-spin :spinning="itemsLoading" style="margin-top: 10px">

            <div class="sumeval">
              <span class="head-row-label">当前分数：</span>
              <span
                :style="{color: democraticFillFormList[i].overallEvaluation >= 80 ? 'green' : democraticFillFormList[i].overallEvaluation<60 ? 'red' : 'orange'}">{{ democraticFillFormList[i].overallEvaluation
                }} </span>分
              <!--              <a-radio-group name="overallEvaluationRadio" v-model="democraticFillFormList[i].overallEvaluation"-->
              <!--                             @change="radioChange" button-style="solid">-->
              <!--                <a-radio :value="'A'">-->
              <!--                  A-->
              <!--                </a-radio>-->
              <!--                <a-radio :value="'B'">-->
              <!--                  B-->
              <!--                </a-radio>-->
              <!--                <a-radio :value="'C'">-->
              <!--                  C-->
              <!--                </a-radio>-->
              <!--                <a-radio :value="'D'">-->
              <!--                  D-->
              <!--                </a-radio>-->
              <!--              </a-radio-group>-->
            </div>

            <div class="content-box">
              <div v-for="(item, j) in democraticFillFormList[i].items" :key="item.itemName">
                <div class="content-row">
                  <div class="content-row-item-name">{{ item.itemName }}</div>
                  <div class="content-row-item-option">
                    <a-radio-group ref="radioGroup" :name='"overallEvaluationRadio" + i'
                                   v-model="democraticFillFormList[i].items[j].optionWeight"
                                   @change="summaryGrade(i)">
                      <a-radio class="options" v-for="(option, i) in radioOptions" :key="i" :value="option.value">
                        {{ option.value }}
                      </a-radio>
                    </a-radio-group>
                  </div>
                </div>
                <a-divider v-show="j < democraticFillFormList[i].items.length - 1" />
              </div>


              <!--        <a-descriptions bordered title="User Info" :column='1'>-->
              <!--          <a-descriptions-item v-for='(item, i) in democraticFillForm.items' :key='item.itemName' :label="'asdas'">-->
              <!--            <a-radio-group :name="'itemOptionRadio' + i" v-model="item.itemOption" @change="radioChange">-->
              <!--              <a-radio :value="options.A">-->
              <!--                A-->
              <!--              </a-radio>-->
              <!--              <a-radio :value="options.B">-->
              <!--                B-->
              <!--              </a-radio>-->
              <!--              <a-radio :value="options.C">-->
              <!--                C-->
              <!--              </a-radio>-->
              <!--              <a-radio :value="options.D">-->
              <!--                D-->
              <!--              </a-radio>-->
              <!--            </a-radio-group>-->
              <!--          </a-descriptions-item>-->

              <!--        </a-descriptions>-->

            </div>
          </a-spin>
        </a-tab-pane>
      </a-tabs>
    </t-modal>

    <!--    <assess-democratic-evaluation-modal ref='modalForm' @ok='modalFormOk' />-->
  </a-card>
</template>

<script>

import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import AssessDemocraticEvaluationModal from './modules/AssessDemocraticEvaluationModal'
import '@/assets/less/TableExpand.less'
import AssessAnnualFillForm from '../assess/modules/AssessAnnualFillForm.vue'
import TModal from '@/component/TModal.vue'
import { deleteCurrentUser, getDemocraticItems, getDemocraticOptions, submitDemocratic } from '@/api/assessApis'
import { getAction } from '@/api/manage'
import { mapActions } from 'vuex'

export default {
  name: 'AssessDemocraticEvaluationList',
  mixins: [JeecgListMixin],
  components: {
    TModal, AssessAnnualFillForm,
    AssessDemocraticEvaluationModal
  },
  data() {
    return {
      description: '民主测评填报管理页面',
      // 表头
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
          title: '年度',
          align: 'center',
          dataIndex: 'currentYear'
        },
        {
          title: '测评对象',
          align: 'center',
          dataIndex: 'appraisee_dictText'
        },
        {
          title: '测评名称',
          align: 'center',
          dataIndex: 'assessName'
        },
        {
          title: '结束时间',
          align: 'center',
          dataIndex: 'endDate',
          customRender: function(text) {
            return !text ? '' : (text.length > 10 ? text.substr(0, 10) : text)
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 147,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/modules/annual/democraticEvaluation/list',
        delete: '/modules/annual/democraticEvaluation/delete',
        deleteBatch: '/modules/annual/democraticEvaluation/deleteBatch',
        exportXlsUrl: '/modules/annual/democraticEvaluation/exportXls',
        importExcelUrl: 'modules/annual/democraticEvaluation/importExcel'

      },
      dictOptions: {},
      superFieldList: [],
      democraticFillModalVisible: false,
      fillLists: [],
      fillObj: {},
      democraticFillFormList: [],
      democraticFillForm: {
        evaluationSummaryId: '',
        appraisee: '',
        depart: '',
        type: '',
        currentYear: '',
        overallEvaluation: '',
        items: [],
        options: {}
      },
      options: {
        A: Number,
        B: Number,
        C: Number,
        D: Number
      },
      radioOptions: [],
      itemsLoading: false,
      userRoles: []
    }
  },
  created() {
    this.getSuperFieldList()
    getAction('/common/currentUserRoles').then(res => {
      if (res.success) {
        this.userRoles = res.result
      }
    })
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    initDictConfig() {
    },
    getSuperFieldList() {
      let fieldList = []
      fieldList.push({ type: 'string', value: 'appraisee', text: '测评对象', dictCode: '' })
      fieldList.push({ type: 'string', value: 'currentYear', text: '年度', dictCode: 'assess_year' })
      fieldList.push({ type: 'string', value: 'assessName', text: '考核名称', dictCode: '' })
      fieldList.push({ type: 'sel_depart', value: 'depart', text: '单位（处室）' })
      fieldList.push({ type: 'string', value: 'score', text: '分数', dictCode: '' })
      fieldList.push({ type: 'string', value: 'type', text: '类型', dictCode: 'democratic_type' })
      fieldList.push({ type: 'date', value: 'startDate', text: '开始时间' })
      fieldList.push({ type: 'date', value: 'endDate', text: '结束时间' })
      this.superFieldList = fieldList
    },
    openDemocraticFill(departId) {
      this.getRadioItems()
      let temp = this.fillLists.filter(item => item.departId === departId)
      for (let i = 0; i < temp.length; i++) {
        let obj = {
          evaluationSummaryId: temp[i].summaryId,
          appraisee: temp[i].appraisee,
          appraisee_dictText: temp[i].appraisee_dictText,
          depart: temp[i].departId,
          depart_dictText: temp[i].departId_dictText,
          type: temp[i].type,
          type_dictText: temp[i].type_dictText,
          currentYear: temp[i].currentYear,
          overallEvaluation: '',
          items: [],
          options: {}
        }
        this.democraticFillFormList.push(obj)
      }
      this.democraticFillModalVisible = true

      this.getItems(this.democraticFillFormList[0].type, (callback) => {
        this.democraticFillFormList[0].items = callback
      })

      this.getOptions(this.democraticFillFormList[0].type, (callback) => {
        this.democraticFillFormList[0].options = callback
      })

    },
    fillCancel() {
      this.democraticFillFormList = []
      this.democraticFillModalVisible = false
    },

    beforeOk() {
      for (let i = 0; i < this.democraticFillFormList.length; i++) {
        let name = ''
        if (this.democraticFillFormList[i].type !== '99') {
          name = this.democraticFillFormList[i].appraisee
          name = '对“' + name.split('@')[0] + '”的'
        } else {
          name = '对“' + this.democraticFillFormList[i].depart_dictText + '”的'
        }

        if (this.democraticFillFormList[i].items.length === 0) {
          this.$error({
            title: name + '测评中存在未填写的分数，请核对后再提交'
            // JSX support
          })
          return
        }

        let items = this.democraticFillFormList[i].items
        for (let j = 0; j < items.length; j++) {
          if (items[j].optionWeight === 0 || items[j].optionWeight === null) {
            this.$error({
              title: name + '测评中存在未填写的分数，请核对后再提交'
              // JSX support
            })
            return
          }
        }

      }

      let that = this
      if (this.dataSource.length === 1 && this.userRoles.indexOf('director_leader') === -1) {
        this.$confirm({
          title: '即将退出登录',
          content: h => <div
            style="color:red;font-size:18px">点击确认后将提交测评结果，系统自动退出登录，并且无法再次登录。请确认是否继续提交？</div>,
          onOk() {
            that.handleOk()
          },
          onCancel() {
          },
          class: 'test'
        })
      } else {
        that.$confirm({
          title: '请确认',
          content: h => <div
            style="color:red;font-size:18px">点击确认后将提交测评结果，并且无法修改，请仔细核对。请确认是否继续提交？</div>,
          onOk() {
            that.handleOk()
          },
          onCancel() {
          },
          class: 'test'
        })
      }

    }
    ,
    ...mapActions(['Logout']),
    // handleOk() {

    //   submitDemocratic(this.democraticFillFormList).then(res => {
    //     let that = this
    //     if (res.success) {
    //       this.$success({
    //         title: res.message
    //         // JSX support
    //       })
    //       if (this.dataSource.length === 1 && this.userRoles.indexOf('director_leader') === -1) {
    //         // 如果不是局领导（匿名账号）则退出登录
    //         deleteCurrentUser().then(res => {
    //           if (res.success) {
    //             that.Logout({}).then(() => {
    //               // update-begin author:scott date:20211223 for:【JTC-198】退出登录体验不好
    //               //that.$router.push({ path: '/user/login' });
    //               window.location.reload()
    //               // update-end author:scott date:20211223 for:【JTC-198】退出登录体验不好
    //             }).catch(err => {
    //               this.$message.error({
    //                 title: '错误',
    //                 description: err.message
    //               })
    //             })
    //           }
    //         })
    //       }

    //       this.loadData()
    //       this.fillCancel()
    //     } else {
    //       // this.$message.error(res.message)
    //       this.$error({
    //         title: res.message
    //         // JSX support
    //       })
    //     }

    //   })
    // }
    handleOk() {
      submitDemocratic(this.democraticFillFormList).then(res => {
        let that = this
        if (res.success) {
          this.$success({
            title: res.message
            // JSX support
          })

          if (this.dataSource.length === 1 && this.userRoles.indexOf('director_leader') === -1) {
            // 添加一个延迟，确保用户能够看到成功提示
            setTimeout(() => {
              deleteCurrentUser().then(res => {
                if (res.success) {
                  that.Logout({}).then(() => {
                    window.location.reload()
                  }).catch(err => {
                    this.$message.error({
                      title: '错误',
                      description: err.message
                    })
                  })
                }
              })
            }, 1000) // 等待1秒
          }

          this.loadData()
          this.fillCancel()
        } else {
          this.$error({
            title: res.message
            // JSX support
          })
        }
      })
    }
    ,
    getOptions(type, callback) {
      getDemocraticOptions(type).then(res => {
        if (res.success) {
          callback(res.result)
        }
      })
    }
    ,
    getItems(type, callback) {
      this.itemsLoading = true

      getDemocraticItems(type).then(res => {
        if (res.success) {
          let items = []
          for (let i = 0; i < res.result.length; i++) {
            items.push({
              democraticId: '',
              itemName: res.result[i].itemName,
              itemScore: res.result[i].score,
              score: 0,
              itemOption: '',
              optionWeight: 0
            })
          }
          callback(items)
          this.itemsLoading = false
        } else {
          this.itemsLoading = false
        }
      })
    }
    ,
    radioChange(e, i, j) {
    },

    summaryGrade(i) {
      let items = this.democraticFillFormList[i].items
      let sum = 0
      for (let i = 0; i < items.length; i++) {
        sum += items[i].itemScore * (items[i].optionWeight / 100)
      }
      // sum保留两位小数
      sum = Math.round(sum * 100) / 100

      this.democraticFillFormList[i].overallEvaluation = sum
    }
    ,

// 将文本中的 \n 替换为 <br>
    replaceN2Br(text) {
      return text.replace(/\n/g, '<br>')
    }
    ,

    loadData(arg) {
      if (!this.url.list) {
        // this.$message.error('请设置url.list属性!')
        this.$confirm({
          title: '消息提示',
          content: h => <div style="color:red;font-size:18px">请设置url.list属性</div>,
          onOk: () => {
          },
          onCancel: () => {
          }
        })
        return
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      var params = this.getQueryParams()//查询条件
      this.loading = true
      getAction(this.url.list, params).then((res) => {
        if (res.success) {

          for (let i = 0; i < res.result.records.length; i++) {
            if (res.result.records[i].type === '23') {
              res.result.records[i].departId = 'JG'
              res.result.records[i].departId_dictText = '局管总师、二巡'
            }
          }

          this.fillLists = res.result.records

          let departIds = []
          if (params.pageNo === '1') {
            this.dataSource = []
            for (let i = 0; i < res.result.records.length; i++) {
              // if (res.result.records[i].type === "23") {
              //   res.result.records[i].departId = "123456789"
              //   res.result.records[i].departId_dictText = "局管总师、二巡"
              // }
              if (departIds.indexOf(res.result.records[i].departId) === -1) {
                let obj = {
                  currentYear: res.result.records[i].currentYear,
                  departId: res.result.records[i].departId,
                  type: res.result.records[i].type,
                  appraisee_dictText: res.result.records[i].departId_dictText,
                  assessName: res.result.records[i].assessName,
                  endDate: res.result.records[i].endDate
                }

                departIds.push(res.result.records[i].departId)
                this.dataSource.push(obj)
              }
            }
          }

          // 如果dataSource中的元素中有departId属性为JG的，将此元素放到第一个
          let jgIndex = this.dataSource.findIndex(item => item.departId === 'JG')
          if (jgIndex !== -1) {
            let jgItem = this.dataSource.splice(jgIndex, 1)[0]
            this.dataSource.unshift(jgItem)
          }

          if (res.result.total) {
            this.ipagination.total = res.result.total
          } else {
            this.ipagination.total = 0
          }
          //update-end---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------

        } else {
          // this.$message.warning(res.message)
          this.$confirm({
            title: '消息提示',

            content: h => <div style="color:red;font-size:18px">{res.message}</div>,

            onOk: () => {

            },

            onCancel: () => {

            }

          })
        }
      }).finally(() => {
        this.loading = false
      })
    }
    ,

    tabChange(key) {
      if (this.democraticFillFormList[key].items.length === 0) {
        this.getItems(this.democraticFillFormList[key].type, (callback) => {
          this.democraticFillFormList[key].items = callback
        })
        this.getOptions(this.democraticFillFormList[key].type, (callback) => {
          this.democraticFillFormList[key].options = callback
        })
      }
    }
    ,

// 只保留字符串中“-”后面的内容
    getStrAfterSymbol(text) {
      if (text) {
        let index = text.lastIndexOf('-')
        return text.substring(index + 1)
      }
    }
    ,

    getRadioItems() {
      getAction('/common/getDictItemsByCode?code=' + 'business_score').then(res => {
        if (res.success) {
          this.radioOptions = res.result
        }
      })
    }

  }
}
</script>
<style lang="less" scoped>
@import '~@assets/less/common.less';

.head-box {
  width: 100%;
  padding: 0 30px;
}

.head-row {
  display: flex;
  height: 50px;
  line-height: 50px;
}

.head-row-item {
  width: 40%;
  font-size: 15px;
}

.head-row-label {
  font-weight: bold;
  display: inline-block;
  width: 110px;
  text-align: right;
}

.content-box {
  width: 100%;
  padding: 0 30px;
  margin-top: 0px;
  height: 570px;
  overflow-y: scroll;
}

.content-row {
  display: flex;
  margin: 16px 0;
}

.content-row-item-name {
  white-space: pre-line;
  width: 460px;
  margin-top: 0;
  font-size: 16px;
}

.content-row-item-option {
  display: flex;
  align-items: center;
  font-weight: bold;
}

.options {
  margin-right: 20px;
}

.msgtable {
  margin: 0 auto;
  width: 95%;
  height: 90px;
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
      //width: 200px;
      background-color: #F4F8FA;
      color: #25477C;
    }

    td:nth-child(2), td:nth-child(4) {
      //width: 300px;
    }
  }
}

.sumeval {
  padding-left: 30px;
  font-size: 18px;

  .head-row-label {
    text-align: left;
  }
}
</style>