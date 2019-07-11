const K3cloudapi = require('../index')

const config = require('../config/dev')
const sha1 = require('sha1')

const api = new K3cloudapi(config)

api.auth('王昌鑫').then(async ({ cookie, data }) => {
  const userId = data.Context.UserId
  console.log(cookie, userId)
  const formId = 'WF_AssignmentBill'
  const fieldKeys = ['FObjectTypeId', 'FBillNumber', 'FStatus', 'FASSIGNID', 'FSENDERID', 'FORIGINATORID', 'FTitle']
  const filterUserString = `FReceiverId='${userId}'`
  // const todoList = await api.list({ cookie, formId, fieldKeys, filterString: filterUserString })
  // console.log(todoList)
  // api.get({ cookie, formId, id: 143494 }).then(r => console.log(r)).catch(e => console.log(e))

  const options = {
    cookie,
    formId: 'PJQF_Test',
    pkValue: '21231231',
    receivername: '王昌鑫',
    disposition: '同意了'
  }
  // api.approval(options).then(res => {
  //   console.log(res.data)
  // }).catch(err => {
  //   console.log(err.response.status, err.response.data)
  // })

  const operations = await api.listUrlEncode({
    cookie,
    formId: 'PJQF_WorkflowOperationAPI',
    fieldKeys: ['FID', 'FName', 'FNumber', 'F_PJQF_Disposition', 'F_PJQF_Result', 'F_PJQF_Status'],
    filterString: `FID = '198027'`
  })
  console.log(operations)

  // const workFlow = await api.listUrlEncode({
  //   cookie,
  //   formId: 'PJQF_WorkFlowRouteAPI',
  //   fieldKeys: ['FID', 'FActName', 'FTitle', 'FStatus', 'FReceiverNames', 'FObjectTypeId', 'FKeyValue', 'FASSIGNID'],
  //   // filterString: `FObjectTypeId = 'PJQF_ProjectAndPlanChange'`
  //   filterString: `FASSIGNID='5c3c9bd2af0299'`
  // })
  // console.log(workFlow)

  // 100045
  // const attachments = await api.listAttachment({ cookie, formId: 'PJQF_Test', pkValue: 100045 })
  // console.log(attachments)
}).catch(e => console.log(e))

function getRedirectUrl (username = 'Administrator') { // 
  const { accid, baseURL, lcid } = config
  const { appid, appsecret } = config.auth
  const timestamp = Date.now().toString().slice(0, 10)
  const parameters = [ accid, username, appid, appsecret, timestamp ]
  const strParams = parameters.sort().reduce((p, n) => (p + n))
  const sgin = sha1(strParams)

  const ud = encodeURIComponent(`|${accid}|${username}|${appid}|${sgin}|${timestamp}|${String(lcid)}`)
  return `${baseURL}/K3Cloud/html5/index.aspx?ud=${ud}`
}

const url = getRedirectUrl()
console.log(url)
