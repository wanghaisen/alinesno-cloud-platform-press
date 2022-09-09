# Hudi 安装

## 本内容你将获得

- 如何在 centos7 服务器上安装 hudi
- 在 flinksql 中接收 kafka 消息，并将消息写入 hudi 表
- 在 flinksql 中创建关联hudi的表，写入hudi表时同步到hive表

## Hudi 依赖的环境

| 软件名称 | 版本号     |
| -------- | ---------- |
| JDK      | 1.8.0_181  |
| SCALA    | 2.12.15    |
| Flink    | 1.14.4     |
| Hadoop   | 3.3.4      |
| hive     | 3.1.3      |
| kafka    | 2.12-3.2.0 |

## 部署

需要以root用户部署Hadoop 、hive、flink

1、打开https://gitee.com/apache/Hudi.git,下载hudi源码并切换到0.11.0，

A、修改Hudi\pom.xml中kafka、hadoop、hive、spark2、scala12、scala.binary的版本

```java
   <kafka.version>2.0.0</kafka.version>                 ->  <kafka.version>3.2.0</kafka.version>
   <hadoop.version>2.10.1</hadoop.version>              ->  <hadoop.version>3.3.4</hadoop.version>
   <hive.version>2.3.1</hive.version>                   ->  <hive.version>3.1.3</hive.version>
   <spark2.version>2.4.4</spark2.version>               ->  <spark2.version>2.4.8</spark2.version>
   <scala12.version>2.12.10</scala12.version>           ->  <scala12.version>2.12.15</scala12.version> 
   <scala.binary.version>2.11</scala.binary.version>    -> <scala.binary.version>2.12</scala.binary.version> 
       
       
```

B、修改Hudi\packaging\hudi-flink-bundle\pom.xml中hive的版本

```java
<hive.version>2.3.1</hive.version>                ->   <hive.version>3.1.3</hive.version>
<id>flink-bundle-shade-hive3</id>
      <properties>
        <hive.version>3.1.2</hive.version>        ->   <hive.version>3.1.3</hive.version>
        <flink.bundle.hive.scope>compile</flink.bundle.hive.scope>
      </properties>    
```

C、修改Hudi\hudi-common\src\main\java\org\apache\hudi\common\table\log\block\HoodieParquetDataBlock.java中的构造函数，避免编译报错

```java
try (FSDataOutputStream outputStream = new FSDataOutputStream(baos)) -> try (FSDataOutputStream outputStream = new FSDataOutputStream(baos,null)) 
```

D、修改完成后，进入Hudi\packaging\hudi-flink-bundle目录，执行 mvn clean install -DskipTests -Drat.skip=true -Pflink-bundle-shade-hive3 进行编译。

在Hud\packaging\hudi-flink-bundle\target目录下，得到 hudi-flink1.14-bundle_2.12-0.11.0.jar 

E、进入Hudi\packaging/hudi-hadoop-mr-bundle 目录，执行命令：
mvn clean install -DskipTests

在Hudi\packaging\hudi-hadoop-mr-bundle\target目录下，得到 hudi-hadoop-mr-bundle-0.11.0.jar

F、进入Hudi\packaging/hudi-hive-sync-bundle 目录，执行命令：
mvn clean install -DskipTests

在Hudi\packaging\hudi-hive-sync-bundle\target目录下，得到hudi-hive-sync-bundle-0.11.0.jar

G、在hive目录下，创建auxlib目录，拷贝上面E、F打包好的jar包到目录中



