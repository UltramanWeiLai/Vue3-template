<template>
  <Container>
    <!-- 搜索区域 -->
    <Box>
      <AForm layout="inline" class="search-form">
        <AFormItem label="权限名称">
          <AInput v-model:value="searchForm.name" placeholder="请输入权限名称" allowClear />
        </AFormItem>
        <AFormItem class="search-buttons">
          <AButton type="primary" :loading="loading" @click="fetchPowerList">查询</AButton>
          <AButton class="ml12" @click="handleReset">重置</AButton>
        </AFormItem>
      </AForm>
    </Box>

    <!-- 列表区域 -->
    <Box class="mt20">
      <div class="table-header">
        <AButton type="primary" @click="handleAdd">
          <template #icon><PlusOutlined /></template>新增权限
        </AButton>
      </div>
      <ATable
        row-key="id"
        :columns="columns"
        :data-source="powerList"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
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
          <template v-else-if="column.dataIndex === 'operate'">
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
                danger
                :icon="DeleteOutlined"
                @click="handleDelete(record)"
              />
            </ASpace>
          </template>
          <template v-else>{{ record[column.dataIndex] || '-' }}</template>
        </template>
      </ATable>
    </Box>

    <!-- 权限表单弹窗 -->
    <PowerModal
      v-model:visible="powerFormVisible"
      :edit-mode="!!currentPower"
      :power-info="currentPower"
      @success="fetchPowerList"
    />
  </Container>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { EditOutlined, DeleteOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons-vue'
import { queryPowers, deletePower, enablePower, disablePower } from '@/api'
import { formatTime } from '@/utils'
import type { IPowerInfo } from '@/api'

import PowerModal from './components/PowerModal/index.vue'

// 表格列配置
const columns = [
  { title: '权限名称', dataIndex: 'name' },
  { title: '资源标识', dataIndex: 'resourceKey' },
  { title: '操作类型', dataIndex: 'action' },
  { title: '描述', dataIndex: 'description' },
  { title: '状态', dataIndex: 'state' },
  { title: '创建人', dataIndex: 'create' },
  { title: '创建时间', dataIndex: 'createTime' },
  { title: '更新人', dataIndex: 'update' },
  { title: '更新时间', dataIndex: 'updateTime' },
  { title: '操作', dataIndex: 'operate', width: 130 },
]

const loading = ref(false)
const powerList = ref<IPowerInfo[]>([])
const searchForm = reactive({ name: '' })
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: (total: number) => `共 ${total} 条`,
})

// 表单状态
const powerFormVisible = ref(false)
const currentPower = ref<IPowerInfo | null>(null)

onMounted(() => {
  fetchPowerList()
})

// 重置
const handleReset = () => {
  searchForm.name = ''
  fetchPowerList()
}

// 表格变化事件
const handleTableChange = ({ current }: { current: number }) => {
  pagination.current = current
  fetchPowerList()
}

// 新增权限
const handleAdd = () => {
  currentPower.value = null
  powerFormVisible.value = true
}

// 编辑权限
const handleEdit = (record: IPowerInfo) => {
  currentPower.value = record
  powerFormVisible.value = true
}

// 删除权限
const handleDelete = async (record: IPowerInfo) => {
  try {
    loading.value = true
    await deletePower(record.id)
    message.success('删除成功')
    fetchPowerList()
  } finally {
    loading.value = false
  }
}

// 切换权限状态
const handleToggleState = async (record: IPowerInfo) => {
  if (record.state === 1) {
    await disablePower(record.id)
    message.success('禁用成功')
  } else {
    await enablePower(record.id)
    message.success('启用成功')
  }
  fetchPowerList()
}

// 获取权限列表
const fetchPowerList = async () => {
  try {
    loading.value = true
    const { data } = await queryPowers({
      name: searchForm.name,
      currPage: pagination.current,
      pageSize: pagination.pageSize,
    })
    powerList.value = data.data
    pagination.total = data.total
  } finally {
    loading.value = false
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
  text-align: right;
  margin-right: 0;
  margin-bottom: 16px;
}
</style>
