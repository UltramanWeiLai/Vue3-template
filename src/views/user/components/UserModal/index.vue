<template>
  <AModal
    width="520px"
    :open="visible"
    :title="props.editMode ? '编辑用户' : '新增用户'"
    :confirmLoading="loading"
    @cancel="handleCancel"
    @ok="handleSubmit"
  >
    <AForm
      ref="formRef"
      class="mt24"
      :model="formState"
      :rules="rules"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
    >
      <AFormItem label="用户名" name="username">
        <AInput v-model:value="formState.username" placeholder="请输入用户名" allowClear :disabled="props.editMode" />
      </AFormItem>
      <AFormItem label="昵称" name="name">
        <AInput v-model:value="formState.name" placeholder="请输入昵称" allowClear />
      </AFormItem>
      <AFormItem label="邮箱" name="email">
        <AInput v-model:value="formState.email" placeholder="请输入邮箱" allowClear />
      </AFormItem>
      <AFormItem label="手机号" name="phone">
        <AInput v-model:value="formState.phone" placeholder="请输入手机号" allowClear />
      </AFormItem>
    </AForm>
  </AModal>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { message } from 'ant-design-vue'
import { register, updateUser } from '@/api'

import type { FormInstance } from 'ant-design-vue'
import type { IUserInfo } from '@/api'

interface FormState {
  username: string
  name?: string
  email?: string
  phone?: string
}

interface IProps {
  visible: boolean
  editMode: boolean
  userInfo?: IUserInfo
}

const props = defineProps<IProps>()
const emits = defineEmits(['update:visible', 'success'])
const loading = ref(false)
const formRef = ref<FormInstance>()
const formState = reactive<FormState>({ username: '', name: undefined, email: undefined, phone: undefined })
const visible = computed({
  get: () => props.visible,
  set: (val: boolean) => emits('update:visible', val)
})

const rules = {
  username: [
    { required: true, message: '请输入用户名' },
    { min: 6, max: 32, message: '用户名长度为6-32个字符' },
  ],
  email: [{ message: '邮箱格式错误', type: 'email' }],
  phone: [{ message: '手机号格式错误', pattern: /^1[3-9]\d{9}$/ }],
}

// 监听编辑模式下的用户信息变化
watch(
  () => props.userInfo,
  (newVal) => {
    if (newVal && props.editMode) {
      Object.assign(formState, {
        username: newVal.username || '',
        name: newVal.name,
        email: newVal.email,
        phone: newVal.phone,
      })
    }
  },
  { immediate: true }
)

const resetForm = () => {
  formRef.value?.resetFields()
  formState.username = ''
  formState.name = undefined
  formState.email = undefined
  formState.phone = undefined
}

const handleCancel = () => {
  resetForm()
  visible.value = false
}

const handleSubmit = () => {
  formRef.value?.validate().then(async () => {
    try {
      loading.value = true

      // 清空空字符串不然会触发接口的字段校验
      if (formState.name === '') formState.name = undefined
      if (formState.email === '') formState.email = undefined
      if (formState.phone === '') formState.phone = undefined

      if (props.editMode) {
        const userInfo = props.userInfo
        if (!userInfo) return message.error('用户信息不存在，逻辑错误，请联系管理员！')
        await updateUser(userInfo.id, formState)
      } else {
        await register({ ...formState, password: '123456' })
      }

      message.success(`${props.editMode ? '编辑' : '新增'}成功`)
      emits('success')
      handleCancel()
    } finally {
      loading.value = false
    }
  })
}
</script>

<style lang="scss" scoped>
</style>
