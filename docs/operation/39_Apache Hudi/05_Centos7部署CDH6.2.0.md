# CDH6.2.0 安装

## 本内容你将获得

- 如何在 centos7 服务器上配置 hosts
- 如何在 centos7 服务器上设置 ntp 时钟同步
- 如何在 centos7 服务器上关闭防火墙
- 如何在 centos7 服务器上安装 MySQL
- 如何在 centos7 服务器上安装 JDK
- 如何在 centos7 服务器上安装 CDH
- 如何启动 CDH server 和 agent 节点
- 如何访问 CDH 监控台

## CDH6.2.0 说明

安装 CDH6.2.0 后，可在 CDH 监控台上管理、监控、诊断、集成 hadoop 集群。

管理：对 hadoop 集群进行管理。如添加、删除节点。如启动、停止、重启、配置 HDFS、Hive、Impala、Spark、Sqoop、yarn、ZooKeeper 等服务的操作。

监控：监控 hadoop 集群的健康情况，对设置的各种指标和系统运行情况进行全面监控。

诊断：对 hadoop 集群出现的问题进行诊断，对出现的问题给出建议解决方案。

集成：根据需要安装组件组合，如只安装 HDFS、Hive、yarn、ZooKeeper。

## 1. 下载 CDH 6.2.0

链接：https://pan.baidu.com/s/1g4ZzKot5I9DrWVyrehgDiw提取码：9ew7

包含 cloudera-repos-6.2.0 、mysql-5.7、parcel-6.2.0 ，文件上传指定路径

```
mkdir -p /mnt/install-tools/cdh/
cd /mnt/install-tools/cdh/
```

centos7 准备 、xshell 准备

## 2. 配置

### 2.1 配置 Hosts

登录集群所有机器

执行命令：

```
vi /etc/hosts
```

将集群角色和 IP 写入，类似

```
192.168.153.132 cdh1
192.168.153.133 cdh2
192.168.153.134 cdh3
```

### 2.3 ntp 时钟同步

在所有节点都安装 ntp 服务器

```
yum install -y ntp
```

修改所有节点 ntp 服务配置文件

```
vim /etc/ntp.conf
```

修改内容如下

```
#将下面的四行注释掉
#server 0.centos.pool.ntp.org iburst
#server 1.centos.pool.ntp.org iburst
#server 2.centos.pool.ntp.org iburst
#server 3.centos.pool.ntp.org iburst

#然后新增一条
server ntp.aliyun.com
```

在所有节点启动 ntp 服务

```
service ntpd start
```

添加到开机启动项里面

```
systemctl enable ntpd.service
```

### 2.4 关闭防火墙

登录集群所有机器（配置完这些后一定要重启机器，否则 selinux 还是没有即时生效，到时 web 界面中无法访问到 httpd 指定路径下的资源）

执行命令：

```
# 1. 关闭防火墙服务
systemctl stop firewalld
# 2. 禁止防火墙服务开机自启
systemctl disable firewalld.service
# 3. 清除防火墙策略
iptables -F
```

### 2.5 参数配置

登录集群所有机器

执行命令

```
vi /etc/sysconfig/selinux
```

修改

```
SELINUX=disabled
```

修改 linux swappiness 参数

设置为 0，重启后又还原

```
echo 0 > /proc/sys/vm/swappiness
```

修改配置文件

```
vi /etc/sysctl.conf
```

添加参数

```
vm.swappiness=0
```

上述在 el6 中有效，在 el7 中 tuned 服务会动态调整参数，查找 tuned 配置，直接修改，进入 tuned 目录

```
cd /usr/lib/tuned/
```

查找包含的所在文件路径

```
grep "vm.swappiness" * -R
```

  <img :src="$withBase('/operation/CDH/0.png')">

逐个修改参数为 vm.swappiness=0

提供快捷命令复制

```
vi latency-performance/tuned.conf

vi throughput-performance/tuned.conf

vi virtual-guest/tuned.conf
```

修改后确认，只是查看一下是否改了

```
grep "vm.swappiness" * -R
```

节点禁用透明页

立刻生效

```
echo never > /sys/kernel/mm/transparent_hugepage/defrag
echo never > /sys/kernel/mm/transparent_hugepage/enabled
```

