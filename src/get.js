const config = require(`${process.cwd()}/config`)
const request = require('../libs/request')

async function get ({ cookie, formId, id }) {
  if (!formId || !id || !cookie) throw new Error('invalid parameters')
  const { getPath } = config.apis
  const FormId = formId
  const Id = id
  const payload = { formid: FormId, data: { Id } }
  console.log(`service - kingdee get data: ${JSON.stringify(payload)}`)
  const resp = await request.post(getPath, payload, { headers: { cookie } })
  const results = resp.data
  return results.Result.Result
}

module.exports = get
