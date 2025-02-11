<template>
  <Container title="用户组管理" :breadcrumb="['系统管理', '用户组管理']">
    <!-- 搜索表单 -->
    <Box>
      <AForm :model="formState" layout="inline" class="search-form">
        <AFormItem label="用户组名称" name="name">
          <AInput v-model:value="formState.name" placeholder="用户组名称" allowClear />
        </AFormItem>
        <AFormItem class="search-buttons">
          <AButton type="primary" @click="handleSearch">搜索</AButton>
          <AButton @click="handleReset">重置</AButton>
        </AFormItem>
      </AForm>
    </Box>

    <!-- 用户组列表 -->
    <Box class="mt20">
      <div class="table-header">
        <AButton type="primary" @click="handleAdd">
          <template #icon><PlusOutlined /></template>新增用户组
        </AButton>
      </div>
      <ATable
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        class="user-group-table"
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
              <ActionButton type="link" tip="分配用户" :icon="UsergroupAddOutlined" @click="handleAssignUser(record)" />
              <ActionButton type="link" tip="分配角色" :icon="TeamOutlined" @click="handleAssignRole(record)" />
              <ActionButton
                type="link"
                :tip="record.state === 1 ? '禁用' : '启用'"
                :icon="record.state === 1 ? StopOutlined : CheckCircleOutlined"
                @click="handleToggleState(record)"
              />
              <ActionButton type="link" tip="删除" confirmTitle="确定要删除该用户组吗？" :icon="DeleteOutlined" danger @click="handleDelete(record)" />
            </ASpace>
          </template>
          <!-- 无数据 -->
          <template v-else>{{ record[column.dataIndex] || '-' }}</template>
        </template>
      </ATable>
    </Box>

    <!-- 新增/编辑用户组弹窗 -->
    <UserGroupModal
      v-model:visible="userGroupFormVisible"
      :edit-mode="!!currentUserGroup"
      :user-group-info="currentUserGroup"
      @success="fetchUserGroupList"
    />

    <!-- 分配用户弹窗 -->
    <AssignUser
      v-model:visible="userVisible"
      :group-id="currentUserGroup?.id"
      @success="fetchUserGroupList"
    />

    <!-- 分配角色弹窗 -->
    <AssignRole
      v-model:visible="roleVisible"
      :group-id="currentUserGroup?.id"
      @success="fetchUserGroupList"
    />

  </Container>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined, UsergroupAddOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons-vue'
import { IUserGroupInfo, queryUserGroups, deleteUserGroup, enableUserGroup, disableUserGroup } from '@/api'

import UserGroupModal from './components/UserGroupModal/index.vue'
import AssignUser from './components/AssignUser/index.vue'
import AssignRole from './components/AssignRole/index.vue'

// 弹窗控制
const userVisible = ref(false)
const roleVisible = ref(false)
const userGroupFormVisible = ref(false)
const currentUserGroup = ref<IUserGroupInfo>()

interface FormState {
  name?: string
}

const formState = reactive<FormState>({ name: undefined })

const loading = ref(false)
const dataSource = ref<IUserGroupInfo[]>([])

const columns = [
  { title: '用户组', dataIndex: 'name' },
  { title: '描述', dataIndex: 'description' },
  { title: '状态', dataIndex: 'state' },
  { title: '创建时间', dataIndex: 'createTime' },
  { title: '操作', dataIndex: 'action', width: 140 }
]

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true
})

onMounted(() => {
  fetchUserGroupList()
})

const fetchUserGroupList = async () => {
  try {
    loading.value = true
    const res = await queryUserGroups({ ...formState, currPage: pagination.current, pageSize: pagination.pageSize })
    dataSource.value = res.data.data
    pagination.total = res.data.total
  } catch (error) {
    message.error('获取用户组列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.current = 1
  fetchUserGroupList()
}

const handleReset = () => {
  formState.name = undefined
  pagination.current = 1
  fetchUserGroupList()
}

const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchUserGroupList()
}

const handleAdd = () => {
  userGroupFormVisible.value = true
  currentUserGroup.value = undefined
}

const handleEdit = (record: IUserGroupInfo) => {
  currentUserGroup.value = record
  userGroupFormVisible.value = true
}

const handleDelete = async (record: IUserGroupInfo) => {
  await deleteUserGroup(record.id)
  message.success('删除成功')
  fetchUserGroupList()
}

// 分配用户
const handleAssignUser = (record: IUserGroupInfo) => {
  currentUserGroup.value = record
  userVisible.value = true
}

// 分配角色
const handleAssignRole = (record: IUserGroupInfo) => {
  currentUserGroup.value = record
  roleVisible.value = true
}
const handleToggleState = async (record: IUserGroupInfo) => {
  if (record.state === 1) {
    await disableUserGroup(record.id)
    message.success('禁用成功')
  } else {
    await enableUserGroup(record.id)
    message.success('启用成功')
  }
  fetchUserGroupList()
}
</script>

<style lang="scss" scoped>
.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;

  .search-buttons {
    margin-left: auto;
    
    .ant-btn + .ant-btn {
      margin-left: 8px;
    }
  }
}

.table-header {
  text-align: right;
  margin-bottom: 16px;
}

.user-group-table {
  :deep(.ant-table-thead > tr > th) {
    background-color: #fafafa;
    font-weight: 600;
  }

  :deep(.ant-table-tbody > tr > td) {
    padding: 12px 8px;
  }
}
</style>
