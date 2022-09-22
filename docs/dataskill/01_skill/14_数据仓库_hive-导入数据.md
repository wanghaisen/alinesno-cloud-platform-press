# hive-导入数据

## 本内容你将获得

- 通过kettle任务抽取mysql业务数据到hive表
- 在线调度kettle任务
- 定时删除历史数据文件




## 数据导入hive表的常见方式

- **将本地数据文件导入Hive表**   

   ```shell
   hive> load data local inpath'/root/flink/tb_area.csv' overwrite into table test.tb_area;   
   备注：
   1)、数据文件为格式文件，数据字段的分隔符与hive的分隔符一致
   2)、hive表的存储格式为text
   3)、将数据文件上传到服务器目录/root/flink后导入数据 
   ```

- **将HDFS上的数据文件导入Hive表**

  ```shell
  hive> load data inpath '/data/hive/tmp/tb_area.csv' into test.tb_area;                                     
  备注：
   1)、数据文件为格式文件，数据字段的分隔符与hive的分隔符一致
   2)、hive表的存储格式为text
   3)、将数据文件上传到hdfs目录/data/hive/tmp后导入数据
  ```

- **建表后，从别的表查询出数据插入Hive表**

   ```shell
   hive> CREATE TABLE test.tb_area_1(                
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
       > insert into test.tb_area_1
       > select * from test.tb_area;
   ```

- **建表时从别的表查询出数据**

   ```shell
   hive> create table test.tb_area_1         --通过查询创建表
       > as
       > select *from test.tb_area;
   ```

##  安装kettle

a)、 下载pdi-ce-8.2.0.0-342.zip并解压

b)、 配置环境变量

- 此电脑 --> 右键 --> 属性

<img :src="$withBase('/operation/kettle_001.png')">



- 高级系统设置

<img :src="$withBase('/operation/kettle_002.png')">



- 环境变量

<img :src="$withBase('/operation/kettle_003.png')">



新增变量 PENTAHO_JAVA_HOME= C:\Program Files\Java\jre1.8.0_181 

<img :src="$withBase('/operation/kettle_004.png')">



新增变量 kettle_home = F:\kettle\pdi-ce-8.2.0.0-342\data-integration

<img :src="$withBase('/operation/kettle_005.png')">

c)、 更新mysql连接包

查询mysql数据库的版本。下载对应版本的mysql连接包，如mysql-connector-java-5.1.15-bin.jar。放到pdi-ce-8.2.0.0-342\data-integration\lib目录。



## 定时抽取业务数据到hive表

### 1、编写kettle任务

#### a)、 在kettle目录F:\kettle\pdi-ce-8.2.0.0-342\data-integration下，点击Spoon.bat

<img :src="$withBase('/operation/kettle_006.png')"> 

#### b)、进入kettle主界面

<img :src="$withBase('/operation/kettle_007.png')">  

#### c)、在kettle中新建作业和转换任务，完成后的界面如下

<img :src="$withBase('/operation/kettle_008.png')">

设置所有转换控件

transformation:${Internal.Entry.Current.Directory}/XXX.ktr，其中${Internal.Entry.Current.Directory}为当前目录,XXX为转换的名称

options分页：

勾选等待远程转换执行结束

<img :src="$withBase('/operation/kettle_019.png')"> 

命名参数分页：

勾选复制上一步结果到命名参数 

勾选将所有参数值都传递到子转换

<img :src="$withBase('/operation/kettle_020.png')">

#### d)、设计xf_order_export

业务逻辑：取前一个小时的业务数据

完成后的界面

<img :src="$withBase('/operation/kettle_009.png')">

##### day_key控件：

数据库连接：新建连接mysql数据库的配置

SQL:   select date_format( date_add(now(), interval -1 hour), '%Y%m%d') as day_key    

作用：通过连接mysql数据库，取出前一个小时的时间变量

勾选替换SQL语句里的变量

<img :src="$withBase('/operation/kettle_010.png')">



数据库连接配置

<img :src="$withBase('/operation/kettle_013.png')">



##### 设置变量控件：

