const axios = require('axios')
const keysMapping = require('../utils/keysMapping')

module.exports = class K3cloud {
  constructor (config) {
    this.config = config
    this.request = axios.create({
      baseURL: config.baseURL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  async auth (username = 'Administrator') {
    const config = this.config
    const { accid, lcid } = config
    const { appid, appsecret } = config.auth
    const parameters = [ accid, username, appid, appsecret, lcid ]
    const { authPath } = config.apis
    const payload = { parameters }

    const { headers, data } = await this.request.post(authPath, payload)
    const { IsSuccessByAPI } = data
    if (!IsSuccessByAPI) return null
    if (IsSuccessByAPI) {
      const cookie = headers['set-cookie'] || []
      return cookie.join(';')
    }
  }

  async get ({ cookie, formId, id }) {
    const config = this.config
    if (!formId || !id || !cookie) throw new Error('invalid parameters')
    const { getPath } = config.apis
    const FormId = formId
    const Id = id
    const payload = { formid: FormId, data: { Id } }
    console.log(`service - kingdee get data: ${JSON.stringify(payload)}`)
    const resp = await this.request.post(getPath, payload, { headers: { cookie } })
    const results = resp.data
    return results.Result.Result
  }

  async list ({ cookie, formId, fieldKeys }) {
    const config = this.config
    if (!formId || !fieldKeys.length || !cookie) throw new Error('invalid parameters')
    const { listPath } = config.apis
    const FormId = formId
    const FieldKeys = fieldKeys.join(',')
    const payload = { FormId, data: { FormId, FieldKeys } }
    console.log(`service - kingdee list data: ${JSON.stringify(payload)}`)
    const resp = await this.request.post(listPath, payload, { headers: { cookie } })
    const results = keysMapping(fieldKeys, resp.data)
    return results
  }
}
