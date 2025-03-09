<template>
  <AForm ref="formRef" class="login-form" :model="formState" :rules="rules" @finish="handleFinish">
    <AFormItem name="username">
      <AInput v-model:value="formState.username" placeholder="请输入用户名" size="large">
        <template #prefix>
          <UserOutlined class="form-icon" />
        </template>
      </AInput>
    </AFormItem>

    <AFormItem name="password">
      <AInputPassword v-model:value="formState.password" placeholder="请输入密码" size="large">
        <template #prefix>
          <LockOutlined class="form-icon" />
        </template>
      </AInputPassword>
    </AFormItem>

    <AFormItem name="confirmPassword">
      <AInputPassword v-model:value="formState.confirmPassword" placeholder="请确认密码" size="large">
        <template #prefix>
          <LockOutlined class="form-icon" />
        </template>
      </AInputPassword>
    </AFormItem>

    <div class="form-options">
      <AButton type="link" class="form-back" @click="emits('switchMode', 'login')"> 返回登录 </AButton>
    </div>

    <AButton type="primary" html-type="submit" size="large" class="form-submit" :loading="loading"> 注册 </AButton>
  </AForm>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { FormInstance, message } from 'ant-design-vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'

import { register } from '@/api'

interface FormState {
  username: string
  password: string
  confirmPassword: string
}

const emits = defineEmits(['switchMode'])

const loading = ref(false)
const formRef = ref<FormInstance>()
const formState = reactive<FormState>({
  username: '',
  password: '',
  confirmPassword: '',
})

const validateConfirmPassword = (rule: unknown, value: string) => {
  if (value !== formState.password) {
    return Promise.reject(new Error('两次密码不一致'))
  }
  return Promise.resolve()
}
const rules = {
  username: [{ required: true, message: '请输入用户名' }],
  password: [{ required: true, message: '请输入密码' }],
  confirmPassword: [
    { required: true, message: '请确认密码' },
    { validator: validateConfirmPassword, trigger: 'blur' },
  ],
}

const handleFinish = async (values: FormState) => {
  if (!formRef.value) return
  await formRef.value.validate()

  try {
    loading.value = true
    await register(values)
    message.success('注册成功')
    formState.username = ''
    formState.password = ''
    formState.confirmPassword = ''
    formRef.value.resetFields()
    emits('switchMode', 'login')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
@use 'sass:color';

.login-form {
  animation: fadeIn 0.3s ease-in-out;
}

.form {
  &-icon {
    color: $text-secondary;
  }

  &-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-large;
  }

  &-back {
    padding: 0;
    color: $text-secondary;

    &:hover {
      color: $text-primary;
    }
  }

  &-submit {
    width: 100%;
    height: 44px;
    font-size: $font-size-medium;
    border-radius: $border-radius-base;
  }
}
</style>
