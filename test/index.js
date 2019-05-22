const auth = require('../src/auth')
const list = require('../src/list')
const get = require('../src/get')

auth().then(cookie => {
  const formId = 'BD_Empinfo'
  const fieldKeys = ['FID', 'FName']
  list({ cookie, formId, fieldKeys }).then(r => console.log(r)).catch(e => console.log(e))
  get({ cookie, formId, id: 143494 }).then(r => console.log(r)).catch(e => console.log(e))
}).catch(e => console.log(e))
