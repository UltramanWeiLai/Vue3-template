<template>
  <AModal
    :open="visible"
    :title="editMode ? '编辑权限' : '新增权限'"
    :confirm-loading="loading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <AForm ref="formRef" :model="formData" :rules="rules" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
      <AFormItem label="权限名称" name="name">
        <AInput v-model:value="formData.name" placeholder="请输入权限名称" allow-clear />
      </AFormItem>
      <AFormItem label="操作类型" name="action">
        <ASelect v-model:value="formData.action" :options="actionOptions" allow-clear placeholder="请选择操作类型" />
      </AFormItem>
      <AFormItem label="资源" name="resourceKey">
        <ASelect
          v-model:value="formData.resourceKey"
          :options="resourceList"
          :loading="resourceLoading"
          :field-names="{ label: 'name', value: 'key' }"
          :filter-option="filterOption"
          show-search
          allow-clear
          placeholder="请选择资源"
        />
      </AFormItem>
      <AFormItem label="描述" name="description">
        <ATextarea v-model:value="formData.description" placeholder="请输入权限描述" :rows="4" allow-clear />
      </AFormItem>
    </AForm>
  </AModal>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { createPower, updatePower, PowerAction, queryResources } from '@/api'

import type { FormInstance } from 'ant-design-vue'
import type { IPowerInfo, IPowerParams, IResourceInfo } from '@/api'

interface Props {
  visible: boolean
  editMode?: boolean
  powerInfo?: IPowerInfo | null
}

const props = defineProps<Props>()
const emits = defineEmits(['update:visible', 'success'])

const visible = computed({
  get: () => props.visible,
  set: (val: boolean) => emits('update:visible', val),
})
const loading = ref(false)
const resourceList = ref<IResourceInfo[]>([])
const resourceLoading = ref(false)
const formRef = ref<FormInstance>()
const formData = ref<Partial<IPowerParams>>({
  name: undefined,
  action: undefined,
  resourceKey: undefined,
  description: undefined,
})

const actionOptions = [
  { label: '管理', value: PowerAction.Manage },
  { label: '创建', value: PowerAction.Create },
  { label: '查看', value: PowerAction.View },
  { label: '更新', value: PowerAction.Update },
  { label: '删除', value: PowerAction.Delete },
]

// 表单校验规则
const rules = {
  name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
  action: [{ required: true, message: '请选择操作类型', trigger: 'change' }],
  resourceKey: [{ required: true, message: '请选择资源', trigger: 'change' }],
}

// 监听编辑模式
watch(
  () => props.visible,
  () => {
    if (props.visible && props.powerInfo) {
      const val = props.powerInfo
      formData.value = {
        name: val.name,
        action: val.action,
        resourceKey: val.resourceKey,
        description: val.description,
      }
    }
  }
)

// 提交表单
const handleSubmit = () => {
  formRef.value?.validate().then(async () => {
    try {
      loading.value = true
      if (props.editMode && props.powerInfo) {
        await updatePower(props.powerInfo.id, formData.value as IPowerParams)
        message.success('更新成功')
      } else {
        await createPower(formData.value as IPowerParams)
        message.success('创建成功')
      }
      handleCancel()
      emits('success')
    } finally {
      loading.value = false
    }
  })
}

// 关闭弹窗
const handleCancel = () => {
  formRef.value?.resetFields()
  visible.value = false
}

const filterOption = (input: string, option: IResourceInfo) => {
  return option.name.toLowerCase().indexOf(input.toLowerCase()) >= 0
}

// 获取资源列表
const fetchResourceList = async () => {
  resourceLoading.value = true
  try {
    const res = await queryResources({ currPage: 1, pageSize: 999 })
    resourceList.value = res.data.data
  } finally {
    resourceLoading.value = false
  }
}

onMounted(() => {
  fetchResourceList()
})
</script>
