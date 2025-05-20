<script setup lang="ts">
import { ref } from 'vue';
import { get, isEmpty, isEqual } from 'lodash';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ResetPwd } from '@/api/auth';
import { handleStatus } from '@/utils/fetch';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import FormInput from '@/components/form/FormInput.vue';

library.add(faSpinner);

const token = useRoute().query.token as string;
const password = ref('');
const confirmPassword = ref('');
const passwordError = ref('');
const confirmPasswordError = ref('');
const errorMsg = ref('');
const isLoading = ref(false);
const router = useRouter();
const authStore = useAuthStore();

const handleReset = async () => {
  errorMsg.value = '';
  isLoading.value = true;
  if (isEmpty(password.value)) {
    passwordError.value = '密碼為必填欄位';
    isLoading.value = false;
    return;
  }
  if (isEmpty(confirmPassword.value)) {
    confirmPasswordError.value = '確認密碼為必填欄位';
    isLoading.value = false;
    return;
  }
  if (!isEqual(password.value, confirmPassword.value)) {
    confirmPasswordError.value = '確認密碼與密碼不相符';
    isLoading.value = false;
    return;
  }

  if (isEmpty(passwordError) && isEmpty(confirmPasswordError)) {
    try {
      const res = await ResetPwd(token!, password.value, confirmPassword.value);
      if (handleStatus(get(res, 'status', 0)) === 2) {
        // 提示訊息
        Swal
          .fire({
            title: '修改成功',
            icon: 'success',
            confirmButtonText: '確認',
          })
          .then(() => {
            router.push('/');
            authStore.setSignInPop(true);
          });
      } else {
        errorMsg.value = get(res, 'data.message', '');
      }
    } catch (error) {
      // console.log(error);
    }
  }
  isLoading.value = false;
};

</script>

<template>
  <div class="flex justify-center items-center">
    <div class="w-dvw p-8 sm:w-full sm:border sm:rounded-lg">
      <h2>重設密碼</h2>
      <form class="sm:min-w-[350px]">
        <div class="mb-6 w-full">
          <div class="my-3">
            <FormInput
              type="password"
              name="password"
              ispwd
              placeholder="新密碼"
              :value="password"
              @update:value="password = $event"
              :errorMsg="passwordError"
              @update:errorMsg="passwordError = $event"
              @handle-enter="() => {}"
            />
          </div>
          <div class="my-3">
            <FormInput
              type="password"
              name="confirmPassword"
              ispwd
              placeholder="確認密碼"
              :value="confirmPassword"
              @update:value="confirmPassword = $event"
              :errorMsg="confirmPasswordError"
              @update:errorMsg="confirmPasswordError = $event"
              @handle-enter="() => {}"
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
            @click="handleReset"
          >
            <p v-if="isLoading">
              <FontAwesomeIcon
                :icon="['fas', 'spinner']"
                class="animate-spin h-5 w-5"
              />
            </p>
            <p v-else>重設</p>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>