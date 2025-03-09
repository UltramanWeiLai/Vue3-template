<template>
  <ATooltip :title="tip">
    <APopconfirm
      v-if="props.confirmTitle"
      :title="props.confirmTitle"
      :ok-text="props.confirmOkText"
      :cancel-text="props.confirmCancelText"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    >
      <AButton
        :type="props.type"
        :size="props.size"
        :danger="props.danger"
        :loading="props.loading"
        :disabled="props.disabled"
      >
        <template #icon v-if="icon"><component :is="icon" /></template>
        <span v-if="text">{{ text }}</span>
      </AButton>
    </APopconfirm>
    <AButton
      v-else
      :type="props.type"
      :size="props.size"
      :danger="props.danger"
      :loading="props.loading"
      :disabled="props.disabled"
      @click="handleClick"
    >
      <template #icon v-if="icon"><component :is="icon" /></template>
      <span v-if="props.text">{{ props.text }}</span>
    </AButton>
  </ATooltip>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  icon?: Component
  text?: string
  tip?: string
  type?: 'primary' | 'ghost' | 'dashed' | 'link' | 'text' | 'default'
  size?: 'small' | 'middle' | 'large'
  danger?: boolean
  loading?: boolean
  disabled?: boolean
  needConfirm?: boolean
  confirmTitle?: string
  confirmOkText?: string
  confirmCancelText?: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: undefined,
  text: undefined,
  tip: undefined,
  confirmTitle: undefined,
  type: 'default',
  size: 'middle',
  danger: false,
  loading: false,
  disabled: false,
  confirmOkText: '确定',
  confirmCancelText: '取消',
})

const emits = defineEmits(['click', 'confirm', 'cancel'])

const handleClick = (e: MouseEvent) => emits('click', e)
const handleConfirm = (e: MouseEvent) => emits('click', e)
const handleCancel = (e: MouseEvent) => emits('cancel', e)
</script>
