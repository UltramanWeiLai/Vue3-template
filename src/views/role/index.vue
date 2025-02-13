<template>
  <Container title="角色管理" :breadcrumb="['系统管理', '角色管理']">
    <!-- 搜索表单 -->
    <Box>
      <AForm :model="formState" layout="inline" class="search-form">
        <AFormItem label="角色名称" name="name">
          <AInput v-model:value="formState.name" placeholder="角色名称" allowClear />
        </AFormItem>
        <AFormItem class="search-buttons">
          <AButton type="primary" @click="handleSearch">搜索</AButton>
          <AButton class="ml12"@click="handleReset">重置</AButton>
        </AFormItem>
      </AForm>
    </Box>

    <!-- 角色列表 -->
    <Box class="mt20">
      <div class="table-header">
        <AButton type="primary" @click="handleAdd">
          <template #icon><PlusOutlined /></template>新增角色
        </AButton>
      </div>
      <ATable
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        class="role-table"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'status'">
            <ATag :color="record.state === 1 ? 'success' : 'error'">
              {{ record.state === 1 ? '启用' : '禁用' }}
            </ATag>
          </template>
          <template v-else-if="['createTime', 'updateTime'].includes(column.dataIndex)">
            {{ formatTime(record[column.dataIndex]) }}
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <ASpace :size="0">
              <ActionButton type="link" tip="编辑" :icon="EditOutlined" @click="handleEdit(record)" />
              <ActionButton type="link" tip="分配权限" :icon="ControlOutlined" @click="handleAssignPower(record)" />
              <ActionButton type="link" tip="分配用户" :icon="UserOutlined" @click="handleAssignUser(record)" />
              <ActionButton type="link" tip="分配用户组" :icon="UsergroupAddOutlined" @click="handleAssignUserGroup(record)" />
              <ActionButton
                type="link"
                :tip="record.state === 1 ? '禁用' : '启用'"
                :icon="record.state === 1 ? StopOutlined : CheckCircleOutlined"
                @click="handleToggleStatus(record)"
              />
              <ActionButton type="link" tip="删除" confirmTitle="确定要删除该角色吗？" :icon="DeleteOutlined" danger @click="handleDelete(record)" />
            </ASpace>
          </template>
          <!-- 无数据 -->
          <template v-else>{{ record[column.dataIndex] || '-' }}</template>
        </template>
      </ATable>
    </Box>

    <!-- 角色表单弹窗 -->
    <RoleModal
      v-model:visible="roleFormVisible"
      :edit-mode="!!currentRole"
      :role-info="currentRole"
      @success="fetchRoleList"
    />

    <!-- 权限分配弹窗 -->
    <AssignPower
      v-model:visible="powerVisible"
      :role-id="currentRole?.id"
      @success="fetchRoleList"
    />

    <!-- 用户分配弹窗 -->
    <AssignUser
      v-model:visible="userVisible"
      :role-id="currentRole?.id"
      @success="fetchRoleList"
    />

    <!-- 用户组分配弹窗 -->
    <AssignUserGroup
      v-model:visible="userGroupVisible"
      :role-id="currentRole?.id"
      @success="fetchRoleList"
    />

  </Container>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, EditOutlined, DeleteOutlined, ControlOutlined, StopOutlined, CheckCircleOutlined, UserOutlined, UsergroupAddOutlined } from '@ant-design/icons-vue'
import { IRoleInfo, queryRoles, deleteRole, enableRole, disableRole } from '@/api'
import { formatTime } from '@/utils'

import RoleModal from './components/RoleModal/index.vue'
import AssignPower from './components/AssignPower/index.vue'
import AssignUser from './components/AssignUser/index.vue'
import AssignUserGroup from './components/AssignUserGroup/index.vue'

// 弹窗控制
const roleFormVisible = ref(false)
const powerVisible = ref(false)
const userVisible = ref(false)
const userGroupVisible = ref(false)
const currentRole = ref<IRoleInfo>()

interface FormState {
  name?: string
}

const formState = reactive<FormState>({ name: undefined })

const loading = ref(false)
const dataSource = ref<IRoleInfo[]>([])

const columns = [
  { title: '角色名称', dataIndex: 'name' },
  { title: '描述', dataIndex: 'description' },
  { title: '状态', dataIndex: 'status' },
  { title: '创建人', dataIndex: 'create' },
  { title: '创建时间', dataIndex: 'createTime' },
  { title: '更新人', dataIndex: 'update' },
  { title: '更新时间', dataIndex: 'updateTime' },
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
  fetchRoleList()
})

const fetchRoleList = async () => {
  try {
    loading.value = true
    const res = await queryRoles({ ...formState, currPage: pagination.current, pageSize: pagination.pageSize })
    dataSource.value = res.data.data
    pagination.total = res.data.total
  } catch (error) {
    message.error('获取角色列表失败')
  } finally {
    loading.value = false
  }
}

const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchRoleList()
}

const handleSearch = () => {
  pagination.current = 1
  fetchRoleList()
}

const handleReset = () => {
  formState.name = undefined
  pagination.current = 1
  fetchRoleList()
}

const handleAdd = () => {
  currentRole.value = undefined
  roleFormVisible.value = true
}

const handleEdit = (record: IRoleInfo) => {
  currentRole.value = record
  roleFormVisible.value = true
}

const handleAssignPower = (record: IRoleInfo) => {
  currentRole.value = record
  powerVisible.value = true
}

const handleAssignUser = (record: IRoleInfo) => {
  currentRole.value = record
  userVisible.value = true
}

const handleAssignUserGroup = (record: IRoleInfo) => {
  currentRole.value = record
  userGroupVisible.value = true
}

const handleToggleStatus = async (record: IRoleInfo) => {
  if (record.state === 1) {
    await disableRole(record.id)
    message.success('禁用成功')
  } else {
    await enableRole(record.id)
    message.success('启用成功')
  }
  fetchRoleList()
}

const handleDelete = async (record: IRoleInfo) => {
  await deleteRole(record.id)
  message.success('删除成功')
  fetchRoleList()
}
</script>

<style lang="scss" scoped>
.search-form {
  .search-buttons {
    margin-left: auto;
    margin-right: 0;
  }
}

.table-header {
  margin-bottom: 16px;
  text-align: right;
}
</style>
