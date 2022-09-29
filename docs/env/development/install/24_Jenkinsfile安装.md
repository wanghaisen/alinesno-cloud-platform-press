# 源码安装

> 此为当前中台开发环境的部署方式

## 工程示例

源码安装前后端发布示例[打开](https://gitee.com/alinesno-cloud/alinesno-demo-gateway-open/tree/master/demo-deploy)

## 概述

源码型安装是基于客户型的源码安装形式，主要针对的使用场景是客户源码型采购的客户进行安装，
方便内部的进一步落地和参考。

## 本内容你将获得

- Jenkinsfile的配置
- 前后端部署的方式
- Dockcer/K8S部署的方式

## 前置条件

这里包括两部分，一部分是jenkins，另一部分是基础环境

- Docker/K8S已部署安装
- Jenkins插件安装:Dingtalk插件/PublishSSHOver插件
- Jenkins密钥配置名称:alinesno-platform-docker-cret/alinesno-platform-qiniu-cret，用于docker推送和CDN配置上传

## 环境变量配置

后端服务的变量配置:

```jenkinsfile
environment {
    // 构建参数
    PROJECT_NAME = 'alinesno-cloud-transfer-boot'
    PRO_VERSION = '0.0.1-SNAPSHOT'
    EXPOSE_PORT = '28480'
    DOCKER_PORT = '28280'
    ALIYUN_CR_HOST = 'registry.cn-shenzhen.aliyuncs.com'
    ALIYUN_CR_NAMESPACE = 'alinesno-cloud-incubator'
    PROFILES_ACTIVE = 'pro'

    // 认证信息
    DOCKER_CREDENTIALS = credentials('alinesno-platform-docker-cret')
    DEPLOY = "docker"   // docker/k8s
    DOCKER_NODE = "slave-build-102"  // 发布Docker的服务器(k8s发布则不用配置)
}
```

前端服务的变量配置
```jenkinsfile
environment {
    // 构建参数
    PROJECT_NAME = 'alinesno-cloud-transfer-ui'
    PRO_VERSION = '0.0.1-SNAPSHOT'
    EXPOSE_PORT = '28480'
    DOCKER_PORT = '80'
    ALIYUN_CR_HOST = 'registry.cn-shenzhen.aliyuncs.com'
    ALIYUN_CR_NAMESPACE = 'alinesno-cloud-incubator'
    PROFILES_ACTIVE = 'pro'

    // 认证信息
    DOCKER_CREDENTIALS = credentials('alinesno-platform-docker-cret')
    QINIU_CREDENTIALS = credentials('alinesno-platform-qiniu-cret')
    DEPLOY = "docker"
    DEPLOY_CDN = "true"
    DEPLOY_CDN_HOST = "http://data.linesno.com"
    DOCKER_NODE = "slave-build-102"

    // 服务端信息
    MANAGER_API="http://alinesno-transfer.admin.beta.linesno.com"
}
```

## 预警通知配置

这里预警的配置使用jenkins集成配置更为方便，没有集成到jenkinsfile里面，主要看团队需求

## 其它

- 无

