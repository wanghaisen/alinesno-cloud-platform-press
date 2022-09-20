# hive建表说明

## 本内容你将获得

- hive与外部系统数据交换的建表注意事项
- hive数仓各层的建表注意事项
- hive创建text、orc表及常见操作

## hive表字段类型

| 序号 |   分类   |      类型      |                      描述                      |                          字面量示例                          |
| :--: | :------: | :------------: | :--------------------------------------------: | :----------------------------------------------------------: |
|  1   | 原始类型 |    BOOLEAN     |                   true/false                   |                             TRUE                             |
|  2   | 原始类型 | TINYINTTINYINT |           1字节的有符号整数 -128~127           |                              1Y                              |
|  3   | 原始类型 |    SMALLINT    |       2个字节的有符号整数，-32768~32767        |                              1S                              |
|  4   | 原始类型 |      INT       |              4个字节的带符号整数               |                              1                               |
|  5   | 原始类型 |     BIGINT     |                8字节带符号整数                 |                              1L                              |
|  6   | 原始类型 |     FLOAT      |              4字节单精度浮点数1.0              |                                                              |
|  7   | 原始类型 |     DOUBLE     |               8字节双精度浮点数                |                              1                               |
|  8   | 原始类型 |    DEICIMAL    |              任意精度的带符号小数              |                              1                               |
|  9   | 原始类型 |     STRING     |                  字符串，变长                  |                           “a”,’b’                            |
|  10  | 原始类型 |    VARCHAR     |                   变长字符串                   |                           “a”,’b’                            |
|  11  | 原始类型 |      CHAR      |                 固定长度字符串                 |                           “a”,’b’                            |
|  12  | 原始类型 |     BINARY     |                    字节数组                    |                           字节数组                           |
|  13  | 原始类型 |   TIMESTAMP    |               时间戳，毫秒值精度               |                         122327493795                         |
|  14  | 原始类型 |      DATE      |                      日期                      |                         ‘2016-03-29’                         |
|  15  | 原始类型 |    INTERVAL    |                  时间频率间隔                  |                              -                               |
|  16  | 复杂类型 |     ARRAY      |              有序的的同类型的集合              |                          array(1,2)                          |
|  17  | 复杂类型 |      MAP       | key-value,key必须为原始类型，value可以任意类型 |                       map(‘a’,1,’b’,2)                       |
|  18  | 复杂类型 |     STRUCT     |             字段集合,类型可以不同              | struct(‘1’,1,1.0), named_stract(‘col1’,’1’,’col2’,1,’clo3’,1.0) |
|  19  | 复杂类型 |     UNION      |            在有限取值范围内的一个值            |                    create_union(1,’a’,63)                    |

常用的用法

a)、时间字段设置为STRING类型

b)、数值类型设置为BIGINT

c)、浮点类型设置为DEICIMAL

## hive表类型

###  1、内部表

- **hive拥有和管理的托管表**
- **默认情况下创建内部表，hive拥有该表的结构和文件**
- **当删除内部表的时候，会删除数据及表的元数据**

### 2、外部表

- **hive不拥有或管理外部表的数据，只管理表元素的生命周期**
- **创建一个外部表，需使用External关键字**
- **删除外部表时只删除元数据，不删除实际数据，可用hdfs访问数据**
- **外部表一般使用location语法指定数据的路径**
- **外部表不用location语法指定数据的路径时，默认路径为/hive/warehouse/数据库名称/表名**

### 3、分区表

- **海量数据，数据整进整出，不进行部分更新、删除操作**
- **按时间、数据范围粒度建立对应分区，如小时分区、天分区**
- **以分区为条件统计分区指标、删除分区数据**

-  **hdfs会自动在表的目录下 ，为每个分区创建一个分区目录**

### 4、事务表

- **支持update和delete功能**
- **存储格式为是ORC（STORED AS ORC）**

- **表为分桶表（CLUSTERED BY (col_name, col_name, ...) INTO num_buckets BUCKETS）**

- **表为事务表（tblproperties('transactional'='true')）**

