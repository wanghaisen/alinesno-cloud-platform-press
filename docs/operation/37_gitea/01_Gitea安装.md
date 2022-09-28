# Gitea 安装

## 软件安装

### 获取gitea

```bash
下载文件
mkdir -p /home/alinesno/soft/gitea && wget -O /home/alinesno/soft/gitea/gitea https://dl.gitea.io/gitea/1.17.1/gitea-1.17.1-linux-amd64 --no-check-certificate

添加目录及添加执行权限
mkdir -p /home/alinesno/soft/{data,log} && chmod +x /home/alinesno/soft/gitea -R

修改文件用户及组
chown git:git /home/alinesno/soft/gitea -R

```

### 配置gitea并启动
编辑服务gitea服务文件

```bash
vim /etc/systemd/system/gitea.service
```
添加如下内容
```shell
[Unit]
Description=Gitea (Git with a cup of tea)
After=syslog.target
After=network.target

[Service]
RestartSec=2s
Type=simple
User=git
Group=git
WorkingDirectory=/home/alinesno/soft/gitea/
ExecStart=/home/alinesno/soft/gitea/gitea web --config /etc/gitea/app.ini
Restart=always
Environment=USER=git HOME=/home/git GITEA_WORK_DIR=/home/alinesno/soft/gitea

[Install]
WantedBy=multi-user.target
```
激活 gitea 并将它作为系统自启动服务
```bash
systemctl enable gitea
systemctl start gitea
```
访问 ip:3000 进入配置页面,按要求进行配置

<img src="/operation/gitea/01_gitea.png" width="70%">

配置完毕,等会儿会进入登录页，这时进行注册，第一个注册的用户会自动成为管理员
<img src="/operation/gitea/02_gitea.png" width="70%">
<img src="/operation/gitea/03_gitea.png" width="70%">

## 其它

- 无


