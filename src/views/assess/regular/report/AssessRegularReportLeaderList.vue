<template>
  <a-card :bordered="false">
    <div class="sliding-boxs">
      <!-- 当前季度共可评“好”等次<span style="color: red"> {{ totalQuota }}</span>人，
      剩余可评<span style="color: red">{{ remainingQuota }}</span>人 -->

      <span style="color: rgb(9, 24, 52); font-family: 微软雅黑; font-size: 18px; font-weight: 600"> 当前季度： </span>
      <div class="onediv" style="display: flex; align-items: center; margin: 0 30px">
        <img style="width: 60px; height: 60px; margin: 0 10px" src="../../../../assets/组合 1157.png" alt="" />
        <div>
          <div>
            <span style="color: rgb(254, 149, 0); font-family: HarmonyOS Sans; font-size: 30px; font-weight: 700">
              {{ totalQuota }}
            </span>
            <span style="color: rgb(126, 134, 158); font-family: 思源黑体; font-size: 14px; font-weight: 400">
              人
            </span>
          </div>
          <div style="color: rgb(126, 134, 158); font-family: 思源黑体; font-size: 14px; font-weight: 400">
            可评好等次
          </div>
        </div>
      </div>

      <div class="twodiv" style="display: flex; align-items: center; margin-left: 30px">
        <img style="width: 60px; height: 60px; margin: 0 10px" src="../../../../assets/组合 1156.png" alt="" />
        <div>
          <div>
            <span style="color: rgb(37, 79, 240); font-family: HarmonyOS Sans; font-size: 30px; font-weight: 700">
              {{ remainingQuota }}
            </span>
            <span style="color: rgb(126, 134, 158); font-family: 思源黑体; font-size: 14px; font-weight: 400">
              人
            </span>
          </div>
          <div style="color: rgb(126, 134, 158); font-family: 思源黑体; font-size: 14px; font-weight: 400">
            剩余可评
          </div>
        </div>
      </div>
    </div>

    <div class="sliding-box">
      <div class="sliding-content">
        <p>四个季度平时考核至少有一个为“好”，年度考核才有评优资格</p>
      </div>
    </div>
    <div>
      <t-vxe-table
        ref="table"
        row-number
        keep-source
        :clearable="false"
        socket-reload
        :always-edit="true"
        socket-key="demo-socket-reload"
        :reload-effect="reloadEffect"
        :loading="loading"
        :columns="columns.map(col => ({ ...col, disabled: col.disabled || this.shouldDisableTableAndButton }))"
        :dataSource="dataSource"
        :header-cell-style="{ background: '#FAFAFA', border: '1px solid #d9d9d9' }"
        :key="tableKey"
        @valueChange="handleEditClosed"
      />

      <!-- 分页 -->
      <!-- <div style="display: flex; justify-content: flex-end; margin-top: 16px">
        <a-pagination :current="currentPage" :pageSize="pageSize" :total="totalRecords" @change="handlePageChange" />
      </div> -->
    </div>
    <!-- 提交图标 -->
    <div
      v-if="modifiedRows.length > 0"
      @click="submitChanges"
      style="position: absolute; bottom: -70px; right: 0%; cursor: pointer"
    >
      <!-- <img src="@/assets/commit.png" alt="提交" style="width: 50px; height: 50px" /> -->
      <a-button
        type="primary"
        style="
          width: 300px;
          height: 50px;
          border: 0;
          font-size: 28px;
          color: white;
          font-weight: 600;
          border-radius: 10px;
        "
        :disabled="shouldDisableTableAndButton"
      >提交
      </a-button
      >
    </div>
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { getAction, putAction } from '@api/manage'
import { JVXETypes } from '@/components/jeecg/JVxeTable'
import { getAssessingInfo } from '@/api/assessApis'
import { message, Modal } from 'ant-design-vue'
import TVxeTable from '@/component/TVxeTable'

