<template>
  <t-modal
    ref='tmodal'
    :title="'一报告两评议民主测评汇总'"
    :width='1500'
    :visible='visible'
    :maskClosable='false'
    @ok='fillCancel'
    :simple-submit='true'
    @cancel='fillCancel'
  >

    <div class='head-box'>
      <table class='msgtable'>
        <tr>
          <td>单位：</td>
          <td>{{ record.depart_dictText }}</td>
          <td>年度：</td>
          <td>{{ record.currentYear }}</td>
        </tr>
      </table>
    </div>

    <a-tabs :default-active-key='1' style='margin-top: 20px'>
      <a-tab-pane :key='1' type='card' :tab='record.currentYear + "年度干部选拔任用工作民主评议表"'>
        <a-spin :spinning='itemsLoading' style='height: 700px; overflow-y: scroll'>
          <div class='content-box'>
            <div v-for='(item, i) in items' :key='item.id' style='background-color: white; margin-bottom: 30px; padding: 5px 5px; border-radius: 10px'>
              <div class='content-row'>
                <div class='content-row-item-name'>{{ (i + 1) + '、' + item.topic }}</div>

                <div class='content-row-item-option'>
                  <!--单选-->
                  <div v-if="item.inputType === '1'" style='display: flex;'>
                    <div class='options'>
                      好 <span style='color: #4a4a48; font-size: 16px'>（共{{ getOptionNum(item, 'A')
                      }}票，占比{{ getOptionRatio(item, 'A') }}%）</span>
                    </div>
                    <div class='options'>
                      较好<span style='color: #4a4a48; font-size: 16px'>（共{{ getOptionNum(item, 'B')
                      }}票，占比{{ getOptionRatio(item, 'B') }}%<span v-if="getItemsA(item, 'B') > 0" style='font-weight: bold'>，其中A票数量：{{getItemsA(item, 'B')}}</span>）</span>
                    </div>
                    <div class='options'>
                      一般<span style='color: #4a4a48; font-size: 16px'>（共{{ getOptionNum(item, 'C')
                      }}票，占比{{ getOptionRatio(item, 'C') }}%<span v-if="getItemsA(item, 'C') > 0" style='font-weight: bold'>，其中A票数量：{{getItemsA(item, 'C')}}</span>）</span>
                    </div>
                    <div class='options'>
                      差<span style='color: #4a4a48; font-size: 16px'>（共{{ getOptionNum(item, 'D')
                      }}票，占比{{ getOptionRatio(item, 'D') }}%<span v-if="getItemsA(item, 'D') > 0" style='font-weight: bold'>，其中A票数量：{{getItemsA(item, 'D')}}</span>）</span>
                    </div>
                  </div>

                  <!--多选-->
                  <div v-if="item.inputType === '2'"
                       @change='e => checkboxChange(e, i)'>
                    <a-row>
                      <a-col v-for='(option, j) in multiData' :key='option.topic' :span='24' style='margin: 0 0'>
                        <span style='font-size: 16px'><p
                          style='display: inline-block; width: 100px;'>(共{{ option.num }}人选择)</p>{{ option.topic }}</span>
                      </a-col>
                    </a-row>
                  </div>

                  <!--输入框-->
                  <div v-if="item.inputType === '3'" style='overflow-y: scroll; max-height: 240px; width: 100%'>
                    <div v-for='(option, j) in itemData' :key='option.id' v-if='item.topic === option.topic' class='options'>
                      <a-row>
                        <a-col :span='24' style='margin: 0 0'>
                          <span>{{option.fill}}</span>
                        </a-col>
                      </a-row>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-spin>
      </a-tab-pane>
<!--      <a-tab-pane :key='2' type='card' :tab='record.currentYear + "年度新提拔任用干部民主评议表"'>-->
<!--        <a-spin :spinning='itemsLoading' style='height: 500px; overflow-y: scroll'>-->
<!--          <div class='content-box'>-->
<!--            <a-table :columns='columns' :data-source='newLeadersItem' bordered :pagination='false'>-->
<!--              <template slot='name' slot-scope='text, record, index'>-->
<!--                {{ text }}-->
<!--              </template>-->

<!--              <template slot='birthday' slot-scope='text, record, index'>-->
<!--                {{ getBirthday(text) }}-->
<!--              </template>-->

