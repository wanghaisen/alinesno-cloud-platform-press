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

3、配置spark-defaults.conf，在文件最后增加相关配置

```shell
[root@hadoopmaster conf]# cd /root/tools/spark-2.4.8-pure/conf
[root@hadoopmaster conf]# cp spark-defaults.conf.template spark-defaults.conf
[root@hadoopmaster conf]# cp spark-defaults.conf spark-defaults.conf_20220915bak
[root@hadoopmaster conf]# vi spark-defaults.conf
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
[root@hadoopmaster conf]# cp spark-env.sh.template spark-env.sh
[root@hadoopmaster conf]# cp spark-env.sh spark-env.sh_20220915bak
[root@hadoopmaster conf]# vi spark-env.sh

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

如服务器开启防火墙，可开放spark的前端端口

```shell
--spark可开放的前端端口
firewall-cmd --zone=public --add-port 18080/tcp  --permanent
 
--刷新防火墙
firewall-cmd --reload

spark历史前端：   http://192.168.17.149:18080
```

