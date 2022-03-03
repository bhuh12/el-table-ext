<template>
  <div class="demo-page">
    <header class="demo-header">
      <div class="demo-header__text">已选中 {{ selection.length }} 项</div>

      <div class="demo-header__actions">
        <ElButton type="primary" @click="addCol">新增列</ElButton>
        <ElButton @click="modifyCol">修改末列</ElButton>
      </div>

      <div class="demo-header__search">
        <ElInput
          v-model="keyword"
          placeholder="请搜索姓名或手机号"
          clearable
          @change="search"
        >
          <a
            slot="suffix"
            class="demo-header__search-btn el-input__icon el-icon-search"
            @click="search"
          ></a>
        </ElInput>
      </div>
    </header>

    <ElTableExt
      ref="table"
      :columns="columns"
      :query="query"
      :pager="{ pageSize: 100 }"
      :options="{
        stripe: true,
        rowKey: 'id',
        emptyText: '未查询到记录',
        highlightCurrentRow: true
      }"
    >
      <!-- 性别 -->
      <template #sex="{ value }">
        {{ ['女', '男'][value] }}
      </template>

      <template #operate="{ row }">
        <ElButton type="primary" @click="showDetail(row)">详情</ElButton>
        <ElButton type="danger" @click="remove(row)">删除</ElButton>
      </template>
    </ElTableExt>
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
      class: 'text-green'
    },
    {
      text: '离线',
      value: 0,
      class: 'text-gray'
    }
  ]
}

// 内部选项
const types = [
  {
    text: '普通用户',
    value: 0
  },
  {
    text: '管理员',
    value: 1,
    class: 'text-blue'
  },
  {
    text: 'VIP',
    value: 2,
    class: 'text-orange'
  }
]

/** 模拟数据 */
function mockData() {
  const now = new Date()
  const data = Array.from(
    new Array(Math.floor(Math.random() * 1000)),
    (i, index) =>
      mockItem(
        index,
        new Date(now.getTime() - Math.random() * 2 * 365 * 24 * 60 * 60 * 1000)
      )
  )

  // 默认倒序展示
  data.sort((a, b) => b.index - a.index)
  return data
}

// 初始数据
const originData = mockData()

/** 模拟数据 */
function mockItem(index, createTime = new Date()) {
  return {
    index,
    id: index + 1,
    name: `用户${index + 1}`,
    phone:
      '1' +
      Array.from(new Array(10), () => Math.floor(Math.random() * 10)).join(''),
    sex: Math.floor(Math.random() * 2),
    remark: Array.from(
      new Array(Math.floor(Math.random() * 10)),
      () => '这是很长的一段文本'
    ).join(','),
    type: Math.floor(Math.random() * 3),
    status: Math.floor(Math.random() * 2),
    createTime
  }
}

/** 模拟 ajax  请求 */
function mockAjax({ keyword, pagin, sorts, filters }) {
  return new Promise(resolve => {
    setTimeout(() => {
      let result = [...originData]

      // 排序
      if (sorts.prop) {
        result.sort(
          sorts.order === 'ascending'
            ? (a, b) => {
                const aVal = a[sorts.prop]
                const bVal = b[sorts.prop]

                return aVal.localeCompare
                  ? aVal.localeCompare(bVal, 'zh-CN')
                  : aVal - bVal
              }
            : (a, b) => {
                const aVal = a[sorts.prop]
                const bVal = b[sorts.prop]

                return bVal.localeCompare
                  ? bVal.localeCompare(aVal, 'zh-CN')
                  : bVal - aVal
              }
        )
      }

      // 搜索、筛选
      if (keyword || Object.keys(filters).length) {
        result = result.filter(item => {
          // 搜索
          if (
            keyword &&
            !item.name.includes(keyword) &&
            !item.phone.includes(keyword)
          )
            return false

          // 筛选
          return !Object.entries(filters).some(
            ([prop, val]) => !val.includes(item[prop])
          )
        })
      }

      const start = (pagin.currentPage - 1) * pagin.pageSize

      resolve({
        data: result.slice(start, start + pagin.pageSize),
        total: result.length
      })
    }, Math.random() * 500 + 100)
  })
}

export default {
  name: 'App',

  data() {
    return {
      mounted: false,

      keyword: '',

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
          width: 80,
          fixed: true // 固定左侧
        },
        {
          prop: 'name',
          label: '姓名',
          minWidth: 80,
          fixed: true, // 固定左侧
          sortable: 'custom' // 远程排序
        },
        {
          prop: 'phone',
          label: '手机号',
          minWidth: 120
        },
        {
          prop: 'sex',
          label: '性别',
          filterMultiple: false, // 单选筛选
          // 筛选
          filters: [
            { text: '男', value: 1 },
            { text: '女', value: 0 }
          ]
        },
        {
          prop: 'type',
          label: '身份',
          filters: types, // 筛选
          renderOption: types // 渲染数组选项 types
        },
        {
          prop: 'remark',
          label: '备注',
          minWidth: 140,
          showOverflowTooltip: true
        },
        {
          prop: 'status',
          label: '状态',
          filters: this.$option.status,
          filterMultiple: false, // 单选筛选
          renderOption: 'status' // 渲染 Vue.prototype.$option.status 选项
        },
        {
          prop: 'createTime',
          label: '注册时间',
          width: 180,
          formatter: 'datetime', // 配置组件或全局过滤器格式化内容
          sortable: 'custom' // 远程排序
        },
        {
          prop: 'operate',
          label: '操作',
          fixed: 'right', // 固定右侧
          width: 150
        }
      ]
    },

    // 查询列表
    query({ pagin, filters, sorts }) {
      return mockAjax({ keyword: this.keyword, pagin, filters, sorts })
    },

    reload() {
      this.$refs.table.load()
    },

    // 搜索
    search() {
      this.$refs.table.jumpPage()
    },

    // 详情
    showDetail(row) {
      this.$alert(JSON.stringify(row), '详情数据')
    },

    // 删除
    async remove(row) {
      await this.$confirm(`是否确认要删除“${row.name}”？`, '操纵确认', {
        type: 'error'
      })

      originData.splice(originData.indexOf(row), 1)

      this.$message.success(`“${row.name}”删除成功`)

      this.reload()
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

    &__actions {
      display: flex;
      flex: auto;
      align-items: center;
      margin-left: 20px;
    }

    &__search {
      width: 250px;

      &-btn {
        font-size: 14px;
        cursor: pointer;

        &:hover {
          color: #09f;
        }
      }
    }
  }

  ::v-deep {
    .text-blue {
      color: #09f;
    }

    .text-green {
      color: #090;
    }

    .text-orange {
      color: #f80;
    }

    .text-gray {
      color: gray;
    }
  }
}
</style>
