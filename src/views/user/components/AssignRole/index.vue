<template>
  <AModal
    v-model:open="visible"
    title="分配角色"
    @ok="handleOk"
    @cancel="handleCancel"
    :confirmLoading="loading"
  >
    <ASpin :spinning="loading">
      <div class="role-section">
        <div class="section-title">
          <ATypographyTitle :level="5">用户角色（可编辑）</ATypographyTitle>
        </div>
        <ACheckboxGroup v-model:value="selectedRoles">
          <ASpace direction="vertical">
            <ACheckbox v-for="role in roleList" :key="role.id" :value="role.id">
              {{ role.name }}
            </ACheckbox>
          </ASpace>
        </ACheckboxGroup>
      </div>

      <ADivider />

      <div class="role-section">
        <div class="section-title">
          <ATypographyTitle :level="5">用户组角色（只读）</ATypographyTitle>
        </div>
        <div class="group-roles">
          <ATag v-for="role in groupRoles" :key="role.id" color="blue">{{ role.name }}</ATag>
          <ATooltip>
            <template #title>用户组角色由所属用户组决定，不可在此修改</template>
            <InfoCircleOutlined />
          </ATooltip>
          <div v-if="!groupRoles.length" class="no-roles">暂无用户组角色</div>
        </div>

      </div>
    </ASpin>
  </AModal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from 'vue'
import { message } from 'ant-design-vue'
import { InfoCircleOutlined } from '@ant-design/icons-vue'
import { queryRoles, IRoleInfo, getUserInfo, setUserRoles } from '@/api'

interface IProps {
  visible: boolean
  userId?: number
}

const props = defineProps<IProps>()
const emits = defineEmits(['update:visible', 'success'])
const visible = computed({
  get: () => props.visible,
  set: (val: boolean) => emits('update:visible', val),
})

const loading = ref(false)
const selectedRoles = ref<number[]>([])
const roleList = ref<IRoleInfo[]>([])
const groupRoles = ref<IRoleInfo[]>([])

onMounted(() => {
  fetchRoleList()
})

watchEffect(() => {
  if (props.visible && props.userId) getUserDetail(props.userId)
})

// 获取角色列表
const fetchRoleList = async () => {
  try {
    loading.value = true
    const res = await queryRoles({ pageSize: 999 })
    roleList.value = res.data.data
  } finally {
    loading.value = false
  }
}

const getUserDetail = async (id: number) => {
  try {
    loading.value = true
    const res = await getUserInfo(id)
    selectedRoles.value = res.data.userRoleIds || []
    // 找出用户组角色对应的角色信息
    const groupRoleIds = res.data.userGroupRoleIds || []
    groupRoles.value = roleList.value.filter(role => groupRoleIds.includes(role.id))
  } finally {
    loading.value = false
  }
}

const handleOk = async () => {
  if (!props.userId) return
  try {
    loading.value = true
    await setUserRoles(props.userId, selectedRoles.value)
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
<style lang="scss" scoped>

.role-section {
  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;

    :deep(.ant-typography) {
      margin-bottom: 0;
    }
  }

  .group-roles {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    .no-roles {
      color: #999;
      font-size: 14px;
    }
  }
}
</style>
