# SwaggerUI 文档

## 本内容你将获得

- SwaggerUI 的配置
- Swagger 与网关的集成

## SwaggerUI 在平台中的集成

平台集成的初始版本的 swagger-ui，场景使用于 api 文档而非 api 调试，调试建议使用其它第三方工具，
比如 yapi、postman 等，以确保安全性

### 开启 swagger 配置

默认是全局支持 swagger 配置，由手工添加和开启，在`yaml`中添加配置如下:

```yaml
alinesno:
  swagger:
    author: WeiXiaoJin
    enabled: true
    desc: 文档名称
    title: 文档描述
    version: 2.1.2-RC
    scan-package: com.alinesno.cloud.base.demo.gateway
    # scan-package: package1;package2 扫描多个包，以英文;号进行分隔
```

注意事项：

- 对外公网环境不建议开启或者需要加安全策略[策略待补充]
- 默认会扫描公共的前端包，即`alinesno-cloud-common-web-*`模块下的前端包
- 开启 swagger 对启动速度有影响

访问地址:
```shell
// 将8080端口改成后端应用的端口
http://localhost:8080/swagger-ui.html
```

### swagger-api 与网关的关系

网关同步的接口是通过 swagger-api 接口进行同步，相应的接口开关与否通过网关平台进行管理的，
同时与开放平台整合的

## 其它

- 后期新版本 swagger 注解通过代码生成器可选择性的生成，同步列入到升级计划中
