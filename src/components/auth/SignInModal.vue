<script setup lang="ts">
import { reactive, ref } from 'vue';
import { get, isEmpty } from 'lodash';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { GRAY_BG_PANEL } from '@/constants/LayoutConstants';
import { useUserStore } from '@/store/user';
import { useAuthStore } from '@/store/auth';
import { handleStatus } from '@/utils/fetch';
import { SignIn } from '@/api/auth.ts';
import FormInput from '../form/FormInput.vue';
import { ERR_NETWORK_MSG } from '@/constants/StringConstants';

library.add(faXmark, faSpinner);

const authStore = useAuthStore();
const userStore = useUserStore();
const formState = reactive({
  email: '',
  password: '',
});
const errorState = reactive({
  emailError: '',
  passwordError: '',
});

const isLoading = ref(false);
const errorMsg = ref('');

/** 導頁至註冊 */
const directSignUp = () => {
  authStore.setSignInPop(false);
  authStore.setSignUpPop(true);
};

/** 關閉登入Popup */
const handleClose = () => {
  authStore.setSignInPop(false);
};

/** 忘記密碼 */
const findPassword = () => {
  authStore.setSignInPop(false);
  authStore.setForgetPwd(true);
};

/** 送出登入資料 */
const submitSignIn = async (role?: string) => {
  const { email, password } = formState;
  if (role !== 'visitor') {
    errorMsg.value = '';
    isLoading.value = true;
    if (isEmpty(email)) {
      errorState.emailError = 'Email為必填欄位';
      isLoading.value = false;
      return;
    }
    if (isEmpty(password)) {
      errorState.passwordError = '密碼為必填欄位';
      isLoading.value = false;
      return;
    }
  }

  if (isEmpty(errorState.emailError) && isEmpty(errorState.passwordError)) {
    let variables = { email, password };
    if (role === 'visitor')
      // 限訪客身份使用
      variables = {
        email: process.env.REACT_APP_CUST_EMAIL!,
        password: process.env.REACT_APP_CUST_PWD!,
      };

    try {
      const res = await SignIn(variables);

      if (handleStatus(get(res, 'status', 0)) === 2) {
        const authToken = get(res, 'data.authToken');
        Cookies.set('authToken', authToken, { path: '/' });
        Cookies.set('uid', res.data.userData.userId, { path: '/' });
        userStore.setUserData(res.data.userData);
        Swal
          .fire({
            title: '登入成功',
            icon: 'success',
            confirmButtonText: '確認',
          })
          .then(() => {
            const { location } = window;
            const pathname = get(location, 'pathname', '');
            if (pathname === '/user/editProfile') {
              location.href = `${location.host}/user/profile/${res.data.userData.userId}`; // 導到userProfilePage
            }
            window.location.reload();
          });
      } else if (handleStatus(get(res, 'status', 0)) === 4) {
        errorMsg.value = get(res, 'data.message');
      } else if (get(res, 'code') === 'ERR_NETWORK') {
        errorMsg.value = ERR_NETWORK_MSG;
      }
    } finally {
      isLoading.value = false;
    }
  }
};

/** handleEnter */
const handleEnter = (value: string) => {
  if (value === 'Enter') submitSignIn();
};

</script>

<template>
  <div class="fixed w-full h-full z-30 flex justify-center items-center select-none">
    <div :class="GRAY_BG_PANEL" @click="handleClose()" />
    <div class="absolute z-10 w-full min-[320px]:w-11/12 max-w-[400px] border bg-white dark:bg-gray-950 dark:border-gray-700 opacity-100 rounded-md">
      <!-- header -->
      <div class="flex justify-between border-b-[1px] dark:border-gray-700 p-4">
        <h2 class="text-2xl text-orange-500 font-semibold">歡迎回來</h2>
        <button
          aria-label="close"
          type="button"
          class="flex jsutify-center m-1"
          @click="handleClose()"
        >
          <font-awesome-icon
            :icon="['fas', 'xmark']"
            class="w-5 h-5 m-1 text-gray-700 dark:text-gray-400"
          />
        </button>
      </div>
      <!-- body -->
      <div class="pt-4 pb-8 px-6 flex justify-center items-center">
        <form class="w-full max-w-80">
          <div class="mb-6 w-full">
            <div>
              <FormInput
                type="email"
                name="email"
                :ispwd="false"
                placeholder="E-mail"
                :value="formState.email"
                @set-value="(val) => { formState.email = val }"
                :errorMsg="errorState.emailError"
                @set-error-msg="(val) => { errorState.emailError = val }"
                @handle-enter="() => {}"
              />
            </div>
            <div class="my-3">
              <FormInput
                type="password"
                name="password"
                ispwd
                placeholder="password"
                :value="formState.password"
                @set-value="(val) => { formState.password = val }"
                :errorMsg="errorState.passwordError"
                @set-error-msg="(val) => { errorState.passwordError = val }"
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
              @click="() => submitSignIn()"
            >
              <font-awesome-icon
                v-if="isLoading"
                :icon="['fas', 'spinner']"
                class="animate-spin h-5 w-5 "
              />
              <p v-else>登入</p>
            </button>
            <button
              type="button"
              class="flex justify-center items-center w-full h-10 my-4 px-4 py-2 text-lg rounded-md bg-transparent border border-gray-500"
              @click="submitSignIn('visitor')"
            >
              以訪客身份登入
            </button>
          </div>
          <div class="flex max-[420px]:flex-col justify-center mt-4">
            <span class="flex">
              沒有帳戶？
              <button
                type="button"
                class="text-blue-600 cursor-pointer"
                @click="directSignUp()"
              >
                前往註冊
              </button>
            </span>
            <span class="mx-2 hidden min-[421px]:block">|</span>
            <span>
              忘記密碼？
              <button
                type="button"
                class="text-blue-600 cursor-pointer"
                @click="findPassword"
              >
                找回密碼
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
