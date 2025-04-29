<script setup lang="ts">
import { computed } from 'vue';
import {
  SIDEBAR_FRAME,
  SIDEBAR_CONTAINER_FRAME,
  BOTTOM_MENU_FRAME
} from './constants/LayoutConstants';
import Header from '@/components/layout/Header.vue';
import SideBar from '@/components/layout/SideBar.vue';
import BottomMenu from '@/components/layout/BottomMenu.vue';
import SignInModal from '@/components/auth/SignInModal.vue';
import SignUpModal from '@/components/auth/SignUpModal.vue';

import { useAuthStore } from './store/auth';
import { useMainStore } from './store';

const authStore = useAuthStore();
const mainStore = useMainStore();
const darkMode = computed(() => mainStore.darkMode);
</script>

<template>
  <div class="font-sans" :class="darkMode ? 'dark' : ''">
    <div
      class="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100"
    >
      <Header />
      <main class="mb-auto mt-[52px] sm:mt-16 flex-grow flex justify-center">
        <div class="w-full flex justify-between">
          <section :class="SIDEBAR_FRAME">
            <SideBar />
          </section>
          <section :class="SIDEBAR_CONTAINER_FRAME">
            <router-view />
          </section>
          <section :class="BOTTOM_MENU_FRAME">
            <BottomMenu />
          </section>
        </div>
      </main>

      <SignInModal v-if="authStore.showSignInPop" />
      <SignUpModal v-if="authStore.showSignUpPop" />
    </div>
  </div>
</template>
