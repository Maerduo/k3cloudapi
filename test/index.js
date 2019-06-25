const K3cloudapi = require('../index')

const config = require('../config/dev')

const api = new K3cloudapi(config)

api.auth('王昌鑫').then(async ({ cookie, data }) => {
  const userId = data.Context.UserId
  console.log(cookie, userId)
  const formId = 'WF_AssignmentBill'
  const fieldKeys = ['FObjectTypeId', 'FBillNumber', 'FStatus', 'FASSIGNID', 'FSENDERID', 'FORIGINATORID', 'FTitle']
  const filterUserString = `FReceiverId='${userId}'`
  const todoList = await api.list({ cookie, formId, fieldKeys, filterString: filterUserString })
  console.log(todoList)
  // api.get({ cookie, formId, id: 143494 }).then(r => console.log(r)).catch(e => console.log(e))
  // const options = {
  //   cookie,
  //   formId: 'PJQF_Test',
  //   pkVakue: '21231231',
  //   receivername: '王昌鑫',
  //   disposition: '同意了',
  //   receiverIds: [ 160140 ]
  // }
  // api.forward(options).then(res => {
  //   console.log(res.data)
  // }).catch(err => {
  //   console.log(err.response.status, err.response.data)
  // })

  const workFlow = await api.getApprovalProcess({ cookie, formId: 'WF_AssignmentBill', fieldKeys: ['FObjectTypeId'] })
  console.log(workFlow.data)

  // const attachments = await api.listAttachment({ cookie, formId: 'PJQF_Test', pkValue: '21231231' })
  // console.log(attachments.data)
}).catch(e => console.log(e))
