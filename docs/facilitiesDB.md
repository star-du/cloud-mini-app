# 场地借用数据库规范

## forms

 Field Name     | Type   | Description
---------------:| ------ | ------------------------
_openid         | String | 微信公开id, 用于区别用户
formid          | Number | 表单编号 `yyyy\d{5}`
check           | Object | 审核的详细信息, 详见下
classroomNumber | String | 教室编号
event           | Object | 活动的详细内容, 详见下
eventDate       | String | 活动日期 `yyyy-MM-dd`
eventTime1      | String | 活动时间（起） `HH:mm`
eventTime2      | String | 活动时间（终） `HH:mm`
exam            | Number | 审核状态, 详见下
submitDate      | Date   | 提交日期
 
### 字段内容

- [Object] **check**

check    |  Type  | Description
--------:| ------ | --------------
approver | String | 审批人
comment  | String | 审批意见
openid   | String | 审批人的openid

- [Object] **event**

event        |  Type  | Description
------------:| ------ | ------------------------
association  | String | 单位(组织/社团)名称
attendNumber | Number | 活动人数(>=1)
content      | String | 活动内容, 活动的详细描述
name         | String | 活动名称
responser    | String | 活动负责人姓名
tel          | String | 联系电话

- [Number] **exam**

exam | Description
---- | -------------
0    | 未审核
1    | 审核撤回
2    | 审核, 未通过
3    | 审核, 通过


## adminInfo

 Field | Type   | Description
------:| ------ | -----------------------------------
openid | String | 微信公开id, 用于区别用户
name   | String | 管理员名称, 开发者必须加后缀 `[Dev]`
tel    | String | 管理员电话, 备用
