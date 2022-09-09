# hive安装

## 本内容你将获得

- 如何在 centos7 服务器上安装 hive

##  依赖的环境

| 软件名称 | 版本号               |
| -------- | -------------------- |
| JDK      | 1.8.0_181            |
| hadoop   | 3.3.4                |
| spark    | 2.4.8-without-hadoop |
| scala    | 2.12                 |
| mysql    | 8.0.28               |

## 部署

1、打开mysql官网,下载mysql-8.0.28-1.el7.x86_64.rpm-bundle.tar

​      浏览器打开https://dev.mysql.com/downloads/mysql/链接，选择Archived Versions分页, Product version选择8.0.28，Operating System选择Red Hat Enterprise Linux / Oracle Linux ，OS version选择 Red Hat Enterprise Linux7 / Oracle Linux 7 (x86,64-bit)，在呈现的下载清单中，下载RPM Bundle。

​      下载 [mysql-8.0.28-1.el7.x86_64.rpm-bundle.tar](https://downloads.mysql.com/archives/get/p/23/file/mysql-8.0.28-1.el7.x86_64.rpm-bundle.tar)

2、在服务器上新建mysql用户及用户组，修改mysql用户的登录bin并设置密码

```java
groupadd mysql
    
useradd -g mysql -s /sbin/nologin mysql
    
vi /etc/passwd
    
mysql:x:1001:1001::/home/mysql:/sbin/nologin   ->  mysql:x:1001:1001::/home/mysql:/bin/bash   

[root@localhost etc]#  
passwd mysql    
Changing password for user mysql.
New password: 
Retype new password: 
passwd: all authentication tokens updated successfully.
[root@localhost etc]#    
```

 3、以mysql用户登录后，上传安装包并解压mysql安装包

```java
[mysql@hadoopmaster tools]$ tar -xvf mysql-8.0.28-1.el7.x86_64.rpm-bundle.tar
mysql-community-client-8.0.28-1.el7.x86_64.rpm
mysql-community-client-plugins-8.0.28-1.el7.x86_64.rpm
mysql-community-common-8.0.28-1.el7.x86_64.rpm
mysql-community-devel-8.0.28-1.el7.x86_64.rpm
mysql-community-embedded-compat-8.0.28-1.el7.x86_64.rpm
mysql-community-icu-data-files-8.0.28-1.el7.x86_64.rpm
mysql-community-libs-8.0.28-1.el7.x86_64.rpm
mysql-community-libs-compat-8.0.28-1.el7.x86_64.rpm
mysql-community-server-8.0.28-1.el7.x86_64.rpm
mysql-community-test-8.0.28-1.el7.x86_64.rpm
[mysql@hadoopmaster tools]$   
```

4、安装mysql

在安装前，先检查是否安装有mysql，如有则先卸载并清除相关文件。

```java
--安装 common，使用命令：
sudo rpm -ivh mysql-community-common-8.0.28-1.el7.x86_64.rpm

--安装 client，使用命令：
sudo rpm -ivh mysql-community-client-plugins-8.0.28-1.el7.x86_64.rpm
    
--安装 libs，使用命令：
sudo rpm -ivh mysql-community-libs-8.0.28-1.el7.x86_64.rpm
warning: mysql-community-libs-8.0.28-1.el7.x86_64.rpm: Header V4 RSA/SHA256 Signature, key ID 3a79bd29: NOKEY
error: Failed dependencies:
        mariadb-libs is obsoleted by mysql-community-libs-8.0.28-1.el7.x86_64
  --安装时提示缺少依赖包，则先安装依赖包 
  rpm -qa | grep mariadb
  mariadb-libs-5.5.44-2.el7.centos.x86_64
  sudo rpm -ev mariadb-libs-5.5.44-2.el7.centos.x86_64
  --安装依赖包后，继续安装 
  sudo rpm -ivh mysql-community-libs-8.0.28-1.el7.x86_64.rpm    

--安装 client
sudo rpm -ivh mysql-community-client-8.0.28-1.el7.x86_64.rpm  

--安装 icu-data-files
sudo rpm -ivh mysql-community-icu-data-files-8.0.28-1.el7.x86_64 
            
--安装 server，使用命令：
sudo rpm -ivh mysql-community-server-8.0.28-1.el7.x86_64.rpm   
            
         
--确认mysql 的安装包，使用命令：rpm -qa | grep mysql 

mysql-community-client-plugins-8.0.28-1.el7.x86_64
mysql-community-client-8.0.28-1.el7.x86_64
mysql-community-icu-data-files-8.0.28-1.el7.x86_64
mysql-community-common-8.0.28-1.el7.x86_64
mysql-community-libs-8.0.28-1.el7.x86_64
mysql-community-server-8.0.28-1.el7.x86_64
 
--完成对mysql数据库的初始化和开机配置：
sudo mysqld --initialize;
sudo chown mysql:mysql /var/lib/mysql -R;
sudo systemctl start mysqld.service;        --启动mysql数据库
sudo systemctl enable mysqld;               --来设置 mysql开机启动自动            
```

5、配置mysql数据库

```java
--查看数据库的密码
sudo cat /var/log/mysqld.log | grep password

2022-09-03T07:27:51.307706Z 6 [Note] [MY-010454] [Server] A temporary password is generated for root@localhost: lAzl#0N_)0KM
    
--进行数据库的登陆，密码为 lAzl#0N_)0KM
sudo mysql -u root -p    
    
--修改数据库密码：ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'qaz123689'; 

--root用户远程访问授权：
create user 'root'@'%' identified with mysql_native_password by 'qaz123689';
grant all privileges on *.* to 'root'@'%' with grant option;
flush privileges;

--开放端口
sudo firewall-cmd --zone=public --add-port 3306/tcp --permanent

--刷新防火墙
sudo firewall-cmd --reload

--安装后查看，是否开启binlog功能
mysql> show variables like 'log_bin' ; 
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| log_bin       | ON    |
+---------------+-------+
1 row in set (0.01 sec)

mysql> show master logs;
+---------------+-----------+-----------+
| Log_name      | File_size | Encrypted |
+---------------+-----------+-----------+
| binlog.000001 |      1132 | No        |
+---------------+-----------+-----------+
1 row in set (0.00 sec)
    
--创建hive用户并授权远程访问：
create user 'hive'@'%' identified with mysql_native_password by 'qaz123689';
grant all privileges on *.* to 'hive'@'%' with grant option;
flush privileges;    

```

6、以root用户安装hive

1)、打开hive官网的下载目录https://dlcdn.apache.org/hive/ ，选择最新版本并下载到服务器

