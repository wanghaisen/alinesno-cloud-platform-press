# spark安装

## 本内容你将获得

-  centos7 上安装 spark
-  验证spark安装

## 软件安装

#### 说明

- spark依赖 java环境
- hive on spark引擎依赖hadoop环境

### 安装开始

##### 上传spark-2.4.8-bin-without-hadoop-scala-2.12.tgz到服务器/root/tools目录

解压spark安装包

```shell
cd /root/tools
tar -xvzf spark-2.4.8-bin-without-hadoop-scala-2.12.tgz
mv spark-2.4.8-bin-without-hadoop-scala-2.12 spark-2.4.8-pure    
```

##### 配置spark-defaults.conf，在文件最后增加配置

```shell
hadoop fs -mkdir /spark-logs            #在hdfs中创建/spark-logs目录
cd /root/tools/spark-2.4.8-pure/conf
vi spark-defaults.conf

 spark.eventLog.enabled           true
 spark.eventLog.dir               hdfs://hadoopmaster:9000/spark-logs
 spark.history.fs.logDirectory    hdfs://hadoopmaster:9000/spark-logs
 spark.serializer                 org.apache.spark.serializer.KryoSerializer
 spark.driver.memory              5g
 spark.executor.extraJavaOptions  -XX:+PrintGCDetails -Dkey=value -Dnumbers="one two three"
 spark.history.ui.port            18080
 spark.history.fs.update.interval 10s
```

##### 配置spark-env.sh，在文件最后增加配置

```shell
cd /root/tools/spark-2.4.8-pure/conf
vi spark-env.sh

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
```

##### 配置spark环境变量

```shell
vi /etc/profile
#spark
export SPARK_HOME=/root/tools/spark-2.4.8-pure
export HADOOP_CONF_DIR=$HADOOP_HOME/etc/hadoop
export LD_LIBRARY_PATH=$HADOOP_HOME/lib/native:$LD_LIBRARY_PATH
export PATH=$SPARK_HOME/bin:$PATH
```

保存后，source /etc/profile  使环境配置生效

##### 上传jars到hdfs目录

```shell
cd /root/tools/spark-2.4.8-pure/jars
mv orc-core-1.5.5-nohive.jar orc-core-1.5.5-nohive.jar.bak
hadoop fs -mkdir /spark2-jars
hadoop dfs -put *.jar /spark2-jars
```

##### 测试 spark

```shell
cd /root/tools/spark-2.4.8-pure/bin
./run-example SparkPi 10
```

在打印的日志中找到结果值: Pi is roughly 3.1434191434191433,证明spark部署成功

##### 启停

```shell
cd /root/tools/spark-2.4.8-pure/sbin
./start-all.sh            --启动
./stop-all.sh             --停止
./start-history-server.sh --启动历史服务
./stop-history-server.sh  --停止历史服务
```

## 其他

- 无