永久生效 在 /etc/rc.local 末尾添加两行

```
vi /etc/rc.local
```

添加内容

```
echo never > /sys/kernel/mm/transparent_hugepage/defrag
echo never > /sys/kernel/mm/transparent_hugepage/enabled
```

给与可执行权限

```
chmod +x /etc/rc.d/rc.local
```

## 3. 安装 MySQL

agent 节点不需要使用到数据库，无需安装，但是需要在 /usr/share/java 下放入数据库驱动。

先卸载自带的数据库

查找并卸载老版本 MySQL

```
rpm -qa | grep mariadb
rpm -e --nodeps mariadb-libs-5.5.68-1.el7.x86_64
find / -name mysql|xargs rm -rf
```

进入资源目录

```
cd /mnt/install-tools/cdh/mysql-5.7
```

解压

```
tar -xvf mysql-5.7.26-1.el7.x86_64.rpm-bundle.tar
```

安装

```
rpm -ivh mysql-community-common-5.7.26-1.el7.x86_64.rpm
rpm -ivh mysql-community-libs-5.7.26-1.el7.x86_64.rpm
rpm -ivh mysql-community-libs-compat-5.7.26-1.el7.x86_64.rpm
rpm -ivh mysql-community-client-5.7.26-1.el7.x86_64.rpm
rpm -ivh mysql-community-server-5.7.26-1.el7.x86_64.rpm
```

先启动才有后续操作

```
service mysqld start
```

查看启动状态

```
service mysqld status
```

查看初始密码（MySQL 启动后才会有默认初始密码）

```
cat /var/log/mysqld.log|grep 'A temporary password'
```

如 iro5kMd2lg!:

登录 MySQL，使用上边初始的密码

```
mysql -uroot -piro5kMd2lg!:
```

设置密码

```
ALTER USER 'root'@'localhost' IDENTIFIED BY 'Cdh6.2.0@centos7';
```

开启数据库远程访问（% 位置也可以指定 IP ）

```
grant all privileges on *.* to 'root'@'%' identified by 'Cdh6.2.0@centos7' with grant option;
```

刷新远程设置

```
flush privileges;
```

创建元数据库和用户

```
create database cmf default charset utf8 collate utf8_general_ci;
grant all on cmf.* to 'cmf'@'%' identified by 'Cdh6.2.0@centos7';

create database amon default charset utf8 collate utf8_general_ci;
grant all on amon.* to 'amonuser'@'%' identified by 'Cdh6.2.0@centos7';

create database cmserver default charset utf8 collate utf8_general_ci;
grant all on cmserver.* to 'cmserveruser'@'%' identified by 'Cdh6.2.0@centos7';

create database hive default charset utf8 collate utf8_general_ci;
grant all on hive.* to 'hiveuser'@'%' identified by 'Cdh6.2.0@centos7';

create database rman default charset utf8 collate utf8_general_ci;
grant all on rman.* to 'rmanuser'@'%' identified by 'Cdh6.2.0@centos7';

create database oozie default charset utf8 collate utf8_general_ci;
grant all on oozie.* to 'oozieuser'@'%' identified by 'Cdh6.2.0@centos7';

create database hue default charset utf8 collate utf8_general_ci;
grant all on hue.* to 'hueuser'@'%' identified by 'Cdh6.2.0@centos7';

flush privileges;
```

查看数据库

```
show databases;
```

退出 MySQL 命令界面

```
quit
```

测试是否可以本地连接

```
mysql --host=192.168.153.132 --port=3306 --user=root --password=Cdh6.2.0@centos7
```

## 4. 安装 JDK

查看原来存在的 JDK

```
rpm -qa | grep java
```

删除自带的 JDK

```
rpm -e --nodeps java-1.8.0-openjdk-headless-1.8.0.262.b10-1.el7.x86_64
```

jdk 文件路径

```
cd /mnt/install-tools/cdh/cloudera-repos-6.2.0/agent
```

安装 jdk，jdk1.8.0_181-cloudera 默认会在 /usr/java 下

```
rpm -ivh oracle-j2sdk1.8-1.8.0+update181-1.x86_64.rpm
```

