# spark安装

## 本内容你将获得

- 如何在 centos7 服务器上安装 spark

##  依赖的环境

| 软件名称 | 版本号    |
| -------- | --------- |
| JDK      | 1.8.0_181 |
| hadoop   | 3.3.4     |

## 经验教训

  1、安装最新版本的spark，hive使用spark执行引擎时，无法提交作业。

  2、安装spark无hadoop版本后，hive使用spark执行引擎时，可提交作业。

## 部署

1、打开spark官网,下载spark-2.4.8-bin-without-hadoop-scala-2.12.tgz并上传到服务器

[spark-2.4.8-bin-without-hadoop-scala-2.12.tgz](https://archive.apache.org/dist/spark/spark-2.4.8/spark-2.4.8-bin-without-hadoop-scala-2.12.tgz)

2、解压spark安装包

```java
cd /root/tools
tar -xvzf spark-2.4.8-bin-without-hadoop-scala-2.12.tgz
mv spark-2.4.8-bin-without-hadoop-scala-2.12 spark-2.4.8-pure    
```

3、配置spark-defaults.conf，在文件最后增加配置

```java
cd /root/tools/spark-2.4.8-pure/conf
cp spark-defaults.conf.template spark-defaults.conf
cp spark-defaults.conf spark-defaults.conf_20220903bak
vi spark-defaults.conf            
 #spark.master                    spark://master:7077
 spark.eventLog.enabled           true
 spark.eventLog.dir               hdfs://hadoopmaster:9000/spark-logs
 spark.history.fs.logDirectory    hdfs://hadoopmaster:9000/spark-logs 
 spark.serializer                 org.apache.spark.serializer.KryoSerializer
 spark.driver.memory              5g
 spark.executor.extraJavaOptions  -XX:+PrintGCDetails -Dkey=value -Dnumbers="one two three"
 spark.history.ui.port            18080
 spark.history.fs.update.interval 10s
```

创建hdfs目录  hadoop fs -mkdir /spark-logs

4、配置spark-env.sh，在文件最后增加配置

```java
cd /root/tools/spark-2.4.8-pure/conf

cp spark-env.sh.template spark-env.sh
    
cp spark-env.sh spark-env.sh_20220903bak
    
vi spark-env.sh

export SPARK_HOME=/root/tools/spark-2.4.8-pure
export SCALA_HOME=/root/tools/scala-2.12.15
export JAVA_HOME=/usr/java/jdk1.8.0_181
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
```

5、配置spark环境变量

```java
vi /etc/profile
    
#spark
export SPARK_HOME=/root/tools/spark-2.4.8-pure
export HADOOP_CONF_DIR=$HADOOP_HOME/etc/hadoop
export LD_LIBRARY_PATH=$HADOOP_HOME/lib/native:$LD_LIBRARY_PATH
export PATH=$SPARK_HOME/bin:$PATH
```

source /etc/profile  使环境配置生效

6、测试 spark

```java
cd /root/tools/spark-2.4.8-pure/bin
./run-example SparkPi 10
```

在打印的日志中可找到结果值: Pi is roughly 3.1434191434191434

7、启停spark

```java
cd /root/tools/spark-2.4.8-pure/sbin

./start-all.sh
    
./stop-all.sh

./start-history-server.sh
    
./stop-history-server.sh    
```

8、开放防火墙端口

如服务器开启防火墙，需要开放hadoop的前端端口

```
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