[apache-hive-3.1.3-bin.tar.gz](https://dlcdn.apache.org/hive/hive-3.1.3/apache-hive-3.1.3-bin.tar.gz)

2)、解压

```java
[root@hadoopmaster tools]# tar -zxvf apache-hive-3.1.3-bin.tar.gz
[root@hadoopmaster tools]# mv apache-hive-3.1.3-bin   hive-3.1.3    
```

3)、创建hive的临时目录

```java
mkdir -p /root/hiveTemp/operation_logs
```

4)、配置hive的环境变量

```
vi /etc/profile

#hive
export HIVE_HOME=/root/tools/hive-3.1.3
export HIVE_CONF_DIR=$HIVE_HOME/conf 
export PATH=$PATH:$HIVE_HOME/sbin:$HIVE_HOME/bin

source /etc/profile
```

5)、下载mysql-connector 驱动包

登录maven仓库https://mvnrepository.com/，搜索mysql-connector，下载对应的版本。https://repo1.maven.org/maven2/mysql/mysql-connector-java/8.0.28/

[mysql-connector-java-8.0.28.jar](https://repo1.maven.org/maven2/mysql/mysql-connector-java/8.0.28/mysql-connector-java-8.0.28.jar)

将jar包上传到hive的lib目录

```java
[root@hadoopmaster lib]# pwd
/root/tools/hive-3.1.3/lib
[root@hadoopmaster lib]# ls -alt |grep mysql
-rw-rw-r--.  1 hadoop hadoop  2476480 Sep  3 16:04 mysql-connector-java-8.0.28.jar
-rw-r--r--.  1 hadoop hadoop    10476 Dec 20  2019 mysql-metadata-storage-0.12.0.jar
[root@hadoopmaster lib]# 
```

6)、将hive-on-spark依赖的spark包上传到hive的lib包

