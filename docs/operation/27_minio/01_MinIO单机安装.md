# MinIO 单点安装

## 概述

Minio 是 Apache License v2.0 下发布的对象存储服务器。它与 Amazon S3 云存储服务兼容。
它最适合存储非结构化数据，如照片，视频，日志文件，备份和容器/ VM 映像。对象的大小可以从几 KB 到最大 5TB
Minio 服务器足够轻，可以与应用程序堆栈捆绑在一起，类似于 NodeJS，Redis 和 MySQL。

## Docker快速体验

以下快速体验只为开发过程临时使用，数据未做安全配置

```shell
docker run -p 9001:9001 -p 9999:9999 --name minio \
	-d --restart=always \
	-e MINIO_ACCESS_KEY=minio \
	-e MINIO_SECRET_KEY=Admin123! \
	-v /opt/minio/data:/data \
	-v /opt/minio/config:/root/.minio \
	registry.cn-shenzhen.aliyuncs.com/alinesno-base/minio:latest server /data \
	--console-address ":9001" --address ":9999"
```

以上配置，数据库的数据映射到本地`/opt/minio/data`目录下，查看运行状态
```shell
ps -ef | grep minio
```

安装完成访问账号密码为：
```shell
地址：http://xxxx:9001
账号：minio
密码：Admin123!
```

## 软件安装

1. 官网提供了比较好的环境，此处直接使用官网文档

```shell
cd /opt/
wget https://dl.min.io/server/minio/release/linux-amd64/minio
chmod +x minio
./minio server /mnt/data
```

2. 启动之后，会出现密码和访问链接，如下

```shell
Endpoint: http://127.0.0.1:9000 http://255.255.255.0:9000 http://127.0.0.1:9000
AccessKey: XXXXX  // 记住
SecretKey: XXXX  // 记住
```

3. 访问云存储路径`http://127.0.0.1:9000`，即可
