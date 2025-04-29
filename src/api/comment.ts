import axios from 'axios';
import { API_URL } from './index';
import type { CommentDataType } from '../types/commentType';
import type { AxResponseType } from '../types/apiType';
import Cookies from 'js-cookie';

const authToken = Cookies.get('authToken');

/** commentApi 型別 */
interface CommentApiType extends AxResponseType {
  data: CommentDataType;
}

/** 取得貼文留言 */
export async function getComment(): Promise<CommentApiType> {
  const result = await axios
    .get(`${API_URL}/comment/`)
    .then((res) => {
      const { data } = res.data;
      return data;
    })
    .catch((error) => {
      return error;
    });
  return result;
}

/** 新增留言
 * @id 貼文或文章 id
 * @userId 使用者 id
 * @content 留言內容
 * @route 判斷post/article
 */
export async function createComment(
  id: string,
  userId: string,
  content: string,
  route: string
): Promise<CommentApiType> {
  const config = {
    headers: { Authorization: `Bearer ${authToken}` },
  };
  const result = await axios
    .post(`${API_URL}/comment/create/${userId}`, { id, userId, content, route }, config)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
  return result;
}

/** 編輯留言 */
export async function updateComment(userId: string, formData: FormData): Promise<CommentApiType> {
  const config = {
    headers: { Authorization: `Bearer ${authToken}` },
  };
  const result = await axios
    .patch(`${API_URL}/comment/update/${userId}`, formData, config)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
  return result;
}
