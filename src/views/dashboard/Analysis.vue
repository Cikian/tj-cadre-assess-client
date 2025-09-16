<!--
 * @Author: zhaxiaobao
 * @Date: 2024-11-21 20:30:51
 * @Description:
-->
<template>
  <div>
    <index-chart v-if="indexStyle == 1"></index-chart>
    <index-bdc v-if="indexStyle == 2"></index-bdc>
    <index-task v-if="indexStyle == 3"></index-task>
    <IndexBdcleader v-if="indexStyle == 22"></IndexBdcleader>
    <IndexCharthuman v-if="indexStyle == 12"></IndexCharthuman>
    <IndexBdchead v-if="indexStyle == 24"></IndexBdchead>
    <unknowone v-if="indexStyle==31"></unknowone>
    <unknowtwo v-if="indexStyle==32"></unknowtwo>
    <!-- <div style="width: 100%;text-align: right;margin-top: 20px">
      请选择首页样式：
      <a-radio-group v-model="indexStyle">
        <a-radio :value="1">统计图表</a-radio>
        <a-radio :value="2">统计图表2</a-radio>
        <a-radio :value="3">任务表格</a-radio>
      </a-radio-group>
    </div> -->
  </div>
</template>

<script>
import IndexChart from './IndexChart'
import IndexTask from './IndexTask'
import IndexBdc from './IndexBdc'
import IndexBdcleader from './IndexBdcleader'
import IndexCharthuman from './IndexCharthuman'
import IndexBdchead from './IndexBdchead'
import unknowone from './unknowone'
import unknowtwo from './unknowtwo'
import { getAction } from '@/api/manage'

export default {
  name: 'Analysis',
  components: {
    IndexChart,
    IndexTask,
    IndexBdc,
    IndexBdcleader,
    IndexCharthuman,
    IndexBdchead,
    unknowone,
    unknowtwo
  },
  data() {
    return {
      indexStyle: 2,
      currentUser: {},
    }
  },
  mounted() {
    // /regular/report/getPartial
    // 首2
    getAction('/common/currentUserRoles').then((res) => {
      this.currentUser = res.result
      if (
        this.currentUser.includes('department_cadre_admin')
      //  / this.currentUser.indexOf('department_cadre_admin') !== -1
        //  ||
        // this.currentUser.indexOf('department_human_admin') !== -1
      ) {
        this.indexStyle = 1
        console.log('this.indexStyle', this.indexStyle)
      }else if(this.currentUser.includes('director_leader')){
        this.indexStyle = 22
      }else if(this.currentUser.includes('department_human_admin')){
        this.indexStyle = 12
      } 
      else if (this.currentUser.includes('depart_report') || this.currentUser.includes('basic_report')) {
    this.indexStyle = 2;
} else if (this.currentUser.includes('department_head') || this.currentUser.includes('basic_head')) {
    this.indexStyle = 24;
}else if( this.currentUser.includes('temporary_user')){
  this.indexStyle = 31;
}else if(this.currentUser.includes('basic_temporary_user') ){
  this.indexStyle = 32;
}
else {
        this.indexStyle = 2
      }
      // console.log('currentUser',this.currentUser)
      // getAction('/common/currentUserRoles').then((res) => {
    //   this.currentUser = res.result
    //   console.log('this.currentUser',this.currentUser)
    //   if (
    //     this.currentUser.includes('temporary_user')
  
    //   ) {
    //     console.log("")
    //     this.$router.push("/assess/annual/evaluation" )
        
    //   }else if( this.currentUser.includes('basic_temporary_user')){
    //     this.$router.push({ path: "/evaluation/democratic" }).catch(()=>{
    //       console.log('登录跳转首页出错,这个错误从哪里来的')
    //     })
    //   }





    })
  },
  created() {},
  methods: {},
}
</script>
