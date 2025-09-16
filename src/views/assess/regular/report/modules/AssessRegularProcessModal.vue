<template>
  <t-modal
    :title="title"
    :width="width"
    :visible="visible"
    @ok="handleOk"
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
    @cancel="handleCancel"
    cancelText="关闭"
    :simple-submit="true"
  >
    <div style="overflow-y: scroll; ">
      <assess-regular-process-form
        ref="realForm"
        @ok="submitCallback"
        @confirmfun="confirmfuns"
        :disabled="disableSubmit"
        @formDataUpdated="handleFormDataUpdate"
      ></assess-regular-process-form>

      <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="head"
        :action="importExcelUrl"
        @change="handleImportExcel"
        v-if="isImportButtonVisible"
      >
        <a-button  type="primary" icon="import">导入</a-button>
      </a-upload>
      <a style="display: inline-block; margin-left: 20px;margin-top: 12px;" v-if="showresult" @click="showtable = true"
      >解析成功{{itemList.length}}条，点击查看结果</a>
      <div v-if="showtables" style=" margin: 10px 0 10px 0">
        <a-table
          :scroll="{ y: 170 }"
          :columns="[
          { title: '新', dataIndex: 'new', key: 'new', width: '30%', align: 'center' },
          { title: '旧', dataIndex: 'old', key: 'old', width: '30%', align: 'center' },

          {
            title: '请确认是否是同一人',
            dataIndex: 'enable',
            key: 'enable',
            align: 'center',
            scopedSlots: { customRender: 'enable' },
          },
        ]"
          :dataSource="itemLists"
          :pagination="false"
          :rowKey="(record) => record.id"
        >
          <template slot="enable" slot-scope="text, record, index">
            <a-switch @change="handleEnableChanges(record, index)"></a-switch>
          </template>
        </a-table>
      </div>
      <br />

      <div v-if="showtable" style="max-height: 500px; margin-top: 10px">
        <a-table
          :scroll="{ y: 100 }"
          :columns="[
          { title: '姓名', dataIndex: 'name', key: 'name', width: '20%', align: 'center' },
          {
            title: '性别',
            dataIndex: 'sex',
            key: 'sex',
            width: '14%',
            align: 'center',
            customRender: function (text) {
              if (text == 1) {
                return '男'
              } else if (text == 2) {
                return '女'
              } else {
                return text
              }
            },
          },
          {
            title: '出生年月',
            dataIndex: 'birthDate',
            key: 'birthDate',
            width: '20%',
            align: 'center',
            scopedSlots: { customRender: 'birthDate' },
          },
          {
            title: '管理部门',
            dataIndex: 'adminDepartment',
            key: 'adminDepartment',
            align: 'center',
            scopedSlots: { customRender: 'adminDepartment' },
          },
        ]"
          :dataSource="itemList"
          :pagination="false"
          :rowKey="(record) => record.id"
        >
          <template slot="birthDate" slot-scope="text, record, index">
            <div>
              {{ formatDate(text) }}
            </div>
          </template>
          <template slot="adminDepartment" slot-scope="text, record, index">
            <div class="truncate-text">
              {{ text }}
            </div>
          </template>
        </a-table>
      </div>
    </div>
  </t-modal>
</template>

<script>
import TModal from '@/component/TModal'
import AssessRegularProcessForm from './AssessRegularProcessForm'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import Vue from 'vue'
import { ACCESS_TOKEN, TENANT_ID } from '@/store/mutation-types'

