<script setup lang="ts">
import { reactive, ref } from 'vue';
import { get, isEmpty } from 'lodash';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import BasicErrorPanel from '@/components/tips/BasicErrorPanel.vue';
import Spinner from '@/components/tips/Spinner.vue';
import FormInput from '@/components/form/FormInput.vue';
import { getCookies, scrollToTop } from '@/utils/common';
import { getOwnProfile, updateProfile } from '@/api/user';
import Avatar from '@/components/user/Avatar.vue';
import { FORM_CONTROL } from '@/constants/LayoutConstants';
import { useRouter } from 'vue-router';
import { errorAlert, handleStatus } from '@/utils/fetch';
import type { UserProfileType } from '@/types/userType';
import { useUserStore } from '@/store/user';

library.add(faInfoCircle);

const userId = getCookies('uid');
const authToken = getCookies('authToken');
const isLoading = ref(false);
const avatar = ref();
const avatarFile = ref<File | null>(null);
const removeAvatar = ref(false);
const formState = reactive({
  email: '',
  account: '',
  name: '',
  bio: '',
  avatarId: '',
  bgColor: '',
  language: '',
  emailPrompt: false,
  mobilePrompt: false
});
const errorState = reactive({
  emailError: '',
  accountError: '',
  nameError: '',
  bioError: ''
});
const isVisitor = formState.email === process.env.VITE_CUST_EMAIL;
const router = useRouter();
const userStore = useUserStore();

/** 取得使用者資料 */
const getProflieData = async () => {
  const res = await getOwnProfile(userId!, authToken!);
  if (res.status === 200) {
    avatar.value = res.data.avatar;
    Object.assign(formState, {
      ...res.data,
      emailPrompt: res.data.emailPrompt === true,
      mobilePrompt: res.data.mobilePrompt === true
    });
  }
};

/** 設定圖片檔 */
const handleFileChange = (event: Event) => {
  const fileList = (event.target as HTMLInputElement).files; // 獲取選擇的檔案列表
  if (!isEmpty(fileList) && fileList?.length) {
    const file = fileList[0];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']; // 可上傳的圖片格式
    if (allowedTypes.includes(file.type)) {
      avatar.value = URL.createObjectURL(file);
      avatarFile.value = file;
      removeAvatar.value = false;
    } else {
      errorAlert('請選擇 jpeg、jpg、png 或 gif 格式的圖片');
    }
  }
};

/** 送出編輯資料 */
const submitEditProfile = async () => {
  isLoading.value = true;
  const { email, account, name, bio, language, emailPrompt, mobilePrompt } = formState;

  // 資料驗證
  if (isEmpty(formState.email)) {
    errorState.emailError = 'Email欄位必填';
    isLoading.value = false;
    return;
  }
  if (isEmpty(account)) {
    errorState.accountError = '帳號欄位必填';
    isLoading.value = false;
    return;
  }
  if (isEmpty(formState.name)) {
    errorState.nameError = '名稱欄位必填';
    isLoading.value = false;
    return;
  }
  if (formState.bio.length > 200) {
    errorState.bioError = '自我介紹最多200字';
    isLoading.value = false;
    return;
  }

  const { emailError, accountError, nameError, bioError } = errorState;

  if (isEmpty(emailError) && isEmpty(accountError) && isEmpty(nameError) && isEmpty(bioError)) {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('name', name);
    formData.append('account', account);
    formData.append('bio', bio);
    formData.append('language', language);
    formData.append('emailPrompt', emailPrompt.toString());
    formData.append('mobilePrompt', mobilePrompt.toString());
    formData.append('removeAvatar', removeAvatar.toString());
    formData.append('avatar', avatar.value);
    formData.append('avatarId', formState.avatarId);
    if (avatarFile.value) formData.set('imageFile', avatarFile.value);

    try {
      const result = await updateProfile(formData, userId!, authToken!);
      if (handleStatus(get(result, 'status', 0)) === 2) {
        Swal.fire({
          title: '修改成功',
          icon: 'success',
          confirmButtonText: '確認'
        }).then(() => {
          router.push(`/user/profile/${userId}`);
          userStore.setUserData(result.data as UserProfileType);
          scrollToTop();
        });
      } else {
        errorAlert(get(result, 'data.message', ''));
      }
    } catch (error) {
      errorAlert();
    }
  }
  isLoading.value = false;
};
</script>

