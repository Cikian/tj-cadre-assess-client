<template>
  <a-spin :spinning='confirmLoading'>
    <table class='table-msg'>
      <tr>
        <td>年度</td>
        <td>{{ model.currentYear }}</td>
        <td>考核名称</td>
        <td>{{ model.assessName }}</td>
      </tr>
      <tr>
        <td>单位（处室）</td>
        <td>{{ model.depart_dictText }}</td>
        <td>填报人</td>
        <td>{{ model.reportBy }}</td>
      </tr>
      <tr>
        <td>截止时间</td>
        <td>{{ model.deadline }}</td>
<!--        <td v-if="model.auditBy">审核人</td>-->
<!--        <td v-if="model.auditBy">{{ model.auditBy }}</td>-->
        <td v-if="model.remark" style="color: #ff3838">退回原因</td>
        <td v-if="model.remark" style="color: #ff3838">{{ model.remark }}</td>
      </tr>
    </table>

    <div class="tag">
      <img src="@/assets/cadre/status/待提交.png" v-show="model.status == 1">
      <img src="@/assets/cadre/status/审核中.png" v-show="model.status == 2">
      <img src="@/assets/cadre/status/已完成.png" v-show="model.status == 3">
      <img src="@/assets/cadre/status/已退回.png" v-show="model.status == 4">
    </div>

<!--    <seal :show-time='false' v-if="model.status == 3" style="position: absolute; top: -10px; right: 0" :show-title="true" :title="'审核人'" :content="model.auditBy" />-->

    <div ref='container' style='margin-top: 30px; width: 100%;'>

      <div style='background-color: white;margin: 10px 0px;'>
        <a-affix ref='fix' :target='() => this.$refs.container'>
          <div style='background-color: #fff; padding: 10px 15px' ref='div1'>
            <tj-title :value='"《" + model.currentYear + "年度一报告两评议工作安排》"'></tj-title>
          </div>
        </a-affix>

        <assess-report-arrange-form :objects='newLeaders' ref='assessReportArrangeForm'
                                    :disabled='formDisabled'></assess-report-arrange-form>

      </div>

      <div style='background-color: white;margin: 10px 0px;'>
        <a-affix ref='fix' :target='() => this.$refs.container'>
          <div
            style='background-color: #fff; padding: 10px 15px;display: flex; align-items: center;'
            ref='div22'>
            <tj-title :value='"《" + model.currentYear +"年度领导班子工作总结》"'></tj-title>
            <span style='color: #cc0000;font-size: 16px;margin-left: 10px;margin-top: 12px;'>需上传盖章后的扫描文件，格式为pdf</span>
          </div>
        </a-affix>

        <jeupload
          :type='"report"'
          :disabled="formDisabled"
          :multiple='false'
          :dragger='true'
          :number='1'
          accept=".pdf"
          :deorper='"de"'
          :logal='model.depart_dictText'
          :before-upload='beforeUpload'
          style="padding: 0px 0px 30px 0px; width: 95%; margin: 0 auto"
          v-model='model.reportFile'
        />

      </div>

      <div style='background-color: white;margin: 10px 0px;'>
        <a-affix ref='fix' :target='() => this.$refs.container'>
          <div
            style='background-color: #fff; padding: 10px 15px;display: flex; align-items: center; justify-content: space-between;'
            ref='div2'>
            <tj-title :value='"《" + model.currentYear + "年度新提拔干部名册》"'></tj-title>

            <div style='display: flex'>
              <a-button :disabled="formDisabled" shape='round' type='primary' style='margin-right: 50px' @click='addRow()'
                        class='addbtn' icon='plus'>新增
              </a-button>
            </div>


          </div>
        </a-affix>

        <a-table :columns='newLeadersColumns' :data-source='newLeaders' bordered :pagination='false'>
          <template slot='name' slot-scope='text, record, index'>
            <div>
              <!--              <t-select-user-by-dep ref='rowUser' v-if='record.editable' store='id' text='realname'-->
              <!--                :depart-id='model.depart' :get-leader='false' :value='record.name' :multi=false-->
              <!--                @change='e => handleChange(e, record.id, "name", "newLeaders")' style='width: 100%' />-->
              <!--              <template v-else>-->
              <!--                {{ text }}-->
              <!--              </template>-->

              <a-input v-if='record.editable' style='margin: -5px 0' :value='record.name'
                       @change='e => handleChange(e.target.value, record.id, "name", "newLeaders")' />
              <template v-else>
                {{ text }}
              </template>
            </div>
          </template>

          <template slot='sex' slot-scope='text, record, index'>
            <div>
              <a-select v-if='record.editable' style='margin: -5px 0; width: 100%' :value='record.sex'
                        @change='e => handleChange(e, record.id, "sex", "newLeaders")'>
                <a-select-option value='男'>男</a-select-option>
                <a-select-option value='女'>女</a-select-option>
              </a-select>
              <template v-else>
                {{ text }}
              </template>
            </div>
          </template>

          <template slot='birthday' slot-scope='text, record, index'>
            <div>
              <a-month-picker v-if='record.editable' :format="'YYYY.MM'" style='margin: -5px 0' :value='text'
                              @change='e => handleChange(e, record.id, "birthday", "newLeaders")' />
              <template v-else>
                {{ getBirthday(text) }}
              </template>
            </div>
          </template>

          <template slot='originalPosition' slot-scope='text, record, index'>
            <div>
              <div v-if='record.editable' style='display: flex; justify-content: space-around'>
                <a-input style='margin: -5px 0' :value='text'
                         @change='e => handleChange(e.target.value, record.id, "originalPosition", "newLeaders")'
                         placeholder='请输入原任职务'
                />
                <a-range-picker
                  style='margin: -5px 0;width: 120%'
                  :placeholder="['开始时间', '结束时间']"
                  format='YYYY.MM'
                  :value='originalDateValue'
                  :mode='originalPositionDate'
                  @panelChange='e => originalDatePanelChange(e, record.id)'
                  @change='originalDateChange'
                />
              </div>
              <template v-else>
                {{ record.originalPosition }} {{ record.originalDate }}
              </template>
            </div>
          </template>

          <template slot='currentPosition' slot-scope='text, record, index'>
            <div>
              <div v-if='record.editable' style='display: flex; justify-content: space-around'>
                <a-input style='margin: -5px 0' :value='text'
                         @change='e => handleChange(e.target.value, record.id, "currentPosition", "newLeaders")'
                         placeholder='请输入现任职务'
                />
                <a-range-picker
                  style='margin: -5px 0;width: 120%;font-size: 10px;'
                  :placeholder="['开始时间', '至今']"
                  format='YYYY.MM'
                  :value='currentDateValue'
                  :mode='currentPositionDate'
                  @panelChange='e => currentDatePanelChange(e, record.id)'
                  @change='currentDateChange'
                />
              </div>
              <template v-else>
                {{ record.currentPosition }} {{ record.curDate }}
              </template>
            </div>
          </template>

          <!--          <template slot="reportFile" slot-scope="text, record, index">-->
          <!--            <div>-->
          <!--              <j-upload v-if="record.editable" style="margin: -5px 0" :value="text"-->
          <!--                        @change='e => handleChange(e, record.id, "reportFile", "newLeaders")' />-->
          <!--              <template v-else>-->
          <!--                <span v-if="text === '' || text === null || text === undefined">未上传</span>-->
          <!--                <a-button v-else type="primary" icon="download" @click="downloadFile(text)">-->
          <!--                  下载-->
          <!--                </a-button>-->
          <!--              </template>-->
          <!--            </div>-->
          <!--          </template>-->

          <template slot='operation' slot-scope='text, record, index'>
            <div class='editable-row-operations'>
              <span v-if='record.editable'>
                <a @click='() => save(record.id, "newLeaders")'><a-icon type='check' /></a>

