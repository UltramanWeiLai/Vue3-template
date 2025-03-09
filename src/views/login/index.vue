<template>
  <div class="login">
    <div class="login__container">
      <!-- Logo区域 -->
      <div class="login__header">
        <img src="@/assets/logo.png" alt="logo" class="login__logo" />
        <h2 class="login__title">Two Dog Admin</h2>
      </div>

      <!-- 表单区域 -->
      <div class="login__content">
        <h3 class="login__welcome">{{ welcomeText }}</h3>

        <LoginForm v-if="currentMode === 'login'" @switch-mode="handleSwitchMode" />

        <RetrievePasswordForm v-if="currentMode === 'retrieve'" @switch-mode="handleSwitchMode" />

        <ResetPasswordForm v-if="currentMode === 'reset'" @switch-mode="handleSwitchMode" />
      </div>

      <!-- 页脚 -->
      <div class="login__footer">
        <p>Copyright © 2024 Two Dog Admin</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import LoginForm from './components/LoginForm/index.vue'
import RetrievePasswordForm from './components/RetrievePasswordForm/index.vue'
import ResetPasswordForm from './components/ResetPasswordForm/index.vue'

type FormMode = 'login' | 'retrieve' | 'reset'

const currentMode = ref<FormMode>('login')

const welcomeText = computed(() => {
  switch (currentMode.value) {
    case 'login':
      return '欢迎登录'
    case 'retrieve':
      return '找回密码'
    case 'reset':
      return '重置密码'
    default:
      return '欢迎登录'
  }
})

const handleSwitchMode = (mode: FormMode) => {
  currentMode.value = mode
}
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, $bg-color 0%, $bg-color-light 100%);

  &__container {
    width: 420px;
    padding: $spacing-extra-large;
    background-color: $bg-color;
    border-radius: $border-radius-large;
    box-shadow: 0 8px 24px $shadow-color-lighter;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: $spacing-extra-large;
  }

  &__logo {
    width: 40px;
    height: 40px;
    margin-right: $spacing-small;
  }

  &__title {
    margin: 0;
    font-size: $font-size-large;
    color: $text-primary;
    font-weight: $font-weight-bold;
  }

  &__welcome {
    margin: 0 0 $spacing-extra-large;
    font-size: $font-size-extra-large;
    color: $text-primary;
    font-weight: $font-weight-bold;
    text-align: center;
  }

  &__footer {
    margin-top: $spacing-extra-large;
    text-align: center;
    color: $text-secondary;
    font-size: $font-size-small;
  }

  :deep(.ant-input-affix-wrapper) {
    padding: 8px $spacing-base;
    border-radius: $border-radius-base;
    border: 1px solid $border-color-base;
    transition: $transition-base;

    &:hover,
    &:focus {
      border-color: $color-primary;
      box-shadow: 0 0 0 2px rgba($color-primary, 0.1);
    }
  }

  :deep(.ant-checkbox-checked .ant-checkbox-inner) {
    background-color: $color-primary;
    border-color: $color-primary;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
