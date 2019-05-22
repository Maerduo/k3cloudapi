const config = require(`${process.cwd()}/config`)
const request = require('../libs/request')
const keysMapping = require('../utils/keysMapping')

module.exports = {
  async list ({ cookie, formId, fieldKeys }) {
    if (!formId || !fieldKeys.length || !cookie) throw new Error('invalid parameters')
    const { listPath } = config.apis
    const FormId = formId
    const FieldKeys = fieldKeys.join(',')
    const payload = { FormId, data: { FormId, FieldKeys } }
    console.log(`service - kingdee list data: ${JSON.stringify(payload)}`)
    const resp = await request.post(listPath, payload, { headers: { cookie } })
    const results = keysMapping(fieldKeys, resp.data)
    return results
  }
}
