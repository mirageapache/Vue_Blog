import { isEmpty } from 'lodash';
import Swal from 'sweetalert2';

/** 錯誤提醒(一般型式) */
export const errorAlert = (errorMsg?: string) => {
  Swal.fire({
    title: !isEmpty(errorMsg) ? errorMsg : '發生一些錯誤，請稍候再試',
    icon: 'error',
    confirmButtonText: '確認',
  });
};

/** 處理API狀態碼 */
export const handleStatus = (apiStatus: number) => {
  return Math.floor(apiStatus / 100);
};