```
[root@hadoopmaster jars]# pwd
/root/tools/spark-2.4.8-pure/jars
[root@hadoopmaster jars]# ll |grep scala-compiler
-rw-r--r--. 1 hadoop hadoop 10672015 May  8  2021 scala-compiler-2.12.10.jar
[root@hadoopmaster jars]# ls -alt |grep scala-library
-rw-r--r--.  1 hadoop hadoop  5276900 May  8  2021 scala-library-2.12.10.jar
[root@hadoopmaster jars]# ll |grep scala-reflect-
-rw-r--r--. 1 hadoop hadoop  3678534 May  8  2021 scala-reflect-2.12.10.jar
[root@hadoopmaster jars]# ll |grep spark-core
-rw-r--r--. 1 hadoop hadoop  9183258 May  8  2021 spark-core_2.12-2.4.8.jar
[root@hadoopmaster jars]# ll |grep spark-network-common
-rw-r--r--. 1 hadoop hadoop  2393993 May  8  2021 spark-network-common_2.12-2.4.8.jar
[root@hadoopmaster jars]# ll|grep spark-unsafe
-rw-r--r--. 1 hadoop hadoop    49986 May  8  2021 spark-unsafe_2.12-2.4.8.jar
[root@hadoopmaster jars]# ll |grep spark-yarn
-rw-r--r--. 1 hadoop hadoop   326570 May  8  2021 spark-yarn_2.12-2.4.8.jar
[root@hadoopmaster jars]# cp scala-compiler-2.12.10.jar /root/tools/hive-3.1.3/lib
[root@hadoopmaster jars]# cp scala-library-2.12.10.jar /root/tools/hive-3.1.3/lib
[root@hadoopmaster jars]# cp scala-reflect-2.12.10.jar /root/tools/hive-3.1.3/lib
[root@hadoopmaster jars]# cp spark-core_2.12-2.4.8.jar /root/tools/hive-3.1.3/lib
[root@hadoopmaster jars]# cp spark-network-common_2.12-2.4.8.jar /root/tools/hive-3.1.3/lib
[root@hadoopmaster jars]# cp spark-unsafe_2.12-2.4.8.jar /root/tools/hive-3.1.3/lib
[root@hadoopmaster jars]# cp spark-yarn_2.12-2.4.8.jar /root/tools/hive-3.1.3/lib
[root@hadoopmaster jars]# 
[root@hadoopmaster lib]# cd /root/tools/hive-3.1.3/lib
[root@hadoopmaster lib]# [root@hadoopmaster lib]# ls -alt |grep orc-core
-rw-r--r--.  1 hadoop hadoop   800832 Dec  5  2019 orc-core-1.5.8.jar
[root@hadoopmaster lib]# hdfs dfs -put orc-core-1.5.8.jar /spark2-jars
```

7)、配置hive-env.sh

```
vi /root/tools/hive-3.1.3/conf/hive-env.sh

#hadoop_home路径
HADOOP_HOME=/root/tools/hadoop-3.3.4

#hive配置文件存放路径
export HIVE_CONF_DIR=/root/tools/hive-3.1.3/conf

#hive相关jar存放路径
export HIVE_AUX_JARS_PATH=/root/tools/hive-3.1.3/lib

# 新增SPARK_HOME 必须是without-hadoop 的纯净版
export SPARK_HOME=/root/tools/spark-2.4.8-pure

```

8)、配置hive-site.xml 

