<template>
  <a-card :bordered='false'>
    <!-- 查询区域 -->
    <div class='table-page-search-wrapper'>
      <a-form layout='inline' @keyup.enter.native='searchQuery'>
        <a-row :gutter='24'>
          <a-col :xl='6' :lg='7' :md='8' :sm='24'>
            <a-form-item label='年度'>
              <t-dict-select-tag @change='searchQuery' placeholder='请选择年度' v-model='queryParam.currentYear'
                                 dictCode='assess_year' />
            </a-form-item>
          </a-col>
          <!--          <a-col :xl='4' :lg='7' :md='8' :sm='24'>-->
          <!--            <a-form-item style='width: 250px' label='单位类型'>-->
          <!--              <j-multi-select-tag-->
          <!--                @change='searchQuery'-->
          <!--                placeholder='请选择单位类型'-->
          <!--                dictCode='depart_type_annual'-->
          <!--                v-model='queryParam.departType'-->
          <!--              />-->
          <!--            </a-form-item>-->
          <!--          </a-col>-->
          <a-col :xl='6' :lg='7' :md='8' :sm='24'>
            <a-form-item style='width: 300px' label='考核单元'>
              <t-select-user-by-dep @change='searchQuery' :show-btn='false' :is-scope='true'
                                    placeholder='按考核单元筛选' :get-leader='true'
                                    v-model='queryParam.leader' store='id' text='realname' />
            </a-form-item>
          </a-col>
          <a-col :xl='6' :lg='7' :md='8' :sm='24'>
            <a-form-item label='处室（单位）'>
              <j-select-depart @change='searchQuery' placeholder='请选择处室（单位）' v-model='queryParam.depart' />
            </a-form-item>
          </a-col>
          <a-col :xl='6' :lg='7' :md='8' :sm='24'>
            <a-form-item style='width: 250px' label='等次'>
              <j-multi-select-tag
                @change='searchQuery'
                placeholder='请选择等次'
                dictCode='annual_level'
                v-model='queryParam.level'
              />
            </a-form-item>
          </a-col>
          <a-col :xl='4' :lg='7' :md='8' :sm='24'>
            <a-form-item label='评优建议'>
              <j-dict-select-tag
                @change='searchQuery'
                placeholder='请选择评优建议'
                v-model='queryParam.evaluation'
                dictCode='evaluation_suggestion'
              />
            </a-form-item>
          </a-col>
          <a-col :xl='4' :lg='7' :md='8' :sm='24'>
            <a-form-item label='优秀副职'>
              <j-multi-select-tag
                @change='searchQuery'
                placeholder='筛选优秀副职'
                dictCode='string_y'
                v-model='queryParam.excellentDeputy'
              />
            </a-form-item>
          </a-col>
          <a-col :xl='4' :lg='7' :md='8' :sm='24'>
            <a-form-item label='纪检组推优'>
              <j-multi-select-tag
                @change='searchQuery'
                placeholder='筛选纪检组推优'
                dictCode='string_y'
                v-model='queryParam.disciplineRecommend'
              />
            </a-form-item>
          </a-col>
          <a-col :xl='4' :lg='7' :md='8' :sm='24'>
            <a-form-item label='连续两年评为优秀'>
              <j-multi-select-tag
                @change='searchQuery'
                placeholder='筛选连续两年评为优秀'
                dictCode='string_y'
                v-model='queryParam.thirdClass'
              />
            </a-form-item>
          </a-col>
          <a-col :xl='4' :lg='7' :md='8' :sm='24'>
            <a-form-item label='党组织书记考核'>
              <j-multi-select-tag
                @change='searchQuery'
                placeholder='筛选党组织书记考核为优秀'
                dictCode='string_y'
                v-model='queryParam.partyAssess'
              />
            </a-form-item>
          </a-col>

          <a-col :xl='4' :lg='7' :md='8' :sm='24'>
            <span style='float: left; overflow: hidden' class='table-page-search-submitButtons'>
              <a-button type='primary' @click='searchQuery' icon='search'>查询</a-button>
              <a-button type='primary' @click='searchReset' icon='reload' style='margin-left: 8px'>重置</a-button>
              <!--              <a @click='handleToggleSearch' style='margin-left: 8px'>-->
              <!--                {{ toggleSearchStatus ? '收起' : '展开' }}-->
              <!--                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />-->
              <!--              </a>-->
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class='table-operator'>
      <a-button v-has="'gbc:admin'" type='primary' icon='check-square' @click='openDisciplineRecommend'>纪检组推优
      </a-button>
      <a-button v-has="'gbc:admin'" @click='openPartyOrganization' type='primary' icon='form'>党组织书记考核</a-button>

      <!--      <a-button @click="openNegativeModal" type="primary" icon="plus">负面清单录入</a-button>-->
      <a-button v-has="'gbc:admin'" @click='openMeritModal' type='primary' icon='question-circle'>是否连续两年评为优秀
      </a-button>
      <!--      <a-button type='primary' icon='plus' @click='openExcellentNum'>优秀名额分配</a-button>-->
      <a-button v-has="'gbc:admin'" type='primary' icon='ordered-list' @click='openExcellentDeputyModal'>
        基层单位优秀副职名额分配
      </a-button>
      <a-button type='primary' icon='bar-chart' @click='openLeaderRecommend'>局领导推优情况</a-button>

      <a-button @click='openExport' type='primary' icon='download'>下载述职报告</a-button>
      <a-button v-has="'gbc:admin'" @click='openAdjustment' type='primary' icon='download'>考核人员调整</a-button>
      <a-button @click='openNotExcellent' type='primary' icon='download'>查看基层单位无评优情况</a-button>
      <a-button @click='opeExcellent' type='primary' icon='download'>下载推优结果（党委会材料）</a-button>
      <a-button @click='downloadRes' type='primary' icon='download'>下载全部考核结果（发文使用）</a-button>
      <a-button @click='downloadList' type='primary' icon='download'>下载参考信息汇总</a-button>
      <a-button @click='exportResVisible = true' type='primary' icon='download'>分类下载考核结果汇总（excel）</a-button>


      <!--      <a @click='btnGroup = !btnGroup' style='margin-left: 8px'>-->
      <!--        {{ btnGroup ? '收起' : '展开下载菜单' }}-->
      <!--        <a-icon :type="btnGroup ? 'up' : 'down'" />-->
      <!--      </a>-->
    </div>

    <!-- table区域-begin -->
    <div>
      <a-tabs default-active-key='1' @change='tabChange'>
        <a-tab-pane key='1' tab='机关处室个人汇总'>
          <a-table
            ref='table'
            size='middle'
            :scroll='{ x: true }'
            bordered
            rowKey='id'
            :columns='columns'
            :dataSource='dataSource'
            :pagination='ipagination'
            :loading='loading'
            @change='handleTableChange'
          >
            <template slot='accountability' slot-scope='text, record'>
              <span v-show="record.accountability === 'Y'" style='color: #ff0000'><a-icon type='check' /></span>
            </template>

            <template slot='vacation' slot-scope='text, record'>
              <span v-show="record.vacation === 'Y'" style='color: #ff0000'><a-icon type='check' /></span>
            </template>

            <template slot='excellentDeputy' slot-scope='text, record'>
              <span v-show="record.excellentDeputy === 'Y'" style='color: #65a500'><a-icon type='check' /></span>
            </template>

            <template slot='thirdClass' slot-scope='text, record'>
              <span v-show="record.thirdClass === 'Y'" style='color: #65a500'><a-icon type='check' /></span>
            </template>

            <template slot='partyAssess' slot-scope='text, record'>
              <span v-show="record.partyAssess === 'Y'">好</span>
            </template>

            <template slot='disciplineRecommend' slot-scope='text, record'>
              <span v-show="record.disciplineRecommend === 'Y'" style='color: #65a500'><a-icon type='check' /></span>
            </template>

            <template slot='negativeList' slot-scope='text, record'>
              <j-ellipsis :value='text' :length='10' />
            </template>

            <template slot='evaluation' slot-scope='text, record'>
              <a-tag v-if="record.evaluation === '3'"
                     :color="record.evaluation === '1' ? 'green' : record.evaluation === '2' ? 'orange' : 'red'">
                {{ text }}
              </a-tag>
            </template>

            <template slot='level' slot-scope='text, record'>
              <a-tag
                :color="record.level === '1' ? '#f50' : record.level === '2' ? '#87d068' : record.level === '3' ? '#2db7f5' : record.level === '4' ? '#ff0000' : '#545454'">
                <span
                  v-if='record.identityType === "公务员" || record.identityType === "参公"'>{{ record.level === '1' ? '优秀' : record.level === '2' ? '称职' : record.level === '3' ? '基本称职' : record.level === '4' ? '不称职' : record.level === '5' ? '不确定等次' : '-'
                  }}</span>
                <span
                  v-else>{{ record.level === '1' ? '优秀' : record.level === '2' ? '合格' : record.level === '3' ? '基本合格' : record.level === '4' ? '不合格' : record.level === '5' ? '不确定等次' : '-'
                  }}</span>
              </a-tag>
            </template>

            <template slot='htmlSlot' slot-scope='text, record'>
              <div v-html='text'></div>
            </template>
            <template slot='imgSlot' slot-scope='text, record'>
              <span v-if='!text' style='font-size: 16px; font-style: italic'>无图片</span>
              <img
                v-else
                :src='getImgView(text)'
                :preview='record.id'
                height='25px'
                alt=''
                style='max-width: 80px; font-size: 16px; font-style: italic'
              />
            </template>
            <template slot='fileSlot' slot-scope='text'>
              <span v-if='!text' style='font-size: 16px; font-style: italic'>无文件</span>
              <a-button v-else :ghost='true' type='primary' icon='download' size='small' @click='downloadFile(text)'>
                下载
              </a-button>
            </template>

            <span slot='action' slot-scope='text, record'>
              <a @click='openDetail(record)'>详情</a>
              <a-divider v-has="'gbc:admin'" type='vertical' />
              <a-dropdown v-has="'gbc:admin'">
                <a class='ant-dropdown-link'>更多 <a-icon type='down' /></a>
                <a-menu slot='overlay'>
                  <a-menu-item>
                    <a @click='openInput(record)'>等次补订</a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </span>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key='2' tab='分局、参公个人汇总'>
          <a-table
            ref='table'
            size='middle'
            :scroll='{ x: true }'
            bordered
            rowKey='id'
            :columns='columns'
            :dataSource='dataSource'
            :pagination='ipagination'
            :loading='loading'
            @change='handleTableChange'
          >
            <template slot='accountability' slot-scope='text, record'>
              <span v-show="record.accountability === 'Y'" style='color: #ff0000'><a-icon type='check' /></span>
            </template>

            <template slot='vacation' slot-scope='text, record'>
              <span v-show="record.vacation === 'Y'" style='color: #ff0000'><a-icon type='check' /></span>
            </template>

            <template slot='excellentDeputy' slot-scope='text, record'>
              <span v-show="record.excellentDeputy === 'Y'" style='color: #65a500'><a-icon type='check' /></span>
            </template>

            <template slot='thirdClass' slot-scope='text, record'>
              <span v-show="record.thirdClass === 'Y'" style='color: #65a500'><a-icon type='check' /></span>
            </template>

            <template slot='partyAssess' slot-scope='text, record'>
              <span v-show="record.partyAssess === 'Y'">好</span>
            </template>

            <template slot='disciplineRecommend' slot-scope='text, record'>
              <span v-show="record.disciplineRecommend === 'Y'" style='color: #65a500'><a-icon type='check' /></span>
            </template>

            <template slot='negativeList' slot-scope='text, record'>
              <j-ellipsis :value='text' :length='10' />
            </template>

            <template slot='evaluation' slot-scope='text, record'>
              <a-tag v-if="record.evaluation === '3'"
                     :color="record.evaluation === '1' ? 'green' : record.evaluation === '2' ? 'orange' : 'red'">
                {{ text }}
              </a-tag>
            </template>

            <template slot='level' slot-scope='text, record'>
              <a-tag
                :color="record.level === '1' ? '#f50' : record.level === '2' ? '#87d068' : record.level === '3' ? '#2db7f5' : record.level === '4' ? '#ff0000' : '#545454'">
                <span
                  v-if='record.identityType === "公务员" || record.identityType === "参公"'>{{ record.level === '1' ? '优秀' : record.level === '2' ? '称职' : record.level === '3' ? '基本称职' : record.level === '4' ? '不称职' : record.level === '5' ? '不确定等次' : '-'
                  }}</span>
                <span
                  v-else>{{ record.level === '1' ? '优秀' : record.level === '2' ? '合格' : record.level === '3' ? '基本合格' : record.level === '4' ? '不合格' : record.level === '5' ? '不确定等次' : '-'
                  }}</span>
              </a-tag>
            </template>

            <template slot='htmlSlot' slot-scope='text, record'>
              <div v-html='text'></div>
            </template>
            <template slot='imgSlot' slot-scope='text, record'>
              <span v-if='!text' style='font-size: 16px; font-style: italic'>无图片</span>
              <img
                v-else
                :src='getImgView(text)'
                :preview='record.id'
                height='25px'
                alt=''
                style='max-width: 80px; font-size: 16px; font-style: italic'
              />
            </template>
            <template slot='fileSlot' slot-scope='text'>
              <span v-if='!text' style='font-size: 16px; font-style: italic'>无文件</span>
              <a-button v-else :ghost='true' type='primary' icon='download' size='small' @click='downloadFile(text)'>
                下载
              </a-button>
            </template>

            <span slot='action' slot-scope='text, record'>
              <a @click='openDetail(record)'>详情</a>
              <a-divider v-has="'gbc:admin'" type='vertical' />
              <a-dropdown v-has="'gbc:admin'">
                <a class='ant-dropdown-link'>更多 <a-icon type='down' /></a>
                <a-menu slot='overlay'>
                  <a-menu-item>
                    <a @click='openInput(record)'>等次补订</a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </span>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key='3' tab='事业单位个人汇总'>
          <a-table
            ref='table'
            size='middle'
            :scroll='{ x: true }'
            bordered
            rowKey='id'
            :columns='columns'
            :dataSource='dataSource'
            :pagination='ipagination'
            :loading='loading'
            @change='handleTableChange'
          >
            <template slot='accountability' slot-scope='text, record'>
              <span v-show="record.accountability === 'Y'" style='color: #ff0000'><a-icon type='check' /></span>
            </template>

            <template slot='vacation' slot-scope='text, record'>
              <span v-show="record.vacation === 'Y'" style='color: #ff0000'><a-icon type='check' /></span>
            </template>

            <template slot='excellentDeputy' slot-scope='text, record'>
              <span v-show="record.excellentDeputy === 'Y'" style='color: #65a500'><a-icon type='check' /></span>
            </template>

            <template slot='thirdClass' slot-scope='text, record'>
              <span v-show="record.thirdClass === 'Y'" style='color: #65a500'><a-icon type='check' /></span>
            </template>

            <template slot='partyAssess' slot-scope='text, record'>
              <span v-show="record.partyAssess === 'Y'">好</span>
            </template>

            <template slot='disciplineRecommend' slot-scope='text, record'>
              <span v-show="record.disciplineRecommend === 'Y'" style='color: #65a500'><a-icon type='check' /></span>
            </template>

            <template slot='negativeList' slot-scope='text, record'>
              <j-ellipsis :value='text' :length='10' />
            </template>

            <template slot='evaluation' slot-scope='text, record'>
              <a-tag v-if="record.evaluation === '3'"
                     :color="record.evaluation === '1' ? 'green' : record.evaluation === '2' ? 'orange' : 'red'">
                {{ text }}
              </a-tag>
            </template>

            <template slot='level' slot-scope='text, record'>
              <a-tag
                :color="record.level === '1' ? '#f50' : record.level === '2' ? '#87d068' : record.level === '3' ? '#2db7f5' : record.level === '4' ? '#ff0000' : '#545454'">
                <span
                  v-if='record.identityType === "公务员" || record.identityType === "参公"'>{{ record.level === '1' ? '优秀' : record.level === '2' ? '称职' : record.level === '3' ? '基本称职' : record.level === '4' ? '不称职' : record.level === '5' ? '不确定等次' : '-'
                  }}</span>
                <span
                  v-else>{{ record.level === '1' ? '优秀' : record.level === '2' ? '合格' : record.level === '3' ? '基本合格' : record.level === '4' ? '不合格' : record.level === '5' ? '不确定等次' : '-'
                  }}</span>
              </a-tag>
            </template>

            <template slot='htmlSlot' slot-scope='text, record'>
              <div v-html='text'></div>
            </template>
            <template slot='imgSlot' slot-scope='text, record'>
              <span v-if='!text' style='font-size: 16px; font-style: italic'>无图片</span>
              <img
                v-else
                :src='getImgView(text)'
                :preview='record.id'
                height='25px'
                alt=''
                style='max-width: 80px; font-size: 16px; font-style: italic'
              />
            </template>
            <template slot='fileSlot' slot-scope='text'>
              <span v-if='!text' style='font-size: 16px; font-style: italic'>无文件</span>
              <a-button v-else :ghost='true' type='primary' icon='download' size='small' @click='downloadFile(text)'>
                下载
              </a-button>
            </template>

            <span slot='action' slot-scope='text, record'>
              <a @click='openDetail(record)'>详情</a>
              <a-divider v-has="'gbc:admin'" type='vertical' />
              <a-dropdown v-has="'gbc:admin'">
                <a class='ant-dropdown-link'>更多 <a-icon type='down' /></a>
                <a-menu slot='overlay'>
                  <a-menu-item>
                    <a @click='openInput(record)'>等次补订</a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </span>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key='4' tab='领导班子汇总' force-render>
          <a-table
            ref='groupTable'
            size='middle'
            :scroll='{ x: true }'
            bordered
            rowKey='id'
            :columns='groupSummaryColumns'
            :dataSource='dataSource'
            :pagination='ipagination'
            :loading='loading'
            @change='handleTableChange'
          >

            <template slot='evaluation' slot-scope='text, record'>
              <a-tag v-if="record.evaluation === '3'"
                     :color="record.evaluation === '1' ? 'green' : record.evaluation === '2' ? 'orange' : 'red'">
                {{ text }}
              </a-tag>
            </template>

            <template slot='level' slot-scope='text, record'>
              <a-tag
                :color="record.level === '1' ? '#f50' : record.level === '2' ? '#87d068' : record.level === '3' ? '#2db7f5' : record.level === '4' ? '#ff0000' : '#545454'">
                <span>{{ record.level === '1' ? '优秀' : record.level === '2' ? '良好' : record.level === '3' ? '一般' : record.level === '4' ? '较差' : '不确定等次'
                  }}</span>
              </a-tag>
            </template>


            <template slot='htmlSlot' slot-scope='text, record'>
              <div v-html='text'></div>
            </template>
            <template slot='imgSlot' slot-scope='text, record'>
              <span v-if='!text' style='font-size: 16px; font-style: italic'>无图片</span>
              <img
                v-else
                :src='getImgView(text)'
                :preview='record.id'
                height='25px'
                alt=''
                style='max-width: 80px; font-size: 16px; font-style: italic'
              />
            </template>
            <template slot='fileSlot' slot-scope='text'>
              <span v-if='!text' style='font-size: 16px; font-style: italic'>无文件</span>
              <a-button v-else :ghost='true' type='primary' icon='download' size='small' @click='downloadFile(text)'>
                下载
              </a-button>
            </template>

            <span slot='action' slot-scope='text, record'>
              <a @click='openDetail(record)'>详情</a>
              <a-divider v-has="'gbc:admin'" type='vertical' />
              <a-dropdown v-has="'gbc:admin'">
                <a class='ant-dropdown-link'>更多 <a-icon type='down' /></a>
                <a-menu slot='overlay'>
                  <a-menu-item>
                    <a @click='openInput(record)'>等次补订</a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </span>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </div>

    <t-modal
      ref='excellentNum'
      :title="'优秀名额管理-当前考核年度：' + lastAssessYear"
      :width='1860'
      :fullscreen='true'
      :visible='excellentManVisible'
      :confirm-loading='confirmLoading'
      :simple-submit='true'
      @ok='submitExcellentMan'
      @cancel='cancelExcellentMan'
    >
      <div style='display: flex; justify-content: left; margin-bottom: 20px'>

        <a-button style='display: inline-block' type='primary' icon='download' @click='getExcellentNumExcel'>导出优秀名额管理表
        </a-button>
        <a-button style='display: inline-block; margin-left: 20px' type='primary' icon='download'
                  @click='beforeExportRecommendPDF'>
          导出纸质推荐表
        </a-button>
      </div>
      <span
        v-if='bureauOver || groupOver || basicOver || institutionOver'
        style='color: red; font-size: 18px; margin-left: 20px'
      >
        当前
        <span style='font-size: 18px; font-weight: bold' v-if='bureauOver'>局机关领导干部实际分配优秀名额数量 </span>
        <span style='font-size: 18px; font-weight: bold' v-if='groupOver'>领导班子实际分配优秀名额数量 </span>
        <span style='font-size: 18px; font-weight: bold' v-if='basicOver'>分局+参公领导干部实际分配优秀名额数量 </span>
        <span style='font-size: 18px; font-weight: bold' v-if='institutionOver'
        >事业单位领导干部实际分配优秀名额数量
        </span>
        大于理论优秀名额数量，请仔细核对确认！
      </span>

      <a-table
        bordered
        :scroll='{ y: 500 }'
        rowKey='id'
        :columns='excellentManColumns'
        :data-source='excellentItems'
        :pagination='false'
        :loading='excellentManLoading'
      >
        <template slot='depart' slot-scope='text, record, index'>
          {{ text }}
        </template>

        <template slot='bureauNum' slot-scope='text, record, index'> {{ text }}</template>

        <template slot='bureauRatio' slot-scope='text, record, index'> {{ text * 100 }}%</template>

        <template slot='bureauTheoryNum' slot-scope='text, record, index'> {{ toFixedNumber(text, 2) }}</template>

        <template slot='bureauTrueNum' slot-scope='text, record, index'>
          <a-input-number
            v-if='index !== excellentItems.length - 1'
            :min='0'
            style='width: 60px'
            v-model='excellentItems[index].bureauTrueNum'
            :precision='0'
            @change="excellentNumChanged('bureau')"
          ></a-input-number>

          <span v-else>{{ text }}</span>
        </template>

        <template slot='groupNum' slot-scope='text, record, index'> {{ text }}</template>

        <template slot='groupRatio' slot-scope='text, record, index'> {{ text * 100 }}%</template>

        <template slot='groupTheoryNum' slot-scope='text, record, index'> {{ toFixedNumber(text, 2) }}</template>

        <template slot='groupTrueNum' slot-scope='text, record, index'>
          <a-input-number
            v-if='index !== excellentItems.length - 1'
            :min='0'
            style='width: 60px'
            v-model='excellentItems[index].groupTrueNum'
            :precision='0'
            @change="excellentNumChanged('group')"
          ></a-input-number>

          <span v-else>{{ text }}</span>
        </template>

        <template slot='basicNum' slot-scope='text, record, index'> {{ text }}</template>

        <template slot='basicRatio' slot-scope='text, record, index'> {{ text * 100 }}%</template>

        <template slot='basicTheoryNum' slot-scope='text, record, index'> {{ toFixedNumber(text, 2) }}</template>

        <template slot='basicTrueNum' slot-scope='text, record, index'>
          <a-input-number
            v-if='index !== excellentItems.length - 1'
            :min='0'
            style='width: 60px'
            v-model='excellentItems[index].basicTrueNum'
            :precision='0'
            @change="excellentNumChanged('basic')"
          ></a-input-number>

          <span v-else>{{ text }}</span>
        </template>

        <template slot='institutionNum' slot-scope='text, record, index'> {{ text }}</template>

        <template slot='institutionRatio' slot-scope='text, record, index'> {{ text * 100 }}%</template>

        <template slot='institutionTheoryNum' slot-scope='text, record, index'> {{ toFixedNumber(text, 2) }}</template>

        <template slot='institutionTrueNum' slot-scope='text, record, index'>
          <a-input-number
            v-if='index !== excellentItems.length - 1'
            :min='0'
            style='width: 60px'
            v-model='excellentItems[index].institutionTrueNum'
            :precision='0'
            @change="excellentNumChanged('institution')"
          ></a-input-number>

          <span v-else>{{ text }}</span>
        </template>
      </a-table>

      <div style='margin: 40px 20px; color: #ff7349'>
        {{ message }}
      </div>
    </t-modal>
    <t-modal
      :title="'导出纸质推荐表'"
      ref='exportRecommendPDF'
      :width='1000'
      :visible='exportRecommendPDFVisible'
      :simple-submit='true'
      @ok='cancelExportRecommendPDF'
      @cancel='cancelExportRecommendPDF'
    >
      <a-form-item label='请选择局领导'>
        <t-select-user-by-dep :get-leader='true' placeholder='请选择局领导' v-model='exportRecommendLeader' store='id'
                              text='realname' />
      </a-form-item>
      <div style='display: flex; justify-content: space-between'>
        <a-button :disabled='exportRecommendLeader ===""' style='display: inline-block' type='primary' icon='download'
                  @click='submitExportRecommendPDF("bureau")'>下载局机关推荐表
        </a-button>
        <a-button :disabled='exportRecommendLeader ===""' style='display: inline-block' type='primary' icon='download'
                  @click='submitExportRecommendPDF("group")'>下载领导班子推荐表
        </a-button>
        <a-button :disabled='exportRecommendLeader ===""' style='display: inline-block' type='primary' icon='download'
                  @click='submitExportRecommendPDF("basic")'>下载分局+参公推荐表
        </a-button>
        <a-button :disabled='exportRecommendLeader ===""' style='display: inline-block' type='primary' icon='download'
                  @click='submitExportRecommendPDF("institution")'>下载事业单位推荐表
        </a-button>
      </div>
    </t-modal>
    <t-modal
      :title="'导出年度考核成绩汇总'"
      ref='exportRes'
      :width='800'
      :visible='exportResVisible'
      :simple-submit='true'
      @ok='downloadAssess'
      @cancel='exportResVisible = false'
    >

      <div slot="footer">
        <a-button :loading='exportLoading' type="primary" @click="downloadAssess">确认</a-button>
      </div>
      <a-form-model :label-col='{ span: 4 }' :wrapper-col='{ span: 14 }'>
        <a-form-model-item label='年度'>
          <t-dict-select-tag placeholder='请选择年度' v-model='exportResYear'
                             dictCode='assess_year' />
        </a-form-model-item>
      </a-form-model>
    </t-modal>

    <assess-annual-summary-modal
      :form-disable='formDisable'
      ref='modalForm'
      @ok='modalFormOk'
    ></assess-annual-summary-modal>
    <assess-annual-summary-export-modal
      ref='exportModal'
    ></assess-annual-summary-export-modal>
    <assess-annual-negative-list-modal ref='negativeForm'></assess-annual-negative-list-modal>
    <leader-recommend-modal @refresh='loadData' ref='leaderRecommendModal'></leader-recommend-modal>
    <merit-modal @loadData='loadData' ref='meritModal'></merit-modal>
    <party-organization-modal @loadData='loadData' ref='organizationModal'></party-organization-modal>
    <adjustment ref='adjustment'></adjustment>
    <not-excellent ref='notExcellent' />
    <inspection-modal @loadData='loadData' ref='inspectionModal' />
    <excellent-deputy-num-modal @loadData='loadData' ref='excellentDeputyNumModal' />
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { mixinDevice } from '@/utils/mixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import AssessAnnualSummaryModal from './modules/AssessAnnualSummaryModal.vue'
import { getAction } from '@/api/manage'
import { checkAssessing, getAssessingInfo, getEnableRatioItems, updateExcellentNum } from '@/api/assessApis'
import AssessAnnualNegativeListModal from '@/views/assess/annual/negativeList/modules/AssessAnnualNegativeListModal.vue'
import AssessAnnualSummaryExportModal from './modules/AssessAnnualSummaryExportModal.vue'
import LeaderRecommendModal from '@/views/assess/annual/summary/modules/LeaderRecommendModal.vue'
import MeritModal from '@/views/assess/annual/summary/modules/MeritModall.vue'
import TModal from '@/component/TModal.vue'
import Adjustment from '@/views/assess/annual/summary/modules/Adjustment.vue'
import NotExcellent from '@/views/assess/annual/summary/modules/NotExcellent.vue'
import ExportExcel from './modules/ExportExcel.vue'
import { axios } from '@/utils/assessReq'
import PartyOrganizationModal from '@/views/assess/annual/summary/modules/PartyOrganizationModal.vue'
import InspectionModal from '@/views/assess/annual/summary/modules/InspectionModal.vue'
import { toFixedNumber } from 'xe-utils/methods'
import TSelectUserByDep from '@/component/TSelectUserByDep.vue'
import TDictSelectTag from '@/component/TDictSelectTag.vue'
import ExcellentDeputyNumModal from '@/views/assess/annual/summary/modules/ExcellentDeputyNumModal.vue'

