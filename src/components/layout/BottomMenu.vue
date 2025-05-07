<script setup lang="ts">
import { ref } from 'vue';
import Cookies from 'js-cookie';
import { isEmpty } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faHome,
  faCompass,
  faUser,
  faPenNib,
  faPenToSquare
} from '@fortawesome/free-solid-svg-icons';
import { useMainStore } from '@/store';
import { scrollToTop } from '@/utils/common';
import { usePostStore } from '@/store/post';
import { useAuthStore } from '@/store/auth';

library.add(faHome, faCompass, faUser, faPenNib, faPenToSquare);

const mainStore = useMainStore();
const authStore = useAuthStore();
const postStore = usePostStore();
const userId = Cookies.get('uid'); // userId，判斷有沒有登入
const activePage = ref(mainStore.activePage);
const authToken = Cookies.get('authToken');
</script>

<template>
  <div class="w-full h-full flex items-center">
    <!-- home page -->
    <router-link
      to="/"
      class="w-1/3 flex justify-center py-3 cursor-pointer"
      @click="
        () => {
          mainStore.setActivePage('home');
          scrollToTop();
        }
      "
    >
      <font-awesome-icon
        :icon="['fas', 'home']"
        class="w-5 h-5 text-gray-500"
        :class="{ 'text-orange-500': activePage === '' || activePage === 'home' }"
      />
    </router-link>

    <!-- explore page -->
    <router-link
      to="/explore"
      class="w-1/3 flex justify-center py-3 cursor-pointer"
      @click="
        () => {
          mainStore.setActivePage('explore');
          scrollToTop();
        }
      "
    >
      <font-awesome-icon
        :icon="['fas', 'compass']"
        class="w-5 h-5 text-gray-500"
        :class="{ 'text-orange-500': activePage === 'explore' }"
      />
    </router-link>

    <!-- 未登入狀態 => 登入功能 -->
    <button
      v-if="isEmpty(authToken) || isEmpty(userId)"
      aria-label="user"
      type="button"
      class="w-1/3 flex justify-center py-3 cursor-pointer"
      @click="
        () => {
          authStore.setSignInPop(true);
        }
      "
    >
      <font-awesome-icon :icon="['fas', 'user']" class="w-5 h-5 text-gray-500" />
    </button>

    <!-- 已登入狀態 => 顯示建立(文章、貼文)&個人頁面 -->
    <button
      v-else
      aria-label="user"
      type="button"
      class="w-1/3 flex justify-center py-3 cursor-pointer"
      @click="
        () => {
          postStore.setShowCreateModal(true);
        }
      "
    >
      <font-awesome-icon :icon="['fas', 'square-plus']" class="w-5 h-5 text-gray-500" />
    </button>
    <router-link
      v-else
      :to="`/user/profile/${userId}`"
      class="w-1/3 flex justify-center py-3 cursor-pointer"
      @click="
        () => {
          mainStore.setActivePage('user');
          scrollToTop();
        }
      "
    >
      <font-awesome-icon
        :icon="['fas', 'user']"
        class="w-5 h-5 text-gray-500"
        :class="{ 'text-orange-500': activePage === 'user' }"
      />
    </router-link>
  </div>
</template>
