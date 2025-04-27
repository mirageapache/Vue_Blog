<script setup lang="ts">
import type { PostDataType } from '@/types/postType';
import PostItem from './PostItem.vue';


const props = defineProps<{
  postListData: PostDataType[];
  isLoading: boolean;
  atBottom: boolean;
}>();

const { postListData, isLoading, atBottom } = props;

</script>

<template>
  <template v-if="isLoading">
    <PostListLoading />
  </template>
  <template v-else>
    <div v-for="post in postListData" :key="post._id">
      <PostItem :postData="post" />
    </div>
    <div
      v-if="atBottom"
      class="my-5 text-center text-gray-500"
    >
      - 已經沒有更多貼文了 -
    </div>
    <div v-else>
      <PostListLoading :withBorder="false" />
    </div>
  </template>
</template>