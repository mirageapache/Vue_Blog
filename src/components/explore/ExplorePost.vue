<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { isEmpty } from 'lodash';
import type { PostDataType } from '@/types/postType';
import { getPartialPosts, getSearchPost } from '@/api/post';
import NoSearchResult from '../tips/NoSearchResult.vue';
import PostListDynamic from '../post/PostListDynamic.vue';

const nextPage = ref(1);
const isLoading = ref(false);
const postList = ref<PostDataType[]>([]);
const searchString = useRoute().query.searchString;

const fetchPosts = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  let res = null;
  try {
    if (searchString) {
      res = await getSearchPost(searchString as string, '', nextPage.value);
    } else {
      res = await getPartialPosts(nextPage.value);
    }

    if (res) {
      postList.value.push(...res.posts);
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
  <template v-if="isEmpty(postList) && !isLoading">
    <NoSearchResult msgOne="搜尋不到相關貼文" msgTwo="" type="post" />
  </template>
  <template v-else>
    <PostListDynamic
      :postListData="postList"
      :isLoading="isLoading"
      :atBottom="nextPage < 0"
    />
  </template>
</template>
