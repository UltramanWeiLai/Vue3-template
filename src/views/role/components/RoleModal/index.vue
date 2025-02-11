<template>
  <AModal
    v-model:open="visible"
    :title="editMode ? '编辑角色' : '新增角色'"
    @ok="handleOk"
  >
    <AForm
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 18 }"
    >
      <AFormItem label="角色名称" name="name">
        <AInput v-model:value="formState.name" placeholder="请输入角色名称" />
      </AFormItem>
      <AFormItem label="描述" name="description">
        <ATextarea v-model:value="formState.description" placeholder="请输入角色描述" :rows="4" />
      </AFormItem>
    </AForm>
  </AModal>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watchEffect } from 'vue'
import { message } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import { IRoleInfo, IRoleParams, createRole, updateRole } from '@/api'

interface Props {
  visible: boolean
  editMode?: boolean
  roleInfo?: IRoleInfo
}

const props = defineProps<Props>()
const emits = defineEmits(['update:visible', 'success'])
const visible = computed({
  get: () => props.visible,
  set: (val: boolean) => emits('update:visible', val),
})

const formRef = ref<FormInstance>()
const formState = reactive<IRoleParams>({
  name: '',
  description: '',
})

const rules = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
}

// 监听编辑模式，填充表单数据
watchEffect(() => {
  if (props.visible && props.editMode && props.roleInfo) {
    formState.name = props.roleInfo.name
    formState.description = props.roleInfo.description || ''
  } else {
    formState.name = ''
    formState.description = ''
  }
})

const handleOk = () => {
  formRef.value?.validate().then(async () => {
    try {
      if (props.editMode && props.roleInfo) {
        await updateRole(props.roleInfo.id, formState)
        message.success('编辑成功')
      } else {
        await createRole(formState)
        message.success('新增成功')
      }
      emits('success')
      emits('update:visible', false)
    } catch (error) {
      message.error(props.editMode ? '编辑失败' : '新增失败')
    }
  })
}
</script>
