<template>
  <ElContainer>
    <Header />
    <ElContainer>
      <Sidebar />
      <Main />
    </ElContainer>
  </ElContainer>
</template>

<script setup lang="ts">
import { ElContainer } from 'element-plus'
import Header from './Header/index.vue'
import Sidebar from './Sidebar/index.vue'
import Main from './Main/index.vue'
</script>
