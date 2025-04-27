<script setup lang="ts">
import { ref, defineProps, defineEmits, computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { usePostStore } from '@/store/post';
import { isEmpty } from 'lodash';
import { HINT_LABEL } from '@/constants/LayoutConstants';
import { scrollToTop } from '@/utils/common';

library.add(faPenToSquare);

const props = defineProps<{
  href: string;
  text: string;
  count?: number;
  activeItem: boolean;
}>();

const emit = defineEmits<{
  (e: 'changeItem'): void;
}>();

const postStore = usePostStore();
const createPostButton = ref<HTMLButtonElement | null>(null);
const navLink = ref<HTMLElement | null>(null);
const href = ref(props.href);
const text = ref(props.text);
const count = ref(props.count);
const activeItem = ref(props.activeItem);
const showTip = ref(false);
const activeStyle = 'text-[var(--active)] hover:text-[var(--active)] hover:fill-[var(--active)]';
const normalStyle = 'text-gray-700 dark:text-gray-300 hover:text-[var(--active)]';
const linkStyle = computed(() => {
  return activeItem.value ? activeStyle : normalStyle;
});

const changeItem = () => {
  emit('changeItem');
};

/** 設定提示框顯示 */
const setShowTip = (value: boolean) => {
  showTip.value = value;
};
</script>

<template>
  <div class="relative">
    <button
      v-if="text === '建立貼文'"
      type="button"
      ref="createPostButton"
      class="flex my-1.5 ml-3 text-xl cursor-pointer py-4"
      :class="normalStyle"
      @click="() => postStore.setShowCreateModal(true)"
      @mouseenter="() => setShowTip(true)"
      @mouseleave="() => setShowTip(false)"
    >
      <div class="flex items-center">
        <font-awesome-icon icon="['fas', 'pen-to-square']" />
      </div>
      <span class="ml-3 font-bold hidden lg:block">建立貼文</span>
    </button>

    <router-link
      v-else
      :to="href"
      class="flex my-1.5 ml-3 text-xl cursor-pointer py-4"
      :class="linkStyle"
      ref="navLink"
      @click="
        () => {
          changeItem();
          scrollToTop();
        }
      "
      @mouseenter="() => setShowTip(true)"
      @mouseleave="() => setShowTip(false)"
    >
      <span class="flex items-center">
        <slot name="icon"></slot>
      </span>
      <span class="ml-3 font-bold hidden lg:block">
        {{ text }}
        <span
          v-if="!isEmpty(count)"
          class="rounded-full py-0.5 px-2 ml-3 text-xs text-white bg-orange-500 cursor-pointer"
        >
          {{ count }}
        </span>
      </span>
    </router-link>

    <div
      class="absolute top-3 left-10 w-16 lg:hidden dark:font-bold z-50"
      :class="[HINT_LABEL, showTip ? 'block' : 'hidden']"
    >
      {{ text }}
    </div>
  </div>
</template>