<!--              <template slot='originalPosition' slot-scope='text, record, index'>-->
<!--                {{ text }}-->
<!--              </template>-->

<!--              <template slot='currentPosition' slot-scope='text, record, index'>-->
<!--                {{ text }}-->
<!--              </template>-->

<!--              <template slot='operation' slot-scope='text, record, index'>-->
<!--                <a-radio-group v-model='newLeadersItem[index].fill'>-->
<!--                  <a-radio value='A'>-->
<!--                    认同-->
<!--                  </a-radio>-->
<!--                  <a-radio value='B'>-->
<!--                    基本认同-->
<!--                  </a-radio>-->
<!--                  <a-radio value='C'>-->
<!--                    不认同-->
<!--                  </a-radio>-->
<!--                  <a-radio value='D'>-->
<!--                    不了解-->
<!--                  </a-radio>-->
<!--                </a-radio-group>-->

<!--                <a-textarea v-model='newLeadersItem[index].reason' placeholder='请填写不认同的原因'-->
<!--                            :auto-size='{ minRows: 2, maxRows: 3 }'-->
<!--                            style='width: 88%; margin-top: 20px'-->
<!--                            v-if="record.fill === 'C'"-->
<!--                />-->
<!--              </template>-->
<!--            </a-table>-->

<!--          </div>-->
<!--        </a-spin>-->
<!--      </a-tab-pane>-->
    </a-tabs>
  </t-modal>
</template>

<script>

import TModal from '@/component/TModal.vue'
import { submitDemocratic } from '@/api/assessApis'
import { getAction, postAction } from '@/api/manage'
import TSelectUserByDep from '@/component/TSelectUserByDep.vue'
import moment from 'moment/moment'

