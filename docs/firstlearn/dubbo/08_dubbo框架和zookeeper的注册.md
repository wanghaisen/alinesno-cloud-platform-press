# dubbo 框架和 zookeeper 的注册

- 参考资料：dubbo 官网：<http://dubbo.apache.org/zh-cn/>
- dubbo 学习网址：<https://github.com/apache/incubator-dubbo>

### 项目的搭建和运行

项目搭起来之后，运行 application 文件（先运行 provider 项目，再运行 consumer 项目）；

<p class="show-images"><img src="/firstlearn/dubbo/120.png" width="%60"></p>

### Zookeeper 安装和注册：

- 进入安装包的 conf 文件中，复制 zoo_sample.cfg 文件，粘贴到同个文件夹里，重命名为 zoo.cfg

<p class="show-images"><img src="/firstlearn/dubbo/121.png" width="%60"></p>

- 打开并目录，双击：zkServer.cmd，打开执行命令的窗口，

<p class="show-images"><img src="/firstlearn/dubbo/122.png" width="%60"></p>

执行 dubbo-admin-0.1.jar 包：在执行窗口通过命令进入到 jar 包在本地的存放位置，运行执行命令：java -jar dubbo-admin-xxxx；

<p class="show-images"><img src="/firstlearn/dubbo/123.png" width="%60"></p>

- 执行成功之后，查看 tomcat 的端口，在浏览器中输入：http://localhost：XXXX回车，即可进入dubbo应用的首页。

<p class="show-images"><img src="/firstlearn/dubbo/124.png" width="%60"></p>

<p class="show-images"><img src="/firstlearn/dubbo/125.png" width="%60"></p>

### 如何在 zk 上注册服务？

- 在 application 文件中录入 zk 注册的代码：

<p class="show-images"><img src="/firstlearn/dubbo/126.png" width="%60"></p>

- 执行该 application，执行成功之后，这个服务就会显示在 zookeeper 上面

<p class="show-images"><img src="/firstlearn/dubbo/127.png" width="%60"></p>

- 如果有消费者调用上面这个提供者的服务，可是通过查看该提供者的详情查看

<p class="show-images"><img src="/firstlearn/dubbo/128.png" width="%60"></p>

<p class="show-images"><img src="/firstlearn/dubbo/129.png" width="%60"></p>
