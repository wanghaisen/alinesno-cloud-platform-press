# hudi 安装

## 本内容你将获得

- flink集成kafka、mysql cdc、hudi
- flink sql接收kafka消息
- flink sql接收mysql cdc消息
- flink sql创建hudi表并映射hive表

## 软件安装

#### 说明

- hudi依赖Java、scala、flink环境

- hudi保存数据到hdfs依赖hadoop环境

- hudi映射hive表依赖hive环境

  

### 集成开始

#### 编译jar包

##### 编译hudi  jar包

从hudi代码仓库下载源码并切换到0.12.0分支

修改Hudi\pom.xml中kafka、hadoop、hive、spark2、scala12、scala.binary的版本

```java
 #软件版本与数据环境一致
 <kafka.version>3.2.0</kafka.version>                 //旧：  <kafka.version>2.0.0</kafka.version>
 <hadoop.version>3.3.4</hadoop.version>               //旧：  <hadoop.version>2.10.1</hadoop.version>
 <hive.version>3.1.3</hive.version>                   //旧：  <hive.version>2.3.1</hive.version> 
 <spark2.version>2.4.8</spark2.version>               //旧：  <spark2.version>2.4.4</spark2.version>
 <scala12.version>2.12.15</scala12.version>           //旧：  <scala12.version>2.12.10</scala12.version> 
 <scala.binary.version>2.12</scala.binary.version>    //旧：  <scala.binary.version>2.11</scala.binary.version> 
```

<br/>

修改Hudi\packaging\hudi-flink-bundle\pom.xml中hive的版本

```java
<hive.version>3.1.3</hive.version>                    //旧：  <hive.version>2.3.1</hive.version>
<id>flink-bundle-shade-hive3</id>
<properties>
    <hive.version>3.1.3</hive.version>                //旧：   <hive.version>3.1.2</hive.version>
    <flink.bundle.hive.scope>compile</flink.bundle.hive.scope>
</properties>    
```

<br/>

修改Hudi\hudi-common\src\main\java\org\apache\hudi\common\table\log\block\HoodieParquetDataBlock.java的构造函数

```java
try (FSDataOutputStream outputStream = new FSDataOutputStream(baos,null))  //旧： try (FSDataOutputStream outputStream = new FSDataOutputStream(baos))   //避免编译报错
```

<br/>

###### 编译 hudi-flink1.14-bundle_2.12-0.12.0.jar

进入Hudi\packaging\hudi-flink-bundle目录，执行 mvn clean install -DskipTests -Drat.skip=true -Pflink-bundle-shade-hive3 进行编译

使用压缩工具打开hudi-flink1.14-bundle_2.12-0.12.0.jar(非解压),修改hbase-default.xml、hbase-site.xml中的hbase版本及是否跳过

```Java
<name>hbase.defaults.for.version</name>
<value>2.0.0-alpha4</value>                               //旧：  <value>2.4.9</value>

<name>hbase.defaults.for.version.skip</name>
     <value>true</value>                                  //旧：  <value>false</value>  
```

将hudi-flink1.14-bundle_2.12-0.12.0.jar 上传到 /root/tools/flink-1.14.5/lib目录

<br/>

###### 编译hudi-hadoop-mr-bundle-0.12.0.jar

进入Hudi\packaging\hudi-hadoop-mr-bundle 目录，执行 mvn clean install -DskipTests 进行编译

使用压缩工具打开hudi-hadoop-mr-bundle-0.12.0.jar(非解压),修改hbase-default.xml、hbase-site.xml中的hbase版本及是否跳过

```Java
<name>hbase.defaults.for.version</name>
<value>2.0.0-alpha4</value>                                //旧：  <value>2.4.9</value>

<name>hbase.defaults.for.version.skip</name>
     <value>true</value>                                   //旧：   <value>false</value>
```

将hudi-hadoop-mr-bundle-0.12.0.jar 上传到 /root/tools/hive-3.1.3/auxlib、/root/tools/hive-3.1.3/lib目录

<br/>

###### 编译hudi-hive-sync-bundle-0.12.0.jar

进入Hudi\packaging\hudi-hive-sync-bundle 目录，执行  mvn clean install -DskipTests 进行编译

使用压缩工具打开hudi-hive-sync-bundle-0.12.0.jar(非解压),修改hbase-default.xml、hbase-site.xml中的hbase版本及是否跳过

```Java
<name>hbase.defaults.for.version</name>
<value>2.0.0-alpha4</value>                                //旧：  <value>2.4.9</value>

<name>hbase.defaults.for.version.skip</name>
     <value>true</value>                                   //旧：   <value>false</value>
```

