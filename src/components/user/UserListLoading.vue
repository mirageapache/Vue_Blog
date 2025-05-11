<script setup lang="ts">
import UserLoading from '@/components/user/UserLoading.vue';
const arr = [1,2,3,4,5];
</script>

<template>
  <div class="border-b-[1px] w-full dark:border-gray-700 last:border-b-0">
    <UserLoading v-for="item in arr" :key="`loading-${item}`" :withBorder="false" />
  </div>
</template>
