<script setup lang="ts">
import { nextTick, onUnmounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    titleId?: string
    descriptionId?: string
    maxWidth?: string
  }>(),
  {
    titleId: undefined,
    descriptionId: undefined,
    maxWidth: 'max-w-3xl',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const dialogRef = ref<HTMLElement | null>(null)

const close = () => emit('update:modelValue', false)

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    close()
  }
}

watch(
  () => props.modelValue,
  async (open) => {
    if (open) {
      document.addEventListener('keydown', handleKeydown)
      await nextTick()
      dialogRef.value?.focus()
    } else {
      document.removeEventListener('keydown', handleKeydown)
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
        @click.self="close"
      >
        <Transition
          enter-active-class="duration-200 ease-out"
          enter-from-class="opacity-0 scale-[0.97] translate-y-1"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="duration-180 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-[0.97] translate-y-1"
        >
          <div
            v-if="modelValue"
            ref="dialogRef"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="titleId"
            :aria-describedby="descriptionId"
            tabindex="-1"
            class="w-full max-h-[90vh] overflow-hidden rounded-2xl border border-primary-100/80 bg-white shadow-2xl outline-none focus-visible:ring-2 focus-visible:ring-primary-300 transition"
            :class="maxWidth"
          >
            <slot />
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

