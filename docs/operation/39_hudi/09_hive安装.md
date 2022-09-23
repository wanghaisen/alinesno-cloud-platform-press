# hive安装

## 本内容你将获得

- 如何在 centos7 服务器上安装 hive
- 设置spark引擎，使用hive on spark

##  依赖的环境

| 软件名称 | 版本号               |
| -------- | -------------------- |
| JDK      | 1.8.0_333            |
| hadoop   | 3.3.4                |
| spark    | 2.4.8-without-hadoop |
| scala    | 2.12                 |
| mysql    | 8.0.28               |

## 部署

1、打开mysql官网,下载mysql-8.0.28-1.el7.x86_64.rpm-bundle.tar

​      浏览器打开https://dev.mysql.com/downloads/mysql/链接，选择Archived Versions分页, Product version选择8.0.28，Operating System选择Red Hat Enterprise Linux / Oracle Linux ，OS version选择 Red Hat Enterprise Linux7 / Oracle Linux 7 (x86,64-bit)，在呈现的下载清单中，下载RPM Bundle。

​       [mysql-8.0.28-1.el7.x86_64.rpm-bundle.tar](https://downloads.mysql.com/archives/get/p/23/file/mysql-8.0.28-1.el7.x86_64.rpm-bundle.tar)

2、在服务器上新建mysql用户、用户组、设置密码、创建相关目录

```shell
[root@hadoopmaster tools]# groupadd mysql
[root@hadoopmaster tools]# useradd -g mysql -s /bin/bash mysql
[root@hadoopmaster tools]# passwd mysql
Changing password for user mysql.
New password: 
BAD PASSWORD: The password contains the user name in some form
Retype new password: 
passwd: all authentication tokens updated successfully.
[root@hadoopmaster tools]# 
[root@hadoopmaster tools]# su - mysql  
[mysql@hadoopmaster ~]$ mkdir data
[mysql@hadoopmaster ~]$ cd data
[mysql@hadoopmaster data]$ pwd
/home/mysql/data
[mysql@hadoopmaster data]$ cd ..
[mysql@hadoopmaster ~]$ mkdir mariadb
[mysql@hadoopmaster ~]$ cd mariadb
[mysql@hadoopmaster mariadb]$ pwd
/home/mysql/mariadb    
```

修改my.cnf配置

```shell
[root@hadoopmaster etc]# cp my.cnf my.cnf_20220914bak
[root@hadoopmaster etc]# vi my.cnf
[mysqld]
#Mysql服务的唯一编号 每个mysql服务Id需唯一
server-id=2022091400001

#服务端口号 默认3306
port = 3306

#mysql安装根目录
basedir=/home/mysql

#mysql数据文件所在位置
datadir=/home/mysql/data

#pid
pid-file = /home/mysql/mysql.pid

#设置socke文件所在目录
socket=/home/mysql/mysql.sock

#设置临时目录
tmpdir = /tmp

# 用户
user = mysql


# Disabling symbolic-links is recommended to prevent assorted security risks
symbolic-links=0
# Settings user and group are ignored when systemd is used.
# If you need to run mysqld under a different user or group,
# customize your systemd unit file for mariadb according to the
# instructions in http://fedoraproject.org/wiki/Systemd

#开启日志
log-bin=mysql-bin

binlog-format=ROW

#忽略大小写
lower_case_table_names=1

[mysqld_safe]
log-error=/home/mysql/mariadb/mariadb.log
pid-file=/home/mysql/mariadb/mariadb.pid

[client]
port=3306
socket=/home/mysql/mysql.sock

#
# include all files from the config directory
#
!includedir /etc/my.cnf.d

~

"my.cnf" 50L, 996C written
[root@hadoopmaster etc]# 
```

 3、上传安装包并解压mysql安装包

```shell
[root@hadoopmaster ~]# cd tools
[root@hadoopmaster tools]# ls -alt
total 825720
-rw-r--r--   1 root  root  843008000 Sep 14 16:27 mysql-8.0.28-1.el7.x86_64.rpm-bundle.tar
drwxr-xr-x  11 root  root       4096 Sep 14 16:25 .
-rw-r--r--   1 root  root    2476480 Sep 14 16:25 mysql-connector-java-8.0.28.jar
[root@hadoopmaster tools]# tar -xvf mysql-8.0.28-1.el7.x86_64.rpm-bundle.tar
[root@hadoopmaster tools]# ll
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
[root@hadoopmaster tools]# 
```

4、安装mysql

在安装前，先检查是否安装有mysql，如有则先卸载并清除相关文件。

```shell
[root@hadoopmaster tools]# rpm -qa | grep -i mysql   #检查是否已安装过mysql
[root@hadoopmaster tools]# rpm -ivh mysql-community-common-8.0.28-1.el7.x86_64.rpm           #安装common
[root@hadoopmaster tools]# rpm -ivh mysql-community-client-plugins-8.0.28-1.el7.x86_64.rpm   #安装 client              
[root@hadoopmaster tools]# rpm -ivh mysql-community-libs-8.0.28-1.el7.x86_64.rpm             #安装 libs
warning: mysql-community-libs-8.0.28-1.el7.x86_64.rpm: Header V4 RSA/SHA256 Signature, key ID 3a79bd29: NOKEY
error: Failed dependencies:
        mariadb-libs is obsoleted by mysql-community-libs-8.0.28-1.el7.x86_64                 #提示已经过时
[root@hadoopmaster tools]# yum -y remove mariadb-libs                                         #卸载
[root@hadoopmaster tools]# rpm -ivh mysql-community-libs-8.0.28-1.el7.x86_64.rpm              #重新安装libs
[root@hadoopmaster tools]# rpm -ivh mysql-community-client-8.0.28-1.el7.x86_64.rpm            #安装client 
[root@hadoopmaster tools]# rpm -ivh  mysql-community-icu-data-files-8.0.28-1.el7.x86_64.rpm   #安装 icu-data-files
[root@hadoopmaster tools]# rpm -ivh mysql-community-server-8.0.28-1.el7.x86_64.rpm                 #安装 server
warning: mysql-community-server-8.0.28-1.el7.x86_64.rpm: Header V4 RSA/SHA256 Signature, key ID 3a79bd29: NOKEY
error: Failed dependencies:
        libaio.so.1()(64bit) is needed by mysql-community-server-8.0.28-1.el7.x86_64               #提示缺少依赖    
        libaio.so.1(LIBAIO_0.1)(64bit) is needed by mysql-community-server-8.0.28-1.el7.x86_64     #提示缺少依赖  
        libaio.so.1(LIBAIO_0.4)(64bit) is needed by mysql-community-server-8.0.28-1.el7.x86_64     #提示缺少依赖  
[root@hadoopmaster tools]# wget http://mirror.centos.org/centos/7/os/x86_64/Packages/libaio-0.3.109-13.el7.x86_64.rpm  #下载依赖
[root@hadoopmaster tools]# rpm -ivh libaio-0.3.109-13.el7.x86_64.rpm                       #安装依赖
[root@hadoopmaster tools]# rpm -ivh mysql-community-server-8.0.28-1.el7.x86_64.rpm         #重新安装 server
[root@hadoopmaster tools]# rpm -qa | grep mysql                           #确认mysql 的安装包
mysql-community-common-8.0.28-1.el7.x86_64
mysql-community-icu-data-files-8.0.28-1.el7.x86_64
mysql-community-client-plugins-8.0.28-1.el7.x86_64
mysql-community-client-8.0.28-1.el7.x86_64
mysql-community-libs-8.0.28-1.el7.x86_64
mysql-community-server-8.0.28-1.el7.x86_64
[root@hadoopmaster tools]#
   
#完成对mysql数据库的初始化和开机配置：
[mysql@hadoopmaster ~]$ sudo mysqld --initialize;                        #初始化数据库
[sudo] password for mysql: 
[mysql@hadoopmaster ~]$ sudo chown mysql:mysql /var/lib/mysql -R;        #授权 
[mysql@hadoopmaster ~]$ sudo systemctl start mysqld.service;             #启动mysql数据库
[mysql@hadoopmaster ~]$ sudo systemctl enable mysqld;                    #来设置 mysql开机启动自动        
```

5、配置mysql数据库

```shell

[mysql@hadoopmaster ~]$ sudo cat /var/log/mysqld.log | grep password      #查看数据库的密码
2022-09-14T09:46:17.369421Z 6 [Note] [MY-010454] [Server] A temporary password is generated for root@localhost: Qj&VfWfH1.Zf
[mysql@hadoopmaster ~]$ sudo mysql -u root -p                             #登陆数据库，密码为 Qj&VfWfH1.Zf
Enter password: 
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 8
Server version: 8.0.28

Copyright (c) 2000, 2022, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'qaz123689';  #修改数据库密码
Query OK, 0 rows affected (0.01 sec)

mysql> create user 'root'@'%' identified with mysql_native_password by 'qaz123689';         #创建root用户并进行远程访问授权
Query OK, 0 rows affected (0.00 sec)

mysql> grant all privileges on *.* to 'root'@'%' with grant option;                         #创建root用户并进行远程访问授权
Query OK, 0 rows affected (0.00 sec)

mysql> flush privileges;                                                                    #刷新
Query OK, 0 rows affected (0.00 sec)

mysql> show variables like 'log_bin' ;                                                      #查看是否开启binlog功能
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| log_bin       | ON    |
+---------------+-------+
1 row in set (0.00 sec)

mysql> show master logs;                                                                    #查看是否开启binlog功能
+---------------+-----------+-----------+
| Log_name      | File_size | Encrypted |
+---------------+-----------+-----------+
| binlog.000001 |      1132 | No        |
+---------------+-----------+-----------+
1 row in set (0.00 sec)
mysql> create database hive;                                                                #创建hives数据库
mysql> create user 'hive'@'%' identified with mysql_native_password by 'qaz123689';         #创建hive用户并授权远程访问：
Query OK, 0 rows affected (0.01 sec)

mysql> grant all privileges on *.* to 'hive'@'%' with grant option;                         #创建hive用户并授权远程访问：
Query OK, 0 rows affected (0.01 sec)

mysql> flush privileges;                                                                    #刷新
Query OK, 0 rows affected (0.01 sec)

mysql> exit
Bye
 
[mysql@hadoopmaster ~]$ sudo firewall-cmd --zone=public --add-port 3306/tcp --permanent     #开放mysql数据库端口
[mysql@hadoopmaster ~]$ sudo firewall-cmd --reload                                          #刷新防火墙

```

6、以root用户安装hive

1)、打开hive官网的下载目录https://dlcdn.apache.org/hive/ ，选择最新版本并下载到服务器