```
cp hive-default.xml.template hive-site.xml 

在hive-site.xml的后面增加如下配置
  <property>
   <name>spark.master</name>
   <value>spark://192.168.17.149:7077</value>
  </property>
  <property>
	<name>hive.enable.spark.execution.engine</name>
	<value>true</value>
  </property>
  <property>
	<name>spark.home</name>
	<value>/root/tools/spark-2.4.8-pure</value>
  </property>
  <property>
	<name>spark.enentLog.enabled</name>
	<value>true</value>
  </property>
  <property>
	<name>spark.enentLog.dir</name>
	<value>hdfs://192.168.17.149:9000/spark-logs</value>
  </property>
  <property>
	<name>spark.serializer</name>
	<value>org.apache.spark.serializer.KryoSerializer</value>
  </property>
  <property>
	<name>spark.executor.extraJavaOptions</name>
        <value>-XX:+PrintGCDetails -Dkey=value -Dnumbers="one two three"</value>
  </property>

  <!-- Spark3 依赖库位置，在YARN 上运行的任务需要从HDFS 中查找依赖jar 文件 -->
  <property>
    <name>spark.yarn.jars</name>
    <value>hdfs://192.168.17.149:9000/spark2-jars/*</value>
  </property>

   <!-- Hive3 和Spark2 连接超时时间 -->
  <property>
    <name>hive.spark.client.connect.timeout</name>
    <value>10000ms</value>
  </property>
   
  <!--Spark端口 -->
  <property>
    <name>spark.driver.port</name>
    <value>7077</value>
  </property>
  
  修改
    <property>
    <name>hive.exec.scratchdir</name>
    <value>/tmp/hive</value>                        ->    <value>hdfs://192.168.17.149:9000/data/hive/tmp</value>
  </property>
  
  <property>
    <name>hive.exec.local.scratchdir</name>
    <value>${system:java.io.tmpdir}/${system:user.name}</value>                 -><value>/root/hiveTemp</value>
  </property>
  
  <property>
    <name>hive.downloaded.resources.dir</name>
    <value>${system:java.io.tmpdir}/${hive.session.id}_resources</value>        -> <value>/root/hiveTemp</value>
  </property>
  
  
  <property>
    <name>hive.metastore.warehouse.dir</name>
    <value>/user/hive/warehouse</value>                      -> <value>hdfs://192.168.17.149:9000/data/hive/warehouse</value>   
  </property>
  
    <property>
    <name>javax.jdo.option.ConnectionPassword</name>  
    <value>mine</value>                                     -> <value>qaz123689</value>
  </property>
  
  
  <property>
    <name>javax.jdo.option.ConnectionURL</name>
    <value>jdbc:derby:;databaseName=metastore_db;create=true</value>  -> <value>jdbc:mysql://192.168.17.149:3306/hive</value>  
  </property>
  
  <property>
    <name>hive.metastore.event.db.notification.api.auth</name>
    <value>true</value>                                           -> <value>false</value>
  </property>
  
  <property>
    <name>javax.jdo.option.ConnectionDriverName</name>
    <value>org.apache.derby.jdbc.EmbeddedDriver</value>           -> <value>com.mysql.jdbc.Driver</value>
  </property>
  
  <property>
    <name>javax.jdo.option.ConnectionUserName</name>
    <value>APP</value>                                            -> <value>hive</value>
  </property>
  
    <property>
    <name>hive.querylog.location</name>
    <value>${system:java.io.tmpdir}/${system:user.name}</value>   ->  <value>hdfs://192.168.17.149:9000/data/hive/log</value>
  </property>
  
  
  <property>
    <name>hive.stats.dbclass</name>
    <value>fs</value>                                             ->  <value>jdbc:msyql</value>  
  </property>
  
  <property>
    <name>hive.txn.xlock.iow</name>
    <value>true</value>
    <description>
      Ensures commands with OVERWRITE (such as INSERT OVERWRITE) acquire Exclusive locks for&#8;transactional tables.  This ensures that inserts (w/o overwrite) running concurrently
      are not hidden by the INSERT OVERWRITE.
    </description>
  </property>
  ==> description改成如下，原因为xml中的&需要转义
  <property>
    <name>hive.txn.xlock.iow</name>
    <value>true</value>
    <description>
      Ensures commands with OVERWRITE (such as INSERT OVERWRITE) acquire Exclusive locks for&amp;#8;transactional tables.  This ensures that inserts (w/o overwrite) running concurrently
      are not hidden by the INSERT OVERWRITE.
    </description>
  </property>
  
  <property>
    <name>hive.server2.active.passive.ha.enable</name>
     <value>false</value>                                                       -> <value>true</value>
  </property>
  
  <property>
    <name>hive.server2.logging.operation.log.location</name>
    <value>${system:java.io.tmpdir}/${system:user.name}/operation_logs</value>  -> <value>/root/hiveTemp/operation_logs</value>
  </property>
  
  
```

