const K3cloudapi = require('../index')

const config = require('../config/dev')
const sha1 = require('sha1')

// const api = new K3cloudapi(config)

// api.auth().then(cookie => {
//   const formId = 'BD_Empinfo'
//   const fieldKeys = ['FID', 'FName']
//   api.list({ cookie, formId, fieldKeys }).then(r => console.log(r)).catch(e => console.log(e))
//   api.get({ cookie, formId, id: 143494 }).then(r => console.log(r)).catch(e => console.log(e))
// }).catch(e => console.log(e))

function getRedirectUrl (username = 'Administrator') {
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