[apache-hive-3.1.3-bin.tar.gz](https://dlcdn.apache.org/hive/hive-3.1.3/apache-hive-3.1.3-bin.tar.gz)

2)、解压

```shell
[root@hadoopmaster tools]# tar -zxvf apache-hive-3.1.3-bin.tar.gz
[root@hadoopmaster tools]# mv apache-hive-3.1.3-bin   hive-3.1.3    
```

3)、创建hive的临时目录

```shell
[root@hadoopmaster tools]# mkdir -p /root/hiveTemp/operation_logs
[root@hadoopmaster tools]# mkdir -p /root/hiveTemp/download
```

4)、配置hive的环境变量

```shell
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

```shell
[root@hadoopmaster lib]# pwd
/root/tools/hive-3.1.3/lib
[root@hadoopmaster lib]# ls -alt |grep mysql
-rw-rw-r--.  1 hadoop hadoop  2476480 Sep  3 16:04 mysql-connector-java-8.0.28.jar
-rw-r--r--.  1 hadoop hadoop    10476 Dec 20  2019 mysql-metadata-storage-0.12.0.jar
[root@hadoopmaster lib]# 
```

6)、将hive-on-spark依赖的spark包上传到hive的lib包

```shell
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

7)、配置hive-env.sh，在文件后面增加如下配置

