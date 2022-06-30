# JWT认证集成

## 示例工程

系统应用集成示例工程[打开](https://gitee.com/alinesno-cloud/alinesno-demo-gateway-open/tree/master/demo-business-shop)

## 本内容你将获得

- 平台代码生成的默认 JWT 方式
- 前后端接口的集成认证方式
- 接口路径白名单的配置

## 配置集成教程

### 工程集成

jwt 集成使用的是 Spring Security 生成方式，与`authority`资源引擎进行的交互获取用户相关信息，工程添加依赖:

> 此工程建议在 gateway 工程里面添加

```xml
<dependency>
  <groupId>com.alinesno.cloud.common.web</groupId>
  <artifactId>alinesno-cloud-common-web-api-starter</artifactId>
  <version>${alinesno.cloud.version}</version>
</dependency>
```

启动类添加注解，如下:

```java
@EnableApi // 权限认证注解
@EnableAutoConfiguration
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

}
```

如单独的微服务工程，可不用集成 jwt 认证。

### 白名单配置

在 yaml 配置文件中，添加白名单配置，如下

```yaml
alinesno:
  anons:
    - /public/**
    - /common/mypath/**
```

## 其它

- 无
