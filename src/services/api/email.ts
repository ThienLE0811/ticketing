// @ts-ignore
/* eslint-disable */
import { bodyBuilder } from '@/utils';
import { RequestData } from '@ant-design/pro-components';
import { request } from '@umijs/max';

export async function getListEmailTemplate(
  req: API.ProTableRequest,
  options?: { [key: string]: any },
): Promise<RequestData<any>> {
  const res = await request<API.BaseReponseDatapowerSB>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_ENQUIRY', 'getListEmailTemplate', req, true),
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
export async function createEmailTemplate(
  req: API.EmailTemplteModel,
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  return request<API.BaseReponseDatapowerSB>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_TRANSACTION', 'createEmailTemplate', { dataReq: req }),
    ...(options || {}),
  });
}

export async function updateEmailTemplate(
  req: API.EmailTemplteModel,
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  return request<API.BaseReponseDatapowerSB>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_TRANSACTION', 'updateEmailTemplate', { dataReq: req }),
    ...(options || {}),
  });
}

export async function deleteEmailTemplate(
  code: string,
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  return request<API.BaseReponseDatapowerSB>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_TRANSACTION', 'delEmailTemplate', { dataReq: { code } }),
    ...(options || {}),
  });
}
