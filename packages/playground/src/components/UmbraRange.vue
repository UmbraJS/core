<script setup lang="ts">
import type { FormatedRange } from '@umbrajs/core'
import UmbraPallet from './UmbraPallet.vue'

interface Props {
  range: FormatedRange
  width?: string
  height?: string
}

withDefaults(defineProps<Props>(), {
  width: '6rem',
  height: undefined
})
</script>

<template>
  <div class="rangec">
    <h2 v-if="true">{{ range.name }}</h2>
    <UmbraPallet variable="base" :width="width" :height="height" />
    <UmbraPallet
      v-for="(color, index) in range.shades"
      :key="index"
      :name="range.name"
      :color="color"
      :index="index"
      :width="width"
      :height="height"
      :meta="true"
    />
    <UmbraPallet variable="base-contrast" :width="width" :height="height" />
  </div>
</template>

<style scoped>
h2 {
  position: absolute;
  transform: translate(12px, 12px);
  font-size: 16px;
}

.rangec {
  position: relative;
  overflow: hidden;
  border-radius: 14px;
  display: grid;
  grid-template-columns: repeat(14, 1fr);
}
</style>
