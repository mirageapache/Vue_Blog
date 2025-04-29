<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHeart, faComment, faShare } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { isEmpty } from 'lodash';
import { usePostStore } from '@/store/post';
import { useAuthStore } from '@/store/auth';
import type { PostDataType } from '@/types/postType';
import PostInfoItem from './PostInfoItem.vue';
import { checkLogin, getCookies } from '@/utils/common';
import { HINT_LABEL } from '@/constants/LayoutConstants';
import { toggleLikePost } from '@/api/post';

library.add(faHeart, faComment, faShare, faHeartRegular);

const props = defineProps<{
  postData: PostDataType;
}>();

const userId = getCookies('uid');
const state = reactive({ post: props.postData });
const { post } = state;
const postStore = usePostStore();
const authStore = useAuthStore();
const showShareInfo = ref(false);
const showCopyHint = ref(false); // 顯示"已複製"提示標籤
const likeCount = post.likedByUsers.length; // 喜歡數
const commentCount = post.comments.length; // 留言數
const url = window.location.toString();

const isLike = computed(() => !isEmpty(post.likedByUsers.find((item) => item._id === userId)));

/** 喜歡/取消喜歡貼文 */
const handleLikePost = async (e: any) => {
  e.stopPropagation();
  if (!checkLogin()) {
    authStore.setSignInPop(true);
    return;
  }
  const res = await toggleLikePost(post._id, userId!, !isLike);
  if (res.success) {
    Object.assign(post, res.updateResult);
  }
};

/** 複製貼文連結 */
const copyLink = () => {
  navigator.clipboard.writeText(url).then(() => {
    showCopyHint.value = true;
    setTimeout(() => {
      showCopyHint.value = false;
    }, 2000);
  });
};

/** 分享至FB */
const shareToFB = () => {
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  window.open(shareUrl, '_blank');
};

/** 分享至Line */
const shareToLine = () => {
  const shareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=與你分享一則Blog貼文}`;
  window.open(shareUrl, '_blank');
};

/** 處理編輯貼文按鈕 */
const handleClickEdit = (e: any) => {
  e.stopPropagation();
  postStore.setPostId(post._id);
  postStore.setPostData(post);
  postStore.setShowEditModal(true);
};
</script>

<template>
  <div class="flex justify-between">
    <div class="flex gap-4">
      <!-- 喜歡 -->
      <PostInfoItem
        v-if="isLike"
        tipText="取消喜歡"
        :count="likeCount || 0"
        faClass="text-red-500 hover:text-gray-400"
        tipClass="w-20"
        :handle-click="handleLikePost"
      >
        <template #icon>
          <font-awesome-icon :icon="['fas', 'heart']" class="w-5 h-5 m-1.5" />
        </template>
      </PostInfoItem>
      <PostInfoItem
        v-else
        tipText="喜歡"
        :count="likeCount || 0"
        faClass="text-gray-400 dark:text-gray-100 hover:text-red-500 dark:hover:text-red-500"
        tipClass="w-12"
        :handle-click="handleLikePost"
      >
        <template #icon>
          <font-awesome-icon :icon="['far', 'heart']" class="w-5 h-5 m-1.5" />
        </template>
      </PostInfoItem> 

      <!-- 留言 -->
      <PostInfoItem
        tipText="留言"
        :count="commentCount || 0"
        faClass="text-gray-400 dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-500"
        tipClass="w-12"
        :handle-click="() => {}"
      >
        <template #icon>
          <font-awesome-icon :icon="['fas', 'comment']" class="w-5 h-5 m-1.5" />
        </template>
      </PostInfoItem>
    </div>

    <div class="flex gap-4">
      <!-- 分享 -->
      <div class="relative">
        <PostInfoItem
          tipText="分享"
          :count="post.shareCount || undefined"
          faClass="text-gray-400 dark:text-gray-100 hover:text-orange-500 dark:hover:text-orange-500"
          tipClass="w-12"
          :handle-click="() => (showShareInfo = !showShareInfo)"
        >
          <template #icon>
            <font-awesome-icon :icon="['fas', 'share']" class="w-5 h-5 m-1.5" />
          </template>
        </PostInfoItem>
        <div v-if="showShareInfo" class="relative z-30">
          <div class="fixed w-dvw h-dvh top-0 left-0" @click="() => (showShareInfo = false)" />
          <ul
            class="absolute top-[-180px] right-0 bg-white dark:bg-gray-900 z-40 w-[200px] shadow border border-gray-400 rounded-md p-2 text-gray-700 dark:text-gray-300"
          >
            <li class="relative p-1 hover:bg-gray-300 dark:hover:bg-gray-700">
              <button type="button" class="flex items-center gap-2 w-full p-1" @click="copyLink">
                <font-awesome-icon :icon="['fas', 'link']" class="w-6 h-6 text-orange-500" />
                <p>複製連結</p>
              </button>
              <span
                class="w-20 top-[-36px] left-12"
                :class="[HINT_LABEL, showCopyHint ? 'block' : 'hidden']"
              >
                已複製！
              </span>
            </li>
            <li class="p-1 hover:bg-gray-300 dark:hover:bg-gray-700">
              <button type="button" class="flex items-center gap-2 w-full p-1" @click="shareToFB">
                <font-awesome-icon :icon="['fab', 'facebook']" class="w-6 h-6 text-blue-600" />
                <p>分享至FaceBook</p>
              </button>
            </li>
            <li class="p-1 hover:bg-gray-300 dark:hover:bg-gray-700">
              <button type="button" class="flex items-center gap-2 w-full p-1" @click="shareToLine">
                <font-awesome-icon :icon="['fab', 'line']" class="w-6 h-6 text-green-600" />
                <p>分享至Line</p>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <!-- 編輯 -->
      <span v-if="userId === post.author._id">
        <PostInfoItem
          tipText="編輯"
          :count="undefined"
          faClass="text-gray-400 dark:text-gray-100 hover:text-orange-500 dark:hover:text-orange-500"
          tipClass="w-12"
          :handle-click="handleClickEdit"
        >
          <template #icon>
            <font-awesome-icon :icon="['fas', 'square-pen']" class="w-5 h-5 m-1.5" />
          </template>
        </PostInfoItem>
      </span>
    </div>
  </div>
</template>
