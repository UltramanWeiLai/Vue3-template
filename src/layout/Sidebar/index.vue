<template>
  <ALayoutSider class="sider" width="224" :collapsed="collapsed" :collapsedWidth="72">
    <div class="logo">
      <img src="../../assets/logo.png" alt="logo" />
      <h1 v-show="!collapsed">Two Dog</h1>
    </div>
    <div class="menu">
      <AMenu
        v-model:openKeys="openKeys"
        v-model:selectedKeys="selectedKeys"
        mode="inline"
        :inline-collapsed="collapsed"
        :items="menuList"
        @click="handleMenuClick"
      />
    </div>
  </ALayoutSider>
</template>

<script setup lang="ts">
import { inject, ref, Ref } from 'vue';

const collapsed = inject<Ref<boolean>>('collapsed')
const openKeys = ref<string[]>([])
const selectedKeys = ref<string[]>([])
const menuList = ref([
  {
    key: '1',
    label: 'Option 1',
    title: 'Option 1',
  },
  {
    key: '2',
    label: 'Option 2',
    title: 'Option 2',
  },
  {
    key: '3',
    label: 'Option 3',
    title: 'Option 3',
  },
  {
    key: 'sub1',
    label: 'Navigation One',
    title: 'Navigation One',
    children: [
      {
        key: '5',
        label: 'Option 5',
        title: 'Option 5',
      },
      {
        key: '6',
        label: 'Option 6',
        title: 'Option 6',
      },
      {
        key: '7',
        label: 'Option 7',
        title: 'Option 7',
      },
      {
        key: '8',
        label: 'Option 8',
        title: 'Option 8',
      },
    ],
  }
])

const handleMenuClick = (e: { key: string }) => {
  selectedKeys.value = [e.key]
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
