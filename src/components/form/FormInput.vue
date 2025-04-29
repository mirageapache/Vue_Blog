<script setup lang="ts">
import { ref, computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { isEmpty } from 'lodash';
import { z } from 'zod';
import { validationSchema } from '@/utils/formValidates';
import type { ValidationSchemaKeys } from '@/utils/formValidates';
import { FORM_CONTROL } from '@/constants/LayoutConstants';

library.add(faEye, faEyeSlash);

const props = defineProps<{
  name: string;
  type: string;
  ispwd: boolean;
  placeholder: string;
  classname?: string;
  value: string;
  errorMsg: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'setValue', value: string): void;
  (e: 'setErrorMsg', errorMsg: string): void;
  (e: 'handleEnter', value: string): void;
}>();

const { name, type, ispwd, placeholder, classname, value, disabled } = props;

// 使用計算屬性監聽props中的errorMsg
const showErrorTip = computed(() => !!props.errorMsg);
const hidePassword = ref(ispwd);
const errorTipStyle = 'border-b-2 border-red-500 bg-yellow-100 dark:bg-gray-950 focus:border-b-2';
const normalTipStyle =
  'border-b-[1px] border-gray-400 dark:border-gray-700 dark:bg-gray-950 focus:border-b-2';

const setValue = (value: string) => {
  emit('setValue', value);
};

const setErrorMsg = (errorMsg: string) => {
  emit('setErrorMsg', errorMsg);
};

const handleEnter = (value: string) => {
  emit('handleEnter', value);
};

/** input on blur */
function onBlur(e: Event) {
  const target = e.target as HTMLInputElement;
  const formValue = target.value;

  try {
    if (validationSchema[name as ValidationSchemaKeys]) {
      validationSchema[name as ValidationSchemaKeys].parse(formValue);
      setErrorMsg('');
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      setErrorMsg(error.errors[0].message);
    }
  }
}

/** input on focus */
function onFocus() {
  setErrorMsg('');
}

const inputType = computed(() => {
  if (ispwd) {
    return hidePassword.value ? 'password' : 'text';
  }
  return type;
});
</script>

<template>
  <div class="relative">
    <span class="relative">
      <input
        :name="name"
        :type="inputType"
        :placeholder="placeholder"
        :class="[FORM_CONTROL, classname, showErrorTip ? errorTipStyle : normalTipStyle]"
        @blur="onBlur"
        @focus="onFocus"
        @change="
          (e) => {
            const target = e.target as HTMLInputElement;
            setValue(target.value);
            setErrorMsg('');
            if (isEmpty(target.value)) setErrorMsg(`${name}欄位必填`);
          }
        "
        @keyup="
          (e) => {
            handleEnter(e.key);
          }
        "
        v-model="value"
        :disabled="disabled"
      />
      <span v-if="ispwd">
        <font-awesome-icon
          :icon="['fas', hidePassword ? 'eye-slash' : 'eye']"
          class="absolute mt-3.5 right-0 h-6 w-6 text-gray-700 cursor-pointer"
          @click="hidePassword = !hidePassword"
        />
      </span>
    </span>
    <p v-if="showErrorTip" class="text-red-500 text-sm">{{ errorMsg }}</p>
  </div>
</template>
