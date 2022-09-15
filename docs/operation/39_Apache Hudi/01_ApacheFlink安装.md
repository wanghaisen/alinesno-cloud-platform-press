# Flink 安装

## 本内容你将获得

如何在 centos7 服务器上安装 flink

## Flink 依赖的环境

| 软件名称 | 版本号    |
| -------- | --------- |
| hadoop   | 1.8.0_333 |
| hive     | 3.1.3     |
| SCALA    | 2.12.15   |

## Flink 安装

登录官网https://flink.apache.org/downloads.html

下载 flink-1.14.5-bin-scala_2.12.tgz 并上传 至 Linux 服务器/root/flink 目录。此服务器为 CDH6.2.0 的 dataNode 节点。

1、解压

```bash
cd /root/flink
tar -zxvf flink-1.14.5-bin-scala_2.12.tgz

创建临时目录文件
mkdir -p /root/flink/tmp
mkdir -p /root/flink/flink-1.14.5/tmp/zookeeper
```

2、修改配置文件 flink-conf.yaml

```shell
cd /root/flink/flink-1.14.5/conf
vi flink-conf.yaml
# 修改以下内容为4
taskmanager.numberOfTaskSlots: 8

# state.backend: filesystem  # 在下面增加
state.backend: rocksdb  

# classloader.resolve-order: child-first # 在下面增加
classloader.resolve-order: parent-first

# fs.default-scheme # 在下面增加
fs.default-scheme: hdfs:172.17.49.195:9000

# 在文件末尾增加
classloader.check-leaked-classloader: false
taskmanager.host: localhost
```

3、修改配置文件 zoo.cfg

```bash
cd /root/flink/flink-1.14.5/conf
vi zoo.cfg

# dataDir=/tmp/zookeeper # 在下面增加
dataDir=/root/flink/flink-1.14.5/tmp/zookeeper
```

4、复制 hadoop 集群配置文件

```bash
[root@hadoopmaster conf]# cd $HADOOP_HOME//etc/hadoop
[root@hadoopmaster hadoop]# ls -alt
total 232
drwxr-xr-x 3 1024 1024  4096 Sep 14 15:57 .
-rw-r--r-- 1 1024 1024  6348 Sep 14 15:57 yarn-env.sh
-rw-r--r-- 1 root root  6329 Sep 14 15:56 yarn-env.sh_20220914bak
-rw-r--r-- 1 1024 1024 16759 Sep 14 15:53 hadoop-env.sh
-rw-r--r-- 1 root root 16654 Sep 14 15:46 hadoop-env.sh_20220914bak
-rw-r--r-- 1 1024 1024  2963 Sep 14 15:45 yarn-site.xml
-rw-r--r-- 1 root root   690 Sep 14 15:42 yarn-site.xml_20220914bak
-rw-r--r-- 1 1024 1024  1636 Sep 14 15:40 mapred-site.xml
-rw-r--r-- 1 root root   758 Sep 14 15:37 mapred-site.xml_20220914bak
-rw-r--r-- 1 1024 1024  1089 Sep 14 15:34 hdfs-site.xml
-rw-r--r-- 1 root root   775 Sep 14 15:32 hdfs-site.xml_20220914bak
-rw-r--r-- 1 1024 1024  1288 Sep 14 15:13 core-site.xml
-rw-r--r-- 1 root root   774 Sep 14 15:10 core-site.xml_20220914bak
-rw-r--r-- 1 1024 1024  1335 Jul 29 21:22 configuration.xsl
-rw-r--r-- 1 1024 1024   951 Jul 29 21:22 mapred-env.cmd
-rw-r--r-- 1 1024 1024  1764 Jul 29 21:22 mapred-env.sh
-rw-r--r-- 1 1024 1024  4113 Jul 29 21:22 mapred-queues.xml.template
-rw-r--r-- 1 1024 1024  9213 Jul 29 21:19 capacity-scheduler.xml
-rw-r--r-- 1 1024 1024  2591 Jul 29 21:19 yarnservice-log4j.properties
-rw-r--r-- 1 1024 1024  2567 Jul 29 21:19 container-executor.cfg
-rw-r--r-- 1 1024 1024  2250 Jul 29 21:19 yarn-env.cmd
-rw-r--r-- 1 1024 1024   683 Jul 29 20:49 hdfs-rbf-site.xml
-rw-r--r-- 1 1024 1024  1484 Jul 29 20:47 httpfs-env.sh
-rw-r--r-- 1 1024 1024  1657 Jul 29 20:47 httpfs-log4j.properties
-rw-r--r-- 1 1024 1024   620 Jul 29 20:47 httpfs-site.xml
-rw-r--r-- 1 1024 1024  2681 Jul 29 20:41 user_ec_policies.xml.template
drwxr-xr-x 3 1024 1024  4096 Jul 29 20:35 ..
-rw-r--r-- 1 1024 1024  3518 Jul 29 20:35 kms-acls.xml
-rw-r--r-- 1 1024 1024  1351 Jul 29 20:35 kms-env.sh
-rw-r--r-- 1 1024 1024  1860 Jul 29 20:35 kms-log4j.properties
-rw-r--r-- 1 1024 1024   682 Jul 29 20:35 kms-site.xml
-rw-r--r-- 1 1024 1024  3999 Jul 29 20:34 hadoop-env.cmd
-rw-r--r-- 1 1024 1024  3321 Jul 29 20:34 hadoop-metrics2.properties
-rw-r--r-- 1 1024 1024 11765 Jul 29 20:34 hadoop-policy.xml
-rw-r--r-- 1 1024 1024  3414 Jul 29 20:34 hadoop-user-functions.sh.example
-rw-r--r-- 1 1024 1024 13700 Jul 29 20:34 log4j.properties
drwxr-xr-x 2 1024 1024  4096 Jul 29 20:34 shellprofile.d
-rw-r--r-- 1 1024 1024  2316 Jul 29 20:34 ssl-client.xml.example
-rw-r--r-- 1 1024 1024  2697 Jul 29 20:34 ssl-server.xml.example
-rw-r--r-- 1 1024 1024    10 Jul 29 20:34 workers
[root@hadoopmaster hadoop]# cp hdfs-site.xml /root/tools/flink-1.14.5/conf
[root@hadoopmaster hadoop]# cp core-site.xml /root/tools/flink-1.14.5/conf
[root@hadoopmaster hadoop]# cp hive-site.xml /root/tools/flink-1.14.5/conf
```