业务逻辑：将上一步的时间变量赋值给day_key

<img :src="$withBase('/operation/kettle_011.png')">



##### xf_order控件：

业务逻辑：通过day_key变量，取出上个小时的业务数据

勾选替换SQL语句中的变量

<img :src="$withBase('/operation/kettle_012.png')">



##### xf_order_${day_key}控件：

业务逻辑：将上一步查询出的数据集保存为csv文件

文件分页：设置文件名称、扩展名、结果中添加文件名

<img :src="$withBase('/operation/kettle_014.png')">

内容分页：设置分隔符、封闭符、格式、压缩、编码

<img :src="$withBase('/operation/kettle_015.png')">

##### SSH_xf_order控件：

业务逻辑：调用脚本，将数据文件导入hive表

<img :src="$withBase('/operation/kettle_016.png')">

general分页：设置server name/IP address、server port、timeout、username、password

<img :src="$withBase('/operation/kettle_017.png')">

settings分页：设置commands

```shell
hive --define v_starttime=${day_key}  -f /home/liuguobing/shareshop/sh/sql/xf_order_load.sql > /home/liuguobing/shareshop/sh/log/xf_order_load_${day_key}.log 2>&1  && mv /home/liuguobing/datatest/xf_order_${v_starttime}.csv /home/liuguobing/datatest_bak
```

<img :src="$withBase('/operation/kettle_018.png')">

##### SFTP_xf_order控件：

业务逻辑：将上一步转换生成的数据文件上传到服务器

一般分页：设置SFTP服务器名称/IP、端口、用户名、密码

<img :src="$withBase('/operation/kettle_021.png')">

文件分页：本地目录、通配符(正则表达式)、SFTP上转后、目标文件夹、远程目录

<img :src="$withBase('/operation/kettle_022.png')">

### 2、编写导入hive脚本

在hadoop节点，编写将数据文件导入hive的脚本

```shell
[liuguobing@k8s-master sql]$ pwd
/home/liuguobing/shareshop/sh/sql
[liuguobing@k8s-master sql]$ ls -alt |grep xf_order_load.sql
-rwxrwxrwx 1 liuguobing liuguobing   178 Jul 27  2021 xf_order_load.sql
[liuguobing@k8s-master sql]$ more xf_order_load.sql
load data local inpath "/home/liuguobing/datatest/xf_order_${v_starttime}.csv" overwrite into table alinesno_shareshop.alinesno_shareshop_order partition(day_id=${v_starttime});
[liuguobing@k8s-master sql]$ 
```

### 3、在线定时调度kettle任务

将调试好的作业、转换任务上传到数据融合平台，设置主任务的定时调度策略

a)、上传转换任务

操作路径:数据融合平台-->任务管理-->转换管理

主界面

<img :src="$withBase('/operation/kettle_025.png')">

新增修改框

<img :src="$withBase('/operation/kettle_026.png')">

b)、上传作业任务

操作路径:数据融合平台-->任务管理-->作业管理

主界面

<img :src="$withBase('/operation/kettle_023.png')">

新增修改框

<img :src="$withBase('/operation/kettle_024.png')">

c)、查看定时调度结果

操作路径:数据融合平台-->监控管理-->作业日志

<img :src="$withBase('/operation/kettle_027.png')">

###  4、定时删除历史数据文件

```shell
[root@hadoopmaster flink]# touch deleteHisFile.sh
[root@hadoopmaster flink]# vi deleteHisFile.sh
# !/bin/bash
#删除1天前的数据文件
find  /root/flink/data_bak -name "*.csv" -mtime +1 -exec -ok rm -rf {} \;

~
"deleteHisFile.sh" 3L, 117C written
[root@hadoopmaster flink]# 
[root@hadoopmaster flink]# crontab -e
no crontab for root - using an empty one
#每天的8:5分删除一天前的数据文件
5 8 * * * sh /root/flink/deleteHisFile.sh > /root/flink/deleteHisFile.log
"/tmp/crontab.RgL3Ix" 2L, 121C written
crontab: installing new crontab
[root@hadoopmaster flink]#     
```



