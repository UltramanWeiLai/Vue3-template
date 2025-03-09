<template>
  <div class="user">
    <AAvatar class="user__avatar" :src="userInfo.avatar || AvatarPng" size="small" />
    <ADropdown trigger="click">
      <div class="user__info">
        <div class="user__content">
          <p class="user__name">{{ userInfo.name || userInfo.username }}</p>
        </div>
        <DownOutlined class="user__arrow" />
      </div>
      <template #overlay>
        <AMenu class="user-menu">
          <AMenuItem class="user-menu__profile" style="cursor: auto" key="0" disabled>
            <p class="user-menu__title">{{ userInfo.name || userInfo.username }}</p>
            <p class="user-menu__email">邮箱：{{ userInfo.email || '暂无邮箱' }}</p>
          </AMenuItem>

          <AMenuDivider class="user-menu__divider" />
          <AMenuItem class="user-menu__item" key="1" @click="handleUserConfigClick">
            <template #icon><UserOutlined /></template><span class="f12">个人中心</span>
          </AMenuItem>

          <AMenuDivider class="user-menu__divider" />
          <AMenuItem class="user-menu__item" key="9" @click="handleLogoutClick">
            <template #icon><LogoutOutlined /></template><span class="f12">退出登录</span>
          </AMenuItem>
        </AMenu>
      </template>
    </ADropdown>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { UserOutlined, LogoutOutlined, DownOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import type { IUserInfo } from '@/api'

import AvatarPng from '@/assets/logo.png'

const router = useRouter()
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo as IUserInfo)

const handleUserConfigClick = () => {}

// 退出登录
const handleLogoutClick = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.user {
  height: 56px;
  display: flex;
  align-items: center;

  &__avatar {
    margin-right: $spacing-base;
  }

  &__info {
    display: flex;
    height: 56px;
    align-items: center;
    cursor: pointer;

    &.is-active .user__arrow {
      transform: rotate(180deg);
    }
  }

  &__content {
    margin-right: $spacing-small;
    text-align: left;
  }

  &__name {
    margin: 0;
    font-size: $font-size-base;
    color: $text-primary;
    line-height: 22px;
  }
}

.user-menu {
  width: 246px;

  &__title {
    margin: $spacing-small 0 $spacing-mini;
    font-size: $font-size-base;
    line-height: 22px;
    font-weight: $font-weight-bold;
    color: $text-primary;
  }

  &__email {
    margin: $spacing-mini 0 0;
    font-size: $font-size-small;
    line-height: 18px;
    color: $text-placeholder;
  }

  &__divider {
    margin: $spacing-small $spacing-base;
  }

  &__item {
    margin-bottom: $spacing-mini;
  }
}
</style>