5、启停

```
[root@hadoopmaster ~]# cd /root/tools/flink-1.14.5/bin
[root@hadoopmaster bin]# ls -alt
total 2356
drwxr-xr-x  2 502 games    4096 Sep 15 10:08 .
drwxr-xr-x 10 502 games    4096 Jun 10 14:34 ..
-rw-r--r--  1 502 games 2290643 Jun 10 14:34 bash-java-utils.jar
-rwxr-xr-x  1 502 games   20576 Jun  8 20:45 config.sh
-rwxr-xr-x  1 502 games    4247 May 23 10:42 flink-console.sh
-rwxr-xr-x  1 502 games    6584 May 23 10:42 flink-daemon.sh
-rwxr-xr-x  1 502 games    1650 May 23 10:42 kubernetes-jobmanager.sh
-rwxr-xr-x  1 502 games    1770 May 23 10:42 kubernetes-taskmanager.sh
-rwxr-xr-x  1 502 games    2960 May 23 10:42 taskmanager.sh
-rwxr-xr-x  1 502 games    3742 Dec 27  2021 sql-client.sh
-rwxr-xr-x  1 502 games    2994 Dec 27  2021 pyflink-shell.sh
-rwxr-xr-x  1 502 games    2381 Dec 27  2021 flink
-rwxr-xr-x  1 502 games    1717 Dec 27  2021 kubernetes-session.sh
-rwxr-xr-x  1 502 games    1725 Dec 27  2021 yarn-session.sh
-rwxr-xr-x  1 502 games    2006 Sep  2  2021 standalone-job.sh
-rwxr-xr-x  1 502 games    2405 Apr  2  2021 zookeeper.sh
-rwxr-xr-x  1 502 games    2295 Feb  7  2021 jobmanager.sh
-rwxr-xr-x  1 502 games    1318 Dec  8  2020 find-flink-home.sh
-rwxr-xr-x  1 502 games    1564 Dec  8  2020 historyserver.sh
-rwxr-xr-x  1 502 games    1837 Dec  8  2020 start-cluster.sh
-rwxr-xr-x  1 502 games    1854 Dec  8  2020 start-zookeeper-quorum.sh
-rwxr-xr-x  1 502 games    1617 Dec  8  2020 stop-cluster.sh
-rwxr-xr-x  1 502 games    1845 Dec  8  2020 stop-zookeeper-quorum.sh
[root@hadoopmaster bin]# export HADOOP_CLASSPATH=`$HADOOP_HOME/bin/hadoop classpath` 
[root@hadoopmaster bin]# nohup ./start-cluster.sh &
[1] 23725
[root@hadoopmaster bin]# nohup: ignoring input and appending output to ‘nohup.out’

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

