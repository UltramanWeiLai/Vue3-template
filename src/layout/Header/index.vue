<template>
  <ALayoutHeader class="header">
    <div class="header__left">
      <div class="header__collapse">
        <component 
          :is="collapsed ? MenuUnfoldOutlined : MenuFoldOutlined" 
          class="header__collapse-icon" 
          @click="handleCollapse(!collapsed)" 
        />    
      </div>
    </div>
    <div class="header__right">
      <div class="header__user">
        <UserInfo />
      </div>
    </div>
  </ALayoutHeader>
</template>

<script setup lang="ts">
import { inject, Ref } from 'vue'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'

import UserInfo from '@/components/UserInfo/index.vue'

const collapsed = inject<Ref<boolean>>('collapsed')
const handleCollapse = inject<(val: boolean) => void>('handleCollapse')
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 $spacing-large;
  height: 56px;
  line-height: 56px;
  color: $text-primary;
  border-bottom: 1px solid rgba(90, 100, 110, 0.06);
  box-shadow: 0 2px 8px $shadow-color-lighter;
  background-color: $bg-color;

  &__collapse-icon {
    font-size: $font-size-medium;
    cursor: pointer;
  }
}
</style>
