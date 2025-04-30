import type { UserDataType } from '@/types/userType';
import { defineStore } from 'pinia';

const initUserData = {
  _id: '',
  account: '',
  name: '',
  avatar: '',
  bgColor: '',
} as UserDataType

export const useUserStore = defineStore('user', {
  state: () => ({
    userData: initUserData,
    isLoggedIn: false
  }),
  actions: {
    setUserData(data: UserDataType) {
      this.userData = data;
    },
    setIsLoggedIn(value: boolean) {
      this.isLoggedIn = value;
    }
  }
});

