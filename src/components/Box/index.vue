<template>
  <div class="box">
    <slot />
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.box {
  padding: $spacing-base;
  border-radius: $border-radius-base;
  box-shadow: 0 2px 8px 0 $shadow-color-lighter;
  background-color: $bg-color;
}
</style>
