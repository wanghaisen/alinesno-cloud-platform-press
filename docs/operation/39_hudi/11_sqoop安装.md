# sqoop 安装

## 本内容你将获得

- 如何在 centos7 服务器上安装 sqoop
- 验证从hive中导出数据到mysql
- 验证将mysql表数据导入hive表

## sqoop 安装

登录官网下载地址http://archive.apache.org/dist/sqoop/1.4.7/

下载[sqoop-1.4.7.bin__hadoop-2.6.0.tar.gz ](http://archive.apache.org/dist/sqoop/1.4.7/sqoop-1.4.7.bin__hadoop-2.6.0.tar.gz)  、 [sqoop-1.4.7.tar.gz](http://archive.apache.org/dist/sqoop/1.4.7/sqoop-1.4.7.tar.gz)    并上传至 Linux 服务器/root/tools 目录。

1、解压

```bash
[root@hadoopmaster tools]# ls -alt
total 100076
drwxr-xr-x  10 root  root       4096 Sep 16 16:35 .
dr-xr-x---. 12 root  root       4096 Sep 16 14:48 ..
-rw-r--r--   1 root  root  102436055 Sep 16 16:32 sqoop-1.4.7.tar.gz
-rw-r--r--   1 root  root  102436055 Sep 16 16:32 sqoop-1.99.7-bin-hadoop200.tar.gz
[root@hadoopmaster tools]# tar -zxvf sqoop-1.4.7.bin__hadoop-2.6.0.tar.gz
[root@hadoopmaster tools]# tar -zxvf sqoop-1.4.7.tar.gz
```

2、将sqoop-1.4.7.bin__hadoop-2.6.0中的jar包复制到sqoop-1.4.7目录

```bash
[root@hadoopmaster tools]#cp /root/tools/sqoop-1.4.7.bin__hadoop-2.6.0/sqoop-1.4.7.jar /root/tools/sqoop-1.4.7
[root@hadoopmaster tools]#cp /root/tools/sqoop-1.4.7.bin__hadoop-2.6.0/lib/avro-1.8.1.jar /root/tools/sqoop-1.4.7/lib
[root@hadoopmaster tools]#cp /root/tools/sqoop-1.4.7.bin__hadoop-2.6.0/lib/ant-eclipse-1.0-jvm1.2.jar /root/tools/sqoop-1.4.7/lib
[root@hadoopmaster tools]#cp /root/tools/sqoop-1.4.7.bin__hadoop-2.6.0/lib/ant-contrib-1.0b3.jar /root/tools/sqoop-1.4.7/lib

[root@hadoopmaster tools]#cp /root/tools/bak/mysql-connector-java-8.0.28.jar /root/tools/sqoop-1.4.7/lib
[root@hadoopmaster tools]#cd /root/sqoop/sqoop-1.4.7/lib
[root@hadoopmaster lib]# ls -alt
total 4000
drwxr-xr-x 2 mysql mysql    4096 Sep 16 21:18 .
drwxr-xr-x 8 mysql mysql    4096 Sep 16 21:14 ..
-rw-r--r-- 1 root  root  1344870 Sep 16 21:17 avro-1.8.1.jar
-rw-rw-r-- 1 mysql mysql   36455 Sep 16 21:16 ant-eclipse-1.0-jvm1.2.jar
-rw-rw-r-- 1 mysql mysql  224277 Sep 16 21:16 ant-contrib-1.0b3.jar
-rw-r--r-- 1 root  root  2476480 Sep 16 21:18 mysql-connector-java-8.0.28.jar

```

3、配置sqoop-env.sh

```bash
在文件后面加入如下配置
export HADOOP_COMMON_HOME=/root/tools/hadoop-3.3.4
export HADOOP_MAPRED_HOME=/root/tools/hadoop-3.3.4
export HIVE_HOME=/root/tools/hive-3.1.3
export HIVE_CONF_DIR=/root/tools/hive-3.1.3/conf
export HADOOP_CLASSPATH=`$HADOOP_HOME/bin/hadoop classpath`
export HADOOP_CLASSPATH=$HADOOP_CLASSPATH:$HIVE_HOME/lib/*


[root@hadoopmaster sqoop-1.4.7]# cd conf
[root@hadoopmaster conf]# ls -alt
total 28
drwxr-xr-x 8 mysql mysql 4096 Sep 16 21:14 ..
drwxr-xr-x 2 mysql mysql 4096 Dec 19  2017 .
-rw-rw-r-- 1 mysql mysql 3895 Dec 19  2017 oraoop-site-template.xml
-rw-rw-r-- 1 mysql mysql 1404 Dec 19  2017 sqoop-env-template.cmd
-rwxr-xr-x 1 mysql mysql 1345 Dec 19  2017 sqoop-env-template.sh
-rw-rw-r-- 1 mysql mysql 6044 Dec 19  2017 sqoop-site-template.xml
[root@hadoopmaster conf]# cp sqoop-env-template.sh sqoop-env.sh
[root@hadoopmaster conf]# cp sqoop-env.sh sqoop-env.sh_20220916bak
[root@hadoopmaster conf]# vi sqoop-env.sh
export HADOOP_COMMON_HOME=/root/tools/hadoop-3.3.4
export HADOOP_MAPRED_HOME=/root/tools/hadoop-3.3.4
export HIVE_HOME=/root/tools/hive-3.1.3
export HIVE_CONF_DIR=/root/tools/hive-3.1.3/conf
export HADOOP_CLASSPATH=`$HADOOP_HOME/bin/hadoop classpath`
export HADOOP_CLASSPATH=$HADOOP_CLASSPATH:$HIVE_HOME/lib/*
~
~
~
~
~
~
~
~
"sqoop-env.sh" 41L, 1655C written
[root@hadoopmaster conf]# 
```

4、配置环境变量

```shell
[root@hadoopmaster conf]# vi /etc/profile
#sqoop
export SQOOP_HOME=/root/tools/sqoop-1.4.7
export PATH=$PATH:$SQOOP_HOME/bin

保存后，source /etc/profile 使配置生效
```

5、在mysql中创建test数据库、tb_unit表

```bash
mysql> create database test;
Query OK, 1 row affected (0.01 sec)
mysql> use test;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A
mysql> CREATE TABLE tb_unit(
    ->   id bigint, 
    ->   area_code varchar(200), 
    ->   unit_code varchar(200), 
    ->   unit_caption varchar(200), 
    ->   dept_id varchar(200), 
    ->   dept_parent_areacode varchar(200), 
    ->   dept_parent varchar(200), 
    ->   dept_dept_class varchar(200), 
    ->   dept_lsgl varchar(200), 
    ->   unit_list varchar(200), 
    ->   unit_lsgx varchar(200), 
    ->   unit_order bigint, 
    ->   py_code varchar(200), 
    ->   wb_code varchar(200), 
    ->   is_zh varchar(200), 
    ->   is_fy varchar(200), 
    ->   unit_ip varchar(200))
    -> ;
Query OK, 0 rows affected (0.02 sec)
mysql>  select * from test.tb_unit ;
Empty set (0.00 sec)

mysql> quit;
```

6、在hive中创建tb_unit表并导入数据

```bash
hive> CREATE TABLE casinfo.tb_unit(
    >   id bigint, 
    >   area_code string, 
    >   unit_code string, 
    >   unit_caption string, 
    >   dept_id string, 
    >   dept_parent_areacode string, 
    >   dept_parent string, 
    >   dept_dept_class string, 
    >   dept_lsgl string, 
    >   unit_list string, 
    >   unit_lsgx string, 
    >   unit_order bigint, 
    >   py_code string, 
    >   wb_code string, 
    >   is_zh string, 
    >   is_fy string, 
    >   unit_ip string)
    > ROW FORMAT SERDE 
    >   'org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe' 
    > WITH SERDEPROPERTIES ( 
    >   'field.delim'='|', 
    >   'serialization.format'='|') 
    > STORED AS INPUTFORMAT 
    >   'org.apache.hadoop.mapred.TextInputFormat' 
    > OUTPUTFORMAT 
    >   'org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat'
    > ;
OK
Time taken: 0.068 seconds
hive> load data local inpath'/root/data/tb_unit.csv' overwrite into table casinfo.tb_unit;

```

7、验证从hive中导出数据到mysql

创建从hive导出数据到mysql的sh脚本并执行

```bash
[root@hadoopmaster flink]# vi export_195.sh
#!/bin/bash
#连接MySQL数据库
Host=172.17.49.195
User=root
PW='qaz123689'

#远程连接  #指定Host，其他不变
mysql -h$Host --port=3306 -u$User -p$PW <<EOF
#show databases;
use test;
delete from tb_unit          ;
COMMIT;
EOF

sqoop export \
--connect jdbc:mysql://172.17.49.195:3306/test \
--username root \
--password 'qaz123689' \
--table TB_UNIT \
--columns id,area_code,unit_code,unit_caption,dept_id,dept_parent_areacode,dept_parent,dept_dept_class,dept_lsgl,unit_list,unit_lsgx,unit_order,py_code,wb_code,is_zh,is_fy,unit_ip \
--m 1 \
--export-dir hdfs://172.17.49.195:9000/data/hive/warehouse/casinfo.db/tb_unit \
--input-fields-terminated-by '|' \
--input-null-string "\\\N"  \
--input-null-non-string "\\\N" \
;
[root@hadoopmaster flink]# 

[root@hadoopmaster flink]# sh export_195.sh   #执行导出任务
mysql: [Warning] Using a password on the command line interface can be insecure.
Warning: /root/tools/sqoop-1.4.7/../hbase does not exist! HBase imports will fail.
Please set $HBASE_HOME to the root of your HBase installation.
Warning: /root/tools/sqoop-1.4.7/../hcatalog does not exist! HCatalog jobs will fail.
Please set $HCAT_HOME to the root of your HCatalog installation.
Warning: /root/tools/sqoop-1.4.7/../accumulo does not exist! Accumulo imports will fail.
Please set $ACCUMULO_HOME to the root of your Accumulo installation.
Warning: /root/tools/sqoop-1.4.7/../zookeeper does not exist! Accumulo imports will fail.
Please set $ZOOKEEPER_HOME to the root of your Zookeeper installation.
2022-09-16 21:28:43,371 INFO sqoop.Sqoop: Running Sqoop version: 1.4.7
2022-09-16 21:28:43,402 WARN tool.BaseSqoopTool: Setting your password on the command-line is insecure. Consider using -P instead.
2022-09-16 21:28:43,519 INFO manager.MySQLManager: Preparing to use a MySQL streaming resultset.
2022-09-16 21:28:43,523 INFO tool.CodeGenTool: Beginning code generation
Loading class `com.mysql.jdbc.Driver'. This is deprecated. The new driver class is `com.mysql.cj.jdbc.Driver'. The driver is automatically registered via the SPI and manual loading of the driver class is generally unnecessary.
2022-09-16 21:28:44,156 INFO manager.SqlManager: Executing SQL statement: SELECT t.* FROM `TB_UNIT` AS t LIMIT 1
2022-09-16 21:28:44,188 INFO manager.SqlManager: Executing SQL statement: SELECT t.* FROM `TB_UNIT` AS t LIMIT 1
2022-09-16 21:28:44,197 INFO orm.CompilationManager: HADOOP_MAPRED_HOME is /root/tools/hadoop-3.3.4/lib
2022-09-16 21:28:44,207 WARN orm.CompilationManager: HADOOP_MAPRED_HOME appears empty or missing
Note: /tmp/sqoop-root/compile/0d0dc8829c24e1a5df0bfc12aedc4bb1/TB_UNIT.java uses or overrides a deprecated API.
Note: Recompile with -Xlint:deprecation for details.
2022-09-16 21:28:45,475 INFO orm.CompilationManager: Writing jar file: /tmp/sqoop-root/compile/0d0dc8829c24e1a5df0bfc12aedc4bb1/TB_UNIT.jar
2022-09-16 21:28:45,495 INFO mapreduce.ExportJobBase: Beginning export of TB_UNIT
2022-09-16 21:28:45,495 INFO Configuration.deprecation: mapred.job.tracker is deprecated. Instead, use mapreduce.jobtracker.address
2022-09-16 21:28:45,589 INFO Configuration.deprecation: mapred.jar is deprecated. Instead, use mapreduce.job.jar
2022-09-16 21:28:46,487 INFO Configuration.deprecation: mapred.reduce.tasks.speculative.execution is deprecated. Instead, use mapreduce.reduce.speculative
2022-09-16 21:28:46,491 INFO Configuration.deprecation: mapred.map.tasks.speculative.execution is deprecated. Instead, use mapreduce.map.speculative
2022-09-16 21:28:46,491 INFO Configuration.deprecation: mapred.map.tasks is deprecated. Instead, use mapreduce.job.maps
2022-09-16 21:28:46,597 INFO client.DefaultNoHARMFailoverProxyProvider: Connecting to ResourceManager at /172.17.49.195:8050
2022-09-16 21:28:46,874 INFO mapreduce.JobResourceUploader: Disabling Erasure Coding for path: /tmp/hadoop-yarn/staging/root/.staging/job_1663290548455_0208
2022-09-16 21:28:49,842 INFO input.FileInputFormat: Total input files to process : 1
2022-09-16 21:28:49,844 INFO input.FileInputFormat: Total input files to process : 1
2022-09-16 21:28:50,681 INFO mapreduce.JobSubmitter: number of splits:1
2022-09-16 21:28:50,707 INFO Configuration.deprecation: mapred.map.tasks.speculative.execution is deprecated. Instead, use mapreduce.map.speculative
2022-09-16 21:28:50,788 INFO mapreduce.JobSubmitter: Submitting tokens for job: job_1663290548455_0208
2022-09-16 21:28:50,788 INFO mapreduce.JobSubmitter: Executing with tokens: []
2022-09-16 21:28:50,957 INFO conf.Configuration: resource-types.xml not found
2022-09-16 21:28:50,957 INFO resource.ResourceUtils: Unable to find 'resource-types.xml'.
2022-09-16 21:28:51,008 INFO impl.YarnClientImpl: Submitted application application_1663290548455_0208
2022-09-16 21:28:51,047 INFO mapreduce.Job: The url to track the job: http://hadoopmaster:8088/proxy/application_1663290548455_0208/
2022-09-16 21:28:51,048 INFO mapreduce.Job: Running job: job_1663290548455_0208
2022-09-16 21:28:57,118 INFO mapreduce.Job: Job job_1663290548455_0208 running in uber mode : false
2022-09-16 21:28:57,119 INFO mapreduce.Job:  map 0% reduce 0%
2022-09-16 21:29:04,183 INFO mapreduce.Job:  map 100% reduce 0%
2022-09-16 21:29:04,188 INFO mapreduce.Job: Job job_1663290548455_0208 completed successfully
2022-09-16 21:29:04,283 INFO mapreduce.Job: Counters: 33
        File System Counters
                FILE: Number of bytes read=0
                FILE: Number of bytes written=285329
                FILE: Number of read operations=0
                FILE: Number of large read operations=0
                FILE: Number of write operations=0
                HDFS: Number of bytes read=5065856
                HDFS: Number of bytes written=0
                HDFS: Number of read operations=4
                HDFS: Number of large read operations=0
                HDFS: Number of write operations=0
                HDFS: Number of bytes read erasure-coded=0
        Job Counters 
                Launched map tasks=1
                Data-local map tasks=1
                Total time spent by all maps in occupied slots (ms)=4572
                Total time spent by all reduces in occupied slots (ms)=0
                Total time spent by all map tasks (ms)=4572
                Total vcore-milliseconds taken by all map tasks=4572
                Total megabyte-milliseconds taken by all map tasks=4681728
        Map-Reduce Framework
                Map input records=39516
                Map output records=39516
                Input split bytes=157
                Spilled Records=0
                Failed Shuffles=0
                Merged Map outputs=0
                GC time elapsed (ms)=108
                CPU time spent (ms)=4560
                Physical memory (bytes) snapshot=436076544
                Virtual memory (bytes) snapshot=2816495616
                Total committed heap usage (bytes)=498597888
                Peak Map Physical memory (bytes)=436076544
                Peak Map Virtual memory (bytes)=2816495616
        File Input Format Counters 
                Bytes Read=0
        File Output Format Counters 
                Bytes Written=0
2022-09-16 21:29:04,289 INFO mapreduce.ExportJobBase: Transferred 4.8312 MB in 17.7887 seconds (278.1053 KB/sec)
2022-09-16 21:29:04,291 INFO mapreduce.ExportJobBase: Exported 39516 records.
[root@hadoopmaster flink]# 
```

8、确认mysql 数据库中是否已有数据

```bash
mysql> select * from tb_unit limit 1 ;
+-------+-----------+------------+--------------------+--------------+----------------------+--------------+-----------------+-----------+-----------+-----------+------------+---------+---------+-------+-------+---------+
| id    | area_code | unit_code  | unit_caption       | dept_id      | dept_parent_areacode | dept_parent  | dept_dept_class | dept_lsgl | unit_list | unit_lsgx | unit_order | py_code | wb_code | is_zh | is_fy | unit_ip |
+-------+-----------+------------+--------------------+--------------+----------------------+--------------+-----------------+-----------+-----------+-----------+------------+---------+---------+-------+-------+---------+
| 1 | 4    | 14 | 村卫生室       | 145 | 451               | 450 | Y0            |           | 0         |           |         5 | TMCWSS  | CISBTP  | 0     |       |         |

+-------+-----------+------------+--------------------+--------------+----------------------+--------------+-----------------+-----------+-----------+-----------+------------+---------+---------+-------+-------+---------+
1 rows in set (0.00 sec)

mysql> 

```

9、验证将mysql表数据导入hive表

从mysql导入数据到hive

```shell
hive>  create table tb_unit_new(                #创建hive表
    >   id bigint, 
    >   area_code string, 
    >   unit_code string, 
    >   unit_caption string, 
    >   dept_id string, 
    >   dept_parent_areacode string, 
    >   dept_parent string, 
    >   dept_dept_class string, 
    >   dept_lsgl string, 
    >   unit_list string, 
    >   unit_lsgx string, 
    >   unit_order bigint, 
    >   py_code string, 
    >   wb_code string, 
    >   is_zh string, 
    >   is_fy string, 
    >   unit_ip string)
    > ROW FORMAT SERDE 
    >   'org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe' 
    > WITH SERDEPROPERTIES ( 
    >   'field.delim'='|', 
    >   'serialization.format'='|', 
    >   'serialization.null.format'='') 
    > STORED AS INPUTFORMAT 
    >   'org.apache.hadoop.mapred.TextInputFormat' 
    > OUTPUTFORMAT 
    >   'org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat'
    > ;
OK
Time taken: 0.046 seconds
hive> 
[root@hadoopmaster flink]# touch import_195.sh  #创建导入脚本
[root@hadoopmaster flink]# vi import_195.sh
sqoop import \
--connect jdbc:mysql://172.17.49.195:3306/test \
--username root \
--password 'qaz123689' \
--hive-import \
--hive-table casinfo.tb_unit_new \
--as-textfile \
--fields-terminated-by '|' \
--target-dir 'hdfs://172.17.49.195:9000/data/hive/warehouse/casinfo.db/tb_unit_new' \
--delete-target-dir \
--null-string '\\N' \
--null-non-string '\\N' \
--query 'select * from TB_UNIT where $CONDITIONS' \
--split-by id \
-m 2
"import_195.sh" 15L, 432C written
[root@hadoopmaster flink]# 
[root@hadoopmaster flink]# sh import_195.sh   #执行导入脚本

hive> select * from  tb_unit_new limit 10 ;   #查看导入结果
OK
18756   451081  4510250240      驮满村卫生室    450000055244    451081  450000000344    D600    NULL    0       NULL    50      TMCWSS  CISBTP  0       NULL    NULL
18757   451081  4510250241      扶赖街卫生室    450000055246    451081  450000000344    D600    NULL    0       NULL    50      FLJWSS  RGTBTP  0       NULL    NULL
18758   451081  4510250242      那多村卫生室    450000055248    451081  450000000344    D600    NULL    0       NULL    50      NDCWSS  VQSBTP  0       NULL    NULL
18759   451081  4510250243      驮林村卫生室    450000055250    451081  450000000344    D600    NULL    0       NULL    50      TLCWSS  CSSBTP  0       NULL    NULL
18760   451081  4510250244      大面村卫生室    450000055252    451081  450000000344    D600    NULL    0       NULL    50      DMCWSS  DDSBTP  0       NULL    NULL
18761   451081  4510250245      那些村卫生室    450000055254    451081  450000000344    D600    NULL    0       NULL    50      NXCWSS  VHSBTP  0       NULL    NULL
18762   451081  4510250246      德周村卫生室    450000055256    451081  450000000344    D600    NULL    0       NULL    50      DZCWSS  TMSBTP  0       NULL    NULL
18763   451081  4510250247      大动村卫生室    450000055258    451081  450000000344    D600    NULL    0       NULL    50      DDCWSS  DFSBTP  0       NULL    NULL
18764   451026  4510260030      明浪村卫生室    450000055340    451026  450000000346    D600    NULL    0       NULL    50      MLCWSS  JISBTP  0       NULL    NULL
18765   451026  4510260031      弄约村卫生室    450000055376    451026  450000000346    D600    NULL    0       NULL    50      NYCWSS  GXSBTP  0       NULL    NULL
Time taken: 0.101 seconds, Fetched: 10 row(s)
hive> 
```

