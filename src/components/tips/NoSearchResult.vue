<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { isEmpty } from 'lodash';
import { usePostStore } from '@/store/post';

library.add(faSearch);

const props = defineProps<{
  msgOne: string | undefined;
  msgTwo: string | undefined;
  type: string | undefined;
}>();

const { msgOne, msgTwo, type } = props;
const postStore = usePostStore();
</script>

<template>
  <div class="flex flex-col justify-center items-center max-h-80 mt-10">
    <font-awesome-icon
      :icon="['fas', 'search']"
      class="h-8 w-8 m-5 stroke-0 text-gray-500 dark:text-gray-100"
    />
    <p class="text-2xl sm:text-3xl m-1">{{ !isEmpty(msgOne) ? msgOne : '搜尋不到相關資料！' }}</p>
    <p class="text-2xl sm:text-3xl m-1">{{ !isEmpty(msgTwo) ? msgTwo : '請重新查詢' }}</p>

    <router-link
      v-if="type === 'createArticle'"
      to="/article/create"
      class="mt-5 bg-orange-500 rounded-md cursor-pointer py-2 px-4 hover:bg-orange-600"
    >
      撰寫文章
    </router-link>
    <button
      v-if="type === 'createPost'"
      type="button"
      class="mt-5 bg-orange-500 rounded-md cursor-pointer py-2 px-4 hover:bg-orange-600"
      @click="postStore.setShowCreateModal(true)"
    >
      發佈貼文
    </button>
  </div>
</template>