# 如何把 html 文件转换成 jsp 文件

> Ps：在把外部的 html 文件 copy 到项目中之后（直接 copy 之后 paste 到 webapp 这个包下面），要实现前后端的交互，要把 html 文件转换成 jsp 页面；

- 要在文件的开头引用下面这段语句：

```jsp
	<%@ page language=*"java"* contentType=*"text/html; charset=UTF-8"* pageEncoding=*"UTF-8"*%>
	<%@ page import=*"java.io.\*,java.util.** *%>*
```

- 该 jsp 文件要调用的类所处的包要加到上面这段语句当中：

  <p class="show-images"><img src="/firstlearn/dubbo/112.png" width="%60"></p>

- 选中要转化的文件，点击 F2，就可以改名，把.html 后缀改成.jsp 后缀。

<p class="show-images"><img src="/firstlearn/dubbo/113.png" width="%60"></p>

> Ps：WEB-INF 下面的 web.xml 文件中可以默认每次打开链接不用加具体的页面，比如：http://localhost:8083就可以直接进入到index.jsp页面，而不需要打http://localhost:8083/index.jsp

<p class="show-images">
<img src="/firstlearn/dubbo/114.png" width="%60">
<img src="/firstlearn/dubbo/115.png" width="%60"></p>

### 后端的执行结果如何显示到前端？

- 在 jsp 文件中，把后台的执行语句 copy 之后放到 jsp 文件中，但是要放到<% %>中。

> Ps：输出语句略有不同：out.println();不同于 java 文件中的 system.out.printin();

<p class="show-images"><img src="/firstlearn/dubbo/116.png" width="%60"></p>