export default {
  name: 'AssessReportEvaluationSummaryModal',
  components: {
    TSelectUserByDep,
    TModal
  },
  data() {
    return {
      title: '',
      width: 800,
      visible: false,
      disableSubmit: false,

      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          slots: { title: 'titleIndex' },
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '被评议对象的基本情况',
          align: 'center',
          slots: { title: 'titleInfo' },
          children: [
            {
              title: '姓名',
              dataIndex: 'name',
              align: 'center',
              slots: { title: 'titleName' },
              scopedSlots: { customRender: 'name' }
            },
            {
              title: '出生年月',
              dataIndex: 'birthday',
              align: 'center',
              slots: { title: 'titleBirthday' },
              scopedSlots: { customRender: 'birthday' }
            },
            {
              title: '原任职务及任职时间',
              dataIndex: 'originalPosition',
              align: 'center',
              slots: { title: 'titleOrigin' },
              scopedSlots: { customRender: 'originalPosition' }
            },
            {
              title: '现任职务及任职时间',
              dataIndex: 'currentPosition',
              align: 'center',
              slots: { title: 'titleCurrent' },
              scopedSlots: { customRender: 'currentPosition' }
            }
          ]
        },
        {
          title: '对提拔任用干部的看法',
          dataIndex: 'operation',
          align: 'center',
          width: 400,
          slots: { title: 'titleOperation' },
          scopedSlots: { customRender: 'operation' }
        }
      ],

      record: {},
      itemsLoading: false,
      items: [],
      newLeadersItem: [],

      itemData: [],
      multiData: []

    }
  },
  methods: {
    edit(record) {
      this.itemsLoading = true
      this.record = record
      this.visible = true
      this.$refs.tmodal.toggleFullscreen()
      // 获取测评项
      getAction('/modules/report/assessReportDemocracyConfig/getItems').then(res => {
        if (res.success) {
          this.items = res.result
          getAction('/modules/report/assessReportNewLeader/getDemocracyItemByFillId', { fillId: record.reportFillId }).then(res => {
            if (res.success) {
              this.newLeadersItem = res.result
              for (let i = 0; i < this.newLeadersItem.length; i++) {
                this.newLeadersItem[i].birthday = moment(this.newLeadersItem[i].birthday, 'YYYY-MM-DD')
              }

              // 获取填写的数据
              getAction('/modules/report/reportDemocratic/getFillData?summaryId=' + record.id).then(res => {
                if (res.success) {
                  this.itemData = res.result.items
                  this.multiData = res.result.multiList
                }
              })

            }
            this.itemsLoading = false
          })
        }
      })

    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    submitCallback() {
      this.$emit('ok')
      this.fillCancel()
    },
    handleCancel() {
      this.fillCancel()
    },
    fillCancel() {
      this.visible = false
    },
    beforeOk() {
      let that = this
      this.$confirm({
        title: '即将退出登录',
        content: h => <div style='color:red;'>点击确认后将提交匿名测评，系统自动退出登录，账号失效。是否确认提交？</div>,
        onOk() {
          that.handleOk()
        },
        onCancel() {
        },
        class: 'test'
      })
    },
    handleOk() {
      let form = {
        summaryId: this.record.id,
        items: this.items,
        newLeadersItems: this.newLeadersItem
      }

      postAction('/modules/report/reportDemocratic/submit', form).then(res => {
        if (res.success) {
          // this.$message.success(res.message)
          // this.$confirm({
          //   title: '消息提示',
          //   content: h => <div style='color:red;'>{res.message}</div>,
          //   onOk: () => {
          //   },
          //   onCancel: () => {
          //   }
          // })
          this.$success({
            title: '成功',
            content: res.message
          })
          this.submitCallback()
          this.$emit('ok')
          this.$confirm({
            title: '执行销毁账号、退出登录操作',
            content: h => <div style='color:red;'>销毁账号，退出登录操作</div>,
            onOk() {
            },
            onCancel() {
            },
            class: 'test'
          })
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
          this.$error({
            title: '错误',
            content: res.message
          })
        }
      })
    },

    checkboxChange(checkedValues, i) {
      for (let j = 0; j < this.items[i].multiList.length; j++) {
        if (checkedValues.includes(this.items[i].multiList[j].id)) {
          this.items[i].multiList[j].selected = true
        } else {
          this.items[i].multiList[j].selected = false
        }
      }
      this.items[i].fill = checkedValues.toString()
    },
    getBirthday(date) {
      // 将Fri Jan 05 2024 01:52:18 GMT+0800格式字符串装换位2024.01，注意Fri Jan 05 2024 01:52:18 GMT+0800为字符串
      if (!date) {
        return ''
      }

      let dateStr = date.toString()

      let year = dateStr.substring(11, 15)
      let month = dateStr.substring(4, 7)
      if (month === 'Jan') {
        month = '01'
      } else if (month === 'Feb') {
        month = '02'
      } else if (month === 'Mar') {
        month = '03'
      } else if (month === 'Apr') {
        month = '04'
      } else if (month === 'May') {
        month = '05'
      } else if (month === 'Jun') {
        month = '06'
      } else if (month === 'Jul') {
        month = '07'
      } else if (month === 'Aug') {
        month = '08'
      } else if (month === 'Sep') {
        month = '09'
      } else if (month === 'Oct') {
        month = '10'
      } else if (month === 'Nov') {
        month = '11'
      } else if (month === 'Dec') {
        month = '12'
      }
      return year + '.' + month
    },

    getOptionNum(item, option) {
      let num = 0
      for (let i = 0; i < this.itemData.length; i++) {
        if (this.itemData[i].topic === item.topic && this.itemData[i].fill === option) {
          num++
        }
      }
      return num
    },

    getOptionRatio(item, option) {
      let num = 0
      for (let i = 0; i < this.itemData.length; i++) {
        if (this.itemData[i].topic === item.topic) {
          num++
        }
      }
      return (this.getOptionNum(item, option) / num * 100).toFixed(2)
    },

    getItemsA(item, option){
      let num = 0
      for (let i = 0; i < this.itemData.length; i++) {
        if (this.itemData[i].topic === item.topic && this.itemData[i].voteType === 'A' && this.itemData[i].fill === option) {
          num++
        }
      }
      return num
    }

  }
}
</script>

<style scoped>
.head-box {
  width: 100%;
  padding: 0 30px;
}

.msgtable {
  margin: 0 auto;
  width: 95%;
  height: 60px;
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

.content-box {
  width: 100%;
  padding: 0 30px;
  margin-top: 10px;
}

.content-row {
  //display: flex;
  margin: 16px 0;
}

.content-row-item-name {
  white-space: pre-line;
  width: 100%;
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: bold;
}

.content-row-item-option {
  display: flex;
  align-items: center;
  padding-left: 26px;
}

.options {
  font-size: 17px;
  margin-right: 20px;
  margin-bottom: 10px;
}

</style>