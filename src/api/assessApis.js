import { deleteAction, getAction, postAction, putAction } from '@/api/manage'

// const addRole = (params)=>postAction("/sys/role/add",params);
// const editRole = (params)=>putAction("/sys/role/edit",params);
// const checkRoleCode = (params)=>getAction("/sys/role/checkRoleCode",params);
// const queryall = (params)=>getAction("/sys/role/queryall",params);

const getDepartContact = (params) => getAction('assess/assessBusinessDepartmentContact/departContact', params)
const submitBusinessFill = (params) => postAction('/modules/businessAssessDepartFill/init', params)
const saveBusinessFill = (params) => putAction('/modules/businessAssessDepartFill/save', params)
const passTheAudit = (assessId, name) =>
  putAction('/modules/businessAssessDepartFill/passAudit?assessId=' + assessId + '&name=' + name)
const passTheReport = (assessId, name) =>
  putAction('/modules/report/assessReportFill/passAudit?assessId=' + assessId + '&name=' + name)
const passTheAnnual = (assessId, name) =>
  putAction('/modules/annual/assessAnnualFill/passAudit?assessId=' + assessId + '&name=' + name)
const rejectedTheAudit = (params) => putAction('/common/rejectedAudit', params)
const saveAndPassAudit = (params) => putAction('/modules/businessAssessDepartFill/saveAndPass', params)
const getGradeDetails = (params) => getAction('/modules/businessAssessDepartFill/getFillItem?gradeId=' + params, params)
const getCommendByDepartAndYear = (dep, year) =>
  getAction('/modules/assessBusinessCommend/getByDepartAndYear?departId=' + dep + '&year=' + year)
const getDenounceByDepartAndYear = (dep, year) =>
  getAction('/modules/assessBusinessDenounce/getByDepartAndYear?departId=' + dep + '&year=' + year)
const getProportionCount = (year, type) => getAction('/modules/assessBusinessGrade/proportion?year=' + year + '&type=' + type)

const getCurrentUserDepart = () => getAction('/modules/annual/assessAnnualAccountability/getCurrentDepart')
const submitAnnualFill = (params) => postAction('/modules/annual/assessAnnualFill/init', params)
const submitReportInit = (params) => postAction('/modules/report/assessReportFill/init', params)
const fillAnnualFill = (params) => postAction('/modules/annual/assessAnnualFill/edit', params)
const getAnnualArrange = (params) => getAction('/modules/annual/assessAnnualFill/getArrange?fillId=' + params)
const getDutyReport = (params) => getAction('/modules/annual/assessAnnualFill/getDuty?fillId=' + params)
const getAccountabilityByLeaderIds = (ids, year) =>
  getAction('/modules/annual/assessAnnualAccountability/queryByLeaderIds?leader=' + ids + '&year=' + year)
const getVacationByLeaderIds = (ids, year) =>
  getAction('/modules/assessAnnualVacation/queryByLeaderIds?leader=' + ids + '&year=' + year)
const getDepartLeaderByDepartId = (id) => getAction('/common/queryDepartLeaders?departId=' + id)
const getRegularGradeByUserIds = (ids, year) =>
  getAction('/modules/annual/assessAnnualFill/getRegularGrade?userIds=' + ids + '&year=' + year)
const getLeadersRegularGrade = (departId, year) =>
  getAction('/common/queryLeadersRegularGrade?departId=' + departId + '&year=' + year)
const getLeaderRegularGrade = (hashId, year) =>
  getAction('/common/queryLeaderRegularGrade?hashId=' + hashId + '&year=' + year)
const saveAnnualFill = (params) => postAction('/modules/annual/assessAnnualFill/save', params)
const editAnnualSummaryItem = (params) => postAction('/modules/annual/assessAnnualFill/save', params)
const getLastAssessYear = () => getAction('/common/lastYear')
const submitInitDemocratic = (params) => postAction('/modules/annual/democraticSummary/init', params)
const submitInitReportDemocratic = (params) => postAction('/modules/report/reportDemocratic/init', params)
const getDemocraticOptions = (params) => getAction('/modules/democraticConfig/getOptionsByType?type=' + params)
const getDemocraticItems = (params) => getAction('/modules/democraticConfig/getItemByType?type=' + params)
const submitDemocratic = (params) => postAction('/modules/annual/democraticEvaluation/submit', params)
const getBusinessGradeByDepartId = (departId, year) =>
  getAction('/modules/assessBusinessGrade/getByDepartIdAndYear?departId=' + departId + '&year=' + year)
const getAnnualDemocraticGradeByAnnualId = (annualId) =>
  getAction('/modules/annual/democraticSummary/getByAnnualId?annualId=' + annualId)
const getDictItems = (code) => getAction('/common/getDictItemsByCode?code=' + code)
const getAnnualDictItems = (departId, type) =>
  getAction('/common/getAnnualDictItemsByDepart?departId=' + departId + '&type=' + type)
