<script setup lang="ts">
import { useMainStore } from '@/store';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch, faXmark, faFileLines, faNoteSticky, faUsers, faTag } from '@fortawesome/free-solid-svg-icons';
import { get, isEmpty, debounce } from 'lodash';
import { onMounted, onUpdated, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getSearchCount } from '@/api';
import { checkLogin } from '@/utils/common';
import ExploreArticle from '@/components/explore/ExploreArticle.vue';
import ExplorePost from '@/components/explore/ExplorePost.vue';
import ExploreUser from '@/components/explore/ExploreUser.vue';
import ExploreHashTag from '@/components/explore/ExploreHashTag.vue';

library.add(faSearch, faXmark, faFileLines, faNoteSticky, faUsers, faTag);

const activeUnderLine = ref('');
const article = ref(0);
const post = ref(0);
const user = ref(0);
const hashtag = ref(0);
const router = useRouter();
const exploreTag = ref('article');

const tabButtonStyle = 'relative flex w-1/4 justify-center items-center py-1.5 hover:cursor-pointer outline-none'; // 頁籤按鈕樣式
const iconStyle = 'text-gray-500 md:hidden py-1'; // 頁籤通用樣式
const activeTabStyle = 'text-orange-500'; // 頁籤控制
const countSpanStyle = 'sm:absolute sm:right-5 md:right-4 hidden sm:inline-block text-[12px] leading-5 px-3 bg-orange-500 text-white rounded-full'; // 數量標籤樣式

const mainStore = useMainStore();
const tag = useRoute().params.tag as string;
const searchParam = useRoute().query.searchString as string;
const searchString = ref(searchParam);

/** 頁籤切換 */
const handleTabActive = (tabValue: string) => {
  exploreTag.value = tabValue;
  mainStore.setExploreTag(tabValue);
};

if (!isEmpty(tag) && tag !== '') {
  exploreTag.value = tag!;
  handleTabActive(tag!);
} else {
  exploreTag.value = mainStore.exploreTag; // 紀錄作用中的頁籤
}

/** 取得搜尋結果數量 */
const getSearchAmount = async (searchString: string) => {
  const res = await getSearchCount(searchString);
  article.value = get(res, 'article', 0);
  post.value = get(res, 'post', 0);
  user.value = get(res, 'user', 0);
  if (checkLogin()) user.value -= 1; // 有登入須扣除自己
  hashtag.value = get(res, 'hashtag', 0);
}

// 使用防抖處理搜尋
const debouncedSearch = debounce((value: string) => {
  getSearchAmount(value);
  if (isEmpty(value)) {
    router.push('/explore');
  } else {
    router.push(`/explore?search=${value}`);
  }
}, 300);

// 監聽 searchString 的變化
watch(searchString, (newValue) => {
  debouncedSearch(newValue);
});

onMounted(() => {
  getSearchAmount(searchString.value);
});

onUpdated(() => {
  switch (exploreTag.value) {
    case 'article':
      activeUnderLine.value = 'translate-x-0';
      break;
    case 'post':
      activeUnderLine.value = 'translate-x-full';
      break;
    case 'user':
      activeUnderLine.value = 'translate-x-[200%]';
      break;
    case 'tag':
      activeUnderLine.value = 'translate-x-[300%]';
      break;
    default:
      activeUnderLine.value = 'translate-x-0';
  }
});

</script>

<template>
  <div class="w-full">
    <div class="flex flex-col justify-center items-center py-1">
      <!-- 搜尋框 -->
      <div class="relative flex items-center my-2 w-full max-w-[400px]">
        <input
          type="text"
          name="search"
          placeholder="搜尋..."
          v-model="searchString"
          autoComplete="off"
          class="p-4 pl-10 w-full h-9 text-lg rounded-full bg-gray-200 dark:bg-gray-700 outline-none"
        />
        <font-awesome-icon
          :icon="['fas', 'search']"
          class="absolute h-5 w-5 m-1.5 ml-3 stroke-0 text-gray-500 dark:text-gray-100"
        />
        <!-- 清除搜尋字串 -->
        <font-awesome-icon
          :icon="['fas', 'xmark']"
          @click="() => {
            searchString = '';
            router.push('/explore');
          }"
          class="absolute right-0 h-5 w-5 m-1.5 mr-3 stroke-0 text-gray-500 dark:text-gray-100 cursor-pointer"
        />
      </div>

      <!-- 頁籤 -->
      <div class="w-full max-w-[600px]">
        <div class="text-lg flex border-b-[1px] border-gray-400 dark:text-gray-400">
          <button
            type="button"
            :class="tabButtonStyle"
            @click="() => handleTabActive('article')"
          >
            <p class="hidden md:inline-block">文章</p>
            <font-awesome-icon
              :icon="['fas', 'file-lines']"
              :class="[iconStyle, exploreTag === 'article' ? activeTabStyle : '']"
            />
            <span v-if="!isEmpty(searchString) && article > 0" :class="countSpanStyle">{{ article }}</span>
          </button>
          <button
            type="button"
            :class="tabButtonStyle"
            @click="() => handleTabActive('post')"
          >
            <p class="hidden md:inline-block">貼文</p>
            <font-awesome-icon
              :icon="['fas', 'note-sticky']"
              :class="[iconStyle, exploreTag === 'post' ? activeTabStyle : '']"
            />
            <span v-if="!isEmpty(searchString) && post > 0" :class="countSpanStyle">{{ post }}</span>
          </button>
          <button
            type="button"
            :class="tabButtonStyle"
            @click="() => handleTabActive('user')"
          >
            <p class="hidden md:inline-block">用戶</p>
            <font-awesome-icon
              :icon="['fas', 'users']"
              :class="[iconStyle, exploreTag === 'user' ? activeTabStyle : '']"
            />
            <span v-if="!isEmpty(searchString) && user > 0" :class="countSpanStyle">{{ user }}</span>
          </button>
          <button
            type="button"
            :class="tabButtonStyle"
            @click="() => handleTabActive('tag')"
          >
            <p class="hidden md:inline-block">標籤</p>
            <font-awesome-icon
              :icon="['fas', 'tag']"
              :class="[iconStyle, exploreTag === 'tag' ? activeTabStyle : '']"
            />
            <span v-if="!isEmpty(searchString) && hashtag > 0" :class="countSpanStyle">{{ hashtag }}</span>
          </button>
        </div>
        <div class="flex justify-start -translate-y-0.5">
          <div
            class="border-b-[3px] border-orange-500 w-1/4 text-transparent transform duration-300 ease-in-out"
            :class="[activeUnderLine]"
          />
        </div>
      </div>
    </div>

    <div class="flex justify-center">
      <!-- 文章 -->
      <section v-if="exploreTag === 'article'" class="flex justify-center w-full max-w-[600px]">
        <ExploreArticle />
      </section>
      <!-- 貼文 -->
      <section v-if="exploreTag === 'post'" class="flex justify-center w-full max-w-[600px]">
        <ExplorePost />
      </section>
      <!-- 用戶 -->
      <section v-if="exploreTag === 'user'" class="flex justify-center w-full max-w-[600px]">
        <ExploreUser />
      </section>
      <!-- 標籤 -->
      <section v-if="exploreTag === 'tag'" class="flex justify-center w-full max-w-[600px]">
        <ExploreHashTag />
      </section>
    </div>
  </div>
</template>