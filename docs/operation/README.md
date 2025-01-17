# 部署内容

## 概要

基础环境完善及配置，为整个开发平台做基础，以环境搭建为主,为本地开发环境，
目前的服务器应该是不够的,也并不是代表所有的软件需要完善才可以进入下一步开发，比如 elk，前期搭建并一定是需要的，

比如说集群，也并不一定是一开始就是集群,
平台搭建一个人的话是比较长期，所以，以先投入组件构建为主，在完成第一步之后，再进一步完善，
即使在团队，也是如此建议，一步到位，也是比较难的，如果可以就更好。

## 服务器资源

> 阿里云服务器 IP 为公网

| 序号 | 作用               | 服务器资源(系统/内存/硬盘) | IP 规划    | 备注 |
| :--: | ------------------ | -------------------------- | ---------- | ---- |
|  1   | 开发服务器\_master | CentOS7.x_x64_16G_40G      | 阿里云分配 |      |
|  2   | 基础 DevOps 平台   | CentOS7.x_x64_4G_40G       | 阿里云分配 |      |
|  3   | 注册中心           | CentOS7.x_x64_4G_40G       | 阿里云分配 | .    |

## 资源规划

> 此处的完善进度表示文档完成进度,即可根据文档查询搭建的

| 序号 | 说明               | 工具          | 文档完善进度 | 备注             |
| :--: | ------------------ | ------------- | ------------ | ---------------- |
|  1   | 基础环境           | JDK           | 已完善       |                  |
|  2   | 反向代理           | Nginx/Kong    | 已完善       |                  |
|  4   | 自动部署工具       | Jenkins       | 完善中       |                  |
|  5   | 私服库             | Nexus         | 已完善       |                  |
|  8   | 缓存工具           | Redis         | 已完善       |                  |
|  9   | 消息列表           | Kafka         | 已完善       |                  |
|  10  | 分布式注册中心     | zeekeeper     | 完善中       |                  |
|  13  | 数据库             | MySQL         | 已完善       |                  |

## 其它

- 略

