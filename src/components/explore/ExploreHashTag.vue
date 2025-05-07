<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { isEmpty } from 'lodash';
import type { PostDataType } from '@/types/postType';
import { getSearchHashTag } from '@/api/post';
import NoSearchResult from '../tips/NoSearchResult.vue';
import PostListDynamic from '../post/PostListDynamic.vue';
import PostListLoading from '../post/PostListLoading.vue';

const nextPage = ref(1);
const isLoading = ref(false);
const postList = ref<PostDataType[]>([]);
const searchString = useRoute().query.searchString;

const fetchPosts = async () => {
  isLoading.value = true;
  try {
    const res = await getSearchHashTag(searchString as string, nextPage.value);
    if (res) {
      postList.value.push(...res.data);
      nextPage.value = res.nextPage;
    }
  } finally {
    isLoading.value = false;
  }
};

/** 滾動判斷fetch新資料 */
const handleScroll = () => {
  if (
    window.innerHeight + document.documentElement.scrollTop >=
    document.documentElement.offsetHeight - 350
  ) {
    if (nextPage.value > 0) fetchPosts();
  }
};

onMounted(() => {
  fetchPosts();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <template v-if="isEmpty(postList)">
    <NoSearchResult msgOne="搜尋不到相關文章" msgTwo="" type="article" />
  </template>
  <template v-else-if="isLoading">
    <PostListLoading />
  </template>
  <template v-else>
    <PostListDynamic
      :postListData="postList"
      :isLoading="isLoading"
      :atBottom="nextPage < 0"
    />
  </template>
</template>
