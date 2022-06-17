# Hudi 安装

## 本内容你将获得

- 如何在 centos7 服务器上安装 hudi
- 在 flinksql 中接收 kafka 消息，并将消息写入 hudi 表

## Hudi 依赖的环境

| 软件名称    | 版本号         | 备注                                   |
| ----------- | -------------- | -------------------------------------- |
| JDK         | 1.8.0_181      | 复用 CDH6.2.0 的 JDK                   |
| SCALA       | 2.12.15        |                                        |
| Flink       | 1.14.4         |                                        |
| Hadoop 集群 | 3.0.0+cdh6.2.0 | 安装 CDH6.2.0 集群及 hdfs、hive 等实例 |
| kafka       | 2.12-3.2.0     |                                        |

## 部署

1、登录 https://repo.maven.apache.org/maven2/org/apache/hudi/hudi-flink1.14-bundle_2.12/0.11.0/下载

​ [hudi-flink1.14-bundle_2.12-0.11.0.jar](https://repo.maven.apache.org/maven2/org/apache/hudi/hudi-flink1.14-bundle_2.12/0.11.0/hudi-flink1.14-bundle_2.12-0.11.0.jar)

2、登录https://repo1.maven.org/maven2/org/apache/flink/flink-connector-kafka_2.12/1.14.4/，下载

​ [flink-connector-kafka_2.12-1.14.4.jar](https://repo1.maven.org/maven2/org/apache/flink/flink-connector-kafka_2.12/1.14.4/flink-connector-kafka_2.12-1.14.4.jar)

3、登录https://repo1.maven.org/maven2/org/apache/flink/flink-sql-connector-kafka_2.12/1.14.4/，下载

​ [flink-sql-connector-kafka_2.12-1.14.4.jar](https://repo1.maven.org/maven2/org/apache/flink/flink-sql-connector-kafka_2.12/1.14.4/flink-sql-connector-kafka_2.12-1.14.4.jar)

4、将下载的 3 个 jar 包上传到 Flink1.14.4 的 lib 目录

```bash
[root@cdh-slave config]# cd /root/flink/flink-1.14.4/lib
You have new mail in /var/spool/mail/root
[root@cdh-slave lib]# ls -alt
total 231872
-rw-r--r--  1 root root    389154 Jun 13 15:34 flink-connector-kafka_2.12-1.14.4.jar
drwxr-xr-x  2 lgb  1001      4096 Jun 13 15:34 .
-rw-r--r--  1 root root   3704559 Jun 13 15:34 flink-sql-connector-kafka_2.12-1.14.4.jar
drwxr-xr-x 12 lgb  1001      4096 Jun 13 15:32 ..
-rw-r--r--  1 root root  47340482 Jun 10 12:16 hudi-flink1.14-bundle_2.12-0.11.0.jar
-rw-r--r--  1 lgb  1001 136063964 Feb 25 20:49 flink-dist_2.12-1.14.4.jar
-rw-r--r--  1 lgb  1001  39635530 Feb 25 20:48 flink-table_2.12-1.14.4.jar
-rw-r--r--  1 lgb  1001     85584 Feb 25 20:46 flink-csv-1.14.4.jar
-rw-r--r--  1 lgb  1001    153145 Feb 25 20:45 flink-json-1.14.4.jar
-rw-r--r--  1 lgb  1001    208006 Jan 13 19:06 log4j-1.2-api-2.17.1.jar
-rw-r--r--  1 lgb  1001    301872 Jan  7 18:07 log4j-api-2.17.1.jar
-rw-r--r--  1 lgb  1001   1790452 Jan  7 18:07 log4j-core-2.17.1.jar
-rw-r--r--  1 lgb  1001     24279 Jan  7 18:07 log4j-slf4j-impl-2.17.1.jar
-rw-r--r--  1 lgb  1001   7709731 Sep 10  2021 flink-shaded-zookeeper-3.4.14.jar
[root@cdh-slave lib]#
```

5、配置环境变量

```bash
cd /etc
vi profile
export HADOOP_HOME=/opt/cloudera/parcels/CDH
export JAVA_HOME=/usr/java/jdk1.8.0_181-cloudera
export JRE_HOME=/usr/java/jdk1.8.0_181-cloudera/jre
export SCALA_HOME=/usr/local/scala-2.12.15
export FLINK_HOME=/root/flink/flink-1.14.4
export HADOOP_CONF_DIR=/etc/hadoop/conf
export HADOOP_CLASSPATH=`hadoop classpath`
export HBASE_CONF_DIR=/etc/hbase/conf
export HIVE_HOME=/opt/cloudera/parcels/CDH/lib/hive
export HIVE_CONF_DIR=/etc/hive/conf
export SPARK_HOME=/opt/cloudera/parcels/CDH
export HADOOP_HOME=/opt/cloudera/parcels/CDH

export PATH=$JAVA_HOME/bin:$SCALA_HOME/bin:$FLINK_HOME/bin:$JRE_HOME/bin:${M2_HOME}/bin:${HIVE_HOME}/bin:{SPARK_HOME}/bin:{HADOOP_HOME}/bin:$PATH:
export CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar:$SCALA_HOME/lib:$FLINK_HOME/lib:$JRE_HOME/lib:$CLASSPATH

保存后，执行source profile，使环境变量生效
```

## 调试

### 启动 flink 集群

```
cd /root/flink/flink-1.14.4/bin

--设置环境变量
export HADOOP_CLASSPATH=`$HADOOP_HOME/bin/hadoop classpath`

--启动集群
./start-cluster.sh
```

### 关停集群

```
cd /root/flink/flink-1.14.4/bin
./stop-cluster.sh
```

### 启动 kafka 集群

#### 启动 kafka

```bash
cd /root/flink/kafka_2.12-3.2.0/bin
nohup sh kafka-server-start.sh ../config/server.properties & 非守护进程启动，容易异常死亡：

nohup sh kafka-server-start.sh -daemon ../config/server.properties 1>/dev/null 2>&1 & 守护进程启动，防止异常死亡：
```

#### 创建 topic

```bash
cd /root/flink/kafka_2.12-3.2.0/bin
./kafka-topics.sh --create --bootstrap-server 192.168.17.147:9092 --replication-factor 1 --partitions 1 --topic flinktest
```

#### 查看当前 topic 列表

```bash
cd /root/flink/kafka_2.12-3.2.0/bin
./kafka-topics.sh --list --bootstrap-server 192.168.17.147:9092
```

#### topic 删除

```bash
cd /root/flink/kafka_2.12-3.2.0/bin
./kafka-topics.sh --delete --bootstrap-server 192.168.17.147:9092  --topic flinktest
```

#### 修改 topic 的 partition 数

```
cd /root/flink/kafka_2.12-3.2.0/bin
./kafka-topics.sh --bootstrap-server 192.168.17.147:9092 --alter --topic flinktest --partitions 5
```

#### 查看 topic 的消息

```bash
./kafka-topics.sh --describe --bootstrap-server 192.168.17.147:9092
```

#### 使用 kafka-console-producer.sh 命令向 topic flinktest 发送消息

```
cd /root/flink/kafka_2.12-3.2.0/bin
sh kafka-console-producer.sh --broker-list 192.168.17.146:9092 --topic flinktest
//生产端发消息
{"tinyint0": 6, "smallint1": 223, "int2": 42999, "bigint3": 429450, "float4": 95.47324181659323, "double5": 340.5755392968011,"decimal6": 111.1111, "boolean7": true,  "char8": "dddddd", "varchar9": "buy0", "string10": "buy1", "timestamp11": "2021-09-13 03:08:50.810"}
{"tinyint0": 7, "smallint1": 224, "int2": 43000, "bigint3": 429451, "float4": 95.47324181659324, "double5": 340.5755392968012,"decimal6": 111.1112, "boolean7": true,  "char8": "ddddde", "varchar9": "buy1", "string10": "buy1", "timestamp11": "2021-09-13 03:08:50.812"}
```

#### 使用 kafka-console-consumer.sh 消费消息

```bash
cd /root/flink/kafka_2.12-3.2.0/bin
sh kafka-console-consumer.sh --bootstrap-server 192.168.17.147:9092   --topic flinktest --from-beginning
```

### 启动 flinksql

```bash
cd /root/flink/flink-1.14.4/bin

--设置环境变量
export HADOOP_CLASSPATH=`$HADOOP_HOME/bin/hadoop classpath`

./sql-client.sh embedded -j /root/flink/flink-1.14.4/lib/hudi-flink1.14-bundle_2.12-0.11.0.jar
```

#### 新建与 kafka 关联的表

```sql
CREATE TABLE kafkatest (
   tinyint0 TINYINT
  ,smallint1 SMALLINT
  ,int2 INT
  ,bigint3 BIGINT
  ,float4 FLOAT
  ,double5 DOUBLE
  ,decimal6 DECIMAL(38,8)
  ,boolean7 BOOLEAN
  ,char8 STRING
  ,varchar9 STRING
  ,string10 STRING
  ,timestamp11 STRING
) WITH (
    'connector' = 'kafka',   -- 使用 kafka connector
    'topic' = 'flinktest',   -- kafka topic名称
    'scan.startup.mode' = 'earliest-offset',  -- 从起始 offset 开始读取
    'properties.bootstrap.servers' = '192.168.17.146:9092',  -- kafka broker 地址
    'properties.group.id' = 'testgroup1',
    'value.format' = 'json',
    'value.json.fail-on-missing-field' = 'true',
    'value.fields-include' = 'ALL'
);
```

#### 查询表

在 kafka 生产端，发消息后，可看到表接收到的数据

```js
//生产端发消息
{"tinyint0": 6, "smallint1": 223, "int2": 42999, "bigint3": 429450, "float4": 95.47324181659323, "double5": 340.5755392968011,"decimal6": 111.1111, "boolean7": true,  "char8": "dddddd", "varchar9": "buy0", "string10": "buy1", "timestamp11": "2021-09-13 03:08:50.810"}
{"tinyint0": 7, "smallint1": 224, "int2": 43000, "bigint3": 429451, "float4": 95.47324181659324, "double5": 340.5755392968012,"decimal6": 111.1112, "boolean7": true,  "char8": "ddddde", "varchar9": "buy1", "string10": "buy1", "timestamp11": "2021-09-13 03:08:50.812"}
```

```sql
select * from kafkatest
```

#### 新建与 hudi 关联的表

```sql
CREATE TABLE huditest(
		  uuid VARCHAR(20),
		  name VARCHAR(10),
		  age INT,
		  ts TIMESTAMP(3),
		  `partition` VARCHAR(20)
		)
		PARTITIONED BY (`partition`)
		WITH (
			'connector' = 'hudi',
			'path' = 'hdfs:///user/flink/hudi/huditest',
			'table.type' = 'MERGE_ON_READ' -- this creates a MERGE_ON_READ table, by default is COPY_ON_WRITE
			'write.operation' = 'upsert',
			'hoodie.datasource.write.recordkey.field'= 'uuid',
			'write.precombine.field' = 'ts',
			'write.tasks'= '1',
			'compaction.tasks' = '1',
			'compaction.async.enabled' = 'true',
			'compaction.trigger.strategy' = 'num_commits',
			'compaction.delta_commits' = '1'
		);
```

#### 插入数据

```sql
        INSERT INTO huditest VALUES
		  ('id1','Danny',23,TIMESTAMP '1970-01-01 00:00:01','par1');
		INSERT INTO huditest VALUES
		  ('id2','Stephen',33,TIMESTAMP '1970-01-01 00:00:02','par1');
		INSERT INTO huditest VALUES
		  ('id3','Julian',53,TIMESTAMP '1970-01-01 00:00:03','par2');
		INSERT INTO huditest VALUES
		  ('id4','Fabian',31,TIMESTAMP '1970-01-01 00:00:04','par2');
		INSERT INTO huditest VALUES
		  ('id5','Sophia',18,TIMESTAMP '1970-01-01 00:00:05','par3');
		INSERT INTO huditest VALUES
		  ('id6','Emma',20,TIMESTAMP '1970-01-01 00:00:06','par3');
		INSERT INTO huditest VALUES
		  ('id7','Bob',44,TIMESTAMP '1970-01-01 00:00:07','par4');
		INSERT INTO huditest VALUES
		  ('id8','Han',56,TIMESTAMP '1970-01-01 00:00:08','par4');
```

#### 查看 hudi 表的 hdfs 文件变化

验证在 hdfs 中新建了 hudi 表并写入了相应的数据

```bash
hadoop fs -ls hdfs:///user/flink/hudi/huditest
hadoop fs -ls hdfs:///user/flink/hudi/huditest/par1
```
