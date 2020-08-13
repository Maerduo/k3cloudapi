const axios = require('axios')

const config = require('../config/dev')

async function login (username = 'Administrator') {
  const { accid } = config
  const payload = {
    acctid: accid,
    username: '张业生',
    password: 'shuguang-1234',
    lcid: 2052
  }
  const request = axios.create({
    baseURL: config.baseURL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const { headers, data } = await request.post(`/k3cloud/Kingdee.BOS.WebApi.ServicesStub.AuthService.ValidateUser.common.kdsvc`, payload)
  console.log(data)
  const cookie = headers['set-cookie']
  return cookie.join(';')
}

login().then(res => {
  console.log(res)
}).catch(err => {
  console.log(err)
})
