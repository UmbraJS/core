<script setup lang="ts">
import { colord } from 'colord'
import { computed } from 'vue'
import { mostReadable } from '@umbrajs/core'
import type { UmbraOutputs } from '@umbrajs/core'

export interface Props {
  variable?: string
  color?: string
  name?: string
  index?: number
  prefix?: string
  umbra?: UmbraOutputs
  meta?: boolean
  width?: string
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: '6rem',
  height: undefined,
  meta: false
})

function getIndex() {
  if (props.index === undefined) return 0
  return props.index * 10 + 10
}

const colorId = computed(() => {
  return props.index !== undefined ? '-' + getIndex() : ''
})

const cssVariable = computed(() => {
  if (props.variable) return `var(--${props.variable})`
  if (!props.color) return 'var(--base)'
  return props.prefix
    ? `var(--${props.name}-${props.prefix})`
    : `var(--${props.name}${colorId.value})`
})

const textColor = computed(() => {
  const black = '#000000'
  const white = '#ffffff'
  if (!props.color) return black
  const x = mostReadable(props.color, [black, white])
  return x
})

const size = computed(() => ({
  width: props.width,
  height: props.height ? props.height : props.width
}))
</script>

<template>
  <div class="range">
    <div class="pallet">
      <div class="text">
        <p v-if="meta">
          {{ getIndex() }}
        </p>
        <p v-if="meta">{{ color }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pallet {
  position: relative;
  overflow: hidden;
  padding: 0.2rem 0.5rem;
  height: v-bind('size.height');
  //min-width: v-bind('size.width');
  background-color: v-bind(cssVariable);
}

.pallet .text {
  position: absolute;
}

.pallet p {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 500;
  color: v-bind(textColor);
}
</style>
