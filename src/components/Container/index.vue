<template>
  <div class="container">
    <div class="container__header">
      <ABreadcrumb>
        <ABreadcrumbItem><HomeOutlined /></ABreadcrumbItem>
        <ABreadcrumbItem class="f12 lh22" v-for="item in breadcrumb">{{ item }}</ABreadcrumbItem>
      </ABreadcrumb>
    </div>
    <div class="container__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { HomeOutlined } from '@ant-design/icons-vue'

interface IProps {
  title: string
  breadcrumb?: string[]
}

const props = defineProps<IProps>()
const breadcrumb = computed(() => props.breadcrumb || [])
</script>

<style lang="scss" scoped>
.container {

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    padding: 0 24px;
    background-color: $bg-color-light;
    box-shadow: 0 2px 8px 0 $shadow-color-lighter;
  }

  &__content {
    height: calc(100vh - 144px);
    margin: $spacing-large;
    overflow: auto;

    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: $color-primary;
    }

    &::-webkit-scrollbar-track {
      background-color: $bg-color-light;
    }
  }
}
</style>
