<template>
  <AForm class="reset-form" :model="formState" :rules="rules" @finish="handleFinish">
    <AFormItem name="password">
      <AInputPassword
        v-model:value="formState.password"
        placeholder="请输入新密码"
        size="large"
      >
        <template #prefix>
          <LockOutlined class="form-icon" />
        </template>
      </AInputPassword>
    </AFormItem>

    <AFormItem name="confirmPassword">
      <AInputPassword
        v-model:value="formState.confirmPassword"
        placeholder="请确认新密码"
        size="large"
      >
        <template #prefix>
          <LockOutlined class="form-icon" />
        </template>
      </AInputPassword>
    </AFormItem>

    <div class="form-options">
      <AButton type="link" class="form-back" @click="$emit('switchMode', 'login')">
        返回登录
      </AButton>
    </div>

    <AButton
      type="primary"
      html-type="submit"
      size="large"
      class="form-submit"
      :loading="loading"
    >
      确认修改
    </AButton>
  </AForm>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { LockOutlined } from '@ant-design/icons-vue'

interface FormState {
  password: string
  confirmPassword: string
}

const emits = defineEmits(['switchMode'])

const loading = ref(false)

const formState = reactive<FormState>({
  password: '',
  confirmPassword: ''
})

const validateConfirmPassword = async (_rule: any, value: string) => {
  if (!value) {
    return Promise.reject('请确认密码')
  }
  if (value !== formState.password) {
    return Promise.reject('两次输入的密码不一致')
  }
  return Promise.resolve()
}

const rules = {
  password: [
    { required: true, message: '请输入新密码' },
    { min: 6, message: '密码长度不能小于6位' }
  ],
  confirmPassword: [{ validator: validateConfirmPassword }]
}

const handleFinish = async (values: FormState) => {
  try {
    loading.value = true
    // 这里添加重置密码的接口调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    message.success('密码重置成功')
    // 返回登录表单
    emits('switchMode', 'login')
  } catch (error) {
    message.error('密码重置失败')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.reset-form {
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