将hudi-hive-sync-bundle-0.12.0.jar 上传到 /root/tools/hive-3.1.3/auxlib目录

<br/>

##### 编译flink-shaded-hadoop jar包

从flink-shaded代码仓库下载源码并切换到release-10.0分支

修改flink-shaded\pom.xml，在\<profiles>增加如下配置，用于优化网络

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

<br/>

修改flink-shaded\flink-shaded-hadoop-2-parent\pom.xml

```java
<hadoop.version>3.3.4</hadoop.version>     //旧：<hadoop.version>2.4.1</hadoop.version>    <!--对应hadoop的版本3.3.4-->
```

<br/>

修改\flink-shaded\flink-shaded-hadoop-2-parent\flink-shaded-hadoop-2\pom.xml

```java
<packaging>jar</packaging>
<version>${hadoop.version}-14.0</version>  //旧：<version>${hadoop.version}-10.0</version>  <!--对应flink的版本1.14.5-->
```

<br/>

修改flink-shaded\flink-shaded-hadoop-2-parent\flink-shaded-hadoop-2-uber\pom.xml

```java
<packaging>jar</packaging>
<version>${hadoop.version}-14.0</version>  //旧：<version>${hadoop.version}-10.0</version>   <!--对应flink的版本1.14.5-->
    
<dependencies>
  <dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-shaded-hadoop-2</artifactId>
    <version>${hadoop.version}-14.0</version>   //旧：  <version>${hadoop.version}-10.0</version> <!--对应flink的版本1.14.5-->
  </dependency>
  <dependency>                                  //增加依赖
    <groupId>commons-cli</groupId>
    <artifactId>commons-cli</artifactId>
    <version>1.3.1</version>
  </dependency>
</dependencies>    
```

<br/>

在flink-shaded目录下，执行 mvn clean install -DskipTests -Dhadoop.version=3.3.4 -Drat.skip=true 进行编译

将 flink-shaded-hadoop-2-uber-3.3.4-14.0.jar 上传到 /root/tools/flink-1.14.5/lib目录

<br/>

#### 下载jar包

登录maven官方仓库

搜索flink connector kafka，下载flink-connector-kafka_2.12-1.14.5.jar,用于flink集成kafka

搜索flink sql connector kafka，下载flink-sql-connector-kafka_2.12-1.14.5.jar,用于flink sql集成kafka

搜索 kafka clients ，下载kafka-clients-3.2.0.jar  

搜索flink sql connector mysql cdc ，下载flink-sql-connector-mysql-cdc-2.2.1.jar ,用于flink sql集成mysql cdc 

将4个jar上传到 /root/tools/flink-1.14.5/lib目录

<br/>

### flink sql接收kafka消息

#### 启动 flink 

```shell
cd /root/tools/flink-1.14.5/bin

--设置环境变量
export HADOOP_CLASSPATH=`$HADOOP_HOME/bin/hadoop classpath`

--启动集群
./start-cluster.sh

```

<br/>

#### kafka产生消息 

###### 启动 kafka

```bash
cd /root/tools/kafka_2.12-3.2.0/bin
nohup sh kafka-server-start.sh ../config/server.properties &                               #非守护进程启动，进程容易异常挂掉

nohup sh kafka-server-start.sh -daemon ../config/server.properties 1>/dev/null 2>&1 &      #守护进程启动，防止进程异常挂掉
```

<br/>

###### 创建 topic

```bash
cd /root/tools/kafka_2.12-3.2.0/bin
./kafka-topics.sh --create --bootstrap-server 192.168.17.149:9092 --replication-factor 1 --partitions 1 --topic flinktest
```

<br/>

###### 查看当前 topic 列表

```bash
cd /root/tools/kafka_2.12-3.2.0/bin
./kafka-topics.sh --list --bootstrap-server 192.168.17.149:9092
```

<br/>

###### 产生消息

```shell
cd /root/tools/kafka_2.12-3.2.0/bin
sh kafka-console-producer.sh --broker-list 192.168.17.149:9092 --topic flinktest
//生产端发消息
{"tinyint0": 6, "smallint1": 223, "int2": 42999, "bigint3": 429450, "float4": 95.47324181659323, "double5": 340.5755392968011,"decimal6": 111.1111, "boolean7": true,  "char8": "dddddd", "varchar9": "buy0", "string10": "buy1", "timestamp11": "2021-09-13 03:08:50.810"}
```

<br/>

######  消费消息

```bash
cd /root/tools/kafka_2.12-3.2.0/bin
sh kafka-console-consumer.sh --bootstrap-server 192.168.17.149:9092   --topic flinktest --from-beginning
```

