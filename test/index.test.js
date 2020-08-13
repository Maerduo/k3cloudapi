const K3cloudapi = require('../index')
const config = require('../config/dev')

const api = new K3cloudapi(config)

api.auth('张业生').then(async ({ cookie, data }) => {
  const userId = data.Context.UserId

  console.log(userId)

  const operations = await api.listUrlEncode({
    cookie,
    formId: 'PJQF_WorkflowOperationAPI',
    fieldKeys: ['FID', 'FName', 'FNumber', 'F_PJQF_Disposition', 'F_PJQF_Result', 'F_PJQF_Status'],
    filterString: `FID = '279442'`
  })
  console.log(operations)

}).catch(e => console.log(e))
