<template>
  <AModal
    :open="visible"
    :title="editMode ? '编辑资源' : '新增资源'"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <AForm
      ref="formRef"
      :model="formState"
      :rules="rules"
      labelAlign="right"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 16 }"
    >
      <AFormItem label="资源名称" name="name">
        <AInput v-model:value="formState.name" placeholder="请输入资源名称" />
      </AFormItem>
      <AFormItem label="资源 Key" name="name">
        <AInput v-model:value="formState.key" :disabled="editMode" placeholder="请输入资源 Key" />
      </AFormItem>
      <AFormItem label="资源描述" name="description">
        <ATextarea v-model:value="formState.description" placeholder="请输入资源描述" />
      </AFormItem>
    </AForm>
  </AModal>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { message } from 'ant-design-vue'
import { createResource, updateResource } from '@/api'

import type { FormInstance } from 'ant-design-vue'
import type { IResourceInfo, IResourceParams } from '@/api'

interface Props {
  visible: boolean
  editMode?: boolean
  resourceInfo?: IResourceInfo
}

const props = defineProps<Props>()
const emits = defineEmits(['update:visible', 'success'])
const formRef = ref<FormInstance>()
const confirmLoading = ref(false)
const formState = reactive<Partial<IResourceParams>>({ name: undefined, key: undefined })
const visible = computed({
  get: () => props.visible,
  set: (val: boolean) => emits('update:visible', val),
})

const rules = {
  name: [
    { required: true, message: '请输入资源名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 64 个字符', trigger: 'blur' }
  ],
  key: [
    { required: true, message: '请输入资源 Key', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 128 个字符', trigger: 'blur' }
  ]
}

// 监听编辑模式下的资源信息变化
watch(
  () => props.visible,
  () => {
    if (props.resourceInfo && props.visible) {
      const newVal = props.resourceInfo
      formState.name = newVal.name
      formState.key = newVal.key
      formState.description = newVal.description || undefined
    }
  }
)

// 取消
const handleCancel = () => {
  visible.value = false
  formRef.value?.resetFields()
  formState.name = undefined
  formState.key = undefined
  formState.description = undefined
}

// 确认
const handleOk = () => {
  formRef.value?.validate().then(async () => {
    try {
      confirmLoading.value = true
      if (props.editMode && props.resourceInfo) {
        await updateResource(props.resourceInfo.id, formState as IResourceParams)
        message.success('更新成功')
      } else {
        await createResource(formState as IResourceParams)
        message.success('创建成功')
      }
      handleCancel()
      emits('success')
    } finally {
      confirmLoading.value = false
    }
  })
}
</script>
