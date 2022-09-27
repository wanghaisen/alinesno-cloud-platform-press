# 离线安装

## 概述

基于Docker-Compose/Kubernates的本机安装，达到快速安装配置，适用于中小团队的开发场景以及中小项目场景，在启动配置上一键部署基础平台

## 本内容你将获得

- docker-compose安装的方式和脚本
- 环境的验证和启动
- 日志和运维的管理方式 

## 前置条件

- 环境确认，查看[第一章节](#)
- 端口正常，具体涉及端口

## 安装配置

这里的安装从两个角色，一个是配置安装，另一个是运行检测两个维度阐述，如下：

### 配置安装

> 离线安装方式有疑问可进一步进入社区群沟通或者获取相关文件

配置脚本：

- 按需获取docker-compose一键部署脚本
- 按需获取kubernates一键部署脚本

运行环境检查，确保基础环境正常：

```shell
bash env-check.sh
```

配置相关的账号密码，修改`config.properties`文件，配置如下：

```properties
# mysql配置
alinesno.acp.mysql.host=
alinesno.acp.mysql.username=
alinesno.acp.mysql.password=

# 配置redis
alinesno.acp.redis.host=
alinesno.acp.redis.host=
alinesno.acp.redis.host=

# 配置minio【可选】
alinesno.acp.minio.enable=true
alinesno.acp.minio.endpoint=
alinesno.acp.minio.key=
alinesno.acp.minio.secret=
```

执行安装脚本，命令如下
```shell 
bash install.sh
```

### 运行检查

从docker命令检查安装情况，以下标识为正常
```shell
docker-compose log 
```

打开访问链接地址
```shell
http://192.168.0.1:8080/
```

## 其它

- 无
