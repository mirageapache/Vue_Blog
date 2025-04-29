<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { get, isEmpty } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faXmark, faCircleXmark, faSpinner, faImage } from '@fortawesome/free-solid-svg-icons';
import { usePostStore } from '@/store/post';
import { GRAY_BG_PANEL, WHITE_SPACER } from '@/constants/LayoutConstants';
import { getCookies } from '@/utils/common';
import { handleHashTag } from '@/utils/input';
import { createPost } from '@/api/post';
import { errorAlert, handleStatus } from '@/utils/fetch';
import Swal from 'sweetalert2';
import { ERR_NETWORK_MSG } from '@/constants/StringConstants';
library.add(faXmark, faCircleXmark, faSpinner, faImage);

const content = ref('');
const hashTagArr = ref([]);
const image = ref('');
const imageFile = ref<File | null>(null);
const contentRef = ref<HTMLDivElement | null>(null);
const postStore = usePostStore();
const isLoading = ref(false);
const placeholder = ref('分享你的想法...');
const showPlaceholder = ref(true);

/** 關閉modal */
const handleClose = () => {
  postStore.setShowCreateModal(false);
};

onMounted(() => {
  // 為編輯區域添加焦點事件
  if (contentRef.value) {
    // 確保 div 可編輯
    contentRef.value.setAttribute('contenteditable', 'true');

    // 在組件掛載後將焦點設置到編輯區域
    setTimeout(() => {
      contentRef.value?.focus();
      showPlaceholder.value = false;
    }, 300);

    contentRef.value.addEventListener('focus', () => {
      showPlaceholder.value = false;
    });

    contentRef.value.addEventListener('blur', () => {
      if (!contentRef.value?.innerText.trim()) {
        showPlaceholder.value = true;
      }
    });
  }
});

/** 處理欲上傳圖片檔 */
const handleFileChange = (event: Event) => {
  const fileList = (event.target as HTMLInputElement).files; // 獲取選擇的檔案列表
  if (!isEmpty(fileList) && fileList?.length) {
    const file = fileList[0];
    image.value = URL.createObjectURL(file);
    imageFile.value = file;
  }
};

/** 刪除圖片檔 */
const handleDeleteImage = () => {
  image.value = '';
  imageFile.value = null;
};

/** 處理div輸入行為 */
const handleOnInput = () => {
  if (contentRef.value) {
    const { formattedContent, hashTags } = handleHashTag(contentRef.value.innerText);
    content.value = formattedContent;
    hashTagArr.value = hashTags as never[];
  }
};

/** 發佈貼文 */
const handleSubmit = async () => {
  // validate form data
  if (isEmpty(content.value) || content.value.length === 0) {
    return;
  }
  const userId = getCookies('uid') as string;

  const formData = new FormData();
  formData.set('author', userId);
  formData.set('content', content.value);
  formData.set('status', '1');
  formData.set('image', image.value);
  formData.set('hashTags', JSON.stringify(hashTagArr.value));
  if (imageFile.value) formData.set('imageFile', imageFile.value);

  try {
    const res = await createPost(userId, formData);
    if (handleStatus(get(res, 'status')) === 2) {
      Swal.fire({
        title: '貼文已發佈',
        icon: 'success',
        confirmButtonText: '確認'
      }).then(() => {
        handleClose();
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
        <h3 class="text-xl font-bold">建立貼文</h3>
        <button
          aria-label="close"
          type="button"
          class="flex jsutify-center m-1"
          @click="handleClose"
        >
          <font-awesome-icon
            :icon="['fas', 'xmark']"
            class="h-6 w-6 m-1 text-gray-500 hover:text-red-500"
          />
        </button>
      </div>

      <!-- body | [h-minus120]是自訂的tailwind樣式 -->
      <div class="relative py-2 px-5 h-minus120 sm:h-auto">
        <!-- contenteditable功能 -->
        <div
          id="edit-container"
          contentEditable="true"
          ref="contentRef"
          class="w-full h-minus240 sm:h-auto sm:min-h-80 sm:max-h-70vh outline-none overflow-y-auto dark:text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-300 p-2 rounded-md cursor-text"
          @input="handleOnInput"
          @click="showPlaceholder = false"
        />
        <div
          v-if="showPlaceholder"
          class="absolute top-4 left-7 text-gray-400 pointer-events-none"
          @click="contentRef?.focus()"
        >
          {{ placeholder }}
        </div>

        <!-- image preview -->
        <div
          v-if="!isEmpty(image)"
          class="flex w-full h-24 overflow-y-hidden overflow-x-auto border-gray-400 border-t-[1px] pt-2"
        >
          <div class="relative">
            <img :src="image" alt="" class="h-24 object-cover" />
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
            class="w-40 sm:w-24 py-1.5 text-white rounded-md bg-green-600"
            @click="handleSubmit"
          >
            <font-awesome-icon
              v-if="isLoading"
              :icon="['fas', 'spinner']"
              class="animate-spin h-5 w-5"
            />
            <p v-else>發佈</p>
          </button>
          <button
            v-else
            type="button"
            class="w-40 sm:w-24 py-1.5 text-white rounded-md bg-gray-600"
          >
            發佈
          </button>
        </div>
      </div>
    </div>
    <div :class="GRAY_BG_PANEL" @click="handleClose" />
  </div>
</template>