<!--                <a-divider type='vertical' />-->
<!--                <a @click='() => cancel(record.id, "newLeaders")'><a-icon style='color: #fa3739' type='close' /></a>-->
              </span>
              <span v-else>
                <a :disabled="formDisabled" @click='() => editRow(record.id, "newLeaders")'>
                  <a-icon type='edit' :style="{ fontSize: '18px', color: '#0792FF' }" />
                </a>
                <a-divider type='vertical' />
                <a :disabled="formDisabled" @click='() => deleteRow(record.id, "newLeaders")'>
                  <a-icon type='delete' :style="{ fontSize: '18px', color: '#FC6A6A' }" />
                </a>
              </span>
            </div>
          </template>
        </a-table>

      </div>

      <div style='background-color: white;margin: 10px 0px;'>
        <a-affix ref='fix' :target='() => this.$refs.container'>
          <div
            style='background-color: #fff; padding: 10px 20px; display: flex; justify-content: space-between;font-size: 10px;'
            ref='div2'>
            <tj-title value='《评议对象有关信息汇总表》'></tj-title>
            <!--            <a-button shape='round' type='primary' @click='addRow("assessObj")' style='margin-right: 50px' icon="plus"-->
            <!--              class="addbtn">新增-->
            <!--            </a-button>-->
          </div>
        </a-affix>

        <a-table :columns='assessObjColumns' :data-source='assessObj' bordered :pagination='false'>
          <template slot='name' slot-scope='text, record, index'>
            <div>
              <!--              <t-select-user-by-dep ref="rowUser" v-if="record.editable" store="id" text="realname"-->
              <!--                                    :depart-id="model.depart" :get-leader="false" :value="record.name" :multi=false-->
              <!--                                    @change='e => handleChange(e, record.id, "name", "assessObj")'-->
              <!--                                    style="width: 100%" />-->
              <!--              <template v-else>-->
              <!--                {{ text }}-->
              <!--              </template>-->
              <!--              <a-input readOnly v-if="record.editable" style="margin: -5px 0" :value="record.name"-->
              <!--                       @change='e => handleChange(e.target.value, record.id, "name", "newLeaders")' />-->
              <template>
                <j-ellipsis :value='text' :length='4' />
              </template>
            </div>
          </template>

          <template slot='birthday' slot-scope='text, record, index'>
            <div>
              <!--              <a-month-picker v-if="record.editable" :format="'YYYY.MM'" style="margin: -5px 0" :value="text"-->
              <!--                              @change='e => handleChange(e, record.id, "birthday", "assessObj")' />-->
              <template>
                <j-ellipsis :value='getBirthday(text)' :length='7' />
              </template>
            </div>
          </template>

          <template slot='presentPosition' slot-scope='text, record, index'>
            <div>
              <!--              <a-input v-if="record.editable" style="margin: -5px 0" :value="text"-->
              <!--                       @change='e => handleChange(e.target.value, record.id, "presentPosition", "assessObj")' />-->
              <template>
                <j-ellipsis :value='text' :length='4' />
              </template>
            </div>
          </template>

          <template slot='joinPartyDate' slot-scope='text, record, index'>
            <div>
              <a-tooltip v-if='record.editable' placement='top'>
                <template slot='title'>
                  <p>
                    【入党时间】：要如实填写，一般填写到月份，一律用公历和阿拉伯数字，年份用4位数字表示，月份用2位数字表示，如“1972.04”。民主党派成员或无党派人士，需在“入党时间”栏内注明民主党派名称或注明无党派，如“民建”“九三”“无党派”等，不填写加入民主党派的时间；加入多个民主党派的，须如实填写，各项之间用分号隔开，如“民建；民盟”。
                    是民主党派成员又是中共党员的，先填写加入中共时间，分号隔开后再填写民主党派名称，如“2001.08；民建”。</p>
                </template>
                <a-input style='margin: -5px 0' :value='text'
                         @change='e => handleChange(e.target.value, record.id, "joinPartyDate", "assessObj")' />
              </a-tooltip>
              <template v-else>
                <j-ellipsis :value='text' :length='7' />
              </template>
            </div>
          </template>

          <template slot='joinWorkDate' slot-scope='text, record, index'>
            <div>
              <a-month-picker v-if='record.editable' :format="'YYYY.MM'" style='margin: -5px 0' :value='text'
                              @change='e => handleChange(e, record.id, "joinWorkDate", "assessObj")'
                              placeholder='请选择' />
              <template v-else>
                <j-ellipsis :value='getBirthday(text)' :length='7' />
              </template>
            </div>
          </template>

          <template slot='talkRecommend' slot-scope='text, record, index'>
            <div>
              <a-select class='selects' v-if='record.editable' v-model='text'
                        @change='e => handleChange(e, record.id, "talkRecommend", "assessObj")'>
                <a-select-option :value='true'>是</a-select-option>
                <a-select-option :value='false'>否</a-select-option>
              </a-select>
              <template v-else>
                {{ text === true ? '是' : text === false ? '否' : '请选择' }}
              </template>
            </div>
          </template>

          <template slot='meetRecommend' slot-scope='text, record, index'>
            <div>
              <a-select class='selects' v-if='record.editable' v-model='text'
                        @change='e => handleChange(e, record.id, "meetRecommend", "assessObj")'>
                <a-select-option :value='true'>是</a-select-option>
                <a-select-option :value='false'>否</a-select-option>
              </a-select>
              <template v-else>
                {{ text === true ? '是' : text === false ? '否' : '请选择' }}
              </template>
            </div>
          </template>

          <template slot='inspect' slot-scope='text, record, index'>
            <div>
              <a-select class='selects' v-if='record.editable' v-model='text'
                        @change='e => handleChange(e, record.id, "inspect", "assessObj")'>
                <a-select-option :value='true'>是</a-select-option>
                <a-select-option :value='false'>否</a-select-option>
              </a-select>
              <template v-else>
                {{ text === true ? '是' : text === false ? '否' : '请选择' }}
              </template>
            </div>
          </template>

          <template slot='fileReview' slot-scope='text, record, index'>
            <div>
              <a-select class='selects' v-if='record.editable' v-model='text'
                        @change='e => handleChange(e, record.id, "fileReview", "assessObj")'>
                <a-select-option :value='true'>是</a-select-option>
                <a-select-option :value='false'>否</a-select-option>
              </a-select>
              <template v-else>
                {{ text === true ? '是' : text === false ? '否' : '请选择' }}
              </template>
            </div>
          </template>

          <template slot='personalReview' slot-scope='text, record, index'>
            <div>
              <a-select class='selects' v-if='record.editable' v-model='text'
                        @change='e => handleChange(e, record.id, "personalReview", "assessObj")'>
                <a-select-option :value='true'>是</a-select-option>
                <a-select-option :value='false'>否</a-select-option>
              </a-select>
              <template v-else>
                {{ text === true ? '是' : text === false ? '否' : '请选择' }}
              </template>
            </div>
          </template>

          <template slot='disciplineOpinion' slot-scope='text, record, index'>
            <div>
              <a-select class='selects' v-if='record.editable' v-model='text'
                        @change='e => handleChange(e, record.id, "disciplineOpinion", "assessObj")'>
                <a-select-option :value='true'>是</a-select-option>
                <a-select-option :value='false'>否</a-select-option>
              </a-select>
              <template v-else>
                {{ text === true ? '是' : text === false ? '否' : '请选择' }}
              </template>
            </div>
          </template>

          <template slot='nonAssessSituation' slot-scope='text, record, index'>
            <div>
              <a-select class='selects' v-if='record.editable' v-model='text'
                        @change='e => handleChange(e, record.id, "nonAssessSituation", "assessObj")'>
                <a-select-option :value='true'>是</a-select-option>
                <a-select-option :value='false'>否</a-select-option>
              </a-select>
              <template v-else>
                {{ text === true ? '是' : text === false ? '否' : '请选择' }}
              </template>
            </div>
          </template>

          <template slot='discuss' slot-scope='text, record, index'>
            <div>
              <a-select class='selects' v-if='record.editable' v-model='text'
                        @change='e => handleChange(e, record.id, "discuss", "assessObj")'>
                <a-select-option :value='true'>是</a-select-option>
                <a-select-option :value='false'>否</a-select-option>
              </a-select>
              <template v-else>
                {{ text === true ? '是' : text === false ? '否' : '请选择' }}
              </template>
            </div>
          </template>

          <template slot='accord' slot-scope='text, record, index'>
            <div>
              <a-select class='selects' v-if='record.editable' v-model='text'
                        @change='e => handleChange(e, record.id, "accord", "assessObj")'>
                <a-select-option :value='true'>是</a-select-option>
                <a-select-option :value='false'>否</a-select-option>
              </a-select>
              <template v-else>
                {{ text === true ? '是' : text === false ? '否' : '请选择' }}
              </template>
            </div>
          </template>

          <template slot='publicity' slot-scope='text, record, index'>
            <div>
              <a-select class='selects' v-if='record.editable' v-model='text'
                        @change='e => handleChange(e, record.id, "publicity", "assessObj")'>
                <a-select-option :value='true'>是</a-select-option>
                <a-select-option :value='false'>否</a-select-option>
              </a-select>
              <template v-else>
                {{ text === true ? '是' : text === false ? '否' : '请选择' }}
              </template>
            </div>
          </template>

          <template slot='expose' slot-scope='text, record, index'>
            <div>
              <a-select class='selects' v-if='record.editable' v-model='text'
                        @change='e => handleChange(e, record.id, "expose", "assessObj")'>
                <a-select-option value="1">否</a-select-option>
                <a-select-option value="2">是,有</a-select-option>
                <a-select-option value="3">是,无</a-select-option>
              </a-select>
              <template v-else>
                {{ text === "1" ? '否' : text === "2" ? '是,有' : text === "3" ? '是,无': '请选择' }}
              </template>
            </div>
          </template>


          <template slot='operation' slot-scope='text, record, index'>
            <div class='editable-row-operations'>
              <span v-if='record.editable'>
                <a @click='() => save(record.id, "assessObj")'><a-icon type='check' /></a>
                <a-divider type='vertical' />
                <a @click='() => cancel(record.id, "assessObj")'><a-icon style='color: #fa3739' type='close' /></a>
              </span>
              <span v-else>
                <a :disabled="formDisabled" @click='() => editRow(record.id, "assessObj")'>
                  <a-icon type='edit' :style="{ fontSize: '18px', color: '#0792FF' }" />
                </a>
                <!--                <a-divider type='vertical' />-->
                <!--                <a @click='() => deleteRow(record.id, "assessObj")'>-->
                <!--                  <a-icon type="delete" :style="{ fontSize: '18px', color: '#FC6A6A' }" />-->
                <!--                </a>-->
              </span>
            </div>
          </template>
        </a-table>
        <div style="padding: 20px 40px;font-size: 16px">
          <span>注:<br>
          1.本表所列评议对象按照任职时间顺序排列,“出生年月”、“入党时间”、“参加工作时间”等栏目应填写到月，年份用4位数字表示，月份用2位数字表示，如“1970.07”。<br>
          2.本表所列评议对象职务按照最新职务填写。<br>
          3.请如实填写本表，如发现弄虚作假，严肃追究有关人员责任。</span>
        </div>

      </div>
    </div>
  </a-spin>
