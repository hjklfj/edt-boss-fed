<template>
  <div class="resource">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :inline="true" :model="form" class="demo-form-inline">
          <el-form-item label="审批人">
            <el-input v-model="form.user" placeholder="审批人"></el-input>
          </el-form-item>
          <el-form-item label="活动区域">
            <el-select v-model="form.region" placeholder="活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="resources" style="width: 100%; margin-bottom: 20px">
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
        :current-page.sync="form.current">
      </el-pagination>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getResourcePages } from '@/services/resource'

export default Vue.extend({
  name: 'ResourceList',
  data () {
    return {
      resources: [],
      form: {
        current: 1,
        size: 10
      },
      totalCount: 0
    }
  },
  created () {
    this.loadResources()
  },
  methods: {
    async loadResources () {
      const { data } = await getResourcePages({
        // 查询条件
        current: this.form.current, // 页码
        size: this.form.size // 分页大小
      })
      this.resources = data.data.records
      this.totalCount = data.data.total
    },
    onSubmit () {
      console.log('submit')
    },
    handleEdit (item : any) {
      console.log('handleEdit')
    },
    handleDelete (item : any) {
      console.log('handleDelete')
    },
    handleSizeChange (val : number) {
      console.log('handleSizeChange ', val)
      this.form.size = val
      this.form.current = 1 // 查询第一页数据
      this.loadResources()
    },
    handleCurrentChange (val : number) {
      console.log('handleCurrentChange ', val)
      this.form.current = val
      this.loadResources()
    }
  }
})
</script>

<style lang="scss" scoped></style>