```shell
[root@hadoopmaster conf]# cp hive-env.sh.template hive-env.sh
[root@hadoopmaster conf]# cp hive-env.sh hive-env.sh_20220914bak
[root@hadoopmaster conf]# vi hive-env.sh

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

```shell
[root@hadoopmaster conf]# cp hive-default.xml.template hive-site.xml
[root@hadoopmaster conf]# cp hive-site.xml hive-site.xml_20220914bak
[root@hadoopmaster conf]# vi hive-site.xml

在hive-site.xml的后面增加如下配置
  <property>
   <name>spark.master</name>
   <value>spark://172.17.49.195:7077</value>
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
	<value>hdfs://172.17.49.195:9000/spark-logs</value>
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
    <value>hdfs://172.17.49.195:9000/spark2-jars/*</value>
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
  
 在hive-site.xml中修改如下配置
  <property>
    <name>hive.exec.scratchdir</name>
    <value>/tmp/hive</value>                        ->    <value>hdfs://172.17.49.195:9000/data/hive/tmp</value>
  </property>
  
  <property>
    <name>hive.exec.local.scratchdir</name>
    <value>${system:java.io.tmpdir}/${system:user.name}</value>                 -><value>/root/hiveTemp</value>
  </property>
  
  <property>
    <name>hive.downloaded.resources.dir</name>
    <value>${system:java.io.tmpdir}/${hive.session.id}_resources</value>        -> <value>/root/hiveTemp/download</value>
  </property>
  
  
  <property>
    <name>hive.metastore.warehouse.dir</name>
    <value>/user/hive/warehouse</value>                      -> <value>hdfs://172.17.49.195:9000/data/hive/warehouse</value>   
  </property>
  
    <property>
    <name>javax.jdo.option.ConnectionPassword</name>  
    <value>mine</value>                                     -> <value>qaz123689</value>
  </property>
  
  
  <property>
    <name>javax.jdo.option.ConnectionURL</name>
    <value>jdbc:derby:;databaseName=metastore_db;create=true</value>  -> <value>jdbc:mysql://172.17.49.195:3306/hive</value>  
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
    <value>${system:java.io.tmpdir}/${system:user.name}</value>   ->  <value>hdfs://172.17.49.195:9000/data/hive/log</value>
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

