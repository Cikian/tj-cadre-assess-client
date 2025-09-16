<template>
  <div>
    <a-input-search
      v-model="textVals"
      :placeholder="placeholder"
      readOnly
      unselectable="on"
      :disabled="disabled"
      allowClear
      @search="onSearchDepUser">
      <a-button v-if="showBtn" slot="enterButton" :disabled="disabled">{{ btnText }}</a-button>
    </a-input-search>
    <t-select-user-by-dep-modal
      ref="selectModal"
      :modal-width="modalWidth"
      :multi="multi"
      @ok="selectOK"
      :user-ids="value"
      :store="storeField"
      :text="textField"
      :get-leader='getLeader'
      :depart-id="departId"
      :is-scope="isScope"
      :year="year"
      @initComp="initComp"/>
  </div>
</template>

<script>
  import { underLinetoHump } from '@/components/_util/StringUtil'
  import TSelectUserByDepModal from './modal/TSelectUserByDepModal.vue'

  export default {
    name: 'TSelectUserByDep',
    components: { TSelectUserByDepModal },
    props: {
      showBtn: {
        type: Boolean,
        required: false,
        default: true
      },
      year: {
        type: String,
        required: false,
        default: "0"
      },
      btnText: {
        type: String,
        required: false,
        default: "选择用户"
      },
      isScope: {
        type: Boolean,
        required: false,
        default: false
      },
      getLeader: {
        type: Boolean,
        required: false,
        default: false
      },
      placeholder: {
        type: String,
        required: false,
        default: "请选择用户"
      },
      departId: {
        type: String,
        required: false
      },
      modalWidth: {
        type: Number,
        default: 1250,
        required: false
      },
      value: {
        type: String,
        required: false
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false
      },
      multi: {
        type: Boolean,
        default: true,
        required: false
      },
      backUser: {
        type: Boolean,
        default: false,
        required: false
      },
      // 存储字段 [key field]
      store: {
        type: String,
        default: 'username',
        required: false
      },
      // 显示字段 [label field]
      text: {
        type: String,
        default: 'realname',
        required: false
      }
    },
    data() {
      return {
        storeVals: '', //[key values]
        textVals: '' //[label values]
      }
    },
    computed:{
      storeField(){
        let field = this.customReturnField
        if(!field){
          field = this.store;
        }
        return underLinetoHump(field)
      },
      textField(){
        return underLinetoHump(this.text)
      }
    },
    mounted() {
      this.storeVals = this.value
    },
    watch: {
      value(val) {
        this.storeVals = val
      }
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    methods: {
      initComp(textVals) {
        this.textVals = textVals
      },
      //返回选中的用户信息
      backDepartInfo(){
        if(this.backUser===true){
          if(this.storeVals && this.storeVals.length>0){
            let arr1 = this.storeVals.split(',')
            let arr2 = this.textVals.split(',')
            let info = []
            for(let i=0;i<arr1.length;i++){
              info.push({
                value: arr1[i],
                text: arr2[i]
              })
            }
            this.$emit('back', info)
          }
        }
      },
      onSearchDepUser() {
        this.$refs.selectModal.showModal()
      },
      selectOK(rows) {
        console.log("当前选中用户", rows)
        if (!rows) {
          this.storeVals = ''
          this.textVals = ''
        } else {
          let temp1 = []
          let temp2 = []
          for (let item of rows) {
            temp1.push(item[this.storeField])
            temp2.push(item[this.textField])
          }
          this.storeVals = temp1.join(',')
          this.textVals = temp2.join(',')
        }
        this.$emit("change", this.storeVals)
      }
    }
  }
</script>

<style scoped>

</style>