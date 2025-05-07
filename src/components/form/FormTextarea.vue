<script setup lang="ts">
import { onMounted, ref } from 'vue';

const props = defineProps<{
  name: string;
  value: string;
  placeholder: string;
  errorMsg: string;
  disabled: boolean;
}>();

const emit = defineEmits<{
  (e: 'setValue', value: string): void;
  (e: 'setErrorMsg', errorMsg: string): void;
}>();

const setValue = (value: string) => {
  emit('setValue', value);
};

const setErrorMsg = (errorMsg: string) => {
  emit('setErrorMsg', errorMsg);
};

const { name, value, placeholder, errorMsg, disabled } = props;
const showErrorTip = ref(false);

function onBlur(e: any) {
  setErrorMsg('');
  showErrorTip.value = false;
  if (e.target.value.length > 200) {
    setErrorMsg('自我介紹最多200字');
    showErrorTip.value = true;
  }
}

function onFocus() {
  showErrorTip.value = false;
}

onMounted(() => {
  if (errorMsg) showErrorTip.value = true;
});

</script>

<template>
  <div class="relative">
    <textarea
      :name="name"
      v-model="value"
      :placeholder="placeholder"
      class="rounded-md resize-none focus:border-2"
      rows={3}
      @blur="onBlur"
      @focus="onFocus"
      @change="(e) => {
        const target = e.target as HTMLInputElement;
        if (target.value.length < 200) setValue(target.value);
      }"
      :disabled="disabled"
    />
    <p v-if="showErrorTip" class="text-red-500 text-sm mt-[-6px]">{{ errorMsg }}</p>
  </div>
</template>
