<script setup lang="ts">
import type { ArticleDataType } from '@/types/articleType';
import ArticleItem from './ArticleItem.vue';
import ArticleListLoading from './ArticleListLoading.vue';
import { ref, watch } from 'vue';
import ArticleLoading from './ArticleLoading.vue';

const props = defineProps<{
  articleListData: ArticleDataType[];
  isLoading: boolean;
  atBottom: boolean;
}>();
const localAtBottom = ref(props.atBottom);

watch(() => props.atBottom,
  (newValue) => {
    localAtBottom.value = newValue;
  },
  { immediate: true }
);

</script>

<template>
  <template v-if="articleListData.length === 0 && isLoading">
    <ArticleListLoading />
  </template>
  <template v-else>
    <section class="w-full">
      <div v-for="article in articleListData" :key="article._id">
        <ArticleItem :articleData="article" />
      </div>
      <div v-if="atBottom" class="my-5 text-center text-gray-500">
        - 已經沒有更多文章了 -
      </div>
      <div v-else>
        <ArticleLoading :withBorder="false" />
      </div>
    </section>
  </template>
</template>
