<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { isEmpty } from 'lodash';
import { HINT_LABEL } from '@/constants/LayoutConstants';
import { faHeart, faComment, faShare } from '@fortawesome/free-solid-svg-icons';

library.add(faHeart, faComment, faShare);

const props = defineProps<{
  count: number | undefined; // 選項數量
  tipText: string; // 提示內容
  tipClass: string; // 提示樣式
  faClass: string; // icon樣式
}>()

const emit = defineEmits<{
  (e: 'handleDelete', event: Event): void;
}>();

const { count, tipText, tipClass, faClass } = props;
const showTip = ref(false);

const handleDelete = (event: Event) => {
  emit('handleDelete', event);
};

</script>

<template>
  <div
    class="relative flex justify-center items-center"
    @mouseenter="() => showTip = true"
    @mouseleave="() => showTip = false"
  >
    <button
      type="button"
      class="flex justify-center items-center"
      :class="faClass"
      @click="(e) => handleDelete(e)"
    >
      <slot name="icon"></slot>
    </button>
    <p
      v-if="!isEmpty(count) || count !== undefined"
      class="text-md font-bold text-center text-gray-400 dark:text-gray-100"
    >
      {{ count }}
    </p>
    <span
      class="top-[-25px] right-0"
      :class="[tipClass, HINT_LABEL, showTip ? 'block' : 'hidden']"
    >
      {{ tipText }}
    </span>
  </div>
</template>