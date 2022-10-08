# kafka安装

## 本内容你将获得

- 如何在 centos7 服务器上安装 kafka自带的zookeeper
- 如何在 centos7 服务器上安装 kafka

## 部署

1、登录kafka官网,下载 [kafka_2.12-3.2.0.tgz](https://archive.apache.org/dist/kafka/3.2.0/kafka_2.12-3.2.0.tgz)

2、上传到服务器并解压

```java
[root@hadoopmaster tools]# tar -zxvf kafka_2.12-3.2.0.tgz
```

3、配置zookeeper

```shell
[root@hadoopmaster tools]# cd kafka_2.12-3.2.0                #进入kafka安装目录
[root@hadoopmaster kafka_2.12-3.2.0]# mkdir -p zk/data        #创建zookeeper数据存放目录
[root@hadoopmaster kafka_2.12-3.2.0]# mkdir -p zk/logs        #创建zookeeper日志存放目录
[root@hadoopmaster kafka_2.12-3.2.0]# cd config/
[root@hadoopmaster config]# cp zookeeper.properties zookeeper.properties.20220915bak
[root@hadoopmaster config]# vi zookeeper.properties
dataDir=/root/tools/kafka_2.12-3.2.0/zk/data                #修改数据存放目录
dataLogDir=/root/tools/kafka_2.12-3.2.0/zk/logs/            #增加日志存放目录
# the port at which the clients will connect
clientPort=2181
# disable the per-ip limit on the number of connections since this is a non-production config
maxClientCnxns=0
# Disable the adminserver by default to avoid port conflicts.
# Set the port to something non-conflicting if choosing to enable this
admin.enableServer=false
# admin.serverPort=8080
```

4、配置kafka

```
[root@hadoopmaster kafka_2.12-3.2.0]# mkdir logs
[root@hadoopmaster kafka_2.12-3.2.0]# cd logs
[root@hadoopmaster logs]# pwd
/root/tools/kafka_2.12-3.2.0/log
[root@hadoopmaster kafka_2.12-3.2.0]# cd ../conf
[root@hadoopmaster kafka_2.12-3.2.0]# cd config
[root@hadoopmaster config]# cp server.properties server.properties.20220915bak
修改server.properties文件

在#listeners=PLAINTEXT://:9092下面增加如下配置
listeners=PLAINTEXT://192.168.17.149:9092               #局域网地址
advertised.listeners=PLAINTEXT://192.168.17.149:9092    #公网地址

log.dirs=/tmp/kafka-logs                               #修改为 log.dirs=/root/tools/kafka_2.12-3.2.0/logs

zookeeper.connect=localhost:2181                       #修改为 zookeeper.connect=192.168.17.149:2181

zookeeper.session.timeout.ms=400000                    #增加此配置项

```

5、启动

```shell
[root@hadoopmaster tools]# cd /root/tools/kafka_2.12-3.2.0/bin
[root@hadoopmaster bin]#nohup sh  zookeeper-server-start.sh -daemon ../config/zookeeper.properties 1>/dev/null 2>&1 &  #启动zookeeper
[root@hadoopmaster bin]#nohup sh  kafka-server-start.sh -daemon ../config/server.properties  1>/dev/null 2>&1 &        #启动kafka
[root@hadoopmaster bin]# netstat -anlp |grep 2181                                             #检查zookeeper端口
tcp6       0      0 :::2181                 :::*                    LISTEN      21901/java          
tcp6       0      0 192.168.17.149:58404     192.168.17.149:2181      ESTABLISHED 22263/java          
tcp6       0      0 192.168.17.149:2181      192.168.17.149:58404     ESTABLISHED 21901/java          
[root@hadoopmaster bin]# 
[root@hadoopmaster bin]# jps      #检查kafka进程是否启动
12480 DataNode
20562 Master
12722 SecondaryNameNode
22355 Jps
13123 NodeManager
12339 NameNode
12980 ResourceManager
13527 JobHistoryServer
22263 Kafka
20701 Worker
21901 QuorumPeerMain
[root@hadoopmaster bin]# 
```

5、停止

```shell
[root@hadoopmaster tools]# cd /root/tools/kafka_2.12-3.2.0/bin
./zookeeper-server-stop.sh    #停止zookeeper
./kafka-server-stop.sh        #停止kafka
```

## 其他

- 无