### 5、Hive表存储格式

- **textFile**             文本格式，Hive默认的存储格式。通常用作数据导入、导出的中转表。从其他数据库导入数据到hive，或者导出数据到其他数据库。
- **SequenceFile**  Hadoop支持的二进制文件
- **RCFile**               ORC表的前身，支持的功能和计算性能都低于ORC表
- **ORC**                   Hive计算的主要存储格式，在分析计算中的性能较好，是生产中常见的表存储格式
- **Parquet**           Hive计算的主要表形式，它的计算性能稍弱于ORC表
- **AVRO**                Hadoop 提供的数据序列化和数据交换服务，支持二进制序列化方式

### 6、数据分层

- **明细层**   来源数据表，命名规则:ods_业务表名_粒度,如ods_trend_analysis_dy
- **汇总层**    汇总层表，命名规则:dwb_业务表名_粒度,如 dwb_trend_analysis_dy
- **结果层**    结果层表，命名规则:app_业务表名_粒度,如 app_trend_analysis_dy

### 7、常用操作

```shell
hive> create database test;         --创建数据库           
hive> show databases;               --查看数据库 
OK
default
test
hive> use test;                     --进入数据库 
OK
Time taken: 0.026 seconds
hive> show tables;                  --查看数据表
OK
flink_electricity_bill_hudi
Time taken: 0.028 seconds, Fetched: 1 row(s)
hive> show create table flink_electricity_bill_hudi ;
OK
CREATE EXTERNAL TABLE `flink_electricity_bill_hudi`(
  `_hoodie_commit_time` string COMMENT '', 
  `_hoodie_commit_seqno` string COMMENT '', 
  `_hoodie_record_key` string COMMENT '', 
  `_hoodie_partition_path` string COMMENT '', 
  `_hoodie_file_name` string COMMENT '', 
  `billing_month` string COMMENT '', 
  `provinces` string COMMENT '', 
  `local_market` string COMMENT '', 
  `county` string COMMENT '', 
  `meter_number` string COMMENT '', 
  `pay_amount` double COMMENT '')
PARTITIONED BY ( 
  `part` string COMMENT '')
ROW FORMAT SERDE 
  'org.apache.hadoop.hive.ql.io.parquet.serde.ParquetHiveSerDe' 
WITH SERDEPROPERTIES ( 
  'hoodie.query.as.ro.table'='false', 
  'path'='hdfs://172.17.49.195:9000/user/flink/hudi/flink_electricity_bill_hudi') 
STORED AS INPUTFORMAT 
  'org.apache.hudi.hadoop.HoodieParquetInputFormat' 
OUTPUTFORMAT 
  'org.apache.hadoop.hive.ql.io.parquet.MapredParquetOutputFormat'
LOCATION
  'hdfs://172.17.49.195:9000/user/flink/hudi/flink_electricity_bill_hudi'
TBLPROPERTIES (
  'last_commit_time_sync'='20220920101620011', 
  'spark.sql.sources.provider'='hudi', 
  'spark.sql.sources.schema.numPartCols'='1', 
  'spark.sql.sources.schema.numParts'='1', 
  'spark.sql.sources.schema.part.0'='{"type":"struct","fields":[{"name":"_hoodie_commit_time","type":"string","nullable":true,"metadata":{}},{"name":"_hoodie_commit_seqno","type":"string","nullable":true,"metadata":{}},{"name":"_hoodie_record_key","type":"string","nullable":true,"metadata":{}},{"name":"_hoodie_partition_path","type":"string","nullable":true,"metadata":{}},{"name":"_hoodie_file_name","type":"string","nullable":true,"metadata":{}},{"name":"billing_month","type":"string","nullable":true,"metadata":{}},{"name":"provinces","type":"string","nullable":true,"metadata":{}},{"name":"local_market","type":"string","nullable":true,"metadata":{}},{"name":"county","type":"string","nullable":true,"metadata":{}},{"name":"meter_number","type":"string","nullable":false,"metadata":{}},{"name":"pay_amount","type":"double","nullable":true,"metadata":{}},{"name":"part","type":"string","nullable":true,"metadata":{}}]}', 
  'spark.sql.sources.schema.partCol.0'='part', 
  'transient_lastDdlTime'='1663638742')
Time taken: 0.213 seconds, Fetched: 33 row(s)
hive> 
    > CREATE EXTERNAL TABLE test.tb_area(               --创建text表
    >   area_code_n string, 
    >   area_name_c string, 
    >   area_abbr_c string, 
    >   is_jc string, 
    >   is_pk string, 
    >   is_zb string, 
    >   is_gj string)
    > ROW FORMAT SERDE 
    >   'org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe' 
    > WITH SERDEPROPERTIES ( 
    >   'field.delim'='|',                       --设置字段分隔符为|
    >   'serialization.format'='|',
    >    'serialization.null.format'='')         --设置空值为''
    > STORED AS INPUTFORMAT 
    >   'org.apache.hadoop.mapred.TextInputFormat'     --指定存储格式   
    > OUTPUTFORMAT 
    >   'org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat'
    > ;
OK
Time taken: 0.45 seconds
hive> show create table test.tb_area;             --查看表结构
OK
CREATE EXTERNAL TABLE `test.tb_area`(
  `area_code_n` string, 
  `area_name_c` string, 
  `area_abbr_c` string, 
  `is_jc` string, 
  `is_pk` string, 
  `is_zb` string, 
  `is_gj` string)
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
LOCATION
  'hdfs://172.17.49.195:9000/data/hive/warehouse/test.db/tb_area'
TBLPROPERTIES (
  'bucketing_version'='2', 
  'transient_lastDdlTime'='1663659189')
Time taken: 0.066 seconds, Fetched: 23 row(s)
hive> load data local inpath'/root/flink/tb_area.csv' overwrite into table test.tb_area;   --导入数据
Loading data to table test.tb_area
OK
Time taken: 0.441 seconds
hive> select * from test.tb_area limit 10 ;                                                --查看表前10行数据 
OK
450111  广西-东盟经济技术开发区 东盟经济技术开发区      3       0       1       0
450000  广西壮族自治区  广西壮族自治区  0       0       1       1
450100  南宁市  南宁市  0       0       1       1
450102      兴宁区          兴宁区      0       0       1       1
450103      青秀区          青秀区      0       0       1       1
450105      江南区          江南区      0       0       1       1
450107      西乡塘区        西乡塘区    0       0       1       1
450108      良庆区          良庆区      0       0       1       1
450109      邕宁区          邕宁区      0       0       1       1
450122     武鸣县(旧)      武鸣县       0       0       0       0
Time taken: 1.014 seconds, Fetched: 10 row(s)
hive> select count(*)from test.tb_area limit 1 ;                                          --统计记录数  
Query ID = root_20220920154026_ba116835-13bb-4338-8b4a-f5e4527e8fca
Total jobs = 1
Launching Job 1 out of 1
Number of reduce tasks determined at compile time: 1
In order to change the average load for a reducer (in bytes):
  set hive.exec.reducers.bytes.per.reducer=<number>
In order to limit the maximum number of reducers:
  set hive.exec.reducers.max=<number>
In order to set a constant number of reducers:
  set mapreduce.job.reduces=<number>
Starting Job = job_1663290548455_0209, Tracking URL = http://hadoopmaster:8088/proxy/application_1663290548455_0209/
Kill Command = /root/tools/hadoop-3.3.4/bin/mapred job  -kill job_1663290548455_0209
Hadoop job information for Stage-1: number of mappers: 1; number of reducers: 1
2022-09-20 15:40:54,538 Stage-1 map = 0%,  reduce = 0%
2022-09-20 15:40:59,879 Stage-1 map = 100%,  reduce = 0%, Cumulative CPU 2.59 sec
2022-09-20 15:41:06,061 Stage-1 map = 100%,  reduce = 100%, Cumulative CPU 5.58 sec
MapReduce Total cumulative CPU time: 5 seconds 580 msec
Ended Job = job_1663290548455_0209
MapReduce Jobs Launched: 
Stage-Stage-1: Map: 1  Reduce: 1   Cumulative CPU: 5.58 sec   HDFS Read: 21029 HDFS Write: 103 SUCCESS
Total MapReduce CPU Time Spent: 5 seconds 580 msec
OK
167
Time taken: 41.299 seconds, Fetched: 1 row(s)
hive> set hive.execution.engine=spark;                --设置引擎
hive> select count(*)from test.tb_area limit 1 ;      --统计记录数 
Query ID = root_20220920154157_779ffd89-4e70-444f-bfa3-15f0b1d032a1
Total jobs = 1
Launching Job 1 out of 1
In order to change the average load for a reducer (in bytes):
  set hive.exec.reducers.bytes.per.reducer=<number>
In order to limit the maximum number of reducers:
  set hive.exec.reducers.max=<number>
In order to set a constant number of reducers:
  set mapreduce.job.reduces=<number>
Hive on Spark Session Web UI URL: http://hadoopmaster:4040

Query Hive on Spark job[0] stages: [0, 1]
Spark job[0] status = RUNNING
--------------------------------------------------------------------------------------
          STAGES   ATTEMPT        STATUS  TOTAL  COMPLETED  RUNNING  PENDING  FAILED  
--------------------------------------------------------------------------------------
Stage-0 ........         0      FINISHED      1          1        0        0       0  
Stage-1 ........         0      FINISHED      1          1        0        0       0  
--------------------------------------------------------------------------------------
STAGES: 02/02    [==========================>>] 100%  ELAPSED TIME: 9.12 s     
--------------------------------------------------------------------------------------
Spark job[0] finished successfully in 9.12 second(s)
OK
167
Time taken: 20.193 seconds, Fetched: 1 row(s)
hive> create table test.tb_area_1         --通过查询创建表
    > as
    > select *from test.tb_area;
Query ID = root_20220920154427_f90af399-68f3-486b-afde-f747f9dfaee0
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
Stage-2 ........         0      FINISHED      1          1        0        0       0  
--------------------------------------------------------------------------------------
STAGES: 01/01    [==========================>>] 100%  ELAPSED TIME: 1.00 s     
--------------------------------------------------------------------------------------
Spark job[1] finished successfully in 1.00 second(s)
Moving data to directory hdfs://172.17.49.195:9000/data/hive/warehouse/test.db/tb_area_1
[Error 30017]: Skipping stats aggregation by error org.apache.hadoop.hive.ql.metadata.HiveException: [Error 30000]: StatsPublisher cannot be obtained. There was a error to retrieve the StatsPublisher, and retrying might help. If you dont want the query to fail because accurate statistics could not be collected, set hive.stats.reliable=false
OK
Time taken: 1.285 seconds
hive> select *from test.tb_area_1 limit 10 ;   --查询表
OK
450111  广西-东盟经济技术开发区 东盟经济技术开发区      3       0       1       0
450000  广西壮族自治区  广西壮族自治区  0       0       1       1
450100  南宁市  南宁市  0       0       1       1
450102      兴宁区          兴宁区      0       0       1       1
450103      青秀区          青秀区      0       0       1       1
450105      江南区          江南区      0       0       1       1
450107      西乡塘区        西乡塘区    0       0       1       1
450108      良庆区          良庆区      0       0       1       1
450109      邕宁区          邕宁区      0       0       1       1
450122     武鸣县(旧)      武鸣县       0       0       0       0
Time taken: 0.117 seconds, Fetched: 10 row(s)
hive> truncate table test.tb_area_1 ;          --清空表
OK
Time taken: 0.184 seconds
hive> 
    > select count(*) from test.tb_area_1 limit 1;   --查询表
FAILED: ParseException line 1:12 character '；' not supported here
hive> select count(*) from test.tb_area_1 limit 1 ;
Query ID = root_20220920154602_c1c02aff-77b2-496c-aeef-58b4f92defe1
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
Stage-3 ........         0      FINISHED      0          0        0        0       0  
Stage-4 ........         0      FINISHED      1          1        0        0       0  
--------------------------------------------------------------------------------------
STAGES: 01/02    [==========================>>] 100%  ELAPSED TIME: 1.00 s     
--------------------------------------------------------------------------------------
Spark job[2] finished successfully in 1.00 second(s)
OK
0
Time taken: 1.188 seconds, Fetched: 1 row(s)
hive> 
    > CREATE TABLE test.casinfo_b_dynamic(         --创建orc表
    >   usercode string, 
    >   username string, 
    >   ylfkfs string, 
    >   jkkh string, 
    >   zycs bigint, 
    >   bah string, 
    >   xm string, 
    >   xb string, 
    >   csrq string, 
    >   nl bigint, 
    >   gj string, 
    >   bzyzsnl decimal(8,2), 
    >   xsecstz decimal(12,2), 
    >   xserytz decimal(12,2),
    >   create_time string)
    > PARTITIONED BY ( 
    >   year string)
    > ROW FORMAT SERDE 
    >   'org.apache.hadoop.hive.ql.io.orc.OrcSerde'         
    > WITH SERDEPROPERTIES ( 
    >   'serialization.null.format'='')                     --设置空值为''
    > STORED AS INPUTFORMAT 
    >   'org.apache.hadoop.hive.ql.io.orc.OrcInputFormat'   --指定存储格式 
    > OUTPUTFORMAT 
    >   'org.apache.hadoop.hive.ql.io.orc.OrcOutputFormat'
    > ;
OK
Time taken: 0.058 seconds
hive> alter table  test.casinfo_b_dynamic set serdeproperties('serialization.null.format' = ''); --创建表时，没有设置空值为''，额外设置
OK
Time taken: 0.109 seconds
hive> insert overwrite table test.casinfo_b_dynamic partition(year='2021')   --清空指定分区后插入数据
    > select 
    >   '1001' as usercode , 
    >   '1002' as username , 
    >   '1003' as ylfkfs , 
    >   '1004' as jkkh  , 
    >   1005  as zycs, 
    >   '1006' as bah , 
    >   '1007' as xm , 
    >   '1008' as xb , 
    >   '1009' as csrq , 
    >   1010   as nl , 
    >   '1011' as gj , 
    >   10.25  as bzyzsnl , 
    >   11.58  as xsecstz  , 
    >   12.69  as xserytz ,
    >   '1012' as create_time  
    > ;
Query ID = root_20220920165445_deb1c765-838c-4b14-9b36-4764aab8f8c7
Total jobs = 1
Launching Job 1 out of 1
Number of reduce tasks not specified. Estimated from input data size: 1
In order to change the average load for a reducer (in bytes):
  set hive.exec.reducers.bytes.per.reducer=<number>
In order to limit the maximum number of reducers:
  set hive.exec.reducers.max=<number>
In order to set a constant number of reducers:
  set mapreduce.job.reduces=<number>
Starting Job = job_1663290548455_0210, Tracking URL = http://hadoopmaster:8088/proxy/application_1663290548455_0210/
Kill Command = /root/tools/hadoop-3.3.4/bin/mapred job  -kill job_1663290548455_0210
Hadoop job information for Stage-1: number of mappers: 1; number of reducers: 1
2022-09-20 16:55:09,369 Stage-1 map = 0%,  reduce = 0%
2022-09-20 16:55:16,600 Stage-1 map = 100%,  reduce = 0%, Cumulative CPU 3.26 sec
2022-09-20 16:55:21,738 Stage-1 map = 100%,  reduce = 100%, Cumulative CPU 5.98 sec
MapReduce Total cumulative CPU time: 5 seconds 980 msec
Ended Job = job_1663290548455_0210
Stage-4 is selected by condition resolver.
Stage-3 is filtered out by condition resolver.
Stage-5 is filtered out by condition resolver.
Moving data to directory hdfs://172.17.49.195:9000/data/hive/warehouse/test.db/casinfo_b_dynamic/year=2021/.hive-staging_hive_2022-09-20_16-54-45_510_7037481315883623358-1/-ext-10000
Loading data to table test.casinfo_b_dynamic partition (year=2021)
[Error 30017]: Skipping stats aggregation by error org.apache.hadoop.hive.ql.metadata.HiveException: [Error 30000]: StatsPublisher cannot be obtained. There was a error to retrieve the StatsPublisher, and retrying might help. If you dont want the query to fail because accurate statistics could not be collected, set hive.stats.reliable=false
MapReduce Jobs Launched: 
Stage-Stage-1: Map: 1  Reduce: 1   Cumulative CPU: 5.98 sec   HDFS Read: 31018 HDFS Write: 1905 SUCCESS
Total MapReduce CPU Time Spent: 5 seconds 980 msec
OK
Time taken: 39.72 seconds
hive> 
    > insert into table test.casinfo_b_dynamic partition(year='2021')   --往指定分区追加数据
    > select 
    >   '2001' as usercode , 
    >   '2002' as username , 
    >   '2003' as ylfkfs , 
    >   '2004' as jkkh  , 
    >   2005  as zycs, 
    >   '2006' as bah , 
    >   '2007' as xm , 
    >   '2008' as xb , 
    >   '2009' as csrq , 
    >   2010   as nl , 
    >   '2011' as gj , 
    >   20.25  as bzyzsnl , 
    >   21.58  as xsecstz  , 
    >   22.69  as xserytz ,
    >   '2012' as create_time  
    > ;
Query ID = root_20220920165818_231694f6-67e9-43e1-a924-d2eed4255983
Total jobs = 1
Launching Job 1 out of 1
Number of reduce tasks not specified. Estimated from input data size: 1
In order to change the average load for a reducer (in bytes):
  set hive.exec.reducers.bytes.per.reducer=<number>
In order to limit the maximum number of reducers:
  set hive.exec.reducers.max=<number>
In order to set a constant number of reducers:
  set mapreduce.job.reduces=<number>
Starting Job = job_1663290548455_0211, Tracking URL = http://hadoopmaster:8088/proxy/application_1663290548455_0211/
Kill Command = /root/tools/hadoop-3.3.4/bin/mapred job  -kill job_1663290548455_0211
Hadoop job information for Stage-1: number of mappers: 1; number of reducers: 1
2022-09-20 16:58:40,624 Stage-1 map = 0%,  reduce = 0%
2022-09-20 16:58:46,793 Stage-1 map = 100%,  reduce = 0%, Cumulative CPU 3.24 sec
2022-09-20 16:58:53,978 Stage-1 map = 100%,  reduce = 100%, Cumulative CPU 6.62 sec
MapReduce Total cumulative CPU time: 6 seconds 620 msec
Ended Job = job_1663290548455_0211
Stage-4 is selected by condition resolver.
Stage-3 is filtered out by condition resolver.
Stage-5 is filtered out by condition resolver.
Moving data to directory hdfs://172.17.49.195:9000/data/hive/warehouse/test.db/casinfo_b_dynamic/year=2021/.hive-staging_hive_2022-09-20_16-58-18_683_5924616560900391437-1/-ext-10000
Loading data to table test.casinfo_b_dynamic partition (year=2021)
[Error 30017]: Skipping stats aggregation by error org.apache.hadoop.hive.ql.metadata.HiveException: [Error 30000]: StatsPublisher cannot be obtained. There was a error to retrieve the StatsPublisher, and retrying might help. If you dont want the query to fail because accurate statistics could not be collected, set hive.stats.reliable=false
MapReduce Jobs Launched: 
Stage-Stage-1: Map: 1  Reduce: 1   Cumulative CPU: 6.62 sec   HDFS Read: 31018 HDFS Write: 1905 SUCCESS
Total MapReduce CPU Time Spent: 6 seconds 620 msec
OK
Time taken: 36.717 seconds
hive> select * from test.casinfo_b_dynamic where year='2021' ;         --通过分区条件查询数据
OK
1001    1002    1003    1004    1005    1006    1007    1008    1009    1010    1011    10.25   11.58   12.69   1012    2021
2001    2002    2003    2004    2005    2006    2007    2008    2009    2010    2011    20.25   21.58   22.69   2012    2021
Time taken: 0.147 seconds, Fetched: 2 row(s)
hive> alter table test.casinfo_b_dynamic drop partition(year='2021');  --删除指定分区的数据
Dropped the partition year=2021
OK
Time taken: 0.149 seconds
hive> select * from test.casinfo_b_dynamic where year='2021' ;     
OK
Time taken: 0.154 seconds
hive> alter table test.casinfo_b_dynamic rename to test.casinfo_b_dynamic_new;         --修改表名称
OK
Time taken: 0.075 seconds
hive> select *from test.casinfo_b_dynamic_new;                                          --查询新表
OK
Time taken: 0.114 seconds
hive> select *from test.casinfo_b_dynamic ;
FAILED: SemanticException [Error 10001]: Line 1:13 Table not found 'casinfo_b_dynamic'  --查询旧表
hive> 
    >  alter table test.casinfo_b_dynamic_new change column usercode usercode_new string comment '用户编码' ;  --修改列名
OK
Time taken: 0.082 seconds
hive> desc test.casinfo_b_dynamic_new;
OK
usercode_new            string                  ????                
username                string                                      
ylfkfs                  string                                      
jkkh                    string                                      
zycs                    bigint                                      
bah                     string                                      
xm                      string                                      
xb                      string                                      
csrq                    string                                      
nl                      bigint                                      
gj                      string                                      
bzyzsnl                 decimal(8,2)                                
xsecstz                 decimal(12,2)                               
xserytz                 decimal(12,2)                               
create_time             string                                      
year                    string                                      
                 
# Partition Information          
# col_name              data_type               comment             
year                    string                                      
Time taken: 0.049 seconds, Fetched: 20 row(s)
hive>  alter table test.casinfo_b_dynamic_new add columns(birth string comment '生日',sex integer comment '性别');  --新增字段
OK
Time taken: 0.079 seconds
hive> desc test.casinfo_b_dynamic_new;      --查看表结构
OK
usercode_new            string                  ????                
username                string                                      
ylfkfs                  string                                      
jkkh                    string                                      
zycs                    bigint                                      
bah                     string                                      
xm                      string                                      
xb                      string                                      
csrq                    string                                      
nl                      bigint                                      
gj                      string                                      
bzyzsnl                 decimal(8,2)                                
xsecstz                 decimal(12,2)                               
xserytz                 decimal(12,2)                               
create_time             string                                      
birth                   string                  ??                  
sex                     int                     ??                  
year                    string                                      
                 
# Partition Information          
# col_name              data_type               comment             
year                    string                                      
Time taken: 0.041 seconds, Fetched: 22 row(s)
hive> select  cast(substring(regexp_replace('2022-09-20 17:27:00.0', '-', ''),1,8) as int);   --替换和转换函数
OK
20220920
Time taken: 0.081 seconds, Fetched: 1 row(s)
hive> 
```

​       



 在实践中，一般不建事务分桶表。

如表的数据量可预估，可建成分桶表。如表的数据存储量预计为1T，按照HDFS每个数据块128MB，分桶数=

 1 * 1024 * 1024 / 128 = 8192 , 取奇数 8193 。建表时，设置分布键为UUID，分桶数为8193，则数据为均匀的分布到各个dataNode,避免数据分布不均，造成数据倾斜。某dataNode存储少量数据，某dataNode存储大量数据，计算时，运算时间卡在存储大量数据的dataNode节点。

 如表的数据存储量预计为1T存储，后期存储量还可能继续增加，按照HDFS每个数据块128MB，文件块数= 1 * 1024 * 1024 / 128 = 8192 , 取奇数 8193 。建普通表，压缩格式为orc。在插入数据时，set mapred.reduce.tasks=8193，可将数据均匀的分布到各个dataNode。后期通过观察，如数据量增加，文件大小超过200M。再计算出合适的tasks数，修改跑数任务。



### 

