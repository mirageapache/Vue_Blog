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
  faRedo
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
  faRedo
);

const props = defineProps<{
  editor: any;
}>();

const { editor } = props;
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
  </div>
</template>
