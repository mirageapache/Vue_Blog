import axios from 'axios';
import { API_URL, postLimit } from './index';
import type { ArticleDataType } from '../types/articleType';
import type { AxResponseType } from '../types/apiType';
import Cookies from 'js-cookie';

const authToken = Cookies.get('authToken');

/** AritlceApi 型別 */
interface ArticleApiType extends AxResponseType {
  data: ArticleDataType;
}

/** 動態取得文章資料 型別 */
interface ArticlePageListType extends AxResponseType {
  articles: any;
  nextPage: number;
  data: ArticleDataType[];
}

/** 取得所有文章 */
export async function getArticles(): Promise<ArticleApiType> {
  const result = await axios
    .get(`${API_URL}/article`)
    .then((res) => {
      const articleData = res.data;
      return articleData;
    })
    .catch((error) => {
      return error;
    });
  return result;
}

/** (動態)取得文章資料
 * @param page 要取得的資料頁碼
 */
export async function getPartialArticles(page: number): Promise<ArticlePageListType> {
  let result = null;
  if (page > 0) {
    result = await axios
      .post(`${API_URL}/article/partial`, { page, postLimit })
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        return error;
      });
  }
  return result;
}

/** 取得特定文章內容 */
export async function getArticleDetail(articleId: string): Promise<ArticleApiType> {
  const result = await axios
    .post(`${API_URL}/article/detail`, { articleId, clientType: '' })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
  return result;
}

/** 取得搜尋文章 or 特定使用者的文章 */
export async function getSearchArticle(
  searchString?: string,
  authorId?: string,
  page?: number
): Promise<ArticlePageListType> {
  let result = null;
  if (page && page > 0) {
    result = await axios
      .post(`${API_URL}/article/search`, { searchString, authorId, page, postLimit })
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        return error.response;
      });
  }
  return result;
}

/** 新增文章 */
export async function createArticle(
  userId: string,
  title: string,
  content: string
): Promise<ArticleApiType> {
  const config = {
    headers: { Authorization: `Bearer ${authToken}` },
  };
  const variables = { userId, title, content, clientType: '' };
  const result = await axios
    .post(`${API_URL}/article/create/${userId}`, variables, config)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      if (error.code === 'ERR_NETWORK') return { code: 'ERR_NETWORK' };
      return error.response;
    });
  return result;
}

/** 編輯文章 */
export async function updateArticle(
  articleId: string,
  userId: string,
  title: string,
  content: string
): Promise<ArticleApiType> {
  const config = {
    headers: { Authorization: `Bearer ${authToken}` },
  };
  const variables = { articleId, userId, title, content, clientType: '' };
  const result = await axios
    .patch(`${API_URL}/article/update/${userId}`, variables, config)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      if (error.code === 'ERR_NETWORK') return { code: 'ERR_NETWORK' };
      return error.response;
    });
  return result;
}

/** 刪除文章 */
export async function deleteArticle(articleId: string, userId: string) {
  const config = {
    headers: { Authorization: `Bearer ${authToken}` },
    data: { articleId }, // 在 delete 請求中，必須在 config 裡加上 data
  };
  const result = await axios
    .delete(`${API_URL}/article/delete/${userId}`, config)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      if (error.code === 'ERR_NETWORK') return { code: 'ERR_NETWORK' };
      return error.response;
    });
  return result;
}

/** 喜歡/取消喜歡文章 */
export async function toggleLikeArticle(articleId: string, userId: string, action: boolean) {
  const config = {
    headers: { Authorization: `Bearer ${authToken}` },
  };
  const result = await axios
    .patch(`${API_URL}/article/toggleLikeAction/${userId}`, { articleId, userId, action }, config)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error;
    });
  return result;
}
