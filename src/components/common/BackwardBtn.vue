<script setup lang="ts">
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { useMainStore } from '@/store';
import { checkCancelEdit } from '@/utils/common';

library.add(faCircleLeft);

const mainStore = useMainStore();
const editMode = ref(mainStore.editMode);

const handleBackward = async () => {
  if (editMode) {
    const isClose = await checkCancelEdit();
    if (isClose) {
      // 編輯模式再次確認是否取消編輯
      if (window.location.pathname.includes('/article/create')) history.back();
      mainStore.setEditMode(false);
    }
  } else {
    history.back();
  }
};
</script>

<template>
  <div>
    <button
      aria-label="back"
      type="button"
      className="flex items-center text-gray-500 hover:text-orange-500 xl:absolute xl:left-5"
      @click="handleBackward"
    >
      <FontAwesomeIcon :icon="['fas', 'circle-left']" class="w-7 h-7" />
    </button>
  </div>
</template>
