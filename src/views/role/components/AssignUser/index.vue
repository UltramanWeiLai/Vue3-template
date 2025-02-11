<template>
  <AModal
    v-model:open="visible"
    title="分配用户"
    @ok="handleOk"
    @cancel="handleCancel"
    :confirmLoading="loading"
    width="800px"
  >
    <ASpin :spinning="loading">
      <!-- 搜索表单 -->
      <AForm :model="formState" layout="inline" class="search-form">
        <AFormItem label="用户名称" name="username">
          <AInput v-model:value="formState.username" placeholder="用户名" allowClear />
        </AFormItem>
        <AFormItem label="昵称" name="name">
          <AInput v-model:value="formState.name" placeholder="昵称" allowClear />
        </AFormItem>
        <AFormItem class="search-buttons">
          <AButton type="primary" @click="handleSearch">搜索</AButton>
          <AButton class="ml16" @click="handleReset">重置</AButton>
        </AFormItem>
      </AForm>

      <!-- 用户列表 -->
      <ATable
        :columns="columns"
        :data-source="dataSource"
        :loading="tableLoading"
        :pagination="pagination"
        :row-selection="rowSelection"
        @change="handleTableChange"
        class="user-table mt20"
      />
    </ASpin>
  </AModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { message } from 'ant-design-vue'
import type { TablePaginationConfig } from 'ant-design-vue'
import { queryUsers, IUserInfo } from '@/api/modules/user'
import { setUserRoles } from '@/api/modules/user'

interface IProps {
  visible: boolean
  roleId?: number
}

interface IFormState {
  username?: string
  name?: string
}

const props = defineProps<IProps>()
const emits = defineEmits(['update:visible', 'success'])
const visible = computed({
  get: () => props.visible,
  set: (val: boolean) => emits('update:visible', val),
})

const loading = ref(false)
const formState = reactive<IFormState>({ username: undefined, name: undefined })

// 表格配置
const columns = [
  { title: '用户名', dataIndex: 'username' },
  { title: '昵称', dataIndex: 'name' },
  { title: '邮箱', dataIndex: 'email' },
  { title: '手机号', dataIndex: 'phone' }
]

// 表格数据
const dataSource = ref<IUserInfo[]>([])
const tableLoading = ref(false)
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: (total: number) => `共 ${total} 条`
})

// 表格选择
const selectedRowKeys = ref<number[]>([])
const rowSelection = {
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: number[]) => {
    selectedRowKeys.value = keys
  }
}

// 获取用户列表
const fetchUserList = async () => {
  if (!props.roleId) return message.warning('逻辑异常，请联系管理员！')
  
  try {
    tableLoading.value = true
    const { data } = await queryUsers({
      currPage: pagination.current,
      pageSize: pagination.pageSize,
      username: formState.username,
      name: formState.name
    })
    
    dataSource.value = data.data.filter(item => item.state)
    pagination.total = data.total
  } catch (error) {
    console.error('获取用户列表失败：', error)
  } finally {
    tableLoading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.current = 1
  fetchUserList()
}

// 重置
const handleReset = () => {
  formState.username = undefined
  formState.name = undefined
  handleSearch()
}

// 表格变化
const handleTableChange = (pag: TablePaginationConfig) => {
  pagination.current = pag.current || 1
  pagination.pageSize = pag.pageSize || 10
  fetchUserList()
}

// 确认
const handleOk = async () => {
  if (!props.roleId) return
  
  try {
    loading.value = true
    await setUserRoles(props.roleId, selectedRowKeys.value)
    message.success('分配用户成功')
    emits('success')
    handleCancel()
  } catch (error) {
    console.error('分配用户失败：', error)
  } finally {
    loading.value = false
  }
}

// 取消
const handleCancel = () => {
  emits('update:visible', false)
  selectedRowKeys.value = []
  formState.username = undefined
  formState.name = undefined
  pagination.current = 1
}

// 监听visible变化
watch(
  () => props.visible,
  (val) => {
    if (val) {
      fetchUserList()
    }
  }
)
</script>

<style lang="scss" scoped>
.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;

  .search-buttons {
    margin-left: auto;
  }
}

.user-table {
  :deep(.ant-table-thead > tr > th) {
    background-color: #fafafa;
    font-weight: 600;
  }

  :deep(.ant-table-tbody > tr > td) {
    padding: 12px 8px;
  }
}
</style>
