// @ts-ignore
/* eslint-disable */
import { bodyBuilder } from '@/utils';
import { RequestData } from '@ant-design/pro-components';
import { request } from '@umijs/max';

type UpdateKBInfoReq = {
  id: string;
  titleKB: string;
  bodyKB: string;
};

type CreateKBReq = Array<{
  titleKB: string;
  bodyKB: string;
}>;

export async function getListKnowledgeBase(
  req: API.ProTableRequest,
  options?: { [key: string]: any },
): Promise<RequestData<any>> {
  const res = await request<API.BaseReponseDatapowerSB>(TICKETING_CORE_URL, {
    method: 'POST',
    data: bodyBuilder(
      'GET_ENQUIRY',
      'getKnowledgeBase',
      {
        ...req,
        params: {
          ...req.params,
          categoryID: 'ticketing_tttn',
          search_value: req.params.keyword || '',
        },
      },
      true,
    ),
    ...(options || {}),
  });

  if (res.body?.status === 'OK') {
    return {
      data: res.body?.CoreKbDatas || [],
      total: res.body?.CoreKbDatas?.[0]?.totalrecord || 0,
      success: true,
    };
  } else {
    return {
      success: false,
      data: [],
    };
  }
}

export async function getListKnowledgeBaseAdmin(
  req: API.ProTableRequest,
  options?: { [key: string]: any },
): Promise<RequestData<any>> {
  const res = await request<API.BaseReponseDatapowerSB>(TICKETING_CORE_URL, {
    method: 'POST',
    data: bodyBuilder(
      'GET_ENQUIRY',
      'getKnowledgeBaseAdmin',
      {
        ...req,
        params: {
          ...req.params,
          categoryID: 'ticketing_tttn',
          search_value: req.params.keyword || '',
        },
      },
      true,
    ),
    ...(options || {}),
  });

  if (res.body?.status === 'OK') {
    return {
      data: res.body?.CoreKbDatas || [],
      total: res.body?.CoreKbDatas?.[0]?.totalrecord || 0,
      success: true,
    };
  } else {
    return {
      success: false,
      data: [],
    };
  }
}

export async function createKB(
  kbInfo: CreateKBReq,
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  return request<API.LoginRes>(TICKETING_CORE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_TRANSACTION', 'createKB', { kbInfo, categoryID: 'ticketing_tttn' }),
    ...(options || {}),
  });
}

export async function deleteKBInfo(
  id: string,
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  return request<API.LoginRes>(TICKETING_CORE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_TRANSACTION', 'deleteKBInfo', { id }),
    ...(options || {}),
  });
}

export async function updateKBInfo(
  { id, titleKB, bodyKB }: UpdateKBInfoReq,
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  return request<API.LoginRes>(TICKETING_CORE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_TRANSACTION', 'updateKBInfo', {
      id,
      titleKB,
      bodyKB,
      categoryID: 'ticketing_tttn',
    }),
    ...(options || {}),
  });
}
