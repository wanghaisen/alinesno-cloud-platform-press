# sqoop 安装

## 本内容你将获得

- centos7 上安装 sqoop
- 从hive中导出数据到mysql
- 将mysql表数据导入hive表

## 软件安装

##### 说明

- sqoop依赖Java、hadoop环境

<br/>

### 安装开始

##### 网上下载sqoop-1.4.7.bin__hadoop-2.6.0.tar.gz、sqoop-1.4.7.tar.gz,上传到服务器/root/tools目录

解压安装包

```bash
cd /root/tools
tar -zxvf sqoop-1.4.7.bin__hadoop-2.6.0.tar.gz
tar -zxvf sqoop-1.4.7.tar.gz
```

##### 复制sqoop-1.4.7.bin__hadoop-2.6.0中的jar文件到sqoop-1.4.7目录

```bash
cd /root/tools/sqoop-1.4.7
cp /root/tools/sqoop-1.4.7.bin__hadoop-2.6.0/sqoop-1.4.7.jar /root/tools/sqoop-1.4.7
cp /root/tools/sqoop-1.4.7.bin__hadoop-2.6.0/lib/avro-1.8.1.jar /root/tools/sqoop-1.4.7/lib
cp /root/tools/sqoop-1.4.7.bin__hadoop-2.6.0/lib/ant-eclipse-1.0-jvm1.2.jar /root/tools/sqoop-1.4.7/lib
cp /root/tools/sqoop-1.4.7.bin__hadoop-2.6.0/lib/ant-contrib-1.0b3.jar /root/tools/sqoop-1.4.7/lib
```

##### 上传数据库连接包到sqoop-1.4.7目录

```bash
#网上下载mysql-connector-java-8.0.28.jar文件，上传到服务器/root/tools目录
cp /root/tools/mysql-connector-java-8.0.28.jar /root/tools/sqoop-1.4.7/lib
```

##### 配置sqoop-env.sh

```bash
cd /root/tools/sqoop-1.4.7/conf
cp sqoop-env-template.sh sqoop-env.sh
vi sqoop-env.sh
#在文件后面加入如下配置
export HADOOP_COMMON_HOME=/root/tools/hadoop-3.3.4
export HADOOP_MAPRED_HOME=/root/tools/hadoop-3.3.4
export HIVE_HOME=/root/tools/hive-3.1.3
export HIVE_CONF_DIR=/root/tools/hive-3.1.3/conf
export HADOOP_CLASSPATH=`$HADOOP_HOME/bin/hadoop classpath`
export HADOOP_CLASSPATH=$HADOOP_CLASSPATH:$HIVE_HOME/lib/*
```

##### 配置环境变量

```shell
[root@hadoopmaster conf]# vi /etc/profile
#sqoop
export SQOOP_HOME=/root/tools/sqoop-1.4.7
export PATH=$PATH:$SQOOP_HOME/bin
```

保存后，source /etc/profile 使配置生效

### 从hive中导出数据到mysql

##### 在mysql中创建test数据库、tb_area表

```mysql
create database test;
CREATE TABLE tb_area(
  id bigint, 
  area_code varchar(200)
);
```

##### 在hive中创建tb_area表并导入数据

```mysql
CREATE TABLE test.tb_area(
  id bigint, 
  area_code string)
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

load data local inpath'/root/data/tb_area.csv' overwrite into table test.tb_area;

```

##### 创建从hive导出数据到mysql的sh脚本并执行

```bash
touch export_149.sh
vi export_149.sh
#!/bin/bash
#连接MySQL数据库
Host=192.168.17.149
User=root
PW='qscgy13578&@'

#远程连接  #指定Host，其他不变
mysql -h$Host --port=3306 -u$User -p$PW <<EOF
#show databases;
use test;
delete from tb_area          ;
COMMIT;
EOF

sqoop export \
--connect jdbc:mysql://192.168.17.149:3306/test \
--username root \
--password 'qscgy13578&@' \
--table tb_area \
--columns id,area_code \
--m 1 \
--export-dir hdfs://192.168.17.149:9000/data/hive/warehouse/test.db/tb_area \
--input-fields-terminated-by '|' \
--input-null-string "\\\N"  \
--input-null-non-string "\\\N" \
;

sh export_149.sh   #执行导出任务
```

##### 查看mysql 数据库中是否已有数据

```mysql
select * from tb_area limit 1 ;
```

### 将mysql表数据导入hive表

##### 创建hive表

```shell
create table tb_area_new(
   id bigint, 
   area_code string
  )
 ROW FORMAT SERDE 
   'org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe' 
 WITH SERDEPROPERTIES ( 
   'field.delim'='|', 
   'serialization.format'='|', 
   'serialization.null.format'='') 
 STORED AS INPUTFORMAT 
   'org.apache.hadoop.mapred.TextInputFormat' 
 OUTPUTFORMAT 
   'org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat'
 ;
```

##### 创建导入脚本

```shell
touch import_1.sh
vi import_149.sh
sqoop import \
--connect jdbc:mysql://192.168.17.149:3306/test \
--username root \
--password 'wdwvy6' \
--hive-import \
--hive-table test.tb_area_new \
--as-textfile \
--fields-terminated-by '|' \
--target-dir 'hdfs://192.168.17.149:9000/data/hive/warehouse/test.db/tb_area_new' \
--delete-target-dir \
--null-string '\\N' \
--null-non-string '\\N' \
--query 'select * from tb_area where $CONDITIONS' \
--split-by id \
-m 2
```

##### 执行导入脚本

```shell
sh import_149.sh   #执行导入脚本
```

##### 查看mysql 数据库中是否已有数据

```shell
hive   #进入hive数据库
select * from  tb_area_new limit 10 ;   #查看导入结果
```

## 其他

- 无