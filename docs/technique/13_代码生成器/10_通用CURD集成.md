# 通用前端接口

## 示例工程

系统应用集成示例工程[打开](https://gitee.com/alinesno-cloud/alinesno-demo-gateway-open/tree/master/demo-business-shop)

## 本内容你将获得

- 平台代码生成的默认 CURD 集成
- 平台前端提供的默认 rest 接口
- 与前端界面默认集成的接口
- rest 接口默认提供的传递对象

## 通用的前端接口工程说明

### 后台的 CURD 通用方法

此处为前端工程默认的方法，如下：

```java
@ApiOperation("查询状态正常列表")
@GetMapping("findAllHasStatus")
protected AjaxResult findAllHasStatus() ;

@ApiOperation("查询所有列表")
@GetMapping("findAll")
protected AjaxResult findAll(FEIGN feign, String applicationId)  ;

@ApiOperation("保存实体")
@PostMapping("save")
public AjaxResult save(Model model, @RequestBody Entity entity) throws Exception ;

@ApiOperation("通过id列表查询")
@PostMapping("findIds")
public AjaxResult findIds(@RequestBody List<String> list)  ;

@ApiOperation("通过id删除")
@DeleteMapping("delete/{ids}")
public AjaxResult delete(@PathVariable String ids) ;

@ApiOperation("通过id获取实体")
@GetMapping("detail/{id}")
public AjaxResult detail(@PathVariable String id) ;

@ApiOperation("更新实体")
@PutMapping("modify")
public AjaxResult update(Model model, @RequestBody Entity Entity) throws Exception ;

@ApiOperation("通过id查询实体")
@GetMapping("findOne")
public AjaxResult findOne(String id) ;

@ApiOperation("实体数量统计")
@GetMapping("count")
public AjaxResult count() ;

@ApiOperation("通过id删除实体")
@GetMapping("deleteById")
public AjaxResult deleteById(String id) ;

@ApiOperation("修改实体状态")
@ResponseBody
@PutMapping("changeStatus")
public AjaxResult changeStatus(@RequestBody HasStatusVo status) ;

@ApiOperation("修改某字段的值")
@PostMapping("changeField")
public AjaxResult changeFiled(@RequestBody FieldDto field)  ;
```

这里添加分页查询的方法，在各个工程里面，如下:

```java
@TranslateCode
@ResponseBody
@PostMapping("/datatables")
public TableDataInfo datatables(HttpServletRequest request, Model model, DatatablesPageBean page) {
  log.debug("page = {}", ToStringBuilder.reflectionToString(page));
  return this.toPage(model, this.getFeign(), page);
}
```

### 前端接口的默认集成方法

此接口在前端默认就已经集成，具体接口地址位于`alinesno-cloud-common-web-api-starter`下的`rest`模块，
这里主要包含几个模块：

- 登陆接口的默认集成
- 配置接口的默认集成
- 上传下载图片接口的默认集成
- 字典接口的默认集成
- 组织机构接口的默认集成

具体较多，可配置 swagger 查看，

## 其它

- 无
