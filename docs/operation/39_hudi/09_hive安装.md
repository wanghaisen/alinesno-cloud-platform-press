

# hive安装

## 本内容你将获得

- 部署hive元数据库
- 部署hive
- 启动hive数据库
- 使用spark引擎
- 启停hive服务

## 软件安装

#### 说明

- hive依赖Java、hadoop环境
- hive元数据库用MySQL数据库
- hive使用spark引擎，依赖spark环境



### 部署hive元数据库

##### 在服务器上新建mysql用户、用户组、设置密码、创建相关目录

```shell
groupadd mysql
useradd -g mysql -s /bin/bash mysql
passwd mysql
su - mysql
mkdir data
mkdir mariadb 
```

<br/>

##### 修改my.cnf配置

```shell
cd /etc
vi my.cnf

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

symbolic-links=0

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

```

<br/>

#####  上传mysql-8.0.28-1.el7.x86_64.rpm-bundle.tar到服务器/root/tools目录

 解压安装包

```shell
tar -xvf mysql-8.0.28-1.el7.x86_64.rpm-bundle.tar
```

<br/>

##### 安装mysql

```shell
rpm -qa | grep -i mysql                                                #检查是否已安装过mysql,如有则先卸载并清除相关文件
su - mysql                                                             #切换到mysql用户，以mysql用户部署hive元数据库
sudo rpm -ivh mysql-community-common-8.0.28-1.el7.x86_64.rpm           #安装common
sudo rpm -ivh mysql-community-client-plugins-8.0.28-1.el7.x86_64.rpm   #安装 client   
sudo rpm -ivh mysql-community-libs-8.0.28-1.el7.x86_64.rpm             #安装 libs
sudo rpm -ivh mysql-community-libs-8.0.28-1.el7.x86_64.rpm             #重新安装libs
sudo rpm -ivh mysql-community-client-8.0.28-1.el7.x86_64.rpm           #安装client 
sudo rpm -ivh  mysql-community-icu-data-files-8.0.28-1.el7.x86_64.rpm  #安装 icu-data-files
sudo rpm -ivh mysql-community-server-8.0.28-1.el7.x86_64.rpm           #安装 server
sudo rpm -ivh mysql-community-server-8.0.28-1.el7.x86_64.rpm           #重新安装 server
sudo rpm -qa | grep mysql                                              #确认mysql 的安装包
sudo mysqld --initialize;                                              #初始化数据库
sudo chown mysql:mysql /var/lib/mysql -R;                              #授权 
sudo systemctl start mysqld.service;                                   #启动mysql数据库
sudo systemctl enable mysqld;                                          #来设置 mysql开机启动自动       
```

<br/>

##### 配置mysql

```shell
su - mysql
sudo cat /var/log/mysqld.log | grep password      #查看数据库的密码
sudo mysql -u root -p                             #登陆数据库
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'qsdb%67$0l8';   #修改数据库密码
create user 'root'@'%' identified with mysql_native_password by 'qsdb%67$0l8';          #创建root用户
grant all privileges on *.* to 'root'@'%' with grant option;                          #远程访问授权
flush privileges;                                                                     #刷新
show variables like 'log_bin' ;                                                       #查看是否开启binlog功能
show master logs;                                                                     #查看binlog日志
create database hive;                                                                 #创建hives数据库
grant all privileges on *.* to 'hive'@'%' with grant option;                          #授权远程访问：
flush privileges;                                                                     #刷新
```

### 部署hive

以root用户安装hive

##### 上传apache-hive-3.1.3-bin.tar.gz到服务器/root/tools目录

 解压安装包

```shell
cd /root/tools
tar -zxvf apache-hive-3.1.3-bin.tar.gz
mv apache-hive-3.1.3-bin   hive-3.1.3   
```

<br/>

##### 创建hive的临时目录

```shell
mkdir -p /root/hiveTemp/operation_logs
mkdir -p /root/hiveTemp/download
```

<br/>

##### 配置hive的环境变量

