# Flink 安装

## 本内容你将获得

- 如何在 centos7 服务器上安装 flink

## Flink 安装

登录官网https://flink.apache.org/downloads.html

下载 flink-1.14.4-bin-scala_2.12.tgz 并上传 至 Linux 服务器/root/flink 目录。此服务器为 CDH6.2.0 的 dataNode 节点。

1、解压

```bash
cd /root/flink
tar -zxvf flink-1.14.4-bin-scala_2.12.tgz

创建临时目录文件
mkdir -p /root/flink/tmp
mkdir -p /root/flink/flink-1.14.4/tmp/zookeeper
```

2、修改配置文件 flink-conf.yaml

```bash
cd /root/flink/flink-1.14.4/conf
vi flink-conf.yaml
# 修改以下内容为4
taskmanager.numberOfTaskSlots: 4

# 修改以下内容为rocksdb
state.backend: rocksdb

# 修改以下内容为hdfs:///user/flink/flink-checkpoints
state.checkpoints.dir: hdfs:///user/flink/flink-checkpoints

# 修改以下内容为hdfs:///user/flink/savepoints-data
state.savepoints.dir: hdfs:///user/flink/savepoints-data

# 修改以下内容为true
state.backend.incremental: true

# 修改以下内容为/root/flink/tmp
io.tmp.dirs: /root/flink/tmp

# 修改以下内容为parent-first
classloader.resolve-order: parent-first
```

3、修改配置文件 zoo.cfg

```bash
cd /root/flink/flink-1.14.4/conf
vi zoo.cfg
# 修改以下内容为/root/flink/flink-1.14.4/tmp/zookeeper
dataDir=/root/flink/flink-1.14.4/tmp/zookeeper
```

4、复制 hadoop 集群配置文件

```bash
cd /etc/hadoop/conf/
cp hdfs-site.xml /root/flink/flink-1.14.4/conf
cp core-site.xml /root/flink/flink-1.14.4/conf
```
