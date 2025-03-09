<template>
  <AModal
    v-model:open="visible"
    title="分配用户"
    @ok="handleOk"
    @cancel="handleCancel"
    :confirm-loading="loading"
    width="800px"
  >
    <AAlert type="warning" message="此处只显示和角色拥有直接关系的用户，不包括用户组的！" />
    <ASpin :spinning="loading">
      <!-- 用户列表 -->
      <ATable
        :columns="columns"
        :data-source="dataSource"
        :loading="tableLoading"
        :pagination="false"
        :row-selection="rowSelection"
        class="user-table mt20"
        row-key="id"
      />
    </ASpin>
  </AModal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { queryUsers, getRoleInfo, setRoleUsers } from '@/api'
import type { IUserInfo } from '@/api'

interface IProps {
  visible: boolean
  roleId?: number
}

const props = defineProps<IProps>()
const emits = defineEmits(['update:visible', 'success'])
const loading = ref(false)
const visible = computed({
  get: () => props.visible,
  set: (val: boolean) => emits('update:visible', val),
})

// 表格配置
const columns = [
  { title: '用户名', dataIndex: 'username' },
  { title: '昵称', dataIndex: 'name' },
  { title: '邮箱', dataIndex: 'email' },
  { title: '手机号', dataIndex: 'phone' },
]

// 表格数据
const dataSource = ref<IUserInfo[]>([])
const tableLoading = ref(false)

// 表格选择
const selectedRowKeys = ref<number[]>([])
const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: number[]) => {
    selectedRowKeys.value = keys
  },
}))

onMounted(() => {
  fetchUserList()
})

// 监听visible变化
watch(
  () => props.visible,
  val => {
    if (val && props.roleId) getRoleDetail(props.roleId)
  }
)

// 获取用户详情
const getRoleDetail = async (id: number) => {
  try {
    tableLoading.value = true
    const { data } = await getRoleInfo(id)
    selectedRowKeys.value = data.userIds || []
  } finally {
    tableLoading.value = false
  }
}

// 获取用户列表
const fetchUserList = async () => {
  try {
    tableLoading.value = true
    const { data } = await queryUsers({ currPage: 1, pageSize: 9999 })
    dataSource.value = data.data.filter(item => item.state)
  } finally {
    tableLoading.value = false
  }
}

// 确认
const handleOk = async () => {
  if (!props.roleId) return message.warning('逻辑错误，请联系管理员！')

  try {
    loading.value = true
    await setRoleUsers(props.roleId, selectedRowKeys.value)
    message.success('分配用户成功')
    handleCancel()
    emits('success')
  } finally {
    loading.value = false
  }
}

// 取消
const handleCancel = () => {
  visible.value = false
  selectedRowKeys.value = []
}
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
