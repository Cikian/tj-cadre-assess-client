<template>
  <a-card :bordered='false'>
    <a-tabs default-active-key='annual' @change='handleTabChange'>
      <a-tab-pane key='annual' tab='年度考核匿名账号'>
        <div style='padding-bottom: 20px;'>
          <a-button type='primary' @click="openAddModal('annual')" icon='plus-square' v-if='isCadre'>年度考核民主测评匿名账号补发
          </a-button>
<!--          <a-button style='margin-left: 20px' type='primary' @click="downloadAccount('annual')">-->
<!--            按处室（单位）补发匿名账号-->
<!--          </a-button>-->
          <a-button style='margin-left: 20px' type='primary' icon='download' @click="downloadAccount('annual')">
            下载年度考核民主测评匿名账号
          </a-button>
          <a-button v-has="'gbc:admin'" v-show='annualList.length > 0' style='margin-left: 20px' type='danger' icon='stop' @click="stopAssess('annual')">
            结束年度考核民主测评
          </a-button>
        </div>
        <a-table
          ref='table'
          size='middle'
          :scroll='{ y: 700 }'
          bordered
          rowKey='id'
          :columns='columns'
          :dataSource='annualList'
          :pagination='false'
          class='j-table-force-nowrap'
        >
          <template slot='action' slot-scope='text, record'>
            <a-popconfirm v-has="'gbc:admin'" title='确定删除吗?' @confirm='() => handleDelete(record.id)'>
              <a>删除</a>
            </a-popconfirm>
          </template>

          <template slot='voteType' slot-scope='text, record'>
            <!--            <span-->
            <!--              v-if='record.workNo == 1'>{{ text === 'A' ? '分管局领导' : text === 'B' ? '总师、二巡、正副处长' : '其他人员(代表)'-->
            <!--              }}</span>-->
            <span>{{ text === 'basic_AB' ? '党政主要领导' : text === 'basic_B' ? '领导班子成员' : text === 'basic_C' ? '干部职工代表' : text === 'bureau_B' ? '总师、二巡、正副处长' : '其他人员'
              }}</span>
          </template>
        </a-table>
      </a-tab-pane>
      <a-tab-pane key='report' tab='一报告两评议匿名账号' v-if='showone'>
        <div style='padding-bottom: 20px;'>
          <a-button v-if='isCadre' type='primary' icon='plus-square' @click="openAddModal('report')">
            一报告两评议民主测评匿名账号补发
          </a-button>
          <a-button style='margin-left: 20px' type='primary' icon='download' @click="downloadAccount('report')">
            下载一报告两评议民主测评匿名账号
          </a-button>
          <a-button v-has="'gbc:admin'" v-show='reportList.length > 0' style='margin-left: 20px' type='danger' icon='stop' @click="stopAssess('report')">
            结束一报告两评议民主测评
          </a-button>
        </div>
        <a-table
          ref='table'
          size='middle'
          :scroll='{ y: 700 }'
          bordered
          rowKey='id'
          :columns='columns'
          :dataSource='reportList'
          :pagination='false'
          class='j-table-force-nowrap'
        >
          <template slot='action' slot-scope='text, record'>
            <a-popconfirm v-has="'gbc:admin'" title='确定删除吗?' @confirm='() => handleDelete(record.id)'>
              <a>删除</a>
            </a-popconfirm>
          </template>
          <template slot='voteType' slot-scope='text, record'>
            <span>{{ text === 'A' ? '领导班子成员' : '干部职工代表' }}</span>
          </template>
        </a-table>
      </a-tab-pane>
    </a-tabs>

    <!-- table区域-begin -->
    <t-modal
      ref='addVoteModal'
      title='匿名账号补发'
      :width='1000'
      :visible='addModelVisible'
      @ok='handleAdd'
      :simple-submit='true'
      :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
      :destroyOnClose="true"
      @cancel='handleCancel'
      cancelText='关闭'
    >

      <j-form-container :disabled='false'>
        <a-form-model ref='form' :model='newUserForm' :rules='validatorRules' slot='detail'>
          <a-row>
            <a-col :span='24'>
              <a-form-model-item label='民主评议类型' :labelCol='labelCol' :wrapperCol='wrapperCol' prop='assess'>
                <span style='font-size: 18px'>{{ newUserForm.assess === 'annual' ? '年度考核民主测评' : '一报告两评议民主测评'
                  }}</span>
              </a-form-model-item>
            </a-col>
            <a-col :span='24'>
              <a-form-model-item label='处室（单位）' :labelCol='labelCol' :wrapperCol='wrapperCol' prop='depart'>
                <j-select-depart v-model='newUserForm.depart' :multi='false' @change='departChange' />
              </a-form-model-item>
            </a-col>
            <a-col :span='24'>
              <a-form-model-item label='匿名票类型' :labelCol='labelCol' :wrapperCol='wrapperCol' prop='voteType'>
                <a-tooltip placement='topLeft' v-if='newUserForm.depart === "" '>
                  <template slot='title'>
                    请先选择处室（单位）后再选择匿名票类型
                  </template>
                  <a-select
                    v-model='newUserForm.voteType'
                    :disabled='true'
                    placeholder='请选择匿名票类型'
                    :show-arrow='false'
                    :filter-option='false'
                    :not-found-content='null'
                    option-label-prop='label'
                  >
                    <a-select-option v-for='o in voteTypeOptions' :key='o.value' :value='o.value' :label='o.text'>
                      {{ o.text }}
                    </a-select-option>
                  </a-select>
                </a-tooltip>

                <a-select
                  v-else
                  v-model='newUserForm.voteType'
                  placeholder='请选择匿名票类型'
                  :show-arrow='false'
                  :filter-option='false'
                  :not-found-content='null'
                  option-label-prop='label'
                >
                  <a-select-option v-for='o in voteTypeOptions' :key='o.value' :value='o.value' :label='o.text'>
                    {{ o.text }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span='24'>
              <a-form-model-item label='补发数量' :labelCol='labelCol' :wrapperCol='wrapperCol' prop='voteNum'>
                <a-input-number v-model='newUserForm.voteNum' style='width: 100%' />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </j-form-container>

    </t-modal>

  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { deleteAction, getAction, postAction } from '@/api/manage'
import TModal from '@/component/TModal.vue'
import { getCurrentUserRoles, getDepartTypeById, stopAssess, stopDem } from '@/api/assessApis'
import { axios } from '@/utils/assessReq'


export default {
  name: 'AssessUser',
  components: { TModal },
  data() {
    return {
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      description: '平时考核结果管理页面',
      disableMixinCreated: true,
      showone: true,
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
          title: '处室（单位）',
          align: 'center',
          dataIndex: 'depart_dictText'
        },
        {
          title: '用户名',
          align: 'center',
          dataIndex: 'username'
        },
        {
          title: '密码',
          align: 'center',
          dataIndex: 'pwdPlainText'
        },
        {
          title: '匿名票类型',
          align: 'center',
          dataIndex: 'voteType',
          scopedSlots: { customRender: 'voteType' }
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
        list: '/anonymity/list',
        delete: '/anonymity/delete'
      },
      dictOptions: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      validatorRules: {
        depart: [
          { required: true, message: '请选择处室（单位）!' }
        ],
        voteType: [
          { required: true, message: '请选择匿名票类型!' }
        ],
        voteNum: [
          { required: true, message: '请输入补发匿名票的数量!' },
          { pattern: /^[1-9]\d*$/, message: '补发数量必须为正整数!' }
        ]
      },

      superFieldList: [],
      annualList: [],
      reportList: [],
      addModelVisible: false,
      disableSubmit: false,
      newUserForm: {
        depart: '', // 单位
        voteType: '', // 匿名票类型
        assess: '', // 考核类型 annual : report
        voteNum: 1 // 数量
      },
      annualOptions: [
        { value: 'A', text: '本单位党政主要领导' },
        { value: 'B', text: '本考核单元内总师、二巡、正副处长' },
        { value: 'C', text: '本处室其他人员' }
      ],
      reportOptions: [
        { value: 'A', text: '领导班子成员' },
        { value: 'B', text: '干部职工代表' }
      ],
      voteTypeOptions: [],
      userRoles: [],
      isCadre: false


    }
  },
  created() {
    this.loadData()
    getCurrentUserRoles().then(res => {
      if (res.success) {
        this.userRoles = res.result
        if (this.userRoles.indexOf('department_cadre_admin') !== -1) {
          this.isCadre = true
        }
      }
    })

//     不属五千.:
// /common/getDepartType

// 不属五千.:
// 返回值：String
// "1"：处室
// 其他：基层单位
    getAction('/common/getDepartType').then(res => {
      if (res.result === '1') {
        this.showone = false
      }
    })

  },
  methods: {
    stopAssess(type) {
      this.$confirm({
        title: '确定要结束民主测评吗？',
        content: '结束考核后剩余匿名账号将被回收，各处室（单位）将无法填写！',
        onOk: () => {
          stopDem(type).then(res => {
            if (res.success) {
              this.loadData()
            }
          })
        },
        onCancel: () => {
        }
      })
    },
    handleTabChange(key) {
    },
    departChange(value) {
      this.voteTypeOptions = []
      if (value) {
        if (this.newUserForm.assess=== 'report'){
          this.voteTypeOptions = this.reportOptions
        }else {
          getDepartTypeById(value).then(res => {
            if (res.success) {
              if (res.result === '1') {
                this.voteTypeOptions = []
                let obj1 = {
                  value: 'B',
                  text: '本考核单元内总师、二巡、正副处长'
                }
                let obj2 = {
                  value: 'C',
                  text: '本处室其他人员'
                }
                this.voteTypeOptions.push(obj1)
                this.voteTypeOptions.push(obj2)
              } else {
                this.voteTypeOptions = []
                let obj1 = {
                  value: 'A',
                  text: '本单位党政主要领导'
                }
                let obj2 = {
                  value: 'B',
                  text: '本单位领导班子成员'
                }
                let obj3 = {
                  value: 'C',
                  text: '本单位干部职工（代表）'
                }
                this.voteTypeOptions.push(obj1)
                this.voteTypeOptions.push(obj2)
                this.voteTypeOptions.push(obj3)
              }
            }
          })
        }
      }
    },
    loadData() {
      getAction(this.url.list).then(res => {
        if (res.success) {
          this.dataSource = []
          // 过滤dataSource中元素assess属性为annual的元素
          this.annualList = []
          // 过滤dataSource中元素assess属性为report的元素
          this.reportList = []

          this.dataSource = res.result.records
          // 过滤dataSource中元素assess属性为annual的元素
          this.annualList = this.dataSource.filter(item => item.assess === 'annual')
          // 过滤dataSource中元素assess属性为report的元素
          this.reportList = this.dataSource.filter(item => item.assess === 'report')
        }
      })
    },
    handleDelete(id) {
      this.$confirm({
        title: '删除后相关处室（单位）将减少一张匿名票，确定删除吗?',
        okType: 'danger',
        onOk: () => {
          deleteAction(this.url.delete + '?id=' + id).then(res => {
            if (res.success) {
              this.loadData()
              this.$success({
                title: '删除成功'
              })
            }
          })
        }
      })
    },
    openAddModal(type) {
      this.newUserForm.assess = type
      if (type === 'report') {
        this.voteTypeOptions = this.reportOptions
      }

      this.addModelVisible = true
    },
    handleAdd() {
      this.$refs.form.validate(valid => {
        if (valid) {
          postAction('/common/addAnonymousAccount', this.newUserForm).then(res => {
            if (res.success) {
              this.$success({
                title: '添加成功'
              })
              this.addModelVisible = false;
              this.newUserForm.depart='';
              this.newUserForm.voteType='';
              this.loadData()
            } else {
              this.$error({
                title: '添加失败',
                content: res.message
              })
            }
          })
          this.addModelVisible = false
          this.loadData()
        }
      })

    },
    handleCancel() {
      this.newUserForm = {
        depart: '', // 单位
        voteType: '', // 匿名票类型
        assess: '', // 考核类型 annual : report
        voteNum: 1 // 数量
      }
      this.addModelVisible = false
    },
    downloadAccount(type) {
      axios
        .post('/anonymity/exportPDF?type=' + type, {}, { responseType: 'blob' })
        .then((res) => {
          if (res && res.headers) {
            let contentDisposition = res.headers['content-disposition']
            let fileName = contentDisposition ? contentDisposition.split('filename=')[1] : '匿名账号.pdf'
            let realname = decodeURIComponent(fileName)
            let contentType = res.headers['content-type']
            let url = window.URL.createObjectURL(new Blob([res.data], { type: contentType }))
            let link = document.createElement('a')
            link.href = url
            link.setAttribute('download', realname) // 使用后端设置的文件名
            document.body.appendChild(link)
            link.click()
            this.$emit('over')
            document.body.removeChild(link)
          } else {
            console.error('Response headers are undefined')
          }
        })
        .catch((error) => {
          console.error('Error downloading file:', error)
        })
    },
  }
}
</script>

<style scoped>
@import '~@assets/less/common.less';
</style>