配置环境变量

```
export JAVA_HOME=/usr/java/jdk1.8.0_181-cloudera
export CLASSPATH=$:CLASSPATH:$JAVA_HOME/lib/
export PATH=$PATH:$JAVA_HOME/bin
```

使生效

```
source /etc/profile
```

查看版本

```
java -version
```

## 5. CDH 安装配置

### 5.1 安装

安装前提依赖（若第一次安装出现 ERROR，请重新运行该命令即可）

```
yum install -y redhat-lsb httpd mod_ssl openssl-devel python-psycopg2 MySQL-python libpq.so bind-utils libxslt cyrus-sasl-plain cyrus-sasl-gssapi fuse fuse-libs
```

分别安装 daemon、server、agent

```
rpm -ivh cloudera-manager-daemons-6.2.0-968826.el7.x86_64.rpm
rpm -ivh cloudera-manager-server-6.2.0-968826.el7.x86_64.rpm
rpm -ivh cloudera-manager-agent-6.2.0-968826.el7.x86_64.rpm
```

修改 /etc/cloudera-scm-agent/config.ini

```
vi /etc/cloudera-scm-agent/config.ini
```

修改内容为

```
server_host=cdh1  # 指向 server
```

修改 cloudera-scm-server/db.properties 文件

```
# 进入编辑
vi /etc/cloudera-scm-server/db.properties
# 修改内容为
com.cloudera.cmf.db.type=mysql
com.cloudera.cmf.db.host=192.168.153.132:3306
com.cloudera.cmf.db.name=cmf
com.cloudera.cmf.db.user=cmf
com.cloudera.cmf.db.password=Cdh6.2.0@centos7
com.cloudera.cmf.db.setupType=EXTERNAL
# 记得注释掉下边的 setupType
# com.cloudera.cmf.db.setupType=INIT
```

### 5.2 部署 parcel 源

安装 httpd 服务

```
systemctl status httpd  # 查看状态
systemctl start httpd  # 启动
systemctl enable httpd.service  #设置 httpd 服务开机自启
```

MySQL 所在节点安装 MySQL 驱动

```
mkdir -p /usr/share/java  # cdh 默认搜索目录

cd /usr/share/java

# 上传 mysql-connector-java-5.1.47.tar.gz 文件

tar -zxvf mysql-connector-java-5.1.47.tar.gz

cd mysql-connector-java-5.1.47

cp mysql-connector-java-5.1.47.jar /usr/share/java

cd /usr/share/java

cp mysql-connector-java-5.1.47.jar mysql-connector-java.jar  # 去掉版本号
```

将 parcel 相关的三个文件拷贝进去

```
mkdir -p /var/www/html/cdh6_parcel
mv CDH-6.2.0-1.cdh6.2.0.p0.967373-el7.parcel /var/www/html/cdh6_parcel
mv CDH-6.2.0-1.cdh6.2.0.p0.967373-el7.parcel.sha /var/www/html/cdh6_parcel
mv manifest.json /var/www/html/cdh6_parcel
```

如果没下载 sha，可以生成 sha1sum CDH-6.2.0-1.cdh6.2.0.p0.967373-el7.parcel | awk '{ print $1 }' > CDH-6.2.0-1.cdh6.2.0.p0.967373-el7.parcel.sha

### 5.3 启动 server 和 agent

```
启动 server
systemctl start cloudera-scm-server
重启 server
systemctl restart cloudera-scm-server
停止 server
systemctl stop cloudera-scm-server
查看日志，出现 mster started 说明启动成功
tail -F /var/log/cloudera-scm-server/cloudera-scm-server.log -n 1000
tail -F /var/log/cloudera-scm-agent/cloudera-scm-agent.log -n 1000
查看状态
systemctl status cloudera-scm-server
从节点启动 agent
systemctl start cloudera-scm-agent
systemctl restart cloudera-scm-agent
停止 agent
systemctl stop cloudera-scm-agent
```

要等到完全启动成功后才能访问 web 页面

<img :src="$withBase('/operation/CDH/1.png')">

查看日志若看到

```
INFO WebServerImpl:com.cloudera.server.cmf.WebServerImpl: Started Jetty server.
```

