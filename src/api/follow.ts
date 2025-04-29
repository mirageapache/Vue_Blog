import axios from 'axios';
import { API_URL } from './index';
import type { AxResponseType } from '../types/apiType';
import type { UserDataType } from '../types/userType';
import Cookies from 'js-cookie';

const limit = 20;
const authToken = Cookies.get('authToken');

interface getFollowListType extends AxResponseType {
  data: UserDataType;
}

/** 動態取得追蹤資料 型別 */
interface FollowPageListType extends AxResponseType {
  followList: any;
  nextPage: number;
  data: UserDataType[];
}

/** 取得追蹤資料 */
export async function getFollowingList(userId: string, page: number): Promise<FollowPageListType> {
  const result = await axios
    .post(`${API_URL}/follow/getfollowing`, { userId, page, limit })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

/** 取得粉絲資料 */
export async function getFollowerList(userId: string, page: number): Promise<FollowPageListType> {
  const result = await axios
    .post(`${API_URL}/follow/getfollower`, { userId, page, limit })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

/** 追蹤 */
export async function followUser(userId: string, targetId: string): Promise<getFollowListType> {
  const config = {
    headers: { Authorization: `Bearer ${authToken}` },
  };
  const result = await axios
    .post(`${API_URL}/follow/follow`, { userId, targetId }, config)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

/** 取消追蹤 */
export async function unfollowUser(userId: string, targetId: string): Promise<getFollowListType> {
  const config = {
    headers: { Authorization: `Bearer ${authToken}` },
  };
  const result = await axios
    .post(`${API_URL}/follow/unfollow`, { userId, targetId }, config)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}

/** 更改訂閱狀態 */
export async function changeFollowState(
  userId: string,
  targetId: string,
  state: number
): Promise<getFollowListType> {
  const config = {
    headers: { Authorization: `Bearer ${authToken}` },
  };
  const result = await axios
    .patch(`${API_URL}/follow/changeState`, { userId, targetId, state }, config)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error.response;
    });
  return result;
}
