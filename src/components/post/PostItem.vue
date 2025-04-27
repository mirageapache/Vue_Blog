<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import moment from 'moment';
import Swal from 'sweetalert2';

import { isEmpty } from 'lodash';
import { usePostStore } from '@/store/post';
import type { PostDataType } from '@/types/postType';
import { formatDateTime } from '@/utils/dateTime';
import { getCookies } from '@/utils/common';
import { HINT_LABEL } from '@/constants/LayoutConstants';
import UserInfoPanel from '../user/UserInfoPanel.vue';
import PostInfoItem from './PostInfoItem.vue';

const props = defineProps<{
  postData: PostDataType;
}>();

const { postData } = props;
const isCurrentUser = getCookies('uid');
const path = window.location.pathname;
const { _id, author, content, image, createdAt, editedAt } = postData;
const postStore = usePostStore();
const router = useRouter();
const showCreateTip = ref(false);
const showEditTip = ref(false);
const hiddenContent = ref(true);
const iconName = ref(['fas', 'trash-can']);
/** 點選貼文 */
const handleClickPost = () => {
  postStore.setPostId(_id);
  postStore.setPostData(postData);
  router.push(`/post/${_id}`); // 導到詳細頁
};

/** 刪除貼文 */
const handleDelete = (e: Event) => {
  e.stopPropagation();
  if (isCurrentUser) {
    Swal
      .fire({
        title: '確定要刪除此貼文嗎？',
        text: '確定後會立即刪除貼文',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '確定',
        cancelButtonText: `取消`,
      })
      .then((result) => {
        // if (result.isConfirmed) deleteMutation.mutate();
      });
    }
  };

</script>

<template>
  <div class="flex text-left border-b-[1px] dark:border-gray-700 p-3 last:border-b-0 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
    <div class="w-full" @click={handleClickPost}>
      <div class="flex justify-between">
        <UserInfoPanel
          :userId="author._id"
          :account="author.account"
          :name="author.name"
          :avatarUrl="author.avatar"
          :bgColor="author.bgColor"
          class="my-2"
        />
        <div class="flex">
          <div class="flex flex-col justify-start items-end mr-2">
            <span
              class="relative"
              @mouseenter="() => showCreateTip = true"
              @mouseleave="() => showCreateTip = false"
            >
              <p class="text-gray-600 dark:text-gray-300 mt-1">
                {{ formatDateTime(createdAt) }}
              </p>
              <span
                class="top-[-25px] right-0 w-40"
                :class="{ HINT_LABEL, block: showCreateTip, hidden: !showCreateTip }"
              >
                Created at {{ moment(createdAt).format('MMMM Do YYYY, h:mm:ss') }}
              </span>
            </span>
            <span
              v-if="!isEmpty(editedAt)"
              class="relative"
              @mouseenter="() => showEditTip = true"
              @mouseleave="() => showEditTip = false"
            >
              <small class="text-gray-400">(已編輯)</small>
              <span
                class="right-0 w-40"
                :class="{ HINT_LABEL, block: showEditTip, hidden: !showEditTip }"
              >
                Edited at {{ moment(editedAt).format('MMMM Do YYYY, h:mm:ss') }}
              </span>
            </span>
          </div>
          <PostInfoItem
            v-if="isCurrentUser && path.includes('/profile')"
            :iconName="iconName"
            tipText="刪除"
            :count="undefined"
            faClass="text-gray-400 dark:text-gray-100 hover:text-orange-500 dark:hover:text-orange-500"
            tipClass="w-12"
            :handle-delete="handleDelete"
          />
        </div>
      </div>
      <div class="sm:ml-[60px] px-2">
        <!-- image -->
        <div v-if="!isEmpty(postData.image)">
          <img
            class="w-full max-h-[500px] object-contain rounded-md"
            :src="image"
            alt="postImage"
          />
        </div>

        <!-- content -->
        <div class="my-2">
          <div
            id="post-container"
            class="text-gray-600 dark:text-gray-300"
            :class="{ 'max-h-[300px] line-clamp-[10]': hiddenContent }"
            v-html="content"
          />
          <button v-if="hiddenContent" type="button" @click="hiddenContent = false">
            顯示更多
          </button>
        </div>

        <!-- info panel -->
        <!-- <PostInfoPanel postData={postData} /> -->
      </div>
    </div>
  </div>
</template>