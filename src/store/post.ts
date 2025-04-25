import { defineStore } from 'pinia';

/** UserInfo 預設值 */
const initAuthor = {
  _id: '',
  account: '',
  name: '',
  avatar: '',
  bgColor: '',
};

/** PostData 預設值 */
const initPostData = {
  _id: '',
  author: initAuthor,
  content: '',
  image: '',
  imageId: '',
  status: 0,
  subject: '',
  hashTags: [],
  collectionCount: 0,
  shareCount: 0,
  likedByUsers: [],
  comments: [],
  createdAt: '',
  editedAt: '',
  code: '',
  message: '',
};

export const usePostStore = defineStore('post', {
  state: () => ({
    postId: '', // 貼文Id，操作貼文功能時使用
    postData: initPostData, // 暫存選定的貼文資料
    showCreateModal: false, // 是否顯示CreateModal
    showEditModal: false, // 是否顯示EditModal
  }),
  actions: {
    setPostId(id: string) {
      this.postId = id;
    },
    setPostData(data: any) {
      this.postData = data;
    },
    setShowCreateModal(show: boolean) {
      this.showCreateModal = show;
    },
    setShowEditModal(show: boolean) {
      this.showEditModal = show;
    },
  },
});