2、登录maven仓库https://mvnrepository.com/，搜索flink-connector-kafka，下载对应的版本。 https://repo1.maven.org/maven2/org/apache/flink/flink-connector-kafka_2.12/1.14.4/

 [flink-connector-kafka_2.12-1.14.4.jar](https://repo1.maven.org/maven2/org/apache/flink/flink-connector-kafka_2.12/1.14.4/flink-connector-kafka_2.12-1.14.4.jar)

3、登录maven仓库https://mvnrepository.com/，搜索 flink-sql-connector-kafka，下载对应的版本。https://repo1.maven.org/maven2/org/apache/flink/flink-sql-connector-kafka_2.12/1.14.4/

 [flink-sql-connector-kafka_2.12-1.14.4.jar](https://repo1.maven.org/maven2/org/apache/flink/flink-sql-connector-kafka_2.12/1.14.4/flink-sql-connector-kafka_2.12-1.14.4.jar)

4、登录maven仓库https://mvnrepository.com/，搜索 kafka-clients，下载对应的版本。https://repo1.maven.org/maven2/org/apache/kafka/kafka-clients/3.2.0/ ，

[kafka-clients-3.2.0.jar](https://repo1.maven.org/maven2/org/apache/kafka/kafka-clients/3.2.0/kafka-clients-3.2.0.jar)

5、登录maven仓库https://mvnrepository.com/，搜索flink-sql-connector-mysql-cdc，下载对应的版本。https://repo1.maven.org/maven2/com/ververica/flink-sql-connector-mysql-cdc/2.2.1/

[flink-sql-connector-mysql-cdc-2.2.1.jar](https://repo1.maven.org/maven2/com/ververica/flink-sql-connector-mysql-cdc/2.2.1/flink-sql-connector-mysql-cdc-2.2.1.jar)

6、打开https://github.com/apache/flink-shaded.git，下载flink-shaded源码并切换到release-10.0版本

A、 修改flink-shaded\pom.xml，在<profiles>增加如下配置，优化网络

```java
<profile>
    <id>vendor-repos</id>
    <activation>
        <property>
            <name>vendor-repos</name>
        </property>
    </activation>   <!-- Add vendor maven repositories -->
    <repositories>       <!-- Cloudera -->
        <repository>
            <id>cloudera-releases</id>
            <url>https://maven.aliyun.com/repository/central</url>
            <releases>
                <enabled>true</enabled>
            </releases>
            <snapshots>
                <enabled>false</enabled>
            </snapshots>
        </repository>
    </repositories>
</profile>
```

B、修改flink-shaded\flink-shaded-hadoop-2-parent\pom.xml

```java
<hadoop.version>2.4.1</hadoop.version>     -> <hadoop.version>3.3.4</hadoop.version>    <!--对应hadoop的版本3.3.4-->
```

C、修改\flink-shaded\flink-shaded-hadoop-2-parent\flink-shaded-hadoop-2\pom.xml

```java
<packaging>jar</packaging>
<version>${hadoop.version}-10.0</version>  -> <version>${hadoop.version}-14.0</version> <!--对应hudi的版本1.14.4-->
```

D、修改flink-shaded\flink-shaded-hadoop-2-parent\flink-shaded-hadoop-2-uber\pom.xml

```java
<packaging>jar</packaging>
<version>${hadoop.version}-10.0</version>  -> <version>${hadoop.version}-14.0</version>  <!--对应hudi的版本1.14.4-->
    
	<dependencies>
		<dependency>
			<groupId>org.apache.flink</groupId>
			<artifactId>flink-shaded-hadoop-2</artifactId>
			<version>${hadoop.version}-10.0</version>    ->  <version>${hadoop.version}-14.0</version> <!--对应hudi的版本1.14.4-->
		</dependency>
		<dependency>                                     ->   <!--增加依赖-->
			<groupId>commons-cli</groupId>
			<artifactId>commons-cli</artifactId>
			<version>1.3.1</version>
		</dependency>
	</dependencies>    
```

最后在flink-shaded目录下，执行 mvn clean install -DskipTests -Dhadoop.version=3.3.4 -Drat.skip=true进行编译，在flink-shaded\flink-shaded-hadoop-2-parent\flink-shaded-hadoop-2-uber\target目录下得到 flink-shaded-hadoop-2-uber-3.3.4-14.0.jar

7、将1、2、3、4、5、6编译和下载的 jar 包上传到 Flink、HIVE 的 lib 目录，最终如下

```bash
[root@hadoopmaster lib]# pwd
/root/tools/flink-1.14.4/lib
[root@hadoopmaster lib]# ls -alt
total 368752
drwxr-xr-x.  3 root root      4096 Sep  5 01:55 .
drwxr-xr-x. 12 root root      4096 Jun 20 16:06 ..
-rw-r--r--.  1 root root  68995619 Sep  5 01:55 flink-shaded-hadoop-2-uber-3.3.4-14.0.jar
-rw-r--r--.  1 root root  90480918 Sep  5 01:09 hudi-flink1.14-bundle_2.12-0.11.0.jar
-rw-r--r--.  1 root root   4941003 Sep  4 13:59 kafka-clients-3.2.0.jar
-rwxr-xr-x.  1 root root    389154 Jun 20 16:05 flink-connector-kafka_2.12-1.14.4.jar
-rw-r--r--.  1 root root  22096298 Jun 21 10:15 flink-sql-connector-mysql-cdc-2.2.1.jar
-rwxr-xr-x.  1 root root   3704559 Jun 20 16:06 flink-sql-connector-kafka_2.12-1.14.4.jar
-rwxr-xr-x.  1 root root 136063964 Jun 20 16:06 flink-dist_2.12-1.14.4.jar
-rwxr-xr-x.  1 root root     24279 Jun 20 16:06 log4j-slf4j-impl-2.17.1.jar
-rwxr-xr-x.  1 root root   1790452 Jun 20 16:06 log4j-core-2.17.1.jar
-rwxr-xr-x.  1 root root    208006 Jun 20 16:06 log4j-1.2-api-2.17.1.jar
-rwxr-xr-x.  1 root root    301872 Jun 20 16:06 log4j-api-2.17.1.jar
-rwxr-xr-x.  1 root root  39635530 Jun 20 16:06 flink-table_2.12-1.14.4.jar
-rwxr-xr-x.  1 root root   7709731 Jun 20 16:06 flink-shaded-zookeeper-3.4.14.jar
-rwxr-xr-x.  1 root root     85584 Jun 20 16:05 flink-csv-1.14.4.jar
-rwxr-xr-x.  1 root root    153145 Jun 20 16:05 flink-json-1.14.4.jar
-rw-r--r--.  1 root root    250229 Feb 25  2022 flink-connector-jdbc_2.12-1.14.4.jar
-rw-r--r--.  1 root root    724213 Apr 21  2015 mysql-connector-java-5.1.9.jar



[root@hadoopmaster auxlib]# pwd
/root/tools/hive-3.1.3/auxlib
[root@hadoopmaster auxlib]# ls -alt
total 66312
drwxrwxr-x.  3 hadoop hadoop      102 Sep  5 01:12 .
drwxrwxr-x. 11 hadoop hadoop     4096 Sep  4 09:50 ..
-rw-r--r--.  1 root   root   35952421 Sep  5 01:11 hudi-hadoop-mr-bundle-0.11.0.jar
-rw-r--r--.  1 root   root   31943015 Sep  5 01:12 hudi-hive-sync-bundle-0.11.0.jar


[root@hadoopmaster lib]# pwd
/root/tools/hive-3.1.3/lib
[root@hadoopmaster lib]# ls -alt |more
total 350648
drwxrwxr-x.  5 hadoop hadoop    12288 Sep  5 01:30 .
drwxrwxr-x. 11 hadoop hadoop     4096 Sep  4 09:50 ..
-rw-r--r--.  1 root   root   35952421 Sep  5 01:30 hudi-hadoop-mr-bundle-0.11.0.jar
-rw-rw-r--.  1 hadoop hadoop  2476480 Sep  3 16:04 mysql-connector-java-8.0.28.jar

```



7、配置环境变量

```bash
cd /etc
vi profile
#java
export JAVA_HOME=/usr/java/jdk1.8.0_181-cloudera
export JRE_HOME=$JAVA_HOME/jre
export PATH=$PATH:$JAVA_HOME/bin
export CLASSPATH=.:$JAVA_HOME/jre/lib:$JAVA_HOME/lib:$JAVA_HOME/lib/tools.jar 

#zookeeper
export ZK_HOME=/home/hadoop/tools/zookeeper-3.6.2
export PATH=$PATH:$ZK_HOME/bin

## HADOOP env variables
export HDFS_NAMENODE_USER=root
export HDFS_DATANODE_USER=root
export HDFS_SECONDARYNAMENODE_USER=root
export YARN_RESOURCEMANAGER_USER=root
export YARN_NODEMANAGER_USER=root
export HADOOP_HOME=/root/tools/hadoop-3.3.4
export HADOOP_COMMON_HOME=$HADOOP_HOME
export HADOOP_HDFS_HOME=$HADOOP_HOME
export HADOOP_MAPRED_HOME=$HADOOP_HOME
export HADOOP_YARN_HOME=$HADOOP_HOME
export HADOOP_OPTS="-Djava.library.path=$HADOOP_HOME/lib/native"
export HADOOP_COMMON_LIB_NATIVE_DIR=$HADOOP_HOME/lib/native
export PATH=$PATH:$HADOOP_HOME/sbin:$HADOOP_HOME/bin

#hive
export HIVE_HOME=/root/tools/hive-3.1.3
export HIVE_CONF_DIR=$HIVE_HOME/conf 
export PATH=$PATH:$HIVE_HOME/sbin:$HIVE_HOME/bin

#flink
export SCALA_HOME=/root/tools/scala-2.12.15
export FLINK_HOME=/root/tools/flink-1.14.4

保存后，执行source profile，使环境变量生效
```

## 调试1：flinksql 中接收 kafka 消息，并将消息写入 hudi 表

### 启动 flink 集群

```
cd /root/tools/flink-1.14.4/bin

--设置环境变量
export HADOOP_CLASSPATH=`$HADOOP_HOME/bin/hadoop classpath`

--启动集群
./start-cluster.sh
```

### 关停集群

```
cd /root/tools/flink-1.14.4/bin
./stop-cluster.sh
```

### 启动 kafka 集群

#### 启动 kafka

```bash
cd /root/tools/kafka_2.12-3.2.0/bin
nohup sh kafka-server-start.sh ../config/server.properties & 非守护进程启动，容易异常死亡：

nohup sh kafka-server-start.sh -daemon ../config/server.properties 1>/dev/null 2>&1 & 守护进程启动，防止异常死亡：
```

#### 创建 topic

```bash
cd /root/tools/kafka_2.12-3.2.0/bin
./kafka-topics.sh --create --bootstrap-server 192.168.17.149:9092 --replication-factor 1 --partitions 1 --topic flinktest
```

#### 查看当前 topic 列表

```bash
cd /root/tools/kafka_2.12-3.2.0/bin
./kafka-topics.sh --list --bootstrap-server 192.168.17.149:9092
```

#### topic 删除

```bash
cd /root/tools/kafka_2.12-3.2.0/bin
./kafka-topics.sh --delete --bootstrap-server 192.168.17.149:9092  --topic flinktest
```

#### 修改 topic 的 partition 数

```
cd /root/tools/kafka_2.12-3.2.0/bin
./kafka-topics.sh --bootstrap-server 192.168.17.149:9092 --alter --topic flinktest --partitions 5
```

#### 查看 topic 的消息

```bash
./kafka-topics.sh --describe --bootstrap-server 192.168.17.149:9092
```

#### 使用 kafka-console-producer.sh 命令向 topic flinktest 发送消息

```
cd /root/tools/kafka_2.12-3.2.0/bin
sh kafka-console-producer.sh --broker-list 192.168.17.149:9092 --topic flinktest
//生产端发消息
{"tinyint0": 6, "smallint1": 223, "int2": 42999, "bigint3": 429450, "float4": 95.47324181659323, "double5": 340.5755392968011,"decimal6": 111.1111, "boolean7": true,  "char8": "dddddd", "varchar9": "buy0", "string10": "buy1", "timestamp11": "2021-09-13 03:08:50.810"}
{"tinyint0": 7, "smallint1": 224, "int2": 43000, "bigint3": 429451, "float4": 95.47324181659324, "double5": 340.5755392968012,"decimal6": 111.1112, "boolean7": true,  "char8": "ddddde", "varchar9": "buy1", "string10": "buy1", "timestamp11": "2021-09-13 03:08:50.812"}
```

#### 使用 kafka-console-consumer.sh 消费消息

```bash
cd /root/tools/kafka_2.12-3.2.0/bin
sh kafka-console-consumer.sh --bootstrap-server 192.168.17.149:9092   --topic flinktest --from-beginning
```

### 启动 flinksql

```bash
cd /root/tools/flink-1.14.4/bin

--设置环境变量
export HADOOP_CLASSPATH=`$HADOOP_HOME/bin/hadoop classpath`

./sql-client.sh embedded -j /root/tools/flink-1.14.4/lib/hudi-flink1.14-bundle_2.12-0.11.0.jar
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
    'properties.bootstrap.servers' = '192.168.17.149:9092',  -- kafka broker 地址
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
			'table.type' = 'MERGE_ON_READ', -- this creates a MERGE_ON_READ table, by default is COPY_ON_WRITE
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
		  ('1','张三',13,TIMESTAMP '2022-09-08 00:00:01','par1');
		INSERT INTO huditest VALUES
		  ('2','李四',28,TIMESTAMP '2022-09-08 00:00:02','par1');
		INSERT INTO huditest VALUES
		  ('3','王五',35,TIMESTAMP '2022-09-08 00:00:03','par2');
		INSERT INTO huditest VALUES
		  ('4','赵六',41,TIMESTAMP '2022-09-08 00:00:04','par2');
		INSERT INTO huditest VALUES
		  ('5','钱七',58,TIMESTAMP '2022-09-08 00:00:05','par3');
		INSERT INTO huditest VALUES
		  ('6','吴八',60,TIMESTAMP '2022-09-08 00:00:06','par3');
		INSERT INTO huditest VALUES
		  ('7','陈九',18,TIMESTAMP '2022-09-08 00:00:07','par4');
		INSERT INTO huditest VALUES
		  ('8','潘十',19,TIMESTAMP '2022-09-08 00:00:08','par4');
```

#### 查看 hudi 表的 hdfs 文件变化

验证在 hdfs 中新建了 hudi 表并写入了相应的数据

```bash
hadoop fs -ls hdfs:///user/flink/hudi/huditest
hadoop fs -ls hdfs:///user/flink/hudi/huditest/par1
```

## 调试2：flinksql 中接收 mysql变更消息

查看数据库是否开启bin_log。如没有开启，需要修改my.cnf文件，增加如下内容并重启

```sql
log-bin=mysql-bin
 binlog-format=ROW
```

在mysql客户端查看bin_log开启情况

```sql
show variables like 'log_bin'

Variable_name	Value
log_bin	        ON
```

打开flinksql客户端并创建关联mysql的表

```sql
CREATE TABLE users_source_mysql (
 id BIGINT PRIMARY KEY NOT ENFORCED
,name STRING
,birthday TIMESTAMP(3)
,ts TIMESTAMP(3)
) WITH(
'connector' = 'mysql-cdc' ,
'hostname'  = '192.168.17.149' ,
'port'      = '3306' ,
'username'  = 'root' ,
'password'  = 'qaz123689' ,
'server-time-zone'        = 'Asia/Shanghai' ,
'debezium. snapshot.mode' = 'initial ' ,
'database-name' = 'test' ,
'table-name' = 'tbl_users'
);

select * from users_source_mysql ;

```

在mysql客户端修改表tbl_users信息、删除表信息、新增记录。flinksql客户端显示mysql表的变更。

## 调试3：flinksql中创建hudi表，并映射到hive表

在hive中创建public数据库后，打开flinksql客户端。

```
CREATE TABLE nation_info(
 numeric_code     int
,national_name    string
,roman_spelling   string
,alphabetic_code  string
,primary key(numeric_code) not enforced
)WITH (
  'connector' = 'hudi',
  'path' = 'hdfs:///user/flink/hudi/public/nation_info',  --hudi表的hdfs存储路径
  'table.type' = 'COPY_ON_WRITE',                         --写时复制模式   
  'write.bucket_assign.tasks' = '1',
  'write.tasks' = '1',
  'hive_sync.enable'= 'true', -- 开启自动同步hive
  'hive_sync.mode'= 'hms',    -- 自动同步hive模式，默认jdbc模式
  'hive_sync.metastore.uris'= 'thrift://192.168.17.149:9083',   -- hive metastore地址
  'hive_sync.jdbc_url' = 'jdbc:hive2://192.168.17.149:10000',   -- required, hiveServer地址
  'hive_sync.table'= 'nation_info',      -- hive 新建表名
  'hive_sync.db'= 'public',              -- hive 新建数据库名
  'hive_sync.username'= 'hive',          -- hive 用户名
  'hive_sync.password'= 'qaz123689',     -- hive 密码
  'hive_sync.support_timestamp'= 'true'  -- 兼容hive timestamp类型
);

insert into nation_info VALUES
(1,'汉族','Han','HA'),
(2,'蒙古族','Mongol','MG'),
(3,'回族','Hui','HU'),
(4,'藏族','',''),
(5,'维吾尔族','',''),
(6,'苗族','Miao','MH'),
(7,'彝族','',''),
(8,'壮族','Zhuang','ZH'),
(9,'布依族','Buyei','BY'),
(10,'朝鲜族','Chosen','CS'),
(11,'满族','Man','MA'),
(12,'侗族','Dong','DO'),
(13,'瑶族','',''),
(14,'白族','Bai','BA'),
(15,'土家族','Tujia','TJ'),
(16,'哈尼族','Hani','HN'),
(17,'哈萨克族','Kazak','KZ'),
(18,'傣族','Dai','DA'),
(19,'黎族','Li','LI'),
(20,'傈僳族','Lisu','LS'),
(21,'佤族','Va','VA'),
(22,'畲族','',''),
(23,'高山族','Gaoshan','GS'),
(24,'拉祜族','Lahu','LH'),
(25,'水族','Sui','SU'),
(26,'东乡族','Dongxiang','DX'),
(27,'纳西族','Naxi','NX'),
(28,'景颇族','Jingpo','JP'),
(29,'柯尔克孜族','Kirgiz','KG'),
(30,'土族','Tu','TU'),
(31,'达斡尔族','Daur','DU'),
(32,'仫佬族','Mulao','ML'),
(33,'羌族','Qiang','QI'),
(34,'布朗族','Blang','BL'),
(35,'撒拉族','',''),
(36,'毛南族','Maonan','MN'),
(37,'仡佬族','Gelao','GL'),
(38,'锡伯族','',''),
(39,'阿昌族','Achang','AC'),
(40,'普米族','',''),
(41,'塔吉克族','',''),
(42,'怒族','Nu','NU'),
(43,'乌孜别克族','Uzbek','UZ'),
(44,'俄罗斯族','Russ','RS'),
(45,'鄂温克族','Ewenki','EW'),
(46,'德昂族','Deang','DE'),
(47,'保安族','Bonan','BN'),
(48,'裕固族','',''),
(49,'京族','Gin','GI'),
(50,'塔塔尔族','',''),
(51,'独龙族','Derung','DR'),
(52,'鄂伦春族','',''),
(53,'赫哲族','Hezhen','HZ'),
(54,'门巴族','Monba','MB'),
(55,'珞巴族','Lhoba','LB'),
(56,'基诺族','Jino','jN'),
(57,'其他','',''),
(58,'外国血统','','');
```

打开hive客户端,可查看到表数据

```sql
select *  from public.nation_info ;

20220905025642928       20220905025642928_0_1   44              67a6d28e-2804-4039-8e75-007e54903a2a_0-1-0_20220905025642928.parquet    44      俄罗斯族        Russ    RS
20220905025642928       20220905025642928_0_2   45              67a6d28e-2804-4039-8e75-007e54903a2a_0-1-0_20220905025642928.parquet    45      鄂温克族        Ewenki  EW
20220905025642928       20220905025642928_0_3   46              67a6d28e-2804-4039-8e75-007e54903a2a_0-1-0_20220905025642928.parquet    46      德昂族  Deang   DE
20220905025642928       20220905025642928_0_4   47              67a6d28e-2804-4039-8e75-007e54903a2a_0-1-0_20220905025642928.parquet    47      保安族  Bonan   BN
20220905025642928       20220905025642928_0_5   48              67a6d28e-2804-4039-8e75-007e54903a2a_0-1-0_20220905025642928.parquet    48      裕固族
20220905025642928       20220905025642928_0_6   49              67a6d28e-2804-4039-8e75-007e54903a2a_0-1-0_20220905025642928.parquet    49      京族    Gin     GI
20220905025642928       20220905025642928_0_7   50              67a6d28e-2804-4039-8e75-007e54903a2a_0-1-0_20220905025642928.parquet    50      塔塔尔族
20220905025642928       20220905025642928_0_8   51              67a6d28e-2804-4039-8e75-007e54903a2a_0-1-0_20220905025642928.parquet    51      独龙族  Derung  DR
20220905025642928       20220905025642928_0_9   52              67a6d28e-2804-4039-8e75-007e54903a2a_0-1-0_20220905025642928.parquet    52      鄂伦春族

show create table public.nation_info ;

CREATE EXTERNAL TABLE `public.nation_info`(
  `_hoodie_commit_time` string COMMENT '', 
  `_hoodie_commit_seqno` string COMMENT '', 
  `_hoodie_record_key` string COMMENT '', 
  `_hoodie_partition_path` string COMMENT '', 
  `_hoodie_file_name` string COMMENT '', 
  `numeric_code` int COMMENT '', 
  `national_name` string COMMENT '', 
  `roman_spelling` string COMMENT '', 
  `alphabetic_code` string COMMENT '')
ROW FORMAT SERDE 
  'org.apache.hadoop.hive.ql.io.parquet.serde.ParquetHiveSerDe' 
WITH SERDEPROPERTIES ( 
  'hoodie.query.as.ro.table'='false', 
  'path'='hdfs:///user/flink/hudi/public/nation_info') 
STORED AS INPUTFORMAT 
  'org.apache.hudi.hadoop.HoodieParquetInputFormat' 
OUTPUTFORMAT 
  'org.apache.hadoop.hive.ql.io.parquet.MapredParquetOutputFormat'
LOCATION
  'hdfs://192.168.17.149:9000/user/flink/hudi/public/nation_info'
TBLPROPERTIES (
  'last_commit_time_sync'='20220905025642928', 
  'spark.sql.sources.provider'='hudi', 
  'spark.sql.sources.schema.numParts'='1', 
  'spark.sql.sources.schema.part.0'='{"type":"struct","fields":[{"name":"_hoodie_commit_time","type":"string","nullable":true,"metadata":{}},{"name":"_hoodie_commit_seqno","type":"string","nullable":true,"metadata":{}},{"name":"_hoodie_record_key","type":"string","nullable":true,"metadata":{}},{"name":"_hoodie_partition_path","type":"string","nullable":true,"metadata":{}},{"name":"_hoodie_file_name","type":"string","nullable":true,"metadata":{}},{"name":"numeric_code","type":"integer","nullable":false,"metadata":{}},{"name":"national_name","type":"string","nullable":true,"metadata":{}},{"name":"roman_spelling","type":"string","nullable":true,"metadata":{}},{"name":"alphabetic_code","type":"string","nullable":true,"metadata":{}}]}', 
  'transient_lastDdlTime'='1662317806')
```

查看hudi表的hdfs文件

```sql
[root@hadoopmaster etc]# hadoop fs -ls hdfs:///user/flink/hudi/public/nation_info
Found 3 items
drwxr-xr-x   - root supergroup          0 2022-09-05 02:56 hdfs:///user/flink/hudi/public/nation_info/.hoodie
-rw-r--r--   3 root supergroup         96 2022-09-05 02:56 hdfs:///user/flink/hudi/public/nation_info/.hoodie_partition_metadata
-rw-r--r--   3 root supergroup     436145 2022-09-05 02:56 hdfs:///user/flink/hudi/public/nation_info/67a6d28e-2804-4039-8e75-007e54903a2a_0-1-0_20220905025642928.parquet
```

