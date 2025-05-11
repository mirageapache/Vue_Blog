<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { isEmpty } from 'lodash';
import NoSearchResult from '../tips/NoSearchResult.vue';
import { getPartialArticles, getSearchArticle } from '@/api/article';
import type { ArticleDataType } from '@/types/articleType';
import ArticleListLoading from '../article/ArticleListLoading.vue';
import ArticleListDynamic from '../article/ArticleListDynamic.vue';

const nextPage = ref(1);
const isLoading = ref(false);
const articleList = ref<ArticleDataType[]>([]);
const searchString = useRoute().query.searchString;

const fetchArticles = async () => {
  isLoading.value = true;
  let res = null;
  try {
    if (searchString) {
      res = await getSearchArticle(searchString as string, '', nextPage.value);
    } else {
      res = await getPartialArticles(nextPage.value);
    }

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
  <template v-if="isLoading">
    <ArticleListLoading />
  </template>
  <template v-else-if="isEmpty(articleList)">
    <NoSearchResult msgOne="搜尋不到相關文章" msgTwo="" type="article" />
  </template>
  <template v-else>
    <ArticleListDynamic
      :articleListData="articleList"
      :isLoading="isLoading"
      :atBottom="nextPage < 0"
    />
  </template>
</template>
