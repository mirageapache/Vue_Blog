<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Cookies from 'js-cookie';
import { isEmpty } from 'lodash';
import { useUserStore } from '@/store/user';
import { checkLogin, getCookies } from '@/utils/common';
import Avatar from '@/components/user/Avatar.vue';
import type { UserDataType } from '@/types/userType';
import { getOwnProfile } from '@/api/user';
import FollowBtn from '@/components/user/FollowBtn.vue';
import { useAuthStore } from '@/store/auth';
import NoSearchResult from '@/components/tips/NoSearchResult.vue';

const userStore = useUserStore();
const authStore = useAuthStore();
const router = useRouter();
const userStateData = userStore.userData as UserDataType;

const state = reactive({ userData: userStateData })
const { userData } = state;
const activeTab = ref('article');
const activeStyle = ref('translate-x-0');
const authToken = Cookies.get('authToken');
const { userId } = useRoute().params;
if (isEmpty(userId) || userId.length === 0) router.push('/notFound');
const currentUserId = getCookies('uid');
let identify = currentUserId === userId && !isEmpty(authToken); // 驗證身分使當前使用者

/** 取得使用者資料 */
const getUserProfile = async () => {
  const res = await getOwnProfile(userId! as string, authToken!);
  if (res.status === 200) {
    Object.assign(userData, res.data);
  } else if (res.status === 401) {
    authStore.setSignInPop(true);
  } else {
    Object.assign(userData, {_id: ''});
  }
}

onMounted(() => {
  //** 取得使用者資料 */
  getUserProfile();
});

/** 頁籤切換 */
const handleTabActive = (tabValue: string) => {
  activeTab.value = tabValue;
  switch (tabValue) {
    case 'article':
      activeStyle.value = 'translate-x-0';
      break;
    case 'post':
      activeStyle.value = 'translate-x-full';
      break;
    case 'follow':
      activeStyle.value = 'translate-x-[200%]';
      break;
    case 'follower':
      activeStyle.value = 'translate-x-[300%]';
      break;
    default:
      activeStyle.value = 'translate-x-0';
  }
};

</script>

<template>
  <template v-if="!isEmpty(userData._id)">
    <NoSearchResult msgOne="使用者不存在" msgTwo="" type="user" />
  </template>
  <template v-else>
    <div class="w-full sm:max-w-[600px] p-5">
      <div class="flex justify-between mb-3">
        <div class="flex gap-4">
          <div>
            <Avatar
              :name="userData.name"
              :avatarUrl="userData.avatar"
              :size="'w-[72px] h-[72px]'"
              :textSize="'text-4xl'"
              :bgColor="userData.bgColor"
            />
          </div>
          <div class="flex flex-col justify-center">
            <p class="text-3xl font-semibold">{{ userData.name }}</p>
            <p class="text-gray-500">@{{ userData.account }}</p>
          </div>
        </div>
        <!-- 追蹤狀態 -->
        <FollowBtn
          v-if="!identify && checkLogin()"
          :user="userData"
          :currentUser="currentUserId!"
          :refetch="getUserProfile"
        />
        <!-- 編輯功能 -->
        <div v-if="identify" class="flex justify-center items-center">
          <Link
            to="/user/editProfile"
            type="button"
            class="flex items-center rounded-lg text-white bg-sky-500 hover:bg-sky-700 p-2 md:px-4 md:py-1 dark:bg-sky-800"
          >
            <p>編輯</p>
          </Link>
        </div>
      </div>
      <div v-if="!isEmpty(userData.bio)" class="bg-gray-100 dark:bg-gray-700 rounded-md p-2">
        <p>{{ userData.bio }}</p>
      </div>
      <div>
        <!-- 頁籤 -->
        <div>
          <div class="mt-4 text-lg flex border-b-[1px] border-gray-400 dark:text-gray-400">
            <button
              type="button"
              class="flex w-1/4 justify-center py-1.5 hover:cursor-pointer outline-none"
              @click="handleTabActive('article')"
            >
              文章
            </button>
            <button
              type="button"
              class="flex w-1/4 justify-center py-1.5 hover:cursor-pointer outline-none"
              @click="handleTabActive('post')"
            >
              貼文
            </button>
            <button
              type="button"
              class="flex w-1/4 justify-center py-1.5 hover:cursor-pointer outline-none"
              @click="handleTabActive('follow')"
            >
              追蹤
            </button>
            <button
              type="button"
              class="flex w-1/4 justify-center py-1.5 hover:cursor-pointer outline-none"
              @click="handleTabActive('follower')"
            >
              粉絲
            </button>
          </div>
          <div class="flex justify-start -translate-y-0.5">
            <div
              class="border-b-[3px] border-orange-500 w-1/4 text-transparent transform duration-300 ease-in-out"
              :class="activeStyle"
            />
          </div>
        </div>
  
        <!--  文章 Article -->
        <div v-if="activeTab === 'article'">
          <ProfileArticle :userId="userId!" :identify="identify" />
        </div>
        
  
        <!-- 貼文 Post -->
        <div v-if="activeTab === 'post'">
          <ProfilePost :userId="userId!" :identify="identify" />
        </div>
  
        <!-- 追蹤 follow -->
        <div v-if="activeTab === 'follow'">
          <ProfileFollowing :userId="userId!" :identify="identify" />
        </div>
  
        <!-- 粉絲 follower -->
        <div v-if="activeTab === 'follower'">
          <ProfileFollowed :userId="userId!" :identify="identify" />
        </div>
      </div>
    </div>
  </template>
</template>
