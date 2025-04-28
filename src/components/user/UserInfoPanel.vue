<script setup lang="ts">
import { useMainStore } from '@/store';
import { scrollToTop } from '@/utils/common';
import { defineProps } from 'vue';
import Avatar from './Avatar.vue';

const props = defineProps<{
  userId: string;
  account: string;
  name: string;
  avatarUrl: string;
  bgColor: string;
  className?: string;
  menuLink?: boolean; // 判斷是否為主選單的連結
}>();

const {
  userId,
  account,
  name,
  avatarUrl,
  bgColor,
  className,
  menuLink,
} = props;

const mainStore = useMainStore();


</script>

<template>
  <div class="flex items-center" :class="className">
    <div class="flex justify-center items-center mr-4">
      <Avatar
        :name="name"
        :avatarUrl="avatarUrl"
        size="w-11 h-11"
        textSize="text-xl"
        :bgColor="bgColor"
      />
    </div>
    <div class="flex flex-col">
      <p class="font-semibold text-lg leading-6">{{ name }}</p>
        <p v-if="menuLink" class="text-[14px] text-gray-700 dark:text-gray-400">@{{ account }}</p>

        <router-link
          v-else
          :to="`/user/profile/${userId}`"
          class="text-[14px] text-gray-700 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-500 leading-4"
          @click="(e: Event) => {
            e.stopPropagation(); // 防止冒泡事件
            mainStore.setActivePage('user');
            scrollToTop();
          }"
        >
          <p>@{{ account }}</p>
        </router-link>
    </div>
  </div>
</template>
