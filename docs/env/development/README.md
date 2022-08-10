# 研发环境建设

## 概述

这里针对的环境的安装和搭建，包括资源的要求，这里只是列出参数，同时包含有团队的人数的要求。

当前的资源是针对于演示版本的环境搭建情况为参考

## 资源要求

> 这里针对的研发平台，建议采购阿里云，较为稳定

| 序号 | 服务器用途     | 服务器配置                | 采购价 | 备注                                   |
| :--: | -------------- | ------------------------- | ------ | -------------------------------------- |
|  1   | 研发服务器\_01 | 4 核 32G 内存 80G 硬盘 5M | 3k3 年 | 部署基础套件,比如运维/代码生成器等     |
|  2   | 研发服务器\_02 | 4 核 16G 内存 80G 硬盘 5M | 2k3 年 | 部署稳定套件,比如网关/权限/存储/通知等 |

**注意事项**

- 采购价是阿里云活动的新用户采购价
- 这里不包含 cicd 工具，不使用 k8s，此部分属于技术体系[查看](/env/development/)
- 部署以 docker 镜像部署，而非 k8s
- 日志存储为单独服务器，不包含这上面

## 基础环境要求

研发中台基础环境要求按最小需求进行安装，以减少团队在应用层面上的最小部署负担

- 【必须】mysql，查看安装文档 [打开][mysql]
- 【必须】redis，查看安装文档 [打开][redis]
- 【可选】minio，查看安装文档 [打开][minio]
- 【可选】elasticsearch，查看安装文档 [打开][elasticsearch]


> 可选是根据安装组件和规模进行安装

[mysql]: /operation/08_mysql/01_MySQL单点安装.md
[redis]: /operation/06_redis/01_Redis单点安装.md
[minio]: /operation/27_minio/01_MinIO单机安装.md
[elasticsearch]: /operation/22_elk/04_elk单机版本安装.md


## 网络策略要求

针对于内部网络安全等因素，需要开通的端口策略如下：

> 待补充

## 安装方式

这里主要集成多种安装方式，针对不同的场景，如下：

- 【推荐】在线安装，[打开][online_install]
- 【一般】离线安装，[打开][offline_install]
- 【一般】源码安装，[打开][source_install]

针对团队不同的情况进行选择安装。

[online_install]: /env/development/install/21_安装流程.md
[offline_install]: /env/development/install/25_Docker单独安装.md
[source_install]: /env/development/install/24_Jenkinsfile安装.md

## 其它

- 无
