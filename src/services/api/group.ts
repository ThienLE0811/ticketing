// @ts-ignore
/* eslint-disable */
import { bodyBuilder } from '@/utils';
import { RequestData } from '@ant-design/pro-components';
import { request } from '@umijs/max';
import { ReactText } from 'react';

// interface GetListGroupReq extends API.ProTableRequest {
//   params: {
//     status?: string;
//     grpCode?: string;
//   };
// }

export async function getListGroup(
  req?: API.ProTableRequest,
  options?: { [key: string]: any },
): Promise<RequestData<any>> {
  const res = await request<API.LoginRes>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_ENQUIRY', 'getCoreGroup', req, true),
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

export async function getCoreGroupById(
  grpUid: string,
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  return request<API.BaseReponseDatapowerSB>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_ENQUIRY', 'getCoreGroupById', { grpUid }),
    ...(options || {}),
  });
}

export async function getCoreGroupPermissionById(
  grpUid: string,
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  return request<API.BaseReponseDatapowerSB>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_ENQUIRY', 'getCoreGroupPermissionById', { grpUid }),
    ...(options || {}),
  });
}

export async function createCoreGroupPermission(
  req: API.CreateCoreGroupPermission,
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  return request<API.BaseReponseDatapowerSB>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_TRANSACTION', 'createCoreGroupPermission', { data: req }),
    ...(options || {}),
  });
}

export async function updateCoreGroup(
  dataReq: API.UpdateCoreGroup,
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  return request<API.BaseReponseDatapowerSB>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_TRANSACTION', 'updateCoreGroup', { ...dataReq }),
    ...(options || {}),
  });
}
