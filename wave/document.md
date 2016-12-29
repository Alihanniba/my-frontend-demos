## Soundtooth SDK API Document

#### Demo

- Uri: test
- Parameters:
	- uid: 用户的id
- Reponse:
	
```json
{
	"success": false,
	"errMsg": "缺少参数"
}
```

### Error code

- 200: 接口请求成功
- 301: 接口需要重新认证
- 302: 接口缺少参数
- 303: 不存在该条push记录
- 304: 无法找到用户

### For SDK

##### SDK信息格式

```json
{
	"alert": "Hello",
	"badage": 1,
	"sound": "default",
	"ST": "json_encode string"
}
```

- alert: 描述信息
- badage: 通知数量
- sound: default(默认值)
- ST: 一个用json编码的字符串(格式如下规定)

	```json
{
		"content": "Hello World",
		"contentType": 1,
		"pushID": 300,
		"pushEnvType": 2
}
```

	- content: 详细内容
	- contentType: 内容格式
		- 1: Other
		- 2: Website
	- pushEnvType
		- 1: Other
		- 2: Develope Environment
		- 3: Production Environment
	- pushID: 用于回掉确认push是否成功

##### 1. 认证SDK

- Uri: http://pushsdk.soundtooth.cn/api/verifySDK/
- Name: verifySDK
- Parameters:
	- appKey: App开发者申请app时，网页提供的key
	- appSecret: App开发者申请app时，网页提供的secret
	- bundleID(packageName): IOS传递bundleID, 安卓传递包名
- Reponse:
	
```json
{
	"success": false,
	"errCode": 301,
	"errMsg": "认证失败"
}
```

```json
{
	"success": true,
	"token": "xxxxxxxx",
	"duration": 30,
	"ctime": 1456218718,
	"errCode": 200,
	"errMsg": ""
}
```

- duration: token有效性（以分钟计算）
- ctime: token创建时间

##### 2. 上传手机信息

- Uri: http://pushsdk.soundtooth.cn/api/uploadInfo/
- Name: uploadInfo
- Parameters:
	- token: 认证后返回的token（具有有效期）**（可放在头部）**
	- userInfo: 以json格式组合的用户信息
		- appUserID: (安卓传uuid，IOS传deviceToken)
		- macAddr: mac地址
		- deviceID: 用于标识是哪台手机的id
		- serviceProvider: 运营商
			- 1: 其他
			- 2: 中国联通
			- 3: 中国移动
			- 4: 中国电信
		- networkType: 网络类型
			- 1: 其他
			- 2: 2G
			- 3: 3G
			- 4: 4G
			- 5: Wifi
		- terminalSys: 终端系统
			- 1: 其他
			- 2: IOS
			- 3: Android
		- terminalName: 系统名称
		- terminalVer: 系统版本
		- machineType: 机型
	
```json
{
	"appUserID": "xxx",
	"macAddr": "xxx",
	"serviceProvider": 1,
	"networkType": 2,
	"terminalSys": 2,
	"terminalName": "Android xxx",
	"terminalVer": "4.3.0",
	"machineType": "Samsung NoteII"
}
```

- Reponse:
	
```json
{
	"success": false,
	"errCode": 301,
	"errMsg": "请重新认证"
}
```

```json
{
	"success": true,
	"errCode": 200,
	"errMsg": ""
}
```

##### 3. 获取GPS信息

- Uri: http://pushsdk.soundtooth.cn/api/getGPSInfo/
- Name: getGPSInfo
- Parameters:
	- token: 认证后返回的token（具有有效期）**（可放在头部）**
	- appUserID: (安卓传uuid，IOS传deviceToken)
	- gpsInfo: 以json格式组合的用户信息
		- ctime: 在该经纬度的所在时间（以整形时间戳传递）
		- lng: 经度
		- lat: 纬度
	
```json
[
	{ "ctime": 1456218718, "lng": 100.0, "lat": 100.0 },
	{ "ctime": 1456218718, "lng": 100.0, "lat": 100.0 },
	{ "ctime": 1456218718, "lng": 100.0, "lat": 100.0 },
	{ "ctime": 1456218718, "lng": 100.0, "lat": 100.0 }
]
```

- Reponse:

```json
{
	"success": true,
	"errCode": 200,
	"errMsg": ""
}
```

##### 4. 确认推送状态

- Uri: http://pushsdk.soundtooth.cn/api/confirmPush/
- Name: confirmPush
- Parameters:
	- token: 认证后返回的token（具有有效期）**（可放在头部）**
	- pushID: 推送时传过来的id

- Reponse:

```json
{
	"success": true,
	"errCode": 200,
	"errMsg": ""
}
```

##### 5. 填写日志

- Uri: http://pushsdk.soundtooth.cn/api/sdkLog/
- Name: sdkLog
- Parameters:
	- token: 认证后返回的token（具有有效期）**（可放在头部）**
	- logType：日志等级
		- 1：其他
		- 2：SDK 不可用
		- 3：必须马上采取行动的事件
		- 4：关键事件（critical）
		- 5：错误事件（error）
		- 6：警告事件（warning）
		- 7：普通但重要事件
		- 8：有用信息
		- 9：测试信息
	- macAddr：Mac地址
	- message：日志信息
		
- Reponse:

```json
{
	"success": true,
	"errCode": 200,
	"errMsg": "保存成功"
}
```

##### 6. iOS 激活应用

- Uri: http://pushsdk.soundtooth.cn/api/verifyIP/
- Name: verifyIP

- Reponse:

```json
{
	"success": true,
	"errCode": 200,
	"errMsg": "激活成功"
}
```

```json
{
	"success": true,
	"errCode": 200,
	"errMsg": "其他网站下载的APP"
}
```

```json
{
	"success": false,
	"errCode": 307,
	"errMsg": "获取IP失败	"
}
```

##### 7. update Version

- Uri: http://www.soundtooth.cn/admin/taskApi/updateVersion/
- Name: updateVersion
- Parameters:
	- version: version number
	- androidSdk: the sdk of androd uri
	- androidDemo: the demo of androd uri
	- iOSSdk: the sdk of ios uri
	- iOSDemo: the demo of ios uri

- Reponse:

```json
{
	"success": true,
	"errCode": 200,
	"errMsg": "保存成功"
}
```

```json
{
	"success": true,
	"errCode": 200,
	"errMsg": "更新成功"
}
```
