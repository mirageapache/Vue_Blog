<script setup lang="ts">
import { ref, reactive } from 'vue';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { GRAY_BG_PANEL } from '@/constants/LayoutConstants';
import { useAuthStore } from '@/store/auth';
import FormInput from '../form/FormInput.vue';
import { get, isEmpty, isEqual } from 'lodash';
import { SignUp } from '@/api/auth.ts';
import { errorAlert, handleStatus } from '@/utils/fetch';

library.add(faXmark, faSpinner);
const authStore = useAuthStore();

const formState = reactive({
  email: '',
  password: '',
  confirmPassword: ''
});
const errorState = reactive({
  emailError: '',
  passwordError: '',
  confirmPasswordError: ''
});
const errorMsg = ref('');
const isLoading = ref(false);

/** 導頁至登入 */
const directSignUp = () => {
  authStore.setSignInPop(true);
  authStore.setSignUpPop(false);
};

/** 關閉註冊Popup */
const handleClose = () => {
  authStore.setSignUpPop(false);
};

/** 送出註冊資料 */
const submitSignUp = async () => {
  // 重置所有錯誤訊息
  errorState.emailError = '';
  errorState.passwordError = '';
  errorState.confirmPasswordError = '';
  errorMsg.value = '';
  isLoading.value = true;

  const { email, password, confirmPassword } = formState;

  // 檢查是否有欄位為空
  let hasError = false;

  if (isEmpty(email)) {
    errorState.emailError = 'Email為必填欄位';
    hasError = true;
  }

  if (isEmpty(password)) {
    errorState.passwordError = '密碼為必填欄位';
    hasError = true;
  }

  if (isEmpty(confirmPassword)) {
    errorState.confirmPasswordError = '確認密碼為必填欄位';
    hasError = true;
  }

  if (!isEqual(password, confirmPassword)) {
    errorState.confirmPasswordError = '確認密碼與密碼不相符';
    hasError = true;
  }

  // 如果有錯誤，停止提交
  if (hasError) {
    isLoading.value = false;
    return;
  }

  try {
    const variables = { email, password, confirmPassword };
    const res = await SignUp(variables);
    if (handleStatus(get(res, 'status', 0)) === 2) {
      Swal.fire({
        title: '註冊成功🎉',
        text: '歡迎加入VueBlog',
        icon: 'success',
        confirmButtonText: '確認'
      }).then(() => {
        handleClose();
      });
    } else if (handleStatus(get(res, 'status', 0)) === 4) {
      errorMsg.value = get(res, 'data.message', '');
    } else {
      errorAlert();
    }
  } finally {
    isLoading.value = false;
  }
};

/** handleEnter */
const handleEnter = (value: string) => {
  if (value === 'Enter') submitSignUp();
};
</script>

<template>
  <div class="fixed w-screen h-screen z-30 flex justify-center items-center">
    <div :class="GRAY_BG_PANEL" @click="handleClose()" />
    <div
      class="absolute z-10 w-full min-[320px]:w-11/12 max-w-[400px] border bg-white dark:bg-gray-950 dark:border-gray-700 opacity-100 rounded-md"
    >
      <!-- header -->
      <div class="flex justify-between border-b-[1px] dark:border-gray-700 p-4">
        <h2 class="text-2xl text-orange-500 font-semibold">歡迎加入</h2>
        <button
          aria-label="close"
          type="button"
          class="flex jsutify-center m-1"
          @click="handleClose()"
        >
          <font-awesome-icon
            :icon="['fas', 'xmark']"
            class="w-5 h-5 m-1 text-gray-900 dark:text-gray-100"
          />
        </button>
      </div>
      <!-- body -->
      <div class="pt-4 pb-8 px-6 flex justify-center items-center">
        <form class="w-full max-w-80">
          <div class="mb-6 w-full">
            <div class="my-3">
              <FormInput
                type="email"
                name="email"
                :ispwd="false"
                placeholder="E-mail"
                :value="formState.email"
                @set-value="
                  (val) => {
                    formState.email = val;
                  }
                "
                :errorMsg="errorState.emailError"
                @set-error-msg="
                  (val) => {
                    errorState.emailError = val;
                  }
                "
                @handle-enter="() => {}"
              />
            </div>
            <div class="my-3">
              <FormInput
                type="password"
                name="password"
                ispwd
                placeholder="密碼"
                :value="formState.password"
                @set-value="
                  (val) => {
                    formState.password = val;
                  }
                "
                :errorMsg="errorState.passwordError"
                @set-error-msg="
                  (val) => {
                    errorState.passwordError = val;
                  }
                "
                @handle-enter="() => {}"
              />
            </div>
            <div class="my-3">
              <FormInput
                type="password"
                name="confirmPassword"
                ispwd
                placeholder="確認密碼"
                :value="formState.confirmPassword"
                @set-value="
                  (val) => {
                    formState.confirmPassword = val;
                  }
                "
                :errorMsg="errorState.confirmPasswordError"
                @set-error-msg="
                  (val) => {
                    errorState.confirmPasswordError = val;
                  }
                "
                @handle-enter="(e) => handleEnter(e)"
              />
            </div>
          </div>
          <div v-if="errorMsg">
            <h5 class="text-red-500">{{ errorMsg }}</h5>
          </div>
          <div class="mt-4">
            <button
              type="button"
              class="flex justify-center items-center w-full h-10 px-4 py-2 text-lg text-white rounded-md bg-green-600"
              @click="submitSignUp()"
            >
              <font-awesome-icon
                v-if="isLoading"
                :icon="['fas', 'spinner']"
                class="animate-spin h-5 w-5"
              />
              <p v-else>註冊</p>
            </button>
          </div>
          <div class="grid grid-cols-2 gap-4 my-2">
            <span class="flex">
              已有帳戶？
              <button type="button" class="text-blue-600 cursor-pointer" @click="directSignUp()">
                前往登入
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
