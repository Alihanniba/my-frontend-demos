module.exports = {
	"development":{
		"config":{
			"repo": /wechat$/
		},
		"repo": "",
		"app" : "wechat-test",
		"branchs": ["develop"],
		"port": 9003
	},
	"production":{
		"config":{
			"repo": /wechat$/
		},
		"repo": "",
		"branchs": ["master"],
		"app" : "wechat",
		"port": 9001
	}
 
}