```shell
[root@hadoopmaster tools]# hadoop fs -mkdir /data
hadoop fs -mkdir /data/hive
hadoop fs -mkdir /data/hive/warehouse
hadoop fs -mkdir /data/hive/tmp
hadoop fs -mkdir /data/hive/log
hadoop fs -mkdir /spark-logs[root@hadoopmaster tools]# hadoop fs -mkdir /data/hive
[root@hadoopmaster tools]# hadoop fs -mkdir /data/hive/warehouse
[root@hadoopmaster tools]# hadoop fs -mkdir /data/hive/tmp
[root@hadoopmaster tools]# hadoop fs -mkdir /data/hive/log
[root@hadoopmaster tools]# hadoop fs -mkdir /spark-logs
[root@hadoopmaster tools]# hadoop fs -mkdir /spark2-history
[root@hadoopmaster tools]# hadoop fs -chmod -R 777 /

```

10)、创建spark-defaults.conf

```shell
[root@hadoopmaster conf]# touch spark-defaults.conf
[root@hadoopmaster conf]# vi spark-defaults.conf
spark.master              yarn
# 启用日志聚合
spark.eventLog.enabled    true
# 保存日志的HDFS 路径
spark.eventLog.dir        hdfs://172.17.49.195:9000/spark2-history
spark.executor.memory     1g
spark.driver.memory       1g

```



11)、初始化hive元数据库

```shell
[root@hadoopmaster bin]# cd /root/tools/hive-3.1.3/bin
[root@hadoopmaster bin]# schematool -dbType mysql -initSchema
Initialization script completed
schemaTool completed
[root@hadoopmaster bin]# 


#修改hive元数据的注释字符集为UTF8
[mysql@hadoopmaster ~]$  mysql -u root -p 
Enter password: 
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 12371
Server version: 8.0.28 MySQL Community Server - GPL

Copyright (c) 2000, 2022, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| hive               |
| information_schema |
| mysql              |
| performance_schema |
| sys                |
| test               |
+--------------------+
6 rows in set (0.00 sec)

mysql> use hive;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed

mysql>  alter table COLUMNS_V2 modify column COMMENT varchar(256) character set utf8;              --修改为utf8字符集
Query OK, 4553 rows affected, 1 warning (0.09 sec)
Records: 4553  Duplicates: 0  Warnings: 1

mysql> alter table TABLE_PARAMS modify column PARAM_VALUE mediumtext character set utf8;           --修改为utf8字符集
Query OK, 125 rows affected, 1 warning (0.05 sec)
Records: 125  Duplicates: 0  Warnings: 1

mysql>  alter table PARTITION_PARAMS modify column PARAM_VALUE varchar(4000) character set utf8;   --修改为utf8字符集
Query OK, 3 rows affected, 1 warning (0.05 sec)
Records: 3  Duplicates: 0  Warnings: 1

mysql> alter table PARTITION_KEYS modify column PKEY_COMMENT varchar(4000) character set utf8;     --修改为utf8字符集
Query OK, 20 rows affected, 1 warning (0.05 sec)
Records: 20  Duplicates: 0  Warnings: 1

mysql> 
    
```

12)、启动hive数据库

```shell
[root@hadoopmaster bin]# hive
Hive-on-MR is deprecated in Hive 2 and may not be available in the future versions. Consider using a different execution engine (i.e. spark, tez) or using Hive 1.X releases.
Hive Session ID = 10d4eef5-6774-4e05-b627-2d65c7e17921
hive> show databases;
OK
default
Time taken: 0.536 seconds, Fetched: 1 row(s)
hive> 
```

7、验证spark引擎

