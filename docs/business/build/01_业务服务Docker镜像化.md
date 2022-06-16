# 业务服务 Docker 镜像化

## 工程示例

- docker 镜像化工程示例[打开](http://git.linesno.com/alinsno-cloud-platform-rutron/acp-ini-demo)
- docker 镜像化演示应用[打开](http://demo.ui.lbxinhu.linesno.com/) 演示账号密码: suze_test/123456

## 本内容你将获得

- 使用 jib 插件帮后端打镜像
- 使用 dockerfile 帮前端打镜像
- 使用 docker-compose 部署应用

## 使用 jib 插件帮后端打镜像

这里打镜像使用的插件是 jib-maven-plugin
在 pom.xml 文件中台添加如下配置

```shell
      <build>
          <plugins>
             <plugin>
                 <groupId>com.google.cloud.tools</groupId>
                 <artifactId>jib-maven-plugin</artifactId>
                 <version>3.1.4</version>
                 <configuration>
                     <from>
                         <!--  基础镜像，由于中台工程使用的jdk为11版本，这里使用jdk11的基础镜像 -->
                         <image>registry.cn-shenzhen.aliyuncs.com/alinesno-base/openjdk11:11.0.9</image>
                     </from>
                      <打出的镜像的tag设置>
                     <to>
                         <image>
                                 <!--   docker_repostory  为镜像仓库地址 ， docker_registry_name为镜像仓库项目名
                                           project.artifactId为镜像名，这里设置为工程artifactId ，
                                           project.version为镜像版本 ，这里设置为工程版本-->
                                <docker_repostory>/<docker_registry_name>/${project.artifactId}:${project.version}
                         </image>
                         <!--
                         <tags>
                             <tag>{project.version}</tag>   <!-- project.version工程版本号 -->
                             <!-- <tag>latest</tag> -->
                         </tags>
                          -->
                         <auth>
                             <!--在docker-hub或者阿里云上的账号和密码，这里用环境变量方式，方便适配-->
                             <username>${env.REGISTRY_USERNAME}</username>
                             <password>${env.REGISTRY_PASSWORD}</password>
                         </auth>
                     </to>
                     <container>
                          <!--  服务启动配置  -->
                         <jvmFlags>
                             <jvmFlag>-Dfile.encoding=UTF-8</jvmFlag>
                              <!--
                              调整成 -e JAVA_TOOL_OPTIONS="-Xms128m -Xmx512m -Dspring.profiles.active=hub"
                              传递参数,以适应多种环境
                              <jvmFlag>-Xms128m</jvmFlag>
                              <jvmFlag>-Xmx512m</jvmFlag>
                              <jvmFlag>-Dspring.profiles.active=hub</jvmFlag>
                              <jvmFlag>-XX:+UseParNewGC</jvmFlag>
                              <jvmFlag>-XX:+UseConcMarkSweepGC</jvmFlag>
                               -->
                             <jvmFlag>-XX:+DisableExplicitGC</jvmFlag>
                             <jvmFlag>-Xdebug</jvmFlag>
                             <jvmFlag>-Duser.timezone=GMT+08</jvmFlag>
                             <jvmFlag>-Djava.security.egd=file:/dev/./urandom</jvmFlag>

                         </jvmFlags>
                         <!--  校准时间,设置构建镜像的时间  -->
                         <useCurrentTimestamp>true</useCurrentTimestamp>
                     </container>
                      <!-- 允许使用http连接镜像仓库,默认为false,可以设置为true -->
                     <allowInsecureRegistries>false</allowInsecureRegistries>
                 </configuration>
             </plugin>
          </plugins>
      </build>
```

配置好 pom.xml 接下来就可以通过 mvn compile jib:build 打包镜像并发布到镜像仓库，通过 mvn compile jib:dockerBuild 打包镜像到本地, 中台工程已经集成 jib-maven-plugin 组件，要改变镜像仓库地址时可以通过在构建时 -Djib.to.image 来设置

## 使用 dockerfile 帮前端打镜像

在工程 ui 模块下创建 Dockerfile 文件,如下

```shell
 FROM registry.cn-shenzhen.aliyuncs.com/alinesno-base/nginx-alpha:1.1.0     #基础镜像
 WORKDIR /usr/share/nginx/html               # 工作目录

 # 将dist目录下的内容复制到工作目录下，这里要工程先构建到 dist 目录下
 COPY ./dist ./
```

同样在 ui 模块下创建文件 build-docker.sh，如下

```shell
# !/bin/sh

# 镜像参数
 docker_repostory=  <docker_repostory>  #docker_repostory指镜像仓库地址
 docker_registry_name=<docker_registry_name>  #docker_registry_name指镜像仓库项目名
 project_artifactid=<project_artifactid>  #project_artifactid指镜像名
 project_version=<project_version>  #project_version指镜像版本号

 # 构建镜像
 docker build -t ${docker_repostory}/${docker_registry_name}/${project_artifactid}:${project_version} .

 # 发布镜像
 docker push ${docker_repostory}/${docker_registry_name}/${project_artifactid}:${project_version}
```

注意： 代码生成器生成工程[打开](http://alinesno-platform.linesno.com/technique/09_%E5%BC%80%E5%8F%91%E6%8E%A5%E5%85%A5/02_%E7%94%9F%E6%88%90%E4%BB%A3%E7%A0%81.html)已经自动生成相应的 dockerfile 和 build-docker.sh 文件，默认可以直接拿来用

这样，等前端构建好，就可以通过运行 build-docker.sh 构建好前端镜像

使用 docker-compose 部署应用
docker-compose 是一个关联 docker 容器的工具，他通过一个配置文件来管理多个容器，通过 docker-compose 可以对应用进行部署

docker-compose.yaml 脚本配置

```shell
 version: "3"
 services:
     services_name:
        #映射端口
         ports:
             - "38080:8080"
          #副本数量，这里为1
         deploy:
             replicas: 1
         image:   <image_url>   #镜像地址
         #  环境变量配置
         environment:
             - SPRING_APPLICATION_NAME=alinesno-cloud-yyt-shop
             - JAVA_TOOL_OPTIONS=-Xms128m -Xmx512m -Dspring.profiles.active=hub
             - SERVER_PORT=8080                    #应用启动端口
             - REDIS_HOST=127.0.0.1
             - REDIS_PORT=6379
             - REDIS_PASSWORD=<password>   #password:  redis密码
         #数据卷
         volumes:
             - "/etc/localtime:/etc/localtime"
             - "./app/upload-files:/root/alinesno-upload-files"
             - "./app/upload-files:/tmp"
 #容器网络配置，设置网段为172.201.0.0，防止路由冲突
 networks:
     suinet:
         ipam:
             config:
             - subnet: 172.201.0.0/16
```

需要注意，可以通过在 docker-compose 中设置环境变量，然后通过设置环境变量，对配置文件进行配置
如上面示例中的 redis 配置，在配置文件中对应如下配置:

```shell
   redis:
     host: ${REDIS_HOST}
     port: ${REDIS_PORT}
     password: ${REDIS_PASSWORD}
```

这样就可以通过 docker-compose.yaml 对项目进行配置了
就像演示工程中的后端的 docker-compose.yaml

```shell
 version: "3"
 services:
     demo-service:
        #映射端口
         ports:
             - "38080:8080"
          #副本数量，这里为1
         deploy:
             replicas: 1
         image: project_image_url   #镜像地址
         #  环境变量配置
         environment:
             - SPRING_APPLICATION_NAME=SUZE_TEST
             - JAVA_TOOL_OPTIONS= -Xms128m -Xmx512m -Dspring.profiles.active=hub
             - SERVER_PORT=8080                    #应用启动端口
             - REDIS_HOST=ENC(VfKVXnavjlwb42Sfo8oF3H1UB3iJFmgb)
             - REDIS_PORT=ENC(l1gtKPHUtWk83ZflT9xNFQ==)
             - REDIS_PASSWORD=ENC(ZCcv8B6TyhvMHcARsUj+LvpcMiwndFKOMP/qKsLhBC8=)
             - DATASOURCE_URL=ENC(mUOUukYqxfCd/ZnlgE+SIUJuu8+ldqcJRt1Z8CbWJUwaNwqpPB4YQAP/e9vwJyA0QKuQFPEyfO1cu57E0NKbALaOsBZ/e1xj6lt5eF5vqUFZh8Adgyz2+5hDj+lqHJeXAdfPBv2f7XRVJeM2KF1+QFakACU/MJdjfLvpgHRONlPQeGrehxTGQgpjkrveBB77CXmqDYSjEck=)
             - DATASOURCE_USERNAME=ENC(btFx+DeL1C4/DYK8QFXfIntzcXld/ajo)
             - DATASOURCE_PASSWORD=ENC(9C5Pev/FjL94gVbPJfaoxGEi8nkXHsNQ)
         #数据卷
         volumes:
             - "/etc/localtime:/etc/localtime"
             - "./app/upload-files:/root/alinesno-upload-files"
             - "./app/upload-files:/tmp"
 #容器网络配置，设置网段为172.201.0.0，防止路由冲突
 networks:
     servicenet:
         ipam:
             config:
             - subnet: 172.201.0.0/16
```

前端的 docker-compose.yaml

```shell
version: "3"
services:
    demo-ui:
       #映射端口
        ports:
          - "38081:80"
         #副本数量，这里为1
        deploy:
          replicas: 1
        image:   project_image_url   #镜像地址
        #  环境变量配置
        environment:
          - API_BASE_URL=http://demo.service.lbxinhu.linesno.com
          - SERVER_CDN_URL=
          - SERVER_STORAGE_UPLOAD_URL=http://alinesno-saas.admin.dev.rutron.cn/common/storage/upload
          - SERVER_STORAGE_DISPLAY_URL=http://alinesno-storage.admin.dev.rutron.cn/storage/displayImg/
        #数据卷
        volumes:
          - "/etc/localtime:/etc/localtime"
#容器网络配置，设置网段为172.202.0.0，防止路由冲突
networks:
    uinet:
        ipam:
            config:
            - subnet: 172.202.0.0/16
```
