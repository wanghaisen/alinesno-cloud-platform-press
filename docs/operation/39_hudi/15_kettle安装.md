# kettle安装

## 本内容你将获得

- 如在安装kettle开发工具

##  安装kettle

a)、 下载pdi-ce-8.2.0.0-342.zip并解压

b)、 配置环境变量

- 此电脑 --> 右键 --> 属性

<img :src="$withBase('/operation/kettle_001.png')">



- 高级系统设置

<img :src="$withBase('/operation/kettle_002.png')">



- 环境变量

<img :src="$withBase('/operation/kettle_003.png')">



新增变量 PENTAHO_JAVA_HOME= C:\Program Files\Java\jre1.8.0_181 

<img :src="$withBase('/operation/kettle_004.png')">



新增变量 kettle_home = F:\kettle\pdi-ce-8.2.0.0-342\data-integration

<img :src="$withBase('/operation/kettle_005.png')">

c)、 更新mysql连接包

查询mysql数据库的版本。下载对应版本的mysql连接包，如mysql-connector-java-5.1.15-bin.jar。放到pdi-ce-8.2.0.0-342\data-integration\lib目录。



## 使用kettle

### 1、编写kettle任务

#### a)、 在kettle目录pdi-ce-8.2.0.0-342\data-integration下，点击Spoon.bat

#### b)、进入kettle主界面

<img :src="$withBase('/operation/kettle_007.png')">  

#### c)、在kettle中新建作业和转换任务，完成后的界面如下

<img :src="$withBase('/operation/kettle_008.png')">