9)、创建hive-site.xml 中需要的hdfs目录

```

hadoop fs -mkdir /data
hadoop fs -mkdir /data/hive
hadoop fs -mkdir /data/hive/warehouse
hadoop fs -mkdir /data/hive/tmp
hadoop fs -mkdir /data/hive/log
hadoop fs -mkdir /spark-logs
```

10)、创建spark-defaults.conf

```
touch spark-defaults.conf
vi spark-defaults.conf

spark.master              yarn
# 启用日志聚合
spark.eventLog.enabled    true
# 保存日志的HDFS 路径
spark.eventLog.dir        hdfs://192.168.17.149:9000/spark2-history
spark.executor.memory     1g
spark.driver.memory       1g


创建hdfs目录  hadoop fs -mkdir /spark2-history
```



11)、初始化hive元数据库

```java
cd /root/tools/hive-3.1.3/bin
[root@hadoopmaster bin]# cd /root/tools/hive-3.1.3/bin
[root@hadoopmaster bin]# pwd
/root/tools/hive-3.1.3/bin
[root@hadoopmaster bin]# schematool -dbType mysql -initSchema
```

12)、启动hive数据库

```
[root@hadoopmaster bin]# hive
SLF4J: Class path contains multiple SLF4J bindings.
SLF4J: Found binding in [jar:file:/root/tools/hive-3.1.3/lib/log4j-slf4j-impl-2.17.1.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: Found binding in [jar:file:/root/tools/hadoop-3.3.4/share/hadoop/common/lib/slf4j-reload4j-1.7.36.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: See http://www.slf4j.org/codes.html#multiple_bindings for an explanation.
SLF4J: Actual binding is of type [org.apache.logging.slf4j.Log4jLoggerFactory]
which: no hbase in (/root/tools/spark-2.4.8-pure/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/usr/java/jdk1.8.0_181-cloudera/bin:/home/hadoop/tools/zookeeper-3.6.2/bin:/root/tools/hadoop-3.3.4/sbin:/root/tools/hadoop-3.3.4/bin:/root/tools/hive-3.1.3/sbin:/root/tools/hive-3.1.3/bin:/root/bin)
SLF4J: Class path contains multiple SLF4J bindings.
SLF4J: Found binding in [jar:file:/root/tools/hive-3.1.3/lib/log4j-slf4j-impl-2.17.1.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: Found binding in [jar:file:/root/tools/hadoop-3.3.4/share/hadoop/common/lib/slf4j-reload4j-1.7.36.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: See http://www.slf4j.org/codes.html#multiple_bindings for an explanation.
SLF4J: Actual binding is of type [org.apache.logging.slf4j.Log4jLoggerFactory]
Hive Session ID = 0966e03a-3409-4787-9322-dfaf265e8758

Logging initialized using configuration in file:/root/tools/hive-3.1.3/conf/hive-log4j2.properties Async: true
Loading class `com.mysql.jdbc.Driver'. This is deprecated. The new driver class is `com.mysql.cj.jdbc.Driver'. The driver is automatically registered via the SPI and manual loading of the driver class is generally unnecessary.
Hive-on-MR is deprecated in Hive 2 and may not be available in the future versions. Consider using a different execution engine (i.e. spark, tez) or using Hive 1.X releases.
Hive Session ID = 6fd2c97e-135f-4f5b-9f3c-ca179c81286c
hive> show databases;
OK
default
public
Time taken: 0.569 seconds, Fetched: 2 row(s)
hive> 

```

13)、验证spark引擎

```
启动元数据服务 
hive --service metastore &         ##元数据服务        netstat -anlp |grep 9083   重启前可杀掉进程再启动
 
启动hiveserver2服务 
hive --service hiveserver2 &        ##支持jdbc查询服务 netstat -anlp |grep 10000 重启前可杀掉进程再启动
```