export default {
  name: 'AssessRegularReportItemLeaderList',
  components: { TVxeTable },
  data() {
    return {
      tableKey: 0, // 新增一个 key 属性，用于刷新表格
      description: '局领导填报页面',
      assessname: '',
      loading: false,
      dataSource: [],
      currentPage: 1,
      pageSize: 20,
      totalRecords: 0,
      // 表头
      columns: [
        {
          key: 'name',
          title: '姓名',
          align: 'center',
          type: JVXETypes.normal,
          dictCode: 'sys_user,realname,id',
          disabled: true,
          dataIndex: 'name'
        },
        // {
        //   key: 'sex',
        //   title: '性别',
        //   align: 'center',
        //   type: JVXETypes.select,
        //   dictCode: 'sex',
        //   disabled: true,
        //   dataIndex: 'sex_dictText',
        // },
        // {
        //   key: 'post',
        //   title: '职务职级',
        //   align: 'center',
        //   type: JVXETypes.select,
        //   dictCode: 'sys_position,name,code',
        //   disabled: true,
        //   dataIndex: 'post',
        // },
        {
          key: 'departmentCode_dictText',
          title: '所在处室',
          align: 'center',
          type: JVXETypes.normal,
          disabled: true,
          dictCode: 'sys_depart,depart_name,id',
          dataIndex: 'departmentCode_dictText'
        },
        {
          key: 'currentYear',
          title: '年度',
          align: 'center',
          disabled: true,
          type: JVXETypes.normal,
          dataIndex: 'currentYear_dictText'
        },
        {
          key: 'quarter1',
          title: '第一季度',
          align: 'center',
          type: JVXETypes.select,
          dictCode: 'regular_assess_level',
          dataIndex: 'quarter1_dictText',
          disabled: true,
          clearable: false
  },
        {
          key: 'quarter2',
          title: '第二季度',
          align: 'center',
          type: JVXETypes.select,
          dictCode: 'regular_assess_level',
          dataIndex: 'quarter2_dictText',
          disabled: true,
          clearable: false
        },
        {
          key: 'quarter3',
          title: '第三季度',
          align: 'center',
          type: JVXETypes.select,
          dictCode: 'regular_assess_level',
          dataIndex: 'quarter3_dictText',
          disabled: true,
          clearable: false
        },
        {
          key: 'quarter4',
          title: '第四季度',
          align: 'center',
          type: JVXETypes.select,
          dictCode: 'regular_assess_level',
          dataIndex: 'quarter4_dictText',
          disabled: true,
          clearable: false
        }
        // {
        //   title: '操作',
        //   dataIndex: 'action',
        //   align:"center",
        //   fixed:"right",
        //   width:147,
        //   scopedSlots: { customRender: 'action' }
        // }
      ],
      url: {
        getLeaderData: '/regular/report/getLeaderData',
        editLeader: '/regular/report/editLeader',
        getComputeRemainingSeats: '/regular/report/computeRemainingSeats'
      },
      dictOptions: {},
      superFieldList: [],
      reloadEffect: true,
      totalQuota: 0,
      remainingQuota: 0,
      modifiedRows: [], // 存储变动的记录
      jidu: ''
    }
  },
  created() {
    // this.getSuperFieldList();
    this.loadData()
    this.computeRemainingSeats()
    getAssessingInfo('regular').then((res) => {
      if (res.success) {
        // 获取当前季度
        const currentQuarter = res.result.quarter
        this.assessname = res.result.assessName
        this.jidu = currentQuarter
        const columnKey = `quarter${currentQuarter}` // 动态生成列的键
        const column = this.columns.find((col) => col.key === columnKey)

        if (column) {

          this.$set(column, 'disabled', false) // 启用当前季度

          // 使用 $nextTick 确保 DOM 已经更新
          this.$nextTick(() => {
          })

          this.tableKey += 1 // 更新表格的关键字
        }
        if (columnKey == 'quarter4') {
          // this.showInitialMessage()
        }
      }
    })
    this.selectedCount = 0 // 初始化选择的数量
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
    shouldDisableTableAndButton() {
      // datasource中元素的status全部为1
      return this.dataSource.every((item) => item.status === '3')

    }
  },
  methods: {
    tableChange(){
      if (document.activeElement) {
        document.activeElement.blur(); // 使当前聚焦元素失焦
      }
    },
    showInitialMessage() {
      Modal.info({
        title: '提示',
        content: (
          <div>
            <p>四个季度平时考核至少有一个为“好”，年度考核才有评优资格。</p>
          </div>
        ),
        okText: '知道了',
        onOk() {
          // 用户点击确认后的处理
        }
      })
    },
    initDictConfig() {
    },
    getSuperFieldList() {
      let fieldList = []
      fieldList.push({ type: 'string', value: 'name', text: '姓名', dictCode: 'sys_user,realname,id' })
      fieldList.push({ type: 'int', value: 'sex', text: '性别', dictCode: 'sex' })
      fieldList.push({ type: 'string', value: 'phone', text: '电话', dictCode: '' })
      fieldList.push({ type: 'string', value: 'post', text: '职务职级', dictCode: 'sys_position,name,code' })
      fieldList.push({ type: 'string', value: 'isLeader', text: '是否处级领导', dictCode: '' })
      fieldList.push({ type: 'sel_depart', value: 'departmentCode_dictText', text: '所在处室' })
      fieldList.push({ type: 'string', value: 'currentYear', text: '年度', dictCode: 'assess_year' })
      fieldList.push({ type: 'string', value: 'quarter1', text: '第一季度', dictCode: 'assess_quarter' })
      fieldList.push({ type: 'string', value: 'quarter2', text: '第二季度', dictCode: 'assess_quarter' })
      fieldList.push({ type: 'string', value: 'quarter3', text: '第三季度', dictCode: 'assess_quarter' })
      fieldList.push({ type: 'string', value: 'quarter4', text: '第四季度', dictCode: 'assess_quarter' })
      fieldList.push({ type: 'string', value: 'note', text: '备注', dictCode: '' })
      fieldList.push({ type: 'string', value: 'mainId', text: '主表', dictCode: '' })
      this.superFieldList = fieldList
    },

    loadData(pageNo = this.currentPage) {
      // let formData = { pageNo, pageSize: this.pageSize }
      this.loading = true
      getAction(this.url.getLeaderData)
        .then((res) => {
          if (res.success) {
            res.result.records.forEach((item) => {
              if (item.rank === '二级巡视员' || item.rank === '局管总师') {
                item.departmentCode_dictText = '总师、二巡'
              }
            })

            res.result.records.sort((a, b) => {
              const isTargetA = a.rank === '二级巡视员' || a.rank === '局管总师';
              const isTargetB = b.rank === '二级巡视员' || b.rank === '局管总师';

              if (isTargetA && !isTargetB) {
                return -1; // a排在b前面
              } else if (!isTargetA && isTargetB) {
                return 1; // b排在a前面
              } else {
                return 0; // 保持原顺序
              }
            });

            // 如果dataSource中有状态为1的元素
            if (res.result.records.some((item) => item.status === '1')) {
              switch (this.jidu) {
                case '1':
                  // 将每个元素的q1设置为null
                  res.result.records.forEach((item) => {
                    item.quarter1 = null
                  })
                  break
                case '2':
                  res.result.records.forEach((item) => {
                    item.quarter2 = null
                  })
                  break
                case '3':
                  res.result.records.forEach((item) => {
                    item.quarter3 = null
                  })
                  break
                case '4':
                  res.result.records.forEach((item) => {
                    item.quarter4 = null
                  })
                  break
              }
            }
            this.dataSource = res.result.records
            console.log('》》》》》》》》》》》》》》》》》》》》》》》》》》》》》')
            console.log(this.dataSource)

            // this.totalRecords = res.result.total // 获取总记录数
          } else {
            this.$error({ title: '数据查询失败', content: res.message })
          }
        })
        .finally(() => {
          this.loading = false
        })
    },

    handlePageChange(page) {
      // this.currentPage = page // 更新当前页码
      this.loadData(page) // 加载新一页的数据
    },

    // 单元格编辑完成之后触发的事件
    handleEditClosed(event) {
      this.tableChange()
      let { $table, row, column } = event

      let id = row['id']
      let field = column.property
      let cellValue = row[field]

      // 检查用户选择的值是否为“好”
      if (cellValue === 'A' && this.remainingQuota <= 0) {
        let that = this
        // 提示用户没有剩余名额
        // 提示用户没有剩余名额
        Modal.info({
          title: '提示',
          content: '已无剩余名额，无法选择“好”。',
          okText: '确认',
          onOk() {
            // 用户点击确认后的处理（如果需要）
            that.updateRemainingQuota()

          }
        })

        // 恢复单元格的值为原始值
        const originalValue = this.dataSource.find((r) => r.id === id)[field + '_dictText'] // 获取原始值
        row[field] = originalValue // 恢复值
        $table.reloadRow(row) // 更新行
        this.updateRemainingQuota()

        return // 退出方法
      }

      // 判断单元格值是否被修改
      if ($table.isUpdateByRow(row, field)) {
        // 将变动的记录添加到 modifiedRows
        if (!this.modifiedRows.some((modifiedRow) => modifiedRow.id === id)) {
          this.modifiedRows.push({ id, field, value: cellValue })
        } else {

          const modifiedRow = this.modifiedRows.find((modifiedRow) => modifiedRow.id === id)
          modifiedRow.field = field
          modifiedRow.value = cellValue
        }

        // 实时更新当前季度剩余“好”的数量
        this.updateRemainingQuota()
      } else {
        // 如果值没有变化，但我们仍然需要更新 remainingQuota
        const modifiedRow = this.modifiedRows.find((modifiedRow) => modifiedRow.id === id)
        if (modifiedRow) {
          //
          // // 从 modifiedRows 中删除该记录
          // const index = this.modifiedRows.indexOf(modifiedRow)
          // if (index !== -1) {
          //   // 过滤出id不为modifiedRow.id的记录
          //   this.modifiedRows = this.modifiedRows.filter((row) => row.id !== modifiedRow.id)
          // }
          this.updateRemainingQuota()
        }
      }
    },

    submitChanges() {
      // 检查当前季度成绩是否都已填写
      const currentQuarterColumn = this.columns.find((col) => col.disabled === false)
      const currentQuarterDataIndex = currentQuarterColumn.key

      const missingEntries = this.dataSource.filter((row) => !row[currentQuarterDataIndex])

      if (missingEntries.length > 0) {
        message.warning('存在考核成绩未填报人员！') // 提示未填报人员
        return // 阻止提交
      }

      // 如果所有数据都填入，准备确认信息
      const goodNames = []
      const betterNames = []
      const averageNames = []
      const poorNames = []
      const uncertainNames = []

      this.dataSource.forEach((record) => {
        const value = record[currentQuarterDataIndex]
        if (value === 'A') goodNames.push(record.name)
        else if (value === 'B') betterNames.push(record.name)
        else if (value === 'C') averageNames.push(record.name)
        else if (value === 'D') poorNames.push(record.name)
        else if (value === 'E') uncertainNames.push(record.name)
      })
      const assess = this.assessname

      // 构建确认信息
      const confirmationContent = (
        <div>
          {goodNames.length > 0 && (
            <p>
              {assess}评为“好”等次：{goodNames.join('、')}
            </p>
          )}
          {betterNames.length > 0 && (
            <p>
              {assess}评为“较好”等次：{betterNames.join('、')}
            </p>
          )}
          {averageNames.length > 0 && (
            <p>
              {assess}评为“一般”等次：{averageNames.join('、')}
            </p>
          )}
          {poorNames.length > 0 && (
            <p>
              {assess}评为“较差”等次：{poorNames.join('、')}
            </p>
          )}
          {uncertainNames.length > 0 && (
            <p>
              {assess}评为“不确定等次”：{uncertainNames.join('、')}
            </p>
          )}
        </div>
      )

      // 弹出确认信息清单
      Modal.confirm({
        title: '请确认信息清单',
        content: confirmationContent,
        width: 800,
        okText: '确认',
        cancelText: '取消',
        onOk: async () => {
          // 这里不直接提交，而是检查当前季度
          if (this.jidu === '4') {
            // 判断是否为第四季度
            this.showNonGoodRecords() // 显示无“好”的人员清单
          } else {
            // 提交数据逻辑
            const promises = this.modifiedRows.map((modifiedRow) => {
              return putAction(this.url.editLeader, {
                id: modifiedRow.id,
                field: modifiedRow.field,
                value: modifiedRow.value
              })
            })

            const responses = await Promise.all(promises)
            const success = responses.every((res) => res.success)

            if (success) {
              message.success('提交成功！')
              this.modifiedRows = [] // 清空变动记录
              this.computeRemainingSeats() // 重新计算剩余名额
              this.loadData() // 重新加载数据
            } else {
              message.error('未能全部成功提交，请检查。')
            }
          }
        },
        onCancel: () => {
          // 取消时的处理逻辑
        }
      })
    },
    updateRemainingQuota() {
      const currentQuarterColumn = this.columns.find((col) => col.disabled === false) // 获取当前季度的列对象
      // 检查当前季度列是否存在
      if (!currentQuarterColumn) {
        console.warn('当前季度列未找到，无法更新剩余名额')
        return // 如果没有找到当前季度列，直接返回
      }
      const currentQuarterDataIndex = currentQuarterColumn.key // 当前季度的数据索引
      // 统计当前季度“好”的数量
      const goodCount = this.dataSource.filter((row) => row[currentQuarterDataIndex] === 'A').length
      // 更新 remainingQuota
      if (this.totalQuota - goodCount >= 0) {
        this.remainingQuota = this.totalQuota - goodCount
      } else {
        this.remainingQuota = 0
      }
    },

    // 查询四个季度都不是“A”的记录
    showNonGoodRecords() {
      const nonGoodRecords = this.dataSource.filter(
        (record) =>
          record.quarter1 !== 'A' && record.quarter2 !== 'A' && record.quarter3 !== 'A' && record.quarter4 !== 'A'
      )

      // 如果没有找到记录
      if (nonGoodRecords.length === 0) {
        message.info('没有找到四个季度成绩都不是“A”的记录。')
        return
      }

      // 将姓名用“、”连接
      const names = nonGoodRecords.map((record) => record.name).join('、')

      // 构建清单内容
      const confirmationContent = (
        <div>
          <p>以下人员四个季度均未被评为“好”等次：{names}，年度考核无评优资格！</p>
        </div>
      )

      // 显示弹窗
      Modal.confirm({
        title: '四个季度平时考核成绩都无“好”等次的人员清单',
        content: confirmationContent,
        width: 800,
        okText: '确认',
        cancelText: '重新测评',
        onOk: async () => {
          // 提交数据逻辑
          const promises = this.modifiedRows.map((modifiedRow) => {
            return putAction(this.url.editLeader, {
              id: modifiedRow.id,
              field: modifiedRow.field,
              value: modifiedRow.value
            })
          })

          const responses = await Promise.all(promises)
          const success = responses.every((res) => res.success)

          if (success) {
            message.success('提交成功！')
            this.modifiedRows = [] // 清空变动记录
            this.computeRemainingSeats() // 重新计算剩余名额
            this.loadData() // 重新加载数据
          } else {
            message.error('未能全部成功提交，请检查。')
          }
        },
        onCancel: () => {
          // 重新测评时的处理逻辑，返回到请确认信息清单
          this.submitChanges() // 重新打开确认信息清单
          this.columns.forEach(column => {
            if (column.hasOwnProperty('disabled')) {
              this.$set(column, 'disabled', false)
            }
          })
          this.modifiedRows = []
          this.shouldDisableTableAndButton = false
        }
      })
    },
    computeRemainingSeats() {
      // 计算剩余座位数
      getAction(this.url.getComputeRemainingSeats).then((res) => {
        this.totalQuota = res.totalQuota
        this.remainingQuota = res.remainingQuota < 0 ? 0 : res.remainingQuota
      })
    }
  }
}
</script>
<style scoped>
.overover {
  overflow-y: scroll;
  height: 500px;
}

