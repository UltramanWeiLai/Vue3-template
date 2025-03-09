<template>
  <AModal
    v-model:open="visible"
    title="分配用户组"
    @ok="handleOk"
    @cancel="handleCancel"
    :confirm-loading="loading"
    width="800px"
  >
    <ASpin :spinning="loading">
      <ACheckboxGroup v-model:value="selectedRowKeys">
        <ASpace direction="vertical">
          <ACheckbox v-for="group in dataSource" :key="group.id" :value="group.id">
            {{ group.name }} - {{ group.description }}
          </ACheckbox>
        </ASpace>
      </ACheckboxGroup>
    </ASpin>
  </AModal>
</template>

<script setup lang="ts">
import { ref, watchEffect, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { queryUserGroups, getRoleInfo, setRoleUserGroups } from '@/api'

import type { IUserGroupInfo } from '@/api'

interface IProps {
  visible: boolean
  roleId?: number
}

const props = defineProps<IProps>()
const emits = defineEmits(['update:visible', 'success'])
const loading = ref(false)
const tableLoading = ref(false)
const visible = computed({
  get: () => props.visible,
  set: (val: boolean) => emits('update:visible', val),
})

// 表格数据
const dataSource = ref<IUserGroupInfo[]>([])
const selectedRowKeys = ref<number[]>([])

onMounted(() => {
  fetchUserGroupList()
})

watchEffect(() => {
  if (props.roleId && props.visible) getRoleDetail(props.roleId)
})

// 获取用户组列表
const fetchUserGroupList = async () => {
  try {
    tableLoading.value = true
    const res = await queryUserGroups({ currPage: 1, pageSize: 9999 })
    dataSource.value = res.data.data
  } finally {
    tableLoading.value = false
  }
}

// 获取角色已分配的用户组
const getRoleDetail = async (id: number) => {
  try {
    loading.value = true
    const res = await getRoleInfo(id)
    selectedRowKeys.value = res.data.userGroupIds || []
  } finally {
    loading.value = false
  }
}

// 确认分配
const handleOk = async () => {
  if (!props.roleId) return message.warning('逻辑错误，请联系管理员！')
  try {
    loading.value = true
    await setRoleUserGroups(props.roleId, selectedRowKeys.value)
    message.success('分配用户组成功')
    handleCancel()
    emits('success')
  } finally {
    loading.value = false
  }
}

// 取消分配
const handleCancel = () => {
  selectedRowKeys.value = []
  visible.value = false
}
</script>

<style lang="scss" scoped></style>
