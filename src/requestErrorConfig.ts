import type { RequestConfig } from '@umijs/max';
import { request } from '@umijs/max';
import { message } from 'antd';
import Cookies from 'js-cookie';
import _ from 'lodash';
import api from './services/api';
import { headerRequestDpw, logout, transformReqByCommand } from './utils';
// import { logout, transformReqByCommand } from '';

enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}

interface ResponseStructure {
  success: boolean;
  data: any;
  config: any;
  errorCode?: number;
  errorMessage?: string;
  showType?: ErrorShowType;
  status: any;
  headers: any;
  statusText: any;
}

/**
 * @doc https://umijs.org/docs/max/request
 */

let retryAccessToken = 0;

export const errorConfig: RequestConfig = {
  errorConfig: {
    errorThrower: (res) => {
      const { success, data, errorCode, errorMessage, showType } =
        res as unknown as ResponseStructure;
      if (!success) {
        const error: any = new Error(errorMessage);
        error.name = 'BizError';
        error.info = { errorCode, errorMessage, showType, data };
        throw error;
      }
    },

    errorHandler: (error: any, opts: any) => {
      console.log('error', error);
      console.log('opts', opts);
      if (opts?.skipErrorHandler) throw error;
      if (error.response) {
        message.error(`Có lỗi: ${error.response?.data?.error || error.response.statusText}`);
      } else if (error.request) {
        message.error('Không có phản hồi, vui lòng thử lại.');
      } else {
        message.error('Lỗi không xác định: ' + error);
      }
    },
  },

  requestInterceptors: [
    (config: any) => {
      const url = config.url;
      if (
        _.includes(
          [TICKETING_BASE_URL, TICKETING_CORE_URL, TICKETING_FILE_STORE, TICKETING_GRAPHQL],
          url,
        )
      ) {
        const access_token = Cookies.get('access_token');
        _.set(
          config.data,
          `body.${transformReqByCommand(config.data?.body?.command)}.accessToken`,
          access_token,
        );
        _.set(
          config.data,
          `body.${transformReqByCommand(config.data?.body?.command)}.access_token`,
          access_token,
        );
        _.set(config.data, 'header', headerRequestDpw(url));
        if (!config.headers?.['X-IBM-CLIENT-ID'] && !config.headers?.['X-IBM-CLIENT-SECRET']) {
          _.set(config.headers, 'X-IBM-CLIENT-ID', IBM_CLIENT_ID);
          _.set(config.headers, 'X-IBM-CLIENT-SECRET', IBM_CLIENT_SECRET);
        }
      }
      return { ...config };
    },
  ],

  responseInterceptors: [
    (response) => {
      const { data, config } = response as unknown as ResponseStructure;
      // Nếu request failed và không phải mã lỗi token failed
      if (data?.body?.status !== 'OK' && !_.includes(['669', '407'], data?.error?.code)) {
        message.error((data?.error?.desc.toString?.() || 'Có lỗi xảy ra!').slice(0, 280));
      }
      // Nếu request bằng token hết hạn, thực hiện retry
      if (_.includes(['669', '407'], data?.error?.code)) {
        if (retryAccessToken > 2) {
          message.error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!');
          logout();
          retryAccessToken = 0;
          return response;
        }
        retryAccessToken++;
        const refreshToken = Cookies.get('refresh_token') || '';
        if (!refreshToken) return response;
        //Thực hiện lấy access token và retry lại request cũ
        return api.auth
          .refreshToken(refreshToken)
          .then((res) => {
            if (res.body?.status === 'OK') {
              Cookies.set('access_token', res.body?.dataRes?.accessToken);
              Cookies.set('refresh_token', res.body?.dataRes?.refreshToken);
              return request(config.url, { data: JSON.parse(config.data), method: 'post' })
                .then((dataRetry) => {
                  return _.set(response, 'data', dataRetry);
                })
                .catch(() => {
                  return response;
                });
            } else {
              logout();
              return response;
            }
          })
          .catch(() => {
            logout();
            return response;
          }) as unknown as ResponseStructure;
      }
      //Nếu không tồn tại access token ở browser cho logout

      return response;
    },
  ],
};