```shell
vi /etc/profile
#hive
export HIVE_HOME=/root/tools/hive-3.1.3
export HIVE_CONF_DIR=$HIVE_HOME/conf 
export PATH=$PATH:$HIVE_HOME/sbin:$HIVE_HOME/bin
```

保存后，source /etc/profile 使配置生效

<br/>

##### 上传mysql数据库java连接包

网上下载mysql-connector-java-8.0.28.jar,上传到hive的lib目录

<br/>

##### 复制如下spark的jar文件到hive的lib目录

```shell
cd /root/tools/spark-2.4.8-pure/jars
cp scala-compiler-2.12.10.jar /root/tools/hive-3.1.3/lib
cp scala-library-2.12.10.jar /root/tools/hive-3.1.3/lib
cp scala-reflect-2.12.10.jar /root/tools/hive-3.1.3/lib
cp spark-core_2.12-2.4.8.jar /root/tools/hive-3.1.3/lib
cp spark-network-common_2.12-2.4.8.jar /root/tools/hive-3.1.3/lib
cp spark-unsafe_2.12-2.4.8.jar /root/tools/hive-3.1.3/lib
cp spark-yarn_2.12-2.4.8.jar /root/tools/hive-3.1.3/lib
```

<br/>

##### 上传hive的orc-core-1.5.8.jar到hdfs文件系统

```
cd /root/tools/hive-3.1.3/lib
hdfs dfs -put orc-core-1.5.8.jar /spark2-jars
```

<br/>

##### 配置hive-env.sh，在文件后面增加配置

```shell
cd /root/tools/hive-3.1.3/conf
vi hive-env.sh

#hadoop_home路径
HADOOP_HOME=/root/tools/hadoop-3.3.4

#hive配置文件存放路径
export HIVE_CONF_DIR=/root/tools/hive-3.1.3/conf

#hive相关jar存放路径
export HIVE_AUX_JARS_PATH=/root/tools/hive-3.1.3/lib

# 新增SPARK_HOME 必须是without-hadoop 的纯净版
export SPARK_HOME=/root/tools/spark-2.4.8-pure

```

<br/>

##### 配置hive-site.xml 

增加配置

```shell
cd /root/tools/hive-3.1.3/conf
vi hive-site.xml
#在hive-site.xml的后面增加如下配置
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
  
```

修改配置

```shell
#在hive-site.xml中修改配置
 
  <property>
    <name>hive.exec.scratchdir</name>
    <value>hdfs://192.168.17.149:9000/data/hive/tmp</value>           #旧： <value>/tmp/hive</value>     
  </property>
 
  <property>
    <name>hive.exec.local.scratchdir</name>
    <value>/root/hiveTemp</value>                                    #旧： ${system:java.io.tmpdir}/${system:user.name}
  </property>
 
  <property>
    <name>hive.downloaded.resources.dir</name>
    <value>/root/hiveTemp/download</value>                           #旧：${system:java.io.tmpdir}/${hive.session.id}_resources
  </property>

  <property>
    <name>hive.metastore.warehouse.dir</name>
    <value>hdfs://192.168.17.149:9000/data/hive/warehouse</value>     #旧：/user/hive/warehouse           
  </property>
   
  <property>
    <name>javax.jdo.option.ConnectionPassword</name>                 #旧： mine
    <value>qsdb%67$0l8</value>                              
  </property>
  
  <property>
    <name>javax.jdo.option.ConnectionURL</name>
    <value>jdbc:mysql://192.168.17.149:3306/hive</value>               #旧：jdbc:derby:;databaseName=metastore_db;create=true 
  </property>

  <property>
    <name>hive.metastore.event.db.notification.api.auth</name>
    <value>false</value>                                              #旧：true           
  </property>

  <property>
    <name>javax.jdo.option.ConnectionDriverName</name>
    <value>com.mysql.jdbc.Driver</value>                              #旧：org.apache.derby.jdbc.EmbeddedDriver  
  </property>
 
  <property>
    <name>javax.jdo.option.ConnectionUserName</name>
    <value>hive</value>                                               #旧：APP                 
  </property>
 
  <property>
    <name>hive.querylog.location</name>
    <value>hdfs://192.168.17.149:9000/data/hive/log</value>            #旧：${system:java.io.tmpdir}/${system:user.name}  
  </property>
 
  <property>
    <name>hive.stats.dbclass</name>
    <value>jdbc:msyql</value>                                         #旧：fs                         
  </property>
 
  <property>
    <name>hive.server2.active.passive.ha.enable</name>
     <value>true</value>                                              #旧： false                        
  </property>
  
  <property>
    <name>hive.server2.logging.operation.log.location</name>
    <value>/root/hiveTemp/operation_logs</value>            #旧：${system:java.io.tmpdir}/${system:user.name}/operation_logs  
  </property>
 
  #由于xml中的&需要转义，将hive-site.xml出现的&修改成&amp;
```

