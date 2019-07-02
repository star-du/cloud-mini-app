## items集合
 Field Name     | Type   | Description
---------------:| ------ | ------------------------
itemId          | String | 物品编号`[A-G]\d{3}`
genre           | String | 物品类别(A...G)
itemName        | String | 物品名称
quantity        | Number | 物品剩余数量
location        | Array  | 物品位置 e.g.[4,1,A] 见下面有关仓库的说明
description     | String | 对物品的补充描述，选填


### 仓库情况说明

仓库    |详情 
-------|-------
一号仓库|1、2、3货架
二号仓库|1、2、3、4、5、6货架，以及用于放置旗帜的分区，例如某旗帜可表示为[2,2,A]
三号仓库|无特别货架
四号仓库|1、2、3货架，每个货架有A、B、C……分区


