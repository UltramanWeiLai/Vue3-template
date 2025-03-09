<template>
  <AModal v-model:open="visible" title="分配用户组" @ok="handleOk" @cancel="handleCancel" :confirm-loading="loading">
    <ASpin :spinning="loading">
      <ACheckboxGroup v-model:value="selectedGroups">
        <ASpace direction="vertical">
          <ACheckbox v-for="group in groupList" :key="group.id" :value="group.id">
            {{ group.name }}
          </ACheckbox>
        </ASpace>
      </ACheckboxGroup>
    </ASpin>
  </AModal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from 'vue'
import { message } from 'ant-design-vue'
import { queryUserGroups, IUserGroupInfo, getUserInfo, setUserGroups } from '@/api'

interface Props {
  visible: boolean
  userId?: number
}

const props = defineProps<Props>()
const emits = defineEmits(['update:visible', 'success'])
const visible = computed({
  get: () => props.visible,
  set: (val: boolean) => emits('update:visible', val),
})

const loading = ref(false)
const selectedGroups = ref<number[]>([])
const groupList = ref<IUserGroupInfo[]>([])

onMounted(() => {
  fetchGroupList()
})

watchEffect(() => {
  if (props.visible && props.userId) getUserDetail(props.userId)
})

// 获取用户组列表
const fetchGroupList = async () => {
  try {
    loading.value = true
    const res = await queryUserGroups({ pageSize: 999 })
    groupList.value = res.data.data
  } finally {
    loading.value = false
  }
}

const getUserDetail = async (id: number) => {
  try {
    loading.value = true
    const res = await getUserInfo(id)
    selectedGroups.value = (res.data.groups || []).map(item => item.id)
  } finally {
    loading.value = false
  }
}

const handleOk = async () => {
  if (!props.userId) return
  try {
    loading.value = true
    await setUserGroups(props.userId, selectedGroups.value)
    message.success('分配用户组成功')
    handleCancel()
    emits('success')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  visible.value = false
  selectedGroups.value = []
}
</script>
