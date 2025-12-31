<template>
  <t-modal
    :title='title'
    :width='width'
    :visible='visible'
    switchFullscreen
    @ok='handleOk'
    :simple-submit='true'
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
    @cancel='handleCancel'
    cancelText='关闭'
  >
    <a-form style='margin: 0 0 20px 0' layout='inline' @keyup.enter.native='searchQuery'>
      <a-form-item label='姓名'>
        <a-input @change='searchQuery' placeholder='模糊搜索姓名' v-model='queryParam.name' />
      </a-form-item>
    </a-form>
    <div>
      <div style='margin-bottom: 10px'>
        <a-button type='primary' @click='handleAdd' style='margin-right: 10px'>新增</a-button>
        <a-button type='danger' @click='handleDelete' style='margin-right: 10px'>删除</a-button>
        <a-button type='primary' @click='adjustDepart' style='margin-right: 10px'>调整处室</a-button>
        <!--        <a-button @click="handleSupplement">补录</a-button>-->
      </div>
      <div style='overflow-y: scroll; height: 570px'>
        <a-table
          ref='table'
          size='middle'
          bordered
          rowKey='id'
          :columns='columns'
          :dataSource='dataSource'
          :pagination='false'
          class='j-table-force-nowrap'
          :rowSelection='rowSelection'
        >
          <template slot='thirdClass' slot-scope='text, record, index'>
            <a-switch v-model='dataSource[index].thirdClass' @change='handleEnableChange(record, index)'></a-switch>
          </template>

          <span slot='action' slot-scope='text, record'>
            <a @click='openEdit(record)'>编辑</a>
          </span>
        </a-table>
      </div>

      <div v-show='showNoDataMask' class='no-data-mask'>
        <span>当前没有正在进行中的考核</span>
      </div>

      <!-- 新增弹窗表单 -->
      <a-modal
        v-model='addModalVisible'
        title='新增记录'
        @ok='handleSubmit'
        @cancel='handleAddModalCancel'
        :width='800'
      >
        <a-form :model='form' :rules='rules' ref='formRef'>
          <a-row :gutter='16'>
            <a-col span='12'>
              <a-form-item label='姓名' prop='person'>
                <a-input v-model='form.person' placeholder='请输入姓名' />
              </a-form-item>
            </a-col>
            <a-col span='12'>
              <a-form-item label='性别' prop='sex'>
                <a-select v-model='form.sex' placeholder='请选择性别'>
                  <a-select-option value='1'>男</a-select-option>
                  <a-select-option value='2'>女</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter='16'>
            <a-col span='12'>
              <a-form-item label='出生日期' prop='birth'>
                <a-date-picker v-model='form.birth' placeholder='请选择出生日期' />
              </a-form-item>
            </a-col>
            <a-col span='12'>
              <a-form-item label='所在处室（单位）' prop='depart'>
                <j-select-depart v-model='form.depart' />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter='16'>
            <a-col span='12'>
              <a-form-item label='职务' prop='duties'>
                <a-input v-model='form.duties' placeholder='请输入职务' />
              </a-form-item>
            </a-col>
            <a-col span='12'>
              <a-form-item label='职级' prop='position'>
                <a-input v-model='form.position' placeholder='请输入职级' />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter='16'>
            <a-col span='12'>
              <a-form-item label='类别' prop='type'>
                <a-select v-model='form.type' placeholder='请选择类别'>
                  <a-select-option value='chief'>正职</a-select-option>
                  <a-select-option value='deputy'>副职</a-select-option>
                  <a-select-option value='other'>其他</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col span='12'>
              <a-form-item label='是否分管纪检工作' prop='inspectionWork'>
                <a-switch v-model='form.inspectionWork' />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter='16'>
            <a-col span='12'>
              <a-form-item label='身份' prop='identity'>
                <a-select v-model='form.identity' placeholder='请选择身份'>
                  <a-select-option value='公务员'>公务员</a-select-option>
                  <a-select-option value='事业'>事业</a-select-option>
                  <a-select-option value='参公'>参公</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col span='12'>
              <a-form-item label='是否书记' prop='secretary'>
                <a-switch v-model='form.secretary' />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter='16'>
            <a-col span='12'>
              <a-form-item label='是否党政主要负责人' prop='partyHeader'>
                <a-switch v-model='form.partyHeader' />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-modal>

      <!-- 新增调整表单 -->
      <a-modal
        v-model='adjustDepartModalVisible'
        title='调整处室'
        @ok='handleAdjustDepartSubmit'
        @cancel='handleAdjustDepartCancel'
        :width='400'
      >
        <a-form :model='adjustDepartForm' :rules='adjustDepartRules' ref='adjustDepartFormRef'>
          <!-- <a-input v-model="adjustDepartForm.name" placeholder="请输入姓名" style="width: 100%" /> -->
          <a-form-model-item label='姓名' prop='name'>
            <a-select
              show-search
              :value='adjustDepartForm.name'
              placeholder='请输入姓名'
              :default-active-first-option='false'
              :show-arrow='false'
              :filter-option='false'
              :not-found-content='null'
              @focus='handleSearch'
              @search='handleSearch'
              @change='handleChange'
              option-label-prop='label'
              style='width: 100%'
            >
              <a-select-option v-for='d in searchData' :key='d.value' :lable='d.label'>
                {{ d.text }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-item label='性别' prop='sex'>
            <a-select disabled v-model='adjustDepartForm.sex' placeholder='请选择性别' style='width: 100%'>
              <a-select-option value='男'>男</a-select-option>
              <a-select-option value='女'>女</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label='出生日期' prop='birthDate'>
            <a-date-picker disabled v-model='adjustDepartForm.birthDate' placeholder='请选择出生日期' style='width: 100%' />
          </a-form-item>
          <a-form-item label='调整处室（单位）' prop='departmentCode'>
            <j-select-depart v-model='adjustDepartForm.departmentCode' style='width: 100%' />
          </a-form-item>
        </a-form>
      </a-modal>

      <!-- 编辑表单 -->
      <a-modal
        v-model='editVisible'
        title='编辑考核人员信息'
        @ok='handleEditSubmit'
        @cancel='handleEditCancel'
        :width='1200'
      >
        <a-form :model='editForm' :rules='adjustDepartRules' ref='editFormRef'>
          <a-row :gutter='16'>
            <a-col span='12'>
              <a-form-item label='姓名' prop='person'>
                <a-input v-model='editForm.person' placeholder='请输入姓名' />
              </a-form-item>
            </a-col>
            <a-col span='12'>
              <a-form-item label='性别' prop='sex'>
                <a-select v-model='editForm.sex' placeholder='请选择性别'>
                  <a-select-option value='1'>男</a-select-option>
                  <a-select-option value='2'>女</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter='16'>
            <a-col span='12'>
              <a-form-item label='出生日期' prop='birth'>
                <j-date v-model='editForm.birth' placeholder='请选择出生日期' />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter='16'>
            <a-col span='12'>
              <a-form-item label='职务' prop='duties'>
                <a-input v-model='editForm.duties' placeholder='请输入职务' />
              </a-form-item>
            </a-col>
            <a-col span='12'>
              <a-form-item label='职级' prop='position'>
                <a-select v-model='editForm.position' placeholder='请选择职级' >
                  <a-select-option value="局管总师">
                    局管总师
                  </a-select-option>
                  <a-select-option value="二级巡视员">
                    二级巡视员
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row ::gutter='16'>
            <a-col span='12'>
              <a-form-item label='类别' prop='type'>
                <a-select v-model='editForm.type' placeholder='请选择类别'>
                  <a-select-option value='chief'>正职</a-select-option>
                  <a-select-option value='deputy'>副职</a-select-option>
                  <a-select-option value='other'>其他</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col span='12'>
              <a-form-item label='是否分管纪检工作' prop='inspectionWork'>
                <a-switch v-model='editForm.inspectionWork' />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter='16'>
            <a-col span='12'>
              <a-form-item label='身份' prop='identity'>
                <a-select v-model='editForm.identityType' placeholder='请选择身份'>
                  <a-select-option value='公务员'>公务员</a-select-option>
                  <a-select-option value='事业'>事业</a-select-option>
                  <a-select-option value='参公'>参公</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col span='12'>
              <a-form-item label='是否书记' prop='secretary'>
                <a-switch v-model='editForm.secretary' />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter='16'>
            <a-col span='12'>
              <a-form-item label='是否党政主要负责人' prop='partyHeader'>
                <a-switch v-model='editForm.partyHeader' />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-modal>
    </div>
  </t-modal>
</template>

<script>
import TModal from '@/component/TModal.vue'
import { deleteAction, getAction, postAction, putAction } from '@/api/manage'
import { getAssessingInfo, searchUser } from '@/api/assessApis'
import TSelectDepartModal from '@/component/modal/TSelectDepartModal.vue'
import moment from 'moment'

export default {
  name: 'Adjustment',
  components: {
    TModal,
    TSelectDepartModal
  },
  props: {
    formDisable: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      title: '',
      showNoDataMask: false,
      width: 1200,
      visible: false,
      addModalVisible: false, // 控制新增弹窗的显示
      editVisible: false, // 控制编辑弹窗的显示
      searchData: [],
      form: {
        person: '',
        sex: '',
        birth: null,
        depart: '',
        duties: '',
        position: '',
        type: '',
        inspectionWork: false,
        identityType: '',
        secretary: false,
        partyHeader: false
      },
      rules: {
        person: [{ required: true, message: '姓名是必填项', trigger: 'blur' }],
        sex: [{ required: true, message: '性别是必填项', trigger: 'change' }],
        birth: [{ required: true, message: '出生日期是必填项', trigger: 'change' }],
        depart: [{ required: true, message: '所在处室（单位）是必填项', trigger: 'change' }],
        identityType: [{ required: true, message: '身份是必填项', trigger: 'change' }]
      },
      disableSubmit: false,
      assessingInfo: {},
      dataSource: [],
      selectedRowKeys: [], // 选中的行的 keys
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: (t, r, index) => parseInt(index) + 1
        },
        {
          title: '单位',
          width: 60,
          align: 'center',
          dataIndex: 'depart'
        },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'person'
        },
        {
          title: '性别',
          align: 'center',
          dataIndex: 'sex'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      adjustDepartModalVisible: false, // 控制调整处室弹窗的显示
      adjustDepartForm: {
        name: '',
        sex: '',
        birthDate: null,
        hashId: '',
        departmentCode: ''
      },
      editForm: {},
      adjustDepartRules: {
        name: [{ required: true, message: '姓名是必填项', trigger: 'blur' }],
        sex: [{ required: true, message: '性别是必填项', trigger: 'change' }],
        birthDate: [{ required: true, message: '出生日期是必填项', trigger: 'change' }]
      },
      catchDataSources: [],
      queryParam: {}
    }
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
        onSelectAll: this.onSelectAllChange
      }
    }
  },
  mounted() {
    // 获取当前考核信息
    this.loadData()
  },
  methods: {
    openEdit(record) {
      this.editVisible = true
      this.editForm = record
    },
    handleEditSubmit(){
      postAction("/modules/assessAnnualSummary/editPerson", this.editForm).then((res) => {
        if (res.success) {
          this.$success({
            title: '编辑成功',
            content: '编辑成功！'
          })
          this.loadData()
          this.editVisible = false
          this.editForm = {}
        } else {
          this.$error({
            title: '编辑失败',
            content: res.message || '未知错误'
          })
        }
      }).catch((error) => {
        this.$error({
          title: '编辑失败',
          content: error
        })
      })
    },
    handleEditCancel(){
      this.editVisible = false
      this.editForm = {}
    },

    searchQuery() {
      if (!this.queryParam.name || this.queryParam.name === '') {
        this.dataSource = this.catchDataSources
        return
      } else {
        // this.catchDataSources = this.dataSource
        this.dataSource = this.catchDataSources.filter(item => item.person.includes(this.queryParam.name))
      }
    },

    loadData() {
      getAssessingInfo('annual').then((res) => {
        if (res.success) {
          this.assessingInfo = res.result
          if (res.assessing == false) {
            this.showNoDataMask = true // 显示无数据遮罩
          } else {
            // 获取推优列表
            getAction('/modules/annual/assessAnnualFill/selectAdjustment').then((res) => {
              this.dataSource = res.result.map((item) => ({
                ...item,
                depart: item.depart,
                person: item.person,
                sex: item.sex === '1' ? '男' : '女'
              }))
              this.catchDataSources = this.dataSource
            })
          }
        } else {
          this.showNoDataMask = true // 显示无数据遮罩
        }
      })
    },
    handleAdd() {
      this.addModalVisible = true // 显示新增弹窗
    },

    reloadData() {
      this.dataSource = []
      this.catchDataSources = []
      this.loadData()
    },

    handleSubmit() {
      // this.form.validateFields((valid) => {
      //   if (valid) {

      // 发送 POST 请求到后端
      postAction('/modules/annual/assessAnnualFill/addAdjustmentItem', this.form)
        .then((response) => {
          if (response) {
            // 在这里可以更新数据源，添加新的记录
            this.reloadData()
            this.addModalVisible = false // 关闭弹窗
            // this.$message.success('新增成功！')
            this.$success({
              title: '新增成功',
              content: '新增成功！'
            })
            this.resetForm() // 重置表单
          } else {
            console.error('新增失败:', response.message || '未知错误')
          }
        })
        .catch((error) => {
          console.error('新增请求失败:', error)
        })
      //   } else {
      //     return false
      //   }
      // })
    },
    handleAddModalCancel() {
      this.addModalVisible = false // 关闭弹窗
      this.resetForm() // 重置表单
    },
    resetForm() {
      this.form = {
        person: '',
        sex: '',
        birth: null,
        depart: '',
        duties: '',
        position: '',
        type: '',
        inspectionWork: false,
        identityType: '',
        secretary: false,
        partyHeader: false
      }
      this.$refs.formRef.resetFields() // 重置表单字段
    },
    adjustDepart() {
      this.adjustDepartModalVisible = true // 显示调整处室弹窗
    },
    handleAdjustDepartSubmit() {
      // this.$refs.adjustDepartFormRef.validate((valid) => {
      // if (valid) {

      let form = {
        hashId: this.adjustDepartForm.hashId,
        depart: this.adjustDepartForm.departmentCode
      }

      postAction('/modules/assessAnnualSummary/editDepart', form)
        .then((response) => {
          if (response) {
            this.reloadData()
            this.adjustDepartModalVisible = false
            this.resetAdjustDepartForm()
            // this.$message.success('调整成功！')
            this.$success({
              title: '调整成功',
              content: '调整成功！'
            })

          } else {
            console.error('调整失败:', response.message || '未知错误')
          }
        })
        .catch((error) => {
          console.error('调整请求失败:', error)
        })
      //   } else {
      //     return false
      //   }
      // })
    },
    handleAdjustDepartCancel() {
      this.adjustDepartModalVisible = false // 关闭弹窗
      this.resetAdjustDepartForm() // 重置表单
    },
    resetAdjustDepartForm() {
      this.adjustDepartForm = {
        name: '',
        sex: '',
        birthDate: null,
        hashId: '',
        departmentCode: ''
      }
      // this.$refs.adjustDepartFormRef.resetFields() // 重置表单字段
    },
    handleDelete() {
      // 删除选中的行
      const selectedRows = this.dataSource.filter((row) => this.selectedRowKeys.includes(row.id))


      // 提取每个对象的 id 形成一个数组
      const idsToDelete = selectedRows.map((row) => row.id)

      // 确保 idsToDelete 不为空再发送请求
      if (idsToDelete.length > 0) {
        // 添加确认提示
        this.$confirm({
          title: '确认删除',
          content: `您确定要删除这些记录吗？将删除 ${idsToDelete.length} 条记录。`,
          onOk: () => {
            // 发送删除请求到后端，直接将 idsToDelete 作为请求体
            putAction('/modules/annual/assessAnnualFill/deleteAdjustment', idsToDelete)
              .then((response) => {
                // 检查响应是否成功
                if (response.success) {
                  // 更新数据源，以反映删除后的状态
                  this.dataSource = this.dataSource.filter((row) => !idsToDelete.includes(row.id))
                  // this.$message.success('删除成功！')
                  this.$success({
                    title: '删除成功',
                    content: '删除成功！'
                  })
                  // 清空选中的行
                  this.selectedRowKeys = []
                } else {
                  console.error('删除失败:', response.message || '未知错误')
                }
              })
              .catch((error) => {
                console.error('删除请求失败:', error)
              })
          },
          onCancel() {
          }
        })
      } else {
      }
    },
    toggleSelection(id) {
      const index = this.selectedRowKeys.indexOf(id)
      if (index > -1) {
        this.selectedRowKeys.splice(index, 1)
      } else {
        this.selectedRowKeys.push(id)
      }
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    onSelectAllChange(selected, selectedRows) {
      if (selected) {
        this.selectedRowKeys = selectedRows.map((row) => row.id)
      } else {
        this.selectedRowKeys = []
      }
    },
    handleEnableChange(record, index) {
      // 处理开关变化
    },
    handleOk() {
      // 确认操作
    },
    handleCancel() {
      this.visible = false
    },
    handleSearch(value) {
      searchUser(value, undefined).then((res) => {
        if (res.success && res.result.length > 0) {
          this.searchData = res.result
        } else {
          this.adjustDepartForm.name = value
        }
      })
    },
    handleChange(value) {
      this.adjustDepartForm.name = value.split('@')[0]
      this.hashId = value
      this.adjustDepartForm.hashId = value
      // fetch(value, data => (this.searchData = data));
      searchUser(value, undefined).then((res) => {
        if (res.success && res.result.length > 0) {
          this.searchData = res.result
          let sex = this.searchData[0].value.split('@')[1]
          this.adjustDepartForm.sex = sex
          this.adjustDepartForm.hashId = this.searchData[0].value

          this.adjustDepartForm.birthDate = moment(this.searchData[0].value.split('@')[2], 'YYYYMMDD')
        } else {
          this.adjustDepartForm.name = value
          this.adjustDepartForm.sex = ''
          this.adjustDepartForm.hashId = ''
          this.adjustDepartForm.birthDate = undefined
        }
      })
    }
  }
}
</script>

<style scoped>
.no-data-mask {
  position: absolute;
  top: 10%;
  left: 0;
  width: 100%;
  height: 90%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  font-size: 26px;
  font-weight: 700;
}

.j-table-force-nowrap .ant-table-tbody > tr > td {
  white-space: nowrap; /* 防止内容换行 */
}

.ant-modal {
  top: 20px; /* 调整弹窗位置 */
}

.ant-modal-header {
  background-color: #f0f2f5; /* 设置弹窗头部背景色 */
}

.ant-modal-title {
  font-weight: bold; /* 设置弹窗标题字体加粗 */
}

.ant-form-item {
  margin-bottom: 16px; /* 设置表单项之间的间距 */
}

.ant-form-item-label {
  font-weight: 600; /* 设置标签字体加粗 */
}

.ant-input,
.ant-select,
.ant-date-picker {
  width: 100%; /* 设置输入框和选择框宽度为100% */
}

.ant-switch {
  margin-left: 8px; /* 设置开关组件的左边距 */
}
</style>
