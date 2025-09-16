<template>
  <a-spin :spinning="confirmLoading" >
    <j-form-container :disabled="formDisabled" >
      <!-- 主表单区域 -->
      <a-form-model style="margin-bottom: 8px" ref="form" :model="model" :rules="validatorRules" slot="detail">

          <span style="display: inline;font-size: 20px;font-weight: 700;color:rgba(0, 0, 0, 0.85); margin-left: 22px">测评名称:</span>


            <!-- <a-form-model-item :style="{ color: 'hotpink' }" label="测评名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="democracyName"> -->
          <a-input style="display: inline;width:60%;font-size: 20px;font-weight: 700;color:rgba(0, 0, 0, 0.85); margin-left: 30px"  v-model="model.democracyName" placeholder="请输入测评名称"></a-input>
            <!-- </a-form-model-item> -->


      </a-form-model>
    </j-form-container>


    <div style='overflow-y: scroll; width: 100%; height: 570px'>
    <div class="item-title">
      <tj-subtitle value="一报告两评议民主测评项" />
      <a-button type="primary" @click="addItem">新增</a-button>
    </div>

    <!-- 子表单区域 -->
    <j-form-container :disabled="formDisabled">
      <a-form-model v-for="(item, i) in items" :key="item.id" :model="item" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="11">
            <a-form-model-item label="测评项描述" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="title" required>
              <a-input v-model="item.title" placeholder="请输入测评项描述"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="11">
            <a-form-model-item label="作答类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="type" required>
              <a-select v-model="item.type" placeholder="请选择作答类型">
                <a-select-option v-for="option in selectOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="2">
            <a-icon type='delete'  :style="{ color: 'red' }"   @click="removeItem(item.id, 'item')"  />
            <!-- <DeleteOutlined /> -->
            <!-- <a-button
              size="small"
              type="icon-twitter"
              @click="removeItem(item.id, 'item')"
              icon="DeleteOutlined"
            ></a-button> -->
          </a-col>
          <!--          <a-col :span="8" >-->
          <!--            <a-form-model-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="remark">-->
          <!--              <a-input v-model="item.remark" ></a-input>-->
          <!--            </a-form-model-item>-->
          <!--          </a-col>-->
        </a-row>

        <a-row
          v-if="item.type === '2' && multiItem.itemId === item.id"
          v-for="(multiItem, i) in multipleItemOptions"
          :key="multiItem.id"
        >
          <a-col :span="10">
            <a-form-model-item :label="'多选项:'" :labelCol="labelCol" :wrapperCol="wrapperCol" required>
              <a-input v-model="multiItem.topic" placeholder="请输入选项"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="2">
            <!-- <a-button
              size="small"
              shape="circle"
              type="danger"
              @click="removeItem(multiItem.id, 'multi')"
              icon="DeleteOutlined "
            ></a-button> -->
            <a-icon type='delete' :style="{ color: 'red' }"   @click="removeItem(multiItem.id, 'multi')"   />
          </a-col>
        </a-row>
        <a-row>
          <a-col v-if="item.type === '2'" :span="10" style="text-align: center;">
            <a-button
              shape="round"
              @click="addMultiItem(item.id)"
              class="additem"
              >新增项</a-button
            >
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>

    <!--    <a-tabs v-model="activeKey" @change="handleChangeTabs">-->
    <!--      <a-tab-pane tab="一报告两评议民主测评项" :key="refKeys[0]" :forceRender="true">-->
    <!--        <j-editable-table-->
    <!--          :ref="refKeys[0]"-->
    <!--          :loading="assessReportDemocracyConfigItemTable.loading"-->
    <!--          :columns="assessReportDemocracyConfigItemTable.columns"-->
    <!--          :dataSource="assessReportDemocracyConfigItemTable.dataSource"-->
    <!--          :maxHeight="300"-->
    <!--          :disabled="formDisabled"-->
    <!--          :rowNumber="true"-->
    <!--          :rowSelection="true"-->
    <!--          :actionButton="true"/>-->
    <!--      </a-tab-pane>-->
    <!--    </a-tabs>-->
    </div>
  </a-spin>
</template>

<script>
import { getAction, postAction } from '@/api/manage'
import { FormTypes, getRefPromise, VALIDATE_NO_PASSED, validateFormModelAndTables } from '@/utils/JEditableTableUtil'
import { JEditableTableModelMixin } from '@/mixins/JEditableTableModelMixin'
import TjSubtitle from '@/component/TjSubtitle.vue'

