<script setup lang="ts">
import PostLoading from '@/components/post/PostLoading.vue';
const arr = [1,2,3,4,5];
</script>

<template>
  <div class="border-b-[1px] dark:border-gray-700 last:border-b-0">
    <PostLoading v-for="item in arr" :key="`loading-${item}`" :withBorder="false" />
  </div>
</template>