```shell
[root@hadoopmaster tools]# cd spark-2.4.8-pure       #进入spark目录
[root@hadoopmaster spark-2.4.8-pure]# cd sbin        #进入sbin目录
[root@hadoopmaster sbin]# ./start-all.sh             #启动spark
starting org.apache.spark.deploy.master.Master, logging to /root/tools/spark-2.4.8-pure/logs/spark-root-org.apache.spark.deploy.master.Master-1-hadoopmaster.out
localhost: WARNING: log4j.properties is not found. HADOOP_CONF_DIR may be incomplete.
localhost: starting org.apache.spark.deploy.worker.Worker, logging to /root/tools/spark-2.4.8-pure/logs/spark-root-org.apache.spark.deploy.worker.Worker-1-hadoopmaster.out
[root@hadoopmaster sbin]# hive                       #进入hive数据库
hive> set hive.execution.engine=spark;               #设置spark引擎
hive> insert into student values (3, "wangwu",18);   #插入数据
Query ID = root_20220915145802_ca8da3e3-4810-48bd-8c9c-c331d825cbd6
Total jobs = 1
Launching Job 1 out of 1
In order to change the average load for a reducer (in bytes):
  set hive.exec.reducers.bytes.per.reducer=<number>
In order to limit the maximum number of reducers:
  set hive.exec.reducers.max=<number>
In order to set a constant number of reducers:
  set mapreduce.job.reduces=<number>
Hive on Spark Session Web UI URL: http://hadoopmaster:4040  #进入Hive on Spark 会话

Query Hive on Spark job[1] stages: [2, 3]
Spark job[1] status = RUNNING
--------------------------------------------------------------------------------------
          STAGES   ATTEMPT        STATUS  TOTAL  COMPLETED  RUNNING  PENDING  FAILED  
--------------------------------------------------------------------------------------
Stage-2 ........         0      FINISHED      1          1        0        0       0  
Stage-3 ........         0      FINISHED      1          1        0        0       0  
--------------------------------------------------------------------------------------
STAGES: 02/02    [==========================>>] 100%  ELAPSED TIME: 3.02 s     
--------------------------------------------------------------------------------------
Spark job[1] finished successfully in 3.02 second(s)
Loading data to table test.student
[Error 30017]: Skipping stats aggregation by error org.apache.hadoop.hive.ql.metadata.HiveException: [Error 30000]: StatsPublisher cannot be obtained. There was a error to retrieve the StatsPublisher, and retrying might help. If you dont want the query to fail because accurate statistics could not be collected, set hive.stats.reliable=false
OK
Time taken: 3.897 seconds
hive> insert into student values (4, "zhaoliu",19);
Query ID = root_20220915145807_42a89c72-579c-4781-b6e1-f255040d5871
Total jobs = 1
Launching Job 1 out of 1
In order to change the average load for a reducer (in bytes):
  set hive.exec.reducers.bytes.per.reducer=<number>
In order to limit the maximum number of reducers:
  set hive.exec.reducers.max=<number>
In order to set a constant number of reducers:
  set mapreduce.job.reduces=<number>
--------------------------------------------------------------------------------------
          STAGES   ATTEMPT        STATUS  TOTAL  COMPLETED  RUNNING  PENDING  FAILED  
--------------------------------------------------------------------------------------
Stage-4 ........         0      FINISHED      1          1        0        0       0  
Stage-5 ........         0      FINISHED      1          1        0        0       0  
--------------------------------------------------------------------------------------
STAGES: 02/02    [==========================>>] 100%  ELAPSED TIME: 2.00 s     
--------------------------------------------------------------------------------------
Spark job[2] finished successfully in 2.00 second(s)
Loading data to table test.student
[Error 30017]: Skipping stats aggregation by error org.apache.hadoop.hive.ql.metadata.HiveException: [Error 30000]: StatsPublisher cannot be obtained. There was a error to retrieve the StatsPublisher, and retrying might help. If you dont want the query to fail because accurate statistics could not be collected, set hive.stats.reliable=false
OK
Time taken: 2.863 seconds
hive> select * rff;
FAILED: ParseException line 1:9 extraneous input 'ff' expecting EOF near '<EOF>'
hive> select * From student ;
OK
1       zhangsan        18
2       lis     19
5       zhaoliu 20
3       wangwu  18
4       zhaoliu 19
Time taken: 0.1 seconds, Fetched: 5 row(s)
hive> 

```

8、启停hive服务

```shell
启动元数据服务 
nohup hive --service metastore &         ##元数据服务       netstat -anlp |grep 9083   重启前可杀掉进程再启动
 
启动hiveserver2服务 
nohup hive --service hiveserver2 &       ##支持jdbc查询服务 netstat -anlp |grep 10000   重启前可杀掉进程再启动
```

9、切换hive执行引擎

```shell
set hive.execution.engine;           #查看当前引擎
set hive.execution.engine=spark;     #设置spark引擎
set hive.execution.engine=mr;        #设置mr引擎
```

