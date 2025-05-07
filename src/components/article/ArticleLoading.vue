<script setup lang="ts">
const props = defineProps<{
  withBorder: boolean;
}>();

const { withBorder } = props;
</script>

<template>
  <div class="w-[90vw] sm:w-[80vw] md:w-[560px]" role="status" aria-label="loading animation">
    <div
      class="w-full rounded-md p-4"
      :class="[withBorder && 'my-4 border border-blue-300 shadow']"
    >
      <div class="animate-pulse">
        <!-- user info -->
        <div class="flex mb-1 py-1 gap-4">
          <div class="rounded-full bg-slate-300 h-10 w-10" />
          <div class="">
            <div class="h-2 w-20 mt-2 bg-slate-300 rounded" />
            <div class="h-2 w-20 mt-2 bg-slate-300 rounded" />
          </div>
        </div>

        <!-- article content  -->
        <div class="flex-1 space-y-3 py-1">
          <div class="space-y-3">
            <!-- 標題 -->
            <div class="grid grid-cols-3">
              <div class="h-6 bg-slate-300 rounded col-span-3" />
            </div>

            <!-- 內文 -->
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
            <div class="grid grid-cols-4 gap-4">
              <div class="h-2 bg-slate-300 rounded col-span-1" />
              <div class="h-2 bg-slate-300 rounded col-span-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
