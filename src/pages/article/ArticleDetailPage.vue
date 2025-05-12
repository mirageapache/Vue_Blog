<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { isEmpty } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { getCookies } from '@/utils/common';
import { handleHashTag } from '@/utils/input';
import { useMainStore } from '@/store';
import { useAuthStore } from '@/store/auth';
import type { ArticleDataType } from '@/types/articleType';
import type { CommentDataType } from '@/types/commentType';
import { getArticleDetail, updateArticle } from '@/api/article';
import NoSearchResult from '@/components/tips/NoSearchResult.vue';
import ArticleLoading from '@/components/article/ArticleLoading.vue';
import ArticleInfoPanel from '@/components/article/ArticleInfoPanel.vue';
import UserInfoPanel from '@/components/user/UserInfoPanel.vue';
import CommentList from '@/components/comment/CommentList.vue';
import { errorAlert } from '@/utils/fetch';
import { createComment } from '@/api/comment';

library.add(faCircleLeft);

const mainStore = useMainStore();
const authStore = useAuthStore();
const userId = getCookies('uid'); // user id
const id = useRoute().params.id as string; // article id
const isLoading = ref(false);
const articleData = ref<ArticleDataType>();
const title = ref('');
const editMode = mainStore.editMode;
const commentContent = ref('');
const showPlaceholder = ref(true);
const commentInput = ref<HTMLDivElement | null>(null);
const commentList = ref<CommentDataType[]>([]);

/** 取得文章資料 */
const getArticleData = async () => {
  isLoading.value = true;
  const res = await getArticleDetail(id);
  if (res) {
    articleData.value = res.data;
    title.value = articleData.value.title;
  }
  isLoading.value = false;
};

/** 返回上一頁 */
const handleBackward = () => {
  history.back();
};

/** 處理comment div輸入 */
const handleCommentInput = () => {
  if (commentInput.value) {
    const { formattedContent } = handleHashTag(commentInput.value.innerText);
    commentContent.value = formattedContent;
  }
};

/** 回覆貼文 */
const submitComment = async () => {
  if (commentContent.value.trim().length === 0) return; // 檢查有沒有留言內容

  if (isEmpty(userId)) {
    authStore.setSignInPop(true);
    return;
  }

  try {
    const res = await createComment(id, userId!, commentContent.value, 'article');
    if (res.status === 200) {
      commentInput.value!.innerText = '';
      commentContent.value = '';
      getArticleData();
    } else {
      errorAlert();
    }
  } catch {
    errorAlert();
  }
};

/** 修改文章 */
const handleSubmit = async () => {
  console.log('handle submit');

  // const contentState = editorState.getCurrentContent();
  // const rawContent = convertToRaw(contentState);
  // const contentString = JSON.stringify(rawContent);
  
  // try {
  //   const res = await updateArticle(id, userId!, title.value, contentString);
  //   if (res.status === 200) {
  //     mainStore.setEditMode(false);
  //     getArticleData();
  //   } else {
  //     errorAlert();
  //   }
  // } catch (error) {
  //   errorAlert();
  // }
};

onMounted(() => {
  getArticleData();
});
</script>

<template>
  <template v-if="isLoading">
    <ArticleLoading :withBorder="false" />
  </template>
  <template v-else-if="isEmpty(articleData)">
    <NoSearchResult
      msgOne="該文章不存在或已刪除"
      msgTwo="無法瀏覽內容，請重新操作"
      type="article"
    />
  </template>
  <template v-else>
    <div class="flex justify-center w-full md:w-[600px]">
      <div class="w-full mb-2 px-2 sm:px-5">
        <div class="flex items-center border-b-[1px] xl:border-b-0 dark:border-gray-700">
          <button
            aria-label="back"
            type="button"
            class="hidden sm:flex items-center mr-4 p-2 text-gray-500 hover:text-orange-500 xl:absolute xl:left-5"
            @click="
              () => {
                if (editMode) mainStore.setEditMode(false);
                else handleBackward;
              }
            "
          >
            <font-awesome-icon :icon="['fas', 'circle-left']" class="w-7 h-7" />
          </button>
          <div
            class="flex justify-between items-center w-full xl:border-b-[1px] dark:border-gray-700"
          >
            <!-- 作者資訊 -->
            <UserInfoPanel
              :userId="articleData.author._id"
              :account="articleData.author.account"
              :name="articleData.author.name"
              :avatarUrl="articleData.author.avatar"
              :bgColor="articleData.author.bgColor"
              class="my-4"
            />

            <!-- 文章資訊 -->
            <ArticleInfoPanel
              :articleData="articleData"
              :commentInput="commentInput"
              :title="articleData.title"
              :hasContent="true"
              @handle-submit="handleSubmit"
            />
          </div>
        </div>
        <div class="flex flex-col w-full">
          <span v-if="editMode">
            <EditorToolBar
              toggleInlineStyle="{toggleInlineStyle}"
              toggleBlockType="{toggleBlockType}"
              handleFileInput="{handleFileInput}"
            />
            <div class="mb-2">
              <input
                type="text"
                name="title"
                placeholder="文章標題"
                v-model="title"
                class="w-full text-2xl outline-none dark:text-white dark:bg-gray-950"
              />
            </div>
          </span>
          <h2 v-else class="text-4xl my-4">{{ title }}</h2>

          <!-- 文章內文 -->
          <div
            class="relative p-0.5"
            :class="[editMode ? 'max-h-minus325 h-minus325 overflow-y-auto' : '']"
          >
            <!-- <Editor
              editorState="{editorState}"
              readOnly="{!editMode}"
              onChange="{setEditorState}"
              customStyleMap="{customStyleMap}"
              ref="{editorRef}"
              blockRendererFn="{blockRendererFn}"
            /> -->
          </div>
        </div>
        <!-- comments Section -->
        <div v-if="!editMode" class="relative mt-3 border-t-[1px]">
          <div class="flex justify-between my-3">
            <div
              ref="{commentInput}"
              contentEditable="true"
              aria-placeholder="留言"
              class="w-full mr-2 py-1.5 px-2 rounded-md outline-none bg-gray-100 dark:bg-gray-800"
              @input="handleCommentInput"
              @focus="
                () => {
                  showPlaceholder = false;
                }
              "
              @blur="
                () => {
                  if (isEmpty(commentContent)) showPlaceholder = true;
                }
              "
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

          <!-- 留言串 -->
          <CommentList :commentListData="commentList" />
        </div>
      </div>
    </div>
  </template>
</template>
