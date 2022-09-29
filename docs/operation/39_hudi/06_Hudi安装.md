# hudi 安装

## 本内容你将获得

- 如何在 centos7 服务器上安装 hudi
- 在 flinksql 中接收 kafka 消息
- 在 flinksql 中接收 mysql cdc 消息
- 在 flinksql 中创建关联hudi的表，写入hudi表时同步到hive表

## Hudi 依赖的环境

| 软件名称 | 版本号     |
| -------- | ---------- |
| JDK      | 1.8.0_333  |
| SCALA    | 2.12.15    |
| Flink    | 1.14.5     |
| Hadoop   | 3.3.4      |
| hive     | 3.1.3      |
| kafka    | 2.12-3.2.0 |

## 部署

需要以root用户部署Hadoop 、hive、flink

1、浏览器中打开https://gitee.com/apache/Hudi.git,下载hudi源码并切换到0.12.0后，进行如下修改

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

D、修改完成后，进入Hudi\packaging\hudi-flink-bundle目录，执行 mvn clean install -DskipTests -Drat.skip=true -Pflink-bundle-shade-hive3 命令。

在Hud\packaging\hudi-flink-bundle\target目录下，得到 hudi-flink1.14-bundle_2.12-0.12.0.jar 

使用360压缩工具打开hudi-flink1.14-bundle_2.12-0.12.0.jar,修改hbase-default.xml、hbase-site.xml中的hbase版本及是否跳过

```Java
<name>hbase.defaults.for.version</name>
<value>2.4.9</value>                                ->  <value>2.0.0-alpha4</value>

<name>hbase.defaults.for.version.skip</name>
     <value>false</value>                           ->   <value>true</value>
```

将hudi-flink1.14-bundle_2.12-0.12.0.jar 复制到 /root/tools/flink-1.14.5/lib目录

E、进入Hudi\packaging\hudi-hadoop-mr-bundle 目录，执行命令：
mvn clean install -DskipTests

在Hudi\packaging\hudi-hadoop-mr-bundle\target目录下，得到 hudi-hadoop-mr-bundle-0.12.0.jar

使用压缩工具打开hudi-hadoop-mr-bundle-0.12.0.jar,修改hbase-default.xml、hbase-site.xml中的hbase版本及是否跳过

```Java
<name>hbase.defaults.for.version</name>
<value>2.4.9</value>                                ->  <value>2.0.0-alpha4</value>

<name>hbase.defaults.for.version.skip</name>
     <value>false</value>                           ->   <value>true</value>
```

修改过程截图如下：

1)、以压缩工具打开jar文件

<img :src="$withBase('/operation/hudi_001.png')">

2)、以记事本打开文件

<img :src="$withBase('/operation/hudi_006.png')">

3)、修改hbase-default.xml、hbase-site.xml文件中hbase的信息

<img :src="$withBase('/operation/hudi_002.png')">

4)、按照提示保存修改信息

<img :src="$withBase('/operation/hudi_003.png')">

5)、按照提示更新到jar包

<img :src="$withBase('/operation/hudi_004.png')">

6)、更新jar包

<img :src="$withBase('/operation/hudi_005.png')">

将hudi-hadoop-mr-bundle-0.12.0.jar 复制到 /root/tools/hive-3.1.3/auxlib、/root/tools/hive-3.1.3/lib目录。(如没有则创建auxlib目录)

F、进入Hudi\packaging\hudi-hive-sync-bundle 目录，执行命令：
mvn clean install -DskipTests

在Hudi\packaging\hudi-hive-sync-bundle\target目录下，得到hudi-hive-sync-bundle-0.12.0.jar

使用压缩工具打开hudi-hive-sync-bundle-0.12.0.jar,修改hbase-default.xml、hbase-site.xml中的hbase版本及是否跳过

```Java
<name>hbase.defaults.for.version</name>
<value>2.4.9</value>                                ->  <value>2.0.0-alpha4</value>

<name>hbase.defaults.for.version.skip</name>
     <value>false</value>                           ->   <value>true</value>
```

