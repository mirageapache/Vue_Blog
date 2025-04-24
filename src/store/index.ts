import { defineStore } from 'pinia';

const path = window.location.pathname.split('/')[1];
export const useMainStore = defineStore('main', {
  state: () => ({
    darkMode: localStorage.getItem('darkMode') || '', // 深色模式
    editMode: false, // 文章或貼文的編輯狀態
    activePage: path, // 當前頁面路徑，用來判斷作用中的頁籤
    exploreTag: 'article', // 紀錄"探索頁"使用中的tag頁籤
  }),
  actions: {
    setActivePage(page: string) {
      /** 設定SideBar、MainMenu、ButtonMenu選單作用中頁籤 */
      this.activePage = page;
    },
    setExploreTag(tag: string) {
      /** 設定探索頁作用中頁籤 */
      this.exploreTag = tag;
    },
    setDarkMode() {
      /** 設定深色模式 */
      let newState = '';
      if (this.darkMode === '') {
        newState = 'dark';
      }
      localStorage.setItem('darkMode', newState);
      this.darkMode = newState;
    },
    setEditMode(mode: boolean) {
      /** 編輯模式切換 */
      this.editMode = mode;
    }
  }
});