<br/>

##### 创建hive-site.xml 中需要的hdfs目录

```shell
hadoop fs -mkdir /data
hadoop fs -mkdir /data/hive
hadoop fs -mkdir /data/hive/warehouse
hadoop fs -mkdir /data/hive/tmp
hadoop fs -mkdir /data/hive/log
hadoop fs -mkdir /spark-logs
hadoop fs -mkdir /spark2-history
hadoop fs -chmod -R 777 /
```

<br/>

##### 创建spark-defaults.conf

```shell
cd /root/tools/hive-3.1.3/conf
touch spark-defaults.conf
vi spark-defaults.conf

spark.master              yarn
# 启用日志聚合
spark.eventLog.enabled    true
# 保存日志的HDFS 路径
spark.eventLog.dir        hdfs://192.168.17.149:9000/spark2-history
spark.executor.memory     1g
spark.driver.memory       1g

```

<br/>

##### 初始化hive元数据库

```shell
cd /root/tools/hive-3.1.3/bin
schematool -dbType mysql -initSchema
```

<br/>

##### 修改hive元数据库的注释字符集为UTF8

```mysql
mysql -u root -p 
use hive;
alter table COLUMNS_V2 modify column COMMENT varchar(256) character set utf8;             #修改为utf8字符集
alter table TABLE_PARAMS modify column PARAM_VALUE mediumtext character set utf8;         #修改为utf8字符集
alter table PARTITION_PARAMS modify column PARAM_VALUE varchar(4000) character set utf8;  #修改为utf8字符集
alter table PARTITION_KEYS modify column PKEY_COMMENT varchar(4000) character set utf8;   #修改为utf8字符集
```

<br/>

### 启动hive数据库

```shell
hive
show databases;
set hive.execution.engine;           #查看当前引擎
set hive.execution.engine=spark;     #切换执行引擎，设置spark引擎
set hive.execution.engine=mr;        #切换执行引擎，设置mr引擎
```

<br/>

### 使用spark引擎

```shell
cd spark-2.4.8-pure                            #进入spark目录
cd sbin                                        #进入sbin目录
 ./start-all.sh                                #启动spark
hive                                           #进入hive数据库
create table student(                          #创建表
  id bigint, 
  name string,
  age  int )
ROW FORMAT SERDE 
  'org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe' 
WITH SERDEPROPERTIES ( 
  'field.delim'='|', 
  'serialization.format'='|') 
STORED AS INPUTFORMAT 
  'org.apache.hadoop.mapred.TextInputFormat' 
OUTPUTFORMAT 
  'org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat'
;
set hive.execution.engine=spark;               #设置spark引擎
insert into student values (3, "wangwu",18);   #插入数据,执行过程中会出现Hive on Spark 日志
```

<br/>

### 启停hive服务

```shell
#启动元数据服务 
nohup hive --service metastore &         ##元数据服务       netstat -anlp |grep 9083   重启前杀掉进程再启动
 
#启动hiveserver2服务 
nohup hive --service hiveserver2 &       ##用于jdbc查询服务 netstat -anlp |grep 10000   重启前杀掉进程再启动
```

<br/>

## 其他

- 无
