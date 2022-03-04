<template>
  <div class="demo-page">
    <header class="demo-header">
      <div class="demo-header__text">已选中 {{ selection.length }} 项</div>

      <div class="demo-header__actions">
        <ElButton type="primary" @click="addCol">新增列</ElButton>
        <ElButton @click="modifyCol">修改末列</ElButton>

        <ElPopover
          placement="top-start"
          width="200"
          trigger="hover"
          class="actions-popover-wrapper"
          popper-class="actions-popover"
        >
          <ElButton slot="reference">显示/隐藏列</ElButton>

          <ElForm label-width="100px">
            <ElFormItem
              v-for="(item, index) in columns"
              v-show="!!item.label"
              :key="item.prop + index"
              :label="item.label"
            >
              <ElSwitch v-model="item.visible" />
            </ElFormItem>
          </ElForm>
        </ElPopover>
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
      empty-text="未查询到记录"
      :options="{
        stripe: true,
        rowKey: 'id',
        highlightCurrentRow: true
      }"
    >
      <!-- 性别 -->
      <template #sex="{ value }">
        {{ ['女', '男'][value] }}
      </template>

      <!-- 操作 -->
      <template #operate="{ row }">
        <ElButton type="primary" @click="showDetail(row)">详情</ElButton>
        <ElButton type="danger" @click="remove(row)">删除</ElButton>
      </template>

      <div slot="append" :style="{ textAlign: 'center', padding: '15px 0' }">
        插入至表格最后一行之后的内容，如果需要对表格的内容进行无限滚动操作，可能需要用到这个
        slot。若表格有合计行，该 slot 会位于合计行之上。
      </div>
    </ElTableExt>
  </div>
</template>

<script>
import Vue from 'vue'
import { getUserList, removeUser } from './api'

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

    // 初始列显示
    this.columns.forEach(item => {
      this.$set(item, 'visible', true)
    })
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
    async query({ pagin, filters, sorts }) {
      const { data, total } = await getUserList({
        keyword: this.keyword,
        pagin,
        filters,
        sorts
      })

      return { data, total }
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

      await removeUser(row.id)

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
        visible: true,
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
        visible: true,
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

      .actions-popover-wrapper {
        margin-left: 10px;

        ::v-deep {
          .el-popover__reference-wrapper {
            display: flex;
            align-items: center;
            height: 100%;
          }
        }
      }
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

<style lang="scss">
.actions-popover {
  .el-form-item {
    margin-bottom: 6px;
  }
}
</style>
