import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    userData: null,
    isLoggedIn: false
  }),
  actions: {
    setUserData(data: any) {
      this.userData = data;
    },
    setIsLoggedIn(value: boolean) {
      this.isLoggedIn = value;
    }
  }
});