查看 7180 端口

```
netstat -lnpt | grep 7180
```

和看到 7180 被启用，才说明 CM 启动成功，cloudera-scm-server 启动比较漫长请各位耐心等待。

开放端口

```
/sbin/iptables -I INPUT -p tcp --dport 7180 -j ACCEPT
```

### 5.4 访问监控台

访问地址，只要确保 cloudera-scm-server 启动正常就可以访问 web 页面，初始登录账户密码都是 admin

http://192.168.153.132:7180/cmf/login

<img :src="$withBase('/operation/CDH/login.png')">

点击继续

<img :src="$withBase('/operation/CDH/login1.png')">

选择接受协议，点击继续

<img :src="$withBase('/operation/CDH/login2.png')">

选择免费，点击继续

<img :src="$withBase('/operation/CDH/login3.png')">

进入群集安装，点击继续

<img :src="$withBase('/operation/CDH/login4.png')">

设置集群名称，点击 Continue

<img :src="$withBase('/operation/CDH/login5.png')">

进入 Specify Hosts（只有启动了 server 和其他 agent 才显示，才可以后续操作）

<img :src="$withBase('/operation/CDH/login6.png')">

点击当前管理的主机，显示当前的所有 agent 节点

<img :src="$withBase('/operation/CDH/login7.png')">

选中所有节点，点击继续

<img :src="$withBase('/operation/CDH/login7_0.png')">

出现存储库文件不对应，我们需要设置

<img :src="$withBase('/operation/CDH/login9.png')">

点击更多选项进入这个弹窗页面

<img :src="$withBase('/operation/CDH/login10.png')">

修改为

<img :src="$withBase('/operation/CDH/login11.png')">

注意：

需要测试访问 http://192.168.153.132/cdh6_parcel/ 有没有 CDH-6.2.0-1.cdh6.2.0.p0.967373-el7.parcel 文件

若出现

<img :src="$withBase('/operation/CDH/login12.png')">

说明访问不到 httpd 下 cdh6_parcel/ 下 的目录，这是因为在设置 selinux=disabled 的时候机器没有重启，重启后就访问正常了。

访问成功的结果是

<img :src="$withBase('/operation/CDH/login13.png')">

接下来配置的 parcel 源路径为 http://192.168.153.132/cdh6_parcel/

修改成功后可以看到 CDH-6.2.0-1.cdh6.2.0.p0.967373-el7.parcel

<img :src="$withBase('/operation/CDH/login14.png')">

点击继续，会进入群集安装，等待下载、分配、解压、激活，耐心等待片刻

<img :src="$withBase('/operation/CDH/login15.png')">

等待安装成功后会自动进入

<img :src="$withBase('/operation/CDH/login16.png')">

点击 Inspect Network Performance、Inspect Hosts 会进行性能的检测

<img :src="$withBase('/operation/CDH/login17.png')">

需要耐心等待会有结果

<img :src="$withBase('/operation/CDH/login18.png')">

但是这结果先不要了，选中 I understand the risks, let me continue with cluster creation. 点击继续

添加服务，当然也可以点击群集，选择群集

<img :src="$withBase('/operation/CDH/login19.png')">

点击操作，然后选择添加服务

<img :src="$withBase('/operation/CDH/login20.png')">

选择需要的服务，点击继续

<img :src="$withBase('/operation/CDH/login21.png')">

此处我选择了 zookeeper 服务，点击继续

选择机器，点击确定，点击继续

<img :src="$withBase('/operation/CDH/login22.png')">

进入如图

<img :src="$withBase('/operation/CDH/login23.png')">

点击 Continue，会进行服务的安装等待

<img :src="$withBase('/operation/CDH/login24.png')">

完成后点击继续，有两次继续，进入主页状态，可以看到刚刚安装好的 zookeeper 服务

<img :src="$withBase('/operation/CDH/login25.png')">

### 5.5 配置服务节点访问

配置从节点的 proxy_pass

```
cd /etc/nginx/conf.d
```

修改配置对应节点的 conf 文件

如

```
vim hue.data.console.tmp.linesno.com.conf
```

配置如下 proxy_pass 属性

