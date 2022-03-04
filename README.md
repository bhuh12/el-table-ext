<h2 align="center">Element Table Extend</h2>

<p align="center">
  <a target="_blank" href="https://www.travis-ci.org/bhuh12/el-table-ext">
    <img src="https://www.travis-ci.org/bhuh12/el-table-ext.svg?branch=dev" alt="Build">
  </a>

  <a href="https://github.com/vuejs/vue">
    <img src="https://img.shields.io/badge/vue-2.5.22-brightgreen.svg" alt="vue">
  </a>

  <a target="_blank" href="https://github.com/bhuh12/el-table-ext">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/bhuh12/el-table-ext.svg">
  </a>
</p>

<p align="center">
  <a target="_blank" href="https://www.npmjs.com/package/el-table-ext">
    <img src="https://img.shields.io/npm/v/el-table-ext.svg" alt="Version">
  </a>

  <a target="_blank" href="https://npmcharts.com/compare/el-table-ext?minimal=true">
    <img src="https://img.shields.io/npm/dm/el-table-ext.svg" alt="Downloads">
  </a>

  <a target="_blank" href="https://www.npmjs.com/package/el-table-ext">
    <img alt="npm bundle size" src="https://img.shields.io/bundlephobia/minzip/el-table-ext.svg?label=gzip:JS">
  </a>
  
  <a target="_blank" href="https://github.com/bhuh12/el-table-ext/blob/dev/LICENSE">
    <img src="https://img.shields.io/npm/l/el-table-ext.svg" alt="License">
  </a>
</p>

Element Table 组件增强

## 📌 Feature 功能

除了 Element Table 的所有功能，组件还支持以下特性：

- `load` 远程数据加载
- 集成 Pagination 分页组件
- `columns` 列字段配置，js 方式配置更灵活
- 可通过具名作用域插槽 `header:[columns[i].prop]` 渲染列表头
- 支持多种方式快捷渲染列字段：
  1. `columns[i].render` 函数 jsx 方式
  2. 具名作用域插槽 `[columns[i].prop]` 模板方式
  3. 配置字段 `columns[i].renderOption` 渲染选项式数据
  4. 配置字段 `columns[i].formatter` 调用 Vue 全局过滤器 `filter` 格式化数据

## Todo 待办

1. 静态数据分页 / 排序 / 筛选

## Demo 示例

[https://bhuh12.github.io/el-table-ext/](https://bhuh12.github.io/el-table-ext/)

## Install 安装

### Install npm

```shell
// yarn
yarn add el-table-ext

// or npm
npm i el-table-ext -S
```

### Install plugin

```javascript
import Vue from 'vue'

// 引入 Element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 引入 el-table-ext
import ElTableExt from 'el-table-ext'
import 'el-table-ext/dist/lib/el-table-ext.css'

Vue.use(ElementUI)
Vue.use(ElTableExt)
```

# Use 使用说明

参考 [Demo](./src/App.vue)

## Attributes 组件属性

| 参数             | 说明                                                                                                                       | 类型                                | 必需 | 可选值                         | 默认值       |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ---- | ------------------------------ | ------------ |
| columns          | 列数据<br>参考 [Table-column Attributes 列属性](#table-column-attributes-%e5%88%97%e5%b1%9e%e6%80%a7)                      | Array                               | 是   | —                              | —            |
| data             | 静态列表数据                                                                                                               | Array                               | —    | —                              | —            |
| query            | 异步查询列表数据，成功后返回 Promise.resolve({ data: Array, total: Number })                                               | Function({ pagin, filters, sorts }) | —    | —                              | —            |
| pager            | 分页选项，为 `false` 则禁用分页<br>参考 [Element - Pagination 分页](https://element.eleme.cn/#/zh-CN/component/pagination) | Object, Boolean                     | —    | —                              | —            |
| auto-load        | 是否自动加载                                                                                                               | Boolean                             | —    | —                              | `true`       |
| default-sort     | 默认排序，远程排序需要配置对应字段 `sortable: 'custom'`                                                                    | Object{prop, order}                 | —    | `order`: ascending, descending | —            |
| height           | 列表高度                                                                                                                   | String                              | —    | —                              | —            |
| flexible         | 是否伸缩盒布局                                                                                                             | Boolean                             | —    | —                              | `true`       |
| empty-text       | 空数据时显示的文本内容，也可以通过 slot="empty" 设置                                                                       | String                              | —    | —                              | `'暂无数据'` |
| empty-image      | 空数据时显示的图片                                                                                                         | String                              | —    | —                              | —            |
| empty-image-size | 空数据图片大小（宽度）                                                                                                     | Number                              | —    | —                              | —            |
| options          | 扩展 el-table 配置<br>参考 [Element - Table 表格](https://element.eleme.cn/#/zh-CN/component/table)                        | Object                              | —    | —                              | —            |

## Table-column Attributes 列属性

Table 支持 Element Table 组件 column 的所有配置(参考：[Element - Table 表格 / Table-column Attributes
](https://element.eleme.cn/#/zh-CN/component/table#table-column-attributes))，并且扩展了额外的支持

| 参数         | 说明                                                                                                     | 类型                                        | 必需 | 可选值 | 默认值 |
| ------------ | -------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ---- | ------ | ------ |
| render       | jsx 方式渲染字段数据                                                                                     | Function(h, { row, column, value, index })  | —    | —      | —      |
| renderOption | 渲染选项数据，展示匹配到的选项文本和 class 样式。如果为 String 则从 Vue.prototype.$option 上匹配选项列表 | String, Array[{ text, value, class }]       | —    | —      | —      |
| formatter    | 字段格式化方法。如果为 String 则匹配全局过滤器格式化，暂不支持额外参数                                   | String, Function(row, column, value, index) | —    | —      | —      |
| sortable     | 对应列是否可以排序，如果需要远程排序请设置为 'custom'                                                    | true, false, 'custom'                       | —    | —      | false  |

## Slots 插槽

| 插槽名          | 说明               | 作用域                        |
| --------------- | ------------------ | ----------------------------- |
| `[prop]`        | 自定义列的内容     | { row, column, value, index } |
| `header:[prop]` | 自定义表头的内容   | { column, index }             |
| empty           | 空数据时展示的内容 | —                             |

## Events 事件

Table 支持 Element Table / Pagination 组件的所有事件

参考：

- [Element - Table 表格 - 事件](https://element.eleme.cn/#/zh-CN/component/table#table-events)

- [Element - Pagination 分页 - 事件](https://element.eleme.cn/#/zh-CN/component/pagination#events)

## Methods 方法

| 方法名   | 说明         | 参数     |
| -------- | ------------ | -------- |
| load     | 加载表格数据 | —        |
| jumpPage | 分页跳转     | page = 1 |
| adjust   | 更新布局     | —        |

## [Changelog 更新日志](CHANGELOG.md)
