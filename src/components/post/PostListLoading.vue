<script setup lang="ts">
import PostLoading from '@/components/post/PostLoading.vue';
const arr = [1,2,3,4,5];
</script>

<template>
  <div v-for="item in arr" :key="`loading-${item}`" class="border-b-[1px] dark:border-gray-700 last:border-b-0">
    <PostLoading :withBorder="false" />
  </div>
</template>