<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { getPartialPosts } from '@/api/post';
import PostListDynamic from '@/components/post/PostListDynamic.vue';
import type { PostDataType } from '@/types/postType';

const page = ref(1);
// 指定reactive陣列的型別
const state = reactive({ postList: [] as PostDataType[] });
const { postList } = state;
const isLoading = ref(false);

const fetchPosts = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    const result = await getPartialPosts(page.value);
    if (result && !result.isAxiosError) {
      postList.push(...result.posts);
      page.value = result.nextPage;
    }
  } finally {
    isLoading.value = false;
  }
};

/** 滾動判斷fetch新資料 */
const handleScroll = () => {
  if (
    window.innerHeight + document.documentElement.scrollTop >=
    document.documentElement.offsetHeight - 100
  ) {
    if (page.value > 0) fetchPosts();
  }
};

// 在組件掛載時獲取資料並添加滾動事件監聽
onMounted(() => {
  fetchPosts();
  window.addEventListener('scroll', handleScroll);
});

// 組件卸載時移除事件監聽器
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div class="w-full max-w-[600px] p-1 sm:p-0">
    <PostListDynamic :postListData="postList" :isLoading="isLoading" :atBottom="page < 0" />
  </div>
</template>
