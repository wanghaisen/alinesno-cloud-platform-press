# kettle安装

## 概述

   kettle是一款JAVA开发的ETL工具，用于从数据源抽取、清洗和转换数据到数据仓库

## 本内容你将获得

- kettle环境变量配置
- 添加数据库java连接包

##  软件安装

##### 说明

- kettle依赖 Java环境

### 安装kettle

<br/>

<img :src="$withBase('/operation/kettle_004.png')" >

配置说明：

- 下载pdi-ce-8.2.0.0-342.zip并解压

- 新增环境变量 PENTAHO_JAVA_HOME

- 新增环境变量 kettle_home

##### 添加jar包

下载当前数据库对应版本的java连接包放到lib目录

<img :src="$withBase('/operation/kettle_002.png')" style="zoom:33%">

<br/>

<br/>

### 启动kettle

进入data-integration目录，运行Spoon.bat

<img :src="$withBase('/operation/kettle_001.png')" style="zoom:33%">



## 其他

- 无