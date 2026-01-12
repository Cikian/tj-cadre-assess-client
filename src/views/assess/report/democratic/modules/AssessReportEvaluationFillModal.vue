<template>
  <t-modal
    ref='tmodal'
    :title="'一报告两评议民主测评表'"
    :width='1200'
    :visible='visible'
    :maskClosable='false'
    :switchFullscreen='true'
    @ok='beforeOk'
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
        <a-spin :spinning='itemsLoading' style='height: 500px; overflow-y: scroll'>
          <div class='content-box'>
            <div v-for='(item, i) in items' :key='item.id'>
              <div class='content-row'>
                <div class='content-row-item-name'>{{ (i + 1) + '、' + item.topic }}</div>

                <div class='content-row-item-option'>
                  <!--单选-->
                  <a-radio-group v-if="item.inputType === '1'" ref='radioGroup' :name='"overallEvaluationRadio" + i'
                                 v-model='items[i].fill'>
                    <a-radio class='options' :value="'A'">
                      好
                    </a-radio>
                    <a-radio class='options' :value="'B'">
                      较好
                    </a-radio>
                    <a-radio class='options' :value="'C'">
                      一般
                    </a-radio>
                    <a-radio class='options' :value="'D'">
                      差
                    </a-radio>
                  </a-radio-group>

                  <!--多选-->
                  <a-checkbox-group v-model='items[i].filled' v-if="item.inputType === '2'"
                                    @change='e => checkboxChange(e, i)'>
                    <a-row>
                      <a-col v-for='(option, j) in item.multiList' :key='option.id' :span='24' style='margin: 6px 0'>
                        <a-checkbox :value='option.id'>
                          {{ option.topic }}
                        </a-checkbox>
                      </a-col>
                    </a-row>
                  </a-checkbox-group>

                  <!--输入框-->
                  <a-textarea v-if="item.inputType === '3'" v-model='items[i].fill'
                              :auto-size='{ minRows: 3, maxRows: 5 }' />
                </div>
              </div>
            </div>
          </div>
        </a-spin>
      </a-tab-pane>
      <a-tab-pane :key='2' type='card' :tab='record.currentYear + "年度新提拔任用干部民主评议表"'>
        <a-spin :spinning='itemsLoading' style='height: 500px; overflow-y: scroll'>
          <div class='content-box'>
            <a-table :columns='columns' :data-source='newLeadersItem' bordered :pagination='false'>
              <template slot='name' slot-scope='text, record, index'>
                {{ text }}
              </template>

              <template slot='birthday' slot-scope='text, record, index'>
                {{ getBirthday(text) }}
              </template>

              <template slot='originalPosition' slot-scope='text, record, index'>
                {{ text }} （{{record.originalDate}}）
              </template>

              <template slot='currentPosition' slot-scope='text, record, index'>
                {{ text }} （{{record.curDate}}）
              </template>

              <template slot='operation' slot-scope='text, record, index'>
                <a-radio-group v-model='newLeadersItem[index].fill'>
                  <a-radio value='A'>
                    认同
                  </a-radio>
                  <a-radio value='B'>
                    基本认同
                  </a-radio>
                  <a-radio value='C'>
                    不认同
                  </a-radio>
                  <a-radio value='D'>
                    不了解
                  </a-radio>
                </a-radio-group>

                <!--                <a-textarea v-model="newLeadersItem[index].reason" placeholder="请填写不认同的原因"-->
                <!--                            :auto-size="{ minRows: 2, maxRows: 3 }"-->
                <!--                            style="width: 88%; margin-top: 20px"-->
                <!--                            v-if="record.fill === 'C'"-->
                <!--                />-->
              </template>
            </a-table>

            <div style='margin: 50px 0 10px 0'>您对新提拔任用的干部（请具体到人）表示不认同的主要原因是：</div>
            <div>
              <a-textarea v-model='reason' placeholder='输入内容：'
                          :auto-size='{ minRows: 4, maxRows: 5 }'
              />
            </div>


          </div>
        </a-spin>
      </a-tab-pane>
    </a-tabs>
  </t-modal>
</template>

<script>

