<template>
  <Container title="用户管理" :breadcrumb="['系统管理', '用户管理']">
    <!-- 表单 -->
    <Box>
      <AForm :model="formState" layout="inline" class="search-form">
        <AFormItem label="用户名" name="username">
          <AInput v-model:value="formState.username" placeholder="用户名" allow-clear />
        </AFormItem>
        <AFormItem label="昵称" name="name">
          <AInput v-model:value="formState.name" placeholder="昵称" allow-clear />
        </AFormItem>
        <AFormItem class="search-buttons">
          <AButton type="primary" @click="handleSearch">搜索</AButton>
          <AButton class="ml12" @click="handleReset">重置</AButton>
        </AFormItem>
      </AForm>
    </Box>

    <!-- 用户列表 -->
    <Box class="mt20">
      <div class="table-header">
        <AButton type="primary" @click="handleAdd">
          <template #icon><PlusOutlined /></template>新增用户
        </AButton>
      </div>
      <ATable
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        class="user-table"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'state'">
            <ATag :color="record.state === 1 ? 'success' : 'error'">
              {{ record.state === 1 ? '启用' : '禁用' }}
            </ATag>
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <ASpace :size="0">
              <ActionButton type="link" tip="编辑" :icon="EditOutlined" @click="handleEdit(record)" />
              <ActionButton type="link" tip="分配角色" :icon="TeamOutlined" @click="handleAssignRole(record)" />
              <ActionButton
                type="link"
                tip="分配用户组"
                :icon="UsergroupAddOutlined"
                @click="handleAssignGroup(record)"
              />
              <ActionButton
                type="link"
                :tip="record.state === 1 ? '禁用' : '启用'"
                :icon="record.state === 1 ? StopOutlined : CheckCircleOutlined"
                @click="handleToggleState(record)"
              />
              <ActionButton
                type="link"
                tip="删除"
                confirm-title="确定要删除该用户吗？"
                :icon="DeleteOutlined"
                danger
                @click="handleDelete(record)"
              />
            </ASpace>
          </template>
          <!-- 无数据 -->
          <template v-else>{{ record[column.dataIndex] || '-' }}</template>
        </template>
      </ATable>
    </Box>

    <!-- 分配角色弹窗 -->
    <AssignRole v-model:visible="roleVisible" :user-id="currentUser?.id" @success="fetchUserList" />

    <!-- 分配用户组弹窗 -->
    <AssignGroup v-model:visible="groupVisible" :user-id="currentUser?.id" @success="fetchUserList" />

    <!-- 新增/编辑用户弹窗 -->
    <UserModal
      v-model:visible="userFormVisible"
      :edit-mode="!!currentUser"
      :user-info="currentUser"
      @success="fetchUserList"
    />
  </Container>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { message } from 'ant-design-vue'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
  StopOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons-vue'
import { IUserInfo, queryUsers, deleteUser, enableUser, disableUser } from '@/api'

import AssignRole from './components/AssignRole/index.vue'
import AssignGroup from './components/AssignGroup/index.vue'
import UserModal from './components/UserModal/index.vue'

// 弹窗控制
const roleVisible = ref(false)
const groupVisible = ref(false)
const userFormVisible = ref(false)
const currentUser = ref<IUserInfo>()

interface FormState {
  username?: string
  name?: string
}

const formState = reactive<FormState>({ username: undefined, name: undefined })

const loading = ref(false)
const dataSource = ref<IUserInfo[]>([])

const columns = [
  { title: '用户名', dataIndex: 'username' },
  { title: '昵称', dataIndex: 'name' },
  { title: '邮箱', dataIndex: 'email' },
  { title: '手机号', dataIndex: 'phone' },
  { title: '状态', dataIndex: 'state' },
  { title: '创建时间', dataIndex: 'createTime' },
  { title: '操作', dataIndex: 'action', width: 180 },
]

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
})

onMounted(() => {
  fetchUserList()
})

const handleToggleState = async (record: IUserInfo) => {
  try {
    loading.value = true
    if (record.state === 1) {
      await disableUser(record.id)
      message.success('禁用成功')
    } else {
      await enableUser(record.id)
      message.success('启用成功')
    }
    fetchUserList()
  } finally {
    loading.value = false
  }
}

const fetchUserList = async () => {
  try {
    loading.value = true
    const res = await queryUsers({ ...formState, currPage: pagination.current, pageSize: pagination.pageSize })
    dataSource.value = res.data.data
    pagination.total = res.data.total
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.current = 1
  fetchUserList()
}

const handleReset = () => {
  formState.username = undefined
  formState.name = undefined
  pagination.current = 1
  fetchUserList()
}

const handleTableChange = (pag: { current: number; pageSize: number }) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchUserList()
}

const handleAdd = () => {
  userFormVisible.value = true
  currentUser.value = undefined
}

const handleEdit = (record: IUserInfo) => {
  currentUser.value = record
  userFormVisible.value = true
}

const handleDelete = async (record: IUserInfo) => {
  await deleteUser(record.id)
  message.success('删除成功')
  fetchUserList()
}

// 分配角色
const handleAssignRole = (record: IUserInfo) => {
  currentUser.value = record
  roleVisible.value = true
}

// 分配用户组
const handleAssignGroup = (record: IUserInfo) => {
  currentUser.value = record
  groupVisible.value = true
}
</script>

<style lang="scss" scoped>
.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;

  .search-buttons {
    margin-left: auto;
    margin-right: 0;
  }
}

.table-header {
  text-align: right;
  margin-bottom: 16px;
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
