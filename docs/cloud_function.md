# Cloud Functions

云函数配置时需注意:

  + 看环境是开发环境还是运行环境.
  + 注意部署时选择**云端安装依赖**, 详细的可以了解 `npm` 和 `package.json` 的用法.
  + 调试时可以看云开发环境中的输出信息, 若没有运行显示, 关闭窗口再重开能强制刷新.

## 1. login

登录并查询管理员数据库, 返回用户登录信息.

- 输入: 暂时不需要输入数据
- 返回: Object, 描述如下: 

Name    | Type    | Description
-------:| ------- | ------------------------
openid  | String  | 用户的 `openid`
unionid | String  | 用户的 `unionid`(如果有)
isAdmin | Boolean | 是否为管理员

如果 `isAdmin` 为 `true`, 则还有以下属性:

Name    | Type    | Description
-------:| ------- | ------------------------------------
name    | String  | 数据库中的用户名
isSuper | Boolean | [Todo]是否为超级用户(可以管理管理员)


## 2 updateApproval (弃用)

用于 `viewApproval` 中更新审批情况. 调用时检查管理权限.

- 输入: Object, 描述如下: 

Name     | Type   | Description
--------:| ------ | ------------------------
updateID | String | 要更新的 `doc` 的 `_id`.
check    | Object | 新的 `check`
exam     | Number | 新的 `exam`

- 返回: Object - `{error: Boolean, msg: String [, updated : Number]}`, 

若调用成功则 `error=true` 且有 `updated`;
若失败则 `error=false` 且 `msg` 为错误信息, 无 `updated` 属性.


## 3 exportXlsx

  [in] `{openID, startDate, endDate}`

  生成 `xlsx` 文件, 需要检查 `openid` 是否为管理员(有权限导出). 导出内容为 startDate 至 endDate 内所有的审核通过的审批.

## 4 operateForms

- 输入: Object, 描述如下: 

Name       | Type    | Description
----------:| ------- | --------------
caller     | String  | 用于标识调用者
collection | String  | 需要操作的数据库集合
operate    | String  | 操作, 目前只支持 "read", "update"
filter     | Object  | 需要返回的关键字段表, 选填
isDoc      | Boolean | 是否使用 `doc` 方法取数据(否则为 `where` 方法), 选填

如果 `isDoc` 为 `true`, 则还需要以下参数:

Name  | Type   | Description
-----:| ------ | --------------------
docID | String | 表示需查询项的 `_id`


如果 `isDoc` 为 `false`, 则还需要以下参数:

Name   | Type   | Description
------:| ------ | ------------
filter | Object | 查询条件

如果 `operate` 为 `update`, 则还需要以下参数:

Name   | Type   | Description
------:| ------ | ------------
update | Object | 更新对象

- 返回: Object, 具体参见代码