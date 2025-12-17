<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { Primitive } from "reka-ui"
import { cn } from '~~/lib/utils'

interface Props {
  as?: string
  class?: HTMLAttributes["class"]
}

const props = withDefaults(defineProps<Props>(), {
  as: "p",
})
</script>

<template>
  <Primitive
    :as="as"
    :class="cn('text-sm text-muted-foreground', props.class)"
  >
    <slot />
  </Primitive>
</template>