</template>

<script>

import TjTitle from '@/component/TjTitle.vue'
import TjSubtitle from '@/component/TjSubtitle.vue'
import TSelectUserByDep from '@/component/TSelectUserByDep.vue'
import AssessReportArrangeForm from './AssessReportArrangeForm.vue'
import { getFileAccessHttpUrl } from '@/api/manage'
import {
  fillAnnualFill,
  getReportAssessObj,
  getReportNewLeaders,
  saveReportFill,
  submitReportFill
} from '@/api/assessApis'
import moment from 'moment'
import TUpload from '@/component/TUplod.vue'
import jeupload from '@/component/jeupload.vue'
import seal from '@/component/Seal.vue'

export default {
  name: 'AssessReportFillForm',
  components: {
    seal,
    jeupload,
    TUpload,
    TSelectUserByDep,
    TjSubtitle, TjTitle, AssessReportArrangeForm
  },
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
      originalPositionDate: ['month', 'month'],
      currentPositionDate: ['month', 'month'],
      originalDateValue: [],
      currentDateValue: [],
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      confirmLoading: false,
      url: {
        add: '/modules/report/assessReportFill/add',
        edit: '/modules/report/assessReportFill/edit',
        queryById: '/modules/report/assessReportFill/queryById'
      },
      newLeadersColumns: [
        {
          title: '姓名',
          dataIndex: 'name',
          align: 'center',
          width: 100,
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '性别',
          dataIndex: 'sex',
          align: 'center',
          width: 100,
          scopedSlots: { customRender: 'sex' }
        },
        {
          title: '出生年月',
          dataIndex: 'birthday',
          align: 'center',

          scopedSlots: { customRender: 'birthday' }
        },
        {
          title: '原任职务及任职时间',
          dataIndex: 'originalPosition',
          align: 'center',

          scopedSlots: { customRender: 'originalPosition' }
        },
        {
          title: '现任职务及任职时间',
          dataIndex: 'currentPosition',
          align: 'center',

          scopedSlots: { customRender: 'currentPosition' }
        },
        {
          title: '操作',
          dataIndex: 'operation',
          align: 'center',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      newLeaders: [],
      assessObj: [],
      assessObjColumns: [
        {
          title: '姓名',
          dataIndex: 'name',
          align: 'center',

          scopedSlots: { customRender: 'name' }
        },
        {
          title: '出生年月',
          dataIndex: 'birthday',
          align: 'center',

          scopedSlots: { customRender: 'birthday' }
        },
        {
          title: '现任职务',
          dataIndex: 'presentPosition',
          align: 'center',

          scopedSlots: { customRender: 'presentPosition' }
        },
        {
          title: '入党时间',
          dataIndex: 'joinPartyDate',
          align: 'center',

          scopedSlots: { customRender: 'joinPartyDate' }
        },
        {
          title: '参加工作时间',
          dataIndex: 'joinWorkDate',
          align: 'center',

          scopedSlots: { customRender: 'joinWorkDate' }
        },
        {
          title: '民主推荐',
          align: 'center',
          children: [
            {
              title: '是否进行谈话推荐',
              dataIndex: 'talkRecommend',
              align: 'center',

              scopedSlots: { customRender: 'talkRecommend' }
            },
            {
              title: '是否进行会议推荐',
              dataIndex: 'meetRecommend',
              align: 'center',

              scopedSlots: { customRender: 'meetRecommend' }
            }
          ]
        },
        {
          title: '考察把关',
          align: 'center',
          children: [
            {
              title: '是否进行考察',
              dataIndex: 'inspect',
              align: 'center',

              scopedSlots: { customRender: 'inspect' }
            },
            {
              title: '是否进行干部人事档案审核',
              dataIndex: 'fileReview',
              align: 'center',

              scopedSlots: { customRender: 'fileReview' }
            },
            // {
            //   title: '是否进行个人有关事项查核',
            //   dataIndex: 'personalReview',
            //   align: 'center',
            //
            //   scopedSlots: { customRender: 'personalReview' }
            // },
            {
              title: '是否征求纪检监察机关意见',
              dataIndex: 'disciplineOpinion',
              align: 'center',

              scopedSlots: { customRender: 'disciplineOpinion' }
            },
            {
              title: '是否有不得列为考察对象的情形',
              dataIndex: 'nonAssessSituation',
              align: 'center',

              scopedSlots: { customRender: 'nonAssessSituation' }
            }
          ]
        },
        {
          title: '党委（党组）会议讨论决定',
          align: 'center',
          children: [
            {
              title: '是否经会议集体讨论决定',
              dataIndex: 'discuss',
              align: 'center',

              scopedSlots: { customRender: 'discuss' }
            },
            {
              title: '参会人员是否符合规定要求',
              dataIndex: 'accord',
              align: 'center',

              scopedSlots: { customRender: 'accord' }
            }
          ]
        },
        {
          title: '任职公示',
          align: 'center',
          children: [
            {
              title: '是否进行公示',
              dataIndex: 'publicity',
              align: 'center',

              scopedSlots: { customRender: 'publicity' }
            },
            {
              title: '是否有举报反映，有无进行查核',
              dataIndex: 'expose',
              align: 'center',

              scopedSlots: { customRender: 'expose' }
            }
          ]
        },
        {
          title: '操作',
          dataIndex: 'operation',
          align: 'center',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      reportArrange: {},
      newLeadersCacheData: undefined,
      assessObjCacheData: undefined,
      editingNewLeaderKey: '',
      editingAssessObjKey: ''
    }
  },
  computed: {
    formDisabled() {
      return this.disabled
    }
  },
  created() {
    //备份model原始值
    this.modelDefault = JSON.parse(JSON.stringify(this.model))
  },
  methods: {
    originalDatePanelChange(value, key) {
      this.originalDateValue = value
      let newData = [...this.newLeaders]
      let target = newData.find(item => key === item.id)
      if (target) {
        let moment1 = value[0]
        let moment2 = value[1]
        let value1 = moment1.format('YYYY.MM')
        let value2 = moment2.format('YYYY.MM')
        target['originalDate'] = value1 + '—' + value2
        this.currentDateValue[0] = moment2
        this.currentDateValue[1] = null
        let value3 = moment2.format('YYYY.MM')
        target['curDate'] = value3 + '—' + '至今'
        this.newLeaders = newData
      }
    },
    currentDatePanelChange(value, key) {
      this.currentDateValue = value
      this.currentDateValue[1] = null
      let newData = [...this.newLeaders]
      let target = newData.find(item => key === item.id)
      if (target) {
        let moment1 = value[0]
        let value1 = moment1.format('YYYY.MM')
        target['curDate'] = value1 + '—' + '至今'
        this.newLeaders = newData
      }
    },
    originalDateChange(value) {
      this.originalDateValue = value
    },
    currentDateChange(value) {
      this.currentDateValue = value
    },
    validateError(msg) {
      // this.$message.error(msg)
      // this.$confirm({
      //   title: '消息提示',
      //   content: h => <div style='color:red;'>{msg}</div>,
      //   onOk: () => {
      //   },
      //   onCancel: () => {
      //   }
      // })
      this.$error({
        title: '消息提示',
        content: h => <div style='color:red;'>{msg}</div>
      })
    },
    add() {
      this.edit(this.modelDefault)
    },
    edit(record) {
      this.model = Object.assign({}, record)
      this.visible = true

      // 获取新上任领导
      getReportNewLeaders(record.id).then(res => {
        if (res.success) {
          this.newLeaders = res.result.records
          for (let i = 0; i < this.newLeaders.length; i++) {
            this.newLeaders[i].birthday = moment(this.newLeaders[i].birthday, 'YYYY-MM-DD')
          }
          this.newLeadersCacheData = this.newLeaders.map(item => ({ ...item }))
        }
      })

      // 获取考察对象
      getReportAssessObj(record.id).then(res => {
        if (res.success) {
          this.assessObj = res.result.records
          for (let i = 0; i < this.assessObj.length; i++) {
            for (let i = 0; i < this.newLeaders.length; i++) {
              if (this.newLeaders[i].name === this.assessObj[i].name) {
                this.assessObj[i].id = this.newLeaders[i].id
                this.assessObj[i].birthday = this.newLeaders[i].birthday
              }
            }
            this.assessObj[i].joinWorkDate = moment(this.assessObj[i].joinWorkDate, 'YYYY-MM-DD')
          }

          this.assessObjCacheData = this.assessObj.map(item => ({ ...item }))
        }
      })

      this.$refs.assessReportArrangeForm.initFormData(this.model.id)
    },

    isNotEmptyStr(s) {
      return typeof s == 'string' && s.length > 0
    },

    close() {
      this.visible = false
      this.$emit('close')
    },

    pass() {
      this.submitForm(true)
    },

    submitForm(isPass) {
      this.$emit('changeLoading')
      let arrange = this.$refs.assessReportArrangeForm.model
      let newLeaders = this.newLeaders
      let assessObj = this.assessObj

      let submitData = {
        reportFill: this.model,
        reportArrange: arrange,
        reportNewLeader: newLeaders,
        reportObjectInfo: assessObj
      }

      submitReportFill(submitData, isPass).then(res => {
        if (res.success) {
          // this.$message.success(res.message)
          this.$success({
            title: res.message,
            content: h => <div style='color:green;'>{res.message}</div>
          })
          this.$emit('ok')
          this.close()
        } else {
          // this.$message.warning(res.message)
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
            content: h => <div style='color:red;'>{res.message}</div>
          })
        }
        this.$emit('changeLoading')
      })
    },

    handleSave() {
      this.$emit('changeLoading')
      let arrange = this.$refs.assessReportArrangeForm.model
      let newLeaders = this.newLeaders
      let assessObj = this.assessObj

      let submitData = {
        reportFill: this.model,
        reportArrange: arrange,
        reportNewLeader: newLeaders,
        reportObjectInfo: assessObj
      }
      saveReportFill(submitData).then(res => {
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
            title: res.message,
            content: h => <div style='color:green;'>{res.message}</div>
          })
          this.$emit('ok')
          this.close()
        } else {
          // this.$message.warning(res.message)
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
            content: h => <div style='color:red;'>{res.message}</div>
          })
        }
        this.$emit('changeLoading')
      })
    },

    handleChange(value, key, column, type) {
      if (type === 'newLeaders') {
        let newData = [...this.newLeaders]
        let target = newData.find(item => key === item.id)
        if (target) {
          target[column] = value
          if (column === 'name' || column === 'birthday' || column === 'currentPosition') {
            // target['name_dictText'] = this.$refs.rowUser.textVals
            if (column === 'currentPosition') {
              column = 'presentPosition'
            }
            let newAssessObjData = [...this.assessObj]
            let target = newAssessObjData.find(item => key === item.id)
            if (target) {
              target[column] = value
              // target['name_dictText'] = this.$refs.rowUser.textVals
              this.assessObj = newAssessObjData
            }

          }

          this.newLeaders = newData
        }
      }
      if (type === 'assessObj') {
        let newData = [...this.assessObj]
        let target = newData.find(item => key === item.id)
        if (target) {
          target[column] = value
          this.assessObj = newData
        }
      }

    },

    editRow(key, type) {
      if (type === 'newLeaders') {
        this.cancelAll('newLeaders')
        let newData = [...this.newLeaders]
        let target = newData.find(item => key === item.id)
        this.editingNewLeaderKey = key

        if (target) {
          if (target.originalDate && target.curDate) {
            let o1 = target.originalDate.split('—')
            let c1 = target.curDate.split('—')
            if (o1.length >= 1) {
              this.originalDateValue = [moment(o1[0], 'YYYY.MM'), moment(o1[1], 'YYYY.MM')]
            } else {
              this.originalDateValue = []
            }
            if (c1.length >= 1) {
              this.currentDateValue = [moment(c1[0], 'YYYY.MM'), null]
            } else {
              this.currentDateValue = []
            }
          }
          target.editable = true
          this.newLeaders = newData
        }
      }
      if (type === 'assessObj') {
        this.cancelAll('assessObj')
        let newData = [...this.assessObj]
        let target = newData.find(item => key === item.id)
        this.editingAssessObjKey = key
        if (target) {
          target.editable = true
          this.assessObj = newData
        }
      }
    },

    deleteRow(key) {
      let newLeadersData = [...this.newLeaders]
      this.newLeaders = newLeadersData.filter(item => item.id !== key)
      this.newLeadersCacheData = this.newLeaders.map(item => ({ ...item }))

      let newAssessObjData = [...this.assessObj]
      this.assessObj = newAssessObjData.filter(item => item.id !== key)
      this.assessObjCacheData = this.assessObj.map(item => ({ ...item }))
    },

    save(key, type) {
      if (type === 'newLeaders') {
        let newData = [...this.newLeaders]
        let newCacheData = [...this.newLeadersCacheData]
        let target = newData.find(item => key === item.id)
        let targetCache = newCacheData.find(item => key === item.id)
        if (target && targetCache) {
          delete target.editable
          this.newLeaders = newData
          Object.assign(targetCache, target)
          this.newLeadersCacheData = newCacheData
        }
        this.editingNewLeaderKey = ''
      }
      if (type === 'assessObj') {
        let newData = [...this.assessObj]
        let newCacheData = [...this.assessObjCacheData]
        let target = newData.find(item => key === item.id)
        let targetCache = newCacheData.find(item => key === item.id)
        if (target && targetCache) {
          delete target.editable
          this.assessObj = newData
          Object.assign(targetCache, target)
          this.assessObjCacheData = newCacheData
        }
        this.editingAssessObjKey = ''
      }
    },

    cancel(key, type) {
      if (type === 'newLeaders') {
        let newData = [...this.newLeaders]
        let target = newData.find(item => key === item.id)
        this.editingNewLeaderKey = ''
        if (target) {
          Object.assign(target, this.newLeadersCacheData.find(item => key === item.id))
          delete target.editable
          this.newLeaders = newData
        }
      }
      if (type === 'assessObj') {
        let newData = [...this.assessObj]
        let target = newData.find(item => key === item.id)
        this.editingAssessObjKey = ''
        if (target) {
          Object.assign(target, this.assessObjCacheData.find(item => key === item.id))
          delete target.editable
          this.assessObj = newData
        }
      }
    },

    cancelAll(type) {
      this.editingNewLeaderKey = ''
      this.editingAssessObjKey = ''
      if (type === 'newLeaders') {
        for (let i = 0; i < this.newLeaders.length; i++) {
          delete this.newLeaders[i].editable
        }
      }
      if (type === 'assessObj') {
        for (let i = 0; i < this.assessObj.length; i++) {
          delete this.assessObj[i].editable
        }
      }
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

    downloadFile(text) {
      if (!text) {
        // this.$message.warning('未知的文件')
        // this.$confirm({
        //   title: '消息提示',
        //   content: h => <div style='color:red;'>未知的文件</div>,
        //   onOk: () => {
        //   },
        //   onCancel: () => {
        //   }
        // })
        this.$error({
          title: '错误',
          content: h => <div style='color:red;'>未知的文件</div>
        })
        return
      }
      if (text.indexOf(',') > 0) {
        text = text.substring(0, text.indexOf(','))
      }
      let url = getFileAccessHttpUrl(text)
      window.open(url)
    },

    addRow() {
      this.newLeaders.push({
        id: this.newLeaders.length + 1,
        name: '',
        name_dictText: '',
        birthday: undefined,
        originalPosition: '',
        currentPosition: '',
        reportFile: '',
        fillId: this.model.id
      })
      this.newLeadersCacheData = this.newLeaders.map(item => ({ ...item }))
      this.cancelAll('newLeaders')
      this.editRow(this.newLeaders.length, 'newLeaders')

      this.assessObj.push({
        id: this.assessObj.length + 1,
        name: '',
        name_dictText: '',
        birthday: undefined,
        presentPosition: '',
        joinPartyDate: undefined,
        joinWorkDate: undefined,
        talkRecommend: undefined,
        meetRecommend: undefined,
        inspect: undefined,
        fileReview: undefined,
        personalReview: undefined,
        disciplineOpinion: undefined,
        nonAssessSituation: undefined,
        discuss: undefined,
        accord: undefined,
        publicity: undefined,
        expose: undefined,
        fillId: this.model.id
      })
      this.assessObjCacheData = this.assessObj.map(item => ({ ...item }))
      this.cancelAll('assessObj')

      this.originalDateValue = []
      this.currentDateValue = []
    },
    // 上传之前的回调
    beforeUpload(file){
      return new Promise((resolve, reject) => {
        const isPDF = file.type === 'application/pdf'
        if (!isPDF) {
          // this.$message.warning('请上传pdf格式的盖章扫描文件')
          this.$error({
            title: '错误',
            content: h => <div style='color:red;'>请上传pdf格式的盖章扫描文件</div>
          })
          return reject(false)
        }
        return resolve(true)
      })
    }
  }
}
</script>

