// @ts-ignore
/* eslint-disable */
import { bodyBuilder } from '@/utils';
import { RequestData } from '@ant-design/pro-components';
import { request } from '@umijs/max';

export async function getListTicket(
  req: API.ProTableRequest,
  type:
    | 'getMyTicket'
    | 'getProcessedTicket'
    | 'getListTicket'
    | 'getCancelTicket'
    | 'getDraftTicket'
    | 'getHisTicketByFtFmTrace'
    | 'getHisTicketById'
    | 'getCompleteTicket'
    | 'getPauseTicket'
    | 'getProcessTicket'
    | 'getDashboardTicket',
  options?: { [key: string]: any },
): Promise<RequestData<any>> {
  const res = await request<API.BaseReponseDatapowerSB>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_ENQUIRY', type, req, true),
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

export async function generateTicketId(options?: {
  [key: string]: any;
}): Promise<API.BaseReponseDatapowerSB> {
  return request<API.BaseReponseDatapowerSB>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_ENQUIRY', 'generateTicketId'),
    ...(options || {}),
  });
}

export async function fetchFt(
  ft: string,
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  return request<API.BaseReponseDatapowerSB>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_ENQUIRY', 'fetchFt', { ft }),
    ...(options || {}),
  });
}

export async function fetchFm(
  fm: string,
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  return request<API.BaseReponseDatapowerSB>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_ENQUIRY', 'fetchFm', { fm }),
    ...(options || {}),
  });
}

export async function saveTicket(
  dataReq: API.SaveTicket,
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  return request<API.BaseReponseDatapowerSB>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_TRANSACTION', 'saveTicket', { dataReq }),
    ...(options || {}),
  });
}

export async function getTicketById(
  ticketId: string,
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  return request<API.BaseReponseDatapowerSB>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_ENQUIRY', 'getTicketById', { ticketId }),
    ...(options || {}),
  });
}

export async function saveSendTicket(
  dataReq: API.SaveTicket,
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  return request<API.BaseReponseDatapowerSB>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_TRANSACTION', 'saveSendTicket', { dataReq }),
    ...(options || {}),
  });
}

export async function saveDraftTicket(
  dataReq: API.SaveTicket,
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  return request<API.BaseReponseDatapowerSB>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_TRANSACTION', 'saveDraftTicket', { dataReq }),
    ...(options || {}),
  });
}

export async function getCoreTaskDecisionByTaskId(
  tasUid: string,
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  return request<API.BaseReponseDatapowerSB>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_ENQUIRY', 'getCoreTaskDecisionByTaskId', { tasUid }),
    ...(options || {}),
  });
}

export async function getCoreTaskDecisionByGrpCode(
  grpCode: string,
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  return request<API.BaseReponseDatapowerSB>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_ENQUIRY', 'getCoreTaskDecisionByGrpCode', { grpCode }),
    ...(options || {}),
  });
}

export async function updateFastFeedbackTickets(
  req: API.QuickFeedbackTicket,
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  return request<API.BaseReponseDatapowerSB>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_TRANSACTION', 'updateFastFeedbackTickets', { dataReq: req }),
    ...(options || {}),
  });
}

export async function updateTypeBusinessOfTickets(
  req: API.ChangeTypeBusinessTicket,
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  return request<API.BaseReponseDatapowerSB>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_TRANSACTION', 'updateTypeBusinessOfTickets', { dataReq: req }),
    ...(options || {}),
  });
}

export async function saveListTicket(
  req: API.SaveListTicketReq,
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  return request<API.BaseReponseDatapowerSB>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_TRANSACTION', 'saveListTicket', { dataReq: req }),
    ...(options || {}),
  });
}

export async function getDraftByTicketId(
  id: string,
  options?: { [key: string]: any },
): Promise<API.BaseReponseDatapowerSB> {
  return request<API.BaseReponseDatapowerSB>(TICKETING_BASE_URL, {
    method: 'POST',
    data: bodyBuilder('GET_ENQUIRY', 'getDraftByTicketId', { id }),
    ...(options || {}),
  });
}
