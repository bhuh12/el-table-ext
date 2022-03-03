<template>
  <div
    v-loading="loading"
    class="el-table-ext"
    :class="{ 'is-flexible': isFlexible }"
    :style="{ height: typeof height === 'number' ? `${height}px` : height }"
  >
    <ElTable
      ref="table"
      v-bind="options"
      :data="tableData"
      :height="tableHeight"
      :default-sort="defaultSort"
      :empty-text="errorMessage || emptyText"
      @sort-change="sortChange"
      @filter-change="filterChange"
      @hook:mounted="tableMounted"
      v-on="$listeners"
    >
      <ElTableColumn
        v-for="col in cols"
        :key="col.prop"
        :column-key="col.prop"
        v-bind="col"
      >
        <!-- 字段插槽 -->
        <template v-if="$scopedSlots[col.prop]" #default="scope">
          <slot :name="col.prop" v-bind="bindScope(scope)">
            {{ scope.row[col.prop] }}
          </slot>
        </template>

        <!-- 字段 render 渲染 -->
        <template v-else-if="col.render" #default="scope">
          <column-render :render="col.render" v-bind="bindScope(scope)" />
        </template>

        <!-- 头部字段插槽 -->
        <template v-if="$scopedSlots['header:' + col.prop]" #header="scope">
          <slot :name="'header:' + col.prop" v-bind="bindScope(scope)">
            {{ scope.column.label }}
          </slot>
        </template>
      </ElTableColumn>
    </ElTable>

    <ElPagination
      v-if="pager"
      ref="pagin"
      v-bind="pagin"
      @size-change="changeSize"
      @current-change="jumpPage"
      @hook:mounted="updatePaginHeight"
      @hook:destroyed="paginHeight = 0"
      v-on="$listeners"
    />
  </div>
</template>

<script src="./Table.js"></script>

<style lang="scss" src="./Table.scss"></style>
