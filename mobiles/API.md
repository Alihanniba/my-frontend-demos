# 后台 API 数据

[移动端文档见](http://acqtol.axshare.com)

除了搜索 API 需要固定 token，登录，注册不需要 token，其它都需要 user token

##  搜索接口

### Request Authtication header 

| Token list      |
| --------------- |
| N4FAxVXrdsjHNpS |
| t2BsR_diiJUV_A6 |
| Uea9zx4bstMzdpy |
| -VZvByCBxXxUVvD |
| ynigpkxGbdhSBKe |
| aNSaKV6qzjAgB_T |
| KBnCNxaaCe5ZTtb |
| CMunueVzr3shhWD |
| vmi8jaD_2kNx2yw |

Example: ```curl -IH "Authorization: Token token=vmi8jaD_2kNx2yw" http://account.ottcloud.tv/api/v1/search.json```

###API Lis

Endpoint: ```http://account.ottcloud.tv/api/v1/search.json```
Request Type: ```GET```
Params:
```
- cp(must)
- q 查询关键字
- page 查询第几页
- per_page 查询结果每页数量
```

CP 参数对应数值:
```
vegotv(all-youtube) -> DCNKzQd_d_9k3macDWIH_g
```
Result:

```
{
  jsonGraph:{
  "version": 123
  "pages": 14, -- 结果集总页数
  "total_count": 14, -- 结果集数量
  "titlesById":{
    "576":{"id":576,"name":"食戟之灵","landscape_poster":"https://i.ytimg.com/vi/TmjILIM7PEY/mqdefault.jpg","description":"故事描述一个家中经营餐馆“幸平饭店”的中学生幸平创真，每天总是以料理人的父亲为目标，不断磨练自..."}
  }
  }
}
```

## 移动端自定义频道列表 API

### 获取频道

### 创建频道
Endpoint: ```http://account.ottcloud.tv/api/v1/members/customize.json```
Request Type: ```POST```
Params:
```
- genre_list(must)
```
genre_list example:

```
[{"id":100,"name":"精品高清"},{"id":34,"name":"家有小娃"},{"id":35,"name":"电影"},{"id":36,"name":"脱口秀"},{"id":37,"name":"戏曲"}]
```


## 登录注册


