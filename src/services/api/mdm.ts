import { bodyBuilder } from '@/utils';
import { request } from '@umijs/max';

export async function createMasterData(
  dataReq: API.CreateMasterData,
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  return request<API.BaseReponseDatapowerSB>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_TRANSACTION', 'createMasterData', { dataReq }),
    ...(options || {}),
  });
}

export async function updateMasterData(
  dataReq: API.CreateMasterData,
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  return request<API.BaseReponseDatapowerSB>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_TRANSACTION', 'updateMasterData', { dataReq }),
    ...(options || {}),
  });
}

export async function delMasterData(
  masterId: number,
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  return request<API.BaseReponseDatapowerSB>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_TRANSACTION', 'delMasterData', { masterId }),
    ...(options || {}),
  });
}

export async function getMasterDataByType(
  type: string,
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  return request<API.BaseReponseDatapowerSB>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_ENQUIRY', 'getMasterDataByType', { type }),
    ...(options || {}),
  });
}

export async function getMasterDataType(options?: {
  [key: string]: any;
}): Promise<API.BaseReponseDatapowerSB> {
  return request<API.BaseReponseDatapowerSB>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_ENQUIRY', 'getAllTypeMasterData'),
    ...(options || {}),
  });
}
