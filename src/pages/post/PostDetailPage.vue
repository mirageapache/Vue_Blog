<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { useRoute } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCircleLeft } from '@fortawesome/free-solid-svg-icons';
import type { PostDataType } from '@/types/postType';
import { getPostDetail } from '@/api/post';
import { formatDateTime } from '@/utils/dateTime';
import { handleHashTag } from '@/utils/input';
import { getCookies } from '@/utils/common';
import { HINT_LABEL } from '@/constants/LayoutConstants';
import { useAuthStore } from '@/store/auth';
import PostLoading from '@/components/post/PostLoading.vue';
import NoSearchResult from '@/components/tips/NoSearchResult.vue';
import PostInfoPanel from '@/components/post/PostInfoPanel.vue';
import UserInfoPanel from '@/components/user/UserInfoPanel.vue';
import { createComment } from '@/api/comment';
import { errorAlert } from '@/utils/fetch';
import type { CommentDataType } from '@/types/commentType';
import CommentList from '@/components/comment/CommentList.vue';

library.add(faCircleLeft);

const isLoading = ref(false);
const showCreateTip = ref(false);
const showEditTip = ref(false);
const commentContent = ref('');
const showPlaceholder = ref(true);
const commentInput = ref<HTMLDivElement | null>(null);

const id = useRoute().params.id as string; // postId
const postData = ref<PostDataType>();
const commentList = ref<CommentDataType[]>([]);
const authStore = useAuthStore();

/** 取得貼文資料 */
const getPostData = async () => {
  isLoading.value = true;
  try {
    const res = await getPostDetail(id);
    if (res.status === 200) {
      postData.value = res.data;
    }
  } finally {
    isLoading.value = false;
  }
};
/** 返回上一頁 */
const handleBackward = () => {
  history.back();
};

/** 處理div輸入 */
const handleCommentInput = () => {
  if (commentInput.value) {
    const { formattedContent } = handleHashTag(commentInput.value.innerText);
    commentContent.value = formattedContent;
  }
};

/** 回覆貼文 */
const submitComment = async () => {
  if (commentContent.value.trim().length === 0) return; // 檢查有沒有留言內容
  const userId = getCookies('uid') as string;
  
  if (isEmpty(userId)) {
    authStore.setSignInPop(true);
    return;
  }
  
  isLoading.value = true;
  try {
    const res = await createComment(id, userId, commentContent.value, 'post');
    if (res.status === 200) {
      commentInput.value!.innerText = '';
      commentContent.value = '';
      getPostData();
    }
  } catch {
    errorAlert();
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  getPostData();
});

</script>

<template>
  <template v-if="isLoading">
    <PostLoading :withBorder="false" />
  </template>
  <template v-else>
    <template v-if="isEmpty(postData)">
      <NoSearchResult
        msgOne="該貼文資料不存在或已刪除"
        msgTwo="無法瀏覽內容，請重新操作"
        type="post"
      />
    </template>
    <template v-else>
      <div class="flex flex-col items-center border-b-[1px] dark:border-gray-700 w-full md:w-[600px] cursor-default">
        <div class="hidden sm:flex items-center my-3 w-full">
          <button
            aria-label="back"
            type="button"
            class="flex justify-center items-center p-2 text-gray-500 hover:text-orange-500"
            @click="handleBackward"
          >
            <font-awesome-icon :icon="['fas', 'circle-left']" class="w-7 h-7" />
          </button>
        </div>
        <div class="w-minus50 sm:w-full">
          <div class="flex justify-between">
            <UserInfoPanel
              :userId="postData.author._id"
              :account="postData.author.account"
              :name="postData.author.name"
              :avatarUrl="postData.author.avatar"
              :bgColor="postData.author.bgColor"
              className="my-2"
            />
            <div class="flex flex-col justify-center items-end">
              <span
                class="relative my-0.5"
                @mouseenter="showCreateTip = true"
                @mouseleave="showCreateTip = false"
              >
                <p class="text-gray-600 dark:text-gray-300">
                  {{ formatDateTime(postData.createdAt) }}
                </p>
                <span
                  class="top-[-25px] right-0 w-40"
                  :class="[HINT_LABEL, showCreateTip ? 'block' : 'hidden']"
                >
                  Created at {{ moment(postData.createdAt).format('MMMM Do YYYY, h:mm:ss') }}
                </span>
              </span>
              <span
                v-if="!isEmpty(postData.editedAt)"
                class="relative my-0.5"
                @mouseenter="showEditTip = true"
                @mouseleave="showEditTip = false"
              >
                <small class="text-gray-400">(已編輯)</small>
                <span
                  class="top-[-25px] right-0 w-40"
                  :class="[HINT_LABEL, showEditTip ? 'block' : 'hidden']"
                >
                  Edited at {{ moment(postData.editedAt).format('MMMM Do YYYY, h:mm:ss') }}
                </span>
              </span>
            </div>
          </div>
          <div class="sm:ml-[60px] border-b-[1px] border-gray-300 dark:border-gray-700 pb-3">
            <!-- image -->
            <div v-if="!isEmpty(postData.image)" class="w-full">
              <img class="w-full rounded-md" :src="postData.image" alt="postImage" />
            </div>

            <!-- content -->
            <div class="my-2">
              <div
                id="post-container"
                class="text-gray-600 dark:text-gray-300"
                v-html="postData.content"
              />
            </div>

            <!-- info panel -->
            <PostInfoPanel :postData="postData" />

            <!-- reply input -->
            <div class="flex justify-between mt-3">
              <div
                ref="commentInput"
                contentEditable="true"
                aria-placeholder="留言"
                class="w-full mr-2 py-1.5 px-2 rounded-md outline-none bg-gray-100 dark:bg-gray-800"
                @input="handleCommentInput"
                @focus="() => {
                  showPlaceholder = false;
                }"
                @blur="() => {
                  if (isEmpty(commentContent)) showPlaceholder = true;
                }"
              />
              <span
                class="absolute mr-2 py-1.5 px-2 text-gray-500"
                :class="[showPlaceholder ? 'block' : 'hidden']"
              >
                留言...
              </span>
              <button
                aria-label="reply"
                type="button"
                class="w-16 h-9 p-0.5 rounded-md text-white"
                :class="[commentContent.length > 0 ? 'bg-green-600' : 'bg-gray-500']"
                @click="submitComment"
              >
                回覆
              </button>
            </div>
          </div>

          <!-- comments Section -->
          <div class="mt-3 sm:ml-[60px]">
            <CommentList :commentListData="commentList" />
          </div>
        </div>
      </div>
    </template>
  </template>
</template>
