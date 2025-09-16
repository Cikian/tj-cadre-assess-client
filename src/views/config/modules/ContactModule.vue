<template>
  <a-card :bordered='false'>
    <template v-if='this.departId'>
      <a-spin :spinning='loading'>
        <a-form>
          <a-form-item label='被考核的单位：'>
            <a-tree
              checkable
              multiple
              @select='onSelect'
              @check='onCheck'
              :selectedKeys='selectedKeys'
              :checkedKeys='checkedKeys'
              :treeData='departTree'
              :checkStrictly='checkStrictly'
              :expandedKeys='iExpandedKeys'
              :autoExpandParent='autoExpandParent'
              @expand='onExpand' />
          </a-form-item>
        </a-form>
      </a-spin>
      <div class='anty-form-btn'>
        <a-dropdown style='float: left' :trigger="['click']" placement='topCenter'>
          <a-menu slot='overlay'>
            <a-menu-item key='3' @click='checkALL'>全部勾选</a-menu-item>
            <a-menu-item key='4' @click='cancelCheckALL'>取消全选</a-menu-item>
            <a-menu-item key='5' @click='expandAll'>展开所有</a-menu-item>
            <a-menu-item key='6' @click='closeAll'>合并所有</a-menu-item>
          </a-menu>
          <a-button>
            树操作
            <a-icon type='up' />
          </a-button>
        </a-dropdown>
        <a-button style='float: right' @click='handleSubmit' type='primary' htmlType='button' icon='form'>保存
        </a-button>
      </div>
    </template>
    <a-card v-else :bordered='false' style='height:200px'>
      <a-empty>
        <span slot='description'> 请先选择一个部门! </span>
      </a-empty>
    </a-card>
    <depart-datarule-modal ref='datarule' />
  </a-card>
</template>

<script>
import { saveDepartPermission, queryDepartTreeList } from '@/api/api'
import { getDepartContact } from '@/api/assessApis'
import DepartDataruleModal from '../../system/modules/DepartDataruleModal'

export default {
  name: 'ContactModal',
  components: { DepartDataruleModal },
  data() {
    return {
      iExpandedKeys: [],
      departId: '',
      departTree: [],
      treeData: [],
      defaultCheckedKeys: [],
      checkedKeys: [],
      halfCheckedKeys: [],
      expandedKeysss: [],
      allTreeKeys: [],
      autoExpandParent: true,
      checkStrictly: false,
      title: '部门权限配置',
      visible: false,
      loading: false,
      selectedKeys: []
    }
  },
  methods: {
    onTreeNodeSelect(id) {
      if (id && id.length > 0) {
        this.selectedKeys = id
      }
      this.$refs.datarule.show(this.selectedKeys[0], this.departId)
    },

    onCheck(checkedKeys, { halfCheckedKeys }) {
      // 保存选中的和半选中的，后面保存的时候合并提交
      this.checkedKeys = checkedKeys
      this.halfCheckedKeys = halfCheckedKeys
    },
    onSelect(selectedKeys, e) {
      if (this.checkedKeys.includes(selectedKeys[0])) {
        let i = this.checkedKeys.indexOf(selectedKeys[0])
        this.checkedKeys.splice(i, 1)
      } else {
        this.checkedKeys.push(selectedKeys[0])
      }
    },

    show(departId) {
      this.departId = departId
      this.loadData()
    },
    close() {
      this.reset()
      this.$emit('close')
      this.visible = false
    },
    onExpand(expandedKeys) {
      this.iExpandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    reset() {
      this.expandedKeysss = []
      this.checkedKeys = []
      this.defaultCheckedKeys = []
      this.loading = false
    },
    expandAll() {
      this.expandedKeysss = this.allTreeKeys
    },
    closeAll() {
      this.expandedKeysss = []
    },
    checkALL() {
      this.checkedKeys = this.allTreeKeys
    },
    cancelCheckALL() {
      this.checkedKeys = []
    },
    handleCancel() {
      this.close()
    },
    handleSubmit() {
      let that = this
      if (!that.departId) {
        this.$message.warning('请点击选择一个部门!')
      }
      let checkedKeys = [...that.checkedKeys, ...that.halfCheckedKeys]
      const permissionIds = checkedKeys.join(',')
      let params = {
        departId: that.departId,
        permissionIds,
        lastpermissionIds: that.defaultCheckedKeys.join(',')
      }
      that.loading = true
      saveDepartPermission(params).then((res) => {
        if (res.success) {
          that.$message.success(res.message)
          that.loading = false
          that.loadData()
        } else {
          that.$message.error(res.message)
          that.loading = false
        }
      })
    },
    emptyCurrForm() {
      this.form.resetFields()
    },
    loadData() {
      this.loading = true
      var that = this
      that.treeData = []
      that.departTree = []
      queryDepartTreeList().then((res) => {
        if (res.success) {
          this.allTreeKeys = []
          for (let i = 0; i < res.result.length; i++) {
            let temp = res.result[i]
            that.treeData.push(temp)
            that.departTree.push(temp)
          }

          getDepartContact({departId:this.departId}).then(res => {
            if (res.success) {

              this.checkedKeys = res.result
            }
          })

          this.loading = false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>