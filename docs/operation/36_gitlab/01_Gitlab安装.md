# Gitlab 安装

## 软件安装

### 上传rpm文件至 Linux 服务器`/home/alinesno/soft/`目录

> 此处用户可以使用 xftp 或者 xshell 等工具，书要简言

### 安装配置

#### 运行环境配置

```bash
yum install -y curl policycoreutils-python openssh-server perl  // 安装依赖

// 开启sshd服务
systemctl enable sshd
systemctl start sshd

// 防火墙配置
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
systemctl reload firewalld
```

#### 安装gitlab

```bash
安装
rpm -ivh  gitlab-ce-15.3.3-ce.0.el7.x86_64.rpm

查看gitlab状态
rpm -qi $(rpm -qa | grep gitlab)
```

#### 配置及启动

```bash
配置端口及外部地址
vi /etc/gialab/gitlab.rb

设置web端口
添加  nginx['listen_port'] = 58801  // 或找到  nginx['listen_port'] 行

设置外部地址
修改  external_url 'http://gitlab.example.com' 为 external_url 'http://yourIp:58801'  // 配置反向代理及域名的话根据实际情况配置

配置生效
gitlab-ctl reconfigure

执行完后gitlab已经启动
```

#### 常用命令
```bash
# 启动
gitlab-ctl start

# 停止
gitlab-ctl stop

# 查看各服务状态
gitlab-ctl status

# 启停单一服务
gitlab-ctl start 服务名  // 启动
gitlab-ctl stop 服务名  // 停止

# 查看运行日志
gitlab-ctl tail (服务)   // 例如 gitlab-ctl tail nginx

```

#### 登录
```bash
获取管理员初始密码
cat  /etc/gitlab/initial_root_password

获取密码后用 root/密码 登录

```

<img src="/operation/gitlab/01_gitlab.png" width="70%">

<img src="/operation/gitlab/02_gitlab.png" width="70%">

## 其它

- 无
