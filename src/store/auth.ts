import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    showSignInPop: false, // 顯示登入 Popup
    showSignUpPop: false, // 顯示註冊 Popup
    showForgetPwd: false, // 顯示忘記密碼 Popup
  }),
  actions: {
    setSignInPop(value: boolean) {
      this.showSignInPop = value;
    },
    setSignUpPop(value: boolean) {
      this.showSignUpPop = value;
    },
    setForgetPwd(value: boolean) {
      this.showForgetPwd = value;
    }
  }
});
