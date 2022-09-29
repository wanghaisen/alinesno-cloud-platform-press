# scala 安装

## 本内容你将获得

- CentOS7 上安装 scala
- 验证scala安装

## 软件安装

#### 说明

- scala依赖 Java1.5以上版本

### 安装开始

##### 上传 scala-2.12.15至 Linux 服务器/root/tools 目录

解压

```bash
cd /root/tools
tar -zxvf scala-2.12.15.tgz
```

配置环境变量

```shell
vi /etc/profile

export SCALA_HOME=/root/tools/scala-2.12.15
export PATH=$PATH:$SCALA_HOME/bin
```

保存后，source /etc/profile 使配置生效

### 验证安装

```shell
scala -version  #查看scala版本
Scala code runner version 2.12.15 -- Copyright 2002-2021, LAMP/EPFL and Lightbend, Inc.
```

<br/>

## 其他

- 无