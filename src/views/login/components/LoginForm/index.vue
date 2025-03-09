<template>
  <AForm class="login-form" :model="formState" :rules="rules" @finish="handleFinish">
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

    <div class="form-options">
      <ACheckbox v-model:checked="formState.remember">记住密码</ACheckbox>
      <AButton type="link" class="form-forget" @click="emits('switchMode', 'retrieve')"> 忘记密码？ </AButton>
    </div>

    <AButton type="primary" html-type="submit" size="large" class="form-submit" :loading="loading"> 登录 </AButton>
  </AForm>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/store/user'
import { getDataCache } from '@/utils'

import { login } from '@/api'

interface FormState {
  username: string
  password: string
  remember: boolean
}

const router = useRouter()
const userStore = useUserStore()
const cache = getDataCache()
const emits = defineEmits(['switchMode'])

const loading = ref(false)

const formState = reactive<FormState>({
  username: cache.get('username') || '',
  password: cache.get('password') || '',
  remember: cache.get('remember') || false,
})

const rules = {
  username: [{ required: true, message: '请输入用户名' }],
  password: [{ required: true, message: '请输入密码' }],
}

// 记住密码
const handleRemember = () => {
  if (formState.remember) {
    cache.set('username', formState.username)
    cache.set('password', formState.password)
    cache.set('remember', formState.remember)
  } else {
    cache.delete('username')
    cache.delete('password')
    cache.delete('remember')
  }
}

const handleFinish = async (values: FormState) => {
  try {
    loading.value = true
    const res = await login(values)
    const { token, userInfo } = res.data
    userStore.setToken(token)
    userStore.setUserInfo(userInfo)
    handleRemember()
    message.success('登录成功')
    router.push('/')
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

  &-forget {
    padding: 0;
    color: $color-primary;

    &:hover {
      color: color.adjust($color-primary, $lightness: 10%);
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
