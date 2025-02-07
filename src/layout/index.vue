<template>
  <ALayout class="layout">
    <Sidebar />
    <ALayout>
     <Header />
      <Main />
    </ALayout>
  </ALayout>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'
import Header from './Header/index.vue'
import Sidebar from './Sidebar/index.vue'
import Main from './Main/index.vue'

const collapsed = ref(false)

const handleCollapse = (val: boolean) => {
  collapsed.value = val
}

provide('collapsed', collapsed)
provide('handleCollapse', handleCollapse)
</script>

<style lang="scss">
.layout {
  height: 100vh;
}
</style>