@keyframes slide {
  0% {
    transform: translateX(60%);
  }
  100% {
    transform: translateX(-60%);
  }
}

.sliding-boxs {
  width: 100%;
  height: 80px;
  text-align: center;
  margin-bottom: 20px;
  font-size: 20px;

  overflow: hidden; /* 隐藏超出部分 */
  position: relative; /* 使内部元素相对定位 */
  display: flex;
  align-items: center;
  justify-content: left;
}

.sliding-box {
  width: 100%;
  height: 60px;
  line-height: 60px;
  text-align: center;
  margin-bottom: 20px;
  font-size: 20px;

  border: 1px solid rgb(255, 211, 183);
  background: rgb(255, 248, 231);
  /* padding: 10px; */
  border-radius: 5px;

  /* box-shadow: 0 0 10px 10px rgba(245, 34, 45, 0.15); */
  overflow: hidden; /* 隐藏超出部分 */
  position: relative; /* 使内部元素相对定位 */
}

.sliding-content {
  display: inline-block;
  white-space: nowrap;
  position: absolute;
  left: 0;
  right: 0;
  height: 60px;
  /* top: 60%; */
  transform: translateY(-50%);
  animation: slide 20s linear infinite;
  color: rgb(225, 85, 0);
  /* background-color: rgba(245, 34, 45, 0.15);
  box-shadow: 0 0 10px 10px rgba(245, 34, 45, 0.15); */
}

@import '~@assets/less/common.less';

.j-vxe-table th {
  border-right: 1px solid #d9d9d9; /* 列分割线 */
}

.j-vxe-table th:last-child {
  border-right: none; /* 最后一列不加右边框 */
}

.j-vxe-table td {
  border-right: 1px solid #d9d9d9; /* 列分割线 */
}

.j-vxe-table td:last-child {
  border-right: none; /* 最后一列不加右边框 */
}
</style>
