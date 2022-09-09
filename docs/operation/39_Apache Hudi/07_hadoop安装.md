# hadoop安装

## 本内容你将获得

- 如何在 centos7 服务器上安装 hadoop

##  依赖的环境

| 软件名称 | 版本号    |
| -------- | --------- |
| JDK      | 1.8.0_181 |

## 经验教训

  1、以 hadoop用户安装hadoop后，可正常运行。在调试flinksql获取kafka数据时，一直报org.apache.flink.shaded.jackson2.com.fasterxml.jackson.core.JsonParseException: Unexpected character ('<' (code 60)): expected a valid value (JSON String, Number, Array, Object or token 'null', 'true' or 'false')。最终通过以root用户部署hadoop、flink解决。

 2、以jdk11安装hadoop后，hdfs和yarn可正常运行，但部署hive时，无法启动。最终安装jdk8解决。

## 部署

1、打开hadoop官网,下载最新版本3.3.4并上传到服务器

  [hadoop-3.3.4.tar.gz](https://dlcdn.apache.org/hadoop/common/hadoop-3.3.4/hadoop-3.3.4.tar.gz)

2、上传jdk8到服务器。安装后配置环境变量

```java
rpm -ivh oracle-j2sdk1.8-1.8.0+update181-1.x86_64.rpm
    
cd  /usr/java/
    
mv  jdk1.8.0_181-cloudera jdk1.8.0_181   
    
vi /etc/profile
    
#java
export JAVA_HOME=/usr/java/jdk1.8.0_181
export JRE_HOME=$JAVA_HOME/jre
export PATH=$PATH:$JAVA_HOME/bin
export CLASSPATH=.:$JAVA_HOME/jre/lib:$JAVA_HOME/lib:$JAVA_HOME/lib/tools.jar 
  
```

source /etc/profile  使环境配置生效

3、设置免密登录

```java
ssh-keygen -t rsa

ssh-copy-id -i root@localhost
```

4、设置hostname,删除原来的设置localhost.localdomain 

```java
cd /etc

cp hostname hostname_20220903bak

vi hostname

hadoopmaster

```

5、设置hosts

```
cd /etc

cp hosts hosts_20220903bak

192.168.17.149 hadoopmaster

```

4、解压hadoop安装包

```java
cd /root/tools
tar -xvzf hadoop-3.3.4.tar.gz  
```

5、配置环境变量

```
vi /etc/profile
# HADOOP env variables
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
```

source  /etc/profile 使环境配置生效

6、修改core-site.xml,在<configuration>中增加配置

```java
cd /root/tools/hadoop-3.3.4/etc/hadoop

cp core-site.xml core-site.xml_20220903bak

vi core-site.xml

<property>
<name>fs.default.name</name>
<value>hdfs://192.168.17.149:9000</value>
</property>
```

7、修改 hdfs-site.xml,在<configuration>中增加配置

```java
cd /root/tools/hadoop-3.3.4/etc/hadoop

cp hdfs-site.xml hdfs-site.xml_20220903bak

vi hdfs-site.xml

<property>
<name>dfs.namenode.name.dir</name>
<value>/root/hadoop_store/hdfs/namenode2</value>
</property>
<property>
<name>dfs.datanode.data.dir</name>
<value>/root/hadoop_store/hdfs/datanode2</value>
</property>
<property>
<name>dfs.http.address</name>
<value>0.0.0.0:50070</value>
</property>

```

保存后，创建对应的目录

```java
mkdir -p /root/hadoop_store/hdfs/namenode2

mkdir -p /root/hadoop_store/hdfs/namenode2
```

8、修改mapred-site.xml,在<configuration>中增加配置

```
cd /root/tools/hadoop-3.3.4/etc/hadoop

cp mapred-site.xml  mapred-site.xml_20220903bak

vi mapred-site.xml

<property>
<name>mapreduce.framework.name</name>
<value>yarn</value>
</property>
<property>
<name>mapreduce.job.tracker</name>
<value>hdfs://192.167.17.149:8001</value>
<final>true</final>
</property>
<property>
<name>yarn.app.mapreduce.am.env</name>
<value>HADOOP_MAPRED_HOME=/root/tools/hadoop-3.3.4</value>
</property>
<property>
<name>mapreduce.map.env</name>
<value>HADOOP_MAPRED_HOME=/root/tools/hadoop-3.3.4</value>
</property>
<property>
<name>mapreduce.reduce.env</name>
<value>HADOOP_MAPRED_HOME=/root/tools/hadoop-3.3.4</value>
</property>

<!--  开启jobhistory服务--> 
<property>
<name>mapreduce.jobhistory.address</name>
<value>192.168.17.149:10020</value>
</property>

<property>
<name>mapreduce.jobhistory.webapp.address</name>
<value>192.168.17.149:19888</value>
</property>

```

9、修改yarn-site.xml,在<configuration>中增加配置

```
cd /root/tools/hadoop-3.3.4/etc/hadoop

cp yarn-site.xml yarn-site.xml_20220903bak

vi yarn-site.xml

<property>
<!--  为mr程序提供shuffle服务 -->
<name>yarn.nodemanager.aux-services</name>
<value>mapreduce_shuffle</value>
</property>
<property>
<name>yarn.nodemanager.aux-services.mapreduce.shuffle.class</name>
<value>org.apache.hadoop.mapred.ShuffleHandler</value>
</property>
<property>
<name>yarn.resourcemanager.resource-tracker.address</name>
<value>192.168.17.149:8025</value>
</property>
<property>
<name>yarn.resourcemanager.scheduler.address</name>
<value>192.168.17.149:8030</value>
</property>
<property>
<name>yarn.resourcemanager.address</name>
<value>192.168.17.149:8050</value>
</property>
<!--日志聚集  -->
<property>
    <name>yarn.log-aggregation-enable</name>
    <value>true</value>
</property>
<!-- 日志信息保存在文件系统上的最长时间  秒为单位-->
<property>
    <name>yarn.log-aggregation.retain-seconds</name>
    <value>640800</value>
</property>

<!-- Site specific YARN configuration properties -->
<!--  resource,manager主节点所在机器 -->
<property>
<name>yarn.resourcemanager.hostname</name>
<value>192.168.17.149</value>
</property>
<!--  一台NodeManager的总可用内存资源 -->
<property>
<name>yarn.nodemanager.resource.memory-mb</name>
<value>12288</value>
</property>
<!--  一台NodeManager的总可用（逻辑）cpu核数 -->
<property>
<name>yarn.nodemanager.resource.cpu-vcores</name>
<value>4</value>
</property>
 
<!--  是否检查容器的虚拟内存使用超标情况 -->
<property>
  <name>yarn.nodemanager.vmem-check-enabled</name>
  <value>false</value>
</property>
 
<!--  容器的虚拟内存使用上限：与物理内存的比率 --> 
<property>
  <name>yarn.nodemanager.vmem-pmem-ratio</name>
  <value>2.1</value>
</property>

<!--  container内存按照默认大小配置，即为最小1G，最大8G --> 
<property>
  <name>yarn.scheduler.minimum-allocation-mb</name>
  <value>1024</value>
</property>

<property>
  <name>yarn.scheduler.maximum-allocation-mb</name>
  <value>8192</value>
</property>

<!--  开启jobhistory服务--> 
<property>
  <name>yarn.log.server.url</name>
  <value>http://192.168.17.149:19888/jobhistory/logs/</value>
</property>

```

10、修改hadoop-env.sh

```
cd /root/tools/hadoop-3.3.4/etc/hadoop

cp hadoop-env.sh hadoop-env.sh_20220903bak

vi hadoop-env.sh

export JAVA_HOME=/usr/java/jdk1.8.0_181

#<!--  设置hadoop heap 大小-->
export HADOOP_HEAPSIZE=6000
```

11、修改yarn-env.sh

```
cd /root/tools/hadoop-3.3.4/etc/hadoop

cp yarn-env.sh yarn-env.sh_20220903bak

vi yarn-env.sh

YARN_HEAPSIZE=6000
```

12、在目录服务服务器上进行格式化并设置权限

hdfs namenode -format

hadoop fs -chmod -R 777 /

13、启停hadoop

```java
cd /root/tools/hadoop-3.3.4/bin

./start-all.sh   --启动hadoop服务
./stop-all.sh    --停止hadoop服务

./mr-jobhistory-daemon.sh start historyserver  --启动yarn日志功能
./mr-jobhistory-daemon.sh stop historyserver   --停止yarn日志功能
```

14、开放防火墙端口

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

--hadoop可开放的前端端口
firewall-cmd --zone=public --add-port 50070/tcp --permanent
firewall-cmd --zone=public --add-port 8088/tcp  --permanent
firewall-cmd --zone=public --add-port 19888/tcp --permanent

--刷新防火墙
firewall-cmd --reload

hadoop前端： http://192.168.17.149:50070

yarn前端：   http://192.168.17.149:8088

yarn历史前端：http://192.168.17.149:19888

```

