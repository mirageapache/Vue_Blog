<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faHome,
  faCompass,
  faUser,
  faPenNib,
  faPenToSquare
} from '@fortawesome/free-solid-svg-icons';
import { checkLogin, getCookies } from '@/utils/common';
import { useMainStore } from '@/store';
import { useAuthStore } from '@/store/auth';
import SideBarItem from '@/components/layout/SideBarItem.vue';

library.add(faHome, faCompass, faUser, faPenNib, faPenToSquare);

const mainStore = useMainStore();
const authStore = useAuthStore();
const activePage = mainStore.activePage;
const userId = getCookies('uid');
</script>

<template>
  <div className="text-left h-fit sm:px-1">
    <div>
      <SideBarItem
        href="/"
        text="首頁"
        :count="0"
        :active-item="activePage === '' || activePage === 'home'"
        @change-item="() => mainStore.setActivePage('home')"
      >
        <template #icon>
          <font-awesome-icon :icon="['fas', 'home']" />
        </template>
      </SideBarItem>
      <SideBarItem
        href="/explore"
        text="探索"
        :count="0"
        :active-item="activePage === 'explore'"
        @change-item="() => mainStore.setActivePage('explore')"
      >
        <template #icon>
          <font-awesome-icon :icon="['fas', 'compass']" />
        </template>
      </SideBarItem>
      <SideBarItem
        :href="checkLogin() ? `/user/profile/${userId}` : ''"
        text="個人資料"
        :count="0"
        :active-item="activePage === 'user'"
        @change-item="
          () => {
            if (checkLogin()) {
              mainStore.setActivePage('user');
            } else {
              authStore.setSignInPop(true);
            }
          }
        "
      >
        <template #icon>
          <font-awesome-icon :icon="['fas', 'user']" />
        </template>
      </SideBarItem>
      <SideBarItem
        v-if="checkLogin()"
        href="/article/create"
        text="撰寫文章"
        :count="0"
        :active-item="activePage === 'write'"
        @change-item="
          () => {
            mainStore.setActivePage('write');
          }
        "
      >
        <template #icon>
          <font-awesome-icon :icon="['fas', 'pen-nib']" />
        </template>
      </SideBarItem>
      <SideBarItem v-if="checkLogin()" href="" text="建立貼文" :count="0" :active-item="false">
        <template #icon>
          <font-awesome-icon :icon="['fas', 'pen-to-square']" />
        </template>
      </SideBarItem>
    </div>
  </div>
</template>
