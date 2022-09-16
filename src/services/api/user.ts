// @ts-ignore
/* eslint-disable */
import { bodyBuilder } from '@/utils';
import { RequestData } from '@ant-design/pro-table';
import { request } from '@umijs/max';

export async function getListUser(
  req: API.ProTableRequest,
  options?: { [key: string]: any },
): Promise<RequestData<any>> {
  const res = await request<API.BaseReponseDatapowerSB>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_ENQUIRY', 'getUsers', req, true),
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
//getUserDashboard
export async function getListUserByTypeBusiness(
  typeBusiness: string,
  searchValue?: string,
  options?: { [key: string]: any },
): Promise<RequestData<any>> {
  console.log({ typeBusiness, searchValue });

  const res = await request<API.BaseReponseDatapowerSB>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder(
      'GET_ENQUIRY',
      'getUserDashboard',
      { params: { keyword: searchValue, typeBusiness, pageSize: 20, current: 1 }, sort: {} },
      true,
    ),
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

export async function createUser(
  req: API.CreateUserReqParams,
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  return request<API.BaseReponseDatapowerSB>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_TRANSACTION', 'createUser', { dataReq: req }),
    ...(options || {}),
  });
}

export async function updateUser(
  req: API.CreateUserReqParams,
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  return request<API.BaseReponseDatapowerSB>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_TRANSACTION', 'updateUser', { dataReq: req }),
    ...(options || {}),
  });
}

export async function fetchUserLdap(
  userName: string,
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  return request<API.BaseReponseDatapowerSB>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_ENQUIRY', 'fetchUserLdap', { userName }),
    ...(options || {}),
  });
}

export async function getUserById(
  userId: string,
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  return request<API.BaseReponseDatapowerSB>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_ENQUIRY', 'getUserById', { usrUid: userId }),
    ...(options || {}),
  });
}

export async function updateStatusUser(
  req: { userId: string; status: 'ACTIVE' | 'INACTIVE' },
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  const { userId, status } = req;
  return request<API.BaseReponseDatapowerSB>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_TRANSACTION', 'inActiveUser', {
      usrUid: userId,
      usrStatus: status,
    }),

    ...(options || {}),
  });
}
