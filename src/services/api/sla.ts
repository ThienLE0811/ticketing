// @ts-ignore
/* eslint-disable */
import { bodyBuilder } from '@/utils';
import { RequestData } from '@ant-design/pro-components';
import { request } from '@umijs/max';

export async function getListSla(
  req: API.ProTableRequest,
  options?: { [key: string]: any },
): Promise<RequestData<any>> {
  const res = await request<API.LoginRes>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_ENQUIRY', 'getTTTNSla', req, true),
    ...(options || {}),
  });

  if (res.body?.status === 'OK') {
    return {
      data: res.body?.dataRes?.rows || [],
      total: res.body?.dataRes?.totalRecord || 0,
      success: true,
    };
  } else {
    return {
      success: false,
      data: [],
    };
  }
}

export async function createSla(
  req: API.CreateSla,
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  return request<API.BaseReponseDatapowerSB>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_TRANSACTION', 'createdTTTNSla', req),
    ...(options || {}),
  });
}

export async function updateSla(
  req: API.CreateSla,
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  return request<API.BaseReponseDatapowerSB>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_TRANSACTION', 'updateTTTNSla', req),
    ...(options || {}),
  });
}
