
<script setup lang="ts">
  import type { PrimitiveProps } from "reka-ui"
  import type { HTMLAttributes } from "vue"
  import type { BadgeVariants } from "."
  import { Primitive } from "reka-ui"
  import { cn } from '~~/lib/utils'
  import { badgeVariants } from "."
  
  interface Props extends PrimitiveProps {
    variant?: BadgeVariants["variant"]
    class?: HTMLAttributes["class"]
  }
  
  const props = withDefaults(defineProps<Props>(), {
    as: "badge",
    variant: "default",
    class: undefined,
  })
  </script>
  
  <template>
    <Primitive
      :as="as"
      :as-child="asChild"
      :class="cn(badgeVariants({ variant }), props.class)"
    >
      <slot />
    </Primitive>
  </template>
  