<br/>

#### 进入 flinksql

```bash
cd /root/tools/flink-1.14.5/bin

--设置环境变量
export HADOOP_CLASSPATH=`$HADOOP_HOME/bin/hadoop classpath`

./sql-client.sh embedded
```

<br/>

###### 创建与 kafka 关联的表

```sql
Flink SQL> CREATE TABLE kafkatest (
>    tinyint0 TINYINT
>   ,smallint1 SMALLINT
>   ,int2 INT
>   ,bigint3 BIGINT
>   ,float4 FLOAT
>   ,double5 DOUBLE
>   ,decimal6 DECIMAL(38,8)
>   ,boolean7 BOOLEAN
>   ,char8 STRING
>   ,varchar9 STRING
>   ,string10 STRING
>   ,timestamp11 STRING
> ) WITH (
>     'connector' = 'kafka',   -- 使用 kafka connector
>     'topic' = 'flinktest',   -- kafka topic名称
>     'scan.startup.mode' = 'earliest-offset',  -- 从起始 offset 开始读取
>     'properties.bootstrap.servers' = '192.168.17.149:9092',  -- kafka broker 地址
>     'properties.group.id' = 'testgroup1',
>     'value.format' = 'json',
>     'value.json.fail-on-missing-field' = 'true',
>     'value.fields-include' = 'ALL'
> );
[INFO] Execute statement succeed.
```

<br/>

###### 查询表

在 kafka 生产端，发消息后，应看到表接收到数据

```sql
Flink SQL> select *from kafkatest ;
```

<br/>

### flink sql接收mysql cdc消息

##### 查看数据库是否开启bin_log

如没有开启，需要修改/etc/my.cnf文件，增加如下内容并重启数据库

```shell
log-bin=mysql-bin
binlog-format=ROW
```

<br/>

##### 进入flinksql并创建关联mysql的表

```sql
Flink SQL> CREATE TABLE users_source_mysql (
>  id BIGINT PRIMARY KEY NOT ENFORCED
> ,name STRING
> ,birthday TIMESTAMP(3)
> ,ts TIMESTAMP(3)
> ) WITH(
> 'connector' = 'mysql-cdc' ,
> 'hostname'  = '192.168.17.149' ,
> 'port'      = '3306' ,
> 'username'  = 'root' ,
> 'password'  = 'qaz123689' ,
> 'server-time-zone'        = 'Asia/Shanghai' ,
> 'debezium. snapshot.mode' = 'initial ' ,
> 'database-name' = 'test' ,
> 'table-name' = 'tbl_users'
> );
[INFO] Execute statement succeed.

Flink SQL> select *from users_source_mysql;
```

##### 在mysql数据库修改表tbl_users信息、删除表信息、新增记录，flinksql应可观察到数据变化

<br/>

### flink sql创建hudi表并映射hive表

##### 在hive中创建public数据库

```shell
hive> create database public ;
```

<br/>

##### 进入flinksql客户端，创建hudi时映射hive表，往hudi表中插入数据

```shell
[root@hadoopmaster bin]# ./sql-client.sh embedded  
Flink SQL> CREATE TABLE nation_info(
>  numeric_code     int
> ,national_name    string
> ,roman_spelling   string
> ,alphabetic_code  string
> ,primary key(numeric_code) not enforced
> )WITH (
>   'connector' = 'hudi',
>   'path' = 'hdfs:///user/flink/hudi/public/nation_info',  --hudi表的hdfs存储路径
>   'table.type' = 'COPY_ON_WRITE',                         --写时复制模式   
>   'write.bucket_assign.tasks' = '1',
>   'write.tasks' = '1',
>   'hive_sync.enable'= 'true', -- 开启自动同步hive
>   'hive_sync.mode'= 'hms',    -- 自动同步hive模式，默认jdbc模式
>   'hive_sync.metastore.uris'= 'thrift://192.168.17.149:9083',   -- hive metastore地址
>   'hive_sync.jdbc_url' = 'jdbc:hive2://192.168.17.149:10000',   -- required, hiveServer地址
>   'hive_sync.table'= 'nation_info',      -- hive 新建表名
>   'hive_sync.db'= 'public',              -- hive 新建数据库名
>   'hive_sync.username'= 'hive',          -- hive 用户名
>   'hive_sync.password'= 'qaz123689',     -- hive 密码
>   'hive_sync.support_timestamp'= 'true'  -- 兼容hive timestamp类型
> );
Flink SQL> insert into nation_info VALUES
> (101,'汉族测试','Han','HA'),
> (102,'蒙古族测试','Mongol','MG');
[INFO] Submitting SQL update statement to the cluster...
[INFO] SQL update statement has been successfully submitted to the cluster:
Job ID: ed3e34be09a0c71984d7dc26b33fdf54
Flink SQL> 

```