const getBureauLeaders = () => getAction('/modules/annual/assessAnnualExcellentRatio/getInitLeaderData')
const getRatioItems = (id) =>
  getAction('/modules/annual/assessAnnualExcellentRatio/queryAssessAnnualRatioItemByMainId?id=' + id)
const getEnableRatioConfig = () => getAction('/modules/annual/assessAnnualExcellentRatio/getConfig')
const getEnableRatioItems = (year) => getAction('/modules/annual/assessAnnualExcellentNum/getExcellentNum?year=' + year)
const updateExcellentNum = (params) => putAction('/modules/annual/assessAnnualExcellentNum/updateExcellentNum', params)
const getAccountabilityEndDate = (type, startDate) =>
  getAction('/annual/period/config/getEndDate?type=' + type + '&startDate=' + startDate)
const getReportArrange = (id) => getAction('/modules/report/assessReportArrange/queryByFillId?fillId=' + id)
const getReportNewLeaders = (id) => getAction('/modules/report/assessReportNewLeader/getNewLeaders?fillId=' + id)
const getReportAssessObj = (id) => getAction('/modules/report/assessReportObjectInfo/getAssessObj?fillId=' + id)
const submitReportFill = (params, pass) =>
  postAction('/modules/report/assessReportFill/submitFill?pass=' + pass, params)
const saveReportFill = (params) => postAction('/modules/report/assessReportFill/saveFill', params)
// 季度
const getAssessingInfo = (assess) => getAction('/common/getAssessingInfo?assess=' + assess)
const getBusinessNonAssessDepart = (year) => getAction('/modules/assessBusinessGrade/getNonAssess?year=' + year)
const queryDepartTreeListByType = (types) => getAction('/common/queryTreeList?types=' + types)
const submitMustAssess = (params) => postAction('/modules/businessAssessDepartFill/addMustAssessItem', params)
const getAnnualSummaryList = (params) => getAction('/modules/assessAnnualSummary/getByFillId?fillId=' + params)
const searchUser = (value, depart) => getAction('/common/getUserToSelected?value=' + value + '&depart=' + depart)
const getGroupSummaryByFillId = (value) => getAction('/modules/assessAnnualSummary/getGroupSummary?fillId=' + value)
const getAnonymousAccount = (value) => getAction('/common/getAnonymousAccountByAssess?assess=' + value)
const getCurrentUserRoles = () => getAction('/common/currentUserRoles')
const getDepartTypeById = (id) => getAction('/common/getDepartType?departId=' + id)

const stopAssess = (assess) => deleteAction('/common/stop?assess=' + assess)
const revocationAssess = (assess) => deleteAction('/common/revocation?assess=' + assess)
const stopDem = (assess) => deleteAction('/common/stopDem?assess=' + assess)

const checkAnnualFill = () => getAction('/modules/annual/assessAnnualFill/checkProgress')
const getFilterData = (type) => getAction('/common/getFilterData?type=' + type)
const checkAssessing = (assess) => getAction('/common/checkAssessing?assess=' + assess)

/**
 * 慎用！！！此方法将直接物理删除当前登录用户！！！
 */
const deleteCurrentUser = () => deleteAction('/common/deleteCurrentUser')

export {
  getDepartContact,
  submitBusinessFill,
  saveBusinessFill,
  passTheAudit,
  passTheReport,
  rejectedTheAudit,
  saveAndPassAudit,
  getGradeDetails,
  getCommendByDepartAndYear,
  getDenounceByDepartAndYear,
  getProportionCount,
  getCurrentUserDepart,
  submitAnnualFill,
  fillAnnualFill,
  getDutyReport,
  getAccountabilityByLeaderIds,
  getVacationByLeaderIds,
  getDepartLeaderByDepartId,
  getRegularGradeByUserIds,
  getLeadersRegularGrade,
  getLeaderRegularGrade,
  saveAnnualFill,
  getLastAssessYear,
  submitInitDemocratic,
  getDemocraticOptions,
  getDemocraticItems,
  submitDemocratic,
  getBusinessGradeByDepartId,
  getAnnualDemocraticGradeByAnnualId,
  getDictItems,
  getBureauLeaders,
  getRatioItems,
  getEnableRatioConfig,
  getEnableRatioItems,
  updateExcellentNum,
  getAnnualDictItems,
  getAccountabilityEndDate,
  submitReportInit,
  getReportArrange,
  submitReportFill,
  getReportNewLeaders,
  getReportAssessObj,
  saveReportFill,
  submitInitReportDemocratic,
  getAssessingInfo,
  getBusinessNonAssessDepart,
  queryDepartTreeListByType,
  submitMustAssess,
  getAnnualSummaryList,
  getAnnualArrange,
  searchUser,
  getGroupSummaryByFillId,
  getAnonymousAccount,
  getCurrentUserRoles,
  getDepartTypeById,
  passTheAnnual,
  stopAssess,
  stopDem,
  deleteCurrentUser,
  checkAnnualFill,
  getFilterData,
  revocationAssess,
  checkAssessing
}
