# spark安装

## 本内容你将获得

- 如何在 centos7 服务器上安装 spark

##  依赖的环境

| 软件名称 | 版本号    |
| -------- | --------- |
| JDK      | 1.8.0_333 |
| hadoop   | 3.3.4     |

## 经验教训

  1、安装最新版本的spark，hive使用spark执行引擎时，无法提交作业。

  2、安装spark无hadoop版本后，hive使用spark执行引擎时，可提交作业。

## 部署

1、打开spark官网,下载spark-2.4.8-bin-without-hadoop-scala-2.12.tgz并上传到服务器

[spark-2.4.8-bin-without-hadoop-scala-2.12.tgz](https://archive.apache.org/dist/spark/spark-2.4.8/spark-2.4.8-bin-without-hadoop-scala-2.12.tgz)

2、解压spark安装包

```shell
cd /root/tools
tar -xvzf spark-2.4.8-bin-without-hadoop-scala-2.12.tgz
mv spark-2.4.8-bin-without-hadoop-scala-2.12 spark-2.4.8-pure    
```

3、配置spark-defaults.conf，在文件最后增加配置

```shell
[root@hadoopmaster conf]# cd /root/tools/spark-2.4.8-pure/conf
[root@hadoopmaster conf]# cp spark-defaults.conf.template spark-defaults.conf
[root@hadoopmaster conf]# cp spark-defaults.conf spark-defaults.conf_20220915bak
[root@hadoopmaster conf]# vi spark-defaults.conf
#
# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

# Default system properties included when running spark-submit.
# This is useful for setting default environmental settings.

# Example:
# spark.master                     spark://master:7077
# spark.eventLog.enabled           true
# spark.eventLog.dir               hdfs://namenode:8021/directory
# spark.serializer                 org.apache.spark.serializer.KryoSerializer
# spark.driver.memory              5g
# spark.executor.extraJavaOptions  -XX:+PrintGCDetails -Dkey=value -Dnumbers="one two three"
 spark.eventLog.enabled           true
 spark.eventLog.dir               hdfs://hadoopmaster:9000/spark-logs
 spark.history.fs.logDirectory    hdfs://hadoopmaster:9000/spark-logs
 spark.serializer                 org.apache.spark.serializer.KryoSerializer
 spark.driver.memory              5g
 spark.executor.extraJavaOptions  -XX:+PrintGCDetails -Dkey=value -Dnumbers="one two three"
 spark.history.ui.port            18080
 spark.history.fs.update.interval 10s
"spark-defaults.conf" 35L, 1756C written
[root@hadoopmaster conf]# hadoop fs -mkdir /spark-logs       --如未在hdfs中创建/spark-logs目录，需要创建
[root@hadoopmaster conf]# 
```

4、配置spark-env.sh，在文件最后增加配置

```shell
export SPARK_HOME=/root/tools/spark-2.4.8-pure
export SCALA_HOME=/root/tools/scala-2.12.15
export JAVA_HOME=/root/tools/jdk1.8.0_333
export PATH=$PATH:$JAVA_HOME/bin:$HADOOP_HOME/bin:$HADOOP_HOME/sbin:$SCALA_HOME/bin
export HADOOP_CONF_DIR=$HADOOP_HOME/etc/hadoop
export YARN_CONF_DIR=$HADOOP_HOME/etc/hadoop
export SPARK_LOCAL_DIRS=/root/tools/spark-2.4.8-pure
export SPARK_LIBARY_PATH=.:$JAVA_HOME/lib:$JAVA_HOME/jre/lib:$HADOOP_HOME/lib/native
#export SPAR_MASTER_PORT=7077
export SPARK_MASTER_HOST=hadoopmaster
export SPARK_HISTORY_OPTS="-Dspark.history.ui.port=18080 -Dspark.history.retainedApplications=3 -Dspark.history.fs.logDirectory=hdfs://hadoopmaster:9000/spark-logs"

# HADOOP_HOME 会从hive-env.sh 带过来，这里仅为Spark 单独运行服务
export HADOOP_HOME=/root/tools/hadoop-3.3.4
# 无论Spark 纯净版还是Hive on Spark 没有SPARK_DIST_CLASSPATH 都不能运行
export SPARK_DIST_CLASSPATH=$(${HADOOP_HOME}/bin/hdfs classpath)
# YARN_CONF_DIR 仅用于Spark 和YARN 对接，跟Hive on Spark 无关
export YARN_CONF_DIR=${HADOOP_HOME}/etc/hadoop
    
--操作如下：    
[root@hadoopmaster conf]# cp spark-env.sh.template spark-env.sh
[root@hadoopmaster conf]# cp spark-env.sh spark-env.sh_20220915bak
[root@hadoopmaster conf]# vi spark-env.sh
#!/usr/bin/env bash

#
# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

# This file is sourced when running various Spark programs.
# Copy it as spark-env.sh and edit that to configure Spark for your site.

# Options read when launching programs locally with
# ./bin/run-example or ./bin/spark-submit
# - HADOOP_CONF_DIR, to point Spark towards Hadoop configuration files
# - SPARK_LOCAL_IP, to set the IP address Spark binds to on this node
# - SPARK_PUBLIC_DNS, to set the public dns name of the driver program

# Options read by executors and drivers running inside the cluster
# - SPARK_LOCAL_IP, to set the IP address Spark binds to on this node
# - SPARK_PUBLIC_DNS, to set the public DNS name of the driver program
# - SPARK_LOCAL_DIRS, storage directories to use on this node for shuffle and RDD data
# - MESOS_NATIVE_JAVA_LIBRARY, to point to your libmesos.so if you use Mesos

# Options read in YARN client/cluster mode
# - SPARK_CONF_DIR, Alternate conf dir. (Default: ${SPARK_HOME}/conf)
# - HADOOP_CONF_DIR, to point Spark towards Hadoop configuration files
# - YARN_CONF_DIR, to point Spark towards YARN configuration files when you use YARN
# - SPARK_EXECUTOR_CORES, Number of cores for the executors (Default: 1).
# - SPARK_EXECUTOR_MEMORY, Memory per Executor (e.g. 1000M, 2G) (Default: 1G)
# - SPARK_DRIVER_MEMORY, Memory for Driver (e.g. 1000M, 2G) (Default: 1G)

# Options for the daemons used in the standalone deploy mode
# - SPARK_MASTER_HOST, to bind the master to a different IP address or hostname
# - SPARK_MASTER_PORT / SPARK_MASTER_WEBUI_PORT, to use non-default ports for the master
# - SPARK_MASTER_OPTS, to set config properties only for the master (e.g. "-Dx=y")
# - SPARK_WORKER_CORES, to set the number of cores to use on this machine
# - SPARK_WORKER_MEMORY, to set how much total memory workers have to give executors (e.g. 1000m, 2g)
# - SPARK_WORKER_PORT / SPARK_WORKER_WEBUI_PORT, to use non-default ports for the worker
# - SPARK_WORKER_DIR, to set the working directory of worker processes
# - SPARK_WORKER_OPTS, to set config properties only for the worker (e.g. "-Dx=y")
# - SPARK_DAEMON_MEMORY, to allocate to the master, worker and history server themselves (default: 1g).
# - SPARK_HISTORY_OPTS, to set config properties only for the history server (e.g. "-Dx=y")
# - SPARK_SHUFFLE_OPTS, to set config properties only for the external shuffle service (e.g. "-Dx=y")
# - SPARK_DAEMON_JAVA_OPTS, to set config properties for all daemons (e.g. "-Dx=y")
# - SPARK_DAEMON_CLASSPATH, to set the classpath for all daemons
# - SPARK_PUBLIC_DNS, to set the public dns name of the master or workers

# Generic options for the daemons used in the standalone deploy mode
# - SPARK_CONF_DIR      Alternate conf dir. (Default: ${SPARK_HOME}/conf)
# - SPARK_LOG_DIR       Where log files are stored.  (Default: ${SPARK_HOME}/logs)
# - SPARK_PID_DIR       Where the pid file is stored. (Default: /tmp)
# - SPARK_IDENT_STRING  A string representing this instance of spark. (Default: $USER)
# - SPARK_NICENESS      The scheduling priority for daemons. (Default: 0)
# - SPARK_NO_DAEMONIZE  Run the proposed command in the foreground. It will not output a PID file.
# Options for native BLAS, like Intel MKL, OpenBLAS, and so on.
# You might get better performance to enable these options if using native BLAS (see SPARK-21305).
# - MKL_NUM_THREADS=1        Disable multi-threading of Intel MKL
# - OPENBLAS_NUM_THREADS=1   Disable multi-threading of OpenBLAS
export SPARK_HOME=/root/tools/spark-2.4.8-pure
export SCALA_HOME=/root/tools/scala-2.12.15
export JAVA_HOME=/root/tools/jdk1.8.0_333
export PATH=$PATH:$JAVA_HOME/bin:$HADOOP_HOME/bin:$HADOOP_HOME/sbin:$SCALA_HOME/bin
export HADOOP_CONF_DIR=$HADOOP_HOME/etc/hadoop
export YARN_CONF_DIR=$HADOOP_HOME/etc/hadoop
export SPARK_LOCAL_DIRS=/root/tools/spark-2.4.8-pure
export SPARK_LIBARY_PATH=.:$JAVA_HOME/lib:$JAVA_HOME/jre/lib:$HADOOP_HOME/lib/native
#export SPAR_MASTER_PORT=7077
export SPARK_MASTER_HOST=hadoopmaster
export SPARK_HISTORY_OPTS="-Dspark.history.ui.port=18080 -Dspark.history.retainedApplications=3 -Dspark.history.fs.logDirectory=hdfs://hadoopmaster:9000/spark-logs"

# HADOOP_HOME 会从hive-env.sh 带过来，这里仅为Spark 单独运行服务
export HADOOP_HOME=/root/tools/hadoop-3.3.4
# 无论Spark 纯净版还是Hive on Spark 没有SPARK_DIST_CLASSPATH 都不能运行
export SPARK_DIST_CLASSPATH=$(${HADOOP_HOME}/bin/hdfs classpath)
# YARN_CONF_DIR 仅用于Spark 和YARN 对接，跟Hive on Spark 无关
export YARN_CONF_DIR=${HADOOP_HOME}/etc/hadoop
"spark-env.sh" 87L, 5297C written
[root@hadoopmaster conf]#
```

5、配置spark环境变量

```shell
vi /etc/profile
    
#spark
export SPARK_HOME=/root/tools/spark-2.4.8-pure
export HADOOP_CONF_DIR=$HADOOP_HOME/etc/hadoop
export LD_LIBRARY_PATH=$HADOOP_HOME/lib/native:$LD_LIBRARY_PATH
export PATH=$SPARK_HOME/bin:$PATH
```

source /etc/profile  使环境配置生效

6、测试 spark

```shell
[root@hadoopmaster conf]# cd /root/tools/spark-2.4.8-pure/bin
[root@hadoopmaster bin]# ./run-example SparkPi 10
2022-09-15 09:10:46,176 INFO spark.SecurityManager: Changing view acls to: root
2022-09-15 09:10:46,176 INFO spark.SecurityManager: Changing modify acls to: root
2022-09-15 09:10:46,177 INFO spark.SecurityManager: Changing view acls groups to: 
2022-09-15 09:10:46,177 INFO spark.SecurityManager: Changing modify acls groups to: 
.......  --省略若干行
2022-09-15 09:10:49,576 INFO scheduler.DAGScheduler: Job 0 finished: reduce at SparkPi.scala:38, took 1.317423 s
Pi is roughly 3.1431991431991433
2022-09-15 09:10:49,602 INFO server.AbstractConnector: Stopped Spark@57dc9128{HTTP/1.1, (http/1.1)}{0.0.0.0:4040}
2022-09-15 09:10:49,603 INFO ui.SparkUI: Stopped Spark web UI at http://hadoopmaster:4040
2022-09-15 09:10:50,056 INFO spark.MapOutputTrackerMasterEndpoint: MapOutputTrackerMasterEndpoint stopped!
[root@hadoopmaster bin]# 
```

在打印的日志中可找到结果值: Pi is roughly 3.1434191434191433

7、上传jars到hdfs目录

```shell
[root@hadoopmaster spark-2.4.8-pure]# cd /root/tools/spark-2.4.8-pure/jars
[root@hadoopmaster jars]# mv orc-core-1.5.5-nohive.jar orc-core-1.5.5-nohive.jar.bak
[root@hadoopmaster jars]# hadoop fs -mkdir /spark2-jars
[root@hadoopmaster jars]# hadoop dfs -put *.jar /spark2-jars
WARNING: Use of this script to execute dfs is deprecated.
WARNING: Attempting to execute replacement "hdfs dfs" instead.

[root@hadoopmaster jars]# hadoop fs -ls /spark2-jars
Found 133 items
-rw-r--r--   3 root supergroup     325335 2022-09-15 09:15 /spark2-jars/RoaringBitmap-0.7.45.jar
-rw-r--r--   3 root supergroup     134044 2022-09-15 09:14 /spark2-jars/aircompressor-0.10.jar
-rw-r--r--   3 root supergroup     334662 2022-09-15 09:14 /spark2-jars/antlr4-runtime-4.7.jar
-rw-r--r--   3 root supergroup      14766 2022-09-15 09:14 /spark2-jars/aopalliance-repackaged-2.4.0-b34.jar
-rw-r--r--   3 root supergroup    1194003 2022-09-15 09:14 /spark2-jars/arpack_combined_all-0.1.jar
-rw-r--r--   3 root supergroup      52037 2022-09-15 09:14 /spark2-jars/arrow-format-0.10.0.jar
-rw-r--r--   3 root supergroup      79283 2022-09-15 09:14 /spark2-jars/arrow-memory-0.10.0.jar
-rw-r--r--   3 root supergroup    1318940 2022-09-15 09:14 /spark2-jars/arrow-vector-0.10.0.jar
-rw-r--r--   3 root supergroup     176285 2022-09-15 09:14 /spark2-jars/automaton-1.11-8.jar
-rw-r--r--   3 root supergroup    1556863 2022-09-15 09:14 /spark2-jars/avro-1.8.2.jar
-rw-r--r--   3 root supergroup     132989 2022-09-15 09:14 /spark2-jars/avro-ipc-1.8.2.jar
-rw-r--r--   3 root supergroup     187052 2022-09-15 09:14 /spark2-jars/avro-mapred-1.8.2-hadoop2.jar
-rw-r--r--   3 root supergroup     125330 2022-09-15 09:14 /spark2-jars/breeze-macros_2.12-0.13.2.jar
-rw-r--r--   3 root supergroup   13319481 2022-09-15 09:14 /spark2-jars/breeze_2.12-0.13.2.jar
-rw-r--r--   3 root supergroup      58633 2022-09-15 09:14 /spark2-jars/chill-java-0.9.3.jar
-rw-r--r--   3 root supergroup     195811 2022-09-15 09:14 /spark2-jars/chill_2.12-0.9.3.jar
-rw-r--r--   3 root supergroup     284184 2022-09-15 09:14 /spark2-jars/commons-codec-1.10.jar
-rw-r--r--   3 root supergroup      71626 2022-09-15 09:14 /spark2-jars/commons-compiler-3.0.16.jar
-rw-r--r--   3 root supergroup     632424 2022-09-15 09:14 /spark2-jars/commons-compress-1.20.jar
-rw-r--r--   3 root supergroup     134595 2022-09-15 09:14 /spark2-jars/commons-crypto-1.0.0.jar
-rw-r--r--   3 root supergroup     284220 2022-09-15 09:14 /spark2-jars/commons-lang-2.6.jar
-rw-r--r--   3 root supergroup     479881 2022-09-15 09:14 /spark2-jars/commons-lang3-3.5.jar
-rw-r--r--   3 root supergroup    2035066 2022-09-15 09:14 /spark2-jars/commons-math3-3.4.1.jar
-rw-r--r--   3 root supergroup     273370 2022-09-15 09:14 /spark2-jars/commons-net-3.1.jar
-rw-r--r--   3 root supergroup      79845 2022-09-15 09:14 /spark2-jars/compress-lzf-1.0.3.jar
-rw-r--r--   3 root supergroup     164422 2022-09-15 09:14 /spark2-jars/core-1.1.2.jar
-rw-r--r--   3 root supergroup      10166 2022-09-15 09:14 /spark2-jars/flatbuffers-1.2.0-3f79e055.jar
-rw-r--r--   3 root supergroup      14395 2022-09-15 09:14 /spark2-jars/generex-1.0.2.jar
-rw-r--r--   3 root supergroup     178947 2022-09-15 09:14 /spark2-jars/hk2-api-2.4.0-b34.jar
-rw-r--r--   3 root supergroup     181271 2022-09-15 09:14 /spark2-jars/hk2-locator-2.4.0-b34.jar
-rw-r--r--   3 root supergroup     118973 2022-09-15 09:14 /spark2-jars/hk2-utils-2.4.0-b34.jar
-rw-r--r--   3 root supergroup    1671083 2022-09-15 09:14 /spark2-jars/hppc-0.7.2.jar
-rw-r--r--   3 root supergroup    1282424 2022-09-15 09:14 /spark2-jars/ivy-2.4.0.jar
-rw-r--r--   3 root supergroup      46986 2022-09-15 09:14 /spark2-jars/jackson-annotations-2.6.7.jar
-rw-r--r--   3 root supergroup     258919 2022-09-15 09:14 /spark2-jars/jackson-core-2.6.7.jar
-rw-r--r--   3 root supergroup    1166637 2022-09-15 09:14 /spark2-jars/jackson-databind-2.6.7.3.jar
-rw-r--r--   3 root supergroup     320444 2022-09-15 09:14 /spark2-jars/jackson-dataformat-yaml-2.6.7.jar
-rw-r--r--   3 root supergroup      32612 2022-09-15 09:14 /spark2-jars/jackson-module-jaxb-annotations-2.6.7.jar
-rw-r--r--   3 root supergroup      42858 2022-09-15 09:14 /spark2-jars/jackson-module-paranamer-2.7.9.jar
-rw-r--r--   3 root supergroup     351802 2022-09-15 09:14 /spark2-jars/jackson-module-scala_2.12-2.6.7.1.jar
-rw-r--r--   3 root supergroup     926574 2022-09-15 09:14 /spark2-jars/janino-3.0.16.jar
-rw-r--r--   3 root supergroup     714195 2022-09-15 09:14 /spark2-jars/javassist-3.18.1-GA.jar
-rw-r--r--   3 root supergroup      26366 2022-09-15 09:14 /spark2-jars/javax.annotation-api-1.2.jar
-rw-r--r--   3 root supergroup       5950 2022-09-15 09:14 /spark2-jars/javax.inject-2.4.0-b34.jar
-rw-r--r--   3 root supergroup      95806 2022-09-15 09:14 /spark2-jars/javax.servlet-api-3.1.0.jar
-rw-r--r--   3 root supergroup     115534 2022-09-15 09:14 /spark2-jars/javax.ws.rs-api-2.0.1.jar
-rw-r--r--   3 root supergroup      16430 2022-09-15 09:14 /spark2-jars/jcl-over-slf4j-1.7.16.jar
-rw-r--r--   3 root supergroup     167421 2022-09-15 09:14 /spark2-jars/jersey-client-2.22.2.jar
-rw-r--r--   3 root supergroup     698375 2022-09-15 09:14 /spark2-jars/jersey-common-2.22.2.jar
-rw-r--r--   3 root supergroup      18098 2022-09-15 09:14 /spark2-jars/jersey-container-servlet-2.22.2.jar
-rw-r--r--   3 root supergroup      66270 2022-09-15 09:14 /spark2-jars/jersey-container-servlet-core-2.22.2.jar
-rw-r--r--   3 root supergroup     971310 2022-09-15 09:14 /spark2-jars/jersey-guava-2.22.2.jar
-rw-r--r--   3 root supergroup      72733 2022-09-15 09:14 /spark2-jars/jersey-media-jaxb-2.22.2.jar
-rw-r--r--   3 root supergroup     951701 2022-09-15 09:14 /spark2-jars/jersey-server-2.22.2.jar
-rw-r--r--   3 root supergroup     627814 2022-09-15 09:14 /spark2-jars/joda-time-2.9.3.jar
-rw-r--r--   3 root supergroup      83376 2022-09-15 09:14 /spark2-jars/json4s-ast_2.12-3.5.3.jar
-rw-r--r--   3 root supergroup     489399 2022-09-15 09:14 /spark2-jars/json4s-core_2.12-3.5.3.jar
-rw-r--r--   3 root supergroup      40086 2022-09-15 09:14 /spark2-jars/json4s-jackson_2.12-3.5.3.jar
-rw-r--r--   3 root supergroup     346628 2022-09-15 09:14 /spark2-jars/json4s-scalap_2.12-3.5.3.jar
-rw-r--r--   3 root supergroup      33015 2022-09-15 09:14 /spark2-jars/jsr305-1.3.9.jar
-rw-r--r--   3 root supergroup     764569 2022-09-15 09:14 /spark2-jars/jtransforms-2.4.0.jar
-rw-r--r--   3 root supergroup       4596 2022-09-15 09:14 /spark2-jars/jul-to-slf4j-1.7.16.jar
-rw-r--r--   3 root supergroup     410874 2022-09-15 09:14 /spark2-jars/kryo-shaded-4.0.2.jar
-rw-r--r--   3 root supergroup     686815 2022-09-15 09:14 /spark2-jars/kubernetes-client-4.6.1.jar
-rw-r--r--   3 root supergroup   11061771 2022-09-15 09:14 /spark2-jars/kubernetes-model-4.6.1.jar
-rw-r--r--   3 root supergroup       3956 2022-09-15 09:14 /spark2-jars/kubernetes-model-common-4.6.1.jar
-rw-r--r--   3 root supergroup    1045744 2022-09-15 09:14 /spark2-jars/leveldbjni-all-1.8.jar
-rw-r--r--   3 root supergroup      12486 2022-09-15 09:14 /spark2-jars/logging-interceptor-3.12.0.jar
-rw-r--r--   3 root supergroup     370119 2022-09-15 09:14 /spark2-jars/lz4-java-1.4.0.jar
-rw-r--r--   3 root supergroup      33650 2022-09-15 09:14 /spark2-jars/machinist_2.12-0.6.1.jar
-rw-r--r--   3 root supergroup       3180 2022-09-15 09:14 /spark2-jars/macro-compat_2.12-1.1.1.jar
-rw-r--r--   3 root supergroup    7343426 2022-09-15 09:14 /spark2-jars/mesos-1.4.0-shaded-protobuf.jar
-rw-r--r--   3 root supergroup     120465 2022-09-15 09:14 /spark2-jars/metrics-core-3.1.5.jar
-rw-r--r--   3 root supergroup      21247 2022-09-15 09:14 /spark2-jars/metrics-graphite-3.1.5.jar
-rw-r--r--   3 root supergroup      15824 2022-09-15 09:14 /spark2-jars/metrics-json-3.1.5.jar
-rw-r--r--   3 root supergroup      39283 2022-09-15 09:14 /spark2-jars/metrics-jvm-3.1.5.jar
-rw-r--r--   3 root supergroup       5711 2022-09-15 09:14 /spark2-jars/minlog-1.3.0.jar
-rw-r--r--   3 root supergroup    1330219 2022-09-15 09:14 /spark2-jars/netty-3.9.9.Final.jar
-rw-r--r--   3 root supergroup    4153218 2022-09-15 09:14 /spark2-jars/netty-all-4.1.47.Final.jar
-rw-r--r--   3 root supergroup      54391 2022-09-15 09:14 /spark2-jars/objenesis-2.5.1.jar
-rw-r--r--   3 root supergroup     422786 2022-09-15 09:14 /spark2-jars/okhttp-3.12.0.jar
-rw-r--r--   3 root supergroup      88732 2022-09-15 09:14 /spark2-jars/okio-1.15.0.jar
-rw-r--r--   3 root supergroup      19827 2022-09-15 09:14 /spark2-jars/opencsv-2.3.jar
-rw-r--r--   3 root supergroup     812313 2022-09-15 09:14 /spark2-jars/orc-mapreduce-1.5.5-nohive.jar
-rw-r--r--   3 root supergroup      27745 2022-09-15 09:14 /spark2-jars/orc-shims-1.5.5.jar
-rw-r--r--   3 root supergroup      65261 2022-09-15 09:14 /spark2-jars/oro-2.0.8.jar
-rw-r--r--   3 root supergroup      20235 2022-09-15 09:14 /spark2-jars/osgi-resource-locator-1.0.1.jar
-rw-r--r--   3 root supergroup      34654 2022-09-15 09:14 /spark2-jars/paranamer-2.8.jar
-rw-r--r--   3 root supergroup    1097799 2022-09-15 09:14 /spark2-jars/parquet-column-1.10.1.jar
-rw-r--r--   3 root supergroup      94995 2022-09-15 09:15 /spark2-jars/parquet-common-1.10.1.jar
-rw-r--r--   3 root supergroup     848750 2022-09-15 09:15 /spark2-jars/parquet-encoding-1.10.1.jar
-rw-r--r--   3 root supergroup     723203 2022-09-15 09:15 /spark2-jars/parquet-format-2.4.0.jar
-rw-r--r--   3 root supergroup     285732 2022-09-15 09:15 /spark2-jars/parquet-hadoop-1.10.1.jar
-rw-r--r--   3 root supergroup    1048171 2022-09-15 09:15 /spark2-jars/parquet-jackson-1.10.1.jar
-rw-r--r--   3 root supergroup     122774 2022-09-15 09:15 /spark2-jars/py4j-0.10.7.jar
-rw-r--r--   3 root supergroup      94796 2022-09-15 09:15 /spark2-jars/pyrolite-4.13.jar
-rw-r--r--   3 root supergroup   10672015 2022-09-15 09:15 /spark2-jars/scala-compiler-2.12.10.jar
-rw-r--r--   3 root supergroup    5276900 2022-09-15 09:15 /spark2-jars/scala-library-2.12.10.jar
-rw-r--r--   3 root supergroup     225042 2022-09-15 09:15 /spark2-jars/scala-parser-combinators_2.12-1.1.0.jar
-rw-r--r--   3 root supergroup    3678534 2022-09-15 09:15 /spark2-jars/scala-reflect-2.12.10.jar
-rw-r--r--   3 root supergroup     548430 2022-09-15 09:15 /spark2-jars/scala-xml_2.12-1.0.5.jar
-rw-r--r--   3 root supergroup    2829843 2022-09-15 09:15 /spark2-jars/shapeless_2.12-2.3.2.jar
-rw-r--r--   3 root supergroup       4028 2022-09-15 09:15 /spark2-jars/shims-0.7.45.jar
-rw-r--r--   3 root supergroup     269295 2022-09-15 09:15 /spark2-jars/snakeyaml-1.15.jar
-rw-r--r--   3 root supergroup    1969177 2022-09-15 09:15 /spark2-jars/snappy-java-1.1.8.2.jar
-rw-r--r--   3 root supergroup    7135740 2022-09-15 09:15 /spark2-jars/spark-catalyst_2.12-2.4.8.jar
-rw-r--r--   3 root supergroup    9183258 2022-09-15 09:15 /spark2-jars/spark-core_2.12-2.4.8.jar
-rw-r--r--   3 root supergroup     429756 2022-09-15 09:15 /spark2-jars/spark-graphx_2.12-2.4.8.jar
-rw-r--r--   3 root supergroup     328730 2022-09-15 09:15 /spark2-jars/spark-kubernetes_2.12-2.4.8.jar
-rw-r--r--   3 root supergroup      57071 2022-09-15 09:15 /spark2-jars/spark-kvstore_2.12-2.4.8.jar
-rw-r--r--   3 root supergroup      75932 2022-09-15 09:15 /spark2-jars/spark-launcher_2.12-2.4.8.jar
-rw-r--r--   3 root supergroup     292625 2022-09-15 09:15 /spark2-jars/spark-mesos_2.12-2.4.8.jar
-rw-r--r--   3 root supergroup     101649 2022-09-15 09:15 /spark2-jars/spark-mllib-local_2.12-2.4.8.jar
-rw-r--r--   3 root supergroup    5305725 2022-09-15 09:15 /spark2-jars/spark-mllib_2.12-2.4.8.jar
-rw-r--r--   3 root supergroup    2393993 2022-09-15 09:15 /spark2-jars/spark-network-common_2.12-2.4.8.jar
-rw-r--r--   3 root supergroup      70901 2022-09-15 09:15 /spark2-jars/spark-network-shuffle_2.12-2.4.8.jar
-rw-r--r--   3 root supergroup      51176 2022-09-15 09:15 /spark2-jars/spark-repl_2.12-2.4.8.jar
-rw-r--r--   3 root supergroup      30056 2022-09-15 09:15 /spark2-jars/spark-sketch_2.12-2.4.8.jar
-rw-r--r--   3 root supergroup    5792023 2022-09-15 09:15 /spark2-jars/spark-sql_2.12-2.4.8.jar
-rw-r--r--   3 root supergroup    1154667 2022-09-15 09:15 /spark2-jars/spark-streaming_2.12-2.4.8.jar
-rw-r--r--   3 root supergroup       9281 2022-09-15 09:15 /spark2-jars/spark-tags_2.12-2.4.8-tests.jar
-rw-r--r--   3 root supergroup      15490 2022-09-15 09:15 /spark2-jars/spark-tags_2.12-2.4.8.jar
-rw-r--r--   3 root supergroup      49986 2022-09-15 09:15 /spark2-jars/spark-unsafe_2.12-2.4.8.jar
-rw-r--r--   3 root supergroup     326570 2022-09-15 09:15 /spark2-jars/spark-yarn_2.12-2.4.8.jar
-rw-r--r--   3 root supergroup      69702 2022-09-15 09:15 /spark2-jars/spire-macros_2.12-0.13.0.jar
-rw-r--r--   3 root supergroup    9660469 2022-09-15 09:15 /spark2-jars/spire_2.12-0.13.0.jar
-rw-r--r--   3 root supergroup     174351 2022-09-15 09:15 /spark2-jars/stream-2.7.0.jar
-rw-r--r--   3 root supergroup     404970 2022-09-15 09:15 /spark2-jars/univocity-parsers-2.7.3.jar
-rw-r--r--   3 root supergroup      63777 2022-09-15 09:15 /spark2-jars/validation-api-1.1.0.Final.jar
-rw-r--r--   3 root supergroup     282930 2022-09-15 09:15 /spark2-jars/xbean-asm6-shaded-4.8.jar
-rw-r--r--   3 root supergroup      99555 2022-09-15 09:15 /spark2-jars/xz-1.5.jar
-rw-r--r--   3 root supergroup      35518 2022-09-15 09:15 /spark2-jars/zjsonpatch-0.3.0.jar
-rw-r--r--   3 root supergroup    4210625 2022-09-15 09:15 /spark2-jars/zstd-jni-1.4.4-3.jar
[root@hadoopmaster jars]# 
```



8、启停spark

```shell
[root@hadoopmaster jars]# cd /root/tools/spark-2.4.8-pure/sbin
[root@hadoopmaster sbin]# ./start-all.sh
starting org.apache.spark.deploy.master.Master, logging to /root/tools/spark-2.4.8-pure/logs/spark-root-org.apache.spark.deploy.master.Master-1-hadoopmaster.out
localhost: WARNING: log4j.properties is not found. HADOOP_CONF_DIR may be incomplete.
localhost: starting org.apache.spark.deploy.worker.Worker, logging to /root/tools/spark-2.4.8-pure/logs/spark-root-org.apache.spark.deploy.worker.Worker-1-hadoopmaster.out
[root@hadoopmaster sbin]# jps
12480 DataNode
20562 Master
12722 SecondaryNameNode
13123 NodeManager
12339 NameNode
12980 ResourceManager
13527 JobHistoryServer
20701 Worker
20766 Jps
[root@hadoopmaster sbin]# 

./start-all.sh   --启动
    
./stop-all.sh    --停止

./start-history-server.sh --启动历史服务
    
./stop-history-server.sh  --停止历史服务
```

9、开放防火墙端口

如服务器开启防火墙，需要开放hadoop的前端端口

```shell
--查看防火墙状态
systemctl status firewalld.service
firewall-cmd --state

--临时关闭防火墙
systemctl stop  firewalld.service

systemctl start firewalld.serviece

--删除端口
firewall-cmd --zone=public --remove-port 8088/tcp --permanent

--查看防火墙所有开放的端口
firewall-cmd --zone=public  --list-ports

--spark可开放的前端端口
firewall-cmd --zone=public --add-port 18080/tcp  --permanent
 
--刷新防火墙
firewall-cmd --reload

spark历史前端：   http://192.168.17.149:18080


```

