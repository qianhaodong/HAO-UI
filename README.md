# 项目说明

HAO UI 是一款提供高质量交互的小程序组件合集，致力于简洁和高可用的组件实现。



## 体验

使用微信扫一扫体验小程序组件示例

[![小程序码](https://hdblog.online/wp-content/uploads/2021/01/code-12.jpg "小程序码")](https://hdblog.online/wp-content/uploads/2021/01/code-12.jpg "小程序码")



## 快速上手

### 使用之前

在开始使用 HAO UI 之前，你需要先阅读[微信小程序自定义组件](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/ "微信小程序自定义组件")的相关文档。

### 如何使用

首先下载代码到本地，按需引入组件。然后按照如下的方式使用组件，以 Dialog 组件为例，其它组件在对应的文档页查看：

1.添加需要的组件。在页面的 json 中配置（路径根据自己项目位置配置）：
```JSON
"usingComponents": {
    "dialog": "/components/dialog/index"
}
```

2.在 wxml 中使用组件：
```HTML
<dialog
	id="dialog"
	action-btns="{{[{ type: confirm, txt: '我知道了' }]}}"
></dialog>
```



## 版本说明



## 1.0.0版本

发布时间：2020/11/04		作者：见走偏疯



- 新增：【常用组件】
  - 日期筛选
  - 自定义导航栏
  - 图片上传
- 新增：【操作反馈】
  - Action-Sheet
  - 下拉菜单
  - Dialog
- 新增：【拖拽】
  - 拖拽
- 新增：【多选列表】
  - 多选列表
  - 多选删除列表
- 新增：【其他组件】
  - 小球动画





## 1.0.1版本

发布时间：2020/12/24		作者：见走偏疯



- 新增：【其他组件】中添加商品购物车示例。
- 优化：【常用组件】中图片上传组件优化，添加图片删除和模拟上传功能。
- 优化：【操作反馈】中Dialog组件优化，改变确认按钮颜色和增大按钮字体。





## 1.0.2版本

发布时间：2020/12/28		作者：见走偏疯



- 新增：【拖拽】中增加拖拽排序示例。
- 优化：【多选列表】中将多选列表、多选删除列表示例迁移至分包 other-example 中。