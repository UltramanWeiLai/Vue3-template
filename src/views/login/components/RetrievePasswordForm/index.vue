<template>
  <AForm class="retrieve-form" :model="formState" :rules="rules" @finish="handleFinish">
    <AFormItem name="email">
      <AInput
        v-model:value="formState.email"
        placeholder="请输入注册邮箱"
        size="large"
      >
        <template #prefix>
          <MailOutlined class="form-icon" />
        </template>
      </AInput>
    </AFormItem>

    <AFormItem name="code" class="form-code">
      <AInput
        v-model:value="formState.code"
        placeholder="请输入验证码"
        size="large"
      >
        <template #prefix>
          <SafetyCertificateOutlined class="form-icon" />
        </template>
      </AInput>
      <AButton
        type="primary"
        :disabled="!!countdown"
        @click="handleSendCode"
      >
        {{ countdown ? `${countdown}s后重试` : '获取验证码' }}
      </AButton>
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
      下一步
    </AButton>
  </AForm>
</template>

<script setup lang="ts">
import { reactive, ref, onUnmounted } from 'vue'
import { message } from 'ant-design-vue'
import { MailOutlined, SafetyCertificateOutlined } from '@ant-design/icons-vue'

interface FormState {
  email: string
  code: string
}

const emits = defineEmits(['switchMode'])

const loading = ref(false)
const countdown = ref(0)
let timer: number | null = null

const formState = reactive<FormState>({
  email: '',
  code: ''
})

const rules = {
  email: [
    { required: true, message: '请输入邮箱' },
    { type: 'email', message: '请输入正确的邮箱格式' }
  ],
  code: [
    { required: true, message: '请输入验证码' },
    { len: 6, message: '验证码长度为6位' }
  ]
}

const startCountdown = () => {
  countdown.value = 60
  timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      timer && clearInterval(timer)
    }
  }, 1000)
}

const handleSendCode = async () => {
  if (!formState.email) {
    return message.error('请先输入邮箱')
  }
  try {
    // 这里添加发送验证码的接口调用
    await new Promise(resolve => setTimeout(resolve, 500))
    message.success('验证码已发送')
    startCountdown()
  } catch (error) {
    message.error('验证码发送失败')
  }
}

const handleFinish = async (values: FormState) => {
  try {
    loading.value = true
    // 这里添加验证码验证的接口调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    message.success('验证成功')
    // 切换到重置密码表单
    emits('switchMode', 'reset')
  } catch (error) {
    message.error('验证失败')
  } finally {
    loading.value = false
  }
}

onUnmounted(() => {
  timer && clearInterval(timer)
})
</script>

<style lang="scss" scoped>
.retrieve-form {
  animation: fadeIn 0.3s ease-in-out;
}

.form {
  &-icon {
    color: $text-secondary;
  }

  &-code {
    :deep(.ant-form-item-control-input-content) {
      display: flex;
      gap: $spacing-small;

      .ant-input-affix-wrapper {
        flex: 1;
      }

      .ant-btn {
        width: 120px;
        height: 40px;
      }
    }
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
