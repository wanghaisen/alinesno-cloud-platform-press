# hadoop安装

## 本内容你将获得

- 如何在 centos7 服务器上安装 hadoop

##  依赖的环境

| 软件名称 | 版本号    |
| -------- | --------- |
| JDK      | 1.8.0_333 |

## 经验教训

  1、以 hadoop用户安装hadoop后，可正常运行。在调试flinksql获取kafka数据时，一直报org.apache.flink.shaded.jackson2.com.fasterxml.jackson.core.JsonParseException: Unexpected character ('<' (code 60)): expected a valid value (JSON String, Number, Array, Object or token 'null', 'true' or 'false')。最终通过root用户部署hadoop、flink解决。

 2、以jdk11安装hadoop后，hdfs和yarn可正常运行，但部署hive时，无法启动。最终安装jdk8解决。

## 部署

1、打开hadoop官网,下载最新版本3.3.4并上传到服务器

  [hadoop-3.3.4.tar.gz](https://dlcdn.apache.org/hadoop/common/hadoop-3.3.4/hadoop-3.3.4.tar.gz)

2、上传jdk8到服务器。安装后配置环境变量

```shell
--解压JDK包
[root@hadoopmaster tools]#tar jdk-8u333-linux-x64.tar.gz
[root@hadoopmaster tools]#cd  jdk1.8.0_333
    
--设置JAVA_HOME    
vi /etc/profile
    
#java
export JAVA_HOME=/root/tools/jdk1.8.0_333
export JRE_HOME=$JAVA_HOME/jre
export PATH=$PATH:$JAVA_HOME/bin
export CLASSPATH=.:$JAVA_HOME/jre/lib:$JAVA_HOME/lib:$JAVA_HOME/lib/tools.jar
  
```

source /etc/profile  使环境配置生效

3、设置免密登录

```shell
[root@hadoopmaster ~]# ssh-keygen -t rsa
Generating public/private rsa key pair.
Enter file in which to save the key (/root/.ssh/id_rsa): 
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /root/.ssh/id_rsa.
Your public key has been saved in /root/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:TE38O5hS4GDvLMODQiZE8ia9RRcsvu2oGmaib3dlkxI root@hadoopmaster
The key's randomart image is:
+---[RSA 2048]----+
|o.  ..o. ..      |
|.+ ...+ .o.      |
|o +..o +....     |
|.ooo. Eoo . .    |
| +.  = +So o .   |
|  . o B O o o    |
|oo . o B o   .   |
|=.. o o          |
|o+oo .           |
+----[SHA256]-----+
[root@hadoopmaster ~]# 

[root@hadoopmaster ~]# ssh-copy-id -i root@localhost
/bin/ssh-copy-id: INFO: Source of key(s) to be installed: "/root/.ssh/id_rsa.pub"
The authenticity of host 'localhost (127.0.0.1)' can't be established.
ECDSA key fingerprint is SHA256:eYn30+9r1BeS+/iB5vVez5HRufAqv9PaMrfFuExfKWE.
ECDSA key fingerprint is MD5:e8:43:ae:31:21:91:fa:25:bd:79:f6:7d:74:d7:3b:b2.
Are you sure you want to continue connecting (yes/no)? yes
/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed
/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys
root@localhost's password: 

Number of key(s) added: 1

Now try logging into the machine, with:   "ssh 'root@localhost'"
and check to make sure that only the key(s) you wanted were added.

[root@hadoopmaster ~]# 
```

4、设置hostname,删除原来设置的localhost.localdomain 

```shell
[root@hadoopmaster ~]# cd /etc
[root@hadoopmaster etc]# cp hostname hostname_20220914bak
[root@hadoopmaster etc]# vi hostname
hadoopmaster

:wq! 保存后reboot服务器使设置的主机名生效
```

5、设置hosts

```shell
[root@hadoopmaster etc]# ls -alt |grep host
-rw-r--r--   1 root root       13 Sep 14 14:40 hostname
-rw-r--r--   1 root root       24 Sep 14 14:39 hostname_20220914bak
-rw-r--r--   1 root root      212 Sep 14 13:45 hosts
-rw-r--r--.  1 root root        9 Jun  7  2013 host.conf
-rw-r--r--.  1 root root      370 Jun  7  2013 hosts.allow
-rw-r--r--.  1 root root      460 Jun  7  2013 hosts.deny
[root@hadoopmaster etc]# cp hosts hosts_20220914bak
[root@hadoopmaster etc]# vi hosts
::1     localhost       localhost.localdomain   localhost6      localhost6.localdomain6
127.0.0.1       localhost       localhost.localdomain   localhost4      localhost4.localdomain4

172.17.49.195   iZwz9a7sd2zy3h5ytmvwp2Z hadoopmaster

:wq! 保存


[root@hadoopmaster tools]# ping hadoopmaster
PING iZwz9a7sd2zy3h5ytmvwp2Z (172.17.49.195) 56(84) bytes of data.
64 bytes from iZwz9a7sd2zy3h5ytmvwp2Z (172.17.49.195): icmp_seq=1 ttl=64 time=0.013 ms
64 bytes from iZwz9a7sd2zy3h5ytmvwp2Z (172.17.49.195): icmp_seq=2 ttl=64 time=0.022 ms
64 bytes from iZwz9a7sd2zy3h5ytmvwp2Z (172.17.49.195): icmp_seq=3 ttl=64 time=0.021 ms
^C
--- iZwz9a7sd2zy3h5ytmvwp2Z ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 1999ms
rtt min/avg/max/mdev = 0.013/0.018/0.022/0.006 ms
[root@hadoopmaster tools]# 

```

6、解压hadoop安装包

```shell
[root@hadoopmaster tools]# cd /root/tools
[root@hadoopmaster tools]# tar -zxvf hadoop-3.3.4.tar.gz
tar -xvzf hadoop-3.3.4.tar.gz  
```

7、配置环境变量

```shell
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

8、修改core-site.xml,在\<configuration>中增加如下\<property>

```shell
[root@hadoopmaster hadoop]# cd /root/tools/hadoop-3.3.4/etc/hadoop
[root@hadoopmaster hadoop]# cp core-site.xml core-site.xml_20220914bak
[root@hadoopmaster hadoop]# vi core-site.xml
<configuration>
    <property>
    <name>fs.default.name</name>
    <value>hdfs://172.17.49.195:9000</value>
    </property>
    <property>
        <name>hadoop.proxyuser.root.groups</name>
        <value>*</value>
        <description>Allow the superuser oozie to impersonate any members of the group group1 and group2</description>
    </property>
    <property>
        <name>hadoop.proxyuser.root.hosts</name>
        <value>*</value>
        <description>The superuser can connect only from host1 and host2 to impersonate a user</description>
    </property> 
</configuration>
~
 
```

9、修改 hdfs-site.xml,在\<configuration>中增加如下\<property>

```shell
[root@hadoopmaster hadoop]# cd /root/tools/hadoop-3.3.4/etc/hadoop
[root@hadoopmaster hadoop]# cp hdfs-site.xml hdfs-site.xml_20220914bak
[root@hadoopmaster hadoop]# vi hdfs-site.xml

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

```shell
[root@hadoopmaster hadoop]# mkdir -p /root/hadoop_store/hdfs/namenode2
[root@hadoopmaster hadoop]# mkdir -p /root/hadoop_store/hdfs/datanode2
[root@hadoopmaster hadoop]# 
```

10、修改mapred-site.xml,在\<configuration>中增加如下\<property>

```shell
[root@hadoopmaster hadoop]# cd /root/tools/hadoop-3.3.4/etc/hadoop
[root@hadoopmaster hadoop]# cp mapred-site.xml mapred-site.xml_20220914bak
[root@hadoopmaster hadoop]# vi mapred-site.xml
    <property>
			<name>mapreduce.framework.name</name>
			<value>yarn</value>
	</property>
	<property>
			<name>mapreduce.job.tracker</name>
			<value>hdfs://172.17.49.195:8001</value>
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
	   <value>172.17.49.195:10020</value>
	</property>
	
	<property>
	   <name>mapreduce.jobhistory.webapp.address</name>
	   <value>172.17.49.195:19888</value>
	</property>

```

11、修改yarn-site.xml,在\<configuration>中增加如下\<property>

```shell
[root@hadoopmaster hadoop]# cd /root/tools/hadoop-3.3.4/etc/hadoop
[root@hadoopmaster hadoop]# cp yarn-site.xml yarn-site.xml_20220914bak
[root@hadoopmaster hadoop]# vi yarn-site.xml

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
		<value>172.17.49.195:8025</value>
	</property>
	<property>
		<name>yarn.resourcemanager.scheduler.address</name>
		<value>172.17.49.195:8030</value>
	</property>
	<property>
		<name>yarn.resourcemanager.address</name>
		<value>172.17.49.195:8050</value>
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
		<value>172.17.49.195</value>
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
	  <value>http://172.17.49.195:19888/jobhistory/logs/</value>
	</property>

```

12、修改hadoop-env.sh

```shell
[root@hadoopmaster hadoop]# cd /root/tools/hadoop-3.3.4/etc/hadoop
[root@hadoopmaster hadoop]# cp hadoop-env.sh hadoop-env.sh_20220914bak
[root@hadoopmaster hadoop]# vi hadoop-env.sh

#  JAVA_HOME=/usr/java/testing hdfs dfs -ls  #在这行后增加如下配置 
export JAVA_HOME=/root/tools/jdk1.8.0_333

# export HADOOP_HEAPSIZE_MAX=                 #在这行后增加如下配置 
#<!--  设置hadoop heap 大小-->
export HADOOP_HEAPSIZE=6000
```

13、修改yarn-env.sh

```shell
[root@hadoopmaster hadoop]# cd /root/tools/hadoop-3.3.4/etc/hadoop
[root@hadoopmaster hadoop]# cp yarn-env.sh yarn-env.sh_20220914bak
[root@hadoopmaster hadoop]# vi yarn-env.sh

YARN_HEAPSIZE=6000  #在文件最后增加这个配置
```

14、在nameNode服务器上进行格式化

```shell
[root@hadoopmaster hadoop]# hdfs namenode -format     #日志中出现如下提示，说明格式化成功
2022-09-14 16:00:06,267 INFO common.Storage: Storage directory /root/hadoop_store/hdfs/namenode2 has been successfully formatted
```

15、启停hadoop

```shell
[root@hadoopmaster bin]# cd /root/tools/hadoop-3.3.4/sbin
[root@hadoopmaster sbin]# ./start-all.sh
Starting namenodes on [hadoopmaster]
Last login: Wed Sep 14 14:56:27 CST 2022 from 171.107.6.211 on pts/3
hadoopmaster: Warning: Permanently added 'hadoopmaster,172.17.49.195' (ECDSA) to the list of known hosts.
Starting datanodes
Last login: Wed Sep 14 16:07:22 CST 2022 on pts/2
Starting secondary namenodes [hadoopmaster]
Last login: Wed Sep 14 16:07:24 CST 2022 on pts/2
Starting resourcemanager
Last login: Wed Sep 14 16:07:28 CST 2022 on pts/2
Starting nodemanagers
Last login: Wed Sep 14 16:07:32 CST 2022 on pts/2
[root@hadoopmaster sbin]# jps
12480 DataNode
12722 SecondaryNameNode
13123 NodeManager
12339 NameNode
12980 ResourceManager
13455 Jps
[root@hadoopmaster sbin]# ./mr-jobhistory-daemon.sh start historyserver
WARNING: Use of this script to start the MR JobHistory daemon is deprecated.
WARNING: Attempting to execute replacement "mapred --daemon start" instead.
[root@hadoopmaster sbin]# jps
12480 DataNode
12722 SecondaryNameNode
13123 NodeManager
12339 NameNode
13588 Jps
12980 ResourceManager
13527 JobHistoryServer
[root@hadoopmaster sbin]# 

./start-all.sh   --启动hadoop服务
./stop-all.sh    --停止hadoop服务
./mr-jobhistory-daemon.sh start historyserver  --启动yarn日志功能
./mr-jobhistory-daemon.sh stop historyserver   --停止yarn日志功能
```

16、开放防火墙端口

如服务器开启防火墙，需要开放hadoop的前端端口

```shell
--查看防火墙状态
systemctl status firewalld.service
firewall-cmd --state

--临时关闭防火墙
systemctl stop  firewalld.service

--启动防火墙
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

hadoop前端： http://172.17.49.195:50070

yarn前端：   http://172.17.49.195:8088

yarn历史前端：http://172.17.49.195:19888

```

