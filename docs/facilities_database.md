# 场地借用数据库规范

**ID String** => `_id`, `openid` 等字符串的正则格式为 
```javascript
    [0-9A-Za-z_-]{n}
    // _id: n= 16 or 32
    // openid: n= 28
```

## 1. forms

Field Name      | Type     | Description
---------------:| -------- | ------------------------
_openid         | String   | 微信公开id, 用于区别用户
formid          | Number   | 表单编号 `yyyy\d{5}`
check           | Object   | 审核的详细信息, 详见下
checkHis        | Object[] | 审核的历史记录数组 
classroomNumber | String   | 教室编号
event           | Object   | 活动的详细内容, 详见下
eventDate       | String   | 活动日期 `yyyy-MM-dd`
eventTime1      | String   | 活动时间（起） `HH:mm`
eventTime2      | String   | 活动时间（终） `HH:mm`
exam            | Number   | 审核状态, 详见下
submitDate      | Date     | 提交日期
 
### 字段内容

- [Object] **check**

Name     |  Type  | Description
--------:| ------ | -----------------
approver | String | 审批人
comment  | String | 审批意见
time     | Date   | 审核提交的时间
openid   | String | 审批人的 `openid`

- [Object] **event**

Name         |  Type  | Description
------------:| ------ | ------------------------
association  | String | 单位(组织/社团)名称
attendNumber | Number | 活动人数(>=1)
content      | String | 活动内容, 活动的详细描述
name         | String | 活动名称
responser    | String | 活动负责人姓名
tel          | String | 联系电话

- [eNum(Number)] **exam**

Name | Description
---- | -------------
0    | 未审核
1    | 审核撤回
2    | 审核, 未通过
3    | 审核, 通过


## 2. adminInfo

Field   | Type    | Description
-------:| ------- | ---------------------------------------------------
openid  | String  | 微信公开id, 用于区别用户
isAdmin | Boolean | 是否有管理员权限, 必填
isSuper | Boolean | 是否有超级管理员权限, 选填
name    | String  | 用户名称, 开发者必须加后缀 `[Dev]` 或 `[Rel]` 以区分
tel     | String  | 用户手机号, 备用

设置 `isAdmin` 字段的原因是秘书部的审批为值班制, 流动性大, 值班结束后只需将其置为