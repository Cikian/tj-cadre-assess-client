<template>
  <t-modal
    :title="title"
    :width="width"
    :visible="visible"
    fullscreen
    @ok="handleOk"
    :simple-submit="true"
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <div>
      <div style="margin-bottom: 10px">
        <a-button type="primary" @click="handleAdd" style="margin-right: 10px">新增</a-button>
        <a-button type="danger" @click="handleDelete" style="margin-right: 10px">删除</a-button>
        <a-button type="primary" @click="adjustDepart" style="margin-right: 10px">调整处室</a-button>
      </div>
      <div style="overflow-y: scroll; height: 770px">
        <a-table
          ref="table"
          size="middle"
          bordered
          rowKey="id"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="false"
          class="j-table-force-nowrap"
          :rowSelection='{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange,type: "radio"}'
        >
          <template slot="thirdClass" slot-scope="text, record, index">
            <a-switch v-model="dataSource[index].thirdClass" @change="handleEnableChange(record, index)"></a-switch>
          </template>
        </a-table>
      </div>

      <div v-show="showNoDataMask" class="no-data-mask">
        <span>当前没有正在进行中的考核</span>
      </div>

      <!-- 新增弹窗表单 -->
      <a-modal
        v-model="addModalVisible"
        title="新增记录"
        @ok="handleSubmit"
        @cancel="handleAddModalCancel"
        :width="800"
      >
        <a-form :model="form" :rules="rules" ref="formRef">
          <a-row :gutter="16">
            <a-col span="12">
              <a-form-item label="姓名" prop="name">
                <a-input v-model="form.name" placeholder="请输入姓名" />
              </a-form-item>
            </a-col>
            <a-col span="12">
              <a-form-item label="性别" prop="sex">
                <a-select v-model="form.sex" placeholder="请选择性别">
                  <a-select-option value="1">男</a-select-option>
                  <a-select-option value="2">女</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col span="12">
              <a-form-item label="出生日期" prop="birthDate">
                <a-date-picker v-model="form.birthDate" placeholder="请选择出生日期" />
              </a-form-item>
            </a-col>
            <a-col span="12">
              <a-form-item label="所在处室（单位）" prop="departmentCode">
                <j-select-depart v-model="form.departmentCode" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col span="12">
              <a-form-item label="类别" prop="positionType">
                <a-select v-model="form.positionType" placeholder="请选择类别">
                  <a-select-option value="正职">正职</a-select-option>
                  <a-select-option value="副职">副职</a-select-option>
                  <a-select-option value="其他">其他</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col span="12">
              <a-form-item label="是否局领导考核" prop="isLeader">
                <a-switch v-model="form.isLeader" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col span="12">
              <a-form-item label="管理部门" prop="adminDepartment">
                <a-select v-model="form.adminDepartment" placeholder="请选择身份">
                  <a-select-option value="干部处">干部处</a-select-option>
                  <a-select-option value="人事处">人事处</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col span="12">
              <a-form-item label="职务" prop="post">
                <a-input v-model="form.post" placeholder="请输入职务" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col span="12">
              <a-form-item label="职级" prop="rank">
                <a-input v-model="form.rank" placeholder="请输入职级" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-modal>

      <!-- 新增调整表单 -->
      <a-modal
        v-model="adjustDepartModalVisible"
        title="调整处室"
        @ok="handleAdjustDepartSubmit"
        @cancel="handleAdjustDepartCancel"
        :width="600"
      >
        <a-form :model="adjustDepartForm" :rules="adjustDepartRules" ref="adjustDepartFormRef">
          <a-form-item label="调整处室至" prop="departmentCode">
            <j-select-depart v-model="adjustDepartForm.departmentCode" @back="getDestDepartInfo" style="width: 100%" />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </t-modal>
</template>

<script>
import { putAction } from '@/api/manage'
import store from '@/store'
import TModal from '@/component/TModal.vue'
import { postAction, getAction, deleteAction } from '@/api/manage'
import { getAssessingInfo } from '@/api/assessApis'
import TSelectDepartModal from '@/component/modal/TSelectDepartModal.vue'
import { searchUser } from '@/api/assessApis'
import moment from 'moment'

