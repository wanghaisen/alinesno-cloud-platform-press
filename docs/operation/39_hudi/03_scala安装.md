# scala 安装

## 本内容你将获得

- 如何在 centos7 服务器上安装 scala

## scala 安装

登录官网https://www.scala-lang.org/download/all.html

下载 scala-2.12.15.tgz 并上传至 Linux 服务器/root/tools 目录。

1、解压

```bash
cd /root/tools
tar -zxvf scala-2.12.15.tgz
```

2、配置环境变量

```shell
[root@hadoopmaster ~]# vi /etc/profile
# /etc/profile
#flink
export SCALA_HOME=/root/tools/scala-2.12.15
export PATH=$PATH:$SCALA_HOME/bin

保存后，source /etc/profile 使配置生效
```

