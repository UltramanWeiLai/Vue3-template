<template>
  <Container title="资源管理" :breadcrumb="['系统管理', '资源管理']">
    <!-- 搜索表单 -->
    <Box>
      <AForm :model="formState" layout="inline" class="search-form">
        <AFormItem label="资源名称" name="name">
          <AInput v-model:value="formState.name" placeholder="资源名称" allow-clear />
        </AFormItem>
        <AFormItem class="search-buttons">
          <AButton type="primary" @click="handleSearch">搜索</AButton>
          <AButton class="ml12" @click="handleReset">重置</AButton>
        </AFormItem>
      </AForm>
    </Box>

    <!-- 资源列表 -->
    <Box class="mt20">
      <div class="table-header">
        <AButton type="primary" @click="handleAdd">
          <template #icon><PlusOutlined /></template>新增资源
        </AButton>
      </div>
      <ATable
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        class="resource-table"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'state'">
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
          <template v-else>{{ record[column.dataIndex] || '-' }}</template>
        </template>
      </ATable>
    </Box>

    <!-- 资源表单弹窗 -->
    <ResourceForm
      v-model:visible="resourceFormVisible"
      :edit-mode="!!currentResource"
      :resource-info="currentResource"
      @success="fetchResourceList"
    />
  </Container>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, EditOutlined, DeleteOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons-vue'
import { queryResources, deleteResource, enableResource, disableResource } from '@/api'
import { formatTime } from '@/utils'
import type { IResourceInfo } from '@/api'

import ResourceForm from './components/ResourceModal/index.vue'

// 表单状态
const formState = reactive({
  name: undefined,
})

// 表格相关
const loading = ref(false)
const dataSource = ref<IResourceInfo[]>([])

const columns = [
  { title: '资源名称', dataIndex: 'name' },
  { title: '资源标识', dataIndex: 'key' },
  { title: '描述', dataIndex: 'description' },
  { title: '状态', dataIndex: 'state' },
  { title: '创建人', dataIndex: 'create' },
  { title: '创建时间', dataIndex: 'createTime' },
  { title: '更新人', dataIndex: 'update' },
  { title: '更新时间', dataIndex: 'updateTime' },
  { title: '操作', dataIndex: 'action', width: 130 },
]

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
})

// 资源表单相关
const resourceFormVisible = ref(false)
const currentResource = ref<IResourceInfo>()

onMounted(() => {
  fetchResourceList()
})

// 获取资源列表
const fetchResourceList = async () => {
  try {
    loading.value = true
    const { data } = await queryResources({
      currPage: pagination.current,
      pageSize: pagination.pageSize,
      name: formState.name,
    })
    dataSource.value = data.data
    pagination.total = data.total
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.current = 1
  fetchResourceList()
}

// 重置
const handleReset = () => {
  formState.name = undefined
  handleSearch()
}

// 表格变化
const handleTableChange = ({ current, pageSize }: { current: number; pageSize: number }) => {
  pagination.current = current
  pagination.pageSize = pageSize
  fetchResourceList()
}

// 新增资源
const handleAdd = () => {
  currentResource.value = undefined
  resourceFormVisible.value = true
}

// 编辑资源
const handleEdit = (record: IResourceInfo) => {
  currentResource.value = record
  resourceFormVisible.value = true
}

// 删除资源
const handleDelete = async (record: IResourceInfo) => {
  try {
    loading.value = true
    await deleteResource(record.id)
    message.success('删除成功')
    fetchResourceList()
  } finally {
    loading.value = false
  }
}

// 切换资源状态
const handleToggleState = async (record: IResourceInfo) => {
  try {
    loading.value = true
    if (record.state === 1) {
      await disableResource(record.id)
      message.success('禁用成功')
    } else {
      await enableResource(record.id)
      message.success('启用成功')
    }
    fetchResourceList()
  } finally {
    loading.value = true
  }
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
