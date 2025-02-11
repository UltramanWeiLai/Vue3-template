<template>
  <AModal
    v-model:open="visible"
    title="分配权限"
    @ok="handleOk"
  >
    <ATree
      v-model:checkedKeys="checkedKeys"
      :tree-data="powerTree"
      checkable
      :defaultExpandAll="true"
    />
  </AModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import { updateRolePowers } from '@/api'

interface Props {
  visible: boolean
  roleId?: number
}

const props = defineProps<Props>()
const emits = defineEmits(['update:visible', 'success'])
const visible = computed({
  get: () => props.visible,
  set: (val: boolean) => emits('update:visible', val),
})

const checkedKeys = ref<number[]>([])
const powerTree = ref([])

const handleOk = async () => {
  if (!props.roleId) return
  
  try {
    await updateRolePowers(props.roleId, checkedKeys.value)
    message.success('分配权限成功')
    emits('success')
    emits('update:visible', false)
  } catch (error) {
    message.error('分配权限失败')
  }
}
</script>
