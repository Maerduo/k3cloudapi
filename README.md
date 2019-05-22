# 金蝶星空云webapi nodejs SDK

kingdee webapi nodejs sdk.

```js
// 配置信息
// ./config/dev.js
module.exports = {
  baseURL: 'http://erp.kingdee.com',
  accid: 'it dc id', // 数据中心
  lcid: 2052,
  auth: {            // 第三方系统认证
    appid: 'appid',
    appname: 'appid',
    appsecret: 'appsecret'
  },
  apis: {           // webapi
    authPath: '/K3Cloud/Kingdee.BOS.WebApi.ServicesStub.AuthService.LoginByAppSecret.common.kdsvc',
    listPath: '/K3Cloud/Kingdee.BOS.WebApi.ServicesStub.DynamicFormService.ExecuteBillQuery.common.kdsvc',
    getPath: '/K3Cloud/Kingdee.BOS.WebApi.ServicesStub.DynamicFormService.View.common.kdsvc'
  }
}
```