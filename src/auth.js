const config = ''
const request = require('../libs/request')
// const sha1 = require('sha1')

async function auth (username = 'Administrator') {
  const { accid, lcid } = config
  const { appid, appsecret } = config.auth
  const parameters = [ accid, username, appid, appsecret, lcid ]
  const { authPath } = config.apis
  const payload = { parameters }

  const { headers, data } = await request.post(authPath, payload)
  const { IsSuccessByAPI } = data
  if (!IsSuccessByAPI) return null
  if (IsSuccessByAPI) {
    const cookie = headers['set-cookie'] || []
    return cookie.join(';')
  }
}

// async function login (username = 'Administrator') {
//   const { accid, users } = config
//   const payload = {
//     acctid: accid,
//     username: users[0].username,
//     password: users[0].password,
//     lcid: 2052
//   }
//   const { headers } = await request.post(`/k3cloud/Kingdee.BOS.WebApi.ServicesStub.AuthService.ValidateUser.common.kdsvc`, payload)
//   const cookie = headers['set-cookie']
//   return cookie.join(';')
// }

// async function getRedirectUrl (username = 'Administrator') {
//   const { accid, api, lcid } = config
//   const { appid, appsecret } = config.auth
//   const timestamp = Date.now().toString().slice(0, 10)
//   const parameters = [ accid, username, appid, appsecret, timestamp ]
//   const strParams = parameters.sort().reduce((p, n) => (p + n))
//   const sgin = sha1(strParams)

//   const ud = encodeURIComponent(`|${accid}|${username}|${appid}|${sgin}|${timestamp}|${String(lcid)}`)
//   return `${api}/K3Cloud/html5/index.aspx?ud=${ud}`
// }

module.exports = auth
