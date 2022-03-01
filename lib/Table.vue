<template>
  <el-table-fix
    ref="table"
    v-loading="loading"
    class="el-table-ext"
    v-bind="options"
    :data="tableData"
    :height="height"
    :default-sort="defaultSort"
    :empty-text="errorMessage || emptyText"
    @sort-change="sortChange"
    @filter-change="filterChange"
    @hook:mounted="tableMounted"
    v-on="$listeners"
  >
    <el-table-column
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
    </el-table-column>

    <el-pagination
      v-if="pager"
      ref="pagin"
      v-bind="pagin"
      @size-change="changeSize"
      @current-change="jumpPage"
      v-on="$listeners"
    />
  </el-table-fix>
</template>

<script src="./Table.js"></script>

<style lang="scss" src="./Table.scss"></style>
