# 内置 tomcat 的安装应用的启动

- 在 pom 文件的结尾，加上 tomcat 的配置语句；

```xml
	<build>
		<plugins>

			<!-- tomcat7 -->
			<plugin>
				<groupId>org.apache.tomcat.maven</groupId>
				<artifactId>tomcat7-maven-plugin</artifactId>
				<version>2.2</version>
				<configuration>
					<useBodyEncodingForURI>true</useBodyEncodingForURI>
					<port>8082</port>
					<path>/</path>
				</configuration>
			</plugin>

		</plugins>
	</build>
```

- 在 src-main 文件夹下，创建 webapp-WEB-INF 文件夹，并且在 webapp 下创建 index.html，在 WEB-INF 下创建 web.xml。

web.xml 下的创建语句：

```xml
	<?xml version="1.0" encoding="UTF-8"?>
	<web-app xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://java.sun.com/xml/ns/javaee" xmlns:web="http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd" xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd" id="WebApp_ID" version="2.5">

	  <display-name>db</display-name>

	  <welcome-file-list>
	    <welcome-file>index.html</welcome-file>
	  </welcome-file-list>

	</web-app>
```

> Ps：（1）创建成功后 tomcat 的插件会自动加载。（2）创建文件夹和 xml、html 文件是名字不要输错。

#### 要将 pom 中的 packaging 改成 war。

<p class="show-images"><img src="/firstlearn/dubbo/111.png" width="%60"></p>

#### web 的启动

右击项目，现在 run as-maven build。启用语句：tomcat7：run

> Ps：tomcat 是哪个版本就写哪个版本。

#### 验证

打开浏览器：输入：http://localhost:端口。