export default {
  name: 'AssessReportDemocracyConfigForm',
  mixins: [JEditableTableModelMixin],
  components: {
    TjSubtitle,
  },
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      model: {},
      // 新增时子表默认添加几行空数据
      addDefaultRowNum: 1,
      validatorRules: {
        democracyName: [{ required: true, message: '请输入测评名称!' }],
      },
      refKeys: ['assessReportDemocracyConfigItem'],
      tableKeys: ['assessReportDemocracyConfigItem'],
      activeKey: 'assessReportDemocracyConfigItem',
      // 一报告两评议民主测评项
      assessReportDemocracyConfigItemTable: {
        loading: false,
        dataSource: [],
        columns: [
          {
            title: '描述',
            key: 'title',
            type: FormTypes.input,
            width: '200px',
            placeholder: '请输入${title}',
            defaultValue: '',
            validateRules: [{ required: true, message: '${title}不能为空' }],
          },
          {
            title: '类型',
            key: 'type',
            type: FormTypes.select,
            dictCode: 'report_democracy_type',
            width: '200px',
            placeholder: '请输入${title}',
            defaultValue: '',
            validateRules: [{ required: true, message: '${title}不能为空' }],
          },
          {
            title: '备注',
            key: 'remark',
            type: FormTypes.input,
            width: '200px',
            placeholder: '请输入${title}',
            defaultValue: '',
          },
        ],
      },
      url: {
        add: '/modules/report/assessReportDemocracyConfig/add',
        edit: '/modules/report/assessReportDemocracyConfig/edit',
        queryById: '/modules/report/assessReportDemocracyConfig/queryById',
        assessReportDemocracyConfigItem: {
          list: '/modules/report/assessReportDemocracyConfig/queryAssessReportDemocracyConfigItemByMainId',
        },
      },
      items: [],
      selectOptions: [],
      multipleItemOptions: [],
      itemsId: 0,
      multipleItemOptionsId: 0,
    }
  },
  props: {
    //表单禁用
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  computed: {
    formDisabled() {
      return this.disabled
    },
  },
  created() {},
  methods: {
    handleOk() {
      let form = {
        democracyName: this.model.democracyName,
        configItems: this.items,
        multiItems: this.multipleItemOptions,
        enable: this.model.enable,
      }

      let url = ''
      if (this.model.id) {
        url = this.url.edit
        form.id = this.model.id
      } else {
        url = this.url.add
      }

      postAction(url, form).then((res) => {
        if (res.success) {
          this.$message.success(res.message)
         this.$emit('okk')
        }
      })


    },
    addItem() {
      this.itemsId = this.itemsId + 1
      this.items.push({
        id: this.itemsId,
        title: '',
        type: '',
        remark: '',
        itemOrder: this.items.length + 1,
      })
    },
    removeItem(id, type) {
      if (type === 'item') {
        if (this.items.length === 1) {
          this.$message.warning('至少要保留一条记录')
          return
        }
        this.items = this.items.filter((item) => item.id !== id)
        for (let i = 0; i < this.items.length; i++) {
          this.items[i].itemOrder = i + 1
        }
      }
      if (type === 'multi') {
        if (this.multipleItemOptions.length === 1) {
          this.$message.warning('至少要保留一条记录')
          return
        }
        this.multipleItemOptions = this.multipleItemOptions.filter((item) => item.id !== id)
      }
    },

    addBefore() {
      this.assessReportDemocracyConfigItemTable.dataSource = []
      this.getSelectOption()
    },
    getAllTable() {
      let values = this.tableKeys.map((key) => getRefPromise(this, key))
      return Promise.all(values)
    },
    /** 调用完edit()方法之后会自动调用此方法 */
    editAfter() {
      this.$nextTick(() => {})
      // 加载子表数据
      if (this.model.id) {
        // let params = { id: this.model.id }
        // this.requestSubTableData(this.url.assessReportDemocracyConfigItem.list, params, this.assessReportDemocracyConfigItemTable)
        getAction(this.url.queryById, { id: this.model.id }).then((res) => {
          if (res.success) {
            this.items = res.result.configItems
            this.multipleItemOptions = res.result.multiItems
            this.itemsId = this.items.length
            this.multipleItemOptionsId = this.multipleItemOptions.length
          }
        })
      }
      this.getSelectOption()
    },
    getSelectOption() {
      getAction('/common/getDictItemsByCode?code=report_democracy_type').then((res) => {
        if (res.success) {
          this.selectOptions = res.result
        }
      })
    },
    //校验所有一对一子表表单
    validateSubForm(allValues) {
      return new Promise((resolve, reject) => {
        Promise.all([])
          .then(() => {
            resolve(allValues)
          })
          .catch((e) => {
            if (e.error === VALIDATE_NO_PASSED) {
              // 如果有未通过表单验证的子表，就自动跳转到它所在的tab
              this.activeKey = e.index == null ? this.activeKey : this.refKeys[e.index]
            } else {
              console.error(e)
            }
          })
      })
    },
    /** 整理成formData */
    classifyIntoFormData(allValues) {
      let main = Object.assign(this.model, allValues.formValue)
      return {
        ...main, // 展开
        assessReportDemocracyConfigItemList: allValues.tablesValue[0].values,
      }
    },
    validateError(msg) {
      this.$message.error(msg)
    },

    addMultiItem(itemId) {
      this.multipleItemOptionsId = this.multipleItemOptionsId + 1
      this.multipleItemOptions.push({
        id: this.multipleItemOptionsId,
        topic: '',
        itemId: itemId,
      })
    },
  },
}
</script>

<style scoped lang="less">
 /deep/.ant-modal-content {
    position: relative;
    background-color: #f6f8f8;
    background-clip: padding-box;
    border: 0;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    pointer-events: auto;
    height:auto !important;
}
/deep/.ant-form {
  background-color: #ffffff;
  padding-top: 20px;
}
.item-title{
  margin-top: 20px;
  padding: 0 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
}
.additem{
  margin: 0 auto 30px;
  width: 50%;
}
</style>
