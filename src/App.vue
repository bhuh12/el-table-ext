<template>
  <div class="demo-page">
    <header>
      已选中 {{ selection.length }} 项
    </header>

    <el-table-ext
      ref="table"
      :columns="columns"
      :query="query"
      height="250px"
      :pager="{ pageSize: 100 }"
    >
      <!-- 性别 -->
      <template v-slot:sex="{ row, column, value, index }">
        {{ ['男', '女'][value] }}
      </template>

      <template v-slot:operate="{ row, column, value, index }">
        <el-link @click="showDetail(row)">
          详情
        </el-link>
      </template>
    </el-table-ext>
  </div>
</template>

<script>
import Vue from 'vue'

// 全局过滤器
Vue.filter('datetime', val => new Date(val).toLocaleString())

// 原型挂载选项
Vue.prototype.$option = {
  status: [{
    text: '在线',
    value: 1,
    class: 'text-green'
  }, {
    text: '离线',
    value: 2,
    class: 'text-gray'
  }]
}

// 内部选项
const types = [{
  text: '学生',
  value: 1
}, {
  text: '老师',
  value: 2
}]

export default {
  name: 'App',
  data () {
    return {
      mounted: false,

      // 列表字段
      columns: this.getColumns()
    }
  },

  computed: {
    // 选择项
    selection () {
      return this.mounted ? this.$refs.table.selection : []
    }
  },

  mounted () {
    this.mounted = true
  },

  methods: {
    // 列表字段
    getColumns () {
      return [{
        prop: 'selection',
        type: 'selection',
        fixed: true
      }, {
        prop: 'id',
        label: 'ID',
        fixed: true // 固定左侧
      }, {
        prop: 'name',
        label: '姓名',
        minWidth: 150,
        sortable: 'custom' // 远程排序
      }, {
        prop: 'sex',
        label: '性别'
      }, {
        prop: 'type',
        label: '身份',
        filters: types, // 筛选
        renderOption: types // 渲染数组选项 types
      }, {
        prop: 'status',
        label: '状态',
        filters: this.$option.status,
        filterMultiple: false, // 单选筛选
        renderOption: 'status' // 渲染 Vue.prototype.$option.status 选项
      }, {
        prop: 'time',
        label: '时间',
        width: 180,
        formatter: 'datetime' // 配置组件或全局过滤器格式化内容
      }, {
        prop: 'operate',
        label: '操作',
        fixed: 'right', // 固定右侧
        width: 120
      }]
    },

    // 查询列表
    query ({ pagin, filters, sorts }) {
      console.log(pagin, filters, sorts)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // 模拟数据
          resolve({
            // 列表数据
            data: Array.from(new Array(pagin.pageSize), (item, index) => ({
              id: Math.floor(Math.random() * 1000),
              name: this.search || '李四',
              sex: Math.floor(Math.random() * 2),
              type: Math.ceil(Math.random() * 2),
              status: Math.ceil(Math.random() * 2),
              time: new Date()
            })),

            // 总记录数
            total: 250
          })
        }, Math.random() * 1000)
      })
    },

    // 打印数据
    showDetail (row) {
      alert(JSON.stringify(row))
    }

  }
}
</script>

<style lang="scss" scoped>
.demo-page {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background: #fff;

  header {
    padding: 0 3px;
    line-height: 40px;
    font-size: 14px;
    border-bottom: 1px solid #EBEEF5;
  }
}
</style>
