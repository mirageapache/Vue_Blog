<script setup lang="ts">
import { watch, ref } from 'vue';
import type { PostDataType } from '@/types/postType';
import PostItem from './PostItem.vue';
import PostListLoading from './PostListLoading.vue';
import PostLoading from './PostLoading.vue';

const props = defineProps<{
  postListData: PostDataType[];
  isLoading: boolean;
  atBottom: boolean;
}>();
const localAtBottom = ref(props.atBottom);

// 監聽 props 中的 atBottom 變化，並同步狀態
watch(() => props.atBottom,
  (newValue) => {
    localAtBottom.value = newValue;
  },
  { immediate: true }
);
</script>

<template>
  <template v-if="postListData.length === 0 && isLoading">
    <PostListLoading />
  </template>
  <template v-else>
    <section class="w-full">
      <div v-for="post in postListData" :key="post._id">
        <PostItem :postData="post" />
      </div>
      <div v-if="localAtBottom" class="my-5 text-center text-gray-500">- 已經沒有更多貼文了 -</div>
      <div v-else>
        <PostLoading :withBorder="false" />
      </div>
    </section>
  </template>
</template>
