<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { getPartialPosts } from '@/api/post';
import PostListDynamic from '@/components/post/PostListDynamic.vue';
import type { PostDataType } from '@/types/postType';

const page = ref(1);
// 指定reactive陣列的型別
const postList = reactive<PostDataType[]>([]);
const isLoading = ref(false);

const fetchPosts = async () => {
  isLoading.value = true;
  try {
    const result = await getPartialPosts(page.value);
    if (result && !result.isAxiosError) {
      postList.length = 0; // 清空陣列
      postList.push(...result.posts); // 添加新數據
    }
  } finally {
    isLoading.value = false;
  }
};

// 在組件掛載時獲取資料
onMounted(() => {
  fetchPosts();
});
</script>

<template>
  <div class="w-full max-w-[600px] p-1 sm:p-0">
    <div v-if="isLoading" class="text-center py-4">
      載入中...
    </div>
    <div v-else-if="postList.length === 0" class="text-center py-4">
      沒有找到貼文
    </div>
    <PostListDynamic
      :postListData="postList"
      :isLoading="isLoading"
      :atBottom="page < 0"
    />
  </div>
</template>