<style scoped lang='less'>
.ant-table-thead > tr > th, .ant-table-tbody > tr > td {
  padding: 16px 0px;
  overflow-wrap: break-word;
}

/* /deep/ input{
  font-size: 10px ;
} */
.form-row {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 5px 0;
  transition: height 5s ease-in-out;
}

.form-row-none {
  height: 0;
}

.form-row-left {
  width: 45%;
  display: flex;
}

.form-row-right {
  width: 45%;
  display: flex;
}

.form-item-title {
  width: 30%;
  height: 100%;
}

.form-item-input {
  width: 70%;
  display: flex;
  align-items: center;
}

.table-msg {
  margin: 0 auto;
  width: 95%;
  height: 200px;
  font-size: 16px;
  font-weight: 500;
  color: #091834;

  tr {
    td {
      padding-left: 30px;
      border: 1px solid #CCD4D7;
      border-collapse: collapse;

      /* 移除单元格之间的间隔 */

      i {
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

    td:nth-child(1),
    td:nth-child(3) {
      background-color: #F4F8FA;
      color: #25477C;
    }
  }
}

.addbtn {
  width: 120px;
  height: 36px;
  border-radius: 18px;
  margin-bottom: 30px;
  box-shadow: 0px 2px 10px 0px rgba(26, 117, 255, 0.4);
}

/deep/ .ant-table-wrapper {
  width: 95%;
  margin: 0 auto;
  background-color: #F4F8FA;

  .ant-table-thead {
    background: #F4F8FA;

    .ant-table-align-center {
      font-weight: 700;
    }
  }

  .ant-table-tbody {
    .ant-btn {
      width: 120px;
      height: 36px;
      border-radius: 18px;
    }
  }
}

.selects {
  width: 100%;
}

.tag {
  position: absolute;
  top: -10px;
  right: 0;
}
</style>