import TModal from '@/component/TModal.vue'
import { deleteCurrentUser, submitDemocratic } from '@/api/assessApis'
import { getAction, postAction } from '@/api/manage'
import TSelectUserByDep from '@/component/TSelectUserByDep.vue'
import moment from 'moment/moment'
import Vue from 'vue'
import {
  ACCESS_TOKEN,
  CACHE_INCLUDED_ROUTES, TENANT_ID,
  UI_CACHE_DB_DICT_DATA,
  USER_INFO,
  USER_NAME
} from '@/store/mutation-types'
import { logout } from '@/api/login'
import { mapActions } from 'vuex'

export default {
  name: 'AssessReportEvaluationFillModal',
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
      reason: ''

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
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].inputType === '1' && this.items[i].fill === null) {
          this.$warning({
            title: '填写内容不完整！',
            content: '《干部选拔任用工作民主评议表》有必填项目未填写！'
          })
          return
        }
      }

      for (let i = 0; i < this.newLeadersItem.length; i++) {
        if (this.newLeadersItem[i].fill === null) {
          this.$warning({
            title: '填写内容不完整！',
            content: '《新提拔任用干部民主评议表》中有未填写的对提拔任用干部的看法！'
          })
          return
        }
      }

      let that = this
      this.$confirm({
        title: '即将退出登录',
        content: h => <div
          style='color:red;'>点击确认后将提交测评结果，系统自动退出登录，并且无法再次登录。请确认是否继续提交？</div>,
        onOk() {
          that.handleOk()
        },
        onCancel() {
        },
        class: 'test'
      })
    },
    ...mapActions(['Logout']),
    // handleOk() {
    //   let that = this

    //   let form = {
    //     summaryId: this.record.id,
    //     items: this.items,
    //     newLeadersItems: this.newLeadersItem,
    //     reason: this.reason
    //   }


    //   postAction('/modules/report/reportDemocratic/submit', form).then(res => {
    //     if (res.success) {
    //       // this.$message.success(res.message)
    //       this.submitCallback()
    //       this.$emit('ok')
    //       this.reason = ''

    //       deleteCurrentUser().then(res => {
    //         if (res.success) {
    //           that.Logout({}).then(() => {
    //             // update-begin author:scott date:20211223 for:【JTC-198】退出登录体验不好
    //             //that.$router.push({ path: '/user/login' });
    //             window.location.reload()
    //             // update-end author:scott date:20211223 for:【JTC-198】退出登录体验不好
    //           }).catch(err => {
    //             this.$message.error({
    //               title: '错误',
    //               description: err.message
    //             })
    //           })
    //         }
    //       })

    //     } else {
    //       // this.$message.error(res.message)
    //       this.$confirm({
    //         title: '消息提示',
    //         content: h => <div style="color:red;">{res.message}</div>,
    //         onOk: () => {
    //         },
    //         onCancel: () => {
    //         }
    //       })
    //     }
    //   })
    // },
    handleOk() {
      let that = this

      let form = {
        summaryId: this.record.id,
        items: this.items,
        newLeadersItems: this.newLeadersItem,
        reason: this.reason
      }

      postAction('/modules/report/reportDemocratic/submit', form).then(res => {
        if (res.success) {
          // this.$message.success(res.message)
          this.$success({
            title: res.message
            // JSX support
          })
          this.submitCallback()
          this.$emit('ok')
          this.reason = ''

          // 添加一个1秒的延迟，确保用户能看到成功消息
          setTimeout(() => {
            deleteCurrentUser().then(res => {
              if (res.success) {
                that.Logout({}).then(() => {
                  window.location.reload()
                }).catch(err => {
                  // this.$message.error({
                  //   title: '错误',
                  //   description: err.message
                  // });

                  this.$error({
                    title: '错误',
                    content: err.message
                  })
                })
              }
            })
          }, 1000) // 延迟1秒

        } else {
          // 错误处理保持不变
          this.$confirm({
            title: '消息提示',
            content: h => <div style='color:red;'>{res.message}</div>,
            onOk: () => {
            },
            onCancel: () => {
            }
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
  font-size: 16px;
  font-weight: bold;
}

.content-row-item-option {
  display: flex;
  align-items: center;
  padding-left: 26px;
}

.options {
  margin-right: 20px;
  margin-bottom: 10px;
}

</style>