<template>
  <t-modal
    ref="tmodal"
    :title="title"
    :width="1200"
    :visible="visible"
    :maskClosable="false"
    :switchFullscreen="false"
    :simple-submit="disableSubmit"
    :is-yw-fill="true"
    :slots="['footerPrefix']"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
  >

    <template slot="footer" ref="footer">
      <a-button type="primary" @click="downloadExcel" :loading="loading">下载Excel</a-button>
      <a-button type="danger" v-on="$listeners" @click="$emit('cancel')">关闭</a-button>
    </template>

    <div>
      <div style="display: flex; align-items: center; justify-content: center">
        <div ref="chart1" style="width: 400px; height: 400px"></div>
      </div>
      <div style="display: flex; align-items: center; justify-content: center">
        <div ref="chart2" style="width: 400px; height: 400px"></div>
        <div ref="chart3" style="width: 400px; height: 400px"></div>
        <div ref="chart4" style="width: 400px; height: 400px"></div>
      </div>
    </div>
  </t-modal>
</template>

<script>
import TModal from '@/component/TModal.vue'
import { getAction, postAction } from '@/api/manage'
import { filterObj } from '@/utils/util'
import { axios } from '@/utils/assessReq'

export default {
  name: 'AssessAnnualFillModal',
  components: {
    TModal
  },
  data() {
    return {
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
          title: '测评对象',
          align: 'center',
          dataIndex: 'appraisee',
          width: 100,
          scopedSlots: { customRender: 'appraisee' }
        },
        {
          title: '单位',
          align: 'center',
          dataIndex: 'depart_dictText',
          scopedSlots: { customRender: 'depart' }
        },
        {
          title: '年度',
          align: 'center',
          width: 70,
          dataIndex: 'currentYear_dictText'
        },
        // {
        //   title: '测评名称',
        //   align: 'center',
        //   dataIndex: 'assessName',
        // },
        // {
        //   title: '测评类型',
        //   align: 'center',
        //   dataIndex: 'type_dictText',
        // },
        // {
        //   title: '开始时间',
        //   align: 'center',
        //   dataIndex: 'startDate',
        //   customRender: function (text) {
        //     return !text ? '' : text.length > 10 ? text.substr(0, 10) : text
        //   },
        // },
        // {
        //   title: '结束时间',
        //   align: 'center',
        //   dataIndex: 'endDate',
        //   customRender: function (text) {
        //     return !text ? '' : text.length > 10 ? text.substr(0, 10) : text
        //   },
        // },
        {
          title: '分数',
          align: 'center',
          width: 110,
          dataIndex: 'score'
        },
        {
          title: '考核单元内正职排名（处室）',
          align: 'center',
          width: 110,
          scopedSlots: { customRender: 'scopeRanking1' }
        },
        {
          title: '考核单元内正职排名（基层）',
          align: 'center',
          width: 110,
          scopedSlots: { customRender: 'scopeRanking2' }
        },
        {
          title: '考核单元内副职排名（处室）',
          align: 'center',
          width: 110,
          scopedSlots: { customRender: 'scopeRanking3' }
        },
        {
          title: '考核单元内副职排名（基层）',
          align: 'center',
          width: 110,
          scopedSlots: { customRender: 'scopeRanking4' }
        },
        {
          title: '正职排名（处室）',
          align: 'center',
          width: 110,
          scopedSlots: { customRender: 'ranking1' }
        },
        {
          title: '正职排名（基层）',
          align: 'center',
          width: 110,
          scopedSlots: { customRender: 'ranking2' }
        },
        {
          title: '副职排名（处室）',
          align: 'center',
          width: 110,
          scopedSlots: { customRender: 'ranking3' }
        },
        {
          title: '副职排名（基层）',
          align: 'center',
          width: 110,
          scopedSlots: { customRender: 'ranking4' }
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

      title: '',
      width: 800,
      visible: false,
      disableSubmit: false,
      record: {},
      chart1: null,
      chart2: null,
      chart3: null,
      chart4: null,
      chart1Data: {},
      chart2Data: {},
      chart3Data: {},
      chart4Data: {},
      baseOption: {
        title: {
          text: ''
        },
        tooltip: {
          show: false
        },
        // toolbox: {
        //   show: true,
        //   feature: {
        //     dataZoom: {
        //       yAxisIndex: 'none'
        //     },
        //     dataView: { readOnly: false },
        //     magicType: { type: ['line', 'bar'] },
        //     restore: {},
        //     saveAsImage: {}
        //   }
        // },

        xAxis: {
          name: '年度',
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#000000'
            }
          },
          axisTick: {
            lineStyle: {
              color: '#000000'
            }
          },
          // 设置X轴标签文字颜色
          axisLabel: {
            color: '#000000'
          },

          data: [],
          position: 'top'
        },
        yAxis: {
          name: '排名',
          type: 'value',
          min: undefined,
          inverse: true,
          axisLine: {
            show: true, // 是否显示坐标轴轴线
            lineStyle: {
              width: 1, // 线的宽度
              type: 'solid' // 线的类型
            }
          }
        },

        visualMap: {
          show: false,
          pieces: [
            {
              gt: 0,
              lte: undefined,
              color: '#008f11'
            }, {

              gt: undefined,
              color: '#e91642'
            }]
        },

        series: [
          {
            data: [],
            type: 'line',
            symbol: 'circle',
            symbolSize: 12,
            itemStyle: {
              color: '#000000'
            },
            lineStyle: {
              width: 5
            },
            markLine: {
              lineStyle: {
                normal: {
                  color: '#ff8100'
                }
              },
              // 不显示点
              symbol: ['none', 'none'],
              data: [
                {
                  name: '',
                  yAxis: undefined,
                  type: 'dashed'
                }
              ],

              label: {
                show: false,
                normal: {
                  formatter: ''
                }
              }

            },

            label: {
              show: true, // 开启显示
              position: 'bottom', // 在上方显示
              // formatter: '第{c}名',
              textStyle: { // 数值样式
                color: 'black', // 字体颜色
                fontSize: 12 // 字体大小
              }
            }
          }
        ]
      },
      loading: false,
      queryParam: {}
    }
  },
  created() {
  },
  methods: {
    downloadExcel() {
      this.loading = true

      console.log(this.queryParams)

      let desc = '参考范围：'
      if (this.queryParam.trial) {
        desc += '试用期人员考核单元内排名变化'
      } else {
        if (this.queryParam.leader && this.queryParam.leader != '') {
          desc += '考核单元内，'
        }
        if (this.queryParam.departType && this.queryParam.departType != '') {
          desc += this.queryParam.departType === 'bureau' ? '局机关处室' : '基层单位'
        }
        if (this.queryParam.type && this.queryParam.type != '') {
          desc += this.queryParam.type === 'z' ? '正职' : '副职'
        }
        if (this.queryParam.nums && this.queryParam.nums != '') {
          desc += '后' + this.queryParam.nums + '%人员'
        }
      }

      const modalBody = document.querySelector('.ant-modal-body')
      const svgElements = modalBody ? Array.from(modalBody.querySelectorAll('svg')) : []
      const svgArray = Array.from(svgElements)

      const formData = new FormData()
// 遍历 SVG 元素
      svgArray.forEach((svg, index) => {
        const bbox = svg.getBBox();
        svg.setAttribute("viewBox", `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
        svg.setAttribute("width", bbox.width);
        svg.setAttribute("height", bbox.height);

        // 序列化为字符串
        const svgString = new XMLSerializer().serializeToString(svg);

        // 转换为 File 对象
        const blob = new Blob([svgString], { type: 'image/svg+xml' })
        const fileName = `svg-${index + 1}.svg`
        const file = new File([blob], fileName, { type: 'image/svg+xml' })

        // 添加到 FormData
        formData.append('svgs', file)
      })

      formData.append('hashId', this.record.appraisee)
      formData.append('desc', desc)
      formData.append('startYear', this.queryParam.currentYear)
      formData.append('endYear', this.queryParam.endYear)

      axios
        .post('/modules/annual/democraticSummary/svg2Excel', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          responseType: 'blob' // 设置响应类型为 blob
        })
        .then((res) => {
          if (res && res.headers) {
            let contentDisposition = res.headers['content-disposition']
            let fileName = contentDisposition ? contentDisposition.split('filename=')[1] : '数据分析.xlsx'
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
        }).finally(() => {
        this.loading = false
      })
    },
    edit(record, queryParam) {
      console.log("Fuck GBKH!!")
      console.log(record)
      console.log(queryParam)

      queryParam.appraisee = record.appraisee
      this.queryParam = queryParam
      this.visible = true
      this.record = record
      this.$nextTick(() => {
        this.getData()
        this.initCharts()
        this.drawCharts()
        this.$refs.tmodal.toggleFullscreen()
      })
    }
    ,
    getData() {

    }
    ,

    initCharts() {
      this.initChart1()
      this.initChart2()
      this.initChart3()
      this.initChart4()
    }
    ,

    initChart1() {
      this.chart1 = this.$echarts.init(this.$refs.chart1, null, { renderer: 'svg' })
    }
    ,
    initChart2() {
      this.chart2 = this.$echarts.init(this.$refs.chart2, null, { renderer: 'svg' })
    }
    ,
    initChart3() {
      this.chart3 = this.$echarts.init(this.$refs.chart3, null, { renderer: 'svg' })
    }
    ,
    initChart4() {
      this.chart4 = this.$echarts.init(this.$refs.chart4, null, { renderer: 'svg' })
    }
    ,

    drawCharts() {
      this.drawChart1()
      this.drawChart2()
      this.drawChart3()
      this.drawChart4()
    }
    ,

    getQueryParams() {
      //获取查询条件
      let sqp = {}
      var param = Object.assign(sqp, this.queryParam, {}, {})
      param.field = this.getQueryField()
      param.pageNo = 1
      param.pageSize = 10000
      return filterObj(param)
    }
    ,

    getQueryField() {
      //TODO 字段权限控制
      var str = 'id,'
      this.columns.forEach(function(value) {
        str += ',' + value.dataIndex
      })
      return str
    }
    ,

    drawChart1() {
      this.queryParam.startYear = this.queryParam.currentYear

      var params = this.getQueryParams()//查询条件

      getAction('/modules/annual/democraticSummary/data1', params).then(res => {
        console.log('data1')
        console.log(res)
        if (res.success) {
          let data = res.result

          let option = this.baseOption
          option.title.text = '总排名变化曲线'
          option.xAxis.data = data.xAxisData
          option.yAxis.min = data.yAxisMin
          option.series[0].data = data.seriesData
          option.series[0].markLine.data[0].yAxis = [data.markLineData]
          option.series[0].markLine.data[0].name = data.markLineName
          option.series[0].markLine.label.normal.formatter = data.markLineName
          option.visualMap.pieces[0].lte = data.markLineData
          option.visualMap.pieces[1].gt = data.markLineData

          //4.使用刚指定的配置项和数据显示图表。
          this.chart1.setOption(option)
        }
      })

    }
    ,
    drawChart2() {
      this.queryParam.startYear = this.queryParam.currentYear
      var params = this.getQueryParams()//查询条件

      getAction('/modules/annual/democraticSummary/data2', params).then(res => {
        console.log('data2')
        console.log(res)
        if (res.success) {
          let data = res.result

          let option = this.baseOption
          option.title.text = '局领导打分排名变化曲线'
          option.xAxis.data = data.xAxisData
          option.yAxis.min = data.yAxisMin
          option.series[0].data = data.seriesData
          option.series[0].markLine.data[0].yAxis = [data.markLineData]
          option.series[0].markLine.data[0].name = data.markLineName
          option.series[0].markLine.label.normal.formatter = data.markLineName
          option.visualMap.pieces[0].lte = data.markLineData
          option.visualMap.pieces[1].gt = data.markLineData

          //4.使用刚指定的配置项和数据显示图表。
          this.chart2.setOption(option)
        }
      })

    }
    ,
    drawChart3() {
      this.queryParam.startYear = this.queryParam.currentYear
      var params = this.getQueryParams()//查询条件

      getAction('/modules/annual/democraticSummary/data3', params).then(res => {
        console.log('data3')
        console.log(res)
        if (res.success) {
          let data = res.result

          let option = this.baseOption
          option.title.text = '正副职打分排名变化曲线'
          option.xAxis.data = data.xAxisData
          option.yAxis.min = data.yAxisMin
          option.series[0].data = data.seriesData
          option.series[0].markLine.data[0].yAxis = [data.markLineData]
          option.series[0].markLine.data[0].name = data.markLineName
          option.series[0].markLine.label.normal.formatter = data.markLineName
          option.visualMap.pieces[0].lte = data.markLineData
          option.visualMap.pieces[1].gt = data.markLineData

          //4.使用刚指定的配置项和数据显示图表。
          this.chart3.setOption(option)
        }
      })

    }
    ,
    drawChart4() {
      this.queryParam.startYear = this.queryParam.currentYear
      var params = this.getQueryParams()//查询条件

      getAction('/modules/annual/democraticSummary/data4', params).then(res => {
        console.log('data4')
        console.log(res)
        if (res.success) {
          let data = res.result

          let option = this.baseOption
          option.title.text = '其他人员打分排名变化曲线'
          option.xAxis.data = data.xAxisData
          option.yAxis.min = data.yAxisMin
          option.series[0].data = data.seriesData
          option.series[0].markLine.data[0].yAxis = [data.markLineData]
          option.series[0].markLine.data[0].name = data.markLineName
          option.series[0].markLine.label.normal.formatter = data.markLineName
          option.visualMap.pieces[0].lte = data.markLineData
          option.visualMap.pieces[1].gt = data.markLineData

          //4.使用刚指定的配置项和数据显示图表。
          this.chart4.setOption(option)
        }
      })

    }
    ,

    close() {
      this.visible = false
    }
    ,
    submitCallback() {
      this.$emit('ok')
      this.visible = false
    }
    ,
    handleCancel() {
      this.close()
    }
    ,
    changeLoading() {
      this.$refs.tmodal.changeLoading()
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-modal-body {
  background-color: #f6f8f8;
  padding: 16px;
}
</style>
