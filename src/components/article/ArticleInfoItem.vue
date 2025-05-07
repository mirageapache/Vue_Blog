<script setup lang="ts">
import { ref } from 'vue';
import { isEmpty } from 'lodash';
import { HINT_LABEL } from '@/constants/LayoutConstants';

const props = defineProps<{
  count: number | undefined; // 選項數量
  tipText: string; // 提示內容
  tipClass: string; // 提示樣式
  faClass: string; // icon樣式
}>();

const emit = defineEmits<{
  (e: 'handleClick', event: Event): void;
}>();

const handleClick = (e: Event) => {
  emit('handleClick', e);
};

const { count, tipText, tipClass, faClass } = props;
const showTip = ref(false);
</script>

<template>
  <div>
    <span
      class="relative flex justify-center items-center"
      @mouseenter="() => (showTip = true)"
      @mouseleave="() => (showTip = false)"
    >
      <button
        type="button"
        class="flex justify-center items-center"
        :class="faClass"
        @click="handleClick"
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
        class="top-[-25px] left-[-4px] z-40"
        :class="[tipClass, HINT_LABEL, showTip ? 'block' : 'hidden']"
      >
        {{ tipText }}
      </span>
    </span>
  </div>
</template>
