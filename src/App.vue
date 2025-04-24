<script setup lang="ts">
import {
  SIDEBAR_FRAME,
  SIDEBAR_CONTAINER_FRAME,
  BOTTOM_MENU_FRAME
} from './constants/LayoutConstants';
import Header from '@/components/Header.vue';
import SideBar from '@/components/SideBar.vue';

</script>

<template>
  <div class="font-sans">
      <div class="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <Header />
        <main class="mb-auto mt-[52px] sm:mt-16 flex-grow flex justify-center">
          <div class="w-full flex justify-between">
            <section :class={SIDEBAR_FRAME}>
              <SideBar />
            </section>
            <section :class={SIDEBAR_CONTAINER_FRAME}>
            </section>
            <section :class={BOTTOM_MENU_FRAME}>
              <!-- <BottomMenu /> -->
            </section>
          </div>
        </main>
      </div>
    </div>
</template>
