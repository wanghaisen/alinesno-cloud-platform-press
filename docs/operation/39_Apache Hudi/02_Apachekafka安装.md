# kafka 安装

## 本内容你将获得

- 如何在 centos7 服务器上安装 kafka

## kafka 安装

登录官网https://kafka.apache.org/

下载 kafka_2.12-3.2.0.tgz 并上传至 Linux 服务器/root/flink 目录。

1、解压

```bash
cd /root/flink
tar -zxvf kafka_2.12-3.2.0.tgz
```

2、修改配置文件 server.properties

```bash
cd /root/flink/kafka_2.12-3.2.0/config
vi server.properties
# 修改以下内容为147，要求kafka集群中唯一
broker.id=147

# 修改以下内容为PLAINTEXT://192.168.17.147:9092
listeners=PLAINTEXT://192.168.17.147:9092

# 修改以下内容为192.168.17.147:2181，复用CDH6.2.0的zookeeper
zookeeper.connect=192.168.17.147:2181
```

3、复制 kafka_2.12-3.2.0.tgz 到 kafka 集群的其他服务器，按照第 2 点修改配置文件 server.properties