export default {
  name: 'AssessAnnualSummaryList',
  mixins: [JeecgListMixin, mixinDevice],
  components: {
    ExcellentDeputyNumModal,
    TDictSelectTag,
    TSelectUserByDep,
    InspectionModal,
    PartyOrganizationModal,
    Adjustment,
    ExportExcel,
    NotExcellent,
    TModal,
    MeritModal,
    LeaderRecommendModal,
    AssessAnnualNegativeListModal,
    AssessAnnualSummaryExportModal,
    AssessAnnualSummaryModal
  },
  data() {
    return {
      lastAssessYear: '',
      description: '年度考核成绩汇总管理页面',
      exportResVisible: false,
      exportLoading: false,
      exportResYear: '',
      // 表头
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
          title: '年度',
          align: 'center',
          width: 80,
          dataIndex: 'currentYear_dictText'
        },
        // {
        //   title: '考核名称',
        //   align: 'center',
        //   width: 80,
        //   dataIndex: 'fillId_dictText'
        // },
        {
          title: '处室（单位）',
          align: 'center',
          width: 130,
          dataIndex: 'depart_dictText'
        },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'person'
        },
        // {
        //   title: '是否问责',
        //   width: 50,
        //   align: 'center',
        //   dataIndex: 'accountability',
        //   // customRender: (text) => (text ? filterMultiDictText(this.dictOptions['accountability'], text) : ''),
        //   scopedSlots: { customRender: 'accountability' },
        // },
        // {
        //   title: '是否休假',
        //   width: 50,
        //   align: 'center',
        //   dataIndex: 'vacation',
        //   // customRender: (text) => (text ? filterMultiDictText(this.dictOptions['vacation'], text) : ''),
        //   scopedSlots: { customRender: 'vacation' },
        // },
        // {
        //   title: '优秀副职',
        //   width: 50,
        //   align: 'center',
        //   dataIndex: 'excellentDeputy',
        //   // customRender: (text) => (text ? filterMultiDictText(this.dictOptions['excellentDeputy'], text) : ''),
        //   scopedSlots: { customRender: 'excellentDeputy' }
        // },
        {
          title: '纪检组推荐',
          width: 80,
          align: 'center',
          dataIndex: 'disciplineRecommend',
          // customRender: (text) => (text ? filterMultiDictText(this.dictOptions['disciplineRecommend'], text) : ''),
          scopedSlots: { customRender: 'disciplineRecommend' }
        },
        {
          title: '连续两年评为优秀',
          width: 90,
          align: 'center',
          dataIndex: 'thirdClass',
          // customRender: (text) => (text ? filterMultiDictText(this.dictOptions['thirdClass'], text) : ''),
          scopedSlots: { customRender: 'thirdClass' }
        },
        {
          title: '党组织书记考核',
          width: 90,
          align: 'center',
          dataIndex: 'partyAssess',
          scopedSlots: { customRender: 'partyAssess' }
        },
        // {
        //   title: '负面清单',
        //   align: 'center',
        //   dataIndex: 'negativeList',
        //   scopedSlots: { customRender: 'negativeList' },
        // },
        // {
        //   title: '负面清单证明材料',
        //   align: 'center',
        //   dataIndex: 'negativeProof',
        //   scopedSlots: { customRender: 'fileSlot' },
        // },
        {
          title: '述职报告',
          align: 'center',
          width: 90,
          dataIndex: 'dutyReport',
          scopedSlots: { customRender: 'fileSlot' }
        },
        {
          title: '不能评优情况汇总',
          align: 'center',
          width: 210,
          dataIndex: 'remark',
          scopedSlots: { customRender: 'remark' }
        },
        {
          title: '参考信息',
          align: 'center',
          width: 210,
          dataIndex: 'negativeList',
          scopedSlots: { customRender: 'negativeList' }
        },
        {
          title: '评优建议',
          align: 'center',
          width: 100,
          dataIndex: 'evaluation_dictText',
          scopedSlots: { customRender: 'evaluation' }
        },
        {
          title: '等次',
          align: 'center',
          width: 100,
          dataIndex: 'level',
          scopedSlots: { customRender: 'level' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 130,
          scopedSlots: { customRender: 'action' }
        }
      ],
      groupSummaryColumns: [
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
          title: '年度',
          align: 'center',
          width: 80,
          dataIndex: 'currentYear'
        },

        {
          title: '单位',
          align: 'center',
          width: 130,
          dataIndex: 'depart_dictText'
        },
        // {
        //   title: '考核名称',
        //   align: 'center',
        //   dataIndex: 'fillId_dictText'
        // },
        {
          title: '民主测评排名',
          align: 'center',
          dataIndex: 'ranking',
          width: 80,
          // customRender: (text) => (text ? filterMultiDictText(this.dictOptions['accountability'], text) : ''),
          scopedSlots: { customRender: 'ranking' }
        },
        {
          title: '不能评优情况汇总',
          align: 'center',
          dataIndex: 'remark',
          width: 360,
          // customRender: (text) => (text ? filterMultiDictText(this.dictOptions['vacation'], text) : ''),
          scopedSlots: { customRender: 'remark' }
        },
        {
          title: '参考信息',
          align: 'center',
          dataIndex: 'list',
          // customRender: (text) => (text ? filterMultiDictText(this.dictOptions['excellentDeputy'], text) : ''),
          width: 380,
          scopedSlots: { customRender: 'list' }
        },
        {
          title: '年度工作总结',
          align: 'center',
          dataIndex: 'dutyReport',
          width: 100,
          scopedSlots: { customRender: 'fileSlot' }
        },
        {
          title: '评优建议',
          align: 'center',
          dataIndex: 'evaluation_dictText',
          width: 100,
          scopedSlots: { customRender: 'evaluation' }
        },
        {
          title: '等次',
          align: 'center',
          dataIndex: 'level',
          width: 100,
          scopedSlots: { customRender: 'level' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 130,
          scopedSlots: { customRender: 'action' }
        }
      ],
      excellentManColumns: [
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
          title: '局领导',
          align: 'center',
          dataIndex: 'leader_dictText',
          customRender: (text, row, index) => {
            if (index < this.excellentItems.length - 1) {
              return text
            }
            return {
              children: text,
              attrs: {
                colSpan: 2
              }
            }
          }
        },
        {
          title: '分管处室（单位）',
          align: 'center',
          width: 200,
          dataIndex: 'depart_dictText',
          scopedSlots: { customRender: 'depart' },
          customRender: (text, row, index) => {
            if (index < this.excellentItems.length - 1) {
              return text
            }
            return {
              children: text,
              attrs: {
                colSpan: 0
              }
            }
          }
        },
        {
          title: '局机关领导干部',
          align: 'center',
          children: [
            {
              title: '人数',
              align: 'center',
              width: 70,
              dataIndex: 'bureauNum',
              scopedSlots: { customRender: 'bureauNum' }
            },
            {
              title: '优秀比例',
              align: 'center',
              width: 70,
              dataIndex: 'bureauRatio',
              scopedSlots: { customRender: 'bureauRatio' }
            },
            {
              title: '理论优秀名额数量',
              align: 'center',
              width: 80,
              dataIndex: 'bureauTheoryNum',
              scopedSlots: { customRender: 'bureauTheoryNum' }
            },
            {
              title: '实际分配优秀名额数量',
              align: 'center',
              dataIndex: 'bureauTrueNum',
              scopedSlots: { customRender: 'bureauTrueNum' }
            }
          ]
        },
        {
          title: '基层单位',
          align: 'center',
          children: [
            {
              title: '领导班子',
              align: 'center',
              children: [
                {
                  title: '领导班子数量',
                  align: 'center',
                  width: 90,
                  dataIndex: 'groupNum',
                  scopedSlots: { customRender: 'groupNum' }
                },
                {
                  title: '优秀比例',
                  align: 'center',
                  width: 70,
                  dataIndex: 'groupRatio',
                  scopedSlots: { customRender: 'groupRatio' }
                },
                {
                  title: '理论优秀名额数量',
                  align: 'center',
                  width: 80,
                  dataIndex: 'groupTheoryNum',
                  scopedSlots: { customRender: 'groupTheoryNum' }
                },
                {
                  title: '实际分配优秀名额数量',
                  align: 'center',
                  dataIndex: 'groupTrueNum',
                  scopedSlots: { customRender: 'groupTrueNum' }
                }
              ]
            },
            {
              title: '领导干部',
              align: 'center',
              dataIndex: 'groupNum',
              scopedSlots: { customRender: 'groupNum' },
              children: [
                {
                  title: '分局参公',
                  align: 'center',
                  width: 70,
                  dataIndex: 'basicNum',
                  scopedSlots: { customRender: 'basicNum' }
                },
                {
                  title: '优秀比例',
                  align: 'center',
                  width: 70,
                  dataIndex: 'basicRatio',
                  scopedSlots: { customRender: 'basicRatio' }
                },
                {
                  title: '理论优秀名额数量',
                  align: 'center',
                  width: 70,
                  dataIndex: 'basicTheoryNum',
                  scopedSlots: { customRender: 'basicTheoryNum' }
                },
                {
                  title: '实际分配优秀名额数量',
                  align: 'center',
                  dataIndex: 'basicTrueNum',
                  scopedSlots: { customRender: 'basicTrueNum' }
                },

                {
                  title: '事业单位',
                  align: 'center',
                  width: 70,
                  dataIndex: 'institutionNum',
                  scopedSlots: { customRender: 'institutionNum' }
                },
                {
                  title: '优秀比例',
                  align: 'center',
                  width: 70,
                  dataIndex: 'institutionRatio',
                  scopedSlots: { customRender: 'institutionRatio' }
                },
                {
                  title: '理论优秀名额数量',
                  align: 'center',
                  width: 70,
                  dataIndex: 'institutionTheoryNum',
                  scopedSlots: { customRender: 'institutionTheoryNum' }
                },
                {
                  title: '实际分配优秀名额数量',
                  align: 'center',
                  dataIndex: 'institutionTrueNum',
                  scopedSlots: { customRender: 'institutionTrueNum' }
                }
              ]
            }
          ]
        }
      ],
      queryType: 'person',
      url: {
        list: '/modules/assessAnnualSummary/list',
        delete: '/modules/assessAnnualSummary/delete',
        deleteBatch: '/modules/assessAnnualSummary/deleteBatch',
        exportXlsUrl: '/modules/assessAnnualSummary/exportXls',
        importExcelUrl: 'modules/assessAnnualSummary/importExcel'
      },
      btnGroup: false,
      dictOptions: {},
      superFieldList: [],
      confirmLoading: false,
      excellentManLoading: false,
      excellentMan: {},
      excellentItems: [],
      excellentManVisible: false,
      formDisable: false,
      bureauOver: false,
      groupOver: false,
      basicOver: false,
      institutionOver: false,
      message: '',
      exportRecommendPDFVisible: false,
      exportRecommendLeader: '',
      assessing: false

    }
  },
  created() {
    // this.$set(this.dictOptions, 'accountability', [{ text: '是', value: 'Y' }, { text: '否', value: 'N' }])
    // this.$set(this.dictOptions, 'vacation', [{ text: '是', value: 'Y' }, { text: '否', value: 'N' }])
    // this.$set(this.dictOptions, 'excellentDeputy', [{ text: '是', value: 'Y' }, { text: '否', value: 'N' }])
    // this.$set(this.dictOptions, 'thirdClass', [{ text: '是', value: 'Y' }, { text: '否', value: 'N' }])
    // this.$set(this.dictOptions, 'disciplineRecommend', [{ text: '是', value: 'Y' }, { text: '否', value: 'N' }])
    this.getSuperFieldList()
    this.queryParam.departType = 'bureau'
    getAssessingInfo('annual').then((res) => {
      if (res.success) {
        this.lastAssessYear = res.result.currentYear
      }
    })
    this.checkAssessing()

  },
  mounted() {
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    loadDataWithFilter(columns, value) {
      this.queryParam = {
        ...this.queryParam,
        [columns]: value
      }
      this.loadData(1)
    },

    checkAssessing() {
      checkAssessing('annual').then(res => {
        if (res.success) {
          this.assessing = res.result
        }
      })
    },

    toFixedNumber,
    beforeExportRecommendPDF() {
      this.$confirm({
        title: '提示',
        content: '导出纸质推荐表前请确认已经分配相关局领导的优秀名额并提交，如已分配优秀名额，点击“确认”继续。',
        onOk: () => {
          this.exportRecommendPDF()
        }
      })
    },

    exportRecommendPDF() {
      this.exportRecommendPDFVisible = true
    },
    submitExportRecommendPDF(type) {
      getAssessingInfo('annual').then((res) => {
        axios
          .post(
            '/modules/assessAnnualSummary/exportRecommendExcel?year=' + res.result.currentYear + '&type=' + type + '&leader=' + this.exportRecommendLeader,
            {},
            { responseType: 'blob' }
          )
          .then((res) => {
            if (res && res.headers) {
              let contentDisposition = res.headers['content-disposition']
              let fileName = contentDisposition ? contentDisposition.split('filename=')[1] : 'export.xlsx'
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
          })
      })
    },
    cancelExportRecommendPDF() {
      this.exportRecommendPDFVisible = false
      this.exportRecommendLeader = ''
    },

    openInput(record) {
      this.handleEdit(record, false)
    },
    openDetail(record) {
      this.handleEdit(record, true)
    },
    handleEdit: function(record, formDisable) {
      this.$refs.modalForm.edit(record, formDisable)
      this.$refs.modalForm.disableSubmit = false
    },
    initDictConfig() {
    },
    getSuperFieldList() {
      let fieldList = []
      fieldList.push({ type: 'string', value: 'currentYear', text: '年度', dictCode: 'assess_year' })
      fieldList.push({
        type: 'string',
        value: 'fillId',
        text: '考核名称',
        dictCode: 'assess_annual_fill,assess_name,id'
      })
      fieldList.push({ type: 'sel_depart', value: 'depart', text: '单位' })
      fieldList.push({ type: 'sel_user', value: 'person', text: '姓名' })
      fieldList.push({ type: 'switch', value: 'accountability', text: '是否问责' })
      fieldList.push({ type: 'switch', value: 'vacation', text: '是否休假' })
      fieldList.push({ type: 'int', value: 'evaluation', text: '评优建议', dictCode: 'evaluation_suggestion' })
      fieldList.push({ type: 'switch', value: 'excellentDeputy', text: '优秀副职' })
      fieldList.push({ type: 'int', value: 'departType', text: '处室类型（不展示，查询用）', dictCode: 'depart_type' })
      fieldList.push({ type: 'Text', value: 'negativeList', text: '负面清单', dictCode: '' })
      fieldList.push({ type: 'string', value: 'negativeProof', text: '证明材料', dictCode: '' })
      fieldList.push({ type: 'int', value: 'partyAssess', text: '党组织书记考核', dictCode: 'party_assess' })
      fieldList.push({ type: 'switch', value: 'thirdClass', text: '连续两年评为优秀' })
      fieldList.push({ type: 'switch', value: 'disciplineRecommend', text: '纪检组推荐' })
      fieldList.push({ type: 'string', value: 'dutyReport', text: '述职报告', dictCode: '' })
      this.superFieldList = fieldList
    },
    openDisciplineRecommend() {
      if (this.assessing) {
        this.$refs.inspectionModal.visible = true
        this.$refs.inspectionModal.getfun()
      } else {
        this.$error({
          title: '提示',
          content: (h) => <div style="color:red;">当前无正在进行的年度考核！</div>
        })
      }
    },

    tabChange(key) {
      if (key === '4') {
        this.queryType = 'group'
        this.queryParam.departType = ''
        this.ipagination.current = 1
      } else if (key === '3') {
        this.queryType = 'person'
        this.queryParam.departType = 'institution'
        this.ipagination.current = 1
      } else if (key === '2') {
        this.queryType = 'person'
        this.queryParam.departType = 'basic'
        this.ipagination.current = 1
      } else {
        this.queryType = 'person'
        this.queryParam.departType = 'bureau'
        this.ipagination.current = 1
      }
      this.loadData(1)
    },

    loadData(arg) {
      if (!this.url.list) {
        // this.$message.error('请设置url.list属性!')
        // this.$confirm({
        //   title: '消息提示',
        //   content: (h) => <div style="color:red;">请设置url.list属性</div>,
        //   onOk: () => {
        //   },
        //   onCancel: () => {
        //   }
        // })
        this.$error({
          title: '请设置url.list属性'
        })
        return
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      var params = this.getQueryParams() //查询条件
      this.loading = true
      getAction('/modules/assessAnnualSummary/list?summaryType=' + this.queryType, params)
        .then((res) => {
          if (res.success) {
            if (!res.result.records) {
              this.dataSource = []
              return
            }
            //update-begin---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
            this.dataSource = res.result.records || res.result

            if (res.result.total) {
              this.ipagination.total = res.result.total
            } else {
              this.ipagination.total = 0
            }
            //update-end---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
          } else {
            // this.$message.warning(res.message)
            // this.$confirm({
            //   title: '消息提示',

            //   content: (h) => <div style="color:red;">{res.message}</div>,

            //   onOk: () => {
            //   },

            //   onCancel: () => {
            //   }
            // })
            this.$error({
              title: res.message
            })
          }
        })
        .finally(() => {
          this.loading = false
        })
    },

    dataHeading() {
      if (this.excellentItems.length > 0) {
        let data = this.excellentItems
        let item = {
          bureauNum: 0,
          bureauTheoryNum: 0,
          bureauTrueNum: 0,
          groupNum: 0,
          groupTheoryNum: 0,
          groupTrueNum: 0,
          basicNum: 0,
          basicTheoryNum: 0,
          basicTrueNum: 0,
          institutionNum: 0,
          institutionTheoryNum: 0,
          institutionTrueNum: 0
        }
        item.leader_dictText = '合计'
        for (let i = 0; i < data.length; i++) {
          item.bureauNum += data[i].bureauNum
          item.bureauRatio = data[i].bureauRatio
          item.bureauTheoryNum += data[i].bureauTheoryNum
          item.bureauTrueNum += data[i].bureauTrueNum

          item.groupNum += data[i].groupNum
          item.groupRatio = data[i].groupRatio
          item.groupTheoryNum += data[i].groupTheoryNum
          item.groupTrueNum += data[i].groupTrueNum

          item.basicNum += data[i].basicNum
          item.basicRatio = data[i].basicRatio
          item.basicTheoryNum += data[i].basicTheoryNum
          item.basicTrueNum += data[i].basicTrueNum

          item.institutionNum += data[i].institutionNum
          item.institutionRatio = data[i].institutionRatio
          item.institutionTheoryNum += data[i].institutionTheoryNum
          item.institutionTrueNum += data[i].institutionTrueNum
        }
        this.excellentItems.push(item)
      }
    },

    openExcellentNum() {
      this.excellentManLoading = true
      getEnableRatioItems(this.lastAssessYear).then((res) => {
        if (res.success) {
          this.excellentItems = res.result.records

          this.dataHeading()

          this.message = res.message

          this.getOverTips()

        }

        this.excellentManLoading = false
      })

      this.$nextTick(() => {
        this.excellentManVisible = true
        this.$refs.excellentNum.toggleFullscreen()
      })
    },

    openExcellentDeputyModal() {
      if (this.assessing) {
        this.$refs.excellentDeputyNumModal.visible = true
      } else {
        this.$error({
          title: '提示',
          content: (h) => <div style="color:red;">当前无正在进行的年度考核！</div>
        })
      }
    },

    getOverTips() {
      let num1 = 0
      let trueNum1 = 0
      let num2 = 0
      let trueNum2 = 0
      let num3 = 0
      let trueNum3 = 0
      let num4 = 0
      let trueNum4 = 0
      for (let i = 0; i < this.excellentItems.length; i++) {
        num1 += this.excellentItems[i].bureauTheoryNum
        trueNum1 += this.excellentItems[i].bureauTrueNum
        num2 += this.excellentItems[i].groupTheoryNum
        trueNum2 += this.excellentItems[i].groupTrueNum
        num3 += this.excellentItems[i].basicTheoryNum
        trueNum3 += this.excellentItems[i].basicTrueNum
        num4 += this.excellentItems[i].institutionTheoryNum
        trueNum4 += this.excellentItems[i].institutionTrueNum
      }
      this.bureauOver = trueNum1 > num1
      this.groupOver = trueNum2 > num2
      this.basicOver = trueNum3 > num3
      this.institutionOver = trueNum4 > num4
    },

    cancelExcellentMan() {
      this.excellentManVisible = false
      this.basicOver = false
      this.bureauOver = false
      this.groupOver = false
      this.institutionOver = false
    },

    excellentNumChanged(type) {
      switch (type) {
        case 'bureau':
          let num1 = 0
          let trueNum1 = 0
          for (let i = 0; i < this.excellentItems.length - 1; i++) {
            num1 += this.excellentItems[i].bureauTheoryNum
            trueNum1 += this.excellentItems[i].bureauTrueNum
          }
          this.bureauOver = trueNum1 > num1
          this.excellentItems[this.excellentItems.length - 1].bureauTrueNum = trueNum1
          break
        case 'group':
          let num2 = 0
          let trueNum2 = 0
          for (let i = 0; i < this.excellentItems.length - 1; i++) {
            num2 += this.excellentItems[i].groupTheoryNum
            trueNum2 += this.excellentItems[i].groupTrueNum
          }
          this.groupOver = trueNum2 > num2
          this.excellentItems[this.excellentItems.length - 1].groupTrueNum = trueNum2
          break
        case 'basic':
          let num3 = 0
          let trueNum3 = 0
          for (let i = 0; i < this.excellentItems.length - 1; i++) {
            num3 += this.excellentItems[i].basicTheoryNum
            trueNum3 += this.excellentItems[i].basicTrueNum
          }
          this.basicOver = trueNum3 > num3
          this.excellentItems[this.excellentItems.length - 1].basicTrueNum = trueNum3
          break
        case 'institution':
          let num4 = 0
          let trueNum4 = 0
          for (let i = 0; i < this.excellentItems.length - 1; i++) {
            num4 += this.excellentItems[i].institutionTheoryNum
            trueNum4 += this.excellentItems[i].institutionTrueNum
          }
          this.institutionOver = trueNum4 > num4
          this.excellentItems[this.excellentItems.length - 1].institutionTrueNum = trueNum4
          break
        default:
          break
      }
    },

    submitExcellentMan() {
      updateExcellentNum(this.excellentItems).then((res) => {
        if (res.success) {
          // this.$message.success(res.message)
          // this.$confirm({
          //   title: '消息提示',

          //   content: (h) => <div style="color:red;">{res.message}</div>,

          //   onOk: () => {
          //   },

          //   onCancel: () => {
          //   }
          // })
          this.$success({
            title: res.message
          })
          this.excellentManVisible = false
        } else {
          // this.$message.warning(res.message)
          // this.$confirm({
          //   title: '消息提示',

          //   content: (h) => <div style="color:red;">{res.message}</div>,

          //   onOk: () => {
          //   },

          //   onCancel: () => {
          //   }
          // })
          this.$error({
            title: res.message
          })
        }
      })
    },

    openPartyOrganization() {
      if (this.assessing) {
        this.$refs.organizationModal.title = '党组织书记考核'
        this.$refs.organizationModal.visible = true
        this.$refs.organizationModal.getfun()
      } else {
        this.$error({
          title: '提示',
          content: (h) => <div style="color:red;">当前无正在进行的年度考核！</div>
        })
      }
    },
    openMeritModal() {
      if (this.assessing) {
        this.$refs.meritModal.title = '连续两年评为优秀录入'
        this.$refs.meritModal.visible = true
        this.$refs.meritModal.loadData()
      } else {
        this.$error({
          title: '提示',
          content: (h) => <div style="color:red;">当前无正在进行的年度考核！</div>
        })
      }
    },
    openLeaderRecommend() {
      this.$refs.leaderRecommendModal.title = '局领导推优情况'
      this.$refs.leaderRecommendModal.visible = true
      this.$refs.leaderRecommendModal.formDisable = !this.assessing
    },
    handleChange(value) {
    },
    openAdjustment() {
      if (this.assessing) {
        this.$refs.adjustment.title = '年度考核人员调整'
        this.$refs.adjustment.visible = true
      } else {
        this.$error({
          title: '提示',
          content: (h) => <div style="color:red;">当前无正在进行的年度考核！</div>
        })
      }
    },
    openNotExcellent() {
      this.$refs.notExcellent.title = '“三无”基层单位汇总'
      this.$refs.notExcellent.visible = true
    },

    // .post('/modules/assessAnnualSummary/calculateLeadershipStatisticsExl', {}, { responseType: 'blob' })
    opeExcellent() {
      // axios
      //   .get('/common/genera', {}, { responseType: 'blob' })
      //   .then((res) => {
      //     if (res && res.headers) {
      //       let contentDisposition = res.headers['content-disposition']
      //       let fileName = contentDisposition ? contentDisposition.split('filename=')[1] : '局领导推荐优秀情况汇总.docx'
      //       let realname = decodeURIComponent(fileName)
      //       let contentType = res.headers['content-type']
      //       let url = window.URL.createObjectURL(new Blob([res.data], { type: contentType }))
      //       let link = document.createElement('a')
      //       link.href = url
      //       link.setAttribute('download', realname) // 使用后端设置的文件名
      //       document.body.appendChild(link)
      //       link.click()
      //       this.$emit('over')
      //       document.body.removeChild(link)
      //     } else {
      //       console.error('Response headers are undefined')
      //     }
      //   })
      //   .catch((error) => {
      //     console.error('Error downloading file:', error)
      //   })

      getAction('/common/genera').then(res => {
        if (res.success) {
          this.downloadFile(res.result)
        }
      })
    },
    downloadRes() {
      getAction('/common/downRes').then(res => {
        if (res.success) {
          this.downloadFile(res.result)
        }
      })
    },
    downloadList() {
      getAction('/common/downloadList').then(res => {
        if (res.success) {
          this.downloadFile(res.result)
        }
      })
    },
    downloadAssess() {
      this.exportLoading = true
      let year = this.exportResYear
      if (year == null || year === '' || year === undefined) {
        year = 0
      }
      axios
        .post(
          '/modules/assessAnnualSummary/downLoadAnnualRes?year=' + year,
          {},
          { responseType: 'blob' }
        )
        .then((res) => {
          if (res && res.headers) {
            let contentDisposition = res.headers['content-disposition']
            let fileName = contentDisposition ? contentDisposition.split('filename=')[1] : 'export.xlsx'
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
            this.exportLoading = false
            this.exportResVisible = false
          } else {
            console.error('Response headers are undefined')
            this.exportLoading = false
            this.exportResVisible = false
          }
        })
        .catch((error) => {
          console.error('Error downloading file:', error)
        })
    },

    openExport() {
      this.$refs.exportModal.initData()
      this.$refs.exportModal.type = 'annual'
      this.$refs.exportModal.visible = true
    },

    getExcellentNumExcel() {
      getAssessingInfo('annual').then((res) => {
        axios
          .post(
            '/modules/annual/assessAnnualExcellentNum/exportExcel?year=' + res.result.currentYear,
            {},
            { responseType: 'blob' }
          )
          .then((res) => {
            if (res && res.headers) {
              let contentDisposition = res.headers['content-disposition']
              let fileName = contentDisposition ? contentDisposition.split('filename=')[1] : 'export.xlsx'
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
          })
      })
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
