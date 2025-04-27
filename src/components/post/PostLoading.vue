<script setup lang="ts">
const props = defineProps<{
  withBorder: boolean;
}>();

const { withBorder } = props;
</script>

<template>
  <div class="w-[90vw] sm:w-[80vw] md:w-[560px]" role="status" aria-label="loading animation">
    <div class="w-full rounded-md p-4" :class="{ 'my-4 border border-blue-400 shadow': withBorder }">
      <div class="animate-pulse flex space-x-4">
        <div class="rounded-full bg-slate-300 h-10 w-10" />
        <div class="flex-1 space-y-3 py-1">
          <div class="h-2 w-20 bg-slate-300 rounded" />
          <div class="h-2 w-20 bg-slate-300 rounded" />
          <div class="space-y-3">
            <div class="grid grid-cols-3 gap-4">
              <div class="h-60 bg-slate-300 rounded col-span-3" />
            </div>
            <div class="grid grid-cols-3 gap-4">
              <div class="h-2 bg-slate-300 rounded col-span-1" />
              <div class="h-2 bg-slate-300 rounded col-span-2" />
            </div>
            <div class="grid grid-cols-3 gap-4">
              <div class="h-2 bg-slate-300 rounded col-span-2" />
              <div class="h-2 bg-slate-300 rounded col-span-1" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="h-2 bg-slate-300 rounded col-span-1" />
              <div class="h-2 bg-slate-300 rounded col-span-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
