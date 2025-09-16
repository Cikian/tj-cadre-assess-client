<template>
  <a-tree-select
    allowClear
    labelInValue
    style='width: 100%'
   ref='treeSelect'
    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
    :placeholder='placeholder'
    :loadData='asyncLoadTreeData'
    :value='treeValue'
    :treeData='treeData'
    :multiple='multiple'
    @select='handleSelect'
    @change='onChange'
    @treeExpand='handleExpand'>
  </a-tree-select>
</template>
<script>

import { getAction } from '@/api/manage'

export default {
  name: 'TCategorySelect',
  props: {
    value: {
      type: String,
      required: false
    },
    placeholder: {
      type: String,
      default: '请选择',
      required: false
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false
    },
    condition: {
      type: String,
      default: '',
      required: false
    },
    // 是否支持多选
    multiple: {
      type: Boolean,
      default: false
    },
    loadTriggleChange: {
      type: Boolean,
      default: false,
      required: false
    },
    pid: {
      type: String,
      default: '',
      required: false
    },
    pcode: {
      type: String,
      default: '',
      required: false
    },
    back: {
      type: String,
      default: '',
      required: false
    }
  },
  data() {
    return {
      treeValue: '',
      treeData: [],
      url: '/sys/category/loadTreeData',
      view: '/sys/category/loadDictItem/',
      tableName: '',
      text: '',
      code: '',
      nodeMap: new Map(), // 用于存储节点信息的映射

    }
  },
  watch: {
    value() {
      this.loadItemByCode()
    },
    pcode() {
      this.loadRoot()
    }
  },
  created() {
    this.validateProp().then(() => {
      this.loadRoot()
      this.loadItemByCode()
    })
  },
  methods: {
    handleExpand(expandedKeys) {
      // 处理展开事件，如果需要的话
      console.log('expandedKeys111', expandedKeys);
    
     
    },
    /**加载一级节点 */
    loadRoot() {
      let param = {
        pid: this.pid,
        pcode: !this.pcode ? '0' : this.pcode,
        condition: this.condition
      }
      getAction(this.url, param).then(res => {
        if (res.success && res.result) {
          for (let i of res.result) {
            i.value = i.key
            
            if (i.leaf == false) {
              i.isLeaf = false
            } else if (i.leaf == true) {
              i.isLeaf = true
            }
            i.parent = !i.isLeaf // 标记是否为父节点
            this.nodeMap.set(i.key, i) // 将节点信息存入映射
          }

          // for (let i of res.result) {
          //   if (i.code !== 'B03A05') {
          //     console.log('树一级节点查询结果', i)
          //     // i.disabled = true
          //   }
          // }

          this.treeData = [...res.result]
          console.log('getloadtree',this.treeData)
        } else {
          console.log('树一级节点查询结果-else', res)
        }
      })
    },

    /** 数据回显*/
    loadItemByCode() {
      if (!this.value || this.value == '0') {
        this.treeValue = []
      } else {
        getAction(this.view, { ids: this.value }).then(res => {
          if (res.success) {
            let values = this.value.split(',')
            console.log('loadItemByCode', res.result)
            this.treeValue = res.result.map((item, index) => ({
              key: values[index],
              value: values[index],
              label: item,
              
            }))
            this.onLoadTriggleChange(res.result[0])
          }
        })
      }
    },
    onLoadTriggleChange(text) {
      //只有单选才会触发
      if (!this.multiple && this.loadTriggleChange) {
        this.backValue(this.value, text)
      }
    },
    backValue(value, label) {
      let obj = {}
      if (this.back) {
        obj[this.back] = label
      }
      this.$emit('change', value, obj)
    },
    asyncLoadTreeData(treeNode) {
      console.log('treeNode', treeNode)
      return new Promise((resolve) => {
        if (treeNode.$vnode.children) {
          resolve()
          return
        }
        let pid = treeNode.$vnode.key
        let param = {
          pid: pid,
          condition: this.condition
        }
        getAction(this.url, param).then(res => {
          if (res.success) {
            for (let i of res.result) {
              i.value = i.key
              if (i.leaf == false) {
                i.isLeaf = false
              } else if (i.leaf == true) {
                i.isLeaf = true
              }
              i.parent = !i.isLeaf // 标记是否为父节点
              this.nodeMap.set(i.key, i) // 将节点信息存入映射
            }
            this.addChildren(pid, res.result, this.treeData)
            this.treeData = [...this.treeData]
            console.log('asyncLoadTreeData', this.treeData)
          }
          resolve()
        })
      })
    },
    addChildren(pid, children, treeArray) {
      if (treeArray && treeArray.length > 0) {
        for (let item of treeArray) {
          if (item.key == pid) {
            if (!children || children.length == 0) {
              item.isLeaf = true
            } else {
              item.children = children
            }
            break
          } else {
            this.addChildren(pid, children, item.children)
          }
        }
      }
    },
    handleParentClick(node) {
    if (node.parent) {
      // 触发父节点的展开/折叠行为
      this.$refs.treeSelect.onExpand(node);
      return false; // 返回false以阻止默认行为（如选择）
    }
    return true;
  },
  handleSelect(selectedKey, option) {
    console.log('handleSelect', selectedKey, option);
      const nodeInfo = this.nodeMap.get(selectedKey.value);
      console.log('nodeInfo', nodeInfo)
      if (nodeInfo && nodeInfo.parent) {
        // 如果是父节点，则不进行选择，只触发展开/折叠
        // this.asyncLoadTreeData(option)
        // this.handleExpand(option)
  
        return
      }
      // 对于非父节点，可以执行其他逻辑（如果有）
    },
    onChange(value, label, extra) {

      const nodeInfos = this.nodeMap.get(value[0].value);
      console.log('nodeInfos', nodeInfos)
      if (nodeInfos && nodeInfos.parent) {
return
      }else{

     



      console.log('onChange', value, label, extra)
      if (!value) {
        this.$emit('change', '')
        this.treeValue = ''
      } else if (Array.isArray(value)) {
        let filteredValue = value.filter(item => {
        const nodeInfo = this.nodeMap.get(item.value);
        return nodeInfo && !nodeInfo.parent;
      });
    
        let labels = []
        let values = filteredValue.map(item => {
          labels.push(item.label)
          return item.value
        })
        this.backValue(values.join(','), labels.join(','))
        this.treeValue = filteredValue
      } else {
        // this.backValue(value.value, value.label)
        // this.treeValue = value
        // 单选模式下检查是否为父节点
        const nodeInfo = this.nodeMap.get(value.value);
      if (!(nodeInfo && nodeInfo.parent)) {
        this.backValue(value.value, value.label);
        this.treeValue = value;
      }
      }

    }
    },
    getCurrTreeData() {
      return this.treeData
    },
    validateProp() {
      let mycondition = this.condition
      return new Promise((resolve, reject) => {
        if (!mycondition) {
          resolve()
        } else {
          try {
            let test = JSON.parse(mycondition)
            if (typeof test == 'object' && test) {
              resolve()
            } else {
              this.$message.error('组件JTreeSelect-condition传值有误，需要一个json字符串!')
              reject()
            }
          } catch (e) {
            this.$message.error('组件JTreeSelect-condition传值有误，需要一个json字符串!')
            reject()
          }
        }
      })
    }
  },
  //2.2新增 在组件内定义 指定父组件调用时候的传值属性和事件类型 这个牛逼
  model: {
    prop: 'value',
    event: 'change'
  }
}
</script>
