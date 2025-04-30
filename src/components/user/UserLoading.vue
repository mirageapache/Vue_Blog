<script setup lang="ts">
const props = defineProps<{
  withBorder: boolean;
}>();
const { withBorder } = props;
</script>

<template>
  <template v-if="withBorder">
    <div class="w-[600px] my-4 border border-blue-300 shadow rounded-md p-4">
      <div class="animate-pulse flex space-x-4 items-center">
        <div class="rounded-full bg-slate-200 h-14 w-14" />
        <div class="flex-1 space-y-2 py-1">
          <div class="h-2 w-20 bg-slate-200 rounded mt-1" />
          <div class="flex items-center mt-1">
            <div class="h-2 w-20 bg-slate-200 rounded" />
          </div>
        </div>
        <div class="rounded-full bg-slate-200 h-8 w-16" />
      </div>
    </div>
  </template>
  <template v-else>
    <div class="animate-pulse flex my-3 space-x-4 items-center bg-white dark:bg-gray-950">
      <div class="rounded-full bg-slate-200 h-14 w-14" />
      <div class="flex-1 space-y-2 py-1">
        <div class="h-2 w-20 bg-slate-200 rounded mt-1" />
        <div class="flex items-center mt-1">
          <div class="h-2 w-20 bg-slate-200 rounded" />
        </div>
      </div>
    </div>
  </template>
</template>
