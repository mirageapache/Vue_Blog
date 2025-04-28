import type { RqResponseType, errorMsgType } from './apiType';
import type{ UserInfoPanelType } from './userType';

/** post API接收資料型別 */
export interface PostDataType extends errorMsgType {
  _id: string;
  author: UserInfoPanelType; // userId
  content: string;
  image: string;
  imageId: string;
  status: number;
  subject: string;
  hashTags: string[];
  collectionCount: number;
  shareCount: number;
  likedByUsers: UserInfoPanelType[];
  comments: string[];
  createdAt: string;
  editedAt: string;
}

/** post API參數型別 */
export interface PostVariablesType {
  postId?: string;
  userId: string; // author
  content: string;
  image?: string;
  imageId: string;
  status: number;
  hashTags?: string[];
}

export interface PostResultType extends RqResponseType {
  data: PostDataType | null;
}