```
server {
    listen       80 ;
    server_name  hue.data.lbxinhu.linesno.com;

    location / {
        # proxy_pass http://172.17.49.192:8889/ ;   #来自jsp请求交给tomcat处理
        proxy_pass http://k8s-worker-01:8889/ ;
        proxy_redirect off;
        proxy_set_header Host $host;    #后端的Web服务器可以通过X-Forwarded-For获取用户真实IP
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        client_max_body_size 10m;   #允许客户端请求的最大单文件字节数
        client_body_buffer_size 128k; #缓冲区代理缓冲用户端请求的最大字节数
        proxy_connect_timeout 90;   #nginx跟后端服务器连接超时时间(代理连接超时)
        proxy_read_timeout 90;      #连接成功后，后端服务器响应时间(代理接收超时)
        proxy_buffer_size 4k;       #设置代理服务器（nginx）保存用户头信息的缓冲区大小
        proxy_buffers 6 32k;        #proxy_buffers缓冲区，网页平均在32k以下的话，这样设置
        proxy_busy_buffers_size 64k;#高负荷下缓冲大小（proxy_buffers*2）
        proxy_temp_file_write_size 64k; #设定缓存文件夹大小，大于这个值，将从upstream服务器传
    }

}
```

### 5.6 CDH 包含组件对应的版本

#### 5.6.1 CDH 6.2.0 Packaging

| **Component**    | **Component Version** | **Changes Information**                                             |
| ---------------- | --------------------- | ------------------------------------------------------------------- |
| Apache Avro      | 1.8.2                 | [Changes](https://github.com/cloudera/avro/tree/cdh6.2.0)           |
| Apache Flume     | 1.9.0                 | [Changes](https://github.com/cloudera/flume-ng/tree/cdh6.2.0)       |
| Apache Hadoop    | 3.0.0                 | [Changes](https://github.com/cloudera/hadoop-common/tree/cdh6.2.0)  |
| Apache HBase     | 2.1.2                 | [Changes](https://github.com/cloudera/hbase/tree/cdh6.2.0)          |
| HBase Indexer    | 1.5                   | [Changes](https://github.com/cloudera/hbase-indexer/tree/cdh6.2.0)  |
| Apache Hive      | 2.1.1                 | [Changes](https://github.com/cloudera/hive/tree/cdh6.2.0)           |
| Hue              | 4.3.0                 | [Changes](https://github.com/cloudera/hue/tree/cdh6.2.0)            |
| Apache Impala    | 3.2.0                 | [Changes](https://github.com/cloudera/impala/tree/cdh6.2.0)         |
| Apache Kafka     | 2.1.0                 | [Changes](https://github.com/cloudera/kafka/tree/cdh6.2.0)          |
| Kite SDK         | 1.0.0                 |                                                                     |
| Apache Kudu      | 1.9.0                 | [Changes](https://github.com/cloudera/kudu/tree/cdh6.2.0)           |
| Apache Solr      | 7.4.0                 | [Changes](https://github.com/cloudera/lucene-solr/tree/cdh6.2.0)    |
| Apache Oozie     | 5.1.0                 | [Changes](https://github.com/cloudera/oozie/tree/cdh6.2.0)          |
| Apache Parquet   | 1.9.0                 | [Changes](https://github.com/cloudera/parquet-mr/tree/cdh6.2.0)     |
| Parquet-format   | 2.3.1                 | [Changes](https://github.com/cloudera/parquet-format/tree/cdh6.2.0) |
| Apache Pig       | 0.17.0                | [Changes](https://github.com/cloudera/pig/tree/cdh6.2.0)            |
| Apache Sentry    | 2.1.0                 | [Changes](https://github.com/cloudera/sentry/tree/cdh6.2.0)         |
| Apache Spark     | 2.4.0                 | [Changes](https://github.com/cloudera/spark/tree/cdh6.2.0)          |
| Apache Sqoop     | 1.4.7                 | [Changes](https://github.com/cloudera/sqoop/tree/cdh6.2.0)          |
| Apache ZooKeeper | 3.4.5                 | [Changes](https://github.com/cloudera/zookeeper/tree/cdh6.2.0)      |