<br/>

##### 进入hive数据库,验证映射表功能

```sql
hive> select *from public.nation_info where  numeric_code in (101,102);  --查询表是否有数据
OK
20220915171415714       20220915171415714_0_2   101             5f23eff2-16ba-499f-806d-6a0dd59777d5_0-1-0_20220915171415714.parquet    101     汉族测试        Han     HA
20220915171415714       20220915171415714_0_3   102             5f23eff2-16ba-499f-806d-6a0dd59777d5_0-1-0_20220915171415714.parquet    102     蒙古族测试      Mongol  MG
Time taken: 1.354 seconds, Fetched: 2 row(s)
hive> show create table public.nation_info ;                             --查看表结构
2022-09-14 15:59:49,151 INFO  [55c9a8f2-d526-4057-aa73-0ebb073a1440 main] exec.ListSinkOperator (Operator.java:logStats(1038)) - RECORDS_OUT_INTERMEDIATE:0, RECORDS_OUT_OPERATOR_LIST_SINK_0:27, 
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
  'last_commit_time_sync'='20220913210502766', 
  'spark.sql.sources.provider'='hudi', 
  'spark.sql.sources.schema.numParts'='1', 
  'spark.sql.sources.schema.part.0'='{"type":"struct","fields":[{"name":"_hoodie_commit_time","type":"string","nullable":true,"metadata":{}},{"name":"_hoodie_commit_seqno","type":"string","nullable":true,"metadata":{}},{"name":"_hoodie_record_key","type":"string","nullable":true,"metadata":{}},{"name":"_hoodie_partition_path","type":"string","nullable":true,"metadata":{}},{"name":"_hoodie_file_name","type":"string","nullable":true,"metadata":{}},{"name":"numeric_code","type":"integer","nullable":false,"metadata":{}},{"name":"national_name","type":"string","nullable":true,"metadata":{}},{"name":"roman_spelling","type":"string","nullable":true,"metadata":{}},{"name":"alphabetic_code","type":"string","nullable":true,"metadata":{}}]}', 
  'transient_lastDdlTime'='1662317806')
Time taken: 1.366 seconds, Fetched: 27 row(s)
```

<br/>

##### 查看hudi表的hdfs文件

```shell
[root@hadoopmaster etc]# hadoop fs -ls hdfs:///user/flink/hudi/public/nation_info
Found 3 items
drwxr-xr-x   - root supergroup          0 2022-09-05 02:56 hdfs:///user/flink/hudi/public/nation_info/.hoodie
-rw-r--r--   3 root supergroup         96 2022-09-05 02:56 hdfs:///user/flink/hudi/public/nation_info/.hoodie_partition_metadata
-rw-r--r--   3 root supergroup     436145 2022-09-05 02:56 hdfs:///user/flink/hudi/public/nation_info/67a6d28e-2804-4039-8e75-007e54903a2a_0-1-0_20220905025642928.parquet

[root@hadoopmaster sbin]# hadoop fs -ls hdfs:///user/flink/hudi/public/nation_info
Found 6 items
drwxr-xr-x   - root supergroup          0 2022-09-15 17:14 hdfs:///user/flink/hudi/public/nation_info/.hoodie
-rw-r--r--   3 root supergroup         96 2022-09-15 14:52 hdfs:///user/flink/hudi/public/nation_info/.hoodie_partition_metadata
-rw-r--r--   3 root supergroup     434972 2022-09-15 14:52 hdfs:///user/flink/hudi/public/nation_info/5f23eff2-16ba-499f-806d-6a0dd59777d5_0-1-0_20220915145209326.parquet
-rw-r--r--   3 root supergroup     435119 2022-09-15 17:10 hdfs:///user/flink/hudi/public/nation_info/5f23eff2-16ba-499f-806d-6a0dd59777d5_0-1-0_20220915170959370.parquet
-rw-r--r--   3 root supergroup     435117 2022-09-15 17:11 hdfs:///user/flink/hudi/public/nation_info/5f23eff2-16ba-499f-806d-6a0dd59777d5_0-1-0_20220915171157486.parquet
-rw-r--r--   3 root supergroup     435117 2022-09-15 17:14 hdfs:///user/flink/hudi/public/nation_info/5f23eff2-16ba-499f-806d-6a0dd59777d5_0-1-0_20220915171415714.parquet
[root@hadoopmaster sbin]# 
```

<br/>

## 其他

- 无