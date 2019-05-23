# web-server

## 前端静态服务器 使用 `koa` 端口修改在 `bin/www` 文件

### 使用 pm2 进程管理运行

### 使用 `dist` 文件夹

`npm install pm2 -g`

`pm2 start bin/www --name [name]`  `[name]  -->` 应用名称

`-i [max]` 集群模式

`pm2 stop [name]` 停止应用

`pm2 delete [name]` 删除应用

`pm2 restart [name]` 重新启动应用

`pm2 reload [name]` 重新加载文件，也可用于重启 0 秒等待 不停机

`pm2 list` `pm2 ls` 应用列表

### 服务器首次使用 pm2 工具

`pm2 startup [platform]`  设置应用列表随系统自启动 `[platform] --> ubuntu，ubuntu14，ubuntu12，centos，centos6，arch，oracle，amazon，macos，darwin，freebsd，systemd，systemv，upstart，launchd，rcd，openrc` 等，`window` 系统无效 选填 ，不填时自动识别系统

`pm2 save`  把当前运行的应用保存到 `pm2` 进程列表中 随系统自启动

其他看官网文档 [pm2官网](https://pm2.io/doc/en/runtime/overview/ "pm2官网")
