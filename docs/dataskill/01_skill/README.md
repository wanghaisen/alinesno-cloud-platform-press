# 数据入仓

数据中台规划以离线和实时两种方式将数据入仓

- 离线

   1)、kettle开发抽取业务数据入hive任务+在线调度

   2)、数据上报服务提供导入模板，服务端接收kafka消息入湖。用户导入数据时，将数据发往kafka

- 实时

   1)、flink接收mysql cdc信息，将信息入湖并映射成hive表

   2)、nginx日志输出json格式日志+filebeat发送日志到kafka+flink接收kafka信息，将信息入湖并映射成hive表

