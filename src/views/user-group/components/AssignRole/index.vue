<template>
  <AModal v-model:open="visible" title="分配角色" @ok="handleOk" @cancel="handleCancel" :confirm-loading="loading">
    <ACheckboxGroup v-model:value="selectedRoles">
      <ASpace direction="vertical">
        <ACheckbox v-for="role in roleList" :key="role.id" :value="role.id">
          {{ role.name }}
        </ACheckbox>
      </ASpace>
    </ACheckboxGroup>
  </AModal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from 'vue'
import { message } from 'ant-design-vue'
import { IRoleInfo, queryRoles, assignRoles, getUserGroupInfo } from '@/api'

interface Props {
  visible: boolean
  groupId?: number
}

const props = defineProps<Props>()
const emits = defineEmits(['update:visible', 'success'])

const visible = computed({
  get: () => props.visible,
  set: (val: boolean) => emits('update:visible', val),
})

const selectedRoles = ref<number[]>([])
const roleList = ref<IRoleInfo[]>([])
const loading = ref(false)

onMounted(() => {
  fetchRoleList()
})

watchEffect(() => {
  if (props.groupId && props.visible) getUserGroupDetail(props.groupId)
})

const fetchRoleList = async () => {
  loading.value = true
  try {
    const res = await queryRoles({ pageSize: 999 })
    roleList.value = res.data.data
  } finally {
    loading.value = false
  }
}

const getUserGroupDetail = async (id: number) => {
  try {
    loading.value = true
    const res = await getUserGroupInfo(id)
    selectedRoles.value = res.data.role || []
  } finally {
    loading.value = false
  }
}

const handleOk = async () => {
  if (!props.groupId) return message.warning('逻辑异常，请联系管理员！')
  if (!selectedRoles.value.length) return message.warning('请选择角色！')

  try {
    loading.value = true
    await assignRoles(props.groupId, selectedRoles.value)
    message.success('分配角色成功')
    handleCancel()
    emits('success')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  selectedRoles.value = []
  visible.value = false
}
</script>
