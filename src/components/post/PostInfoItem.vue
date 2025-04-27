<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { isEmpty } from 'lodash';
import { HINT_LABEL } from '@/constants/LayoutConstants';

const props = defineProps<{
  iconName: string[]; // 透過props傳遞icon名稱的寫法
  count: number | undefined; // 選項數量
  tipText: string; // 提示內容
  tipClass: string; // 提示樣式
  faClass: string; // icon樣式
}>()

const emit = defineEmits<{
  (e: 'handleDelete', event: Event): void;
}>();

const { iconName, count, tipText, tipClass, faClass } = props;
const showTip = ref(false);

const handleDelete = (event: Event) => {
  emit('handleDelete', event);
};

</script>

<template>
  <div>
    <span
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
        <font-awesome-icon :icon="iconName" class="w-5 h-5 m-1.5" />
      </button>
      <p
        v-if="!isEmpty(count) || count !== undefined"
        class="text-md font-bold text-center text-gray-400 dark:text-gray-100"
      >
        {{ count }}
      </p>
      <span
        class="top-[-25px] right-0"
        :class="{ tipClass, HINT_LABEL, block: showTip, hidden: !showTip }"
      >
        {{ tipText }}
      </span>
    </span>
  </div>

</template>