# Flink 安装

## 本内容你将获得

如何在 centos7 服务器上安装 flink

## Flink 依赖的环境

| 软件名称 | 版本号  |
| -------- | ------- |
| hadoop   | 3.3.4   |
| hive     | 3.1.3   |
| SCALA    | 2.12.15 |

## Flink 安装

登录官网https://flink.apache.org/downloads.html

下载 flink-1.14.5-bin-scala_2.12.tgz 并上传 至 Linux 服务器/root/tools 目录。要求服务器为hadoop 节点。

1、解压

```bash
cd /root/tools
tar -zxvf flink-1.14.5-bin-scala_2.12.tgz

创建临时目录文件
mkdir -p /root/flink/tmp
mkdir -p /root/flink/flink-1.14.5/tmp/zookeeper
```

2、修改配置文件 flink-conf.yaml

```shell
cd /root/tools/flink-1.14.5/conf
vi flink-conf.yaml
# 修改以下内容为8
taskmanager.numberOfTaskSlots: 8

# state.backend: filesystem  # 在下面增加
state.backend: rocksdb  

# classloader.resolve-order: child-first # 在下面增加
classloader.resolve-order: parent-first

# fs.default-scheme # 在下面增加
fs.default-scheme: hdfs:172.17.49.195:9000

#rest.port: 8081  # 在下面增加
rest.port: 8083

# 在文件末尾增加
classloader.check-leaked-classloader: false
taskmanager.host: localhost

# taskmanager.memory.flink.size: 1280m 修改为
taskmanager.memory.flink.size: 1280m
```

3、修改配置文件 zoo.cfg

```bash
cd /root/tools/flink-1.14.5/conf
vi zoo.cfg

# dataDir=/tmp/zookeeper # 在下面增加
dataDir=/root/flink/flink-1.14.5/tmp/zookeeper
```

4、修改masters

```shell
[root@hadoopmaster conf]#cd /root/tools/flink-1.14.5/conf
[root@hadoopmaster conf]# vi masters
localhost:8081    #修改为localhost:8083，与flink-conf.yaml中修改后的rest.port一致
```

5、复制 hadoop 集群配置文件

```bash
[root@hadoopmaster conf]# cd $HADOOP_HOME//etc/hadoop
[root@hadoopmaster hadoop]# ls -alt
total 232
-rw-r--r-- 1 1024 1024  1089 Sep 14 15:34 hdfs-site.xml
-rw-r--r-- 1 1024 1024  1288 Sep 14 15:13 core-site.xml
[root@hadoopmaster hadoop]# cp hdfs-site.xml /root/tools/flink-1.14.5/conf
[root@hadoopmaster hadoop]# cp core-site.xml /root/tools/flink-1.14.5/conf
[root@hadoopmaster hadoop]# cd /root/tools/hive-3.1.3/conf
[root@hadoopmaster conf]# ls -alt |grep hive
-rw-r--r--  1 root root 301977 Sep 15 08:30 hive-site.xml
[root@hadoopmaster hadoop]# cp hive-site.xml /root/tools/flink-1.14.5/conf
```

6、启停

```shell
[root@hadoopmaster ~]# cd /root/tools/flink-1.14.5/bin
[root@hadoopmaster bin]# export HADOOP_CLASSPATH=`$HADOOP_HOME/bin/hadoop classpath` 
[root@hadoopmaster bin]# nohup ./start-cluster.sh &
[1]+  Done                    nohup ./start-cluster.sh
[root@hadoopmaster bin]# jps
12480 DataNode
13123 NodeManager
22758 DriverWrapper
24457 Jps
21901 QuorumPeerMain
24334 TaskManagerRunner
22481 RunJar
20562 Master
12722 SecondaryNameNode
12339 NameNode
12980 ResourceManager
13527 JobHistoryServer
22263 Kafka
20701 Worker
22846 CoarseGrainedExecutorBackend
[root@hadoopmaster bin]# 


--设置环境变量
export HADOOP_CLASSPATH=`$HADOOP_HOME/bin/hadoop classpath` 
--启动集群
nohup ./start-cluster.sh &

--停止集群
./stop-cluster.sh

--启动flinksql命令行工具
./sql-client.sh embedded  
```