export default {
  name: 'PersonnelAdjustment',
  components: {
    TModal,
    TSelectDepartModal,
  },
  props: {
    formDisable: {
      required: false,
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      title: '',
      showNoDataMask: false,
      width: 1200,
      visible: false,
      addModalVisible: false, // 控制新增弹窗的显示
      searchData: [],
      form: {
        name: '',
        sex: '',
        birthDate: null,
        departmentCode: '',
        positionType: '',
        isLeader: false,
        adminDepartment: '',
        post: '',
        rank: '',
      },
      rules: {
        name: [{ required: true, message: '姓名是必填项', trigger: 'blur' }],
        sex: [{ required: true, message: '性别是必填项', trigger: 'change' }],
        birthDate: [{ required: true, message: '出生日期是必填项', trigger: 'change' }],
        departmentCode: [{ required: true, message: '所在处室（单位）是必填项', trigger: 'change' }],
        adminDepartment: [{ required: true, message: '管理部门是必填项', trigger: 'change' }],
      },
      adjustDepartModalVisible: false, // 控制调整处室弹窗的显示
      adjustDepartForm: {
        id: '',
        // name: '',
        // sex: '',
        // birthDate: null,
        departmentCode: '',
      },
      hashId: '',
      adjustDepartRules: {
        name: [{ required: true, message: '姓名是必填项', trigger: 'blur' }],
        sex: [{ required: true, message: '性别是必填项', trigger: 'change' }],
        birthDate: [{ required: true, message: '出生日期是必填项', trigger: 'change' }],
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
          width: 100,
          align: 'center',
          customRender: (t, r, index) => parseInt(index) + 1,
        },
        {
          title: '处室',
          width: 300,
          align: 'center',
          dataIndex: 'departmentCode',
        },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'name',
        },
        {
          title: '性别',
          align: 'center',
          dataIndex: 'sex',
        },
      ],
    }
  },
  computed: {
  },
  created() {
    // 获取当前考核信息
    this.loadData()
  },
  methods: {
    loadData() {
      getAssessingInfo('regular').then((res) => {
        if (res.success) {
          this.assessingInfo = res.result
          if (res.assessing == false) {
            this.showNoDataMask = true // 显示无数据遮罩
          } else {
            getAction('/regular/report/selectAdjustment').then((res) => {
              this.dataSource = res.result.map((item) => ({
                ...item,
                departmentCode: item.departmentCode,
                name: item.name,
                sex: item.sex === 1 ? '男' : '女',
              }))
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
    adjustDepart() {
      this.adjustDepartModalVisible = true // 显示调整处室弹窗
    },
    handleAdjustDepartSubmit() {
      if (this.selectedRowKeys.length==0){
        this.$message.warning("请选择要调整的人员!")
        return;
      }
      this.adjustDepartForm.id=this.selectedRowKeys[0];
      postAction('/regular/report/adjustDivisionsUnits', this.adjustDepartForm)
        .then((response) => {
          if (response) {
            this.loadData()
            this.adjustDepartModalVisible = false
            this.resetAdjustDepartForm()
            this.$success({
              title: '调整成功',
            })
            this.$emit('ok')
          } else {
            console.error('调整失败:', response.message || '未知错误')
          }
        })
        .catch((error) => {
          console.error('调整请求失败:', error)
        })
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
        departmentCode: '',
      }
      // this.$refs.adjustDepartFormRef.resetFields() // 重置表单字段
    },
    handleSubmit() {
      // this.$refs.formRef.validate((valid) => {
      //   if (valid) {

      // 发送 POST 请求到后端
      postAction('/regular/report/addAdjustmentItem', this.form)
        .then((response) => {
          if (response) {
            // 在这里可以更新数据源，添加新的记录
            this.loadData()
            this.addModalVisible = false // 关闭弹窗
            // this.$message.success('新增成功！')
            this.$success({
              title: '新增成功',
              // content: h => <div style='color:red;'>{res.message}</div>,
            })
            this.resetForm() // 重置表单
            this.$emit('ok')
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
        name: '',
        sex: '',
        birthDate: null,
        departmentCode: '',
        positionType: '',
        isLeader: false,
        adminDepartment: '',
        post: '',
        rank: '',
      }
      // this.$refs.formRef.resetFields() // 重置表单字段
    },
    handleDelete() {
      // 删除选中的行
      const selectedRows = this.dataSource.filter((row) => this.selectedRowKeys.includes(row.id))
      // 提取每个对象的 id 形成一个数组
      let idsToDelete = selectedRows.map((row) => row.id)
      // 确保 idsToDelete 不为空再发送请求
      if (idsToDelete.length > 0) {
        // 添加确认提示
        this.$confirm({
          title: '确认删除',
          content: `您确定要删除这些记录吗？将删除 ${idsToDelete.length} 条记录。`,
          onOk: () => {
            // 发送删除请求到后端，直接将 idsToDelete 作为请求体
            deleteAction('/regular/report/deleteAdjustment?idsToDelete=' + idsToDelete)
              .then((response) => {
                // 检查响应是否成功
                if (response.success) {
                  // 更新数据源，以反映删除后的状态
                  this.dataSource = this.dataSource.filter((row) => !idsToDelete.includes(row.id))
                  // this.$message.success('删除成功！')
                  this.$success({
                    title: '删除成功',
                    // content: h => <div style='color:red;'>{res.message}</div>,
                  })
                  // 清空选中的行
                  this.selectedRowKeys = []
                  this.$emit('ok')
                } else {
                  console.error('删除失败:', response.message || '未知错误')
                }
              })
              .catch((error) => {
                console.error('删除请求失败:', error)
              })
          },
          onCancel() {
          },
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
      this.visible = false
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
      // fetch(value, data => (this.searchData = data));
      searchUser(value, undefined).then((res) => {
        if (res.success && res.result.length > 0) {
          this.searchData = res.result
          let sex = this.searchData[0].value.split('@')[1]
          this.adjustDepartForm.sex = sex

          this.adjustDepartForm.birthDate = moment(this.searchData[0].value.split('@')[2], 'YYYYMMDD')
        } else {
          this.adjustDepartForm.name = value
          this.adjustDepartForm.sex = ''
          this.adjustDepartForm.birthDate = undefined
        }
      })
    },
    getDestDepartInfo(info){
    }
  },
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
