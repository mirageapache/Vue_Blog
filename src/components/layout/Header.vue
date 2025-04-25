<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch, faBars, faUser, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { faUser as faUserRegular } from '@fortawesome/free-regular-svg-icons';
import brand from '@/assets/vue.svg';
import { useMainStore } from '@/store/index.ts';
import { useAuthStore } from '@/store/auth';
import { checkLogin } from '@/utils/common';
import MainMenu from '@/components/layout/MainMenu.vue';
import BackwardBtn from '@/components/common/BackwardBtn.vue';

library.add(faSearch, faBars, faUser, faUserPlus, faUserRegular);

const router = useRouter();
const mainStore = useMainStore();
const authStore = useAuthStore();
const toggleMenuAnimation = ref('translate-x-full'); // MainMenu 動畫效果
const searchString = ref('');
const showBackward = ref(false);
const path = ref(window.location.pathname);

// 檢查當前路徑
const checkPath = () => {
  path.value = window.location.pathname;
  showBackward.value =
    path.value.includes('/article/') ||
    path.value.includes('/post/') ||
    path.value.includes('/user/');
};

/** 跳轉至搜尋頁 */
const handleSearch = (key: string) => {
  if (key === 'Enter' && searchString.value !== '') {
    mainStore.setActivePage('explore');
    router.push(`/explore?search=${searchString.value}`);
  }
};

/** 控制選單(開/關) */
const setToggleMenuAnimation = (value: string) => {
  toggleMenuAnimation.value = value;
};

/** 螢幕寬度大於768px收合toggle menu */
const screenWidthChange = () => {
  const screenWidth = window.innerWidth;
  if (screenWidth > 640 && toggleMenuAnimation.value === 'translate-x-0') {
    toggleMenuAnimation.value = 'translate-x-full';
  }
};

onMounted(() => {
  checkPath();
  window.addEventListener('resize', screenWidthChange);
});

onUnmounted(() => {
  window.removeEventListener('resize', screenWidthChange);
});
</script>

<template>
  <header
    class="fixed z-20 flex justify-center w-full bg-white dark:bg-gray-950 border-b-[1px] dark:border-gray-700"
  >
    <div class="w-full flex justify-between py-2 px-4">
      <div class="block sm:hidden">
        <span class="flex justify-center items-center w-9 h-9">
          <BackwardBtn v-if="showBackward" />
        </span>
      </div>
      <div id="brand" class="flex justify-center">
        <router-link
          class="flex flex-row items-center w-fit"
          to="/"
          @click="mainStore.setActivePage('home')"
        >
          <img class="w-8 h-8 sm:w-11 sm:h-11 mr-1 sm:mr-2.5" :src="brand" alt="logo" />
          <h3 class="font-mono text-[20px] sm:text-3xl font-semibold">VueBlog</h3>
        </router-link>
      </div>
      <nav class="flex items-center text-lg">
        <!-- 搜尋  -->
        <div v-if="!path.includes('/explore')" class="hidden sm:flex items-center mr-1.5">
          <input
            type="text"
            name="search"
            placeholder="搜尋..."
            v-model="searchString"
            @keyup="handleSearch($event.key)"
            class="p-4 pl-10 w-40 h-9 text-lg rounded-full bg-gray-200 dark:bg-gray-700 transition-all duration-300 ease-in-out focus:w-80 outline-none"
          />
          <FontAwesomeIcon
            :icon="['fas', 'search']"
            class="absolute h-5 w-5 m-1.5 ml-3 stroke-0 text-gray-500 dark:text-gray-100"
          />
        </div>

        <button
          aria-label="toggleMenu"
          v-if="checkLogin()"
          type="button"
          class="flex justify-center items-center mx-1.5"
          @click="toggleMenuAnimation = 'translate-x-0'"
        >
          <FontAwesomeIcon
            :icon="['fas', 'bars']"
            class="h-6 w-6 m-1 text-gray-900 dark:text-gray-100"
          />
        </button>
        <div v-else class="flex justify-around items-center">
          <!-- 登入 -->
          <button
            type="button"
            class="flex items-center rounded-full text-white bg-sky-500 hover:bg-sky-700 p-2 md:px-4 md:py-1 dark:bg-sky-800"
            @click="authStore.setSignInPop(true)"
          >
            <p class="hidden md:inline-block">登入</p>
            <FontAwesomeIcon :icon="['far', 'user']" class="h-5 w-5 md:hidden dark:opacity-100" />
          </button>
          <!-- 註冊 -->
          <button
            type="button"
            class="hidden md:flex items-center rounded-full ml-2 p-2 md:px-4 md:py-1 text-gray-400 border border-gray-400 dark:text-gray-300"
            @click="authStore.setSignUpPop(true)"
          >
            <p class="hidden md:inline-block">註冊</p>
            <FontAwesomeIcon
              :icon="['fas', 'user-plus']"
              class="h-5 w-5 md:hidden dark:opacity-100"
            />
          </button>
        </div>
      </nav>

      <MainMenu
        :toggle-menu-animation="toggleMenuAnimation"
        @set-toggle-menu-animation="setToggleMenuAnimation"
      />
    </div>
  </header>
</template>
