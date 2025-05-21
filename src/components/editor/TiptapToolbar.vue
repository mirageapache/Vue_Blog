<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faBold,
  faItalic,
  faStrikethrough,
  faCode,
  faListUl,
  faListOl,
  faQuoteLeft,
  faParagraph,
  faHeading,
  faUndo,
  faRedo,
  faPalette,
  faHighlighter,
  faEraser
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faBold,
  faItalic,
  faStrikethrough,
  faCode,
  faListUl,
  faListOl,
  faQuoteLeft,
  faParagraph,
  faHeading,
  faUndo,
  faRedo,
  faPalette,
  faHighlighter,
  faEraser
);

const props = defineProps<{
  editor: any;
}>();

const { editor } = props;

const colors = [
  { name: '黑色', value: '#000000' },
  { name: '紅色', value: '#ff0000' },
  { name: '綠色', value: '#00ff00' },
  { name: '藍色', value: '#0000ff' },
  { name: '黃色', value: '#ffff00' },
  { name: '紫色', value: '#800080' }
];

const highlights = [
  { name: '無', value: '#ffffff' },
  { name: '灰色', value: '#a0a0a0' },
  { name: '黃色', value: '#ffff00' },
  { name: '綠色', value: '#90EE90' },
  { name: '藍色', value: '#ADD8E6' },
  { name: '粉色', value: '#FFB6C1' }
];

const setColor = (color: string) => {
  editor.chain().focus().setColor(color).run();
};

const setHighlight = (color: string) => {
  if (color === '#ffffff') {
    editor.chain().focus().unsetHighlight().run();
  } else {
    editor.chain().focus().setHighlight({ color }).run();
  }
};

const clearFormat = () => {
  editor.chain().focus().clearNodes().unsetAllMarks().run();
};
</script>

<template>
  <div
    class="flex flex-wrap mb-4 p-1 border border-gray-300 rounded dark:border-gray-700 bg-gray-100 dark:bg-gray-800"
  >
    <button
      class="p-1 m-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
      :class="{ 'bg-gray-300 dark:bg-gray-600': editor.isActive('bold') }"
      @click="editor.chain().focus().toggleBold().run()"
    >
      <font-awesome-icon :icon="['fas', 'bold']" />
    </button>
    <button
      class="p-1 m-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
      :class="{ 'bg-gray-300 dark:bg-gray-600': editor.isActive('italic') }"
      @click="editor.chain().focus().toggleItalic().run()"
    >
      <font-awesome-icon :icon="['fas', 'italic']" />
    </button>
    <button
      class="p-1 m-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
      :class="{ 'bg-gray-300 dark:bg-gray-600': editor.isActive('strike') }"
      @click="editor.chain().focus().toggleStrike().run()"
    >
      <font-awesome-icon :icon="['fas', 'strikethrough']" />
    </button>
    <button
      class="p-1 m-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
      :class="{ 'bg-gray-300 dark:bg-gray-600': editor.isActive('code') }"
      @click="editor.chain().focus().toggleCode().run()"
    >
      <font-awesome-icon :icon="['fas', 'code']" />
    </button>
    <button
      class="p-1 m-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
      :class="{ 'bg-gray-300 dark:bg-gray-600': editor.isActive('heading', { level: 1 }) }"
      @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
    >
      <font-awesome-icon :icon="['fas', 'heading']" /> 1
    </button>
    <button
      class="p-1 m-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
      :class="{ 'bg-gray-300 dark:bg-gray-600': editor.isActive('heading', { level: 2 }) }"
      @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
    >
      <font-awesome-icon :icon="['fas', 'heading']" /> 2
    </button>
    <button
      class="p-1 m-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
      :class="{ 'bg-gray-300 dark:bg-gray-600': editor.isActive('paragraph') }"
      @click="editor.chain().focus().setParagraph().run()"
    >
      <font-awesome-icon :icon="['fas', 'paragraph']" />
    </button>
    <button
      class="p-1 m-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
      :class="{ 'bg-gray-300 dark:bg-gray-600': editor.isActive('bulletList') }"
      @click="editor.chain().focus().toggleBulletList().run()"
    >
      <font-awesome-icon :icon="['fas', 'list-ul']" />
    </button>
    <button
      class="p-1 m-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
      :class="{ 'bg-gray-300 dark:bg-gray-600': editor.isActive('orderedList') }"
      @click="editor.chain().focus().toggleOrderedList().run()"
    >
      <font-awesome-icon :icon="['fas', 'list-ol']" />
    </button>
    <button
      class="p-1 m-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
      :class="{ 'bg-gray-300 dark:bg-gray-600': editor.isActive('blockquote') }"
      @click="editor.chain().focus().toggleBlockquote().run()"
    >
      <font-awesome-icon :icon="['fas', 'quote-left']" />
    </button>
    <button
      class="p-1 m-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
      @click="editor.chain().focus().undo().run()"
    >
      <font-awesome-icon :icon="['fas', 'undo']" />
    </button>
    <button
      class="p-1 m-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
      @click="editor.chain().focus().redo().run()"
    >
      <font-awesome-icon :icon="['fas', 'redo']" />
    </button>

    <!-- 清除格式按鈕 -->
    <button
      class="p-1 m-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
      @click="clearFormat"
      title="清除格式"
    >
      <font-awesome-icon :icon="['fas', 'eraser']" />
    </button>

    <!-- 顏色選擇器 -->
    <div class="relative group">
      <button
        class="p-1 m-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        :class="{ 'bg-gray-300 dark:bg-gray-600': editor.isActive('textStyle') }"
      >
        <font-awesome-icon :icon="['fas', 'palette']" />
      </button>
      <div
        class="absolute hidden group-hover:block z-10 bg-white dark:bg-gray-800 p-3 rounded shadow-lg mt-[-3px] left-0 md:min-w-[120px]"
      >
        <div class="flex flex-col md:grid md:grid-cols-3 gap-3">
          <button
            v-for="color in colors"
            :key="color.value"
            class="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
            :style="{ backgroundColor: color.value }"
            @click="setColor(color.value)"
            :title="color.name"
          />
        </div>
      </div>
    </div>

    <!-- 背景色選擇器 -->
    <div class="relative group">
      <button
        class="p-1 m-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        :class="{ 'bg-gray-300 dark:bg-gray-600': editor.isActive('highlight') }"
      >
        <font-awesome-icon :icon="['fas', 'highlighter']" />
      </button>
      <div
        class="absolute hidden group-hover:block z-10 bg-white dark:bg-gray-800 p-3 rounded shadow-lg left-0 md:min-w-[80px]"
      >
        <div class="flex flex-col md:grid md:grid-cols-2 gap-3">
          <button
            v-for="highlight in highlights"
            :key="highlight.value"
            class="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
            :style="{ backgroundColor: highlight.value }"
            @click="setHighlight(highlight.value)"
            :title="highlight.name"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.group:hover .group-hover\:block {
  display: block;
}

/* 確保下拉選單不會被其他元素遮擋 */
.relative {
  position: relative;
  z-index: 10;
}

/* 當滑鼠移開時隱藏下拉選單 */
.group:hover .group-hover\:block {
  display: block;
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
