<script setup lang="ts">
import { ref } from 'vue';
import Swal from 'sweetalert2';
import { get, isEmpty } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useAuthStore } from '@/store/auth';
import { GRAY_BG_PANEL } from '@/constants/LayoutConstants';
import { handleStatus } from '@/utils/fetch';
import { FindPwd } from '@/api/auth.ts';
import FormInput from '../form/FormInput.vue';

library.add(faXmark, faSpinner);

const email = ref('');
const emailError = ref('');
const errorMsg = ref('');
const isLoading = ref(false);
const authStore = useAuthStore();

/** 關閉 Popup */
const handleClose = () => {
  authStore.setForgetPwd(false);
};

/** 返回登入Popup */
const BackToLogin = () => {
  authStore.setForgetPwd(false);
  authStore.setSignInPop(true);
};

/** 送出資料 */
const handleSubmit = async () => {
  errorMsg.value = '';
  isLoading.value = true;
  if (isEmpty(email.value)) {
    emailError.value = 'Email為必填欄位';
    isLoading.value = false;
    return;
  }

  if (isEmpty(emailError.value)) {
    try {
      const res = await FindPwd(email.value);
      if (handleStatus(get(res, 'status', 0)) === 2) {
        Swal
          .fire({
            title: '已寄送重置密碼連結至信箱',
            icon: 'info',
            confirmButtonText: '確認',
          })
          .then(() => {
            BackToLogin();
          });
      } else if (handleStatus(get(res, 'status', 0)) === 4) {
        errorMsg.value = get(res, 'data.message', '');
      }
    } finally {
      isLoading.value = false;
    }
  }
};

/** handleEnter */
const handleEnter = (value: string) => {
  if (value === 'Enter') handleSubmit();
};

</script>

<template>
  <div class="fixed w-full h-full z-30 flex justify-center items-center select-none">
    <div :class="GRAY_BG_PANEL" @click="handleClose()" />
    <div class="absolute z-10 w-full min-[320px]:w-11/12 max-w-[400px] border bg-white dark:bg-gray-950 dark:border-gray-700 opacity-100 rounded-md">
      <!-- header -->
      <div class="flex justify-between border-b-[1px] dark:border-gray-700 p-4">
        <h2 class="text-2xl text-orange-500 font-semibold">找回密碼</h2>
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
      <div class="pt-4 pb-8 px-6 flex flex-col justify-center items-center">
        <div class="flex gap-1 mb-4 text-gray-500">
          <font-awesome-icon
            :icon="['fas', 'info-circle']"
            class="mt-1 text-orange-500"
          />
          <p>
            請輸入你註冊時的E-mail，系統將寄送「重設密碼」的連結至你的信箱，重設後即可使用新密碼進行登入
          </p>
        </div>
        <form class="w-full max-w-80">
          <div class="mb-6 w-full">
            <div>
              <FormInput
                type="email"
                name="email"
                :ispwd="false"
                placeholder="E-mail"
                :value="email"
                @set-value="(val) => { email = val }"
                :errorMsg="emailError"
                @set-error-msg="(val) => { emailError = val }"
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
              @click="handleSubmit"
            >
            <font-awesome-icon
              v-if="isLoading"
              :icon="['fas', 'spinner']"
              class="animate-spin h-5 w-5 "
            />
            <p v-else>重置密碼</p>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
