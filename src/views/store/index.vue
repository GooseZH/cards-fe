<template>
  <div class="app-container documentation-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
    </div>
    <el-table :key='tableKey' :data="list" border fit highlight-current-row
              style="width: 100%;min-height:50px;">
      <el-table-column width="150px" align="center" :label="$t('store.table.name')">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('store.table.address')">
        <template slot-scope="scope">
          <span>{{scope.row.address}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('store.table.phone')">
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('store.table.type')">
        <template slot-scope="scope">
          <span>{{scope.row.type}}</span>
        </template>
      </el-table-column>
      <el-table-column width="250px" align="center" :label="$t('store.table.homePage')">
        <template slot-scope="scope">
          <span>{{scope.row.homePage}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('table.actions')">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{$t('table.delete')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" ></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="temp.address"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="temp.phone"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="storeType">
          <el-input v-bind:disabled="editStatus" v-model="temp.storeType"></el-input>
        </el-form-item>
        <el-form-item label="主页" prop="homePage">
          <el-input v-bind:disabled="editStatus" v-model="temp.homePage"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog title="删除" :visible.sync="delOperateVisible">
      删除后不可恢复！请谨慎操作！
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteData">{{$t('table.confirm')}}</el-button>
      </span>
    </el-dialog>

    <el-dialog title="操作" :visible.sync="dialogOperateVisible">
      {{operateMsg}}
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogOperateVisible = false">{{$t('table.confirm')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getStore, updateStore, createStore, deleteStore } from '@/api/store'
export default {
  name: 'store',
  data() {
    return {
      tableKey: 0,
      dialogOperateVisible: false,
      operateMsg: '',
      delOperateVisible: false,
      editStatus: false,
      dialogStatus: '',
      dialogPvVisible: false,
      dialogFormVisible: false,
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      list: null,
      rules: {
        name: [{ required: true, message: 'name is required', trigger: 'blur' }],
        address: [{ required: true, message: 'address is required', trigger: 'blur' }],
        phone: [{ required: true, message: 'phone is required', trigger: 'blur' }],
        storeType: [{ required: true, message: 'storeType is required', trigger: 'blur' }],
        homePage: [{ required: true, message: 'homePage is required', trigger: 'change' }]
      },
      del: {
        id: null
      },
      temp: {
        id: undefined,
        name: '',
        address: '',
        phone: '',
        storeType: '',
        homePage: ''
      }
    }
  },
  created() {
    this.getStore()
  },
  methods: {
    getStore() {
      getStore().then(response => {
        const data = response.data
        if (data != null && data.length > 0) {
          this.list = response.data
        }
      })
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.editStatus = false
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.storeType = row.type
      this.dialogStatus = 'update'
      this.editStatus = true
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row) {
      this.del.id = row.id// copy obj
      this.delOperateVisible = true
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    deleteData() {
      this.delOperateVisible = false
      deleteStore(this.del).then((response) => {
        if (response.code === 200) {
          this.getStore()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '失败',
            message: '删除失败:' + response.msg,
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    updateData() {
      // this.$refs['dataForm'].validate((valid) => {
      //   if (valid) {
      this.dialogFormVisible = false
      updateStore(this.temp).then((response) => {
        if (response.code === 200) {
          this.getStore()
          // this.list.unshift(this.temp)
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '失败',
            message: '创建失败:' + response.msg,
            type: 'error',
            duration: 2000
          })
        }
      })
      //   }
      // })
    },
    createData() {
      // this.$refs['dataForm'].validate((valid) => {
      //   if (valid) {
      this.temp.id = null // mock a id
      this.dialogFormVisible = false
      createStore(this.temp).then((response) => {
        if (response.code === 200) {
          this.getStore()
          // this.list.unshift(this.temp)
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '失败',
            message: '创建失败:' + response.msg,
            type: 'error',
            duration: 2000
          })
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.documentation-container {
  margin: 50px;
  .document-btn {
    float: left;
    margin-left: 50px;
    vertical-align: middle;
    display: block;
    cursor: pointer;
    background: black;
    color: white;
    height: 60px;
    width: 200px;
    line-height: 60px;
    font-size: 20px;
    text-align: center;
  }
}
</style>
