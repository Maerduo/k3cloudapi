const K3cloudapi = require('../index')

const config = require('../config')

const api = new K3cloudapi(config)

api.auth().then(cookie => {
  const formId = 'BD_Empinfo'
  const fieldKeys = ['FID', 'FName']
  api.list({ cookie, formId, fieldKeys }).then(r => console.log(r)).catch(e => console.log(e))
  api.get({ cookie, formId, id: 143494 }).then(r => console.log(r)).catch(e => console.log(e))
}).catch(e => console.log(e))
