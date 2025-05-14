<script setup lang="ts">
import { computed, ref } from 'vue';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faHome,
  faPenNib,
  faPenToSquare,
  faSun,
  faMoon,
  faRightFromBracket,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import { faCompass } from '@fortawesome/free-regular-svg-icons';
import { isEmpty } from 'lodash';
import { useMainStore } from '@/store';
import { useUserStore } from '@/store/user';
import { useRouter } from 'vue-router';
import { checkLogin, scrollToTop } from '@/utils/common';
import MenuItem from '@/components/layout/MenuItem.vue';
import UserInfoPanel from '../user/UserInfoPanel.vue';
import type { UserDataType } from '@/types/userType';

library.add(faHome, faCompass, faPenNib, faPenToSquare, faSun, faMoon, faRightFromBracket, faXmark);

const props = defineProps<{
  toggleMenuAnimation: string;
}>();
const emit = defineEmits<{
  (e: 'setToggleMenuAnimation', value: string): void;
}>();

const router = useRouter();
const mainStore = useMainStore();
const userStore = useUserStore();
const userData = ref<UserDataType | null>(userStore.userData);
const toggleMenuAnimation = computed(() => props.toggleMenuAnimation);

/** 關閉選單 */
const closeMenu = () => {
  emit('setToggleMenuAnimation', 'translate-x-full');
};

/** 登出 */
const handleLogout = () => {
  localStorage.removeItem('authToken');
  Cookies.remove('uid');
  Swal.fire({
    title: '已成功登出',
    icon: 'info',
    confirmButtonText: '確認'
  }).then(() => {
    closeMenu();
    mainStore.setActivePage('home');
    router.push('/');
    window.location.reload();
  });
};
</script>

<template>
  <nav class="fixed">
    <!-- 背景遮罩 -->
    <button
      type="button"
      class="w-full h-full top-0 left-0 text-transparent"
      :class="[toggleMenuAnimation === 'translate-x-full' ? 'hidden' : 'fixed']"
      @click="closeMenu()"
    />
    <!-- 選單內容 -->
    <div
      class="fixed z-50 top-0 right-0 w-full sm:max-w-[300px] h-full flex flex-col transform duration-300 ease-in-out bg-white opacity-[0.98] dark:bg-gray-950 dark:opacity-[0.98] border-l-[1px] border-gray-300 dark:border-gray-700"
      :class="toggleMenuAnimation"
    >
      <div class="z-10 w-full flex justify-end py-2 px-4">
        <!-- 關閉選單 -->
        <button aria-label="close" type="button" class="flex justify-center m-1" @click="closeMenu()">
          <font-awesome-icon
            :icon="['fas', 'xmark']"
            class="h-7 w-7 m-1 text-gray-900 dark:text-gray-100"
          />
        </button>
      </div>
      <div v-if="checkLogin()" class="px-3 border-b-[1px] border-gray-400 dark:border-gray-70">
        <UserLoading v-if="isEmpty(userData)" withBorder="{false}" />
        <router-link
          v-else
          to="/user/profile/{{userData!.userId}}"
          @click="
            () => {
              closeMenu();
              mainStore.setActivePage('user');
              scrollToTop();
            }
          "
        >
          <UserInfoPanel
            :userId="userData!.userId"
            :account="userData!.account"
            :name="userData!.name"
            :avatarUrl="userData!.avatar"
            :bgColor="userData!.bgColor"
            class="my-2 py-2 px-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            menuLink
          />
        </router-link>
      </div>
      <div class="h-full py-2 px-8 opacity-100">
        <div class="text-left h-fit sm:px-1">
          <ul class="ml-2.5">
            <MenuItem
              href="/"
              text="首頁"
              :count="0"
              :active-item="mainStore.activePage === '' || mainStore.activePage === 'home'"
              @handle-click="
                () => {
                  closeMenu();
                  mainStore.setActivePage('home');
                }
              "
            >
              <template #icon>
                <font-awesome-icon :icon="['fas', 'home']" />
              </template>
            </MenuItem>
            <MenuItem
              href="/explore"
              text="探索"
              :count="0"
              :active-item="mainStore.activePage === 'explore'"
              @click="
                () => {
                  closeMenu();
                  mainStore.setActivePage('explore');
                }
              "
            >
              <template #icon>
                <font-awesome-icon :icon="['far', 'compass']" />
              </template>
            </MenuItem>
            <MenuItem
              v-if="checkLogin()"
              href="/article/create"
              text="撰寫文章"
              :count="0"
              :active-item="mainStore.activePage === 'write'"
              @handle-click="
                () => {
                  closeMenu();
                  mainStore.setActivePage('write');
                  mainStore.setEditMode(true);
                  scrollToTop();
                }
              "
            >
              <template #icon>
                <font-awesome-icon :icon="['fas', 'pen-nib']" />
              </template>
            </MenuItem>
            <MenuItem
              v-if="checkLogin()"
              href=""
              text="建立貼文"
              :count="0"
              :active-item="false"
              @handle-click="closeMenu"
            >
              <template #icon>
                <font-awesome-icon :icon="['fas', 'pen-to-square']" />
              </template>
            </MenuItem>
          </ul>
        </div>
      </div>
      <div
        class="flex justify-between items-center p-3 border-t-[1px] border-gray-300 dark:border-gray-700"
      >
        <!-- 深色模式切換 -->
        <button
          aria-label="darkMode"
          type="button"
          class="w-14 h-7 flex items-center border border-gray-400 rounded-full px-2 bg-gray-150 dark:bg-gray-700"
          @click="() => mainStore.setDarkMode()"
        >
          <font-awesome-icon
            :icon="['fas', 'sun']"
            class="h-5 w-5 text-gray-900 translate-x-0 opacity-100 transform duration-300 ease-linear dark:translate-x-5 dark:opacity-0"
          />
          <font-awesome-icon
            :icon="['fas', 'moon']"
            class="absolute h-5 w-5 text-white translate-x-0 opacity-0 transform duration-300 ease-linear dark:translate-x-5 dark:opacity-100"
          />
        </button>

        <button aria-label="logout" type="button" class="p-2" @click="handleLogout()">
          <font-awesome-icon
            :icon="['fas', 'right-from-bracket']"
            class="h-5 w-5 text-gray-700 dark:text-gray-300"
          />
        </button>
      </div>
    </div>
  </nav>
</template>
