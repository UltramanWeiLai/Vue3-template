<template>
  <ALayoutSider class="sider" width="224" :collapsed="collapsed" :collapsed-width="72">
    <div class="logo">
      <img src="../../assets/logo.png" alt="logo" />
      <h1 v-show="!collapsed">Two Dog</h1>
    </div>
    <div class="menu">
      <AMenu
        v-model:open-keys="openKeys"
        v-model:selected-keys="selectedKeys"
        mode="inline"
        :inline-collapsed="collapsed"
        :items="menuList"
        @click="handleMenuClick"
      />
    </div>
  </ALayoutSider>
</template>

<script setup lang="ts">
import { inject, ref, Ref, h } from 'vue'
import { useRouter } from 'vue-router'
import { UserOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const collapsed = inject<Ref<boolean>>('collapsed')
const openKeys = ref<string[]>([])
const selectedKeys = ref<string[]>([])
const menuList = ref([
  { label: '首页', key: 'home', path: '/home' },
  {
    label: '系统管理',
    key: 'system',
    icon: h(UserOutlined),
    children: [
      { label: '用户管理', key: 'user', path: '/user' },
      { label: '角色管理', key: 'role', path: '/role' },
      { label: '权限管理', key: 'power', path: '/power' },
      { label: '资源管理', key: 'resource', path: '/resource' },
      { label: '用户组管理', key: 'user-group', path: '/user-group' },
    ],
  },
])

const handleMenuClick = (e: { key: string; item: { path: string } }) => {
  selectedKeys.value = [e.key]
  router.push(e.item.path)
}
</script>

<style lang="scss" scoped>
.sider {
  box-shadow: 2px 0 6px $shadow-color-lighter;
  background-color: $bg-color;
  z-index: 2;

  .logo {
    display: flex;
    align-items: center;
    padding: 0 $spacing-large;
    height: 56px;
    border-bottom: 1px solid $border-color-lighter;
    background: $bg-color;
    box-sizing: border-box;
    overflow: hidden;

    > img {
      height: 26px;
    }

    > h1 {
      margin: 0 0 0 $spacing-small;
      line-height: 56px;
      font-size: $font-size-base;
      font-weight: $font-weight-normal;
    }
  }
}
</style>
