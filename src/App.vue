<template>
  <div class="demo-page">
    <header class="demo-header">
      <div class="demo-header__text">已选中 {{ selection.length }} 项</div>

      <div class="demo-header__actions">
        <ElButton type="primary" @click="addCol">新增列</ElButton>
        <ElButton @click="modifyCol">修改末列</ElButton>
      </div>
    </header>

    <el-table-ext
      ref="table"
      height="250px"
      :columns="columns"
      :query="query"
      :pager="{ pageSize: 100 }"
      :options="{
        emptyText: '未查询到记录',
        stripe: true,
        rowKey: 'id',
        highlightCurrentRow: true
      }"
    >
      <!-- 性别 -->
      <template #sex="{ value }">
        {{ ['男', '女'][value] }}
      </template>

      <template #operate="{ row }">
        <el-link @click="showDetail(row)"> 详情 </el-link>
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
  status: [
    {
      text: '在线',
      value: 1,
      class: 'text-blue'
    },
    {
      text: '离线',
      value: 2,
      class: 'text-gray'
    }
  ]
}

// 内部选项
const types = [
  {
    text: '学生',
    value: 1
  },
  {
    text: '老师',
    value: 2
  }
]

export default {
  name: 'App',
  data() {
    return {
      mounted: false,

      // 列表字段
      columns: this.getColumns()
    }
  },

  computed: {
    // 选择项
    selection() {
      return this.mounted ? this.$refs.table.selection : []
    }
  },

  mounted() {
    this.mounted = true
  },

  methods: {
    // 列表字段
    getColumns() {
      return [
        {
          prop: 'selection',
          type: 'selection',
          fixed: true
        },
        {
          prop: 'id',
          label: 'ID',
          fixed: true // 固定左侧
        },
        {
          prop: 'name',
          label: '姓名',
          minWidth: 150,
          sortable: 'custom' // 远程排序
        },
        {
          prop: 'sex',
          label: '性别'
        },
        {
          prop: 'type',
          label: '身份',
          filters: types, // 筛选
          renderOption: types // 渲染数组选项 types
        },
        {
          prop: 'status',
          label: '状态',
          filters: this.$option.status,
          filterMultiple: false, // 单选筛选
          renderOption: 'status' // 渲染 Vue.prototype.$option.status 选项
        },
        {
          prop: 'time',
          label: '时间',
          width: 180,
          formatter: 'datetime' // 配置组件或全局过滤器格式化内容
        },
        {
          prop: 'operate',
          label: '操作',
          fixed: 'right', // 固定右侧
          width: 120
        }
      ]
    },

    // 查询列表
    query({ pagin }) {
      return new Promise(resolve => {
        setTimeout(() => {
          // 模拟数据
          resolve({
            // 列表数据
            data: Array.from(new Array(pagin.pageSize), (item, index) => ({
              id: index, // Math.floor(Math.random() * 1000),
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
    showDetail(row) {
      alert(JSON.stringify(row))
    },

    // 新加列
    addCol() {
      const { columns } = this
      const { length } = columns
      columns.push({
        prop: `Col${length}`,
        label: `新增字段[${length}]`,
        formatter(row, column, value, index) {
          return column.label + ',' + index
        }
      })
    },

    // 更改列
    modifyCol() {
      const { columns } = this
      this.$set(columns, columns.length - 1, {
        label: '最后一个',
        formatter(row, column, value, index) {
          return column.label + ',' + index
        }
      })
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

  .demo-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    font-size: 14px;
    line-height: 40px;
    border-bottom: 1px solid #ebeef5;
  }

  ::v-deep {
    .text-blue {
      color: #09f;
    }

    .text-gray {
      color: gray;
    }
  }
}
</style>
