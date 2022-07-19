# 中台产品线

> 快速低成本的切入和落地中小企业数字中台化

## 概述

企业级研发中台服务 ACP , 研发中台产品体系架构规划和设计，为完成整体的中台产品进行的架构和产品的整体规划。

企业级研发中台服务 ACP（Alinesno Cloud Platform）是业务应用生命周期管理和监控的新一代中台，
针对于大中小型团队合适的开发平台，支持微服务化、中台化、统一权限和基础能力管理，数据采集、计算、治理运营输出， 统一业务规范，集成 DevOps 自动化流程，为业务发展提供基础的数字化架构
，业务规范化和标准化，为后期业务的沉淀形成和数据治理形成基础，更好的沉淀企业业务资产和数据资产,结合业务架构师的规划，进行核心业务的改造和各个业务线的整合，形成行业的业务标准和
团队的一套解决方案，形成自己的核心竞争力

## 可以帮助我做什么

- 开箱即用的技术中台体系
- 快速实现数字中台和业务集成
- 数据治理体系和数据治理建设
- 研发中台和团队组快速结合

## 产品主要功能

- 一套技术 DevOps 研发体系,持续集成平台
- 技术、研发中台和数据中台底座，快速集成业务中台
- 统一的前端框架和微服务研发引擎，k8S 容器化支持
- 集成权限/用户/认证/授权/支付/通知/内容管理等基础组件
- 数据采集/主数据标准/数据开发计算/数据输出运营服务
- 成熟的研发组件，多团队多部门开发

## 产品列表

这里列出原规划的版本，实际以演示版本为主

### 数字中台产品构架图

中台[新中台模型](../design/overview/)的建设规划，研发中台产品架构图，结合团队/组织架构/数据/应用/运营整体体系的产品规划，整体产品架构图如下：

<img src="/framework/01_acp_product_arc.jpg" style="width:100%;margin-left:-20px">

> 注：这里一定要注意，上面是针对中小团队可支撑范围，大型数字中台需要一定量的人员支撑，人员投入方向是支撑的业务线多

产品架构图片说明：

- 虚线部分为业务线的建设，非虚线部分为数字中台产品边界和范围
- 针对于不同的数据的适配，不同的团队组织线建设有不同的业务建设方式
- 多团队共用新中台架构，包括组织架构、运营、技术方案等，形成统一的中台体系（可兼容不同技术）
- 研发中台和基础业务中台，提取出公共的元数据和主数据能力，从根本建设上解决应用数据孤岛的问题
- 结合数据整合模块，进行数据元数据和主数据的抽取上报，集中到数据仓库和数据湖，形成数据资产能力
- 中台能力和业务架构的体现从开放平台和新中台对外门户，形成行业业务沉淀，形成核心业务能力资产

<!-- 相应的市面上产品示例门户体现示例： -->
<!-- - [钉钉](https://www.dingtalk.com) -->
<!-- - [金蝶云苍穹](https://dev.kingdee.com/index/home) -->
<!-- - [阿里云](https://www.aliyun.com) -->

### 产品工程规划列表

最终效果以中台演示为主，针对于中小团队有限的能力进行的建设，架构规划上需要进行一定的边界和制约。

| 序号 |  业务线  | 产品                   |  状态  | 地址                                                               | 备注 |
| :--: | :------: | ---------------------- | :----: | ------------------------------------------------------------------ | ---- |
|  1   | 技术中台 | 技术研发体系           | 完成 | [devops][devops]                                                     |      |
|  2   |          | 微服务研发引擎         | 完成 | [alinesno-cloud-core][alinesno-cloud-core]                         |      |
|  3   |          | 代码生成器服务         |    完成    | [alinesno-cloud-initializr-admin][alinesno-cloud-initializr-admin] |      |
|      |          |                        |        |                                                                    |      |
|  1   | 运维中台 | 自动化运维体系         |   完成     | [chatops][chatops]                                                              |      |
|  2   |          | 应用监控预警服务       |        |                                                                    |      |
|  3   |          | 审计日志监控服务       |        | [alinesno-cloud-logger][alinesno-cloud-logger]                     |      |
|  4   |          | Ansible 自动化操作服务 |        | [alinesno-cloud-operation][alinesno-cloud-operation]               |      |
|      |          |                        |        |                                                                    |      |
|  1   | 研发中台 | 权限资源引擎服务       | 完成 | [alinesno-cloud-authority][alinesno-cloud-authority]               |      |
|  2   |          | 云门户管理服务         |        | [alinesno-cloud-platform][alinesno-cloud-platform]                 |      |
|  2   |          | 会员管理服务           |        | [alinesno-cloud-member][alinesno-cloud-member]                     |      |
|  3   |          | 通知管理服务           | 优化中 | [alinesno-cloud-base-notice][alinesno-cloud-base-notice]           |      |
|  4   |          | 支付管理服务           |        | alinesno-cloud-base-pay                                            |      |
|  5   |          | 文档打印管理服务       | 优化中 | [alinesno-cloud-base-print][alinesno-cloud-base-print]             |      |
|  6   |          | 存储管理服务           |  完成      | [alinesno-cloud-base-storage][alinesno-cloud-base-storage]                                        |      |
|  7   |          | 工作流管理服务         |        | alinesno-cloud-base-workflow                                       |      |
|  8   |          | 网关管理服务           |        | alinesno-cloud-gateway                                             |      |
|  9   |          | 中台连接器服务         |        | alinesno-cloud-open                                                |      |
|  11  |          | 单点登陆管理服务       |        | alinesno-cloud-platform-cas                                        |      |
|  12  |          | 内容管理服务           |        | alinesno-cloud-cms                                                 |      |
|      |          |                        |        |                                                                    |      |
|  1   | 数据中台 | 数据中台管理体系       |        | alinesno-cloud-data-studio                                         |      |
|  2   |          | 数据上报服务           |  完成  | [alinesno-cloud-data-report][alinesno-cloud-data-report]           |      |
|  3   |          | 主数据管理服务         |        | alinesno-cloud-data-mdn                                            |      |
|  4   |          | 数据集成服务           |        | alinesno-cloud-data-etl                                            |      |
|  5   |          | 数据开发服务           |        | alinesno-cloud-data-develop                                        |      |
|  6   |          | 数据开放服务           |        | alinesno-cloud-data-open                                           |      |
|      |          |                        |        |                                                                    |      |

<!-- |  10  |          | 分布式定时任务服务     |        | alinesno-cloud-scheduler                                           |      | -->

[devops]: ./paas/01_持续集成平台.md
[alinesno-cloud-core]: ./business/12_技术中台/01_微服务研发引擎.md
[chatops]: ./business/18_运维中台/12_自动化运维体系.md
[alinesno-cloud-logger]: #
[alinesno-cloud-operation]: #
[alinesno-cloud-initializr-admin]: ./business/19_业务中台/01_代码生成脚手架.md
[alinesno-cloud-authority]: ./business/13_研发中台/01_基础权限管理平台.md
[alinesno-cloud-platform]: ./business/13_研发中台/02_云门户管理平台.md
[alinesno-cloud-base-storage]: ./business/13_研发中台/06_存储管理平台.md
[alinesno-cloud-member]: #
[alinesno-cloud-base-notice]: ./business/13_研发中台/03_通知管理平台.md
[alinesno-cloud-base-print]: ./business/13_研发中台/05_文档打印管理平台.md
[alinesno-cloud-data-report]: ./business/14_数据中台/06_数据上报服务.md

**相关产品使用和运营架构规划**:

- 研发中台运营 [打开](../framework/)
- 数据中台运营 [打开](../data/framework/)

## 其它

- 略
