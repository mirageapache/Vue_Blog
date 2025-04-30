<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faXmark, faCircleXmark, faSpinner, faImage } from '@fortawesome/free-solid-svg-icons';
import { usePostStore } from '@/store/post';
import { GRAY_BG_PANEL, WHITE_SPACER } from '@/constants/LayoutConstants';
import { getCookies } from '@/utils/common';
import { handleHashTag } from '@/utils/input';
import { updatePost } from '@/api/post.ts';
import { get, isEmpty } from 'lodash';
import { errorAlert, handleStatus } from '@/utils/fetch';
import { ERR_NETWORK_MSG } from '@/constants/StringConstants';

library.add(faXmark, faCircleXmark, faSpinner, faImage);

const postStore = usePostStore();
const { postId, postData } = postStore;
const content = ref('');
const hashTagArr = ref([]);
const image = ref('');
const imageFile = ref<File | null>(null);
const removeImage = ref(false);
const contentRef = ref<HTMLDivElement | null>(null);
const firstLoad = ref(true);
const isLoading = ref(false);
const authorId = postData.author._id;

onMounted(() => {
  if (firstLoad.value) {
    if (contentRef.value) contentRef.value.innerHTML = postData.content;
    firstLoad.value = false;
  }
});

/** 關閉modal */
const handleClose = (showAlert: boolean) => {
  if (showAlert) {
    Swal.fire({
      title: '要取消編輯嗎?',
      text: '系統將不會儲存及修改貼文',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: '確定',
      cancelButtonText: `取消`
    }).then((result) => {
      if (result.isConfirmed) postStore.setShowEditModal(false);
    });
  } else {
    postStore.setShowEditModal(false);
  }
};

/** 處理上傳圖片檔 */
const handleFileChange = (event: Event) => {
  const fileList = (event.target as HTMLInputElement).files; // 獲取選擇的檔案列表
  if (!isEmpty(fileList) && fileList?.length) {
    const file = fileList[0];
    image.value = URL.createObjectURL(file);
    imageFile.value = file;
    removeImage.value = false;
  }
};

/** 刪除圖片檔 */
const handleDeleteImage = () => {
  image.value = '';
  imageFile.value = null;
  removeImage.value = true;
};

/** 處理div輸入行為 */
const handleOnInput = () => {
  if (contentRef.value) {
    const { formattedContent, hashTags } = handleHashTag(contentRef.value.innerText);
    content.value = formattedContent;
    hashTagArr.value = hashTags as never[];
  }
};

/** 編輯貼文 */
const handleSubmit = async () => {
  // 驗證content內容
  if (isEmpty(content.value) || content.value.length === 0) return;

  // 判斷登入操作者與作者id是否相同
  const userId = getCookies('uid') as string;
  if (userId !== authorId) {
    Swal.fire({
      title: '操作異常!',
      icon: 'warning',
      confirmButtonText: '確認'
    });
    return;
  }

  // 建立FormData
  const formData = new FormData();
  formData.set('postId', postId);
  formData.set('content', content.value);
  formData.set('status', '1');
  formData.set('image', image.value);
  formData.set('imageId', postData.imageId);
  formData.set('removeImage', removeImage.value.toString());
  formData.set('hashTags', JSON.stringify(hashTagArr.value));
  if (imageFile.value) formData.set('imageFile', imageFile.value);

  try {
    const res = await updatePost(userId, formData);
    if (handleStatus(get(res, 'status')) === 2) {
      Swal.fire({
        title: '貼文已修改',
        icon: 'success',
        confirmButtonText: '確認'
      }).then(() => {
        handleClose(false);
        window.location.reload();
      });
    } else if (handleStatus(get(res, 'status')) === 5) {
      errorAlert(get(res, 'data.message'));
    } else if (get(res, 'code') === 'ERR_NETWORK') {
      errorAlert(ERR_NETWORK_MSG);
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-30">
    <div
      class="fixed w-full h-dvh rounded-lg sm:max-w-[600px] sm:h-auto bg-white dark:bg-gray-800 z-40"
    >
      <!-- header -->
      <div
        class="flex justify-between items-center w-full py-2 px-5 border-b-[1px] border-gray-300 dark:border-gray-700"
      >
        <h3 class="text-xl font-bold">編輯貼文</h3>
        <button
          aria-label="close"
          type="button"
          class="flex jsutify-center m-1"
          @click="() => handleClose(true)"
        >
          <font-awesome-icon
            :icon="['fas', 'xmark']"
            class="h-6 w-6 m-1 text-gray-500 hover:text-red-500"
          />
        </button>
      </div>

      <!-- body -->
      <div class="relative py-2 px-5 h-minus120 sm:h-auto">
        <div
          id="edit-container"
          contentEditable="true"
          ref="contentRef"
          class="w-full h-minus240 sm:h-auto sm:min-h-80 sm:max-h-70vh outline-none overflow-y-auto"
          @input="handleOnInput"
        />

        <!-- image preview -->
        <div
          v-if="!isEmpty(image)"
          class="flex w-full h-24 overflow-y-hidden overflow-x-auto border-gray-400 border-t-[1px] pt-2"
        >
          <div class="relative">
            <img :src="image" alt="postImg" class="h-24 min-w-24 object-cover" />
            <button
              aria-label="close"
              type="button"
              :class="WHITE_SPACER"
              @click="handleDeleteImage"
            >
              <font-awesome-icon
                class="absolute top-[-8px] right-[-8px] w-5 h-5 text-gray-500 hover:text-red-500 z-30"
                :icon="['fas', 'circle-xmark']"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- footer -->
      <div
        class="fixed w-full bottom-0 sm:relative sm:bottom-auto flex justify-between py-3 px-5 text-right border-t-[1px] border-gray-300 dark:border-gray-700"
      >
        <div>
          <label htmlFor="postImage">
            <font-awesome-icon
              :icon="['fas', 'image']"
              class="h-6 w-6 m-1 cursor-pointer text-gray-500 hover:text-orange-500"
            />
          </label>
          <input
            id="postImage"
            class="hidden"
            name="postImage"
            type="file"
            @change="(e) => handleFileChange(e)"
          />
        </div>
        <div>
          <button
            v-if="!isEmpty(content) || content.length !== 0"
            type="button"
            class="flex justify-center items-center w-40 sm:w-24 py-1.5 text-white rounded-md bg-green-600"
            @click="handleSubmit"
          >
            <font-awesome-icon
              v-if="isLoading"
              :icon="['fas', 'spinner']"
              class="animate-spin h-5 w-5"
            />
            <p v-else>確認</p>
          </button>
          <button
            v-else
            type="button"
            class="w-40 sm:w-24 py-1.5 text-white rounded-md bg-gray-600"
          >
            確認
          </button>
        </div>
      </div>
    </div>
    <div :class="GRAY_BG_PANEL" @click="() => handleClose(true)" />
  </div>
</template>