将hudi-hive-sync-bundle-0.12.0.jar 复制到 /root/tools/hive-3.1.3/auxlib

2、登录maven仓库https://mvnrepository.com/，搜索flink-connector-kafka，下载对应的版本并上传到/root/tools/flink-1.14.5/lib

[flink-connector-kafka_2.12-1.14.5.jar](https://repo1.maven.org/maven2/org/apache/flink/flink-connector-kafka_2.12/1.14.5/flink-connector-kafka_2.12-1.14.5.jar)

3、登录maven仓库https://mvnrepository.com/，搜索 flink-sql-connector-kafka，下载对应的版本并上传到/root/tools/flink-1.14.5/lib

[flink-sql-connector-kafka_2.12-1.14.5.jar](https://repo1.maven.org/maven2/org/apache/flink/flink-sql-connector-kafka_2.12/1.14.5/flink-sql-connector-kafka_2.12-1.14.5.jar)

4、登录maven仓库https://mvnrepository.com/，搜索 kafka-clients，下载对应的版本并上传到/root/tools/flink-1.14.5/lib

[kafka-clients-3.2.0.jar](https://repo1.maven.org/maven2/org/apache/kafka/kafka-clients/3.2.0/kafka-clients-3.2.0.jar)

5、登录maven仓库https://mvnrepository.com/，搜索flink-sql-connector-mysql-cdc，下载对应的版本并上传到/root/tools/flink-1.14.5/lib

[flink-sql-connector-mysql-cdc-2.2.1.jar](https://repo1.maven.org/maven2/com/ververica/flink-sql-connector-mysql-cdc/2.2.1/flink-sql-connector-mysql-cdc-2.2.1.jar)

6、浏览器中打开https://github.com/apache/flink-shaded.git，下载flink-shaded源码并切换到release-10.0版本

A、 修改flink-shaded\pom.xml，在\<profiles>增加如下配置，优化网络

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
<version>${hadoop.version}-10.0</version>  -> <version>${hadoop.version}-14.0</version> <!--对应flink的版本1.14.5-->
```

D、修改flink-shaded\flink-shaded-hadoop-2-parent\flink-shaded-hadoop-2-uber\pom.xml

```java
<packaging>jar</packaging>
<version>${hadoop.version}-10.0</version>  -> <version>${hadoop.version}-14.0</version>  <!--对应flink的版本1.14.5-->
    
	<dependencies>
		<dependency>
			<groupId>org.apache.flink</groupId>
			<artifactId>flink-shaded-hadoop-2</artifactId>
			<version>${hadoop.version}-10.0</version>    ->  <version>${hadoop.version}-14.0</version> <!--对应flink的版本1.14.5-->
		</dependency>
		<dependency>                                     ->   <!--增加依赖-->
			<groupId>commons-cli</groupId>
			<artifactId>commons-cli</artifactId>
			<version>1.3.1</version>
		</dependency>
	</dependencies>    
```

最后在flink-shaded目录下，执行 mvn clean install -DskipTests -Dhadoop.version=3.3.4 -Drat.skip=true进行编译，在flink-shaded\flink-shaded-hadoop-2-parent\flink-shaded-hadoop-2-uber\target目录下得到 flink-shaded-hadoop-2-uber-3.3.4-14.0.jar

将 flink-shaded-hadoop-2-uber-3.3.4-14.0.jar 上传到 /root/tools/flink-1.14.5/lib

7、将编译和下载的 jar 包上传到 Flink、HIVE 的 lib 目录后，最终如下

```bash
[root@hadoopmaster lib]# pwd
/root/tools/flink-1.14.5/lib
[root@hadoopmaster lib]# ls -alt
total 368752
drwxr-xr-x.  3 root root      4096 Sep  5 01:55 .
drwxr-xr-x. 12 root root      4096 Jun 20 16:06 ..
-rw-r--r--  1 root root   68995619 Sep 15 10:26 flink-shaded-hadoop-2-uber-3.3.4-14.0.jar
-rw-r--r--  1 root root   95654827 Sep 15 10:25 hudi-flink1.14-bundle-0.12.0.jar
-rw-r--r--  1 root root   22096298 Sep 15 10:23 flink-sql-connector-mysql-cdc-2.2.1.jar
-rw-r--r--  1 root root     389268 Sep 15 10:23 flink-connector-kafka_2.12-1.14.5.jar
-rw-r--r--  1 root root    3704679 Sep 15 10:23 flink-sql-connector-kafka_2.12-1.14.5.jar
-rw-r--r--  1 root root    4941003 Sep 15 10:23 kafka-clients-3.2.0.jar
-rw-r--r--  1  502 games 136098285 Jun 10 14:34 flink-dist_2.12-1.14.5.jar
-rw-r--r--  1  502 games  39666418 Jun 10 14:32 flink-table_2.12-1.14.5.jar
-rw-r--r--  1  502 games     85586 Jun 10 14:30 flink-csv-1.14.5.jar
-rw-r--r--  1  502 games    153142 Jun 10 14:30 flink-json-1.14.5.jar
-rw-r--r--  1  502 games   7709731 Jun  9 15:33 flink-shaded-zookeeper-3.4.14.jar
-rw-r--r--  1  502 games   1790452 Jun  9 15:17 log4j-core-2.17.1.jar
-rw-r--r--  1  502 games    208006 Jun  9 15:17 log4j-1.2-api-2.17.1.jar
-rw-r--r--  1  502 games    301872 Jun  9 15:17 log4j-api-2.17.1.jar
-rw-r--r--  1  502 games     24279 Jun  9 15:17 log4j-slf4j-impl-2.17.1.jar



[root@hadoopmaster auxlib]# pwd
/root/tools/hive-3.1.3/auxlib
[root@hadoopmaster auxlib]# ls -alt
total 66312
drwxrwxr-x.  3 hadoop hadoop      102 Sep  5 01:12 .
drwxrwxr-x. 11 hadoop hadoop     4096 Sep  4 09:50 ..
-rw-r--r--  1 root root 35308615 Sep 15 10:30 hudi-hive-sync-bundle-0.12.0.jar
-rw-r--r--  1 root root 39311524 Sep 15 10:29 hudi-hadoop-mr-bundle-0.12.0.jar


[root@hadoopmaster lib]# pwd
/root/tools/hive-3.1.3/lib
[root@hadoopmaster lib]# ls -alt |more
total 350648
drwxrwxr-x.  5 hadoop hadoop    12288 Sep  5 01:30 .
drwxrwxr-x. 11 hadoop hadoop     4096 Sep  4 09:50 ..
-rw-r--r--  1 root root 39311524 Sep 15 10:30 hudi-hadoop-mr-bundle-0.12.0.jar
-rw-r--r--  1 root root  2476480 Sep 14 18:00 mysql-connector-java-8.0.28.jar
drwxr-xr-x  7 root root     4096 Sep 14 14:51 py
drwxr-xr-x  6 root root     4096 Sep 14 14:51 php
-rw-r--r--  1 root root    19535 Apr  4 05:01 hive-kryo-registrator-3.1.3.jar
-rw-r--r--  1 root root    14470 Apr  4 05:01 hive-testutils-3.1.3.jar
-rw-r--r--  1 root root    41525 Apr  4 05:01 hive-llap-ext-client-3.1.3.jar
-rw-r--r--  1 root root    66084 Apr  4 05:01 hive-streaming-3.1.3.jar
-rw-r--r--  1 root root   694817 Apr  4 05:01 hive-hplsql-3.1.3.jar
-rw-r--r--  1 root root    78301 Apr  4 05:01 hive-hcatalog-server-extensions-3.1.3.jar
-rw-r--r--  1 root root   270723 Apr  4 05:01 hive-hcatalog-core-3.1.3.jar
-rw-r--r--  1 root root    55398 Apr  4 05:01 hive-jdbc-handler-3.1.3.jar
-rw-r--r--  1 root root   120418 Apr  4 05:01 hive-hbase-handler-3.1.3.jar
-rw-r--r--  1 root root 52033816 Apr  4 05:01 hive-druid-handler-3.1.3.jar
-rw-r--r--  1 root root   129513 Apr  4 05:00 hive-contrib-3.1.3.jar
-rw-r--r--  1 root root    47053 Apr  4 05:00 hive-cli-3.1.3.jar
-rw-r--r--  1 root root   180433 Apr  4 05:00 hive-beeline-3.1.3.jar
-rw-r--r--  1 root root   125398 Apr  4 05:00 hive-jdbc-3.1.3.jar
-rw-r--r--  1 root root   141488 Apr  4 05:00 hive-accumulo-handler-3.1.3.jar
-rw-r--r--  1 root root   568251 Apr  4 05:00 hive-service-3.1.3.jar
-rw-r--r--  1 root root   782513 Apr  4 05:00 hive-llap-server-3.1.3.jar
-rw-r--r--  1 root root 41873153 Apr  4 05:00 hive-exec-3.1.3.jar
-rw-r--r--  1 root root   143342 Apr  4 04:59 hive-spark-client-3.1.3.jar
-rw-r--r--  1 root root   126558 Apr  4 04:59 hive-llap-tez-3.1.3.jar
-rw-r--r--  1 root root   139325 Apr  4 04:59 hive-llap-client-3.1.3.jar
-rw-r--r--  1 root root   422345 Apr  4 04:59 hive-llap-common-3.1.3.jar
-rw-r--r--  1 root root    27084 Apr  4 04:59 hive-llap-common-3.1.3-tests.jar
-rw-r--r--  1 root root    36983 Apr  4 04:59 hive-metastore-3.1.3.jar
-rw-r--r--  1 root root    44359 Apr  4 04:59 hive-vector-code-gen-3.1.3.jar
-rw-r--r--  1 root root 11096517 Apr  4 04:58 hive-standalone-metastore-3.1.3.jar
-rw-r--r--  1 root root  1032099 Apr  4 04:58 hive-serde-3.1.3.jar
-rw-r--r--  1 root root  1679366 Apr  4 04:58 hive-service-rpc-3.1.3.jar
-rw-r--r--  1 root root   492915 Apr  4 04:58 hive-common-3.1.3.jar
-rw-r--r--  1 root root    10668 Apr  4 04:58 hive-shims-3.1.3.jar
-rw-r--r--  1 root root    14222 Apr  4 04:58 hive-shims-scheduler-3.1.3.jar
-rw-r--r--  1 root root    55377 Apr  4 04:58 hive-shims-0.23-3.1.3.jar
-rw-r--r--  1 root root    65124 Apr  4 04:58 hive-shims-common-3.1.3.jar
-rw-r--r--  1 root root    11589 Apr  4 04:58 hive-classification-3.1.3.jar
-rw-r--r--  1 root root    27974 Apr  4 04:58 hive-upgrade-acid-3.1.3.jar
-rw-r--r--  1 root root   544199 Jan  7  2022 jackson-module-scala_2.11-2.12.0.jar
-rw-r--r--  1 root root   208006 Jan  7  2022 log4j-1.2-api-2.17.1.jar
-rw-r--r--  1 root root    35962 Jan  7  2022 log4j-web-2.17.1.jar
-rw-r--r--  1 root root   301872 Jan  7  2022 log4j-api-2.17.1.jar
-rw-r--r--  1 root root  1790452 Jan  7  2022 log4j-core-2.17.1.jar
-rw-r--r--  1 root root    24279 Jan  7  2022 log4j-slf4j-impl-2.17.1.jar
-rw-r--r--  1 root root   231901 Dec 12  2021 hive-storage-api-2.7.0.jar
-rw-r--r--  1 root root    91259 May 21  2021 jackson-dataformat-smile-2.12.0.jar
-rw-r--r--  1 root root  1511931 May 21  2021 jackson-databind-2.12.0.jar
-rw-r--r--  1 root root    75702 May 21  2021 jackson-annotations-2.12.0.jar
-rw-r--r--  1 root root   365185 May 21  2021 jackson-core-2.12.0.jar
-rw-r--r--  1 root root   780321 Feb 27  2021 httpclient-4.5.13.jar
-rw-r--r--  1 root root   328593 Feb 27  2021 httpcore-4.4.13.jar
-rw-r--r--  1 root root   353793 Oct 20  2020 commons-codec-1.15.jar
-rw-r--r--  1 root root    10476 Dec 20  2019 mysql-metadata-storage-0.12.0.jar
-rw-r--r--  1 root root     8463 Dec 20  2019 postgresql-metadata-storage-0.12.0.jar
-rw-r--r--  1 root root    40836 Dec 20  2019 druid-hdfs-storage-0.12.0.jar
-rw-r--r--  1 root root   109776 Dec  5  2019 orc-tools-1.5.8.jar
-rw-r--r--  1 root root   800832 Dec  5  2019 orc-core-1.5.8.jar
-rw-r--r--  1 root root    27751 Dec  5  2019 orc-shims-1.5.8.jar
-rw-r--r--  1 root root  6279638 Nov  1  2019 jetty-runner-9.3.20.v20170531.jar
-rw-r--r--  1 root root    18188 Nov  1  2019 websocket-servlet-9.3.20.v20170531.jar
-rw-r--r--  1 root root    11040 Nov  1  2019 apache-jsp-9.3.20.v20170531.jar
-rw-r--r--  1 root root     3710 Nov  1  2019 apache-jstl-9.3.20.v20170531.jar
-rw-r--r--  1 root root    29038 Nov  1  2019 asm-tree-5.0.1.jar
-rw-r--r--  1 root root    40264 Nov  1  2019 jetty-jaas-9.3.20.v20170531.jar

```

8、配置环境变量

```bash
cd /etc
vi profile
#java
export JAVA_HOME=/root/tools/jdk1.8.0_333
export JRE_HOME=$JAVA_HOME/jre
export PATH=$PATH:$JAVA_HOME/bin
export CLASSPATH=.:$JAVA_HOME/jre/lib:$JAVA_HOME/lib:$JAVA_HOME/lib/tools.jar 

#zookeeper
export ZK_HOME=/root/tools/kafka_2.12-3.2.0/bin
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
export FLINK_HOME=/root/tools/flink-1.14.5
export PATH=$JAVA_HOME/bin:$SCALA_HOME/bin:$FLINK_HOME/bin:$MAVEN_HOME/bin:$JRE_HOME/bin:${M2_HOME}/bin:${HIVE_HOME}/bin:{SPARK_HOME}/bin:{HADOOP_HOME}/bin:$PATH:
export CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar:$SCALA_HOME/lib:$FLINK_HOME/lib:$JRE_HOME/lib:$CLASSPATH

保存后，执行source profile，使环境变量生效
```

## 在 flinksql 中接收 kafka 消息

### 启动 flink 集群

```shell
cd /root/tools/flink-1.14.5/bin

--设置环境变量
export HADOOP_CLASSPATH=`$HADOOP_HOME/bin/hadoop classpath`

--启动集群
./start-cluster.sh

```

### 启动 kafka 集群

#### 启动 kafka

```bash
cd /root/tools/kafka_2.12-3.2.0/bin
nohup sh kafka-server-start.sh ../config/server.properties &                               #非守护进程启动，进程容易异常挂掉

nohup sh kafka-server-start.sh -daemon ../config/server.properties 1>/dev/null 2>&1 &      #守护进程启动，防止进程异常挂掉
```

#### 创建 topic

```bash
cd /root/tools/kafka_2.12-3.2.0/bin
./kafka-topics.sh --create --bootstrap-server 172.17.49.195:9092 --replication-factor 1 --partitions 1 --topic flinktest
```

#### 查看当前 topic 列表

```bash
cd /root/tools/kafka_2.12-3.2.0/bin
./kafka-topics.sh --list --bootstrap-server 172.17.49.195:9092
```

#### 使用 kafka-console-producer.sh 命令向 topic flinktest 发送消息

```shell
cd /root/tools/kafka_2.12-3.2.0/bin
sh kafka-console-producer.sh --broker-list 172.17.49.195:9092 --topic flinktest
//生产端发消息
{"tinyint0": 6, "smallint1": 223, "int2": 42999, "bigint3": 429450, "float4": 95.47324181659323, "double5": 340.5755392968011,"decimal6": 111.1111, "boolean7": true,  "char8": "dddddd", "varchar9": "buy0", "string10": "buy1", "timestamp11": "2021-09-13 03:08:50.810"}
```

#### 使用 kafka-console-consumer.sh 消费消息

```bash
cd /root/tools/kafka_2.12-3.2.0/bin
sh kafka-console-consumer.sh --bootstrap-server 172.17.49.195:9092   --topic flinktest --from-beginning
```

### 启动 flinksql命令行界面

```bash
cd /root/tools/flink-1.14.5/bin

--设置环境变量
export HADOOP_CLASSPATH=`$HADOOP_HOME/bin/hadoop classpath`

./sql-client.sh embedded
```

#### 新建与 kafka 关联的表

```shell
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
>     'properties.bootstrap.servers' = '172.17.49.195:9092',  -- kafka broker 地址
>     'properties.group.id' = 'testgroup1',
>     'value.format' = 'json',
>     'value.json.fail-on-missing-field' = 'true',
>     'value.fields-include' = 'ALL'
> );
[INFO] Execute statement succeed.
```

#### 查询表

在 kafka 生产端，发消息后，可看到表接收到的数据

```shell
//生产端发消息
{"tinyint0": 7, "smallint1": 224, "int2": 43000, "bigint3": 429451, "float4": 95.47324181659324, "double5": 340.5755392968012,"decimal6": 111.1112, "boolean7": true,  "char8": "ddddde", "varchar9": "buy1", "string10": "buy1", "timestamp11": "2021-09-13 03:08:50.812"}
```

```shell
select * from kafkatest;

Flink SQL> select *from kafkatest ;

```

## 在 flinksql 中接收 mysql cdc 消息

查看数据库是否开启bin_log。如没有开启，需要修改/etc/my.cnf文件，增加如下内容并重启数据库

```shell
log-bin=mysql-bin
binlog-format=ROW
```

在mysql客户端查看bin_log开启情况

```shell
[mysql@hadoopmaster ~]$ sudo mysql -u root -p  
[sudo] password for mysql: 
Enter password: 
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 390
Server version: 8.0.28 MySQL Community Server - GPL

Copyright (c) 2000, 2022, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> show variables like 'log_bin'
    -> ;
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| log_bin       | ON    |
+---------------+-------+
1 row in set (0.00 sec)

mysql> create database test;
Query OK, 1 row affected (0.01 sec)

mysql> create database test ;
ERROR 1007 (HY000): Can't create database 'test'; database exists
mysql> create table test.tbl_users(
    ->  id bigint auto_increment primary key
    -> ,name varchar(20) null
    -> ,birthday timestamp default CURRENT_TIMESTAMP not null
    -> ,ts timestamp default CURRENT_TIMESTAMP not null
    -> );
Query OK, 0 rows affected (0.02 sec)

mysql> insert into test.tbl_users(name) values('xiaoniu');
Query OK, 1 row affected (0.00 sec)

mysql> 

```

打开flinksql客户端并创建关联mysql的表

```shell
Flink SQL> CREATE TABLE users_source_mysql (
>  id BIGINT PRIMARY KEY NOT ENFORCED
> ,name STRING
> ,birthday TIMESTAMP(3)
> ,ts TIMESTAMP(3)
> ) WITH(
> 'connector' = 'mysql-cdc' ,
> 'hostname'  = '172.17.49.195' ,
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
Q Quit                                         + Inc Refresh                                  G Goto Page                                    N Next Page                                    O Open Row                                     
R Refresh                                      - Dec Refresh                                  L Last Page                                    P Prev Page                                    
                                                                                                          SQL Query Result (Table)                                                                                                          
 Refresh: 1 s                                                                                                 Page: Last of 1                                                                                         Updated: 17:04:16.669 

                   id                           name                birthday                      ts
                    1                        xiaoniu 2022-09-15 17:03:49.000 2022-09-15 17:03:49.000

```

在mysql客户端修改表tbl_users信息、删除表信息、新增记录。flinksql客户端显示mysql表的变更。

## 在 flinksql 中创建关联hudi的表，写入hudi表时同步到hive表

在hive中创建public数据库后，打开flinksql客户端。

```shell
hive> create database public ;
OK
Time taken: 0.027 seconds
hive> 
```



```shell
[root@hadoopmaster bin]# ./sql-client.sh embedded  
SLF4J: Class path contains multiple SLF4J bindings.
SLF4J: Found binding in [jar:file:/root/tools/flink-1.14.5/lib/log4j-slf4j-impl-2.17.1.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: Found binding in [jar:file:/root/tools/hadoop-3.3.4/share/hadoop/common/lib/slf4j-reload4j-1.7.36.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: See http://www.slf4j.org/codes.html#multiple_bindings for an explanation.
SLF4J: Actual binding is of type [org.apache.logging.slf4j.Log4jLoggerFactory]
Command history file path: /root/.flink-sql-history

                                   ▒▓██▓██▒
                               ▓████▒▒█▓▒▓███▓▒
                            ▓███▓░░        ▒▒▒▓██▒  ▒
                          ░██▒   ▒▒▓▓█▓▓▒░      ▒████
                          ██▒         ░▒▓███▒    ▒█▒█▒
                            ░▓█            ███   ▓░▒██
                              ▓█       ▒▒▒▒▒▓██▓░▒░▓▓█
                            █░ █   ▒▒░       ███▓▓█ ▒█▒▒▒
                            ████░   ▒▓█▓      ██▒▒▒ ▓███▒
                         ░▒█▓▓██       ▓█▒    ▓█▒▓██▓ ░█░
                   ▓░▒▓████▒ ██         ▒█    █▓░▒█▒░▒█▒
                  ███▓░██▓  ▓█           █   █▓ ▒▓█▓▓█▒
                ░██▓  ░█░            █  █▒ ▒█████▓▒ ██▓░▒
               ███░ ░ █░          ▓ ░█ █████▒░░    ░█░▓  ▓░
              ██▓█ ▒▒▓▒          ▓███████▓░       ▒█▒ ▒▓ ▓██▓
           ▒██▓ ▓█ █▓█       ░▒█████▓▓▒░         ██▒▒  █ ▒  ▓█▒
           ▓█▓  ▓█ ██▓ ░▓▓▓▓▓▓▓▒              ▒██▓           ░█▒
           ▓█    █ ▓███▓▒░              ░▓▓▓███▓          ░▒░ ▓█
           ██▓    ██▒    ░▒▓▓███▓▓▓▓▓██████▓▒            ▓███  █
          ▓███▒ ███   ░▓▓▒░░   ░▓████▓░                  ░▒▓▒  █▓
          █▓▒▒▓▓██  ░▒▒░░░▒▒▒▒▓██▓░                            █▓
          ██ ▓░▒█   ▓▓▓▓▒░░  ▒█▓       ▒▓▓██▓    ▓▒          ▒▒▓
          ▓█▓ ▓▒█  █▓░  ░▒▓▓██▒            ░▓█▒   ▒▒▒░▒▒▓█████▒
           ██░ ▓█▒█▒  ▒▓▓▒  ▓█                █░      ░░░░   ░█▒
           ▓█   ▒█▓   ░     █░                ▒█              █▓
            █▓   ██         █░                 ▓▓        ▒█▓▓▓▒█░
             █▓ ░▓██░       ▓▒                  ▓█▓▒░░░▒▓█░    ▒█
              ██   ▓█▓░      ▒                    ░▒█▒██▒      ▓▓
               ▓█▒   ▒█▓▒░                         ▒▒ █▒█▓▒▒░░▒██
                ░██▒    ▒▓▓▒                     ▓██▓▒█▒ ░▓▓▓▓▒█▓
                  ░▓██▒                          ▓░  ▒█▓█  ░░▒▒▒
                      ▒▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░▓▓  ▓░▒█░
          
    ______ _ _       _       _____  ____  _         _____ _ _            _  BETA   
   |  ____| (_)     | |     / ____|/ __ \| |       / ____| (_)          | |  
   | |__  | |_ _ __ | | __ | (___ | |  | | |      | |    | |_  ___ _ __ | |_ 
   |  __| | | | '_ \| |/ /  \___ \| |  | | |      | |    | | |/ _ \ '_ \| __|
   | |    | | | | | |   <   ____) | |__| | |____  | |____| | |  __/ | | | |_ 
   |_|    |_|_|_| |_|_|\_\ |_____/ \___\_\______|  \_____|_|_|\___|_| |_|\__|
          
        Welcome! Enter 'HELP;' to list all available commands. 'QUIT;' to exit.


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
>   'hive_sync.metastore.uris'= 'thrift://172.17.49.195:9083',   -- hive metastore地址
>   'hive_sync.jdbc_url' = 'jdbc:hive2://172.17.49.195:10000',   -- required, hiveServer地址
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

打开hive客户端,可查看到表数据

```shell
hive> set hive.execution.engine=spark;
hive> select *from public.nation_info where  numeric_code in (101,102);
OK
20220915171415714       20220915171415714_0_2   101             5f23eff2-16ba-499f-806d-6a0dd59777d5_0-1-0_20220915171415714.parquet    101     汉族测试        Han     HA
20220915171415714       20220915171415714_0_3   102             5f23eff2-16ba-499f-806d-6a0dd59777d5_0-1-0_20220915171415714.parquet    102     蒙古族测试      Mongol  MG
Time taken: 1.354 seconds, Fetched: 2 row(s)
hive> show create table public.nation_info ;
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
  'hdfs://172.17.49.195:9000/user/flink/hudi/public/nation_info'
TBLPROPERTIES (
  'last_commit_time_sync'='20220913210502766', 
  'spark.sql.sources.provider'='hudi', 
  'spark.sql.sources.schema.numParts'='1', 
  'spark.sql.sources.schema.part.0'='{"type":"struct","fields":[{"name":"_hoodie_commit_time","type":"string","nullable":true,"metadata":{}},{"name":"_hoodie_commit_seqno","type":"string","nullable":true,"metadata":{}},{"name":"_hoodie_record_key","type":"string","nullable":true,"metadata":{}},{"name":"_hoodie_partition_path","type":"string","nullable":true,"metadata":{}},{"name":"_hoodie_file_name","type":"string","nullable":true,"metadata":{}},{"name":"numeric_code","type":"integer","nullable":false,"metadata":{}},{"name":"national_name","type":"string","nullable":true,"metadata":{}},{"name":"roman_spelling","type":"string","nullable":true,"metadata":{}},{"name":"alphabetic_code","type":"string","nullable":true,"metadata":{}}]}', 
  'transient_lastDdlTime'='1662317806')
Time taken: 1.366 seconds, Fetched: 27 row(s)
```

查看hudi表的hdfs文件

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

## 其他

- 无