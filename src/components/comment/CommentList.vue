<script setup lang="ts">
import type { CommentDataType } from '@/types/commentType';
import CommentItem from './CommentItem.vue';

const props = defineProps<{
  commentListData: CommentDataType[];
}>();

const { commentListData } = props;

</script>

<template>
  <div>
    <div v-for="item in commentListData" :key="item._id">
      <CommentItem :commentData="item" />
    </div>
  </div>
</template>
