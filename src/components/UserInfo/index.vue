<template>
  <div class="user">
    <AAvatar class="user__avatar" :src="userInfo.avatar" size="small" />
    <ADropdown trigger="click">
      <div class="user__info" :class="{ 'is-active': arrowFlag }" @click.prevent="handleUserClick">
        <div class="user__content">
          <p class="user__name">{{ userInfo.adminName || userInfo.name }}</p>
        </div>
        <i class="user__arrow icon icon-jiantouxia-xiaohao" />
      </div>
      <template #overlay>
        <AMenu class="user-menu">
          <AMenuItem class="user-menu__profile" style="cursor: auto" key="0" disabled>
            <p class="user-menu__title">{{ userInfo.adminName || userInfo.name }}</p>
            <p class="user-menu__email">邮箱：{{ userInfo.email }}</p>
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
import { computed, ref } from 'vue'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons-vue'

const arrowFlag = ref(false)
const userInfo = computed<any>(() => ({
  name: '张三',
  email: '1234567890@qq.com',
  avatar: '../../assets/logo.png',
}))

const handleUserClick = () => {
  arrowFlag.value = !arrowFlag.value
}


const handleUserConfigClick = () => {
  handleUserClick()
}

// 退出登录
const handleLogoutClick = () => {
  handleUserClick()
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

  &__arrow {
    width: 16px;
    height: 16px;
    font-weight: $font-weight-bold;
    transition: $transition-base;
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
