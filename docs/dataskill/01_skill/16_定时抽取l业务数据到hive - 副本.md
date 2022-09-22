# 定时抽取业务数据到hive

## 本内容你将获得

- 开发任务抽取mysql业务数据到hive表
- 在线调度抽取任务

## 开发抽取任务

### 1、进入开发工具

#### a)、 在kettle目录pdi-ce-8.2.0.0-342\data-integration下，点击Spoon.bat

#### b)、进入开发主界面

#### c)、在开发工具中新建作业和转换任务，完成后的界面如下

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

## 调度抽取任务

### 在线定时调度抽取任务

将调试好的作业、转换任务上传到数据融合平台，设置主任务的定时调度策略

a)、上传转换任务

操作路径:数据融合平台-->任务管理-->转换管理

主界面

<img :src="$withBase('/operation/kettle_025.png')">

上传转换任务时，主要设置如下信息

任务分类：管理转换的任务分类，如项目名称

调度策略：如转换为作业的子转换，设置为任务暂停，由作业进行调度

日志级别：行级日志(非常详细)，便于定位问题

转换描述：

<img :src="$withBase('/operation/kettle_026.png')">

b)、上传作业任务

操作路径:数据融合平台-->任务管理-->作业管理

主界面

<img :src="$withBase('/operation/kettle_023.png')">

上传作业任务时，主要设置如下信息

任务分类：管理作业的任务分类，如项目名称

调度策略：定时调度的时间策略

日志级别：行级日志(非常详细)，便于定位问题

转换描述：

<img :src="$withBase('/operation/kettle_024.png')">

c)、查看定时调度结果

操作路径:数据融合平台-->监控管理-->作业日志

<img :src="$withBase('/operation/kettle_027.png')">



