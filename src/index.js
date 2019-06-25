const axios = require('axios')
const qs = require('qs')
const keysMapping = require('../utils/keysMapping')
const validOptions = require('../utils/validOptions')

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
    if (!username) console.log('invalid username.')
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
      return {
        cookie: cookie.join(';'),
        data
      }
    }
  }

  async get ({ cookie, formId, data }) {
    const config = this.config
    if (!formId || !cookie) throw new Error(`invalid parameters, cookie: ${cookie}; formId: ${formId};`)
    const { getPath } = config.apis
    const FormId = formId
    const payload = { formid: FormId, data }
    console.log(`service - kingdee get data: ${JSON.stringify(payload)}`)
    const resp = await this.request.post(getPath, payload, { headers: { cookie } })
    const results = resp.data
    return results.Result.Result
  }

  async list ({ cookie, formId, fieldKeys, limit, skip, filterString, orderString }) {
    const config = this.config
    if (!formId || !fieldKeys.length || !cookie) throw new Error('invalid parameters')
    const { listPath } = config.apis
    const FormId = formId
    const FieldKeys = fieldKeys.join(',')
    const payload = {
      FormId,
      data: {
        FormId,
        FieldKeys,
        Limit: limit || 0,
        StartRow: skip || 0,
        OrderString: orderString || '',
        FilterString: filterString || ''
      }
    }
    console.log(`service - kingdee list data: ${JSON.stringify(payload)}`)
    const resp = await this.request.post(listPath, payload, { headers: { cookie } })
    const results = keysMapping(fieldKeys, resp.data)
    return results
  }

  async audit ({ cookie, formId, data }) {
    const config = this.config
    if (!formId || !data || !cookie) throw new Error('invalid parameters')
    const { auditPath } = config.apis
    const FormId = formId
    const payload = {
      FormId,
      data
    }
    console.log(`service - kingdee audit data: ${JSON.stringify(payload)}`)
    const result = await this.request.post(auditPath, payload, { headers: { cookie } })
    return result
  }

  /**
   * 审核通过
   */
  async approval (options, handle = 'WorkflowSubmitHandle') {
    const isValid = validOptions(options, [ 'isApproval' ])
    if (!isValid) throw new Error(`invalid parameters: ${JSON.stringify(options)}`)
    const { cookie, formId = '', pkValue = '', receivername = '', disposition = '', isApproval = true, actionName = '' } = options
    const config = this.config
    const { approvalPath } = config.apis
    const now = Date.now()
    const parameters = [
      'PJQF_WorkflowOperationAPI',
      handle,
      {
        Model: {
          'F_PJQF_FormId': formId,
          'F_PJQF_PKValue': pkValue,
          'F_PJQF_Receivername': receivername,
          'F_PJQF_Disposition': disposition,
          'F_PJQF_IsApprovalFlow': isApproval,
          'F_PJQF_ActionName': actionName,
          'F_PJQF_TimeStamp': now
        }
      }
    ]
    const dataObj = {
      format: 1,
      useragent: 'ApiClient',
      rid: -1760808050,
      parameters: JSON.stringify(parameters),
      timestamp: now,
      v: '1.0'
    }
    const payload = qs.stringify(dataObj)
    console.log(`service - kingdee approval data: ${JSON.stringify(payload)}`)
    const result = await this.request.post(approvalPath, payload, { headers: { cookie, 'Content-Type': 'application/x-www-form-urlencoded' } })
    return result
  }

  /**
   * 驳回重审
   */
  async reject (options) {
    const rejectOptions = {
      ...options,
      ...{
        isApproval: true,
        actionName: '驳回重审'
      }
    }
    const handle = 'WorkflowRejectHandle'
    return this.approval(rejectOptions, handle)
  }

  /**
   * 加签
   */
  async addSign (options) {
    const isValid = validOptions(options)
    if (!isValid) throw new Error(`invalid parameters: ${JSON.stringify(options)}`)
    const {
      cookie,
      formId = '',
      pkValue = '',
      receivername = '',
      disposition = '',
      addsignType,
      receiverIds = []
    } = options
    const config = this.config
    const { addSignPath } = config.apis
    const now = Date.now()
    const parameters = [
      'PJQF_WorkflowOperationAPI',
      'WorkflowAddsignHandle',
      {
        Model: {
          'F_PJQF_FormId': formId,
          'F_PJQF_PKValue': pkValue,
          'F_PJQF_Receivername': receivername,
          'F_PJQF_Disposition': disposition,
          'F_PJQF_AddsignType': addsignType, // 0: 前加签 1: 后加签
          'F_PJQF_ReceiverIds': receiverIds.join(','),
          'F_PJQF_TimeStamp': Date.now()
        }
      }
    ]
    const dataObj = {
      format: 1,
      useragent: 'ApiClient',
      rid: -1760808050,
      parameters: JSON.stringify(parameters),
      timestamp: now,
      v: '1.0'
    }
    const payload = qs.stringify(dataObj)
    console.log(`service - kingdee addSign data: ${JSON.stringify(payload)}`)
    const result = await this.request.post(addSignPath, payload, { headers: { cookie, 'Content-Type': 'application/x-www-form-urlencoded' } })
    return result
  }

  /**
   * 转发
   */
  async forward (options) {
    const isValid = validOptions(options)
    if (!isValid) throw new Error(`invalid parameters: ${JSON.stringify(options)}`)
    const { cookie, formId = '', pkValue = '', receivername = '', disposition = '', receiverIds = [] } = options
    const config = this.config
    const { forwardPath } = config.apis
    const now = Date.now()
    const parameters = [
      'PJQF_WorkflowOperationAPI',
      'WorkflowForwardHandle',
      {
        Model: {
          'F_PJQF_FormId': formId,
          'F_PJQF_PKValue': pkValue,
          'F_PJQF_Receivername': receivername,
          'F_PJQF_Disposition': disposition,
          'F_PJQF_ReceiverIds': receiverIds.join(','),
          'F_PJQF_TimeStamp': Date.now()
        }
      }
    ]
    const dataObj = {
      format: 1,
      useragent: 'ApiClient',
      rid: -1760808050,
      parameters: JSON.stringify(parameters),
      timestamp: now,
      v: '1.0'
    }
    const payload = qs.stringify(dataObj)
    console.log(`service - kingdee forward data: ${JSON.stringify(payload)}`)
    const result = await this.request.post(forwardPath, payload, { headers: { cookie, 'Content-Type': 'application/x-www-form-urlencoded' } })
    return result
  }

  /**
   * 查看附件列表
   */
  async listAttachment (options) {
    const isValid = validOptions(options)
    if (!isValid) throw new Error(`invalid parameters: ${JSON.stringify(options)}`)
    const { cookie, formId, pkValue } = options
    const config = this.config
    const { attachmentPath } = config.apis
    const now = Date.now()
    const parameters = [
      'PJQF_WorkflowOperationAPI',
      'AttachmentCacheHandle',
      {
        Model: {
          'F_PJQF_FormId': formId,
          'F_PJQF_PKValue': pkValue,
          'F_PJQF_TimeStamp': Date.now()
        }
      }
    ]
    const dataObj = {
      format: 1,
      useragent: 'ApiClient',
      rid: -1760808050,
      parameters: JSON.stringify(parameters),
      timestamp: now,
      v: '1.0'
    }
    const payload = qs.stringify(dataObj)
    console.log(`service - kingdee listAttachment data: ${JSON.stringify(payload)}`)
    const result = await this.request.post(attachmentPath, payload, { headers: { cookie, 'Content-Type': 'application/x-www-form-urlencoded' } })
    return result
  }

  /**
   * 查看审批流程
   */
  async getApprovalProcess (options) {
    const isValid = validOptions(options)
    if (!isValid) throw new Error(`invalid parameters: ${JSON.stringify(options)}`)
    const { cookie, formId, fieldKeys, limit, skip, filterString, orderString } = options
    const config = this.config
    const { listPath } = config.apis
    const FormId = formId
    const FieldKeys = fieldKeys.join(',')
    const now = Date.now()
    const parameters = [
      {
        FormId,
        FieldKeys,
        Limit: limit || 0,
        StartRow: skip || 0,
        OrderString: orderString || '',
        FilterString: filterString || ''
      }
    ]
    const dataObj = {
      format: 1,
      useragent: 'ApiClient',
      rid: -1760808050,
      parameters: JSON.stringify(parameters),
      timestamp: now,
      v: '1.0'
    }
    const payload = qs.stringify(dataObj)
    console.log(`service - kingdee getApprovalProcess data: ${JSON.stringify(payload)}`)
    const result = await this.request.post(listPath, payload, { headers: { cookie, 'Content-Type': 'application/x-www-form-urlencoded' } })
    return result
  }
}
