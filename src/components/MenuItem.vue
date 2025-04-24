<script setup lang="ts">
import { defineEmits, defineProps, ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { isEmpty } from 'lodash';
import { usePostStore } from '@/store/post';

library.add(faPenToSquare);

const props = defineProps<{
  href: string;
  text: string;
  count?: number;
  activeItem: boolean;
}>();

const emit = defineEmits<{
  (e: 'handleClick'): void;
}>();

const href = ref(props.href);
const text = ref(props.text);
const count = ref(props.count);
const activeItem = ref(props.activeItem);
const postStore = usePostStore();

const handleClick = () => {
  emit('handleClick');
};
</script>

<template>
  <li>
    <button
      v-if="text === '建立貼文'"
      type="button"
      class="flex my-1.5 text-xl text-gray-700 fill-gray-700 dark:text-gray-300 dark:fill-gray-300 cursor-pointer hover:text-orange-500 hover:fill-orange-500 py-3"
      :class="{ 'text-orange-500': activeItem }"
      @click="
        () => {
          handleClick(); // 關閉選單
          postStore.setShowCreateModal(true);
        }
      "
    >
      <div class="flex items-center">
        <font-awesome-icon :icon="['fas', 'pen-to-square']" />
      </div>
      <span class="ml-3 font-bold">{{ text }}</span>
    </button>

    <router-link
      v-else
      :to="href"
      class="flex my-1.5 text-xl text-gray-700 fill-gray-700 dark:text-gray-300 dark:fill-gray-300 cursor-pointer hover:text-orange-500 hover:fill-orange-500 py-3"
      :class="{ 'text-orange-500': activeItem }"
      @click="handleClick()"
    >
      <span class="flex items-center">
        <slot name="icon"></slot>
      </span>
      <span class="ml-3 font-bold">
        {{ text }}
        <span
          v-if="!isEmpty(count)"
          class="rounded-full py-0.5 px-2 ml-3 text-xs text-white bg-orange-500 cursor-pointer"
        >
          {{ count }}
        </span>
      </span>
    </router-link>
  </li>
</template>
