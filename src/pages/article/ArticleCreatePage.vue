<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { get, isEmpty } from 'lodash';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCircleLeft, faSpinner } from '@fortawesome/free-solid-svg-icons';
// 引入Tiptap相關套件
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import TiptapToolbar from '@/components/editor/TiptapToolbar.vue';
import '@/tiptap.css';
import { createArticle } from '@/api/article';
import { ERR_NETWORK_MSG } from '@/constants/StringConstants';
import { getCookies } from '@/utils/common';
import { errorAlert, handleStatus } from '@/utils/fetch';

library.add(faCircleLeft, faSpinner);

const userId = getCookies('uid');
const isLoading = ref(false);
const title = ref('');
const content = ref('');
const router = useRouter();
const editor = ref<any>(null);
const isEditorReady = ref(false);

onMounted(() => {
  editor.value = new Editor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: '開始編輯您的文章...',
        emptyEditorClass: 'is-editor-empty'
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true })
    ],
    content: '',
    editable: true,
    onUpdate: ({ editor }) => {
      content.value = editor.getHTML();
    },
    onTransaction: () => {
      isEditorReady.value = true;
    }
  });
});

/** 發佈文章 */
const handleSubmit = async () => {
  isLoading.value = true;

  if (!title.value) {
    errorAlert('請輸入文章標題');
    return;
  } else if (!editor.value?.getHTML()) {
    errorAlert('請輸入文章內容');
    return;
  }

  try {
    const res = await createArticle(userId!, title.value, editor.value.getHTML());
    if (handleStatus(get(res, 'status')) === 2) {
      Swal.fire({
        title: '文章已發佈',
        icon: 'success',
        confirmButtonText: '確認'
      }).then((result) => {
        if (result.isConfirmed) router.push('/');
      });
    } else if (handleStatus(get(res, 'status')) === 5) {
      errorAlert(get(res, 'data.message'));
    } else if (get(res, 'code') === 'ERR_NETWORK') {
      errorAlert(ERR_NETWORK_MSG);
    }
  } catch (error) {
    errorAlert();
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="w-full md:max-w-[600px] mx-2 sm:m-0">
    <!-- header -->
    <div class="flex justify-between items-center p-2">
      <div class="hidden sm:block w-10 sm:w-24">
        <button
          aria-label="back"
          type="button"
          class="justify-center items-center p-2 text-gray-500 hover:text-orange-500 hidden sm:block"
          @click="async () => {}"
        >
          <FontAwesomeIcon :icon="['fas', 'circle-left']" class="w-7 h-7" />
        </button>
      </div>
      <p class="text-2xl font-bold">建立文章</p>
      <div class="flex gap-2">
        <button
          v-if="!isEmpty(title)"
          type="button"
          class="flex justify-center items-center w-16 sm:w-20 h-9 p-2 sm:py-1.5 text-white rounded-md bg-green-600"
          @click="handleSubmit"
        >
          <p v-if="isLoading">
            <FontAwesomeIcon :icon="['fas', 'spinner']" class="animate-spin h-5 w-5 m-1.5" />
          </p>
          <p v-else class="text-[14px] sm:text-[16px]">發佈</p>
        </button>
        <button
          v-else
          type="button"
          class="flex justify-center items-center w-16 sm:w-20 p-2 sm:py-1.5 text-white rounded-md bg-gray-600 cursor-default"
        >
          <p class="text-[14px] sm:text-[16px]">發佈</p>
        </button>
      </div>
    </div>

    <!-- 文字編輯工具列 -->
    <TiptapToolbar v-if="isEditorReady" :editor="editor" />
    <div class="mb-2">
      <input
        type="text"
        name="title"
        v-model="title"
        placeholder="文章標題"
        class="w-full text-2xl outline-none dark:text-white dark:bg-gray-950"
      />
    </div>
    <div class="relative max-h-minus280 h-minus280 overflow-y-auto">
      <EditorContent
        v-if="editor"
        :editor="editor"
        class="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none"
      />
    </div>
  </div>
</template>