<template>
  <template v-if="isLoading">
    <Spinner />
  </template>
  <template v-else>
    <template v-if="!isEmpty(formState)">
      <div class="w-full sm:max-w-[600px] p-5">
        <form>
          <!-- avatar -->
          <div
            class="flex flex-col items-center w-full mb-5 pb-5 border-b-[1px] dark:border-gray-700"
          >
            <Avatar
              :name="formState.name"
              :avatarUrl="avatar"
              :size="'w-[90px] h-[90px]'"
              :textSize="'text-4xl'"
              :bgColor="formState.bgColor"
            />
            <div v-if="isVisitor" class="flex flex-col items-center">
              <p>
                <i class="text-red-500">您的身份為訪客，因此無法修改個人資料！</i>
              </p>
              <p>
                <i class="text-blue-500">您可以測試發佈文章、貼文等操作功能！</i>
              </p>
            </div>
            <div v-else class="flex gap-2">
              <label
                htmlFor="avatar"
                class="mt-3 bg-gray-300 dark:bg-gray-700 rounded-md text-sm px-2 py-1 cursor-pointer"
              >
                更新頭貼
              </label>
              <input
                name="imageFile"
                id="avatar"
                type="file"
                class="hidden"
                @change="(e) => handleFileChange(e)"
                :disabled="isVisitor"
              />
              <button
                v-if="!isEmpty(avatar)"
                type="button"
                class="mt-3 bg-red-300 dark:bg-red-700 rounded-md text-sm px-2 py-1 cursor-pointer"
                @click="
                  () => {
                    avatar = '';
                    avatarFile = null;
                    removeAvatar = true;
                  }
                "
              >
                移除頭貼
              </button>
            </div>
          </div>

          <!-- user info -->
          <div class="w-full pb-5 border-b-[1px] dark:border-gray-700">
            <div class="mt-10">
              <div class="flex items-center">
                <label htmlFor="email" class="font-bold">
                  <span class="text-red-500">*</span>
                  電子郵件
                </label>
                <p class="text-xs ml-1 text-orange-500 dark:text-orange-400">
                  <font-awesome-icon :icon="['fas', 'faInfoCircle']" />
                  修改後即更換登入系統及電子報接收之Email
                </p>
              </div>
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
                :disabled="isVisitor"
              />
            </div>

            <div class="mt-10">
              <label htmlFor="name" class="font-bold">
                <span class="text-red-500">*</span>
                帳號
              </label>
              <FormInput
                type="text"
                name="account"
                :ispwd="false"
                placeholder="帳號"
                :value="formState.account"
                @set-value="
                  (val) => {
                    formState.account = val;
                  }
                "
                :errorMsg="errorState.accountError"
                @set-error-msg="
                  (val) => {
                    errorState.accountError = val;
                  }
                "
                @handle-enter="() => {}"
                :disabled="isVisitor"
              />
            </div>

            <div class="mt-10">
              <label htmlFor="name" class="font-bold">
                <span class="text-red-500">*</span>
                名稱
              </label>
              <FormInput
                type="text"
                name="name"
                :ispwd="false"
                placeholder="名稱"
                :value="formState.name"
                @set-value="
                  (val) => {
                    formState.name = val;
                  }
                "
                :errorMsg="errorState.nameError"
                @set-error-msg="
                  (val) => {
                    errorState.nameError = val;
                  }
                "
                @handle-enter="() => {}"
                :disabled="isVisitor"
              />
            </div>

            <div class="mt-10">
              <label htmlFor="bio" class="font-bold"> 自我介紹 </label>
              <FormTextArea
                name="{name}"
                placeholder="來說說你的故事吧！"
                value="{bio}"
                setValue="{setBio}"
                errorMsg="{bioError}"
                setErrorMsg="{setBioError}"
                disabled="{isVisitor}"
              />
            </div>
          </div>

          <!-- user setting -->
          <div>
            <div class="mt-10">
              <div class="flex items-center">
                <label htmlFor="language" class="min-w-20 font-bold mr-5"> 系統語言 </label>
                <select
                  name="language"
                  class="border-[1px] border-gray-400 dark:border-gray-700 dark:bg-gray-700 rounded-md focus:border-2"
                  :class="FORM_CONTROL"
                  v-model="formState.language"
                  :disabled="isVisitor"
                >
                  <option value="zh">中文</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
            <div class="mt-10">
              <div class="flex justify-start items-center">
                <label htmlFor="emailPrompt" class="font-bold mr-5"> 是否開啟Email通知推播 </label>
                <input
                  name="emailPrompt"
                  type="checkbox"
                  class="w-5 h-5"
                  :checked="formState.emailPrompt"
                  v-model="formState.emailPrompt"
                />
              </div>
            </div>
            <div class="my-10">
              <div class="flex justify-start items-center">
                <label htmlFor="mobilePrompt" class="font-bold mr-5"> 是否開啟手機通知推播 </label>
                <input
                  name="mobilePrompt"
                  type="checkbox"
                  class="w-5 h-5"
                  :checked="formState.mobilePrompt"
                  v-model="formState.mobilePrompt"
                />
              </div>
            </div>
          </div>

          <!-- button -->
          <div class="flex justify-end mt-16">
            <button
              type="button"
              class="w-40 m-2 px-4 py-2 text-lg text-white rounded-md bg-gray-600"
              @click="
                () => {
                  router.push(`/user/profile/${userId}`);
                  scrollToTop();
                }
              "
            >
              {{ isVisitor ? '返回' : '取消' }}
            </button>
            <button
              v-if="!isVisitor"
              type="button"
              class="w-40 m-2 px-4 py-2 text-lg text-white rounded-md bg-green-600"
              @click="submitEditProfile()"
            >
              <font-awesome-icon
                v-if="isLoading"
                :icon="['fas', 'spinner']"
                class="animate-spin h-5 w-5"
              />
              <p v-else>修改</p>
            </button>
          </div>
        </form>
      </div>
    </template>
    <template v-else>
      <BasicErrorPanel errorMsg="" />
    </template>
  </template>
</template>
