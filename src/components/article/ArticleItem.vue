<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import moment from 'moment';
import { formatDateTime } from '@/utils/dateTime';
import { HINT_LABEL } from '@/constants/LayoutConstants';
import type { ArticleDataType } from '@/types/articleType';
import UserInfoPanel from '../user/UserInfoPanel.vue';

const props = defineProps<{
  articleData: ArticleDataType;
}>();

const router = useRouter();
const { articleData } = props;
const article = ref(articleData);
const { _id, title, createdAt, author } = article.value;
const showCreateTip = ref(false);



</script>

<template>
  <div
    class="text-left border-b-[1px] p-1 sm:p-2 dark:border-gray-700 last:border-b-0 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
    @click="() => {
      router.push(`/article/${_id}`);
    }"
  >
    <div class="flex w-full justify-between">
      <UserInfoPanel
        :userId="author._id"
        :account="author.account"
        :name="author.name"
        :avatarUrl="author.avatar"
        :bgColor="author.bgColor"
        class="my-2"
      />
      <div class="flex flex-col justify-center items-end">
        <span
          class="relative my-0.5"
          @mouseenter="() => showCreateTip = true"
          @mouseleave="() => showCreateTip = false"
        >
          <p class="text-gray-600 dark:text-gray-300">{{ formatDateTime(createdAt) }}</p>
          <span
            class="top-[-50px] right-0 w-40"
            :class="[HINT_LABEL, showCreateTip ? 'block' : 'hidden']"
          >
            Created at {{ moment(createdAt).format('MMMM Do YYYY, h:mm:ss') }}
          </span>
        </span>
      </div>
    </div>
    <div class="pb-3">
      <h2 class="font-semibold text-2xl xl:text-3xl">
        <span class="hover:underline hover:text-orange-500">{title}</span>
      </h2>
      <div
        class="max-h-[150px] text-gray-600 dark:text-gray-300 line-clamp-5"
        v-html="htmlContent"
      />
    </div>
  </div>
</template>
