import axios from 'axios';
import { API_URL, postLimit } from ".";

/** 動態取得文章列表 */
export const getPartialPosts = async (page: number) => {
  let result = null;
  if (page > 0) {
    result = await axios
      .post(`${API_URL}/post/partial`, { page, postLimit })
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        return error;
      });
  }
  return result;
}