<template>
  <AModal
    v-model:open="visible"
    title="分配用户"
    @ok="handleOk"
    @cancel="handleCancel"
    :confirmLoading="loading"
  >
    <ACheckboxGroup v-model:value="selectedUsers">
      <ASpace direction="vertical">
        <ACheckbox v-for="user in userList" :key="user.id" :value="user.id">
          {{ user.username }} ({{ user.name || '-' }})
        </ACheckbox>
      </ASpace>
    </ACheckboxGroup>
  </AModal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from 'vue'
import { message } from 'ant-design-vue'
import { IUserInfo, queryUsers, assignUsers, getUserGroupInfo } from '@/api'


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

const selectedUsers = ref<number[]>([])
const userList = ref<IUserInfo[]>([])
const loading = ref(false)

onMounted(() => {
  fetchUserList()
})

watchEffect(() => {
  if (props.groupId && props.visible) getUserGroupDetail(props.groupId)
})

const fetchUserList = async () => {
  loading.value = true
  try {
    const res = await queryUsers({ pageSize: 999 })
    userList.value = res.data.data
  } finally {
    loading.value = false
  }
}

const getUserGroupDetail = async (id: number) => {
  try {
    loading.value = true
    const res = await getUserGroupInfo(id)
    selectedUsers.value = res.data.user || []
  } finally {
    loading.value = false
  }
}

const handleOk = async () => {
  if (!props.groupId) return message.warning('逻辑异常，请联系管理员！')
  if (!selectedUsers.value.length) return message.warning('请选择用户组！')
  
  try {
    loading.value = true
    await assignUsers(props.groupId, selectedUsers.value)
    message.success('分配用户成功')
    handleCancel()
    emits('success')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  selectedUsers.value = []
  visible.value = false
}
</script>
