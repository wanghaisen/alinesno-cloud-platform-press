# flink 安装

## 本内容你将获得

- 在 centos7 上安装 flink

## 软件安装

##### 说明

- flink依赖scala环境

### 安装开始

##### 上传flink-1.14.5-bin-scala_2.12.tgz到服务器/root/tools目录

解压安装包

```bash
cd /root/tools
tar -zxvf flink-1.14.5-bin-scala_2.12.tgz
mv flink-1.14.5-bin-scala_2.12 flink-1.14.5
```

##### 创建临时目录文件

```shell
mkdir -p /root/flink/tmp
mkdir -p /root/flink/flink-1.14.5/tmp/zookeeper
```

##### 修改flink-conf.yaml

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
fs.default-scheme: hdfs:192.168.17.149:9000

#rest.port: 8081  # 在下面增加
rest.port: 8083

# taskmanager.memory.flink.size: 1280m 修改为
taskmanager.memory.flink.size: 1280m

# 在文件末尾增加
classloader.check-leaked-classloader: false
taskmanager.host: localhost
```

##### 修改zoo.cfg

```bash
cd /root/tools/flink-1.14.5/conf
vi zoo.cfg

# dataDir=/tmp/zookeeper # 在下面增加
dataDir=/root/flink/flink-1.14.5/tmp/zookeeper
```

##### 修改masters

```shell
cd /root/tools/flink-1.14.5/conf
vi masters
localhost:8083    #修改localhost:8081为8083，与flink-conf.yaml中修改后的rest.port一致
```

##### 复制 hadoop 集群配置文件

```bash
cd $HADOOP_HOME//etc/hadoop
cp hdfs-site.xml /root/tools/flink-1.14.5/conf
cp core-site.xml /root/tools/flink-1.14.5/conf
cd /root/tools/hive-3.1.3/conf
cp hive-site.xml /root/tools/flink-1.14.5/conf
```

##### 启停

```shell
cd /root/tools/flink-1.14.5/bin
export HADOOP_CLASSPATH=`$HADOOP_HOME/bin/hadoop classpath`  #设置环境变量
nohup ./start-cluster.sh &                                   #启动集群
./stop-cluster.sh                                            #停止集群
./sql-client.sh embedded                                     #启动flinksql命令行工具 
```

## 其他

- 无