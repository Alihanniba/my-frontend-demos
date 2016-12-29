module.exports = {
    SUCCESS_CODE: 200,
    ERROR_VALIDATE: 301,               // 请重新认证
    ERROR_PARAMETERS: 302,             // 缺少参数
    ERROR_PARAMETERS_FAILS: 303,       // 参数错误
    ERROR_MESSAGE_INFO: 309,           // 查询信息不存在
    ERROR_NOT_PERMISSION: 402,         // 权限不足
    ERROR_REQUEST_FORBIDDEN: 403,      // 请求被拒绝,请求类型错误
	ERROR_REQUEST_FAILS: 500           // 请求失败
}