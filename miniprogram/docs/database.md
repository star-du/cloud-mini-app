#数据库规范
---
| 字段名  | 类型    |   简介
| ------- | ------- | ---------
| openid         | String | 微信公开id，用于区别用户
| formid         | Number | 表单编号
| associationName | String | 协会名称
| eventName      | String | 活动名称
| attendNumber   | Number | 参加人数
| eventDate      | String | 活动日期
| eventTime1     | String | 活动时间（起）
| eventTime2     | String | 活动时间（终）
| classroomNumber | Number | 教室编号
| eventContent   | String | 活动内容
| eventResponser | String | 活动负责人
| submitDate     | String | 提交日期
| exam           | Number | 审核状态

>注：exam字段0代表未审核，1代表已审核通过，2代表已审核未通过

