# OpenId 集成认证

## 概述

openId 与 oauth2 整合，集成在放在 token 当中，解析 token 获取到用户信息

## 解析代码

解析 openId，获取用户信息，此在 accessToken 里面获取，解析如下:

```java
/**
 * 从令牌中获取数据声明
 *
 * @param token 令牌
 * @return 数据声明
 */
public Claims parseToken(String token) throws Exception {
    String key = tokenProperties.getSecret();
    try {
        return Jwts.parser().setSigningKey(key.getBytes()).parseClaimsJws(token).getBody();
    } catch (Exception e) {
        log.error("密钥异常:{}" , e) ;
        throw new Exception("登陆密钥已过期");
    }
}
```

## 其它

- 无
