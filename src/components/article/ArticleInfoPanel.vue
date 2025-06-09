<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { get, isEmpty } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHeart, faComment, faSquarePen, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import Swal from 'sweetalert2';
import { checkLogin, getCookies } from '@/utils/common';
import type { ArticleDataType } from '@/types/articleType';
import { useMainStore } from '@/store';
import { useAuthStore } from '@/store/auth';
import ArticleInfoItem from './ArticleInfoItem.vue';
import { deleteArticle, toggleLikeArticle } from '@/api/article';
import { errorAlert, handleStatus } from '@/utils/fetch';

library.add(faHeart, faHeartRegular, faComment, faSquarePen, faTrashCan);

const props = defineProps<{
  articleData: ArticleDataType;
  commentInput: HTMLDivElement | null;
  title: string;
  hasContent: boolean;
}>();

const emit = defineEmits<{
  (e: 'handleSubmit'): void;
}>();

const handleSubmit = () => {
  emit('handleSubmit');
};

const mainStore = useMainStore();
const authStore = useAuthStore();
const router = useRouter();
const { articleData, title, hasContent } = props;
const commentInput = ref<HTMLDivElement | null>(props.commentInput);
const currentUserId = getCookies('uid');
const editMode = computed(() => mainStore.editMode);
const article = ref(articleData);
const isLike = !isEmpty(article.value.likedByUsers.find((item) => item._id === currentUserId)); // 顯示是否喜歡該貼文
const likeCount = article.value.likedByUsers.length; // 喜歡數
const commentCount = article.value.comments.length; // 留言數
const isCurrentUser = currentUserId === article.value.author._id;

/** 喜歡/取消喜歡貼文 */
const handleLikeArticle = async (e: Event) => {
  e.stopPropagation();
  if (!checkLogin()) {
    authStore.setSignInPop(true);
    return;
  }

  const res = await toggleLikeArticle(article.value._id, currentUserId!, !isLike);
  if (res.success) {
    article.value = res.updateResult;
  } else {
    errorAlert();
  }
};

/** 處理編輯文章按鈕 */
const handleClickEdit = (e: Event) => {
  e.stopPropagation();
  mainStore.setEditMode(true);
};

/** 刪除文章 */
const handleDelete = async (e: Event) => {
  e.stopPropagation();
  if (isCurrentUser) {
    Swal.fire({
      title: '確定要刪除此文章嗎？',
      text: '確定後會立即刪除文章',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '確定',
      cancelButtonText: `取消`
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await deleteArticle(article.value._id, currentUserId!);
        if (handleStatus(get(res, 'status', 0)) === 2) {
          Swal.fire({
            title: '已刪除貼文',
            icon: 'info',
            confirmButtonText: '確認'
          }).then(() => {
            router.push(`/user/profile/${currentUserId}`);
          });
        } else {
          errorAlert();
        }
      }
    });
  }
};
</script>

<template>
  <div class="flex items-center">
    <div v-if="editMode" class="flex gap-2">
      <button
        v-if="!isEmpty(title) && hasContent"
        type="button"
        class="flex justify-center items-center w-16 sm:w-20 p-2 sm:py-1.5 text-white rounded-md bg-green-600 hover:bg-green-700"
        @click="handleSubmit"
      >
        <p class="text-[14px] sm:text-[16px]">更新</p>
      </button>
      <button
        v-else
        type="button"
        class="flex justify-center items-center w-16 sm:w-20 p-2 sm:py-1.5 text-white rounded-md bg-gray-600 cursor-default"
      >
        <p class="text-[14px] sm:text-[16px]">更新</p>
      </button>
    </div>
    <div v-else class="flex gap-4">
      <!-- 喜歡 -->
      <ArticleInfoItem
        v-if="isLike"
        tipText="取消喜歡"
        :count="likeCount || 0"
        faClass="text-red-500 hover:text-gray-400"
        tipClass="w-20"
        @handle-click="handleLikeArticle"
      >
        <template #icon>
          <font-awesome-icon :icon="['fas', 'heart']" class="w-5 h-5 m-1.5"/>
        </template>
      </ArticleInfoItem>

      <ArticleInfoItem
        v-else
        tipText="喜歡"
        :count="likeCount || 0"
        faClass="text-gray-400 dark:text-gray-100 hover:text-red-500 dark:hover:text-red-500"
        tipClass="w-12"
        @handle-click="handleLikeArticle"
      >
        <template #icon>
          <font-awesome-icon :icon="['far', 'heart']" class="w-5 h-5 m-1.5"/>
        </template>
      </ArticleInfoItem>

      <!-- 留言 -->
      <ArticleInfoItem
        iconName="{faComment}"
        tipText="留言"
        :count="commentCount || 0"
        faClass="text-gray-400 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-500"
        tipClass="w-12"
        @handle-click="
          () => {
            commentInput?.focus();
          }
        "
      >
        <template #icon>
          <font-awesome-icon :icon="['fas', 'comment']" class="w-5 h-5 m-1.5"/>
        </template>
      </ArticleInfoItem>

      <!-- 編輯  -->
      <ArticleInfoItem
        v-if="isCurrentUser"
        tipText="編輯"
        :count="undefined"
        faClass="text-gray-400 dark:text-gray-100 hover:text-orange-500 dark:hover:text-orange-500"
        tipClass="w-12"
        @handle-click="handleClickEdit"
      >
        <template #icon>
          <font-awesome-icon :icon="['fas', 'square-pen']" class="w-5 h-5 m-1.5"/>
        </template>
      </ArticleInfoItem>
      <ArticleInfoItem
        v-if="isCurrentUser"
        tipText="刪除"
        :count="undefined"
        faClass="text-gray-400 dark:text-gray-100 hover:text-red-500 dark:hover:text-red-500"
        tipClass="w-12"
        @handle-click="handleDelete"
      >
        <template #icon>
          <font-awesome-icon :icon="['fas', 'trash-can']" class="w-5 h-5 m-1.5"/>
        </template>
      </ArticleInfoItem>
    </div>
  </div>
</template>
