// @ts-ignore
/* eslint-disable */
import { bodyBuilder } from '@/utils';
import { request } from '@umijs/max';

export async function login(
  body: API.LoginReqParams,
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  return request<API.LoginRes>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_TRANSACTION', 'get_token', {
      userName: body.username,
      passWord: body.password,
    }),
    ...(options || {}),
  });
}

export async function accountInfo(
  userId: string,
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  return request<API.LoginRes>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_ENQUIRY', 'get_user_info', { userId }),
    ...(options || {}),
  });
}

export async function refreshToken(
  refreshToken: string,
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  return request<API.LoginRes>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_TRANSACTION', 'refreshToken', { refreshToken }),
    ...(options || {}),
  });
}
