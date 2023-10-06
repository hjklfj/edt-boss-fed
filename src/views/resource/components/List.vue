<template>
  <div class="resource">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form ref="form" :inline="true" :model="form" class="demo-form-inline">
          <el-form-item label="资源名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="资源路径" prop="url">
            <el-input v-model="form.url"></el-input>
          </el-form-item>
          <el-form-item label="资源分类" prop="categoryId">
            <el-select v-model="form.categoryId" placeholder="请选择资源分类" clearable>
              <el-option :label="item.name" :value="item.id" v-for="item in resourceCategories" :key="item.id"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :disabled="isLoading" @click="onSubmit">查询</el-button>
            <el-button :disabled="isLoading" @click="onReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="resources" style="width: 100%; margin-bottom: 20px" v-loading="isLoading">
        <el-table-column prop="date" type="index" label="编号" width="100">
        </el-table-column>
        <el-table-column prop="name" label="资源名称" width="180">
        </el-table-column>
        <el-table-column prop="url" label="资源路径" width="180">
        </el-table-column>
        <el-table-column prop="description" label="描述" width="180">
        </el-table-column>
        <el-table-column prop="createdTime" label="添加时间" width="180">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 20]"
        :page-size="form.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        :current-page.sync="form.current"
        :disabled="isLoading">
      </el-pagination>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getResourcePages } from '@/services/resource'
import { getResourceCategories } from '@/services/resource-category'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'ResourceList',
  data () {
    return {
      resources: [],
      form: {
        name: '',
        current: 1,
        size: 10,
        categoryId: null
      },
      totalCount: 0,
      resourceCategories: [],
      isLoading: true
    }
  },
  created () {
    this.loadResources()
    this.loadResourceCategories()
  },
  methods: {
    async loadResources () {
      this.isLoading = true
      const { data } = await getResourcePages(this.form)
      this.resources = data.data.records
      this.totalCount = data.data.total
      this.isLoading = false
    },
    async loadResourceCategories () {
      const { data } = await getResourceCategories()
      this.resourceCategories = data.data
    },
    onSubmit () {
      this.form.current = 1
      this.loadResources()
    },
    handleEdit (item : any) {
      console.log('handleEdit')
    },
    handleDelete (item : any) {
      console.log('handleDelete')
    },
    handleSizeChange (val : number) {
      this.form.size = val
      this.form.current = 1 // 查询第一页数据
      this.loadResources()
    },
    handleCurrentChange (val : number) {
      this.form.current = val
      this.loadResources()
    },
    onReset () {
      (this.$refs.form as Form).resetFields()
      this.loadResources()
    }
  }
})
</script>

<style lang="scss" scoped></style>
