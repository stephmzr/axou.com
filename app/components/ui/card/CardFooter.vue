<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { Primitive } from "reka-ui"
import { cn } from '~~/lib/utils'

interface Props {
  as?: string
  class?: HTMLAttributes["class"]
}

const props = withDefaults(defineProps<Props>(), {
  as: "div",
})
</script>

<template>
  <Primitive
    :as="as"
    :class="cn('flex items-center p-6 pt-0', props.class)"
  >
    <slot />
  </Primitive>
</template>

