# 建表使用 jdbc 对表进行增删查改

### 数据库建表语句

打开 mysql 编辑窗口，使用查看和建表语句操作数据库建表：（第一个表，建立一个学生表，添加了个人 id 和姓名列）

```sql
show databases ;
use test ;
create table person(id int(11), name varchar(12)) ;
show tables ;
```

### 如何使用程序对数据表进行增删查改？

##### 初始化目录

在项目中创建下面四个目录：src/main/java src/main/resources src/test/java src/test/resources。
创建步骤：右击下面 src 文件夹，点击 new，选择 folder，录入创建名即可。（一个一个创建）

`注：主程序一般放在src/main/java这一层下面，单位测试的程序一般放在src/test/java这一层下面`

<p class="show-images"><img src="/firstlearn/dubbo/101.png" width="60%" /></p>

##### 建立数据库连接

建立连接数据库的 java 文件，取名：DatabaseUtils.java。再建立一个包，取名：com.learning.helloworld，
把创建好的 java 文件放到这个包里面（如果项目比较大的话，便于管理）

<p class="show-images"><img src="/firstlearn/dubbo/102.png" width="60%" /></p>

##### 创建 java 操作

打开 java 文件，开始编写连接程序；

```html
（参考链接：https://www.cnblogs.com/wuyuegb2312/p/3872607.html#tittle35）
```

- 首先引入相关的包；

  <p class="show-images"><img src="/firstlearn/dubbo/103.png" width="60%" /></p>

- 获取连接，修改 driver 里的数据库（修改成本地安装的数据库），修改数据库链接（改成自己本地的库和表），修改用户名和密码。

  <p class="show-images"><img src="/firstlearn/dubbo/104.png" width="60%" /></p>

- 创建 insert 方法（select、update、delete 方法类似）
  PreparedStatement 的用法：

  ```html
  http://www.cnblogs.com/raymond19840709/archive/2008/05/12/1192948.html
  ```

- 数据库执行之后一定要记得关闭，语句如下面截图：
  <p class="show-images"><img src="/firstlearn/dubbo/105.png" width="60%" /></p>

* 增删查改的方法写好之后，创建 main 方法执行：
  <p class="show-images"><img src="/firstlearn/dubbo/106.png" width="60%" /></p>

Java 程序写好之后，执行语句，后台就会输出结果。（如何查看执行的错误？）

<p class="show-images"><img src="/firstlearn/dubbo/107.png" width="60%" /></p>
