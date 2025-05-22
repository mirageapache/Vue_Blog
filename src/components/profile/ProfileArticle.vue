<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { isEmpty } from 'lodash';
import type { ArticleDataType } from '@/types/articleType';
import ArticleListDynamic from '../article/ArticleListDynamic.vue';
import NoSearchResult from '../tips/NoSearchResult.vue';
import { getSearchArticle } from '@/api/article';

const props = defineProps<{
  userId: string;
  identify: boolean;
}>();


const { userId, identify } = props;
const isLoading = ref(false);
const articleList = ref<ArticleDataType[]>([]);
const nextPage = ref(1);

const fetchArticles = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    const res = await getSearchArticle('', userId, nextPage.value);

    if (res) {
      articleList.value.push(...res.articles);
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
    if (nextPage.value > 0) fetchArticles();
  }
};

onMounted(() => {
  fetchArticles();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <template v-if="isEmpty(articleList) && !isLoading">
    <NoSearchResult
      v-if="identify"
      msgOne="你還沒發佈任何文章"
      msgTwo="試試建立文章的功能"
      type="createArticle"
    />
    <NoSearchResult
      v-else
      msgOne="尚未發佈任何文章"
      msgTwo=""
      type="article"
    />
  </template>
  <template v-else>
    <ArticleListDynamic
      :articleListData="articleList"
      :isLoading="isLoading"
      :atBottom="nextPage < 0"
    />
  </template>
</template>