export default {
  name: 'AssessRegularProcessModal',
  mixins: [JeecgListMixin],
  components: {
    AssessRegularProcessForm,
    TModal
  },
  data() {
    return {
      title: '',
      newlist: [],
      width: 900,
      visible: false,
      disableSubmit: false,
      itemList: [],
      showtable: false,
      showtables: false,
      showresult: false,
      itemLists: [],
      url: {
        list: '/regular/report/list',
        importExcelUrl: 'regular/report/importExcel'
      },
      formModel: {
        // 初始化为一个包含所有必要字段的对象
        currentYear: null,
        currentQuarter: null
      },
      head: {}
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
    isImportButtonVisible() {
      const model = this.formModel // 使用从子组件获取到的 model 数据

      return model.currentYear && model.currentQuarter
    }
  },
  watch: {
    formModel: {
      handler(newValue) {
        this.head['year'] = newValue.currentYear
        this.head['quarter'] = newValue.currentQuarter
        this.head['X-Access-Token'] = Vue.ls.get(ACCESS_TOKEN)
        let tenantid = Vue.ls.get(TENANT_ID)
        if (tenantid) {
          this.head['tenant-id'] = tenantid
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    handleEnableChanges(record, index) {
      const parts = record.new.split(',') // 分割字符串
      const replacedString = parts.slice(0, 3).join('@') // 取前三个部分并用 @ 连接
      const finalString = `${replacedString}@${record.newpartid}`
      this.newlist.push(finalString) // 添加到新数组
      this.$bus.$emit('updateReportItemsnewlist', this.newlist)
    },
    confirmfuns(data) {
      //   const part={}
      // data.conflictItems.filter(element => {
      //   part['old']=element.conflicts[0].name+','+element.conflicts[0].sexAlias+','+element.conflicts[0].birthDate+','+element.conflicts[0].adminDepartment

      //   part['new']=element.incoming.name+','+element.incoming.sexAlias+','+element.incoming.birthDate+','+element.incoming.departmentCodeAlias
      //   part['newpartid']=element.conflicts[0].departmentCode
      //   this.itemLists.push(part)
      // });
      const part = {}

      data.conflictItems.forEach((element) => {
        const oldPart = {
          name: element.conflicts[0].name,
          sex: element.conflicts[0].sexAlias,
          birthDate: element.conflicts[0].birthDate,
          adminDepartment: element.conflicts[0].adminDepartment
        }

        const newPart = {
          name: element.incoming.name,
          sex: element.incoming.sexAlias,
          birthDate: element.incoming.birthDate,
          departmentCodeAlias: element.incoming.departmentCodeAlias
        }

        // part['old'] = `${oldPart.name},${oldPart.sex},${oldPart.birthDate},${oldPart.adminDepartment}`
        // part['new'] = `${newPart.name},${newPart.sex},${newPart.birthDate},${newPart.departmentCodeAlias}`
        // part['newpartid'] = element.conflicts[0].departmentCode

        part['old'] = `${oldPart.name} ${oldPart.sex} ${oldPart.birthDate}`
        part['new'] = `${newPart.name} ${newPart.sex} ${newPart.birthDate}`
        part['newpartid'] = element.conflicts[0].departmentCode

        this.itemLists.push({ ...part })
      })
      // this.itemLists=data.conflictItems
      this.itemList = data.incomingItems
      this.showtables = true
      this.showtable = true
    },
    formatDate(dateStr) {
      if (!dateStr) return ''
      const year = dateStr.substring(0, 4)
      const month = dateStr.substring(4, 6)
      const day = dateStr.substring(6, 8)
      return `${year}-${month}-${day}`
    },
    add() {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.realForm.add()
      })
    },
    edit(record) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.realForm.edit(record)
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.showtable = false
      this.showtables = false
      this.itemLists = []
      this.itemList = []
    },
    handleOk() {
      this.$refs.realForm.submitForm()
    },
    submitCallback() {
      this.visible = false
      this.showtable = false
      this.showtables = false
      this.$emit('ok')
    },
    handleCancel() {
      this.close()
    },
    handleImportExcel(info) {
      if (info.file.status === 'done') {
        // this.$message.success(`${info.file.name} 文件上传成功`)
        const mess = `${info.file.name} 考核人员解析成功`
        this.$success({
          title: mess,
          // content: h => <div style='color:red;'>mess</div>,
          onOk: () => {
          },
          onCancel: () => {
          }
        })
        this.itemList = info.file.response.result
        // this.showtable = true
        this.showresult = true
        this.$bus.$emit('updateReportItems', info.file.response.result)
      } else if (info.file.status === 'error') {
        // this.$message.error(`${info.file.name} 文件上传失败.`)
        const messs = `${info.file.name} 文件上传失败.`
        // this.$confirm({
        //   title: '消息提示',
        //   content: (h) => <div style="color:red;">{messs}</div>,
        //   onOk: () => {
        //   },
        //   onCancel: () => {
        //   }
        // })
        this.$error({
          title: '错误',
          content: messs
        })
      }
    },
    handleFormDataUpdate(updatedModel) {
      // 使用 Object.assign 更新 formModel，使其保持响应性
      Object.assign(this.formModel, updatedModel)
    }
  }
}
</script>
<style scoped>

/deep/ .ant-modal-body {
  padding: 12px;
}

/deep/ .ant-table-body {
  max-height: 400px !important;
}

/deep/ .ant-table-tbody .ant-table-row td {
  padding-top: 8px;
  padding-bottom: 8px;
  background-color: white !important;
}

.truncate-text {
  margin: 0 auto;
  text-align: center;
  white-space: nowrap; /* 防止文本换行 */
  overflow: hidden; /* 超出部分隐藏 */
  text-overflow: ellipsis; /* 显示省略号 */
  max-width: 150px; /* 设置最大宽度，可以根据需要调整 */
}

/deep/ .ant-modal-content {
  position: relative;
  background-color: rgb(246, 248, 248);
  background-clip: padding-box;
  border: 0;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  pointer-events: auto;
}

/deep/ .ant-modal-header {
  padding: 16px 24px;
  color: rgba(0, 0, 0, 0.65);
  background: rgb(246, 248, 248);
  border-bottom: 0px solid #e8e8e8;
  border-radius: 4px 4px 0 0;
}

/deep/ .ant-form-horizontal {
  position: relative;
  background-color: white;
  border: 1px solid rgb(234, 235, 234);
  padding: 10px 0px;
}

/deep/ .ant-modal-footer {
  padding: 10px 16px;
  text-align: right;
  background: transparent;
  border-top: 0px solid #e8e8e8;
  border-radius: 0 0 4px 4px;
}

/deep/ .ant-form-item label {
  position: relative;
  margin-right: 10px;
  font-family: 思源黑体;
  font-size: 16px;
  font-weight: 500;
  color: rgb(9, 24, 52);
  text-align: right;
  margin-right: 10px;
  width: 90px;
  min-width: 90px;
}

/deep/ .ant-upload.ant-upload-select {
  display: inline-block;
  padding-top: 12px;
}

/deep/ .ant-table-thead > tr > th, .ant-table-tbody > tr > td {
  padding: 8px 16px;
  overflow-wrap: break-word;
}


</style>
