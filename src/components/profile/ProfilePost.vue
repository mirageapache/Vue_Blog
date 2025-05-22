<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { isEmpty } from 'lodash';
import type { PostDataType } from '@/types/postType';
import { getSearchPost } from '@/api/post';
import NoSearchResult from '../tips/NoSearchResult.vue';
import PostListDynamic from '../post/PostListDynamic.vue';
import PostListLoading from '../post/PostListLoading.vue';

const props = defineProps<{
  userId: string;
  identify: boolean;
}>();

const { userId, identify } = props;
const nextPage = ref(1);
const isLoading = ref(false);
const postList = ref<PostDataType[]>([]);

const fetchPosts = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    const res = await getSearchPost('', userId, nextPage.value);

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
    <NoSearchResult v-if="identify" msgOne="你還沒發佈任何貼文" msgTwo="快發佈你的貼文動態" type="createPost" />
    <NoSearchResult v-else msgOne="尚未發佈任何貼文" msgTwo=" " type="post" />;
  </template>
  <template v-else>
    <PostListDynamic
      :postListData="postList"
      :isLoading="isLoading"
      :atBottom="nextPage < 0"
    />
  </template>
</template>