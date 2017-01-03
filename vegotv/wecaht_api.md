#微信前端单页面API需求文档整理

----

### **home(首页)**
* getHomeSource
	* request
	
		type|get
		:--:|:--:
	* responese(banner 和 热门播放虽参数一样,但需分两个对象返回)
	
		<img src="./home.jpg" width = "300" height = "500"  />
		* banner
		
			param| desc
			:--:|:--:
			id|剧集id
			name|名称
			description|简介
			type|0或1(1表示电视剧,0表示综艺或其他)
			landscape_poster|封面url
			
		* hot play
		
			param| desc
			:--:|:--:
			id|剧集id
			name|名称
			description|简介
			type|0或1(1表示电视剧,0表示综艺或其他)
			landscape_poster|封面url
	
---	
### **categories(分类)**
* getCategories
	* request
	
		type|get
		:--:|:--:
	* responese

		param| desc
		:--:|:--:
		tagid|分类id
		name|名称
		
---

### **categories/category(分类详情)**
* getCategoryByTagId
	* request
	
		param| desc
		:--:|:--:
		type|post
		tagid|分类id
		page|可选(一次默认返回20条)
		
	* responese

		param| desc
		:--:|:--:
		id|剧集id
		isTitle|true(多集)或false(单集)
		istv|0或1(1代表电视剧,0代表综艺其他)
		landscape_poster|封面url
		name|名称
		description|简介
		
---
		
### **cps(专区详情)**
* getCpsSource
	* request 
	
		param| desc
		:--:|:--:
		type|post
		cpid|专区id(1/兔小贝,2/华策,3/中国蓝)
		navid|导航id(可选)
		page|可选(一次默认返回20条)
	
	* responese()
		
		<img src="./WechatIMG13.jpeg" width = "300" height = "500"  />
		
		**默认为不传navid,则返回导航资源及最近更新剧集资源**
		
		**切换导航时传navid,则返回各导航对应的资源**
		
		param| desc
		:--:|:--:
		id|剧集id
		isTitle|true(多集)或false(单集)
		istv|0或1(1代表电视剧,0代表综艺其他)
		landscape_poster|封面url
		name|名称
		description|简介
		
---
	
### **play(播放页面)**	
* getEpisodeInfo
	
	* request 
	
		param| desc
		:--:|:--:
		type|post
		id|剧集id
		isTitle|true(多集)或false(单集)
		istv|0或1(1代表电视剧,0代表综艺其他)
		cpid|(1/兔小贝,2/华策,3/中国蓝, 0/分类及综合资源)
	
	* responese
		
		
		param| desc
		:--:|:--:
		source_url|播放资源链接
		landscape_poster|封面url
		free|true(免费)或false(付费)
		name|名称
		description|简介
		isTitle|true(多集)或false(单集)
		
	**如果request  isTitle为 true, 还需按顺序返回剧集数**
	
---