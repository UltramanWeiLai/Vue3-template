<template>
  <AModal v-model:open="visible" :title="editMode ? '编辑用户组' : '新增用户组'" @ok="handleOk">
    <AForm ref="formRef" :model="formState" :rules="rules" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
      <AFormItem label="用户组" name="name">
        <AInput v-model:value="formState.name" placeholder="请输入用户组名称" />
      </AFormItem>
      <AFormItem label="描述" name="description">
        <ATextarea v-model:value="formState.description" placeholder="请输入描述信息" :rows="4" />
      </AFormItem>
    </AForm>
  </AModal>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watchEffect } from 'vue'
import { message } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import { IUserGroupInfo, createUserGroup, updateUserGroup } from '@/api'

interface Props {
  visible: boolean
  editMode?: boolean
  userGroupInfo?: IUserGroupInfo
}

const props = defineProps<Props>()
const emits = defineEmits(['update:visible', 'success'])

const visible = computed({
  get: () => props.visible,
  set: (val: boolean) => emits('update:visible', val),
})

const formRef = ref<FormInstance>()
const formState = reactive({
  name: '',
  description: '',
})

const rules = {
  name: [{ required: true, message: '请输入用户组名称', trigger: 'blur' }],
}

// 监听编辑模式，填充表单数据
watchEffect(() => {
  if (props.editMode && props.userGroupInfo) {
    formState.name = props.userGroupInfo.name
    formState.description = props.userGroupInfo.description || ''
  } else {
    formState.name = ''
    formState.description = ''
  }
})

const handleOk = async () => {
  try {
    await formRef.value?.validate()
    if (props.editMode && props.userGroupInfo) {
      await updateUserGroup(props.userGroupInfo.id, formState)
      message.success('更新成功')
    } else {
      await createUserGroup(formState)
      message.success('创建成功')
    }
    emits('success')
    emits('update:visible', false)
  } catch (error) {
    console.error(error)
    message.error(props.editMode ? '更新失败' : '创建失败')
  }
}
</script>
